import { getPosts } from '$lib/api'
import type { PageLoad } from './$types'

/*
 * Liste des articles. Elle listait tout `src/posts`, donc « Mentions légales »,
 * « Charte des valeurs » ou « Qui sommes-nous » apparaissaient comme des
 * billets, et il fallait exclure à la main les intrus. Les articles vivent
 * désormais dans `src/posts/articles`, séparés des pages institutionnelles :
 * la liste n'a plus d'exception à gérer.
 */
export const load: PageLoad = ({ params }) => {
	const posts = getPosts('/articles', params.lang)
	return { posts }
}
