import { getPressReleases, getLocalPressReleases } from '$lib/notion'
import type { PageServerLoad } from './$types'

export const prerender = false

export const load: PageServerLoad = async () => {
	const [pressReleases, localPressReleases] = await Promise.all([
		getPressReleases(),
		getLocalPressReleases()
	])

	return {
		pressReleases,
		localPressReleases
	}
}
