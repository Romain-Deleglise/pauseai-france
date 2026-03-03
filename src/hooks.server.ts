export async function handle({ event, resolve }) {
	if (process.env.PUBLIC_UNDER_CONSTRUCTION === 'true') {
		return new Response('Site is under construction', { status: 503 })
	}
	return await resolve(event)
}
