import { getPressReleases, getLocalPressReleases, getPressCoverage } from '$lib/notion'
import { staticPressCoverage } from '$lib/press-coverage-static'
import type { PageServerLoad } from './$types'

export const prerender = false

export const load: PageServerLoad = async () => {
	const [pressReleases, localPressReleases, notionCoverage] = await Promise.all([
		getPressReleases(),
		getLocalPressReleases(),
		getPressCoverage()
	])

	// Merge static + Notion coverage; Notion takes precedence (dedup by URL)
	const notionUrls = new Set(notionCoverage.map((c) => c.url))
	const pressCoverage = [
		...notionCoverage,
		...staticPressCoverage.filter((c) => !notionUrls.has(c.url))
	]

	return {
		pressReleases,
		localPressReleases,
		pressCoverage
	}
}
