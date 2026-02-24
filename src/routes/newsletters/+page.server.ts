import { getNewsletters } from '$lib/notion'
import type { PageServerLoad } from './$types'

export const prerender = false

export const load: PageServerLoad = async () => {
	const newsletters = await getNewsletters()

	return {
		newsletters
	}
}
