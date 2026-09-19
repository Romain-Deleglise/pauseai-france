import { url } from '$config'
import { getPosts } from '$lib/api'
import { getStaticRoutes } from '$lib/routes'

export const prerender = true

export function GET() {
	// Les articles ne sont plus servis qu'avec un préfixe de langue.
	const postsFr = getPosts('', 'fr')
	const postsEn = getPosts('', 'en')
	const website = url

	// La racine est émise à part ci-dessous : on l'enlève de la liste pour ne
	// pas la déclarer deux fois.
	const staticRoutes = getStaticRoutes().filter((route) => route !== '/')

	const headers = { 'Content-Type': 'text/plain' }

	const lines: string[] = []
	lines.push(website)
	for (const route of staticRoutes) {
		lines.push(`${website}${route === '/' ? '' : route}`)
	}
	for (const { slug } of postsFr) {
		lines.push(`${website}/fr/${slug}`)
	}
	for (const { slug } of postsEn) {
		lines.push(`${website}/en/${slug}`)
	}

	const sitemap = lines.join('\n')

	return new Response(sitemap, { headers })
}
