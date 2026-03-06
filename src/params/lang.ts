export function match(param: string): param is 'fr' | 'en' {
	return param === 'fr' || param === 'en'
}
