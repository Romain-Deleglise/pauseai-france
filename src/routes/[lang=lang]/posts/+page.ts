import type { Post } from '$lib/types'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ fetch, params }) => {
	const lang = params.lang as 'fr' | 'en'
	const response = await fetch(`/api/posts?lang=${lang}`)
	const posts: Post[] = await response.json()
	return { posts }
}
