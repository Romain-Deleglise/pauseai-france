import { getVideos, getArticles, getReports, getBanner } from '$lib/notion'
import type { PageServerLoad } from './$types'

// Disable prerendering for this page since it uses dynamic environment variables
export const prerender = false

export const load: PageServerLoad = async () => {
	const [videos, articles, reports, banner] = await Promise.all([
		getVideos(),
		getArticles(),
		getReports(),
		getBanner()
	])

	return {
		videos,
		articles,
		reports,
		banner
	}
}
