import type { Post } from '$lib/types'
import type { LayoutLoad } from './$types'

// Update when adding new pages or changing slugs
const PAGE_ORDER_FR = [
	'dangers/economiques-et-materiels',
	'dangers/pour-les-individus',
	'dangers/pour-la-societe',
	"dangers/pour-l'humanite"
]

const PAGE_ORDER_EN = [
	'en/dangers/economic-and-material',
	'en/dangers/for-individuals',
	'en/dangers/for-society',
	'en/dangers/for-humanity'
]

export const load: LayoutLoad = async ({ fetch, url, params }) => {
	const lang = params.lang as 'fr' | 'en'
	const apiPath = lang === 'en' ? '/api/dangers?lang=en' : '/api/dangers'
	const response = await fetch(apiPath)
	const posts: Post[] = await response.json()

	const pageOrder = lang === 'en' ? PAGE_ORDER_EN : PAGE_ORDER_FR
	posts.sort((a, b) => pageOrder.indexOf(a.slug) - pageOrder.indexOf(b.slug))

	// Extract the slug portion after the lang prefix for current page detection
	const slug = url.pathname.replace(`/${lang}/`, '')
	return { posts, slug }
}
