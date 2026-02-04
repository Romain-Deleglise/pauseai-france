import { env } from '$env/dynamic/public'

export async function handle({ event, resolve }) {
	if (env.PUBLIC_UNDER_CONSTRUCTION === 'true') {
		return new Response('Site is under construction', { status: 503 })
	}
	return await resolve(event)
}
