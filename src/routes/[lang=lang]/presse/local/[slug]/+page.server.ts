import { getLocalPressReleases, fetchPressReleaseContent } from '$lib/notion'
import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const prerender = false

export const load: PageServerLoad = async ({ params }) => {
	const releases = await getLocalPressReleases()
	const index = releases.findIndex((pr) => pr.slug === params.slug)

	if (index === -1) {
		throw redirect(307, `/${params.lang}/presse`)
	}

	const pressRelease = releases[index]

	// For PDF URLs, redirect directly
	if (pressRelease.url.toLowerCase().endsWith('.pdf')) {
		throw redirect(307, pressRelease.url)
	}

	const content = await fetchPressReleaseContent(pressRelease.url)

	// If we couldn't fetch the content, redirect to the original URL
	if (!content) {
		throw redirect(307, pressRelease.url)
	}

	const textOnly = content.replace(/<[^>]*>/g, '').trim()
	const hasContent = textOnly.length > 100

	const prev =
		index > 0 ? { slug: releases[index - 1].slug, title: releases[index - 1].title } : null
	const next =
		index < releases.length - 1
			? { slug: releases[index + 1].slug, title: releases[index + 1].title }
			: null

	return {
		pressRelease,
		content,
		hasContent,
		prev,
		next
	}
}
