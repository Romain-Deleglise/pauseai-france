import { getPressReleases, getLocalPressReleases, getPressCoverage } from '$lib/notion'
import type { PageServerLoad } from './$types'

export const prerender = false

export const load: PageServerLoad = async () => {
	const [pressReleases, localPressReleases, pressCoverage] = await Promise.all([
		getPressReleases(),
		getLocalPressReleases(),
		getPressCoverage()
	])

	return {
		pressReleases,
		localPressReleases,
		pressCoverage
	}
}
