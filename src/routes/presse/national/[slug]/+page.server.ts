import { getPressReleases } from '$lib/notion'
import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const prerender = false

export const load: PageServerLoad = async ({ params }) => {
	const releases = await getPressReleases()
	const index = releases.findIndex((pr) => pr.slug === params.slug)

	if (index === -1) {
		throw redirect(307, '/presse')
	}

	const pressRelease = releases[index]

	// For PDF URLs, redirect directly
	if (pressRelease.url.toLowerCase().endsWith('.pdf')) {
		throw redirect(307, pressRelease.url)
	}

	const prev =
		index > 0 ? { slug: releases[index - 1].slug, title: releases[index - 1].title } : null
	const next =
		index < releases.length - 1
			? { slug: releases[index + 1].slug, title: releases[index + 1].title }
			: null

	return {
		pressRelease,
		content: null,
		hasContent: false,
		prev,
		next
	}
}
