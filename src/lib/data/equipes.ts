/**
 * Les équipes de Pause IA, telles que décrites dans le salon « Contribuer » du
 * Discord — seule source tenue à jour par les référents.
 *
 * Les noms des référents ne sont volontairement PAS publiés ici : le salon
 * Discord est un espace interne, et y figurer n'équivaut pas à consentir à
 * apparaître sur le site public. Les personnes qui veulent joindre une équipe
 * passent par le Discord, où le référent est indiqué.
 *
 * `rolesRecherches` est ce qui bouge le plus vite : à relire quand une équipe
 * annonce un besoin, ou à vider quand il est pourvu.
 */
export interface Equipe {
	nom: string
	description: string
	rolesRecherches?: string[]
}

export const equipes: Equipe[] = [
	{
		nom: 'Communication',
		description:
			'Suit l’actualité et rédige les communiqués de presse, les publications pour les réseaux sociaux, la newsletter et le blog.',
		rolesRecherches: [
			'Monteur·se son et vidéo',
			'Responsable réseaux sociaux',
			'Graphiste et designer visuel',
			'Chargé·e de veille et d’actualité'
		]
	},
	{
		nom: 'Plaidoyer',
		description:
			'Porte la position de Pause IA auprès des institutions et des élus : rédiger une prise de position, écrire aux parlementaires, rencontrer un·e député·e.',
		rolesRecherches: ['Responsable des relations avec les mouvements religieux']
	},
	{
		nom: 'Initiatives locales',
		description:
			'Organise les temps forts et mobilise les membres autour des actions de terrain. Anime les groupes locaux.'
	},
	{
		nom: 'Événements et mobilisations',
		description:
			'Monte les grands projets de l’association, comme le forum des solutions pour l’IA ou la semaine de formation Pause IA.'
	},
	{
		nom: 'Communauté et accueil',
		description:
			'Prend soin de la communauté : accueillir les nouveaux venus, répondre aux questions, recueillir les suggestions, animer le Discord. Tient aussi la documentation interne, pour la transparence envers les membres les moins impliqués.',
		rolesRecherches: ['Responsable des évolutions Discord et Notion', 'Assistant·e recrutement']
	},
	{
		nom: 'Technique',
		description:
			'Assure le fonctionnement et les mises à jour de Notion, du Discord et du site internet.',
		rolesRecherches: ['Expert·e Notion']
	},
	{
		nom: 'Financement et partenariats',
		description: 'Recherche des financements et noue des partenariats pour soutenir l’association.'
	}
]
