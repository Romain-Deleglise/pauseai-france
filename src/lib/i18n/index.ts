import { writable, derived } from 'svelte/store'
import { browser } from '$app/environment'
import { fr } from './fr'
import { en } from './en'

export type Locale = 'fr' | 'en'

const translations = { fr, en } as const

function createLocaleStore() {
	const stored = browser ? (localStorage.getItem('locale') as Locale | null) : null
	const initial: Locale = stored ?? 'fr'

	const { subscribe, set } = writable<Locale>(initial)

	return {
		subscribe,
		set(locale: Locale) {
			set(locale)
			if (browser) {
				localStorage.setItem('locale', locale)
				document.documentElement.setAttribute('lang', locale)
			}
		},
		toggle() {
			const current = browser ? ((localStorage.getItem('locale') as Locale | null) ?? 'fr') : 'fr'
			const next: Locale = current === 'fr' ? 'en' : 'fr'
			this.set(next)
		}
	}
}

export const locale = createLocaleStore()

/** Reactive translation store: $t.nav.donner, etc. */
export const t = derived(locale, ($locale) => translations[$locale])
