import { getPressCoverage } from '$lib/notion'
import type { PageServerLoad } from './$types'

// Rendu à la demande (comme /presse) : un article ajouté dans la base Notion
// « Revue de presse » apparaît sur la campagne sans redéploiement.
export const prerender = false

// Début de la campagne : seuls les articles parus depuis sont affichés.
const CAMPAIGN_START = '2026-09-01'

export const load: PageServerLoad = async () => {
	const coverage = await getPressCoverage()
	return {
		pressCoverage: coverage.filter((item) => item.date >= CAMPAIGN_START)
	}
}
