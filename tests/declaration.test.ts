import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { RequestEvent } from '@sveltejs/kit'
import type { DeclarationStats } from '../src/routes/api/declaration/+server'

// Faux CiviCRM et faux pauseai.info : on intercepte fetch et on rejoue des
// réponses API4 selon l'entité et l'action appelées.
vi.mock('$env/dynamic/private', () => ({
	env: {
		CIVICRM_BASE_URL: 'https://civicrm.test',
		CIVICRM_API_KEY: 'key',
		CIVICRM_SITE_KEY: 'site',
		CIVICRM_NEWSLETTER_GROUP_ID: '3',
		CIVICRM_CALL_TO_ACTION_GROUP_ID: '22',
		CIVICRM_NEWSLETTER_API_CONTACT_ID: '1'
	}
}))

type Handler = (params: Record<string, unknown>) => unknown
interface Call {
	entity: string
	action: string
	params: Record<string, unknown>
}

let calls: Call[] = []
let civi: Record<string, Handler> = {}
let globalResponse: () => Response

function installFetch() {
	const fake = vi.fn((input: string | URL | Request, init?: RequestInit) => {
		const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
		if (url.startsWith('https://pauseai.info/')) return Promise.resolve(globalResponse())
		const m = /\/civicrm\/ajax\/api4\/([^/]+)\/([^/?]+)/.exec(url)
		if (!m) return Promise.reject(new Error(`unexpected fetch ${url}`))
		return Promise.resolve(m).then(async ([, entity, action]) => {
			const body = new URLSearchParams(String(init?.body ?? ''))
			const params = JSON.parse(body.get('params') ?? '{}') as Record<string, unknown>
			calls.push({ entity, action, params })
			const handler = civi[`${entity}.${action}`] as Handler | undefined
			if (!handler) return Response.json({ values: [] })
			return Response.json(await handler(params))
		})
	})
	vi.stubGlobal('fetch', fake)
	return fake
}

const post = async (body: Record<string, unknown>) => {
	const { POST } = await import('../src/routes/api/declaration/+server')
	const request = new Request('https://pauseia.fr/api/declaration', {
		method: 'POST',
		body: JSON.stringify(body)
	})
	const res = await POST({ request } as unknown as RequestEvent)
	return { status: res.status, body: (await res.json()) as Record<string, unknown> }
}

const get = async () => {
	const { GET } = await import('../src/routes/api/declaration/+server')
	const headers: Record<string, string> = {}
	const res = await GET({
		fetch,
		setHeaders: (h: Record<string, string>) => Object.assign(headers, h)
	} as unknown as RequestEvent)
	return { body: (await res.json()) as DeclarationStats, headers }
}

const groupSave = () => calls.find((c) => c.entity === 'GroupContact' && c.action === 'save')
const savedGroups = () =>
	(groupSave()?.params.records as { group_id: number }[] | undefined)?.map((r) => r.group_id)

const globalOk = () =>
	Response.json({
		totalCount: 2500,
		signatories: [
			{ name: 'Old One', country: 'France', date: '2025-01-01', private: false },
			{ name: 'Anonymous', country: 'Germany', date: '2025-02-01', private: true },
			{ name: 'Jane Doe', country: 'United States', bio: 'Researcher', date: '2025-06-01' },
			{ name: 'Marie Curie', country: 'France', date: '2025-05-01', private: false }
		]
	})

beforeEach(() => {
	vi.resetModules()
	calls = []
	civi = {}
	globalResponse = globalOk
	installFetch()
})
afterEach(() => {
	vi.unstubAllGlobals()
})

describe('POST /api/declaration (signature)', () => {
	it('crée un nouveau contact et l’ajoute aux groupes 73 et 74', async () => {
		civi['Email.get'] = () => ({ values: [] })
		civi['Contact.create'] = () => ({ values: [{ id: 42 }] })
		civi['Contact.get'] = () => ({ values: [{ first_name: 'Ada', last_name: 'Lovelace' }] })

		const res = await post({
			firstName: ' Ada ',
			lastName: 'Lovelace',
			email: 'ADA@example.org',
			title: 'Mathématicienne',
			showName: true
		})

		expect(res.status).toBe(200)
		expect(res.body).toMatchObject({ success: true, alreadySigned: false, listed: true })
		const created = calls.find((c) => c.entity === 'Contact' && c.action === 'create')
		expect(created?.params.values).toMatchObject({ first_name: 'Ada', last_name: 'Lovelace' })
		const email = calls.find((c) => c.entity === 'Email' && c.action === 'create')
		expect(email?.params.values).toMatchObject({ contact_id: 42, email: 'ada@example.org' })
		expect(savedGroups()).toEqual([73, 74])
		expect(calls.some((c) => c.entity === 'Activity' && c.action === 'create')).toBe(true)
	})

	it('sans case « afficher mon nom » : groupe 73 seulement', async () => {
		civi['Email.get'] = () => ({ values: [{ id: 1, contact_id: 7 }] })
		civi['Contact.get'] = () => ({ values: [{ first_name: 'Ada', last_name: 'Lovelace' }] })
		const res = await post({ firstName: 'Ada', lastName: 'Lovelace', email: 'a@b.fr' })
		expect(res.body).toMatchObject({ success: true, listed: false })
		expect(savedGroups()).toEqual([73])
	})

	it('newsletter cochée : ajoute aussi Newsletter (3) et Call to Action (22)', async () => {
		civi['Email.get'] = () => ({ values: [{ id: 1, contact_id: 7 }] })
		civi['Contact.get'] = () => ({ values: [{ first_name: 'Ada', last_name: 'Lovelace' }] })
		await post({ firstName: 'Ada', lastName: 'Lovelace', email: 'a@b.fr', newsletter: true })
		expect(savedGroups()).toEqual([73, 3, 22])
	})

	it('contact existant avec un autre nom : ne publie pas et n’écrase pas le nom', async () => {
		civi['Email.get'] = () => ({ values: [{ id: 1, contact_id: 7 }] })
		civi['Contact.get'] = () => ({ values: [{ first_name: 'Jean', last_name: 'Dupont' }] })
		const res = await post({
			firstName: 'Usurpateur',
			lastName: 'X',
			email: 'jean@dupont.fr',
			showName: true
		})
		expect(res.body).toMatchObject({ success: true, listed: false })
		expect(savedGroups()).toEqual([73])
		expect(calls.some((c) => c.entity === 'Contact' && c.action === 'update')).toBe(false)
	})

	it('contact existant : nom identique aux accents et à la casse près → publié', async () => {
		civi['Email.get'] = () => ({ values: [{ id: 1, contact_id: 7 }] })
		civi['Contact.get'] = () => ({ values: [{ first_name: 'Hélène', last_name: 'Le Bris' }] })
		const res = await post({
			firstName: 'helene',
			lastName: 'LE BRIS',
			email: 'h@b.fr',
			showName: true
		})
		expect(res.body).toMatchObject({ listed: true })
		expect(savedGroups()).toEqual([73, 74])
	})

	it('contact existant sans nom (abonné newsletter) : complète le nom et le titre', async () => {
		civi['Email.get'] = () => ({ values: [{ id: 1, contact_id: 7 }] })
		civi['Contact.get'] = () => ({
			values: [{ first_name: null, last_name: null, job_title: null }]
		})
		const res = await post({
			firstName: 'Ada',
			lastName: 'Lovelace',
			email: 'a@b.fr',
			title: 'Députée',
			showName: true
		})
		expect(res.body).toMatchObject({ listed: true })
		const update = calls.find((c) => c.entity === 'Contact' && c.action === 'update')
		expect(update?.params.values).toEqual({
			first_name: 'Ada',
			last_name: 'Lovelace',
			job_title: 'Députée'
		})
	})

	it('déjà signataire : alreadySigned, pas de nouvelle activité', async () => {
		civi['Email.get'] = () => ({ values: [{ id: 1, contact_id: 7 }] })
		civi['Contact.get'] = () => ({ values: [{ first_name: 'Ada', last_name: 'Lovelace' }] })
		civi['GroupContact.get'] = () => ({ values: [{ id: 99 }] })
		const res = await post({ firstName: 'Ada', lastName: 'Lovelace', email: 'a@b.fr' })
		expect(res.body).toMatchObject({ success: true, alreadySigned: true })
		expect(calls.some((c) => c.entity === 'Activity')).toBe(false)
	})

	it('champ piège rempli : répond OK sans rien enregistrer', async () => {
		const res = await post({
			firstName: 'Bot',
			lastName: 'Bot',
			email: 'bot@spam.com',
			website: 'http://spam'
		})
		expect(res.body).toMatchObject({ success: true })
		expect(calls).toHaveLength(0)
	})

	it.each([
		[{ firstName: '', lastName: 'X', email: 'a@b.fr' }],
		[{ firstName: 'A', lastName: '  ', email: 'a@b.fr' }],
		[{ firstName: 'A', lastName: 'B', email: 'pas-un-email' }]
	])('refuse les données invalides %#', async (body) => {
		const res = await post(body)
		expect(res.status).toBe(400)
		expect(calls).toHaveLength(0)
	})

	it('CiviCRM en panne : erreur 500 avec message en français', async () => {
		civi['Email.get'] = () => ({ error_message: 'DB down' })
		const res = await post({ firstName: 'A', lastName: 'B', email: 'a@b.fr' })
		expect(res.status).toBe(500)
		expect(String(res.body.error)).toMatch(/réessayer/)
	})
})

describe('GET /api/declaration (compteur et listes)', () => {
	beforeEach(() => {
		civi['GroupContact.get'] = (p) => {
			const where = p.where as unknown[][]
			const group = where.find((w) => w[0] === 'group_id')?.[2]
			if (group === 73) return { count: 5, values: [] }
			return {
				values: [
					{
						'contact_id.first_name': 'Ada',
						'contact_id.last_name': 'Lovelace',
						'contact_id.job_title': 'Députée'
					},
					{ 'contact_id.first_name': null, 'contact_id.last_name': null }
				]
			}
		}
	})

	it('renvoie nos signataires et ceux de Global (anonymes exclus, plus récents d’abord)', async () => {
		const { body, headers } = await get()
		expect(body.local).toEqual({
			count: 5,
			signatories: [{ name: 'Ada Lovelace', title: 'Députée' }]
		})
		expect(body.global?.totalCount).toBe(2500)
		expect(body.global?.signatories.map((s) => s.name)).toEqual([
			'Jane Doe',
			'Marie Curie',
			'Old One'
		])
		expect(headers['cache-control']).toMatch(/s-maxage/)
	})

	it('Global en panne : nos signataires restent disponibles, sans mise en cache', async () => {
		globalResponse = () => new Response('oops', { status: 500 })
		const { body, headers } = await get()
		expect(body.local?.count).toBe(5)
		expect(body.global).toBeNull()
		expect(headers['cache-control']).toBe('no-store')
	})

	it('Global renvoie un total à 0 (leur Airtable en panne) : ignoré', async () => {
		globalResponse = () => Response.json({ totalCount: 0, signatories: [] })
		const { body } = await get()
		expect(body.global).toBeNull()
	})

	it('Global tombe après un premier succès : on garde la dernière liste connue', async () => {
		await get()
		globalResponse = () => new Response('oops', { status: 503 })
		const { GET } = await import('../src/routes/api/declaration/+server')
		const res = await GET({ fetch, setHeaders: () => undefined } as unknown as RequestEvent)
		const body = (await res.json()) as { global: { totalCount: number } | null }
		expect(body.global?.totalCount).toBe(2500)
	})

	it('CiviCRM en panne : la liste de Global reste disponible', async () => {
		civi['GroupContact.get'] = () => ({ error_message: 'DB down' })
		const { body } = await get()
		expect(body.local).toBeNull()
		expect(body.global?.totalCount).toBe(2500)
	})
})
