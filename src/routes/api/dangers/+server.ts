import { json } from '@sveltejs/kit'
import { getPosts } from '$lib/api'
import type { RequestHandler } from './$types'

export const prerender = false

export const GET: RequestHandler = ({ url }) => {
	const lang = url.searchParams.get('lang') === 'en' ? 'en' : 'fr'
	const posts = getPosts('/dangers', lang)
	return json(posts)
}
