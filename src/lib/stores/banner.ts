import { writable } from 'svelte/store'
import type { Banner } from '$lib/notion'

// Default banner content (fallback when Notion is not configured)
const defaultBanner: Banner = {
	id: 'default',
	message: 'Compte-rendu du colloque au Sénat disponible.',
	linkText: 'Consultez nos recommandations',
	linkUrl: '/senat2025',
	visible: true
}

export const bannerStore = writable<Banner>(defaultBanner)
