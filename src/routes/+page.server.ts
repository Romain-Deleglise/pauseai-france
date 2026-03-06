import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const prerender = false

export const load: PageServerLoad = ({ request }) => {
	const acceptLang = request.headers.get('accept-language') ?? ''
	const lang = acceptLang.toLowerCase().startsWith('fr') ? 'fr' : 'en'
	redirect(302, `/${lang}`)
}
