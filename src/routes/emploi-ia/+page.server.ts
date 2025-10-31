import { Client } from '@notionhq/client'
import type { Actions } from './$types'

const notion = new Client({
	auth: process.env.NOTION_TOKEN
})

export const prerender = false

export async function load() {
	const testimonials_datasource = await notion.dataSources.query({
		data_source_id: process.env.TESTIMONIALS_ID || ''
	})

	const articleShowcase_datasource = await notion.dataSources.query({
		data_source_id: process.env.ARTICLE_SHOWCASE_ID || ''
	})

	const testimonials = testimonials_datasource.results
		.filter(
			(item) =>
				item.properties.Afficher.checkbox && item.properties.Témoignage.rich_text[0]?.plain_text
		)
		.map((item) => {
			return {
				name: item.properties.Consentement.checkbox
					? item.properties.Prenom.title[0]?.plain_text
					: undefined,
				age: item.properties.Age.rich_text[0]?.plain_text,
				job: item.properties.Profession.rich_text[0]?.plain_text,
				date: item.properties.Date.date?.start,
				testimony: item.properties.Témoignage.rich_text[0]?.plain_text
			}
		})

	const articleShowcaseItems = articleShowcase_datasource.results
		.filter((item) => item.properties.Afficher.checkbox)
		.map((item) => {
			return {
				title: item.properties.Titre.title[0]?.plain_text,
				summary: item.properties.Résumé.rich_text[0]?.plain_text,
				date: item.properties.Date.date?.start,
				url: item.properties.URL.url,
				category: item.properties.Catégorie.select?.name,
				image: item.properties.Image.url
			}
		})

	return {
		testimonials: testimonials,
		articleShowcaseItems: articleShowcaseItems,
		testimonials_datasource: testimonials_datasource
	}
}

export const actions = {
	default: async (event) => {
		const formData = await event.request.formData()
		const avis = formData.get('avis')

		if (typeof avis !== 'string' || avis.length === 0) {
			return { success: false, error: 'Le champ avis est requis.' }
		}

		try {
			const page = await notion.pages.create({
				parent: { data_source_id: process.env.FEEDBACK_ID || '' },

				properties: {
					Avis: {
						title: [
							{
								text: { content: avis.length > 200 ? avis.slice(0, 200) : avis }
							}
						]
					}
				}
			})

			return { success: true, pageId: page.id }
		} catch (err) {
			console.error('Error submitting feedback:', {
				error: err instanceof Error ? err.message : String(err),
				timestamp: new Date().toISOString()
			})
			return { success: false, error: 'Une erreur est survenue.' }
		}
	}
} satisfies Actions
