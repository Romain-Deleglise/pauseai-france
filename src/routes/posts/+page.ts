import { getPosts } from '$lib/api'

export function load() {
	const posts = getPosts('', 'fr')
	return { posts }
}
