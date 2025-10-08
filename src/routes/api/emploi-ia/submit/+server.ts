import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request }) => {
	try {
		const data = await request.json()

		// Validation basique
		if (
			!data.email ||
			!data.sexe ||
			!data.age ||
			!data.statutProfessionnel ||
			!data.secteurActivite
		) {
			return json({ error: 'Champs requis manquants' }, { status: 400 })
		}

		// TODO: Implémenter la sauvegarde des données
		// Options possibles :
		// 1. Sauvegarder dans une base de données
		// 2. Envoyer par email
		// 3. Sauvegarder dans un fichier CSV/JSON
		// 4. Envoyer à un service externe (Google Sheets, Airtable, etc.)

		// Pour l'instant, on log simplement les données
		console.log('Nouvelle réponse au questionnaire:', {
			timestamp: new Date().toISOString(),
			...data
		})

		// Vous pouvez également envoyer un email de notification
		// await sendEmailNotification(data)

		return json({ success: true })
	} catch (error) {
		console.error('Erreur lors de la soumission du questionnaire:', error)
		return json({ error: 'Erreur serveur' }, { status: 500 })
	}
}
