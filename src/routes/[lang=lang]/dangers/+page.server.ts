import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const prerender = false

export const load: PageServerLoad = async ({ fetch, params }) => {
	const lang = params.lang as 'fr' | 'en'
	const apiPath = lang === 'en' ? '/api/dangers?lang=en' : '/api/dangers'
	const response = await fetch(apiPath)
	const posts = await response.json()

	throw redirect(
		307,
		`/${lang}/${posts[0]?.slug ?? (lang === 'en' ? 'dangers/economic-and-material' : 'dangers/economiques-et-materiels')}`
	)
}
