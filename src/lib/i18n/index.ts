import fr from './fr'
import en from './en'

export type Lang = 'fr' | 'en'
export type Translations = typeof fr

const translations = { fr, en } as const

export function getT(lang: Lang): Translations {
	return translations[lang]
}
