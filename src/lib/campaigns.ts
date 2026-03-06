export type CampaignStatus = 'active' | 'ended'

export interface Campaign {
	/** URL slug, e.g. 'municipales-2026' → /fr/municipales-2026 */
	slug: string
	status: CampaignStatus
	/** Start date (YYYY-MM) — used for ordering and display */
	startDate: string
	/** End date (YYYY-MM) — set when campaign ends */
	endDate?: string
	fr: {
		title: string
		description: string
		cta: string
	}
	en: {
		title: string
		description: string
		cta: string
	}
}

/**
 * Source of truth for all campaigns.
 * To add a new campaign: prepend a new object with status: 'active'.
 * When a campaign ends: change its status to 'ended'.
 * Order: newest first within each status group.
 */
export const campaigns: Campaign[] = [
	{
		slug: 'sommet-ia-2026',
		status: 'ended',
		startDate: '2026-01',
		endDate: '2026-02',
		fr: {
			title: "Sommet de l'IA 2026",
			description:
				"Le Sommet de l'IA 2026 en Inde est un moment crucial pour l'avenir de notre société. Signez la pétition et interpellez les décideurs politiques pour que la sécurité soit au cœur des discussions.",
			cta: 'Participer à la campagne'
		},
		en: {
			title: 'AI Summit 2026',
			description:
				'The 2026 AI Summit in India is a crucial moment for the future of our society. Sign the petition and contact decision-makers to put safety at the heart of the discussions.',
			cta: 'Join the campaign'
		}
	},
	{
		slug: 'municipales-2026',
		status: 'active',
		startDate: '2026-03',
		fr: {
			title: 'Élections municipales 2026',
			description:
				"Les élections municipales de mars 2026 sont une opportunité d'agir localement. Interpellez les candidats de votre ville et invitez-les à signer la charte Pause IA.",
			cta: 'Participer à la campagne'
		},
		en: {
			title: 'Municipal elections 2026',
			description:
				'The March 2026 municipal elections are an opportunity to act locally. Challenge candidates in your city and invite them to sign the Pause AI charter.',
			cta: 'Join the campaign'
		}
	}
]

/** Active campaigns first, then ended ones — each group sorted newest first. */
export function getSortedCampaigns(): Campaign[] {
	const active = campaigns.filter((c) => c.status === 'active')
	const ended = campaigns.filter((c) => c.status === 'ended')
	return [...active, ...ended]
}
