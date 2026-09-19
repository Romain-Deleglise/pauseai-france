import { getPosts } from '$lib/api'

// Update when adding new pages or changing slugs
const PAGE_ORDER = [
	'dangers/economiques-et-materiels',
	'dangers/pour-les-individus',
	'dangers/pour-la-societe',
	"dangers/pour-l'humanite"
]

export async function load({ url }) {
	const posts = getPosts('/dangers', 'fr')
	posts.sort((a, b) => PAGE_ORDER.indexOf(a.slug) - PAGE_ORDER.indexOf(b.slug))
	const slug = url.pathname.slice(1)
	return { posts, slug }
}
