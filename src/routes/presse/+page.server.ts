import { getPressReleases } from '$lib/notion'
import type { PageServerLoad } from './$types'

export const prerender = false

export const load: PageServerLoad = async () => {
	const pressReleases = await getPressReleases()

	return {
		pressReleases
	}
}
