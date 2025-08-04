import { json, error } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import Stripe from 'stripe'

// Initialize Stripe with secret key - will be null if env var not set
// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
const getStripe = (): Stripe | null => {
	const secretKey = process.env.STRIPE_SECRET_KEY
	if (secretKey) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		return new Stripe(secretKey)
	}
	return null
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const stripe = getStripe()

interface CheckoutSessionRequest {
	amount: number
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		if (!stripe) {
			return error(500, 'Configuration Stripe manquante')
		}

		const requestData = (await request.json()) as CheckoutSessionRequest
		const { amount } = requestData

		// Validate amount (minimum 1€ = 100 cents)
		if (!amount || amount < 100) {
			return error(400, 'Montant minimum : 1€')
		}

		// Create customer first (required for bank transfers)
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
		const customer = await stripe.customers.create({
			metadata: {
				source: 'don_pauseia_svelte',
				amount_requested: `${String(amount / 100)}€`,
				timestamp: Date.now().toString()
			}
		})

		// Create Checkout Session for bank transfers (like your PHP code)
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
		const checkoutSession = await stripe.checkout.sessions.create({
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
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
			line_items: [
				{
					price_data: {
						currency: 'eur',
						product_data: {
							name: 'Don Pause IA'
						},
						unit_amount: amount
					},
					quantity: 1
				}
			],
			mode: 'payment',
			submit_type: 'donate',
			custom_text: {
				submit: {
					message:
						'En cliquant sur "Donner", vous recevrez les instructions de virement bancaire sécurisé.'
				}
			},
			success_url: `${request.headers.get('origin') ?? 'https://pauseia.fr'}/merci`,
			cancel_url: `${request.headers.get('origin') ?? 'https://pauseia.fr'}/dons`,
			locale: 'fr',
			expires_at: Math.floor(Date.now() / 1000) + 1800, // 30 minutes
			// Collect address and phone like your PHP code
			billing_address_collection: 'required',
			phone_number_collection: {
				enabled: true
			}
		})

		return json({
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
			url: checkoutSession.url
		})
	} catch (err: unknown) {
		console.error('Erreur création Checkout Session:', err)

		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		if (err instanceof Stripe.errors.StripeError) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
			return error(400, err.message)
		}

		return error(500, 'Impossible de créer la session Checkout')
	}
}
