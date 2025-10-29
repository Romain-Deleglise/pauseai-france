// Utility to enumerate public static routes for sitemap generation
// Excludes API endpoints, dynamic parameterized routes, and non-page server endpoints

export function getStaticRoutes(): string[] {
	// Match top-level and nested +page.svelte under src/routes, excluding api and parameterized folders
	// Using eager true to get keys synchronously
	const pageModules = import.meta.glob('/src/routes/**/+page.svelte', { eager: true })

	const routes = Object.keys(pageModules)
		.map((absolutePath) => {
			// Strip prefix and filename to get a route path
			// e.g., /src/routes/rejoindre/+page.svelte -> /rejoindre
			// e.g., /src/routes/+page.svelte -> /
			const routePath =
				absolutePath.replace(/^\/src\/routes/, '').replace(/\/\+page\.svelte$/, '') || '/'

			return routePath === '' ? '/' : routePath
		})
		.filter((routePath) => {
			// Exclude private/non-public segments
			if (routePath.startsWith('/api')) return false
			if (routePath.includes('[')) return false // dynamic params
			if (routePath.startsWith('/sitemap')) return false
			return true
		})

	// Deduplicate and sort for stability
	const unique = Array.from(new Set(routes)).sort()
	return unique
}
