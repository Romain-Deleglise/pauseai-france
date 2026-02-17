import { getTeamMembers } from '$lib/notion'
import type { PageServerLoad } from './$types'

export const prerender = false

export const load: PageServerLoad = async () => {
	const teamMembers = await getTeamMembers()

	return {
		teamMembers
	}
}
