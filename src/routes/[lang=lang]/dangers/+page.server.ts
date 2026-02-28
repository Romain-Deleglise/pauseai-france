import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const prerender = false

export const load: PageServerLoad = async ({ fetch, params }) => {
	const lang = params.lang as 'fr' | 'en'
	const apiPath = lang === 'en' ? '/api/dangers?lang=en' : '/api/dangers'
	const response = await fetch(apiPath)
	const posts = await response.json()

	if (lang === 'en') {
		throw redirect(307, `/en/${posts[0]?.slug ?? 'dangers/economic-and-material'}`)
	} else {
		throw redirect(307, `/fr/${posts[0]?.slug ?? 'dangers/economiques-et-materiels'}`)
	}
}
