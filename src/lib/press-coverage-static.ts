import type { PressCoverage } from '$lib/notion'

/**
 * Static press coverage — source de vérité dans le dépôt Git.
 * Ces articles sont fusionnés avec ceux venant de Notion dans les +page.server.ts.
 * Dates marquées "approx." : à corriger si la date exacte est connue.
 */
export const staticPressCoverage: PressCoverage[] = [
	// ── Campagne élections municipales 2026 ─────────────────────────────────
	{
		id: 'static-france-culture-2026-03-13',
		title: 'Journal de 18h – émission du vendredi 13 mars 2026',
		source: 'France Culture',
		date: '2026-03-13',
		url: 'https://www.radiofrance.fr/franceculture/podcasts/journal-de-18h/journal-de-18h-emission-du-vendredi-13-mars-2026-9405796',
		order: 0,
		visible: true
	},
	{
		id: 'static-placegrenet-2026-03-08',
		title:
			"Municipales 2026 : Pause IA interpelle les candidats sur les dangers de l'intelligence artificielle",
		source: "Place Gre'net",
		date: '2026-03-08',
		url: 'https://www.placegrenet.fr/2026/03/08/municipales-2026-pause-ia-interpelle-les-candidats-sur-les-dangers-de-lintelligence-artificielle/673506',
		order: 0,
		visible: true
	},
	{
		id: 'static-dauphinelibere-2026-03-06',
		title:
			"Isère - Grenoble : l'association Pause IA appelle les candidats à s'engager sur sa charte",
		source: 'Le Dauphiné Libéré',
		date: '2026-03-06',
		url: 'https://www.ledauphine.com/elections/2026/03/06/isere-grenoble-l-association-pause-ia-appelle-les-candidats-a-s-engager-sur-sa-charte',
		order: 0,
		visible: true
	},
	{
		id: 'static-next-municipales-2026-03',
		title: "Quand l'IA s'invite dans les municipales",
		source: 'Next',
		date: '2026-03-01', // approx.
		url: 'https://next.ink/229085/quand-lia-sinvite-dans-les-municipales/',
		order: 0,
		visible: true
	},
	{
		id: 'static-contexte-municipales-2026-03',
		title: "Pause IA s'incruste dans les municipales",
		source: 'Contexte',
		date: '2026-03-01', // approx.
		url: 'https://www.contexte.com/fr/actualite/tech/pause-ia-sincruste-dans-les-municipales_257807',
		order: 0,
		visible: true
	},
	{
		id: 'static-lopinion-municipales-2026-03',
		title: "Risques de l'IA : une association interpelle les candidats aux municipales à Toulouse",
		source: "L'Opinion",
		date: '2026-03-01', // approx.
		url: 'https://lopinion.com/amp/articles/actualite/32757_risques-ia-association-candidats-municipales-toulouse',
		order: 0,
		visible: true
	},
	{
		id: 'static-presseagence-nice-governatori-2026-03',
		title: "Nice : Jean-Marc Governatori s'engage sur la charte de Pause IA pour les municipales",
		source: 'Presse Agence',
		date: '2026-03-01', // approx.
		url: 'https://presseagence.fr/nice-jean-marc-governatori-sengage-sur-la-charte-de-pause-ia-pour-les-municipales/',
		order: 0,
		visible: true
	},
	{
		id: 'static-odsradio-annecy-2026-03',
		title: "Annecy : une association interpelle les candidats sur l'intelligence artificielle",
		source: 'ODS Radio',
		date: '2026-03-01', // approx.
		url: 'https://www.odsradio.com/news/locales/108150/annecy-une-association-interpelle-les-candidats-sur-l-intelligence-artificielle',
		order: 0,
		visible: true
	},
	{
		id: 'static-presseagence-avignon-2026-03',
		title:
			"Avignon : Clémence Peyrot — les candidats aux municipales doivent se positionner sur l'IA",
		source: 'Presse Agence',
		date: '2026-03-01', // approx.
		url: 'https://presseagence.fr/avignon-clemence-peyrot-les-candidats-aux-municipales-doivent-se-positionner/',
		order: 0,
		visible: true
	},
	{
		id: 'static-presseagence-nice-fournes-2026-03',
		title:
			"Nice : Maxime Fournes — les candidats aux municipales doivent se positionner clairement sur l'IA",
		source: 'Presse Agence',
		date: '2026-03-01', // approx.
		url: 'https://presseagence.fr/nice-maxime-fournes-les-candidats-aux-municipales-doivent-se-positionner-clairement/',
		order: 0,
		visible: true
	},

	// ── Tribune & articles nationaux ────────────────────────────────────────
	{
		id: 'static-nouvelobs-2026-02-16',
		title:
			"Sommet de l'IA : face aux risques, remettre la sécurité en haut de l'agenda international",
		source: 'Le Nouvel Obs',
		date: '2026-02-16',
		url: 'https://www.nouvelobs.com/opinions/20260216.OBS112421/sommet-de-l-ia-face-aux-risques-remettre-la-securite-en-haut-de-l-agenda-international.html',
		order: 0,
		visible: true
	},
	{
		id: 'static-bfmtv-2025-02-23',
		title:
			"Exigeons une pause IA : quand des citoyens et des ingénieurs veulent encadrer l'intelligence artificielle",
		source: 'BFM TV',
		date: '2025-02-23',
		url: 'https://www.bfmtv.com/tech/intelligence-artificielle/exigeons-une-pause-ia-quand-des-citoyens-et-des-ingenieurs-veulent-encadrer-l-ia_AN-202502230038.html',
		order: 0,
		visible: true
	},
	{
		id: 'static-latribune-2025-02',
		title:
			"À Paris et dans le monde, les inquiets de l'intelligence artificielle appellent à une pause",
		source: 'La Tribune',
		date: '2025-02-11', // approx. — autour du Sommet IA Paris
		url: 'https://www.latribune.fr/technos-medias/informatique/a-paris-et-dans-le-monde-les-inquiets-de-l-intelligence-artificielle-appellent-a-une-pause-997475.html',
		order: 0,
		visible: true
	},
	{
		id: 'static-lemonde-2024-09-11',
		title:
			"À l'approche du sommet de Paris, les militants inquiets quant à la sécurité de l'IA cherchent à se faire entendre",
		source: 'Le Monde',
		date: '2024-09-11',
		url: 'https://www.lemonde.fr/economie/article/2024/09/11/a-l-approche-du-sommet-de-paris-les-militants-inquiets-quant-a-la-securite-de-l-ia-cherchent-a-se-faire-entendre_6312979_3234.html',
		order: 0,
		visible: true
	},
	{
		id: 'static-contexte-commission-2024',
		title: "Pause IA remet en cause la crédibilité du rapport de la Commission de l'IA",
		source: 'Contexte',
		date: '2024-05-01', // approx.
		url: 'https://www.contexte.com/fr/actualite/tech/pause-ia-remet-en-cause-la-credibilite-du-rapport-de-la-commission-de-lia_201323',
		order: 0,
		visible: true
	},
	{
		id: 'static-ladn-2024',
		title:
			'Pas de futur sans IA sûre : des technophiles alertent sur les dérapages des IA génératives',
		source: "L'ADN",
		date: '2024-03-01', // approx.
		url: 'https://www.ladn.eu/tech-a-suivre/pas-de-futur-sans-ia-sure-des-technophiles-alertent-sur-les-derapages-des-ia-generatives/',
		order: 0,
		visible: true
	},
	{
		id: 'static-nextink-launch-2023',
		title: "Des militants de la sécurité de l'intelligence artificielle lancent Pause IA en France",
		source: 'Next.ink',
		date: '2023-11-01', // approx. — création de l'association
		url: 'https://next.ink/149818/des-militants-de-la-securite-de-lintelligence-artificielle-lancent-pause-ia-en-france/',
		order: 0,
		visible: true
	}
]
