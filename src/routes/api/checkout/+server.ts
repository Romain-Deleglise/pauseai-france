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
			mode: 'payment',
			submit_type: 'donate',
			line_items: [
				{
					price_data: {
						currency: 'eur',
						product_data: {
							name: 'Don à Pause IA'
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
			custom_text: {
				submit: {
					message:
						'En cliquant sur "Faire un don", vous recevrez les instructions de virement bancaire sécurisé.\nUtilisez un virement bancaire standard (1-3 jours ouvrés) - les virements instantanés ne sont pas supportés.'
				}
			},
			success_url: `${url.origin}/merci`,
			cancel_url: `${url.origin}/dons`,
			locale: 'fr',
			billing_address_collection: 'required',
			phone_number_collection: {
				enabled: true
			}
		})

		return json({ url: session.url })
	} catch (err) {
		console.error('Erreur création Checkout Session:', err)

		if (err instanceof Stripe.errors.StripeError) {
			return error(400, err.message)
		}

		return error(500, 'Impossible de créer la session Checkout')
	}
}
