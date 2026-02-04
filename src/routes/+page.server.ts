import { getVideos, getArticles, getReports } from '$lib/notion'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	const [videos, articles, reports] = await Promise.all([getVideos(), getArticles(), getReports()])

	return {
		videos,
		articles,
		reports
	}
}
