/**
 * Les équipes de Pause IA, pour la page « Qui sommes-nous ».
 *
 * Le but de cette liste n'est PAS de documenter l'organisation interne (le
 * salon « Contribuer » du Discord le fait déjà, et mieux, puisque les référents
 * le tiennent à jour). Elle est là pour qu'un visiteur comprenne en une minute
 * de quoi l'association est faite, et qu'il se dise « je pourrais être utile
 * là ». D'où le parti pris : pour chaque équipe, ce qu'elle cherche à obtenir,
 * puis une ou deux tâches réelles qui donnent envie et rendent la chose
 * concrète.
 *
 * Les noms des référents n'y figurent volontairement pas : le Discord est un
 * espace interne, y figurer n'équivaut pas à consentir à apparaître sur le site
 * public. On n'y met pas non plus la liste des postes ouverts : elle bouge trop
 * vite pour une page, elle se périme sans que personne s'en aperçoive, et elle
 * donne à la page un air d'offre d'emploi au lieu d'une invitation.
 */
export interface Equipe {
	nom: string
	/** Ce que l'équipe cherche à obtenir, en une phrase. */
	description: string
	/** Une ou deux tâches réelles, pour rendre la chose concrète. */
	exemple: string
}

export const equipes: Equipe[] = [
	{
		nom: 'Communication',
		description:
			'Fait exister le sujet dans le débat public : ce que nous disons, où nous le disons, et avec quels mots.',
		exemple:
			'Écrire un communiqué le jour où l’actualité tombe, monter une vidéo, tenir la newsletter, alimenter les réseaux sociaux.'
	},
	{
		nom: 'Plaidoyer',
		description:
			'Porte nos demandes là où les décisions se prennent : Parlement, ministères, institutions.',
		exemple:
			'Préparer une prise de position, écrire à des parlementaires, préparer et mener un rendez-vous avec un·e élu·e.'
	},
	{
		nom: 'Initiatives locales',
		description:
			'Fait vivre Pause IA ailleurs qu’à Paris, en donnant aux groupes locaux les moyens d’agir.',
		exemple:
			'Aider quelqu’un à lancer un groupe dans sa ville, organiser un tractage, outiller une action de terrain.'
	},
	{
		nom: 'Événements et mobilisations',
		description:
			'Monte les rendez-vous qui donnent de la visibilité et rassemblent au-delà de nos rangs.',
		exemple:
			'Organiser un colloque ou un forum, préparer une mobilisation, gérer la logistique d’une semaine de formation.'
	},
	{
		nom: 'Communauté et accueil',
		description:
			'Fait en sorte qu’une personne qui arrive trouve sa place au lieu de repartir au bout de trois jours.',
		exemple:
			'Accueillir les nouveaux venus, répondre aux questions, animer le Discord, tenir la documentation interne.'
	},
	{
		nom: 'Technique',
		description: 'Tient les outils sur lesquels tout le reste repose.',
		exemple:
			'Faire évoluer le site, administrer le Discord et Notion, automatiser ce qui se répète.'
	},
	{
		nom: 'Financement et partenariats',
		description:
			'Donne à l’association les moyens de son action, et la met en lien avec ceux qui partagent ses objectifs.',
		exemple:
			'Monter un dossier de subvention, préparer une campagne de dons, nouer un partenariat avec une autre organisation.'
	}
]
