import type { Handler } from '@netlify/functions'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')

export const handler: Handler = async (event) => {
	try {
		if (event.httpMethod !== 'POST') {
			return { statusCode: 405, body: 'Method Not Allowed' }
		}

		const { amount } = JSON.parse(event.body || '{}') as { amount: number }
		if (!amount || amount < 100) {
			return { statusCode: 400, body: 'Montant minimum : 1€' }
		}
		if (!process.env.STRIPE_SECRET_KEY) {
			return { statusCode: 500, body: 'Configuration Stripe manquante' }
		}

		// Create a blank Customer; Checkout will collect & save details
		const customer = await stripe.customers.create({
			metadata: {
				source: 'don_pauseia_svelte',
				amount_requested: `${amount / 100}€`,
				timestamp: Date.now().toString()
			}
		})

		const session = await stripe.checkout.sessions.create({
			customer: customer.id,
			mode: 'payment',
			payment_method_types: ['customer_balance'],
			payment_method_options: {
				customer_balance: {
					funding_type: 'bank_transfer',
					bank_transfer: {
						type: 'eu_bank_transfer',
						eu_bank_transfer: { country: 'FR' }
					}
				}
			},
			billing_address_collection: 'required',
			customer_update: { address: 'auto', name: 'auto' },
			phone_number_collection: { enabled: true },
			line_items: [
				{
					price_data: {
						currency: 'eur',
						product_data: { name: 'Don Pause IA' },
						unit_amount: amount
					},
					quantity: 1
				}
			],
			submit_type: 'donate',
			custom_text: {
				submit: {
					message:
						'En cliquant sur "Donner", vous recevrez les instructions de virement bancaire sécurisé.'
				}
			},
			success_url: `${event.headers.origin ?? 'https://pauseia.fr'}/merci`,
			cancel_url: `${event.headers.origin ?? 'https://pauseia.fr'}/dons`,
			locale: 'fr'
		})

		return {
			statusCode: 200,
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ url: session.url })
		}
	} catch (err: unknown) {
		const msg = err instanceof Error ? err.message : 'Stripe error'
		return { statusCode: 400, body: msg }
	}
}
