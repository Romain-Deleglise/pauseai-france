/** Types partagés par les composants du module « page campagne ». */

export interface CampaignStat {
	value: string
	label: string
}

export interface TimelineEvent {
	date: string
	text: string
}

export interface TimelinePhase {
	/** Étiquette courte, ex. « Phase 1 ». Facultative. */
	tag?: string
	label: string
	/** Période affichée en italique, ex. « mai à juillet ». */
	period?: string
	/** Passe la phase en rouge (moment critique de la chronologie). */
	accent?: boolean
	events: TimelineEvent[]
}

export interface CampaignAction {
	title: string
	description: string
	/** Libellé du bouton. */
	cta: string
	href: string
	/** Ouvre dans un nouvel onglet. */
	external?: boolean
	/** Mise en avant visuelle de l'action principale. */
	featured?: boolean
}

export interface CampaignFact {
	/** Affirmation courte et vérifiable, une phrase. */
	statement: string
	/** Précision facultative, une ou deux lignes. */
	detail?: string
	/** Lien vers l'article ou la source qui démontre l'affirmation. */
	href?: string
	/** Libellé du lien, sinon « Lire l'analyse ». */
	linkLabel?: string
	external?: boolean
}
