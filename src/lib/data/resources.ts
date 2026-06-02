// Single source of truth for both /ressources and /carte.
//
// Each resource may carry two orthogonal classifications:
//   - `category` (+ `subgroup`)  → used by the /ressources page
//   - `zone` (+ `logo` / coords) → used by the /carte page
// Resources without a zone simply do not appear on the map.

export type Lang = 'fr' | 'en'

export type Category =
	| 'pause-ia'
	| 'livres'
	| 'comprendre'
	| 'risques'
	| 'declarations'
	| 'newsletters'
	| 'agir'

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

export interface Resource {
	id: string
	title: string
	description: string
	url: string
	langs: Lang[]
	category: Category
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
	essentiels: 'Essentiels — alignement et risque existentiel',
	recommandes: 'Recommandés — contexte plus large',
	demarrer: 'Pour démarrer',
	'vue-ensemble': "Vue d'ensemble : capacités et tendances actuelles",
	'aller-plus-loin': 'Pour aller plus loin',
	general: "Perte de contrôle et menaces d'extinction",
	'recherche-alignement': 'Recherche en alignement (papiers fondateurs et empiriques)'
}

export const CATEGORY_ORDER: Category[] = [
	'pause-ia',
	'livres',
	'comprendre',
	'risques',
	'declarations',
	'newsletters',
	'agir'
]

export const resources: Resource[] = [
	// ── PAUSE IA ─────────────────────────────────────────────
	{
		id: 'pauseia-dangers',
		title: "Dangers pour les individus, la société et l'humanité",
		description:
			"Panorama des dangers allant de l'individuel, à la société jusqu'à la perte de contrôle.",
		url: '/dangers/pour-les-individus',
		internal: true,
		langs: ['fr'],
		category: 'pause-ia'
	},
	{
		id: 'pauseia-carte',
		title: "Comprendre l'IA et ses risques existentiels",
		description:
			"Parcourez visuellement ce qu'est l'IA et ses risques existentiels. Explications simplifiées, illustrées par des analogies.",
		url: '/carte',
		internal: true,
		langs: ['fr'],
		category: 'pause-ia'
	},

	// ── LIVRES ──────────────────────────────────────────────
	{
		id: 'book-ifanyone',
		title: 'If Anyone Builds It, Everyone Dies',
		description:
			"Eliezer Yudkowsky & Nate Soares, 2025. L'argument le plus complet et récent pour le risque d'extinction. Disponible gratuitement sur le site du livre.",
		url: 'https://ifanyonebuildsit.com/',
		langs: ['en'],
		category: 'livres',
		subgroup: 'essentiels',
		date: '2025'
	},
	{
		id: 'book-superintelligence',
		title: 'Superintelligence: Paths, Dangers, Strategies',
		description: "Nick Bostrom, 2014. L'ouvrage fondateur sur les risques de l'IA surhumaine.",
		url: 'https://www.amazon.fr/Superintelligence-Dangers-Strategies-Nick-Bostrom/dp/0199678111',
		langs: ['en'],
		category: 'livres',
		subgroup: 'essentiels',
		date: '2014'
	},
	{
		id: 'book-human-compatible',
		title: 'Human Compatible',
		description:
			"Stuart Russell, 2019. Le problème de l'alignement expliqué par l'auteur du manuel de référence en IA.",
		url: 'https://www.amazon.fr/Human-Compatible-Artificial-Intelligence-Problem/dp/0525558616',
		langs: ['en'],
		category: 'livres',
		subgroup: 'essentiels',
		date: '2019'
	},
	{
		id: 'book-precipice',
		title: 'The Precipice: Existential Risk and the Future of Humanity',
		description:
			"Toby Ord, 2020. Vue d'ensemble des risques existentiels. Le chapitre sur l'IA est excellent.",
		url: 'https://theprecipice.com/',
		langs: ['en'],
		category: 'livres',
		subgroup: 'essentiels',
		date: '2020'
	},
	{
		id: 'book-yampolskiy-unexplainable',
		title: 'AI: Unexplainable, Unpredictable, Uncontrollable',
		description: "Roman Yampolskiy, 2024. Arguments formels sur l'impossibilité du contrôle.",
		url: 'https://www.routledge.com/AI-Unexplainable-Unpredictable-Uncontrollable/Yampolskiy/p/book/9781032576275',
		langs: ['en'],
		category: 'livres',
		subgroup: 'essentiels',
		date: '2024'
	},
	{
		id: 'book-life3',
		title: 'Life 3.0 / La Vie 3.0',
		description:
			"Max Tegmark, 2017. Introduction accessible aux scénarios futurs de l'IA. Existe en français.",
		url: 'https://futureoflife.org/life-3-0/',
		langs: ['en', 'fr'],
		category: 'livres',
		subgroup: 'recommandes',
		date: '2017'
	},
	{
		id: 'book-alignment-problem',
		title: 'The Alignment Problem',
		description:
			"Brian Christian, 2020. Introduction narrative aux problèmes techniques de l'alignement.",
		url: 'https://brianchristian.org/the-alignment-problem/',
		langs: ['en'],
		category: 'livres',
		subgroup: 'recommandes',
		date: '2020'
	},
	{
		id: 'book-smarter-than-us',
		title: 'Smarter Than Us',
		description: 'Stuart Armstrong, 2014. Court et accessible, bonne première lecture.',
		url: 'https://intelligence.org/smarter-than-us/',
		langs: ['en'],
		category: 'livres',
		subgroup: 'recommandes',
		date: '2014'
	},
	{
		id: 'book-brief-history',
		title: 'A Brief History of Intelligence',
		description: "Max Bennett, 2023. Contexte sur l'intelligence biologique et artificielle.",
		url: 'https://www.harpercollins.com/products/a-brief-history-of-intelligence-max-bennett',
		langs: ['en'],
		category: 'livres',
		subgroup: 'recommandes',
		date: '2023'
	},
	{
		id: 'book-yampolskiy-asi',
		title: 'Artificial Superintelligence: A Futuristic Approach',
		description: 'Roman Yampolskiy, 2015. Analyse technique des scénarios de superintelligence.',
		url: 'https://www.routledge.com/Artificial-Superintelligence-A-Futuristic-Approach/Yampolskiy/p/book/9781482234435',
		langs: ['en'],
		category: 'livres',
		subgroup: 'recommandes',
		date: '2015'
	},

	// ── COMPRENDRE ──────────────────────────────────────────
	{
		id: '3b1b-llm',
		title: 'Comment fonctionne un LLM ? (3Blue1Brown)',
		description: 'Vidéo pédagogique pour saisir le fonctionnement des grands modèles de langage.',
		url: 'https://www.3blue1brown.com/lessons/mini-llm',
		langs: ['fr'],
		category: 'comprendre',
		subgroup: 'demarrer',
		date: 'nov. 2024'
	},
	{
		id: 'rob-miles',
		title: 'Rob Miles (YouTube)',
		description: "La meilleure chaîne de vulgarisation sur l'alignement.",
		url: 'https://www.youtube.com/@RobertMilesAI',
		langs: ['en'],
		category: 'comprendre',
		subgroup: 'demarrer',
		zone: 'delta',
		logo: '/carte/logos/robertmiles.jpg'
	},
	{
		id: 'cais-dashboard',
		title: 'CAIS Dashboard',
		description: 'Comparaison interactive des IA de pointe (capacité et sécurité).',
		url: 'https://dashboard.safe.ai/',
		langs: ['en'],
		category: 'comprendre',
		subgroup: 'vue-ensemble'
	},
	{
		id: 'epoch-benchmarks',
		title: 'Epoch AI Benchmarks',
		description:
			"Comparaison des performances selon le modèle en leur attribuant un score (à partir d'un ensemble d'évaluations de sécurité).",
		url: 'https://epoch.ai/benchmarks',
		langs: ['en'],
		category: 'comprendre',
		subgroup: 'vue-ensemble'
	},
	{
		id: 'metr-horizon',
		title: 'Long-horizon tasks (METR)',
		description: 'Évaluation de la longueur des tâches réalisées en autonomie.',
		url: 'https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/',
		langs: ['en'],
		category: 'comprendre',
		subgroup: 'vue-ensemble'
	},
	{
		id: 'agi-definition',
		title: "Définition de l'Intelligence Artificielle Générale (IAG)",
		description: 'Mesure de la polyvalence cognitive.',
		url: 'https://www.agidefinition.ai/',
		langs: ['en'],
		category: 'comprendre',
		subgroup: 'aller-plus-loin',
		date: 'octobre 2025'
	},
	{
		id: 'aisafety-map',
		title: 'AI Safety Map',
		description: "Carte existentielle de la sécurité de l'IA et ensemble de ressources.",
		url: 'https://www.aisafety.com/map',
		langs: ['en'],
		category: 'comprendre',
		subgroup: 'aller-plus-loin',
		zone: 'ile',
		logo: '/carte/logos/aisafety.png'
	},
	{
		id: 'intl-safety-report',
		title: "Rapport International sur la sécurité de l'IA 2026",
		description: 'État des lieux mondial de référence des capacités et des risques.',
		url: 'https://internationalaisafetyreport.org/',
		langs: ['fr', 'en'],
		category: 'comprendre',
		subgroup: 'aller-plus-loin'
	},

	// ── RISQUES EXISTENTIELS ────────────────────────────────
	{
		id: 'miri-briefing',
		title: 'Briefing on Extinction Threats (MIRI)',
		description: 'Synthèse des risques existentiels et pourquoi ils sont probables.',
		url: 'https://intelligence.org/briefing/',
		langs: ['en'],
		category: 'risques',
		subgroup: 'general'
	},
	{
		id: 'bengio-faq',
		title: 'FAQ on Catastrophic Risks (Yoshua Bengio)',
		description: 'Réponses aux questions fréquentes sur les risques catastrophiques.',
		url: 'https://yoshuabengio.org/2023/06/24/faq-on-catastrophic-ai-risks/',
		langs: ['fr', 'en'],
		category: 'risques',
		subgroup: 'general',
		date: 'juin 2023'
	},
	{
		id: 'pauseai-faq-prob',
		title: "Probabilité d'extinction par IA (PauseAI Global)",
		description: 'Quelle est la probabilité de conséquences catastrophiques ?',
		url: 'https://pauseai.info/faq#how-likely-is-it-that-superintelligent-ai-will-cause-very-bad-outcomes-like-human-extinction',
		langs: ['en'],
		category: 'risques',
		subgroup: 'general'
	},
	{
		id: 'the-compendium',
		title: 'The Compendium',
		description:
			"Ressource en ligne complète sur les risques existentiels de l'IA. Couvre les arguments techniques, les scénarios, et les propositions de solutions.",
		url: 'https://www.thecompendium.ai/',
		langs: ['en'],
		category: 'risques',
		subgroup: 'general',
		zone: 'ile',
		logo: '/carte/logos/compendium.png'
	},
	{
		id: 'miri-problem',
		title: 'The Problem (MIRI)',
		description: "Description complète du problème de l'alignement.",
		url: 'https://intelligence.org/the-problem/',
		langs: ['en'],
		category: 'risques',
		subgroup: 'general'
	},
	{
		id: 'miri-governance',
		title: 'AI Governance to Avoid Extinction (MIRI)',
		description: 'Propositions concrètes de gouvernance et scénario de moratoire mondial.',
		url: 'https://intelligence.org/2026/04/13/summary-ai-governance-to-avoid-extinction/',
		langs: ['en'],
		category: 'risques',
		subgroup: 'general',
		zone: 'avant-poste',
		logo: '/carte/logos/miri.jpg'
	},
	{
		id: 'agi-ruin',
		title: 'AGI Ruin: A List of Lethalities',
		description:
			"Liste détaillée des raisons pour lesquelles l'alignement est extrêmement difficile avec les approches actuelles.",
		url: 'https://www.lesswrong.com/posts/uMQ3cqWDPHhjtiesc/agi-ruin-a-list-of-lethalities',
		langs: ['en'],
		category: 'risques',
		subgroup: 'general',
		date: 'juin 2022'
	},

	// Papiers fondateurs en alignement
	{
		id: 'hubinger-mesa',
		title: 'Risks from Learned Optimization',
		description:
			'Hubinger et al., 2019. Papier fondateur sur la mesa-optimisation et l’alignement déceptif.',
		url: 'https://arxiv.org/abs/1906.01820',
		langs: ['en'],
		category: 'risques',
		subgroup: 'recherche-alignement',
		date: '2019'
	},
	{
		id: 'bostrom-superintelligent-will',
		title: 'The Superintelligent Will',
		description:
			"Nick Bostrom. Présentation de la thèse de l'orthogonalité et de la convergence instrumentale.",
		url: 'https://nickbostrom.com/superintelligentwill.pdf',
		langs: ['en'],
		category: 'risques',
		subgroup: 'recherche-alignement',
		date: '2012'
	},
	{
		id: 'turner-power-seeking',
		title: 'Optimal Policies Tend to Seek Power',
		description: 'Turner et al., 2021. Preuve formelle de la convergence instrumentale.',
		url: 'https://arxiv.org/abs/1912.01683',
		langs: ['en'],
		category: 'risques',
		subgroup: 'recherche-alignement',
		date: '2021'
	},
	{
		id: 'carlsmith-power-seeking',
		title: 'Is Power-Seeking AI an Existential Risk?',
		description:
			"Joseph Carlsmith, 2022. Décomposition argumentée du risque existentiel lié à l'IA en quête de pouvoir.",
		url: 'https://arxiv.org/abs/2206.13353',
		langs: ['en'],
		category: 'risques',
		subgroup: 'recherche-alignement',
		date: '2022'
	},
	{
		id: 'alignment-faking',
		title: 'Alignment Faking in Large Language Models',
		description:
			"Greenblatt et al. (Anthropic & Redwood), 2024. Observation empirique : Claude 3 Opus simule l'alignement pendant l'entraînement.",
		url: 'https://arxiv.org/abs/2412.14093',
		langs: ['en'],
		category: 'risques',
		subgroup: 'recherche-alignement',
		date: 'déc. 2024'
	},
	{
		id: 'apollo-scheming',
		title: 'Frontier Models are Capable of In-Context Scheming',
		description:
			'Apollo Research, 2024. Observation de comportements de "scheming" (tromperie stratégique, tentatives d\'exfiltration) dans o1 et Claude 3.5 Sonnet.',
		url: 'https://www.apolloresearch.ai/research/scheming-reasoning-evaluations',
		langs: ['en'],
		category: 'risques',
		subgroup: 'recherche-alignement',
		date: '2024'
	},

	// ── DÉCLARATIONS ────────────────────────────────────────
	{
		id: 'red-lines',
		title: "Lignes Rouges pour l'IA (CeSIA)",
		description: 'Propositions de limites à ne pas franchir.',
		url: 'https://red-lines.ai/',
		langs: ['fr'],
		category: 'declarations',
		date: 'septembre 2025'
	},
	{
		id: 'superintelligence-statement',
		title: 'Déclaration sur la Superintelligence (FLI)',
		description:
			'Appel international à interdire le développement de superintelligence artificielle.',
		url: 'https://superintelligence-statement.org/',
		langs: ['en'],
		category: 'declarations',
		date: 'octobre 2025'
	},
	{
		id: 'cais-statement',
		title: 'Statement on AI Risk (CAIS)',
		description:
			"« La réduction du risque d'extinction lié à l'IA devrait être une priorité mondiale au même titre que les pandémies et la guerre nucléaire. »",
		url: 'https://aistatement.com/',
		langs: ['en'],
		category: 'declarations',
		date: 'mai 2023'
	},

	// ── NEWSLETTERS / SUIVRE L'ACTU ─────────────────────────
	{
		id: 'pauseia-newsletter',
		title: 'Pause IA',
		description: 'Actualités et nouvelles du mouvement en France.',
		url: 'https://pauseia.fr/fr/newsletters',
		langs: ['fr'],
		category: 'newsletters',
		zone: 'monts',
		logo: '/carte/logos/pauseia_newsletter.svg'
	},
	{
		id: 'pauseai-global',
		title: 'PauseAI Global',
		description: 'Organisation mère et voix mondiale du mouvement.',
		url: 'https://pauseai.info/',
		langs: ['en'],
		category: 'newsletters',
		zone: 'plaine',
		logo: '/carte/logos/pauseai.svg'
	},
	{
		id: 'controlai',
		title: 'ControlAI',
		description:
			"Organisation sœur anglaise qui informe le grand public sur les risques d'une superintelligence. Mène actuellement une campagne pour demander une régulation contraignante des IA les plus puissantes.",
		url: 'https://controlai.com/',
		langs: ['en'],
		category: 'newsletters',
		zone: 'plaine',
		logo: '/carte/logos/controlai.png'
	},
	{
		id: 'cesia',
		title: "Centre pour la Sécurité de l'IA (CeSIA)",
		description:
			"Centre de recherche et d'enseignement consacré à la prévention des risques majeurs liés à l'IA.",
		url: 'https://www.securite-ia.fr/',
		langs: ['fr'],
		category: 'newsletters',
		zone: 'village',
		logo: '/carte/logos/cesia.svg'
	},
	{
		id: 'transformer',
		title: 'Transformer',
		description: "Synthèse hebdomadaire de l'actualité de l'IA.",
		url: 'https://www.transformernews.ai/',
		langs: ['en'],
		category: 'newsletters',
		zone: 'monts',
		logo: '/carte/logos/transformer.png'
	},
	{
		id: 'contre-courant',
		title: 'À Contre-Courant',
		description: "Analyses du problème de l'alignement et des risques existentiels.",
		url: 'https://romaindeleglise.substack.com/',
		langs: ['fr'],
		category: 'newsletters',
		zone: 'monts',
		fallbackText: 'À.C.'
	},

	// ── AGIR ───────────────────────────────────────────────
	{
		id: 'emploi-ia',
		title: "L'IA ne détruira pas QUE votre emploi (Pause IA)",
		description:
			'Perte de contrôle croissante sur nos vies et sur nos sociétés. Venez témoigner, participer à l’enquête et envoyer un mail à vos représentants.',
		url: '/fr/emploi-ia',
		internal: true,
		langs: ['fr'],
		category: 'agir'
	},
	{
		id: 'pause-action',
		title: 'Rejoindre Pause Action (Pause IA)',
		description:
			'Chaque semaine une action en quelques clics pour faire pencher la balance (WhatsApp).',
		url: 'https://chat.whatsapp.com/LThhghXc0Hk3sTwQMyy1wU',
		langs: ['fr'],
		category: 'agir'
	},

	// ── ENTRÉES "MAP-ONLY" (existing carte content kept for the map) ──
	{
		id: 'fli',
		title: 'Future of Life Institute',
		description:
			"Institut de recherche et de plaidoyer sur les risques existentiels, à l'origine de la lettre ouverte de mars 2023.",
		url: 'https://futureoflife.org/',
		langs: ['en'],
		category: 'newsletters',
		zone: 'plaine',
		logo: '/carte/logos/fli.svg'
	},
	{
		id: 'cais',
		title: 'CAIS',
		description:
			"Center for AI Safety : recherche académique sur les risques catastrophiques liés à l'IA.",
		url: 'https://www.safe.ai/',
		langs: ['en'],
		category: 'newsletters',
		zone: 'village',
		logo: '/carte/logos/cais.png'
	},
	{
		id: 'miri',
		title: 'MIRI',
		description:
			"Machine Intelligence Research Institute : pionnier de la recherche sur l'alignement et les risques existentiels.",
		url: 'https://intelligence.org/',
		langs: ['en'],
		category: 'newsletters',
		zone: 'village',
		logo: '/carte/logos/miri.jpg'
	},
	{
		id: 'controlai-news',
		title: 'ControlAI News',
		description:
			"Newsletter de ControlAI sur les développements liés à la régulation et à la sécurité de l'IA.",
		url: 'https://controlai.news/',
		langs: ['en'],
		category: 'newsletters',
		zone: 'monts',
		logo: '/carte/logos/controlai.png'
	},
	{
		id: 'cesia-newsletter',
		title: 'Newsletter CeSIA',
		description:
			"Newsletter du Centre pour la Sécurité de l'IA : actualités françaises de la recherche et de la prévention.",
		url: 'https://cesiafr.substack.com/',
		langs: ['fr'],
		category: 'newsletters',
		zone: 'monts',
		logo: '/carte/logos/cesia.svg'
	},
	{
		id: 'cais-newsletter',
		title: 'AI Safety Newsletter (CAIS)',
		description:
			"Newsletter du Center for AI Safety : synthèse régulière sur les risques catastrophiques de l'IA.",
		url: 'https://newsletter.safe.ai/',
		langs: ['en'],
		category: 'newsletters',
		zone: 'monts',
		logo: '/carte/logos/cais.png'
	},
	{
		id: 'situational-awareness',
		title: 'Situational Awareness',
		description:
			"Prévisions de Leopold Aschenbrenner sur l'AGI et la superintelligence d'ici 2027-2030.",
		url: 'https://situational-awareness.ai/',
		langs: ['en'],
		category: 'risques',
		subgroup: 'general',
		zone: 'avant-poste',
		fallbackText: 'S.A.',
		date: 'juin 2024'
	},
	{
		id: 'ai-2027',
		title: 'AI 2027',
		description: "Scénario d'impact d'IAs surhumaines sur la décennie, par Daniel Kokotajlo et al.",
		url: 'https://ai-2027.com/',
		langs: ['en'],
		category: 'risques',
		subgroup: 'general',
		zone: 'avant-poste',
		fallbackText: '2027',
		date: 'avril 2025'
	},
	{
		id: 'intelligence-curse',
		title: 'The Intelligence Curse',
		description: 'Essai sur la perte graduelle du pouvoir humain, par Luke Drago et Rudolf Laine.',
		url: 'https://intelligence-curse.ai/',
		langs: ['en'],
		category: 'risques',
		subgroup: 'general',
		zone: 'avant-poste',
		logo: '/carte/logos/intelligencecurse.jpg',
		logoSize: 'large',
		date: 'avril 2025'
	},
	{
		id: 'rand-agi-nations',
		title: 'RAND – AGI & the Coming State of Nations',
		description: "Analyse stratégique sur l'AGI dans le contexte géopolitique des États-nations.",
		url: 'https://www.rand.org/pubs/perspectives/PEA3691-1.html',
		langs: ['en'],
		category: 'risques',
		subgroup: 'general',
		zone: 'avant-poste',
		logo: '/carte/logos/rand.svg'
	},
	{
		id: 'aisafety-info',
		title: 'AISafety.info',
		description: "Wiki et FAQ communautaires sur la sécurité de l'IA.",
		url: 'https://aisafety.info/',
		langs: ['en'],
		category: 'comprendre',
		subgroup: 'aller-plus-loin',
		zone: 'ile',
		logo: '/carte/logos/aisafetyinfo.png'
	},
	{
		id: 'le-futurologue-yt',
		title: 'Le Futurologue (YouTube)',
		description: "Chaîne francophone sur le futur, l'IA et les risques existentiels.",
		url: 'https://www.youtube.com/@LeFuturologue',
		langs: ['fr'],
		category: 'comprendre',
		subgroup: 'demarrer',
		zone: 'delta',
		logo: '/carte/logos/lefuturologue.jpg'
	},
	{
		id: 'the-flares-yt',
		title: 'The Flares (YouTube)',
		description: 'Chaîne francophone sur les risques existentiels et la prospective.',
		url: 'https://www.youtube.com/@TheFlares',
		langs: ['fr'],
		category: 'comprendre',
		subgroup: 'demarrer',
		zone: 'delta',
		logo: '/carte/logos/theflares.jpg'
	},
	{
		id: 'mr-phi',
		title: 'Monsieur Phi',
		description: "Vulgarisation philosophique, dont des épisodes dédiés à l'alignement.",
		url: 'https://www.youtube.com/@MonsieurPhi',
		langs: ['fr'],
		category: 'comprendre',
		subgroup: 'demarrer',
		zone: 'delta',
		logo: '/carte/logos/mrphi.jpg'
	},
	{
		id: 'rational-animations',
		title: 'Rational Animations',
		description: "Vidéos animées sur la rationalité, l'IA et les risques.",
		url: 'https://www.youtube.com/@RationalAnimations',
		langs: ['en'],
		category: 'comprendre',
		subgroup: 'demarrer',
		zone: 'delta',
		logo: '/carte/logos/rationalanimations.jpg'
	},
	{
		id: 'ai-in-context',
		title: 'AI in Context',
		description: "Chaîne vidéo qui contextualise les développements récents de l'IA.",
		url: 'https://www.youtube.com/@aiincontext',
		langs: ['en'],
		category: 'comprendre',
		subgroup: 'demarrer',
		zone: 'delta',
		logo: '/carte/logos/aiincontext.jpg'
	},
	{
		id: 'species-agi',
		title: 'Species – The AGI documentary',
		description: "Documentaire sur l'arrivée de l'AGI.",
		url: 'https://www.species-film.com/',
		langs: ['en'],
		category: 'comprendre',
		subgroup: 'aller-plus-loin',
		zone: 'delta',
		logo: '/carte/logos/species.jpg'
	},
	{
		id: 'siliconversations',
		title: 'Siliconversations',
		description: "Vidéos d'analyse sur l'IA, l'alignement et les risques.",
		url: 'https://www.youtube.com/@Siliconversations',
		langs: ['en'],
		category: 'comprendre',
		subgroup: 'demarrer',
		zone: 'delta',
		logo: '/carte/logos/siliconversations.jpg'
	},
	{
		id: 'lethal-intelligence',
		title: 'Lethal Intelligence',
		description: 'Vidéos courtes percutantes sur les risques existentiels.',
		url: 'https://www.youtube.com/@lethal-intelligence',
		langs: ['en'],
		category: 'comprendre',
		subgroup: 'demarrer',
		zone: 'delta',
		logo: '/carte/logos/lethal.jpg'
	},
	{
		id: 'le-futurologue-pod',
		title: 'Le Futurologue (podcast)',
		description: "Podcast francophone sur le futur et l'IA.",
		url: 'https://www.youtube.com/@LeFuturologue',
		langs: ['fr'],
		category: 'comprendre',
		subgroup: 'demarrer',
		zone: 'rives',
		logo: '/carte/logos/lefuturologue.jpg'
	},
	{
		id: 'the-flares-pod',
		title: 'The Flares (podcast)',
		description: 'Podcast francophone sur les risques existentiels.',
		url: 'https://theflares.com/podcasts/',
		langs: ['fr'],
		category: 'comprendre',
		subgroup: 'demarrer',
		zone: 'rives',
		logo: '/carte/logos/theflares.jpg'
	},
	{
		id: 'fli-pod',
		title: 'Future of Life Institute Podcast',
		description: "Podcast d'entretiens approfondis sur la sécurité de l'IA.",
		url: 'https://futureoflife.org/podcast/',
		langs: ['en'],
		category: 'comprendre',
		subgroup: 'demarrer',
		zone: 'rives',
		logo: '/carte/logos/fli.svg'
	},
	{
		id: 'doom-debates',
		title: 'Doom Debates',
		description: 'Podcast de débats sur le p(doom) et les risques existentiels.',
		url: 'https://www.youtube.com/@DoomDebates',
		langs: ['en'],
		category: 'comprendre',
		subgroup: 'demarrer',
		zone: 'rives',
		logo: '/carte/logos/doomdebate.jpg'
	},
	{
		id: '80000-hours',
		title: '80,000 Hours Podcast',
		description: 'Carrière à fort impact, dont la sécurité IA.',
		url: 'https://80000hours.org/podcast/',
		langs: ['en'],
		category: 'comprendre',
		subgroup: 'demarrer',
		zone: 'rives',
		logo: '/carte/logos/80000.png'
	},
	{
		id: 'pauseia-blog',
		title: 'Blog Pause IA',
		description: 'Articles et analyses du mouvement français.',
		url: 'https://pauseia.substack.com/',
		langs: ['fr'],
		category: 'newsletters',
		zone: 'foret',
		logo: '/carte/logos/pauseia.svg'
	},
	{
		id: 'pauseai-blog',
		title: 'Blog PauseAI',
		description: 'Articles du mouvement international.',
		url: 'https://pauseai.info/blog',
		langs: ['en'],
		category: 'newsletters',
		zone: 'foret',
		logo: '/carte/logos/pauseai.svg'
	},
	{
		id: 'cognition-cafe',
		title: 'Café Cognition',
		description: 'Blog francophone sur la cognition et l’IA.',
		url: 'https://cafe-cognition.fr/',
		langs: ['fr'],
		category: 'newsletters',
		zone: 'foret',
		logo: '/carte/logos/cafe.png'
	},
	{
		id: 'dont-worry-vase',
		title: "Don't Worry About the Vase (Zvi)",
		description: "Blog d'analyse hebdomadaire de l'actualité IA par Zvi Mowshowitz.",
		url: 'https://thezvi.substack.com/',
		langs: ['en'],
		category: 'newsletters',
		zone: 'foret',
		logo: '/carte/logos/zvi.png'
	}
]

export const RESOURCES_LAST_UPDATED = '2026-06-02'
