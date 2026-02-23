import { getNewsletterBySlug, fetchNewsletterContent } from '$lib/notion'
import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const prerender = false

export const load: PageServerLoad = async ({ params }) => {
	const newsletter = await getNewsletterBySlug(params.slug)

	if (!newsletter) {
		throw redirect(307, '/publications')
	}

	const content = await fetchNewsletterContent(newsletter.url)

	// If we couldn't fetch the content, redirect to the original URL
	if (!content) {
		throw redirect(307, newsletter.url)
	}

	// Check if extracted content has enough meaningful text
	const textOnly = content.replace(/<[^>]*>/g, '').trim()
	const hasContent = textOnly.length > 100

	return {
		newsletter,
		content,
		hasContent
	}
}
