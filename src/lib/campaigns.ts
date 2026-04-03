export type CampaignStatus = 'active' | 'ended'

export interface CampaignResult {
	label: string
	value: string
}

export interface CampaignSummary {
	fr: {
		text: string
		results: CampaignResult[]
	}
	en: {
		text: string
		results: CampaignResult[]
	}
}

export interface Campaign {
	/** URL slug, e.g. 'municipales-2026' → /fr/municipales-2026 */
	slug: string
	status: CampaignStatus
	/** Start date (YYYY-MM) — used for ordering and display */
	startDate: string
	/** End date (YYYY-MM) — set when campaign ends */
	endDate?: string
	/** Override URL (absolute path). If omitted, defaults to /{lang}/{slug} */
	url?: string
	/** Summary shown in a popup when the ended campaign card is clicked */
	summary?: CampaignSummary
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
		summary: {
			fr: {
				text: "Pause IA a mené une campagne de mobilisation autour du Sommet de l'IA 2026 en Inde, en appelant les citoyens à signer la pétition internationale et à interpeller les décideurs politiques pour placer la sécurité au centre des discussions.",
				results: [
					{ label: 'Pétition', value: 'Relais de la pétition internationale' },
					{ label: 'Interpellations', value: 'Décideurs politiques contactés' }
				]
			},
			en: {
				text: 'Pause AI France ran a mobilization campaign around the 2026 AI Summit in India, calling on citizens to sign the international petition and contact decision-makers to put safety at the heart of the discussions.',
				results: [
					{ label: 'Petition', value: 'International petition relay' },
					{ label: 'Outreach', value: 'Decision-makers contacted' }
				]
			}
		},
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
		status: 'ended',
		startDate: '2026-03',
		endDate: '2026-03',
		summary: {
			fr: {
				text: "Pause IA a interpellé les candidats aux élections municipales de mars 2026 pour les inviter à signer une charte en 14 engagements sur les risques liés à l'IA. La campagne a mobilisé dans toute la France et généré une couverture médiatique nationale.",
				results: [
					{ label: 'Signataires', value: '12 candidats' },
					{ label: 'Villes', value: '11 villes' },
					{ label: 'Chartes complètes', value: '7 signataires (14/14)' },
					{ label: 'Presse', value: '10 articles (dont France Culture)' }
				]
			},
			en: {
				text: 'Pause AI challenged candidates in the March 2026 municipal elections to sign a charter with 14 commitments on AI risks. The campaign mobilized across France and received national media coverage.',
				results: [
					{ label: 'Signatories', value: '12 candidates' },
					{ label: 'Cities', value: '11 cities' },
					{ label: 'Full charters', value: '7 signatories (14/14)' },
					{ label: 'Press', value: '10 articles (incl. France Culture)' }
				]
			}
		},
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

const byStartDateDesc = (a: Campaign, b: Campaign) => b.startDate.localeCompare(a.startDate)

/** Active campaigns first (newest first), then ended ones (newest first). */
export function getSortedCampaigns(): Campaign[] {
	const active = campaigns.filter((c) => c.status === 'active').sort(byStartDateDesc)
	const ended = campaigns.filter((c) => c.status === 'ended').sort(byStartDateDesc)
	return [...active, ...ended]
}
