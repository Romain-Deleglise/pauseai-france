import { json, type RequestHandler } from '@sveltejs/kit'
import { createSign, createVerify } from 'crypto'

import { env as privateEnv } from '$env/dynamic/private'

// Clé publique RSA de Wise pour vérifier les signatures des webhooks
// Source : https://api-docs.transferwise.com/#webhook-events-webhook-handlers
const WISE_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvO8vXV+JksBzZAY6GhSO
XdoTCfhXaaiZ+qAbtaDBiu2AGkGVpmEygFmWP4Li9m5+Ni85BhVvZOodM9epgW3F
bA5Q1SexvAF1PPjX4JpMstak/QhAgl1qMSqEevL8cmUeTgcMuVWCJmlge9h7B1CS
D4rtlimGZozG39rUBDg6Qt2K+P4wBfLblL0k4C4YUdLnpGYEDIth+i8XsRpFlogx
CAFyH9+knYsDbR43UJ9shtc42Ybd40Afihj8KnYKXzchyQ42aC8aZ/h5hyZ28yVy
Oj3Vos0VdBIs/gAyJ/4yyQFCXYte64I7ssrlbGRaco4nKF3HmaNhxwyKyJafz19e
HwIDAQAB
-----END PUBLIC KEY-----`

interface WiseBalanceEvent {
	event_type: string
	subscription_id: string
	schema_version: string
	sent_at: string
	data: {
		resource: { id: number; profile_id: number; type: string }
		amount: number
		balance_id: number
		currency: string
		transaction_type: string
		transfer_reference?: string
		occurred_at: string
		channel_name?: string
	}
}

interface WiseTransaction {
	type: string
	date: string
	amount: { value: number; currency: string }
	details: {
		description?: string
		paymentReference?: string
		senderName?: string
	}
	referenceNumber?: string
}

interface WiseStatement {
	transactions: WiseTransaction[]
}

interface Api4Result<T = Record<string, unknown>> {
	count?: number
	values?: T[]
	error_message?: string
}

interface ContributionRecord {
	id: number
	total_amount: number
}

// Appel API Wise avec gestion SCA automatique (même logique que wise-bank-transfer-sync.sh)
async function wiseApiGet(url: string): Promise<unknown> {
	const token = privateEnv.WISE_API_TOKEN
	if (!token) throw new Error('WISE_API_TOKEN non configuré')

	// 1ère requête
	const res1 = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })

	if (res1.ok) return res1.json()

	if (res1.status === 403) {
		// SCA : signer l'OTT avec la clé privée
		const ott = res1.headers.get('x-2fa-approval')
		if (!ott) throw new Error('403 Wise sans OTT — vérifier les permissions du token')

		const scaKey = privateEnv.WISE_SCA_PRIVATE_KEY
		if (!scaKey) throw new Error('WISE_SCA_PRIVATE_KEY non configuré')

		const signature = createSign('SHA256').update(ott).sign(scaKey, 'base64')

		const res2 = await fetch(url, {
			headers: {
				Authorization: `Bearer ${token}`,
				'x-2fa-approval': ott,
				'X-Signature': signature
			}
		})

		if (res2.ok) return res2.json()
		const body = await res2.text()
		throw new Error(`Wise API SCA HTTP ${res2.status}: ${body.substring(0, 200)}`)
	}

	const body = await res1.text()
	throw new Error(`Wise API HTTP ${res1.status}: ${body.substring(0, 200)}`)
}

// Récupère les transactions Wise autour d'une date donnée et cherche DON-XXXXXX
async function findDonReference(
	profileId: number,
	balanceId: number,
	occurredAt: string
): Promise<string | null> {
	const t = new Date(occurredAt)
	const from = new Date(t.getTime() - 10 * 60 * 1000).toISOString() // -10 min
	const to = new Date(t.getTime() + 2 * 60 * 1000).toISOString() // +2 min

	const url = `https://api.wise.com/v1/profiles/${profileId}/balance-statements/${balanceId}/statement.json?currency=EUR&intervalStart=${encodeURIComponent(from)}&intervalEnd=${encodeURIComponent(to)}&type=COMPACT`

	const statement = (await wiseApiGet(url)) as WiseStatement
	const transactions = statement?.transactions ?? []

	console.log(`[wise-webhook] ${transactions.length} transaction(s) dans la fenêtre ±10min`)

	for (const tx of transactions) {
		if (tx.type !== 'CREDIT') continue
		const combined = [
			tx.details?.description ?? '',
			tx.details?.paymentReference ?? '',
			tx.referenceNumber ?? ''
		].join(' ')
		console.log(
			`[wise-webhook] tx CREDIT: description="${tx.details?.description}" paymentRef="${tx.details?.paymentReference}" refNumber="${tx.referenceNumber}"`
		)
		const match = combined.match(/DON-[A-Z0-9]{6}/)
		if (match) return match[0]
	}

	return null
}

async function callApi4<T = Record<string, unknown>>(
	entity: string,
	action: string,
	params: Record<string, unknown> = {}
): Promise<Api4Result<T>> {
	const base = (privateEnv.CIVICRM_BASE_URL || '').replace(/\/+$/, '')
	const apiKey = privateEnv.CIVICRM_API_KEY || ''
	const siteKey = (privateEnv.CIVICRM_SITE_KEY || '').trim()
	if (!base || !apiKey || !siteKey) throw new Error('Missing CiviCRM configuration')

	const url = `${base}/civicrm/ajax/api4/${encodeURIComponent(entity)}/${encodeURIComponent(action)}`
	const headers: Record<string, string> = {
		'X-Requested-With': 'XMLHttpRequest',
		Accept: 'application/json',
		Authorization: `Bearer ${apiKey}`,
		'X-Civi-Auth': `Bearer ${apiKey}`,
		'X-Civi-Key': siteKey,
		'Content-Type': 'application/x-www-form-urlencoded'
	}

	const body = new URLSearchParams({ params: JSON.stringify(params) }).toString()
	const response = await fetch(url, { method: 'POST', headers, body })
	if (!response.ok) {
		let bodyText = ''
		try {
			bodyText = await response.text()
		} catch {
			// ignore
		}
		throw new Error(`${entity}.${action} HTTP ${response.status}: ${bodyText.substring(0, 200)}`)
	}
	const data = (await response.json()) as Api4Result<T>
	if (data.error_message) throw new Error(data.error_message)
	return data
}

// Wise effectue une requête GET pour valider l'URL lors de la création du webhook
export const GET: RequestHandler = async () => {
	return json({ ok: true })
}

export const POST: RequestHandler = async ({ request }) => {
	// Lire le body brut — nécessaire pour vérifier la signature RSA
	const rawBody = await request.text()

	// 1. Vérifier la signature Wise
	const signature = request.headers.get('x-signature-sha256')
	if (!signature) {
		console.warn('[wise-webhook] En-tête X-Signature-SHA256 manquant')
		return json({ error: 'Missing signature' }, { status: 401 })
	}

	try {
		const verify = createVerify('RSA-SHA256')
		verify.update(rawBody)
		const isValid = verify.verify(WISE_PUBLIC_KEY, signature, 'base64')
		if (!isValid) {
			console.warn('[wise-webhook] Signature invalide')
			return json({ error: 'Invalid signature' }, { status: 401 })
		}
	} catch (e) {
		console.error('[wise-webhook] Erreur vérification signature:', e)
		return json({ error: 'Signature verification failed' }, { status: 401 })
	}

	// 2. Parser le payload
	let event: WiseBalanceEvent
	try {
		event = JSON.parse(rawBody) as WiseBalanceEvent
	} catch {
		return json({ error: 'Invalid JSON' }, { status: 400 })
	}

	// 3. Ne traiter que les crédits EUR
	if (event.event_type !== 'balances#update' && event.event_type !== 'balances#credit') {
		return json({ ok: true })
	}
	if (event.data?.transaction_type !== 'credit' || event.data?.currency !== 'EUR') {
		return json({ ok: true })
	}

	console.log(
		`[wise-webhook] Crédit reçu: ${event.data.amount}€ via ${event.data.channel_name ?? 'N/A'}`
	)

	// 4. Chercher la référence DON-XXXXXX via l'API Wise balance-statements
	let reference: string | null = null
	try {
		reference = await findDonReference(
			event.data.resource.profile_id,
			event.data.balance_id,
			event.data.occurred_at
		)
	} catch (e) {
		console.error('[wise-webhook] Erreur appel API Wise statements:', e)
		// Ne pas bloquer — retourner 500 pour que Wise réessaie
		return json({ error: 'Wise API error' }, { status: 500 })
	}

	if (!reference) {
		console.log(
			`[wise-webhook] Virement sans référence DON (${event.data.amount}€) — aucune action`
		)
		return json({ ok: true })
	}

	console.log(`[wise-webhook] Référence trouvée: ${reference} (${event.data.amount}€)`)

	// 5. Trouver et mettre à jour la contribution CiviCRM
	try {
		const findResult = await callApi4<ContributionRecord>('Contribution', 'get', {
			select: ['id', 'total_amount'],
			where: [
				['trxn_id', '=', reference],
				['contribution_status_id:name', '=', 'Pending']
			],
			limit: 1
		})

		if (!findResult.count || !findResult.values?.length) {
			console.log(
				`[wise-webhook] Aucune contribution Pending pour ${reference} (peut-être déjà complétée)`
			)
			return json({ ok: true })
		}

		const contrib = findResult.values[0]
		const receiveDate =
			event.data.occurred_at?.split('T')[0] ?? new Date().toISOString().split('T')[0]

		if (event.data.amount !== contrib.total_amount) {
			console.warn(
				`[wise-webhook] Montant différent pour ${reference}: reçu=${event.data.amount}€ attendu=${contrib.total_amount}€ (frais ?)`
			)
		}

		await callApi4('Contribution', 'update', {
			where: [['id', '=', contrib.id]],
			values: {
				'contribution_status_id:name': 'Completed',
				receive_date: receiveDate
			}
		})

		console.log(`[wise-webhook] ✓ Contribution ${contrib.id} (${reference}) → Completed`)
	} catch (e) {
		console.error('[wise-webhook] Erreur CiviCRM:', e)
		return json({ error: 'CiviCRM error' }, { status: 500 })
	}

	return json({ ok: true })
}
