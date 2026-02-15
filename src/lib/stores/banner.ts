import { writable } from 'svelte/store'
import type { Banner } from '$lib/notion'

// Default banner content (fallback when Notion is not configured)
const defaultBanner: Banner = {
	id: 'default',
	message: "Sommet de l'IA à Delhi : agissez maintenant",
	linkText: 'En savoir plus',
	linkUrl: '/sommet-ia-2026',
	visible: true
}

export const bannerStore = writable<Banner>(defaultBanner)
