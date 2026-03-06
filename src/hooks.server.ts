export async function handle({ event, resolve }) {
	if (process.env.PUBLIC_UNDER_CONSTRUCTION === 'true') {
		return new Response('Site is under construction', { status: 503 })
	}

	// Persist the user's language choice when they visit /fr/... or /en/...
	const langMatch = event.url.pathname.match(/^\/(fr|en)(\/|$)/)
	if (langMatch) {
		event.cookies.set('lang', langMatch[1], {
			path: '/',
			maxAge: 60 * 60 * 24 * 365,
			sameSite: 'lax'
		})
	}

	return await resolve(event)
}
