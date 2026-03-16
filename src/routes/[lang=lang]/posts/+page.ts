import { getPosts } from '$lib/api'
import type { PageLoad } from './$types'

export const load: PageLoad = ({ params }) => {
	const lang = params.lang as 'fr' | 'en'
	const posts = getPosts('', lang)
	return { posts }
}
