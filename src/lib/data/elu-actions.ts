// Moteur d'« actions » pour la page « Écrire à mes élus ».
//
// Chaque action définit le CONTENU de l'email (objet, accroches, angles, appel…)
// ET sa CIBLE :
//   - 'representatives' : les élus de l'utilisateur, trouvés par code postal
//     (comportement par défaut, générique).
//   - 'fixed' : une liste de destinataires précis (un ministre, les membres
//     d'une commission, le Premier ministre…), sans code postal.
//
// On sélectionne l'action via l'URL : /ecrire-a-mes-elus?action=<id>
// (sans paramètre → action « default »). L'équipe com peut donc lancer une
// action ciblée pour un moment-clé (un vote, une audition, le G7) en ajoutant
// une entrée ici, puis en partageant le lien correspondant.
//
// Règle de style : aucun tiret long (—) dans les textes destinés aux utilisateurs.

export type Bilingual = { fr: string; en: string }

/** Un destinataire précis pour une action ciblée (ministre, commission…). */
export interface FixedTarget {
	id: string
	nom: string
	/** Civilité, pour la formule d'appel quand on ne fournit pas `salutation`. */
	civ?: 'M' | 'Mme' | null
	role: 'depute' | 'senateur' | 'ministre' | 'autre'
	email: string | null
	contactUrl?: string | null
	photo?: string | null
	/** Fonction affichée sous le nom (ex. « Ministre chargé du Numérique »). */
	fonction?: Bilingual
	/** Formule d'appel sur mesure (ex. « Monsieur le Premier ministre, »). */
	salutation?: Bilingual
}

export interface ActionAngle {
	id: string
	label: Bilingual
	/** Paragraphe « focus » du message pour cet angle. */
	focus: Bilingual
	/** Paragraphe ajouté en version détaillée (facultatif). */
	complementLong?: Bilingual
}

export interface EluAction {
	id: string
	status: 'active' | 'ended'
	targeting: 'representatives' | 'fixed'
	/** Destinataires précis (requis si targeting = 'fixed'). */
	fixedTargets?: FixedTarget[]
	/** Intitulé du groupe de destinataires en mode 'fixed' (ex. « Le gouvernement »). */
	targetsHeading?: Bilingual
	/** Métadonnées SEO de la page. */
	meta: { title: Bilingual; description: Bilingual }
	/** Bandeau d'en-tête. */
	hero: { title: Bilingual; subtitle: Bilingual }
	/** Objets tournants (un tiré au hasard par visiteur). */
	subjects: Bilingual[]
	/** Accroches tournantes (une tirée au hasard par visiteur). */
	hooks: Bilingual[]
	/** Angles proposés (le 1er est l'angle par défaut). */
	angles: ActionAngle[]
	/** Sondage ajouté en version détaillée (facultatif). */
	poll?: Bilingual
	/** Reconnaissance des bénéfices, juste avant l'appel (toujours présent). */
	balance: Bilingual
	/** L'appel à l'action (toujours présent). */
	ask: Bilingual
	/** Proposer le choix courte / détaillée ? */
	hasDetailed: boolean
}

// ──────────────────────────────────────────────────────────────────────────
// Action par défaut : message générique vers les élus de l'utilisateur.
// (Contenu historique de la page.)
// ──────────────────────────────────────────────────────────────────────────
const DEFAULT_ACTION: EluAction = {
	id: 'default',
	status: 'active',
	targeting: 'representatives',
	meta: {
		title: {
			fr: 'Écrivez à vos élus | Pause IA',
			en: 'Write to your representatives | Pause AI'
		},
		description: {
			fr: "Prenez 2 minutes pour écrire à votre député et à votre sénateur sur les risques des systèmes d'IA. Entrez votre code postal et envoyez un email prêt à l'emploi.",
			en: 'Take 2 minutes to write to your MP and senator about the risks of advanced AI systems. Enter your postal code and send a ready-made email.'
		}
	},
	hero: {
		title: { fr: 'Écrivez à vos élus', en: 'Write to your representatives' },
		subtitle: {
			fr: 'Les IA les plus puissantes se développent sans véritable garde-fou. Vos élus peuvent changer ça. Écrivez-leur : cela prend deux minutes.',
			en: 'The most powerful AI is being built with no real safeguards. Your representatives can change that. Write to them: it takes two minutes.'
		}
	},
	subjects: [
		{
			fr: 'Encadrer le développement des IA les plus puissantes',
			en: 'Governing the most powerful AI systems'
		},
		{
			fr: "Mettre en pause l'IA la plus avancée tant qu'elle n'est pas sous contrôle",
			en: 'Pausing the most advanced AI until it is under control'
		},
		{
			fr: "Préoccupation d'un électeur sur les risques de l'IA",
			en: "A constituent's concern about the risks of AI"
		},
		{
			fr: "Pour une gouvernance démocratique de l'intelligence artificielle",
			en: 'For democratic governance of artificial intelligence'
		}
	],
	hooks: [
		{
			fr: "Je vous écris parce que la vitesse à laquelle se développent les intelligences artificielles les plus puissantes me préoccupe. Ce qui m'inquiète n'est pas la science-fiction : ce sont les dirigeants de ces laboratoires eux-mêmes qui reconnaissent publiquement que leurs systèmes pourraient, à terme, échapper à notre contrôle.",
			en: 'I am writing because I am worried about the speed at which the most powerful artificial intelligence systems are being developed. What concerns me is not science fiction: it is the leaders of these very labs who publicly acknowledge that their systems could, in time, escape our control.'
		},
		{
			fr: "La tournure que prend le développement de l'intelligence artificielle m'inquiète. En mai 2023, des centaines de chercheurs et les dirigeants des principaux laboratoires d'IA ont signé une même phrase : « Atténuer le risque d'extinction lié à l'IA devrait être une priorité mondiale, au même titre que les pandémies ou la guerre nucléaire. » Quand ceux qui construisent cette technologie lancent eux-mêmes une telle alerte, il me semble que nous devons l'écouter.",
			en: 'I am a citizen worried about the direction AI development is taking. In May 2023, hundreds of researchers and the leaders of the main AI labs signed a single sentence: "Mitigating the risk of extinction from AI should be a global priority, alongside other societal-scale risks such as pandemics and nuclear war." When the very people building this technology raise such a warning, it seems to me we should listen.'
		},
		{
			fr: "Comme beaucoup, j'observe avec un mélange d'enthousiasme et d'inquiétude les progrès rapides de l'intelligence artificielle. L'inquiétude l'emporte quand des scientifiques parmi les plus respectés, comme les prix Turing Yoshua Bengio et Geoffrey Hinton, expliquent que personne ne sait aujourd'hui garantir le contrôle des systèmes les plus avancés.",
			en: 'Like many people, I watch the rapid progress of artificial intelligence with a mix of enthusiasm and concern. Concern wins out when some of the most respected scientists, such as Turing laureates Yoshua Bengio and Geoffrey Hinton, explain that no one today knows how to guarantee control of the most advanced systems.'
		}
	],
	angles: [
		{
			id: 'ensemble',
			label: { fr: "Vue d'ensemble", en: 'Overview' },
			focus: {
				fr: 'Ces dangers ne sont pas tous lointains : certains sont déjà là, comme la désinformation de masse ou la surveillance, tandis que la course à des systèmes toujours plus autonomes fait planer un risque bien plus grave encore.',
				en: 'These dangers are not all distant: some are already here, such as mass disinformation or surveillance, while the race toward ever more autonomous systems raises an even graver risk.'
			},
			complementLong: {
				fr: "Et même en mettant de côté ces effets immédiats, une question demeure : nous nous apprêtons à créer des intelligences supérieures à la nôtre sans aucune garantie de pouvoir les garder sous contrôle. C'est ce pari que je trouve déraisonnable.",
				en: 'And even setting aside these immediate effects, one question remains: we are about to create intelligences greater than our own with no guarantee of keeping them under control. It is this gamble that I find unreasonable.'
			}
		},
		{
			id: 'existentiel',
			label: { fr: 'Risque existentiel', en: 'Existential risk' },
			focus: {
				fr: "Ce qui me préoccupe le plus est le risque le plus extrême : en construisant des machines plus intelligentes que nous sans savoir les maîtriser, nous prenons un pari dont l'humanité pourrait ne jamais se relever. Ce n'est plus une crainte marginale, mais une inquiétude partagée au plus haut niveau de la recherche.",
				en: 'What worries me most is the most extreme risk: by building machines more intelligent than us without knowing how to control them, we are taking a gamble humanity might never recover from. This is no longer a fringe fear, but a concern shared at the highest levels of research.'
			},
			complementLong: {
				fr: "Ce risque n'efface pas les autres : vie privée, désinformation, emploi, armes autonomes. Tous appellent la même prudence, celle de prendre le temps de comprendre avant de déployer.",
				en: 'This risk does not erase the others: privacy, disinformation, jobs, autonomous weapons. They all call for the same caution, that of taking the time to understand before deploying.'
			}
		},
		{
			id: 'societe',
			label: { fr: 'Risques pour la société', en: 'Risks to society' },
			focus: {
				fr: "Au-delà du long terme, ces systèmes fragilisent déjà notre société : deepfakes et désinformation qui minent le débat démocratique, surveillance et profilage qui menacent la vie privée, automatisation qui déstabilise l'emploi et risque d'aggraver les inégalités.",
				en: 'Beyond the long term, these systems are already straining our society: deepfakes and disinformation that erode democratic debate, surveillance and profiling that threaten privacy, and automation that destabilises jobs and could deepen inequality.'
			},
			complementLong: {
				fr: "Et même en mettant de côté ces effets immédiats, une question demeure : nous nous apprêtons à créer des intelligences supérieures à la nôtre sans aucune garantie de pouvoir les garder sous contrôle. C'est ce pari que je trouve déraisonnable.",
				en: 'And even setting aside these immediate effects, one question remains: we are about to create intelligences greater than our own with no guarantee of keeping them under control. It is this gamble that I find unreasonable.'
			}
		}
	],
	poll: {
		fr: "Cette préoccupation est largement partagée : selon un récent sondage, seuls 8 % des Français souhaitent accélérer le développement de l'IA, et près de huit sur dix sont favorables à des accords internationaux interdisant les capacités d'IA qui menacent la vie humaine ou les droits fondamentaux.",
		en: 'This concern is widely shared: according to a recent poll, only 8% of French people want to accelerate AI development, and nearly eight in ten support international agreements banning AI capabilities that threaten human life or fundamental rights.'
	},
	balance: {
		fr: "Je ne m'oppose pas au progrès : l'IA peut rendre d'immenses services, en médecine, dans la recherche ou au quotidien. C'est précisément parce que cette technologie est puissante qu'elle mérite d'être développée avec prudence et sous contrôle démocratique.",
		en: 'I am not against progress: AI can bring immense benefits, in medicine, research and everyday life. It is precisely because this technology is so powerful that it deserves to be developed with caution and under democratic oversight.'
	},
	ask: {
		fr: "C'est pourquoi je vous demande de soutenir publiquement une gouvernance internationale visant à mettre en pause l'entraînement des modèles d'IA les plus avancés, tant que leur sûreté et leur contrôle démocratique ne sont pas démontrés, et de porter cette position aux niveaux français et européen. L'association Pause IA (pauseia.fr) se tient à votre disposition, ainsi que celle de votre équipe, pour en échanger.",
		en: 'That is why I ask you to publicly support international governance aimed at pausing the training of the most advanced AI models, until their safety and democratic control are demonstrated, and to carry this position at the French and European level. The Pause AI association (pauseia.fr) would be glad to discuss this with you or your team.'
	},
	hasDetailed: true
}

// ──────────────────────────────────────────────────────────────────────────
// Exemple d'action CIBLÉE (gabarit pour l'équipe com).
// Démontre le mode 'fixed' sans donnée inventée : on cible une fonction
// institutionnelle (pas une personne nommée), sans email mais avec un lien de
// contact officiel → l'utilisateur copie le texte et utilise le formulaire.
// À dupliquer / adapter pour un vrai moment-clé (un ministre, une commission).
// ──────────────────────────────────────────────────────────────────────────
const EXEMPLE_GOUVERNEMENT: EluAction = {
	...DEFAULT_ACTION,
	id: 'exemple-gouvernement',
	status: 'ended', // gabarit : non mis en avant
	targeting: 'fixed',
	targetsHeading: { fr: 'Le gouvernement', en: 'The government' },
	fixedTargets: [
		{
			id: 'premier-ministre',
			nom: 'Le Premier ministre',
			role: 'autre',
			email: null,
			contactUrl: 'https://www.gouvernement.fr/nous-contacter',
			fonction: { fr: 'Chef du gouvernement', en: 'Head of government' },
			salutation: { fr: 'Monsieur le Premier ministre,', en: 'Dear Prime Minister,' }
		}
	],
	meta: {
		title: {
			fr: 'Écrire au gouvernement | Pause IA',
			en: 'Write to the government | Pause AI'
		},
		description: {
			fr: "Demandez au gouvernement d'agir pour encadrer les IA les plus puissantes.",
			en: 'Ask the government to act on governing the most powerful AI systems.'
		}
	},
	hero: {
		title: { fr: 'Écrire au gouvernement', en: 'Write to the government' },
		subtitle: {
			fr: "Demandez au gouvernement de porter une gouvernance internationale de l'IA. Un message prêt à personnaliser.",
			en: 'Ask the government to champion international AI governance. A ready-to-personalise message.'
		}
	}
}

// ──────────────────────────────────────────────────────────────────────────
// Action « médias » : demander aux grandes rédactions nationales de couvrir
// davantage les risques de l'IA. Cible fixe (targeting: 'fixed'), ton « lecteur
// qui demande plus de couverture » (et non « citoyen qui écrit à son élu »).
//
// ⚠️ CONTACTS À VÉRIFIER AVANT LANCEMENT (com) : les canaux ci-dessous ne sont
// certains que pour Le Monde (email public « courrier des lecteurs ») et
// Libération (formulaire de contact officiel). Pour les autres titres, le lien
// pointe vers la page de contact/assistance officielle mais doit être confirmé,
// et un email direct « courrier des lecteurs » peut être ajouté s'il est public.
// Tant qu'un email n'est pas renseigné, l'outil propose « copier le texte » +
// ouverture du formulaire, ce qui reste parfaitement fonctionnel.
//
// Remarque efficacité : tout le monde écrit aux MÊMES adresses. Des messages
// quasi identiques sont vite repérés et perdent tout poids. La phrase
// personnelle (proposée à l'étape 2) est donc ici essentielle, pas optionnelle.
// ──────────────────────────────────────────────────────────────────────────
const COURRIER_LECTEURS: Bilingual = { fr: 'Courrier des lecteurs', en: 'Readers’ letters' }
const REDACTION: Bilingual = { fr: 'Rédaction', en: 'Newsroom' }

const MEDIAS: EluAction = {
	id: 'medias',
	status: 'active',
	targeting: 'fixed',
	targetsHeading: { fr: 'Les grandes rédactions nationales', en: 'Major national newsrooms' },
	fixedTargets: [
		{
			id: 'le-monde',
			nom: 'Le Monde',
			role: 'autre',
			email: 'courrier-des-lecteurs@lemonde.fr',
			fonction: COURRIER_LECTEURS
		},
		{
			id: 'liberation',
			nom: 'Libération',
			role: 'autre',
			email: null,
			contactUrl: 'https://www.liberation.fr/contact/',
			fonction: REDACTION
		},
		{
			id: 'le-figaro',
			nom: 'Le Figaro',
			role: 'autre',
			email: null,
			contactUrl: 'https://www.lefigaro.fr/assistance',
			fonction: REDACTION
		},
		{
			id: 'le-parisien',
			nom: 'Le Parisien',
			role: 'autre',
			email: null,
			contactUrl: 'https://www.leparisien.fr/services/contactez-nous/',
			fonction: REDACTION
		},
		{
			id: 'ouest-france',
			nom: 'Ouest-France',
			role: 'autre',
			email: null,
			contactUrl: 'https://www.ouest-france.fr/services/contact/',
			fonction: REDACTION
		},
		{
			id: 'les-echos',
			nom: 'Les Échos',
			role: 'autre',
			email: null,
			contactUrl: 'https://www.lesechos.fr/pages-utiles/contacts',
			fonction: REDACTION
		},
		{
			id: 'la-croix',
			nom: 'La Croix',
			role: 'autre',
			email: null,
			contactUrl: 'https://www.la-croix.com/contactez-nous',
			fonction: REDACTION
		},
		{
			id: 'mediapart',
			nom: 'Mediapart',
			role: 'autre',
			email: null,
			contactUrl: 'https://www.mediapart.fr/contact',
			fonction: REDACTION
		}
	],
	meta: {
		title: {
			fr: 'Écrire à la presse | Pause IA',
			en: 'Write to the press | Pause AI'
		},
		description: {
			fr: "Prenez 2 minutes pour demander à votre journal de mieux couvrir les risques de l'IA. Un email prêt à personnaliser vers les grandes rédactions.",
			en: 'Take 2 minutes to ask your newspaper to better cover the risks of AI. A ready-to-personalise email to the major newsrooms.'
		}
	},
	hero: {
		title: { fr: 'Écrire à la presse', en: 'Write to the press' },
		subtitle: {
			fr: "Les médias couvrent ce que leurs lecteurs veulent lire. En quelques minutes, demandez à votre journal de traiter davantage les risques de l'IA.",
			en: 'The media cover what their readers want to read. In a few minutes, ask your newspaper to give more coverage to the risks of AI.'
		}
	},
	subjects: [
		{
			fr: "Demande de couverture : le risque existentiel lié à l'IA",
			en: 'Request for coverage: existential risk from AI'
		},
		{
			fr: "Pour une couverture à la hauteur des enjeux de l'IA",
			en: 'For coverage that matches what is at stake with AI'
		},
		{
			fr: "Un lecteur vous demande de traiter davantage les risques de l'IA",
			en: 'A reader asking you to cover the risks of AI more'
		},
		{
			fr: "Mieux couvrir la sécurité de l'intelligence artificielle",
			en: 'Covering the safety of artificial intelligence more fully'
		}
	],
	hooks: [
		{
			fr: "En tant que lecteur attentif de votre journal, je suis frappé par l'écart entre l'ampleur des risques liés à l'intelligence artificielle et la place, encore modeste, qu'ils occupent dans le débat public. Ce qui m'alerte n'est pas de la science-fiction : ce sont les dirigeants mêmes des grands laboratoires d'IA qui reconnaissent publiquement que leurs systèmes pourraient, à terme, échapper à notre contrôle.",
			en: 'As an attentive reader of your paper, I am struck by the gap between the scale of the risks linked to artificial intelligence and the still modest place they hold in public debate. What alarms me is not science fiction: it is the very leaders of the major AI labs who publicly acknowledge that their systems could, in time, escape our control.'
		},
		{
			fr: "Un avertissement récent mérite, selon moi, une place bien plus grande dans vos colonnes. En mai 2023, des centaines de chercheurs et les dirigeants des principaux laboratoires d'IA ont signé une même phrase : « Atténuer le risque d'extinction lié à l'IA devrait être une priorité mondiale, au même titre que les pandémies ou la guerre nucléaire. » Quand ceux qui construisent cette technologie lancent une telle alerte, le sujet me semble devoir être davantage traité.",
			en: 'A recent warning deserves, in my view, far more space in your pages. In May 2023, hundreds of researchers and the leaders of the main AI labs signed a single sentence: "Mitigating the risk of extinction from AI should be a global priority, alongside other societal-scale risks such as pandemics and nuclear war." When the people building this technology raise such an alarm, the topic seems to me to deserve much more coverage.'
		},
		{
			fr: "Un sujet me paraît largement sous-traité au regard de son importance. Des scientifiques parmi les plus respectés, comme les prix Turing Yoshua Bengio et Geoffrey Hinton, alertent sur le fait que personne ne sait aujourd'hui garantir le contrôle des systèmes d'IA les plus avancés. J'aimerais lire, dans votre titre, des enquêtes à la hauteur de cet enjeu.",
			en: 'One topic seems to me largely under-covered given its importance. Some of the most respected scientists, such as Turing laureates Yoshua Bengio and Geoffrey Hinton, warn that no one today knows how to guarantee control of the most advanced AI systems. I would like to read, in your paper, investigations that match what is at stake.'
		}
	],
	angles: [
		{
			id: 'couverture',
			label: { fr: 'Plus de couverture', en: 'More coverage' },
			focus: {
				fr: "Je ne vous demande pas d'épouser une opinion, mais d'enquêter et d'informer : donner la parole aux chercheurs qui alertent comme à ceux qui rassurent, expliquer ce qu'est la course à des systèmes toujours plus autonomes, et éclairer ce que font (ou ne font pas) les pouvoirs publics face à ces risques.",
				en: 'I am not asking you to take a side, but to investigate and inform: to give a voice both to the researchers who warn and to those who reassure, to explain the race toward ever more autonomous systems, and to shed light on what public authorities are doing (or not doing) about these risks.'
			},
			complementLong: {
				fr: "Une couverture régulière et rigoureuse aide vos lecteurs à se forger une opinion éclairée sur ce qui pourrait être la transformation la plus lourde de conséquences de ce siècle. C'est précisément le rôle d'un grand journal.",
				en: 'Regular, rigorous coverage helps your readers form an informed opinion on what could be the most consequential transformation of this century. That is precisely the role of a great newspaper.'
			}
		},
		{
			id: 'existentiel',
			label: { fr: 'Risque existentiel', en: 'Existential risk' },
			focus: {
				fr: "Ce qui me préoccupe le plus est le risque le plus extrême : en construisant des machines plus intelligentes que nous sans savoir les maîtriser, nous prenons un pari dont l'humanité pourrait ne jamais se relever. Ce n'est plus une crainte marginale, mais une inquiétude partagée au plus haut niveau de la recherche, et vos lecteurs gagneraient à en mesurer la portée.",
				en: 'What worries me most is the most extreme risk: by building machines more intelligent than us without knowing how to control them, we are taking a gamble humanity might never recover from. This is no longer a fringe fear but a concern shared at the highest levels of research, and your readers would benefit from grasping its scale.'
			},
			complementLong: {
				fr: "Ce risque n'efface pas les autres, plus immédiats : désinformation, surveillance, emploi, armes autonomes. Tous méritent une couverture attentive.",
				en: 'This risk does not erase the others, more immediate ones: disinformation, surveillance, jobs, autonomous weapons. They all deserve careful coverage.'
			}
		},
		{
			id: 'democratie',
			label: { fr: 'Démocratie et information', en: 'Democracy and information' },
			focus: {
				fr: "Un angle vous concerne directement : ces systèmes fragilisent déjà le débat démocratique. Deepfakes et désinformation de masse brouillent la frontière entre le vrai et le faux, au moment même où la confiance dans l'information est fragile. En tant que média, vous êtes en première ligne pour l'expliquer.",
				en: 'One angle concerns you directly: these systems are already straining democratic debate. Deepfakes and mass disinformation blur the line between true and false, at the very moment when trust in information is fragile. As a media outlet, you are on the front line to explain it.'
			},
			complementLong: {
				fr: 'Et derrière ces effets immédiats demeure une question de fond : nous nous apprêtons à créer des intelligences supérieures à la nôtre sans garantie de pouvoir les garder sous contrôle.',
				en: 'And behind these immediate effects lies a deeper question: we are about to create intelligences greater than our own with no guarantee of keeping them under control.'
			}
		}
	],
	poll: {
		fr: "Ce sujet intéresse vos lecteurs : selon un récent sondage, seuls 8 % des Français souhaitent accélérer le développement de l'IA, et près de huit sur dix sont favorables à des accords internationaux interdisant les capacités d'IA qui menacent la vie humaine ou les droits fondamentaux.",
		en: 'This topic matters to your readers: according to a recent poll, only 8% of French people want to accelerate AI development, and nearly eight in ten support international agreements banning AI capabilities that threaten human life or fundamental rights.'
	},
	balance: {
		fr: "Je mesure l'exigence et l'indépendance de votre travail, et ma démarche n'est pas une critique. C'est la demande d'un lecteur qui souhaite voir ce sujet, décisif pour l'avenir, traité à sa juste mesure.",
		en: 'I recognise the rigour and independence of your work, and this is not a criticism. It is the request of a reader who wishes to see this topic, decisive for the future, covered as fully as it deserves.'
	},
	ask: {
		fr: "C'est pourquoi je vous demande d'accorder à ce sujet une couverture plus régulière et approfondie : enquêtes, entretiens avec les chercheurs concernés, décryptage des décisions politiques en cours. L'association Pause IA (pauseia.fr) se tient à votre disposition pour vous orienter vers des sources et des spécialistes francophones.",
		en: 'That is why I ask you to give this topic more regular and in-depth coverage: investigations, interviews with the researchers involved, analysis of the political decisions under way. The Pause AI association (pauseia.fr) would be glad to point you toward French-speaking sources and experts.'
	},
	hasDetailed: true
}

export const eluActions: EluAction[] = [DEFAULT_ACTION, EXEMPLE_GOUVERNEMENT, MEDIAS]

/** Renvoie l'action demandée, ou l'action par défaut si l'id est inconnu. */
export function getEluAction(id: string | null | undefined): EluAction {
	if (!id) return DEFAULT_ACTION
	return eluActions.find((a) => a.id === id) ?? DEFAULT_ACTION
}
