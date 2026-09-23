import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

// Les signatures de la déclaration PauseAI sont recueillies par le formulaire
// Tally de PauseAI Global et stockées dans leur Airtable : la liste fait foi
// côté pauseai.info. On la relaie ici (leur API n'autorise pas les appels
// directs depuis un autre domaine) sans la prérendre, pour que le compteur
// reste à jour entre deux déploiements.
export const prerender = false

const GLOBAL_SIGNATORIES_URL = 'https://pauseai.info/api/signatories'

type GlobalSignatory = {
	name: string
	country?: string
	bio?: string
	date: string
	private: boolean
}

export type SignatoriesResponse = {
	totalCount: number
	franceCount: number
	/** Signataires en France, du plus récent au plus ancien. */
	france: { name: string; bio?: string }[]
}

const isFrance = (country?: string) => !!country && /france/i.test(country)

export const GET: RequestHandler = async ({ fetch, setHeaders }) => {
	try {
		const res = await fetch(GLOBAL_SIGNATORIES_URL)
		if (!res.ok) throw new Error(`HTTP ${res.status}`)
		const data = (await res.json()) as { signatories: GlobalSignatory[]; totalCount: number }

		// L'API de Global renvoie un compteur à 0 quand Airtable est injoignable :
		// on ne met pas ce résultat en cache.
		if (data.totalCount > 0) {
			setHeaders({ 'cache-control': 'public, max-age=600, s-maxage=3600' })
		}

		const france = data.signatories
			.filter((s) => isFrance(s.country))
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
			.map(({ name, bio }) => ({ name, bio }))

		const body: SignatoriesResponse = {
			totalCount: data.totalCount,
			franceCount: france.length,
			france
		}
		return json(body)
	} catch (e) {
		console.error('Erreur lors de la récupération des signataires :', e)
		return json({ error: 'unavailable' }, { status: 502 })
	}
}
