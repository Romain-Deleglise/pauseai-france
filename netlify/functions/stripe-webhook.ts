import type { Handler, Config } from '@netlify/functions'
import Stripe from 'stripe'

export const config: Config = {
	path: '/api/stripe-webhook'
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

export const handler: Handler = async (event) => {
	try {
		if (event.httpMethod !== 'POST') {
			return { statusCode: 405, body: 'Method Not Allowed' }
		}

		const signature = event.headers['stripe-signature']
		if (!signature) {
			return { statusCode: 400, body: 'Missing stripe-signature header' }
		}

		if (!process.env.STRIPE_WEBHOOK_SECRET) {
			return { statusCode: 500, body: 'Webhook secret not configured' }
		}

		// Verify the webhook signature
		const stripeEvent = stripe.webhooks.constructEvent(
			event.body || '',
			signature,
			process.env.STRIPE_WEBHOOK_SECRET
		)

		// Handle the event
		switch (stripeEvent.type) {
			case 'checkout.session.completed':
				const session = stripeEvent.data.object as Stripe.Checkout.Session
				console.log('Payment successful:', session.id)
				// Add your payment success logic here
				break
			case 'payment_intent.succeeded':
				const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent
				console.log('Payment succeeded:', paymentIntent.id)
				break
			default:
				console.log(`Unhandled event type: ${stripeEvent.type}`)
		}

		return {
			statusCode: 200,
			body: JSON.stringify({ received: true })
		}
	} catch (err: any) {
		console.error('Webhook error:', err.message)
		return { statusCode: 400, body: `Webhook Error: ${err.message}` }
	}
}
