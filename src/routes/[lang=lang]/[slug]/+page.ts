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
			const { default: content, metadata }: MdModule = await import(`../../../posts/en/${slug}.md`)
			return { content, metadata, slug }
		} catch {
			// Fall through to try French version
		}
	}

	try {
		const { default: content, metadata }: MdModule = await import(`../../../posts/${slug}.md`)
		return { content, metadata, slug }
	} catch (e) {
		throw error(404, `Could not find ${slug}`)
	}
}
