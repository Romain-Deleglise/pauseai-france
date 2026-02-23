import { getNewsletters, fetchNewsletterContent } from '$lib/notion'
import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const prerender = false

export const load: PageServerLoad = async ({ params }) => {
	const newsletters = await getNewsletters()
	const index = newsletters.findIndex((n) => n.slug === params.slug)

	if (index === -1) {
		throw redirect(307, '/newsletters')
	}

	const newsletter = newsletters[index]
	const content = await fetchNewsletterContent(newsletter.url)

	// If we couldn't fetch the content, redirect to the original URL
	if (!content) {
		throw redirect(307, newsletter.url)
	}

	// Check if extracted content has enough meaningful text
	const textOnly = content.replace(/<[^>]*>/g, '').trim()
	const hasContent = textOnly.length > 100

	// Previous = newer (lower index), Next = older (higher index)
	const prev =
		index > 0 ? { slug: newsletters[index - 1].slug, title: newsletters[index - 1].title } : null
	const next =
		index < newsletters.length - 1
			? { slug: newsletters[index + 1].slug, title: newsletters[index + 1].title }
			: null

	return {
		newsletter,
		content,
		hasContent,
		prev,
		next
	}
}
