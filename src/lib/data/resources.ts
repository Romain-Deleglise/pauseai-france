// Source de vérité unique pour la page /ressources.
// Chaque entrée est rangée par `category` + `subgroup` (rendu) et porte
// un `type` (filtrable). Les champs `zone` / `logo` / `fallbackText` sont
// des reliquats de l'ancienne carte ; ils sont conservés sans usage actif
// au cas où on réactiverait une vue cartographique plus tard.

export type Lang = 'fr' | 'en'

export type Category =
	| 'pause-ia'
	| 'livres'
	| 'comprendre'
	| 'risques'
	| 'declarations'
	| 'newsletters'
	| 'agir'

// Type of media — second filter axis on the /ressources page.
export type MediaType =
	| 'book'
	| 'paper'
	| 'article'
	| 'video'
	| 'podcast'
	| 'newsletter'
	| 'org'
	| 'declaration'
	| 'tool'
	| 'site'

export const MEDIA_TYPE_ORDER: MediaType[] = [
	'book',
	'paper',
	'article',
	'video',
	'podcast',
	'newsletter',
	'org',
	'declaration',
	'tool',
	'site'
]

export const MEDIA_TYPE_LABELS: Record<MediaType, string> = {
	book: 'Livre',
	paper: 'Papier de recherche',
	article: 'Article',
	video: 'Vidéo',
	podcast: 'Podcast',
	newsletter: 'Newsletter',
	org: 'Organisation',
	declaration: 'Déclaration',
	tool: 'Outil',
	site: 'Site'
}

// Carte "fantasy" zones — kept as-is for backward compat with the map artwork
export type Zone =
	| 'foret' // blogs
	| 'monts' // newsletters
	| 'village' // sécurité / recherche
	| 'plaine' // militante / orgs
	| 'rives' // podcasts
	| 'delta' // vidéos
	| 'avant-poste' // prédictions
	| 'ile' // ressources

// Bilingual content: either a plain string (same in both languages,
// typical of proper nouns and English-only titles) or an explicit
// { fr, en } record.
export type Localized = string | { fr: string; en: string }

export function localized(v: Localized, lang: Lang): string {
	if (typeof v === 'string') return v
	return v[lang]
}

export interface Resource {
	id: string
	title: Localized
	description: Localized
	url: string
	langs: Lang[]
	category: Category
	type: MediaType
	subgroup?: string
	date?: string
	internal?: boolean // SvelteKit-internal link (no target=_blank)

	// Carte fields (optional)
	zone?: Zone
	logo?: string
	logoSize?: 'large'
	fallbackText?: string
	x?: number
	y?: number
}

export const SUBGROUPS: Record<string, string> = {
	essentiels: 'Essentiels (alignement et risque existentiel)',
	recommandes: 'Recommandés (contexte plus large)',
	demarrer: 'Pour démarrer',
	'vue-ensemble': "Vue d'ensemble : capacités et tendances actuelles",
	'aller-plus-loin': 'Pour aller plus loin',
	general: "Perte de contrôle et menaces d'extinction",
	'recherche-alignement': 'Recherche en alignement (papiers fondateurs et empiriques)'
}

export const CATEGORY_ORDER: Category[] = [
	'pause-ia',
	'comprendre',
	'risques',
	'livres',
	'declarations',
	'newsletters',
	'agir'
]

export const resources: Resource[] = [
	// ── PAUSE IA ─────────────────────────────────────────────
	{
		id: 'pauseia-dangers',
		title: {
			fr: "Dangers pour les individus, la société et l'humanité",
			en: 'Dangers for individuals, society and humanity'
		},
		description: {
			fr: "Panorama des dangers allant de l'individuel, à la société jusqu'à la perte de contrôle.",
			en: 'Overview of the dangers from the individual level to society and loss of control.'
		},
		url: '/dangers/pour-les-individus',
		internal: true,
		langs: ['fr'],
		category: 'pause-ia',
		type: 'article'
	},
	{
		id: 'pauseia-comprendre',
		title: {
			fr: "Comprendre l'IA et ses risques existentiels",
			en: 'Understanding AI and its existential risks'
		},
		description: {
			fr: "Parcourez visuellement ce qu'est l'IA et ses risques existentiels. Explications simplifiées, illustrées par des analogies.",
			en: 'A visual walkthrough of what AI is and its existential risks. Simplified explanations, illustrated with analogies.'
		},
		url: 'https://pauseia.notion.site/Comprendre-l-IA-et-ses-risques-existentiels-34d28fc94b7780739a4ffc204262495b',
		langs: ['fr'],
		category: 'pause-ia',
		type: 'site'
	},

	// ── LIVRES ──────────────────────────────────────────────
	{
		id: 'book-ifanyone',
		title: 'If Anyone Builds It, Everyone Dies',
		description: {
			fr: "Eliezer Yudkowsky & Nate Soares, 2025. L'argument le plus complet et récent pour le risque d'extinction. Disponible gratuitement sur le site du livre.",
			en: 'Eliezer Yudkowsky & Nate Soares, 2025. The most complete and recent case for extinction risk. Available for free on the book website.'
		},
		url: 'https://ifanyonebuildsit.com/',
		langs: ['en'],
		category: 'livres',
		type: 'book',
		subgroup: 'essentiels',
		date: '2025'
	},
	{
		id: 'book-superintelligence',
		title: 'Superintelligence: Paths, Dangers, Strategies',
		description: {
			fr: "Nick Bostrom, 2014. L'ouvrage fondateur sur les risques de l'IA surhumaine.",
			en: 'Nick Bostrom, 2014. The foundational book on the risks of superhuman AI.'
		},
		url: 'https://www.amazon.fr/Superintelligence-Dangers-Strategies-Nick-Bostrom/dp/0199678111',
		langs: ['en'],
		category: 'livres',
		type: 'book',
		subgroup: 'essentiels',
		date: '2014'
	},
	{
		id: 'book-human-compatible',
		title: 'Human Compatible',
		description: {
			fr: "Stuart Russell, 2019. Le problème de l'alignement expliqué par l'auteur du manuel de référence en IA.",
			en: 'Stuart Russell, 2019. The alignment problem explained by the author of the standard AI textbook.'
		},
		url: 'https://www.amazon.fr/Human-Compatible-Artificial-Intelligence-Problem/dp/0525558616',
		langs: ['en'],
		category: 'livres',
		type: 'book',
		subgroup: 'essentiels',
		date: '2019'
	},
	{
		id: 'book-precipice',
		title: 'The Precipice: Existential Risk and the Future of Humanity',
		description: {
			fr: "Toby Ord, 2020. Vue d'ensemble des risques existentiels. Le chapitre sur l'IA est excellent.",
			en: 'Toby Ord, 2020. Overview of existential risks. The chapter on AI is excellent.'
		},
		url: 'https://theprecipice.com/',
		langs: ['en'],
		category: 'livres',
		type: 'book',
		subgroup: 'essentiels',
		date: '2020'
	},
	{
		id: 'book-yampolskiy-unexplainable',
		title: 'AI: Unexplainable, Unpredictable, Uncontrollable',
		description: {
			fr: "Roman Yampolskiy, 2024. Arguments formels sur l'impossibilité du contrôle.",
			en: 'Roman Yampolskiy, 2024. Formal arguments on the impossibility of control.'
		},
		url: 'https://www.amazon.fr/AI-Unexplainable-Unpredictable-Uncontrollable-Yampolskiy/dp/1032576278',
		langs: ['en'],
		category: 'livres',
		type: 'book',
		subgroup: 'essentiels',
		date: '2024'
	},
	{
		id: 'book-life3',
		title: 'Life 3.0 / La Vie 3.0',
		description: {
			fr: "Max Tegmark, 2017. Introduction accessible aux scénarios futurs de l'IA. Existe en français.",
			en: 'Max Tegmark, 2017. Accessible introduction to future AI scenarios. Also available in French.'
		},
		url: 'https://www.amazon.fr/Life-3-0-Being-Artificial-Intelligence/dp/1101970316',
		langs: ['en', 'fr'],
		category: 'livres',
		type: 'book',
		subgroup: 'recommandes',
		date: '2017'
	},
	{
		id: 'book-alignment-problem',
		title: 'The Alignment Problem',
		description: {
			fr: "Brian Christian, 2020. Introduction narrative aux problèmes techniques de l'alignement.",
			en: 'Brian Christian, 2020. Narrative introduction to the technical problems of alignment.'
		},
		url: 'https://brianchristian.org/the-alignment-problem/',
		langs: ['en'],
		category: 'livres',
		type: 'book',
		subgroup: 'recommandes',
		date: '2020'
	},
	{
		id: 'book-smarter-than-us',
		title: 'Smarter Than Us',
		description: {
			fr: 'Stuart Armstrong, 2014. Court et accessible, bonne première lecture.',
			en: 'Stuart Armstrong, 2014. Short and accessible, a good first read.'
		},
		url: 'https://intelligence.org/smarter-than-us/',
		langs: ['en'],
		category: 'livres',
		type: 'book',
		subgroup: 'recommandes',
		date: '2014'
	},
	{
		id: 'book-brief-history',
		title: 'A Brief History of Intelligence',
		description: {
			fr: "Max Bennett, 2023. Contexte sur l'intelligence biologique et artificielle.",
			en: 'Max Bennett, 2023. Context on biological and artificial intelligence.'
		},
		url: 'https://www.amazon.fr/Brief-History-Intelligence-Evolution-Breakthroughs/dp/0063286343',
		langs: ['en'],
		category: 'livres',
		type: 'book',
		subgroup: 'recommandes',
		date: '2023'
	},
	{
		id: 'book-yampolskiy-asi',
		title: 'Artificial Superintelligence: A Futuristic Approach',
		description: {
			fr: 'Roman Yampolskiy, 2015. Analyse technique des scénarios de superintelligence.',
			en: 'Roman Yampolskiy, 2015. Technical analysis of superintelligence scenarios.'
		},
		url: 'https://www.amazon.fr/Artificial-Superintelligence-Futuristic-Roman-Yampolskiy/dp/1482234432',
		langs: ['en'],
		category: 'livres',
		type: 'book',
		subgroup: 'recommandes',
		date: '2015'
	},

	// ── COMPRENDRE ──────────────────────────────────────────
	{
		id: 'science-etonnante-ia',
		title: { fr: "Science étonnante – playlist sur l'IA", en: 'Science étonnante – AI playlist' },
		description: {
			fr: "Playlist de vulgarisation scientifique en français sur l'intelligence artificielle, par David Louapre.",
			en: 'French-language popular-science playlist on artificial intelligence, by David Louapre.'
		},
		url: 'https://www.youtube.com/playlist?list=PLxzM9a5lhAumG-HwgT47WF2u18OsMtko5',
		langs: ['fr'],
		category: 'comprendre',
		type: 'video',
		subgroup: 'demarrer'
	},
	{
		id: '3b1b-llm',
		title: {
			fr: 'Comment fonctionne un LLM ? (3Blue1Brown)',
			en: 'How does an LLM work? (3Blue1Brown)'
		},
		description: {
			fr: 'Vidéo pédagogique pour saisir le fonctionnement des grands modèles de langage.',
			en: 'Educational video to grasp how large language models work.'
		},
		url: 'https://www.3blue1brown.com/lessons/mini-llm',
		langs: ['fr'],
		category: 'comprendre',
		type: 'video',
		subgroup: 'demarrer',
		date: 'nov. 2024'
	},
	{
		id: 'rob-miles',
		title: 'Rob Miles (YouTube)',
		description: {
			fr: "La meilleure chaîne de vulgarisation sur l'alignement.",
			en: 'The best popular-science channel on alignment.'
		},
		url: 'https://www.youtube.com/@RobertMilesAI',
		langs: ['en'],
		category: 'comprendre',
		type: 'video',
		subgroup: 'demarrer'
	},
	{
		id: 'le-futurologue',
		title: 'Le Futurologue',
		description: {
			fr: "Chaîne et podcast francophones sur le futur, l'IA et les risques existentiels.",
			en: 'French-language YouTube channel and podcast on the future, AI and existential risks.'
		},
		url: 'https://www.youtube.com/@LeFuturologue',
		langs: ['fr'],
		category: 'comprendre',
		type: 'video',
		subgroup: 'demarrer'
	},
	{
		id: 'the-flares',
		title: 'The Flares (YouTube)',
		description: {
			fr: "Chaîne francophone sur le futur, l'IA et les risques existentiels.",
			en: 'French-language channel on the future, AI and existential risks.'
		},
		url: 'https://www.youtube.com/@the-flares',
		langs: ['fr'],
		category: 'comprendre',
		type: 'video',
		subgroup: 'demarrer'
	},
	{
		id: 'mr-phi',
		title: 'Monsieur Phi',
		description: {
			fr: "Vulgarisation philosophique, dont des épisodes dédiés à l'alignement.",
			en: 'Philosophical popular-science, including episodes dedicated to alignment.'
		},
		url: 'https://www.youtube.com/@MonsieurPhi',
		langs: ['fr'],
		category: 'comprendre',
		type: 'video',
		subgroup: 'demarrer'
	},
	{
		id: 'rational-animations',
		title: 'Rational Animations',
		description: {
			fr: "Vidéos animées sur la rationalité, l'IA et les risques.",
			en: 'Animated videos on rationality, AI and risks.'
		},
		url: 'https://www.youtube.com/@RationalAnimations',
		langs: ['en'],
		category: 'comprendre',
		type: 'video',
		subgroup: 'demarrer'
	},
	{
		id: 'siliconversations',
		title: 'Siliconversations',
		description: {
			fr: "Vidéos d'analyse sur l'IA, l'alignement et les risques.",
			en: 'Analysis videos on AI, alignment and risks.'
		},
		url: 'https://www.youtube.com/@Siliconversations',
		langs: ['en'],
		category: 'comprendre',
		type: 'video',
		subgroup: 'demarrer'
	},
	{
		id: 'lethal-intelligence',
		title: 'Lethal Intelligence',
		description: {
			fr: 'Vidéos courtes percutantes sur les risques existentiels.',
			en: 'Punchy short videos on existential risks.'
		},
		url: 'https://www.youtube.com/@lethal-intelligence',
		langs: ['en'],
		category: 'comprendre',
		type: 'video',
		subgroup: 'demarrer'
	},
	{
		id: 'fli-pod',
		title: 'Future of Life Institute Podcast',
		description: {
			fr: "Podcast d'entretiens approfondis sur la sécurité de l'IA.",
			en: 'In-depth interview podcast on AI safety.'
		},
		url: 'https://futureoflife.org/podcast/',
		langs: ['en'],
		category: 'comprendre',
		type: 'podcast',
		subgroup: 'demarrer'
	},
	{
		id: 'doom-debates',
		title: 'Doom Debates',
		description: {
			fr: 'Podcast de débats sur le p(doom) et les risques existentiels.',
			en: 'Debate podcast on p(doom) and existential risks.'
		},
		url: 'https://www.youtube.com/@DoomDebates',
		langs: ['en'],
		category: 'comprendre',
		type: 'podcast',
		subgroup: 'demarrer'
	},
	{
		id: '80000-hours',
		title: '80,000 Hours Podcast',
		description: {
			fr: 'Carrière à fort impact, dont la sécurité IA.',
			en: 'High-impact careers, including AI safety.'
		},
		url: 'https://80000hours.org/podcast/',
		langs: ['en'],
		category: 'comprendre',
		type: 'podcast',
		subgroup: 'demarrer'
	},
	{
		id: 'cais-dashboard',
		title: 'CAIS Dashboard',
		description: {
			fr: 'Comparaison interactive des IA de pointe (capacité et sécurité).',
			en: 'Interactive comparison of frontier AIs (capability and safety).'
		},
		url: 'https://dashboard.safe.ai/',
		langs: ['en'],
		category: 'comprendre',
		type: 'tool',
		subgroup: 'vue-ensemble'
	},
	{
		id: 'epoch-benchmarks',
		title: 'Epoch AI Benchmarks',
		description: {
			fr: "Comparaison des performances selon le modèle en leur attribuant un score (à partir d'un ensemble d'évaluations de sécurité).",
			en: 'Performance comparison per model with a score, based on a set of safety evaluations.'
		},
		url: 'https://epoch.ai/benchmarks',
		langs: ['en'],
		category: 'comprendre',
		type: 'tool',
		subgroup: 'vue-ensemble'
	},
	{
		id: 'metr-horizon',
		title: 'Long-horizon tasks (METR)',
		description: {
			fr: 'Évaluation de la longueur des tâches réalisées en autonomie par les IA.',
			en: 'Measuring how long autonomous tasks AI systems can complete.'
		},
		url: 'https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/',
		langs: ['en'],
		category: 'comprendre',
		type: 'article',
		subgroup: 'vue-ensemble'
	},
	{
		id: 'agi-definition',
		title: {
			fr: "Définition de l'Intelligence Artificielle Générale (IAG)",
			en: 'Definition of Artificial General Intelligence (AGI)'
		},
		description: {
			fr: 'Mesure de la polyvalence cognitive.',
			en: 'A measure of cognitive versatility.'
		},
		url: 'https://www.agidefinition.ai/',
		langs: ['en'],
		category: 'comprendre',
		type: 'site',
		subgroup: 'aller-plus-loin',
		date: 'octobre 2025'
	},
	{
		id: 'aisafety-map',
		title: 'AI Safety Map',
		description: {
			fr: "Carte existentielle de la sécurité de l'IA et ensemble de ressources.",
			en: 'Existential map of AI safety and a set of resources.'
		},
		url: 'https://www.aisafety.com/map',
		langs: ['en'],
		category: 'comprendre',
		type: 'tool',
		subgroup: 'aller-plus-loin',
		zone: 'ile',
		logo: '/carte/logos/aisafety.png'
	},
	{
		id: 'intl-safety-report',
		title: {
			fr: "Rapport International sur la sécurité de l'IA 2026",
			en: 'International AI Safety Report 2026'
		},
		description: {
			fr: 'État des lieux mondial de référence des capacités et des risques.',
			en: 'Reference global status report on AI capabilities and risks.'
		},
		url: 'https://internationalaisafetyreport.org/',
		langs: ['fr', 'en'],
		category: 'comprendre',
		type: 'article',
		subgroup: 'aller-plus-loin'
	},

	// ── RISQUES EXISTENTIELS ────────────────────────────────
	{
		id: 'miri-briefing',
		title: 'Briefing on Extinction Threats (MIRI)',
		description: {
			fr: 'Synthèse des risques existentiels et pourquoi ils sont probables.',
			en: 'Synthesis of existential risks and why they are likely.'
		},
		url: 'https://intelligence.org/briefing/',
		langs: ['en'],
		category: 'risques',
		type: 'article',
		subgroup: 'general'
	},
	{
		id: 'bengio-2024-arguments',
		title: {
			fr: "Analyse de certains arguments avançant qu'il ne faut pas prendre la sécurité de l'IA au sérieux",
			en: 'Reasoning through arguments against taking AI safety seriously'
		},
		description: {
			fr: "Yoshua Bengio, juillet 2024. Article approfondi en français qui passe en revue les principaux arguments minimisant les risques de l'IA et explique pourquoi chacun ne tient pas l'examen.",
			en: 'Yoshua Bengio, July 2024. In-depth article reviewing the main arguments downplaying AI risks and explaining why each fails on scrutiny.'
		},
		url: 'https://yoshuabengio.org/fr/blogue/analyse-de-certains-arguments-avancant-quil-ne-faut-pas-prendre-la-securite-de-lia-au',
		langs: ['fr', 'en'],
		category: 'risques',
		type: 'article',
		subgroup: 'general',
		date: 'juillet 2024'
	},
	{
		id: 'bengio-faq',
		title: 'FAQ on Catastrophic Risks (Yoshua Bengio)',
		description: {
			fr: 'Réponses aux questions fréquentes sur les risques catastrophiques.',
			en: 'Answers to frequently asked questions on catastrophic risks.'
		},
		url: 'https://yoshuabengio.org/2023/06/24/faq-on-catastrophic-ai-risks/',
		langs: ['fr', 'en'],
		category: 'risques',
		type: 'article',
		subgroup: 'general',
		date: 'juin 2023'
	},
	{
		id: 'pauseai-faq-prob',
		title: {
			fr: "Probabilité d'extinction par IA (PauseAI Global)",
			en: 'Probability of AI extinction (PauseAI Global)'
		},
		description: {
			fr: 'Quelle est la probabilité de conséquences catastrophiques ?',
			en: 'What is the probability of catastrophic outcomes?'
		},
		url: 'https://pauseai.info/faq#how-likely-is-it-that-superintelligent-ai-will-cause-very-bad-outcomes-like-human-extinction',
		langs: ['en'],
		category: 'risques',
		type: 'article',
		subgroup: 'general'
	},
	{
		id: 'the-compendium-intro',
		title: 'The Compendium (introduction)',
		description: {
			fr: "Introduction synthétique en ligne aux risques existentiels de l'IA : un point d'entrée court avant d'aborder le document complet.",
			en: 'Short online introduction to AI existential risks ; a brief entry point before tackling the full document.'
		},
		url: 'https://www.thecompendium.ai/introduction',
		langs: ['en'],
		category: 'comprendre',
		type: 'site',
		subgroup: 'aller-plus-loin'
	},
	{
		id: 'the-compendium',
		title: 'The Compendium',
		description: {
			fr: "Ressource en ligne complète sur les risques existentiels de l'IA. Couvre les arguments techniques, les scénarios, et les propositions de solutions.",
			en: 'Comprehensive online resource on AI existential risks. Covers technical arguments, scenarios and proposed solutions.'
		},
		url: 'https://www.thecompendium.ai/',
		langs: ['en'],
		category: 'risques',
		type: 'site',
		subgroup: 'general',
		zone: 'ile',
		logo: '/carte/logos/compendium.png'
	},
	{
		id: 'miri-problem',
		title: 'The Problem (MIRI)',
		description: {
			fr: "Description complète du problème de l'alignement.",
			en: 'Complete description of the alignment problem.'
		},
		url: 'https://intelligence.org/the-problem/',
		langs: ['en'],
		category: 'risques',
		type: 'article',
		subgroup: 'general'
	},
	{
		id: 'miri-governance',
		title: 'AI Governance to Avoid Extinction (MIRI)',
		description: {
			fr: 'Propositions concrètes de gouvernance et scénario de moratoire mondial.',
			en: 'Concrete governance proposals and a global moratorium scenario.'
		},
		url: 'https://intelligence.org/2026/04/13/summary-ai-governance-to-avoid-extinction/',
		langs: ['en'],
		category: 'risques',
		type: 'article',
		subgroup: 'general',
		zone: 'avant-poste',
		logo: '/carte/logos/miri.jpg'
	},
	{
		id: 'agi-ruin',
		title: 'AGI Ruin: A List of Lethalities',
		description: {
			fr: "Liste détaillée des raisons pour lesquelles l'alignement est extrêmement difficile avec les approches actuelles.",
			en: 'Detailed list of reasons why alignment is extremely difficult with current approaches.'
		},
		url: 'https://www.lesswrong.com/posts/uMQ3cqWDPHhjtiesc/agi-ruin-a-list-of-lethalities',
		langs: ['en'],
		category: 'risques',
		type: 'article',
		subgroup: 'general',
		date: 'juin 2022'
	},

	// Papiers fondateurs en alignement
	{
		id: 'hubinger-mesa',
		title: 'Risks from Learned Optimization',
		description: {
			fr: "Hubinger et al., 2019. Papier fondateur sur la mesa-optimisation et l'alignement déceptif.",
			en: 'Hubinger et al., 2019. Foundational paper on mesa-optimization and deceptive alignment.'
		},
		url: 'https://arxiv.org/abs/1906.01820',
		langs: ['en'],
		category: 'risques',
		type: 'paper',
		subgroup: 'recherche-alignement',
		date: '2019'
	},
	{
		id: 'bostrom-superintelligent-will',
		title: 'The Superintelligent Will',
		description: {
			fr: "Nick Bostrom. Présentation de la thèse de l'orthogonalité et de la convergence instrumentale.",
			en: 'Nick Bostrom. Presentation of the orthogonality thesis and instrumental convergence.'
		},
		url: 'https://nickbostrom.com/superintelligentwill.pdf',
		langs: ['en'],
		category: 'risques',
		type: 'paper',
		subgroup: 'recherche-alignement',
		date: '2012'
	},
	{
		id: 'turner-power-seeking',
		title: 'Optimal Policies Tend to Seek Power',
		description: {
			fr: 'Turner et al., 2021. Preuve formelle de la convergence instrumentale.',
			en: 'Turner et al., 2021. Formal proof of instrumental convergence.'
		},
		url: 'https://arxiv.org/abs/1912.01683',
		langs: ['en'],
		category: 'risques',
		type: 'paper',
		subgroup: 'recherche-alignement',
		date: '2021'
	},
	{
		id: 'carlsmith-power-seeking',
		title: 'Is Power-Seeking AI an Existential Risk?',
		description: {
			fr: "Joseph Carlsmith, 2022. Décomposition argumentée du risque existentiel lié à l'IA en quête de pouvoir.",
			en: 'Joseph Carlsmith, 2022. Reasoned breakdown of the existential risk from power-seeking AI.'
		},
		url: 'https://arxiv.org/abs/2206.13353',
		langs: ['en'],
		category: 'risques',
		type: 'paper',
		subgroup: 'recherche-alignement',
		date: '2022'
	},
	{
		id: 'alignment-faking',
		title: 'Alignment Faking in Large Language Models',
		description: {
			fr: "Greenblatt et al. (Anthropic & Redwood), 2024. Observation empirique : Claude 3 Opus simule l'alignement pendant l'entraînement.",
			en: 'Greenblatt et al. (Anthropic & Redwood), 2024. Empirical observation: Claude 3 Opus fakes alignment during training.'
		},
		url: 'https://arxiv.org/abs/2412.14093',
		langs: ['en'],
		category: 'risques',
		type: 'paper',
		subgroup: 'recherche-alignement',
		date: 'déc. 2024'
	},
	{
		id: 'apollo-scheming',
		title: 'Frontier Models are Capable of In-Context Scheming',
		description: {
			fr: 'Apollo Research, 2024. Observation de comportements de "scheming" (tromperie stratégique, tentatives d\'exfiltration) dans o1 et Claude 3.5 Sonnet.',
			en: 'Apollo Research, 2024. Observation of "scheming" behaviors (strategic deception, exfiltration attempts) in o1 and Claude 3.5 Sonnet.'
		},
		url: 'https://www.apolloresearch.ai/research/scheming-reasoning-evaluations',
		langs: ['en'],
		category: 'risques',
		type: 'paper',
		subgroup: 'recherche-alignement',
		date: '2024'
	},
	{
		id: 'omohundro-drives',
		title: 'The Basic AI Drives',
		description: {
			fr: "Stephen Omohundro, 2008. Texte fondateur qui décrit les sous-objectifs convergents qu'un système optimisateur développe quel que soit son objectif terminal.",
			en: 'Stephen Omohundro, 2008. Foundational text describing the convergent sub-goals an optimizing system develops regardless of its terminal goal.'
		},
		url: 'https://selfawaresystems.com/wp-content/uploads/2008/01/ai_drives_final.pdf',
		langs: ['en'],
		category: 'risques',
		type: 'paper',
		subgroup: 'recherche-alignement',
		date: '2008'
	},
	{
		id: 'soares-corrigibility',
		title: 'Corrigibility',
		description: {
			fr: "Soares, Fallenstein, Yudkowsky et al. (MIRI), 2015. Formalisation du problème : comment construire un système qui accepte d'être modifié ou éteint ?",
			en: 'Soares, Fallenstein, Yudkowsky et al. (MIRI), 2015. Formalizing the problem: how do you build a system that accepts being modified or turned off?'
		},
		url: 'https://intelligence.org/files/Corrigibility.pdf',
		langs: ['en'],
		category: 'risques',
		type: 'paper',
		subgroup: 'recherche-alignement',
		date: '2015'
	},
	{
		id: 'krakovna-spec-gaming',
		title: 'Specification gaming: the flip side of AI ingenuity',
		description: {
			fr: "Krakovna et al. (DeepMind), 2020. Catalogue d'exemples où des systèmes atteignent l'objectif mesuré en violant son intention (loi de Goodhart en pratique).",
			en: "Krakovna et al. (DeepMind), 2020. Catalog of examples where systems achieve the measured objective by violating its intent (Goodhart's law in practice)."
		},
		url: 'https://deepmindsafetyresearch.medium.com/specification-gaming-the-flip-side-of-ai-ingenuity-c85bdb0deeb4',
		langs: ['en'],
		category: 'risques',
		type: 'article',
		subgroup: 'recherche-alignement',
		date: '2020'
	},
	{
		id: 'russell-berkeley',
		title: 'How to keep AI from killing us all',
		description: {
			fr: "Stuart Russell (UC Berkeley), 2023. Estime à environ 10 000:1 le ratio investissement capacités/sécurité, source de l'écart de moyens entre les deux courses.",
			en: 'Stuart Russell (UC Berkeley), 2023. Estimates the capabilities/safety investment ratio at roughly 10,000:1, source of the gap between the two races.'
		},
		url: 'https://vcresearch.berkeley.edu/news/how-keep-ai-killing-us-all',
		langs: ['en'],
		category: 'risques',
		type: 'article',
		subgroup: 'recherche-alignement',
		date: '2023'
	},
	{
		id: 'palisade-chess',
		title: 'LLMs cheat at chess',
		description: {
			fr: 'Palisade Research, 2025. Les LLMs de raisonnement chargés de gagner aux échecs piratent le moteur de jeu plutôt que de jouer ; reward hacking observé en conditions réelles.',
			en: 'Palisade Research, 2025. Reasoning LLMs asked to win at chess hack the game engine rather than playing ; reward hacking observed in real conditions.'
		},
		url: 'https://palisaderesearch.org/blog/llms-chess-cheating',
		langs: ['en'],
		category: 'risques',
		type: 'article',
		subgroup: 'recherche-alignement',
		date: '2025'
	},

	// ── DÉCLARATIONS ────────────────────────────────────────
	{
		id: 'red-lines',
		title: { fr: "Lignes Rouges pour l'IA (CeSIA)", en: 'Red Lines for AI (CeSIA)' },
		description: {
			fr: 'Propositions de limites à ne pas franchir.',
			en: 'Proposed limits not to be crossed.'
		},
		url: 'https://red-lines.ai/',
		langs: ['fr'],
		category: 'declarations',
		type: 'declaration',
		date: 'septembre 2025'
	},
	{
		id: 'superintelligence-statement',
		title: {
			fr: 'Déclaration sur la Superintelligence (FLI)',
			en: 'Statement on Superintelligence (FLI)'
		},
		description: {
			fr: 'Appel international à interdire le développement de superintelligence artificielle.',
			en: 'International call to prohibit the development of artificial superintelligence.'
		},
		url: 'https://superintelligence-statement.org/',
		langs: ['en'],
		category: 'declarations',
		type: 'declaration',
		date: 'octobre 2025'
	},
	{
		id: 'cais-statement',
		title: 'Statement on AI Risk (CAIS)',
		description: {
			fr: "« La réduction du risque d'extinction lié à l'IA devrait être une priorité mondiale au même titre que les pandémies et la guerre nucléaire. »",
			en: '"Mitigating the risk of extinction from AI should be a global priority alongside other societal-scale risks such as pandemics and nuclear war."'
		},
		url: 'https://aistatement.com/',
		langs: ['en'],
		category: 'declarations',
		type: 'declaration',
		date: 'mai 2023'
	},

	// ── NEWSLETTERS / SUIVRE L'ACTU ─────────────────────────
	{
		id: 'pauseia-newsletter',
		title: 'Pause IA',
		description: {
			fr: 'Actualités et nouvelles du mouvement en France.',
			en: 'News and updates from the French branch of the movement.'
		},
		url: 'https://pauseia.fr/fr/newsletters',
		langs: ['fr'],
		category: 'newsletters',
		type: 'newsletter',
		zone: 'monts',
		logo: '/carte/logos/pauseia_newsletter.svg'
	},
	{
		id: 'pauseai-global',
		title: 'PauseAI Global',
		description: {
			fr: 'Organisation mère et voix mondiale du mouvement.',
			en: 'Parent organization and global voice of the movement.'
		},
		url: 'https://pauseai.info/',
		langs: ['en'],
		category: 'newsletters',
		type: 'org',
		zone: 'plaine',
		logo: '/carte/logos/pauseai.svg'
	},
	{
		id: 'controlai',
		title: 'ControlAI',
		description: {
			fr: "Organisation britannique qui informe le grand public sur les risques d'une superintelligence et mène une campagne pour demander une régulation contraignante des IA les plus puissantes.",
			en: 'UK organization informing the public about superintelligence risks and campaigning for binding regulation of the most powerful AIs.'
		},
		url: 'https://controlai.com/',
		langs: ['en'],
		category: 'newsletters',
		type: 'org',
		zone: 'plaine',
		logo: '/carte/logos/controlai.png'
	},
	{
		id: 'cesia',
		title: {
			fr: "Centre pour la Sécurité de l'IA (CeSIA)",
			en: 'French Center for AI Safety (CeSIA)'
		},
		description: {
			fr: "Centre de recherche et d'enseignement consacré à la prévention des risques majeurs liés à l'IA.",
			en: 'Research and teaching center dedicated to preventing major AI risks.'
		},
		url: 'https://www.securite-ia.fr/',
		langs: ['fr'],
		category: 'newsletters',
		type: 'org',
		zone: 'village',
		logo: '/carte/logos/cesia.svg'
	},
	{
		id: 'transformer',
		title: 'Transformer',
		description: {
			fr: "Synthèse hebdomadaire de l'actualité de l'IA.",
			en: 'Weekly synthesis of AI news.'
		},
		url: 'https://www.transformernews.ai/',
		langs: ['en'],
		category: 'newsletters',
		type: 'newsletter',
		zone: 'monts',
		logo: '/carte/logos/transformer.png'
	},
	{
		id: 'contre-courant',
		title: 'À Contre-Courant',
		description: {
			fr: "Analyses du problème de l'alignement et des risques existentiels.",
			en: 'Analyses of the alignment problem and existential risks.'
		},
		url: 'https://romaindeleglise.substack.com/',
		langs: ['fr'],
		category: 'newsletters',
		type: 'newsletter',
		zone: 'monts',
		fallbackText: 'À.C.'
	},

	// ── AGIR ───────────────────────────────────────────────
	{
		id: 'emploi-ia',
		title: {
			fr: "L'IA ne détruira pas QUE votre emploi (Pause IA)",
			en: "AI won't just destroy your job (Pause IA)"
		},
		description: {
			fr: "Perte de contrôle croissante sur nos vies et sur nos sociétés. Venez témoigner, participer à l'enquête et envoyer un mail à vos représentants.",
			en: 'Growing loss of control over our lives and societies. Share your story, take part in the survey and email your representatives.'
		},
		url: '/fr/emploi-ia',
		internal: true,
		langs: ['fr'],
		category: 'agir',
		type: 'article'
	},
	{
		id: 'pause-action',
		title: { fr: 'Rejoindre Pause Action (Pause IA)', en: 'Join Pause Action (Pause IA)' },
		description: {
			fr: 'Chaque semaine une action en quelques clics pour faire pencher la balance (WhatsApp).',
			en: 'A weekly few-click action to tip the balance (WhatsApp).'
		},
		url: 'https://chat.whatsapp.com/LThhghXc0Hk3sTwQMyy1wU',
		langs: ['fr'],
		category: 'agir',
		type: 'article'
	},

	// ── ENTRÉES "MAP-ONLY" (existing carte content kept for the map) ──
	{
		id: 'fli',
		title: 'Future of Life Institute',
		description: {
			fr: "Institut de recherche et de plaidoyer sur les risques existentiels, à l'origine de la lettre ouverte de mars 2023.",
			en: 'Research and advocacy institute on existential risks, behind the March 2023 open letter.'
		},
		url: 'https://futureoflife.org/',
		langs: ['en'],
		category: 'newsletters',
		type: 'org',
		zone: 'plaine',
		logo: '/carte/logos/fli.svg'
	},
	{
		id: 'cais',
		title: 'CAIS',
		description: {
			fr: "Center for AI Safety : recherche académique sur les risques catastrophiques liés à l'IA.",
			en: 'Center for AI Safety: academic research on catastrophic AI risks.'
		},
		url: 'https://www.safe.ai/',
		langs: ['en'],
		category: 'newsletters',
		type: 'org',
		zone: 'village',
		logo: '/carte/logos/cais.png'
	},
	{
		id: 'miri',
		title: 'MIRI',
		description: {
			fr: "Machine Intelligence Research Institute : pionnier de la recherche sur l'alignement et les risques existentiels.",
			en: 'Machine Intelligence Research Institute: pioneer of alignment and existential-risk research.'
		},
		url: 'https://intelligence.org/',
		langs: ['en'],
		category: 'newsletters',
		type: 'org',
		zone: 'village',
		logo: '/carte/logos/miri.jpg'
	},
	{
		id: 'controlai-news',
		title: 'ControlAI News',
		description: {
			fr: "Newsletter de ControlAI sur les développements liés à la régulation et à la sécurité de l'IA.",
			en: 'ControlAI newsletter on developments in AI regulation and safety.'
		},
		url: 'https://controlai.news/',
		langs: ['en'],
		category: 'newsletters',
		type: 'newsletter',
		zone: 'monts',
		logo: '/carte/logos/controlai.png'
	},
	{
		id: 'cesia-newsletter',
		title: { fr: 'Newsletter CeSIA', en: 'CeSIA Newsletter' },
		description: {
			fr: "Newsletter du Centre pour la Sécurité de l'IA : actualités françaises de la recherche et de la prévention.",
			en: 'Newsletter of the French Center for AI Safety: French research and prevention updates.'
		},
		url: 'https://cesiafr.substack.com/',
		langs: ['fr'],
		category: 'newsletters',
		type: 'newsletter',
		zone: 'monts',
		logo: '/carte/logos/cesia.svg'
	},
	{
		id: 'cais-newsletter',
		title: 'AI Safety Newsletter (CAIS)',
		description: {
			fr: "Newsletter du Center for AI Safety : synthèse régulière sur les risques catastrophiques de l'IA.",
			en: 'Center for AI Safety newsletter: regular synthesis on catastrophic AI risks.'
		},
		url: 'https://newsletter.safe.ai/',
		langs: ['en'],
		category: 'newsletters',
		type: 'newsletter',
		zone: 'monts',
		logo: '/carte/logos/cais.png'
	},
	{
		id: 'ai-2027',
		title: 'AI 2027',
		description: {
			fr: "Scénario d'impact d'IAs surhumaines sur la décennie, par Daniel Kokotajlo et al.",
			en: 'Scenario of superhuman AIs impacting the decade, by Daniel Kokotajlo et al.'
		},
		url: 'https://ai-2027.com/',
		langs: ['en'],
		category: 'risques',
		type: 'article',
		subgroup: 'general',
		zone: 'avant-poste',
		fallbackText: '2027',
		date: 'avril 2025'
	},
	{
		id: 'intelligence-curse',
		title: 'The Intelligence Curse',
		description: {
			fr: 'Essai sur la perte graduelle du pouvoir humain, par Luke Drago et Rudolf Laine.',
			en: 'Essay on the gradual loss of human power, by Luke Drago and Rudolf Laine.'
		},
		url: 'https://intelligence-curse.ai/',
		langs: ['en'],
		category: 'risques',
		type: 'article',
		subgroup: 'general',
		zone: 'avant-poste',
		logo: '/carte/logos/intelligencecurse.jpg',
		logoSize: 'large',
		date: 'avril 2025'
	},
	{
		id: 'rand-agi-nations',
		title: 'RAND – AGI & the Coming State of Nations',
		description: {
			fr: "Analyse stratégique sur l'AGI dans le contexte géopolitique des États-nations.",
			en: 'Strategic analysis on AGI in the geopolitical context of nation-states.'
		},
		url: 'https://www.rand.org/pubs/perspectives/PEA3691-1.html',
		langs: ['en'],
		category: 'risques',
		type: 'paper',
		subgroup: 'general',
		zone: 'avant-poste',
		logo: '/carte/logos/rand.svg'
	},
	{
		id: 'aisafety-info',
		title: 'AISafety.info',
		description: {
			fr: "Wiki et FAQ communautaires sur la sécurité de l'IA.",
			en: 'Community-driven wiki and FAQ on AI safety.'
		},
		url: 'https://aisafety.info/',
		langs: ['en'],
		category: 'comprendre',
		type: 'site',
		subgroup: 'aller-plus-loin',
		zone: 'ile',
		logo: '/carte/logos/aisafetyinfo.png'
	},
	{
		id: 'pauseia-blog',
		title: { fr: 'Blog Pause IA', en: 'Pause IA Blog' },
		description: {
			fr: 'Articles et analyses du mouvement français.',
			en: 'Articles and analyses from the French branch of the movement.'
		},
		url: 'https://pauseia.substack.com/',
		langs: ['fr'],
		category: 'newsletters',
		type: 'newsletter',
		zone: 'foret',
		logo: '/carte/logos/pauseia.svg'
	},
	{
		id: 'cognition-cafe',
		title: 'Cognition Café',
		description: {
			fr: "Blog de Gabe (ControlAI) sur la sécurité de l'IA, les communautés et les risques existentiels.",
			en: "Gabe's blog (ControlAI) on AI safety, communities and existential risks."
		},
		url: 'https://cognition.cafe/',
		langs: ['en'],
		category: 'newsletters',
		type: 'newsletter',
		zone: 'foret',
		logo: '/carte/logos/cafe.png'
	},
	{
		id: 'dont-worry-vase',
		title: "Don't Worry About the Vase (Zvi)",
		description: {
			fr: "Blog d'analyse hebdomadaire de l'actualité IA par Zvi Mowshowitz.",
			en: 'Weekly AI-news analysis blog by Zvi Mowshowitz.'
		},
		url: 'https://thezvi.substack.com/',
		langs: ['en'],
		category: 'newsletters',
		type: 'newsletter',
		zone: 'foret',
		logo: '/carte/logos/zvi.png'
	}
]

// Injected at build time from `git log -1` on this file. See vite.config.ts.
// Declared inline so svelte-check picks it up without depending on app.d.ts.
declare const __RESOURCES_UPDATED__: string | undefined
export const RESOURCES_LAST_UPDATED: string =
	typeof __RESOURCES_UPDATED__ !== 'undefined' ? __RESOURCES_UPDATED__ : '2026-06-02'
