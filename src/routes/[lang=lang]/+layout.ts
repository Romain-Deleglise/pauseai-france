import type { LayoutLoad } from './$types'
import type { Lang } from '$lib/i18n'

export const prerender = true

export const load: LayoutLoad = ({ params }) => {
	const lang = params.lang as Lang
	return { lang }
}
