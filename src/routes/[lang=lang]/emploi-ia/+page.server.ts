import { Client } from '@notionhq/client'
import type { PageObjectResponse } from '@notionhq/client'
import {
	getCheckbox,
	getRichTextContent,
	getTitleContent,
	getDateStart,
	getUrl,
	getSelectName
} from '$lib/notion-helpers'
// Note : les témoignages illustrés du diaporama (composant TestimonialSlideshow)
// proviennent désormais des images de src/assets/emploi-ia/temoignages/, plus de Notion.

const notion = new Client({
	auth: process.env.NOTION_TOKEN as string
})

function isPageWithProperties(result: PageObjectResponse | any): result is PageObjectResponse {
	return result.object === 'page' && 'properties' in result
}

export const prerender = false

export async function load() {
	try {
		const articleShowcase_datasource = await notion.dataSources.query({
			data_source_id: process.env.ARTICLE_SHOWCASE_ID as string
		})

		const articleShowcaseItems = articleShowcase_datasource.results
			.filter(isPageWithProperties)
			.filter((item) => getCheckbox(item.properties.Afficher))
			.map((item) => ({
				title: getTitleContent(item.properties.Titre),
				summary: getRichTextContent(item.properties.Résumé),
				date: getDateStart(item.properties.Date),
				url: getUrl(item.properties.URL),
				category: getSelectName(item.properties.Catégorie),
				image: getUrl(item.properties.Image),
				langue: getSelectName(item.properties.Langue)
			}))

		return {
			articleShowcaseItems: articleShowcaseItems
		}
	} catch (err) {
		// Dégradation propre : si Notion est indisponible, on n'affiche pas la
		// revue de presse mais le reste de la page reste accessible (au lieu de
		// renvoyer une erreur 500 sur toute la page).
		console.error('Error loading emploi-ia press review from Notion:', {
			error: err instanceof Error ? err.message : String(err),
			timestamp: new Date().toISOString()
		})
		return {
			articleShowcaseItems: []
		}
	}
}
