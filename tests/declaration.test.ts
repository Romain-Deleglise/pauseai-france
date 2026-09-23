import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { RequestEvent } from '@sveltejs/kit'
import type { DeclarationStats } from '../src/routes/api/declaration/+server'

// Faux CiviCRM et faux pauseai.info : on intercepte fetch et on rejoue des
// réponses API4 selon l'entité et l'action appelées.
const mail = vi.hoisted(() => ({
	configured: true,
	sent: [] as { to: string; subject: string; text: string }[]
}))
vi.mock('$lib/server/mailer', () => ({
	isMailConfigured: () => mail.configured,
	sendMail: (m: { to: string; subject: string; text: string }) => {
		mail.sent.push(m)
		return Promise.resolve()
	}
}))

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
const savedRecords = () =>
	(groupSave()?.params.records as { group_id: number; status: string }[] | undefined)?.map(
		(r) => `${r.group_id}:${r.status}`
	)

const confirm = async (token: string) => {
	const { POST } = await import('../src/routes/api/declaration/confirm/+server')
	const request = new Request('https://pauseia.fr/api/declaration/confirm', {
		method: 'POST',
		body: JSON.stringify({ token })
	})
	const res = await POST({ request } as unknown as RequestEvent)
	return { status: res.status, body: (await res.json()) as Record<string, unknown> }
}

/** Extrait le jeton du lien contenu dans le dernier e-mail envoyé. */
const tokenFromMail = () => {
	const m = /confirmer\?t=([^\s]+)/.exec(mail.sent.at(-1)?.text ?? '')
	return m ? decodeURIComponent(m[1]) : ''
}

const existingContact = (first: string | null, last: string | null, status?: string) => {
	civi['Email.get'] = () => ({ values: [{ id: 1, contact_id: 7 }] })
	civi['Contact.get'] = () => ({ values: [{ first_name: first, last_name: last }] })
	civi['GroupContact.get'] = () => ({ values: status ? [{ status }] : [] })
}

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
	mail.configured = true
	mail.sent = []
	globalResponse = globalOk
	installFetch()
})
afterEach(() => {
	vi.unstubAllGlobals()
})

describe('POST /api/declaration (signature → e-mail de confirmation)', () => {
	it('nouveau contact : en attente dans le groupe 73, e-mail envoyé, rien de compté', async () => {
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
		expect(res.body).toMatchObject({ success: true, pending: true, alreadySigned: false })
		const created = calls.find((c) => c.entity === 'Contact' && c.action === 'create')
		expect(created?.params.values).toMatchObject({ first_name: 'Ada', last_name: 'Lovelace' })
		const email = calls.find((c) => c.entity === 'Email' && c.action === 'create')
		expect(email?.params.values).toMatchObject({ contact_id: 42, email: 'ada@example.org' })
		// Seulement « Pending » dans le 73 : ni groupe public ni newsletter avant confirmation.
		expect(savedRecords()).toEqual(['73:Pending'])
		expect(mail.sent).toHaveLength(1)
		expect(mail.sent[0].to).toBe('ada@example.org')
		expect(mail.sent[0].subject).toMatch(/Confirmez votre signature/)
		expect(mail.sent[0].text).toContain('/fr/declaration/confirmer?t=')
		const { verifyToken } = await import('../src/lib/server/declarationToken')
		expect(verifyToken(tokenFromMail())).toMatchObject({ c: 42, p: true, n: false })
		const logged = calls.find((c) => c.entity === 'Activity' && c.action === 'create')
		expect((logged?.params.values as { subject: string }).subject).toMatch(/e-mail de confirmation/)
	})

	it('page anglaise : e-mail en anglais et lien /en/', async () => {
		existingContact('Ada', 'Lovelace')
		await post({ firstName: 'Ada', lastName: 'Lovelace', email: 'a@b.fr', lang: 'en' })
		expect(mail.sent[0].subject).toMatch(/Confirm your signature/)
		expect(mail.sent[0].text).toContain('/en/declaration/confirmer?t=')
	})

	it('SMTP non configuré : 503, rien n’est enregistré', async () => {
		mail.configured = false
		const res = await post({ firstName: 'A', lastName: 'B', email: 'a@b.fr' })
		expect(res.status).toBe(503)
		expect(calls).toHaveLength(0)
	})

	it('déjà signataire confirmé, rien de nouveau : pas d’e-mail', async () => {
		existingContact('Ada', 'Lovelace', 'Added')
		const res = await post({ firstName: 'Ada', lastName: 'Lovelace', email: 'a@b.fr' })
		expect(res.body).toMatchObject({ success: true, alreadySigned: true })
		expect(res.body.pending).toBeUndefined()
		expect(mail.sent).toHaveLength(0)
		expect(groupSave()).toBeUndefined()
	})

	it('déjà signataire qui demande la newsletter : nouvel e-mail, statut inchangé', async () => {
		existingContact('Ada', 'Lovelace', 'Added')
		const res = await post({
			firstName: 'Ada',
			lastName: 'Lovelace',
			email: 'a@b.fr',
			newsletter: true
		})
		expect(res.body).toMatchObject({ pending: true, alreadySigned: true })
		expect(groupSave()).toBeUndefined()
		const { verifyToken } = await import('../src/lib/server/declarationToken')
		expect(verifyToken(tokenFromMail())).toMatchObject({ c: 7, n: true })
	})

	it('e-mail déjà envoyé il y a moins de 10 minutes : pas de renvoi', async () => {
		existingContact('Ada', 'Lovelace', 'Pending')
		civi['ActivityContact.get'] = () => ({ values: [{ id: 1 }] })
		const res = await post({ firstName: 'Ada', lastName: 'Lovelace', email: 'a@b.fr' })
		expect(res.body).toMatchObject({ success: true, pending: true })
		expect(mail.sent).toHaveLength(0)
	})

	it('contact existant avec un autre nom : le nom enregistré n’est pas écrasé', async () => {
		existingContact('Jean', 'Dupont')
		await post({ firstName: 'Usurpateur', lastName: 'X', email: 'jean@dupont.fr', showName: true })
		expect(calls.some((c) => c.entity === 'Contact' && c.action === 'update')).toBe(false)
	})

	it('contact existant sans nom : complète le nom et la fonction', async () => {
		existingContact(null, null)
		await post({ firstName: 'Ada', lastName: 'Lovelace', email: 'a@b.fr', title: 'Députée' })
		const update = calls.find((c) => c.entity === 'Contact' && c.action === 'update')
		expect(update?.params.values).toEqual({
			first_name: 'Ada',
			last_name: 'Lovelace',
			job_title: 'Députée'
		})
	})

	it('champ piège rempli : répond OK sans rien enregistrer ni envoyer', async () => {
		const res = await post({
			firstName: 'Bot',
			lastName: 'Bot',
			email: 'bot@spam.com',
			website: 'http://spam'
		})
		expect(res.body).toMatchObject({ success: true })
		expect(calls).toHaveLength(0)
		expect(mail.sent).toHaveLength(0)
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
		expect(mail.sent).toHaveLength(0)
	})
})

describe('POST /api/declaration/confirm (clic dans l’e-mail)', () => {
	const token = async (claims: { c: number; p: boolean; n: boolean }, now?: number) => {
		const { createToken } = await import('../src/lib/server/declarationToken')
		return createToken(claims, now)
	}

	it('confirme : 73 + 74 + newsletter en Added, activité journalisée', async () => {
		civi['GroupContact.get'] = () => ({ values: [{ status: 'Pending' }] })
		const res = await confirm(await token({ c: 7, p: true, n: true }))
		expect(res.body).toMatchObject({ success: true, alreadyConfirmed: false, listed: true })
		expect(savedRecords()).toEqual(['73:Added', '74:Added', '3:Added', '22:Added'])
		expect(calls.some((c) => c.entity === 'Activity' && c.action === 'create')).toBe(true)
	})

	it('sans nom public ni newsletter : 73 seulement', async () => {
		const res = await confirm(await token({ c: 7, p: false, n: false }))
		expect(res.body).toMatchObject({ success: true, listed: false })
		expect(savedRecords()).toEqual(['73:Added'])
	})

	it('deuxième clic : idempotent, pas de nouvelle activité', async () => {
		civi['GroupContact.get'] = () => ({ values: [{ status: 'Added' }] })
		const res = await confirm(await token({ c: 7, p: false, n: false }))
		expect(res.body).toMatchObject({ success: true, alreadyConfirmed: true })
		expect(calls.some((c) => c.entity === 'Activity')).toBe(false)
	})

	it('jeton expiré (plus de 30 jours) : refusé', async () => {
		const old = Date.now() - 31 * 24 * 3600 * 1000
		const res = await confirm(await token({ c: 7, p: true, n: false }, old))
		expect(res.status).toBe(400)
		expect(calls).toHaveLength(0)
	})

	it('jeton falsifié : refusé', async () => {
		const t = await token({ c: 7, p: false, n: false })
		const [, mac] = t.split('.')
		const forged = `${Buffer.from(JSON.stringify({ c: 8, p: true, n: true, e: 9999999999 })).toString('base64url')}.${mac}`
		expect((await confirm(forged)).status).toBe(400)
		expect((await confirm('')).status).toBe(400)
		expect((await confirm('abc')).status).toBe(400)
		expect(calls).toHaveLength(0)
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
