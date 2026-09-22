import { error } from '@sveltejs/kit'
import type { LayoutData } from '../$types'
type MdModule = typeof import('*.md')

export async function load({
	params,
	parent
}: {
	params: { slug: string; lang: string }
	parent: () => Promise<LayoutData>
}) {
	const { lang } = await parent()
	const { slug } = params

	// Try lang-specific post first (for English), then fall back to default French posts
	if (lang === 'en') {
		try {
			const { default: content, metadata } = (await import(
				`../../../posts/en/${slug}.md`
			)) as MdModule
			return { content, metadata, slug }
		} catch {
			// Fall through to try French version
		}
	}

	try {
		const { default: content, metadata } = (await import(`../../../posts/${slug}.md`)) as MdModule
		return { content, metadata, slug }
	} catch {
		error(404, `Could not find ${slug}`)
	}
}
