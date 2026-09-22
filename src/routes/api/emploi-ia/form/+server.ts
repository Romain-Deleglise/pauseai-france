import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { Client } from '@notionhq/client'
import type { CreatePageParameters } from '@notionhq/client'

const notion = new Client({
	auth: process.env.NOTION_TOKEN
})

/**
 * Charge utile du questionnaire « Emploi et IA ». Tout est optionnel côté
 * types : la validation ci-dessous décide ce qui est réellement requis.
 */
interface FormPayload {
	prenom?: string
	email?: string
	sexe?: string
	age?: string | number
	statutProfessionnel?: string
	autreStatutProfessionnel?: string
	secteurActivite?: string
	autreSecteurActivite?: string
	profession?: string
	frequenceInformation?: string
	rapportIA?: string
	autreRapport?: string
	objectifsCellule?: string[] | string
	autreObjectif?: string
	typeTaches?: string[] | string
	autreTache?: string
	raisonsUtilisation?: string[] | string
	autreRaison?: string
	temoignage?: string
	consentementPartage?: boolean
	veutPlusQuestions?: string
	niveauEtudes?: string
	impactIA?: string
	interesseCellule?: string
	utilisationIA?: string
	satisfactionUtilisation?: string
}

/** Notion refuse un texte au-delà de 2 000 caractères ; on coupe bien avant. */
function text(content: string | undefined, max = 2000) {
	const value = content ?? ''
	return [{ text: { content: value.length > max ? value.slice(0, max) : value } }]
}

/**
 * Remplace la valeur « Autre » par la précision saisie, puis aplatit la liste
 * en un seul champ texte (Notion n'a qu'une colonne par question).
 */
function joinChoices(value: string[] | string | undefined, other: string | undefined): string {
	if (Array.isArray(value)) {
		return value.map((choice) => (choice === 'Autre' ? (other ?? '') : choice)).join('\n\n')
	}
	return value ?? ''
}

/** Un « Autre » explicite bascule sur le champ libre correspondant. */
function orOther(value: string | undefined, marker: string, other: string | undefined): string {
	return value === marker ? (other ?? '') : (value ?? '')
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = (await request.json()) as FormPayload

		if (
			!data.email ||
			!data.sexe ||
			!data.age ||
			!data.statutProfessionnel ||
			!data.secteurActivite ||
			!data.veutPlusQuestions
		) {
			return json({ error: 'Champs requis manquants' }, { status: 400 })
		}

		// Validate email format (simple check for @ symbol)
		if (typeof data.email !== 'string' || !data.email.includes('@')) {
			return json({ error: "Format d'email invalide" }, { status: 400 })
		}

		// Validate age range
		const age = Number(data.age)
		if (isNaN(age) || age < 1 || age > 120) {
			return json({ error: "L'âge doit être entre 1 et 120" }, { status: 400 })
		}

		const properties: CreatePageParameters['properties'] = {
			Prenom: {
				title: text(data.prenom, 200)
			},
			Sexe: {
				select: { name: data.sexe }
			},
			Age: {
				rich_text: text(String(data.age))
			},
			Statut_professionnel: {
				rich_text: text(orOther(data.statutProfessionnel, 'Autre', data.autreStatutProfessionnel))
			},
			Secteur_activité: {
				rich_text: text(orOther(data.secteurActivite, 'Autres', data.autreSecteurActivite))
			},
			Profession: {
				rich_text: text(data.profession)
			},
			Fréquence_info_IA: {
				rich_text: text(data.frequenceInformation)
			},
			Rapport_à_IA: {
				rich_text: text(orOther(data.rapportIA, 'Un autre rapport', data.autreRapport))
			},
			Raison_cellule: {
				rich_text: text(joinChoices(data.objectifsCellule, data.autreObjectif))
			},
			Témoignage: {
				rich_text: text(data.temoignage)
			},
			Email: {
				email: data.email
			},
			Tâche_IA: {
				rich_text: text(joinChoices(data.typeTaches, data.autreTache))
			},
			Raisons_utilisation: {
				rich_text: text(joinChoices(data.raisonsUtilisation, data.autreRaison))
			},
			Date: {
				date: { start: new Date().toISOString() }
			},
			Consentement: {
				checkbox: Boolean(data.consentementPartage)
			},
			Afficher: {
				checkbox: false
			}
		}

		// Les listes déroulantes facultatives ne sont envoyées que si elles sont
		// remplies : Notion rejette un `select` dont le nom est vide.
		const optionalSelects: [string, string | undefined][] = [
			['Niveau_études', data.niveauEtudes],
			['Impact_perçu', data.impactIA],
			['Intéressé_cellule', data.interesseCellule],
			['Fréquence_utilisation', data.utilisationIA],
			['Satisfaction', data.satisfactionUtilisation]
		]
		for (const [property, value] of optionalSelects) {
			if (value?.trim()) {
				properties[property] = { select: { name: value } }
			}
		}

		const dataSourceId = process.env.TESTIMONIALS_ID
		if (!dataSourceId) {
			console.error('TESTIMONIALS_ID manquant : impossible d’enregistrer le questionnaire.')
			return json({ error: 'Erreur serveur' }, { status: 500 })
		}

		await notion.pages.create({
			parent: { data_source_id: dataSourceId },
			properties
		})

		return json({ success: true })
	} catch (err) {
		console.error('Error creating Notion entry:', {
			error: err instanceof Error ? err.message : String(err),
			timestamp: new Date().toISOString()
		})
		return json({ error: 'Erreur serveur' }, { status: 500 })
	}
}
