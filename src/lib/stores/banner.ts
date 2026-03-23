import { writable } from 'svelte/store'
import type { Banner } from '$lib/notion'

// Default: hidden until Notion responds. Prevents stale content from flashing.
const defaultBanner: Banner = {
	id: 'default',
	message: '',
	linkText: '',
	linkUrl: '',
	visible: false
}

export const bannerStore = writable<Banner>(defaultBanner)
