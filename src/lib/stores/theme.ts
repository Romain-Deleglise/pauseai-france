import { writable } from 'svelte/store'
import { browser } from '$app/environment'

type Theme = 'light' | 'dark'

function createThemeStore() {
	const stored = browser ? (localStorage.getItem('theme') as Theme | null) : null
	const prefersDark = browser && window.matchMedia('(prefers-color-scheme: dark)').matches
	const initial: Theme = stored ?? (prefersDark ? 'dark' : 'light')

	const { subscribe, set, update } = writable<Theme>(initial)

	if (browser) {
		document.documentElement.setAttribute('data-theme', initial)
	}

	return {
		subscribe,
		toggle() {
			update((current) => {
				const next: Theme = current === 'light' ? 'dark' : 'light'
				localStorage.setItem('theme', next)
				document.documentElement.setAttribute('data-theme', next)
				return next
			})
		},
		set(theme: Theme) {
			set(theme)
			if (browser) {
				localStorage.setItem('theme', theme)
				document.documentElement.setAttribute('data-theme', theme)
			}
		}
	}
}

export const theme = createThemeStore()
