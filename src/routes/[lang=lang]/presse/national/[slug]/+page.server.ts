import { getPressReleases } from '$lib/notion'
import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const prerender = false

export const load: PageServerLoad = async ({ params }) => {
	const releases = await getPressReleases()
	const index = releases.findIndex((pr) => pr.slug === params.slug)

	if (index === -1) {
		redirect(307, `/${params.lang}/presse`)
	}

	const pressRelease = releases[index]

	// For PDF URLs, redirect directly
	if (pressRelease.url.toLowerCase().endsWith('.pdf')) {
		redirect(307, pressRelease.url)
	}

	// Releases are sorted newest first: "previous" is the older one (index + 1),
	// "next" the more recent one (index - 1), to match chronology.
	const prev =
		index < releases.length - 1
			? { slug: releases[index + 1].slug, title: releases[index + 1].title }
			: null
	const next =
		index > 0 ? { slug: releases[index - 1].slug, title: releases[index - 1].title } : null

	return {
		pressRelease,
		content: null,
		hasContent: false,
		prev,
		next,
		lang: params.lang
	}
}
