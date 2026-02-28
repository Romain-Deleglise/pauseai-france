import { redirect } from '@sveltejs/kit'
import { getPosts } from '$lib/api'

export async function load() {
	const posts = getPosts('/dangers', 'fr')

	throw redirect(307, `${posts[0].slug}`)
}
