import { getNewsletters } from '$lib/notion'
import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const prerender = false

export const load: PageServerLoad = async ({ params }) => {
	const newsletters = await getNewsletters()
	const index = newsletters.findIndex((n) => n.slug === params.slug)

	if (index === -1) {
		throw redirect(307, `/${params.lang}/newsletters`)
	}

	const newsletter = newsletters[index]

	// Previous = newer (lower index), Next = older (higher index)
	const prev =
		index > 0 ? { slug: newsletters[index - 1].slug, title: newsletters[index - 1].title } : null
	const next =
		index < newsletters.length - 1
			? { slug: newsletters[index + 1].slug, title: newsletters[index + 1].title }
			: null

	return {
		newsletter,
		content: null,
		hasContent: false,
		prev,
		next,
		lang: params.lang
	}
}
