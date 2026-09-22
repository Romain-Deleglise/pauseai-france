import { getPressReleases, getLocalPressReleases } from '$lib/notion'
import { staticPressCoverage } from '$lib/press-coverage-static'
import type { PageServerLoad } from './$types'

export const prerender = false

export const load: PageServerLoad = async () => {
	const [pressReleases, localPressReleases] = await Promise.all([
		getPressReleases(),
		getLocalPressReleases()
	])

	return {
		pressReleases,
		localPressReleases,
		pressCoverage: staticPressCoverage
	}
}
