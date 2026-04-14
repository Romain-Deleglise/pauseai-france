export type CampaignStatus = 'active' | 'ended'

export interface CampaignResult {
	label: string
	value: string
}

export interface CampaignArticle {
	title: string
	source: string
	url: string
}

export interface CampaignSummary {
	fr: {
		text: string
		results: CampaignResult[]
		link?: { label: string; url: string }
		articles?: CampaignArticle[]
	}
	en: {
		text: string
		results: CampaignResult[]
		link?: { label: string; url: string }
		articles?: CampaignArticle[]
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
		slug: 'ecrire-a-mes-elus',
		status: 'active',
		startDate: '2026-04',
		fr: {
			title: 'Écrivez à vos élu·es',
			description:
				"Envoyez un email à votre député·e et à votre sénateur·rice pour mettre les risques de l'IA à leur agenda. Un modèle personnalisable et deux versions (courte et complète) sont disponibles.",
			cta: 'Envoyer un email à mes élu·es'
		},
		en: {
			title: 'Write to your representatives',
			description:
				'Send an email to your MP and senator to put AI risks on their agenda. A customisable template with both a short and a full version is available.',
			cta: 'Write to my representatives'
		}
	},
	{
		slug: 'sommet-ia-2026',
		status: 'ended',
		startDate: '2026-01',
		endDate: '2026-02',
		summary: {
			fr: {
				text: "À l'occasion du Sommet de l'IA en Inde, Pause IA s'est mobilisée pour remettre la sécurité au cœur de l'agenda international. Plus de 4 000 personnes ont signé la pétition et plus de 2 000 mails ont été envoyés aux délégués dans 14 pays. Une tribune a également été publiée dans Le Nouvel Obs.",
				results: [
					{ label: 'Signatures pétition', value: '+4 000' },
					{ label: 'Mails aux délégués', value: '+2 000 (14 pays)' },
					{ label: 'Tribune', value: 'Le Nouvel Obs' }
				],
				link: {
					label: 'Lire la tribune dans Le Nouvel Obs',
					url: 'https://www.nouvelobs.com/opinions/20260216.OBS112421/sommet-de-l-ia-face-aux-risques-remettre-la-securite-en-haut-de-l-agenda-international.html'
				}
			},
			en: {
				text: 'Pause AI France mobilized to put safety back at the heart of the international AI agenda at the India AI Summit. Over 4,000 people signed the petition and over 2,000 emails were sent to delegates across 14 countries. An op-ed was also published in Le Nouvel Obs.',
				results: [
					{ label: 'Petition signatures', value: '4,000+' },
					{ label: 'Emails to delegates', value: '2,000+ (14 countries)' },
					{ label: 'Op-ed', value: 'Le Nouvel Obs' }
				],
				link: {
					label: 'Read the op-ed in Le Nouvel Obs',
					url: 'https://www.nouvelobs.com/opinions/20260216.OBS112421/sommet-de-l-ia-face-aux-risques-remettre-la-securite-en-haut-de-l-agenda-international.html'
				}
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
					{ label: 'Presse', value: '10 articles + 1 émission (France Culture)' }
				],
				articles: [
					{
						title: "Quand l'IA s'invite dans les municipales",
						source: 'Next',
						url: 'https://next.ink/229085/quand-lia-sinvite-dans-les-municipales/'
					},
					{
						title: 'Journal de 18h — vendredi 13 mars 2026',
						source: 'France Culture',
						url: 'https://www.radiofrance.fr/franceculture/podcasts/journal-de-18h/journal-de-18h-emission-du-vendredi-13-mars-2026-9405796'
					},
					{
						title: '« Les candidats aux municipales doivent se positionner » (Avignon)',
						source: 'Presse Agence',
						url: 'https://presseagence.fr/avignon-clemence-peyrot-les-candidats-aux-municipales-doivent-se-positionner/'
					},
					{
						title:
							"Annecy : une association interpelle les candidats sur l'intelligence artificielle",
						source: 'ODS Radio',
						url: 'https://www.odsradio.com/news/locales/108150/annecy-une-association-interpelle-les-candidats-sur-l-intelligence-artificielle'
					},
					{
						title: "Pause IA s'incruste dans les municipales",
						source: 'Contexte',
						url: 'https://www.contexte.com/fr/actualite/tech/pause-ia-sincruste-dans-les-municipales_257807'
					},
					{
						title:
							"Risques IA : l'association interpelle les candidats aux municipales de Toulouse",
						source: "L'Opinion",
						url: 'https://lopinion.com/amp/articles/actualite/32757_risques-ia-association-candidats-municipales-toulouse'
					},
					{
						title: '« Les candidats aux municipales doivent se positionner clairement » (Nice)',
						source: 'Presse Agence',
						url: 'https://presseagence.fr/nice-maxime-fournes-les-candidats-aux-municipales-doivent-se-positionner-clairement/'
					},
					{
						title: "Municipales 2026 : Pause IA interpelle les candidats sur les dangers de l'IA",
						source: "Place Gre'net",
						url: 'https://www.placegrenet.fr/2026/03/08/municipales-2026-pause-ia-interpelle-les-candidats-sur-les-dangers-de-lintelligence-artificielle/673506'
					},
					{
						title: "Isère / Grenoble : Pause IA appelle les candidats à s'engager sur sa charte",
						source: 'Le Dauphiné Libéré',
						url: 'https://www.ledauphine.com/elections/2026/03/06/isere-grenoble-l-association-pause-ia-appelle-les-candidats-a-s-engager-sur-sa-charte'
					},
					{
						title: "Nice : Jean-Marc Governatori s'engage sur la charte de Pause IA",
						source: 'Presse Agence',
						url: 'https://presseagence.fr/nice-jean-marc-governatori-sengage-sur-la-charte-de-pause-ia-pour-les-municipales/'
					}
				]
			},
			en: {
				text: 'Pause AI challenged candidates in the March 2026 municipal elections to sign a charter with 14 commitments on AI risks. The campaign mobilized across France and received national media coverage.',
				results: [
					{ label: 'Signatories', value: '12 candidates' },
					{ label: 'Cities', value: '11 cities' },
					{ label: 'Full charters', value: '7 signatories (14/14)' },
					{ label: 'Press', value: '10 articles + 1 broadcast (France Culture)' }
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
