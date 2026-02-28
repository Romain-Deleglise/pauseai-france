import { getPosts } from '$lib/api'
import type { LayoutLoad } from './$types'

// Update when adding new pages or changing slugs
const PAGE_ORDER_FR = [
	'dangers/economiques-et-materiels',
	'dangers/pour-les-individus',
	'dangers/pour-la-societe',
	"dangers/pour-l'humanite"
]

const PAGE_ORDER_EN = [
	'dangers/economic-and-material',
	'dangers/for-individuals',
	'dangers/for-society',
	'dangers/for-humanity'
]

export const load: LayoutLoad = ({ url, params }) => {
	const lang = params.lang as 'fr' | 'en'
	const posts = getPosts('/dangers', lang)

	const pageOrder = lang === 'en' ? PAGE_ORDER_EN : PAGE_ORDER_FR
	posts.sort((a, b) => pageOrder.indexOf(a.slug) - pageOrder.indexOf(b.slug))

	// Extract the slug portion after the lang prefix for current page detection
	const slug = url.pathname.replace(`/${lang}/`, '')
	return { posts, slug }
}
