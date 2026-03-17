import { json, type RequestHandler } from '@sveltejs/kit'
import { createVerify } from 'crypto'

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
		// Référence du virement — peut contenir la référence DON-XXXXXX du donateur
		// Champ disponible selon le schéma v3 de Wise pour les virements entrants SEPA
		transfer_reference?: string
		occurred_at: string
		channel_name?: string
	}
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

	// 3. Ne traiter que les crédits EUR (balances#update ou balances#credit selon l'abonnement)
	if (event.event_type !== 'balances#update' && event.event_type !== 'balances#credit') {
		return json({ ok: true })
	}
	if (event.data?.transaction_type !== 'credit' || event.data?.currency !== 'EUR') {
		return json({ ok: true })
	}

	// Log complet pour déboguer la structure réelle du payload lors des premiers virements
	console.log(
		`[wise-webhook] Crédit reçu: ${event.data.amount}€ via ${event.data.channel_name ?? 'N/A'} - transfer_reference="${event.data.transfer_reference ?? ''}"`
	)

	// 4. Chercher la référence DON-XXXXXX dans transfer_reference
	const transferRef = event.data?.transfer_reference ?? ''
	const reference = transferRef.match(/DON-[A-Z0-9]{6}/)?.[0]

	if (!reference) {
		console.log(
			`[wise-webhook] Virement sans référence DON (${event.data.amount}€, ref="${transferRef}") — aucune action`
		)
		// Retourner 200 pour que Wise ne réessaie pas
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
		// Retourner 500 pour que Wise réessaie le webhook
		return json({ error: 'CiviCRM error' }, { status: 500 })
	}

	return json({ ok: true })
}
