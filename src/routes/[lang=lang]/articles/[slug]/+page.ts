import { error } from '@sveltejs/kit'
import type { LayoutData } from '../../$types'
type MdModule = typeof import('*.md')

/*
 * Articles de campagne : /{lang}/articles/AAAA-MM-JJ-slug
 *
 * Un seul segment porte la date ET le titre. Une arborescence
 * /articles/2026/09/17/slug obligerait à servir aussi /articles/2026/ et
 * /articles/2026/09/, sans quoi ces adresses parentes renvoient 404 — un
 * lecteur qui remonte l'URL, et les robots, les essaient.
 *
 * Même repli que les pages : en anglais on tente d'abord /posts/en/articles,
 * puis la version française, pour qu'un article non traduit reste lisible.
 */
export async function load({
	params,
	parent
}: {
	params: { slug: string; lang: string }
	parent: () => Promise<LayoutData>
}) {
	const { lang } = await parent()
	const { slug } = params

	if (lang === 'en') {
		try {
			const { default: content, metadata } = (await import(
				`../../../../posts/en/articles/${slug}.md`
			)) as MdModule
			return { content, metadata, slug }
		} catch {
			// Pas de version anglaise : on sert la française.
		}
	}

	try {
		const { default: content, metadata } = (await import(
			`../../../../posts/articles/${slug}.md`
		)) as MdModule
		return { content, metadata, slug }
	} catch {
		error(404, `Could not find article ${slug}`)
	}
}
