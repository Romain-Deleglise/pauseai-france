import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const prerender = false

export const load: PageServerLoad = ({ request, cookies }) => {
	const cookieLang = cookies.get('lang')
	if (cookieLang === 'fr' || cookieLang === 'en') {
		redirect(302, `/${cookieLang}`)
	}
	const acceptLang = request.headers.get('accept-language') ?? ''
	// FR and EN browsers → /fr ; other languages (de, zh, es…) → /en
	const a = acceptLang.toLowerCase()
	const lang = a.startsWith('fr') || a.startsWith('en') ? 'fr' : 'en'
	redirect(302, `/${lang}`)
}
