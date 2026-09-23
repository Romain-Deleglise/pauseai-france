import { json, type RequestHandler } from '@sveltejs/kit'

import { env as privateEnv } from '$env/dynamic/private'

// Déclaration PauseAI (page /fr/declaration).
//
// Les signatures sont recueillies par NOTRE formulaire, en français, et
// stockées dans NOTRE CiviCRM : la page continue de fonctionner quoi qu'il
// arrive au site de PauseAI Global.
//   - CIVICRM_DECLARATION_GROUP_ID : tous les signataires.
//   - CIVICRM_DECLARATION_PUBLIC_GROUP_ID : ceux qui acceptent que leur nom
//     soit affiché. Retirer quelqu'un de ce groupe le masque de la page
//     (modération), le retirer du premier groupe annule sa signature.
// Le nom affiché est le prénom + nom du contact, la ligne sous le nom est son
// champ standard « Fonction » (job_title).
//
// Le total mondial de pauseai.info n'est qu'un bonus d'affichage : s'il est
// injoignable, on renvoie la dernière valeur connue, sinon rien.
export const prerender = false

const GLOBAL_SIGNATORIES_URL = 'https://pauseai.info/api/signatories'
const WEBSITE_SIGNUP_ACTIVITY_ID = 75
const MAX_PUBLIC = 500

interface Api4Result<T = Record<string, unknown>> {
	count?: number
	countMatched?: number
	values?: T[]
	error_message?: string
}

async function callApi4<T = Record<string, unknown>>(
	entity: string,
	action: string,
	params: Record<string, unknown> = {}
): Promise<Api4Result<T>> {
	const base = (privateEnv.CIVICRM_BASE_URL || '').replace(/\/+$/, '')
	const apiKey = privateEnv.CIVICRM_API_KEY || ''
	const siteKey = (privateEnv.CIVICRM_SITE_KEY || '').trim()
	if (!base || !apiKey || !siteKey) throw new Error('Missing required CiviCRM configuration')

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
	if (!response.ok) throw new Error(`HTTP ${response.status.toString()}: ${response.statusText}`)
	const data = (await response.json()) as Api4Result<T>
	if (data.error_message) throw new Error(data.error_message)
	return data
}

function groupId(name: string): number {
	const id = Number(privateEnv[name])
	if (!Number.isFinite(id) || id <= 0) throw new Error(`Missing ${name}`)
	return id
}

// ── Lecture : compteur et liste publique ────────────────────────────────

export interface DeclarationSignatory {
	name: string
	title?: string
}

export interface DeclarationStats {
	/** Signatures recueillies sur pauseia.fr. */
	count: number
	/** Signataires qui acceptent d'être affichés, du plus récent au plus ancien. */
	signatories: DeclarationSignatory[]
	/** Total de pauseai.info (null s'il n'a jamais pu être récupéré). */
	globalCount: number | null
}

// Dernière valeur connue du total mondial, conservée tant que la fonction
// reste chaude : un incident passager chez Global ne fait pas disparaître le
// chiffre.
let lastGlobalCount: number | null = null

async function fetchGlobalCount(fetchFn: typeof fetch): Promise<number | null> {
	try {
		const controller = new AbortController()
		const timer = setTimeout(() => {
			controller.abort()
		}, 4000)
		const res = await fetchFn(GLOBAL_SIGNATORIES_URL, { signal: controller.signal })
		clearTimeout(timer)
		if (!res.ok) throw new Error(`HTTP ${res.status}`)
		const data = (await res.json()) as { totalCount?: unknown }
		// Leur API renvoie 0 quand leur Airtable est injoignable : on l'ignore.
		if (typeof data.totalCount === 'number' && data.totalCount > 0) {
			lastGlobalCount = data.totalCount
		}
	} catch (e) {
		console.warn('[declaration] total mondial indisponible (ignoré) :', e)
	}
	return lastGlobalCount
}

async function fetchLocalStats(): Promise<Omit<DeclarationStats, 'globalCount'>> {
	const allGroup = groupId('CIVICRM_DECLARATION_GROUP_ID')
	const publicGroup = groupId('CIVICRM_DECLARATION_PUBLIC_GROUP_ID')

	const [all, pub] = await Promise.all([
		callApi4('GroupContact', 'get', {
			checkPermissions: false,
			select: ['row_count'],
			where: [
				['group_id', '=', allGroup],
				['status', '=', 'Added'],
				['contact_id.is_deleted', '=', false]
			]
		}),
		callApi4<{
			'contact_id.first_name'?: string
			'contact_id.last_name'?: string
			'contact_id.job_title'?: string
		}>('GroupContact', 'get', {
			checkPermissions: false,
			select: ['contact_id.first_name', 'contact_id.last_name', 'contact_id.job_title'],
			where: [
				['group_id', '=', publicGroup],
				['status', '=', 'Added'],
				['contact_id.is_deleted', '=', false]
			],
			orderBy: { id: 'DESC' },
			limit: MAX_PUBLIC
		})
	])

	const signatories = (pub.values ?? [])
		.map((v) => ({
			name: [v['contact_id.first_name'], v['contact_id.last_name']]
				.filter(Boolean)
				.join(' ')
				.trim(),
			title: v['contact_id.job_title']?.trim() || undefined
		}))
		.filter((s) => s.name)

	return { count: all.count ?? all.countMatched ?? 0, signatories }
}

export const GET: RequestHandler = async ({ fetch, setHeaders }) => {
	const [local, globalCount] = await Promise.all([
		fetchLocalStats().catch((e: unknown) => {
			console.error('[declaration] lecture CiviCRM impossible :', e)
			return null
		}),
		fetchGlobalCount(fetch)
	])
	if (!local) return json({ error: 'unavailable' }, { status: 502 })

	setHeaders({ 'cache-control': 'public, max-age=60, s-maxage=300' })
	const body: DeclarationStats = { ...local, globalCount }
	return json(body)
}

// ── Écriture : signer la déclaration ────────────────────────────────────

interface SignRequest {
	firstName?: string
	lastName?: string
	email?: string
	title?: string
	showName?: boolean
	newsletter?: boolean
	/** Champ piège invisible : rempli uniquement par les robots. */
	website?: string
}

const clean = (s: unknown, max: number) =>
	typeof s === 'string' ? s.replace(/\s+/g, ' ').trim().slice(0, max) : ''

async function findOrCreateContact(
	email: string,
	firstName: string,
	lastName: string
): Promise<{ id: number; created: boolean }> {
	const found = await callApi4<{ id: number; contact_id: number | null }>('Email', 'get', {
		checkPermissions: false,
		select: ['id', 'contact_id'],
		where: [
			['email', '=', email],
			['contact_id.is_deleted', '=', false]
		],
		orderBy: { is_primary: 'DESC', id: 'ASC' },
		limit: 1
	})
	const existing = found.values?.[0]
	if (existing?.contact_id) return { id: Number(existing.contact_id), created: false }

	const created = await callApi4<{ id: number }>('Contact', 'create', {
		checkPermissions: false,
		values: {
			contact_type: 'Individual',
			first_name: firstName,
			last_name: lastName,
			source: 'pauseia.fr/declaration',
			contact_sub_type: ['Sympathisant']
		}
	})
	const id = created.values?.[0]?.id
	if (!id) throw new Error('Failed to create contact')
	await callApi4('Email', 'create', {
		checkPermissions: false,
		values: {
			contact_id: id,
			email,
			is_primary: true,
			'location_type_id:label': 'Domicile'
		}
	})
	return { id: Number(id), created: true }
}

export const POST: RequestHandler = async ({ request }) => {
	let data: SignRequest
	try {
		data = (await request.json()) as SignRequest
	} catch {
		return json({ error: 'Requête invalide' }, { status: 400 })
	}

	// Robot : on fait semblant d'accepter, sans rien enregistrer.
	if (data.website) return json({ success: true })

	const firstName = clean(data.firstName, 64)
	const lastName = clean(data.lastName, 64)
	const email = clean(data.email, 254).toLowerCase()
	const title = clean(data.title, 120)

	if (!firstName || !lastName) {
		return json({ error: 'Merci d’indiquer votre prénom et votre nom.' }, { status: 400 })
	}
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		return json({ error: 'Adresse e-mail invalide.' }, { status: 400 })
	}

	try {
		const allGroup = groupId('CIVICRM_DECLARATION_GROUP_ID')
		const publicGroup = groupId('CIVICRM_DECLARATION_PUBLIC_GROUP_ID')

		const contact = await findOrCreateContact(email, firstName, lastName)

		// Contact existant : on ne remplace pas un nom déjà connu (le formulaire
		// n'est pas authentifié), on complète seulement ce qui manque.
		if (!contact.created || title) {
			const current = await callApi4<{
				first_name?: string
				last_name?: string
				job_title?: string
			}>('Contact', 'get', {
				checkPermissions: false,
				select: ['first_name', 'last_name', 'job_title'],
				where: [['id', '=', contact.id]],
				limit: 1
			})
			const c = current.values?.[0] ?? {}
			const values: Record<string, unknown> = {}
			if (!c.first_name) values.first_name = firstName
			if (!c.last_name) values.last_name = lastName
			if (title && !c.job_title) values.job_title = title
			if (Object.keys(values).length) {
				await callApi4('Contact', 'update', {
					checkPermissions: false,
					values,
					where: [['id', '=', contact.id]]
				})
			}
		}

		const already = await callApi4('GroupContact', 'get', {
			checkPermissions: false,
			select: ['id'],
			where: [
				['contact_id', '=', contact.id],
				['group_id', '=', allGroup],
				['status', '=', 'Added']
			],
			limit: 1
		})
		const alreadySigned = Boolean(already.values?.length)

		const groups = [allGroup]
		if (data.showName) groups.push(publicGroup)
		if (data.newsletter) {
			const newsletter = Number(privateEnv.CIVICRM_NEWSLETTER_GROUP_ID)
			const callToAction = Number(privateEnv.CIVICRM_CALL_TO_ACTION_GROUP_ID)
			if (Number.isFinite(newsletter) && newsletter > 0) groups.push(newsletter)
			if (Number.isFinite(callToAction) && callToAction > 0) groups.push(callToAction)
		}
		await callApi4('GroupContact', 'save', {
			checkPermissions: false,
			match: ['contact_id', 'group_id'],
			records: groups.map((group_id) => ({
				contact_id: contact.id,
				group_id,
				status: 'Added'
			}))
		})

		if (!alreadySigned) {
			try {
				await callApi4('Activity', 'create', {
					checkPermissions: false,
					values: {
						activity_type_id: WEBSITE_SIGNUP_ACTIVITY_ID,
						subject: `Signature déclaration PauseAI${data.newsletter ? ' + Newsletter' : ''}`,
						source_contact_id: Number(privateEnv.CIVICRM_NEWSLETTER_API_CONTACT_ID || ''),
						target_contact_id: [contact.id],
						'status_id:name': 'Completed'
					}
				})
			} catch (e) {
				console.warn('[declaration] journalisation de l’activité impossible (ignoré) :', e)
			}
		}

		return json({ success: true, alreadySigned })
	} catch (e) {
		console.error('[declaration] signature impossible :', e)
		return json(
			{ error: 'La signature n’a pas pu être enregistrée. Merci de réessayer plus tard.' },
			{ status: 500 }
		)
	}
}
