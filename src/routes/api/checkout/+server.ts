import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import Stripe from 'stripe'
import { env } from '$env/dynamic/private'

export const POST: RequestHandler = async ({ request, url }) => {
	const key = env.STRIPE_SECRET_KEY

	try {
		const body = (await request.json()) as { amount: number }
		const { amount } = body

		if (!amount || amount < 100) {
			return error(400, 'Montant minimum : 1€')
		}

		if (!key) {
			return error(500, 'Configuration Stripe manquante')
		}

		const stripe = new Stripe(key)
		// Create customer
		const customer = await stripe.customers.create({
			metadata: {
				source: 'don_pauseia_svelte',
				amount_requested: `${(amount / 100).toString()}€`,
				timestamp: Date.now().toString()
			}
		})

		// Create checkout session
		const session = await stripe.checkout.sessions.create({
			customer: customer.id,
			payment_method_types: ['sepa_debit'],
			mode: 'payment',
			line_items: [
				{
					price_data: {
						currency: 'eur',
						product_data: {
							name: 'Don à Pause IA France'
						},
						unit_amount: Number(amount)
					},
					quantity: 1
				}
			],
			metadata: {
				customer_id: customer.id,
				is_donation: 'true'
			},
			success_url: `${url.origin}/merci?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${url.origin}/dons`,
			locale: 'fr'
		})

		return json({ url: session.url })
	} catch (stripeError) {
		console.error('Stripe error:', stripeError)
		return error(500, 'Erreur lors de la création du paiement')
	}
}
