import { url } from '$config'
import type { Post } from '$lib/types'
import { getStaticRoutes } from '$lib/routes'

export const prerender = true

export async function GET({ fetch }) {
	const response = await fetch('api/posts')
	const posts: Post[] = await response.json()
	const website = url

	const staticRoutes = getStaticRoutes()

	const headers = { 'Content-Type': 'text/plain' }

	const lines: string[] = []
	lines.push(`${website}`)
	for (const route of staticRoutes) {
		lines.push(`${website}${route === '/' ? '' : route}`)
	}
	for (const { slug } of posts) {
		lines.push(`${website}/${slug}`)
	}

	const sitemap = lines.join('\n')

	return new Response(sitemap, { headers })
}
