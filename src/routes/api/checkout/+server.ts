import { json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async ({ request, fetch }) => {
	try {
		// Get the request body
		const body = (await request.json()) as { amount: number }

		// Forward the request to the Netlify function
		const response = await fetch('/.netlify/functions/create-checkout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		})

		if (!response.ok) {
			const errorText = await response.text()
			return new Response(errorText, {
				status: response.status,
				headers: {
					'Content-Type': 'text/plain'
				}
			})
		}

		const data = (await response.json()) as { url: string }
		return json(data)
	} catch (error) {
		console.error('Error proxying to Netlify function:', error)
		return new Response('Internal server error', { status: 500 })
	}
}

// Handle preflight requests
export const OPTIONS: RequestHandler = () => {
	return new Response(null, {
		status: 200,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type'
		}
	})
}
