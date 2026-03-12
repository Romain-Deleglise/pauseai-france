import { json } from '@sveltejs/kit'
import { getBanner } from '$lib/notion'
import type { RequestHandler } from './$types'

export const prerender = false

export const GET: RequestHandler = async () => {
	const banner = await getBanner()
	return json(banner)
}
