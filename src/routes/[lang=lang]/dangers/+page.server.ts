import { redirect } from '@sveltejs/kit'
import { getPosts } from '$lib/api'
import type { PageServerLoad } from './$types'

export const prerender = false

export const load: PageServerLoad = ({ params }) => {
	const lang = params.lang
	const posts = getPosts('/dangers', lang)

	redirect(
		307,
		`/${lang}/${posts[0]?.slug ?? (lang === 'en' ? 'dangers/economic-and-material' : 'dangers/economiques-et-materiels')}`
	)
}
