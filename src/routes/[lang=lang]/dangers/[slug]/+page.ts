import { error } from '@sveltejs/kit'
import type { LayoutData } from '../../$types'
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

	// Try English danger articles first
	if (lang === 'en') {
		try {
			const { default: content, metadata } = (await import(
				`../../../../posts/en/dangers/${slug}.md`
			)) as MdModule
			return { content, metadata, slug: `en/dangers/${slug}` }
		} catch {
			// Fall through to French
		}
	}

	try {
		const { default: content, metadata } = (await import(
			`../../../../posts/dangers/${slug}.md`
		)) as MdModule

		return {
			content,
			metadata,
			slug: `dangers/${slug}`
		}
	} catch {
		error(404, `Could not find ${slug}`)
	}
}
