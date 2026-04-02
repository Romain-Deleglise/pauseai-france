<script lang="ts">
	import type { Lang } from '$lib/i18n'

	export let lang: Lang = 'fr'

	let email = ''
	let isSubmitting = false
	let message = ''
	let isError = false

	async function handleSubmit(event: Event) {
		event.preventDefault()
		message = ''
		isError = false

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!email || !emailRegex.test(email)) {
			message = lang === 'en' ? 'Please enter a valid email address.' : 'Adresse e-mail invalide.'
			isError = true
			return
		}

		isSubmitting = true
		try {
			const res = await fetch('/api/subscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, subscribeNewsletter: true, source: 'homepage-cta' })
			})
			const result = await res.json()
			if (res.ok) {
				message =
					lang === 'en'
						? (result.message ?? 'Subscribed!')
						: (result.message ?? 'Inscription réussie\u00a0!')
				isError = false
				email = ''
			} else {
				message =
					result.error ?? (lang === 'en' ? 'An error occurred.' : 'Une erreur est survenue.')
				isError = true
			}
		} catch {
			message = lang === 'en' ? 'Connection error. Please try again.' : 'Erreur de connexion.'
			isError = true
		} finally {
			isSubmitting = false
		}
	}
</script>

<section class="newsletter-cta">
	<div class="text">
		<p class="title">
			{lang === 'en' ? 'Stay informed' : 'Restez informé·e'}
		</p>
		<p class="desc">
			{#if lang === 'en'}
				Subscribe to our newsletter to follow our work, discover how to get involved, and receive a
				monthly roundup of the latest AI news.
			{:else}
				Inscrivez-vous à notre newsletter pour suivre nos actions, découvrir comment vous impliquer
				et recevoir chaque mois un résumé de l'actualité IA.
			{/if}
		</p>
	</div>
	<form on:submit={handleSubmit} class="form">
		<div class="input-row">
			<input
				type="email"
				bind:value={email}
				placeholder={lang === 'en' ? 'your@email.com' : 'votre@email.com'}
				disabled={isSubmitting}
				aria-label={lang === 'en' ? 'Email address' : 'Adresse e-mail'}
			/>
			<button type="submit" disabled={isSubmitting}>
				{#if isSubmitting}
					{lang === 'en' ? 'Subscribing…' : 'Inscription…'}
				{:else}
					{lang === 'en' ? 'Subscribe' : "S'inscrire"}
				{/if}
			</button>
		</div>
		{#if message}
			<p class="feedback" class:error={isError} aria-live="polite">{message}</p>
		{/if}
	</form>
</section>

<style>
	.newsletter-cta {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding: 2rem 2rem;
		background: var(--brand);
		border-radius: 1rem;
		margin: 2rem 0;
		width: 100vw;
		margin-left: calc(50% - 50vw);
		margin-right: calc(50% - 50vw);
		border-radius: 0;
	}

	.text {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
		max-width: 52rem;
		margin: 0 auto;
		width: 100%;
	}

	.title {
		font-family: var(--font-heading);
		font-size: 1.4rem;
		font-weight: 700;
		margin: 0;
		color: var(--black);
	}

	.desc {
		margin: 0;
		font-size: 1rem;
		color: var(--black);
		opacity: 0.85;
		line-height: 1.5;
	}

	.form {
		max-width: 52rem;
		margin: 0 auto;
		width: 100%;
	}

	.input-row {
		display: flex;
		gap: 0.5rem;
	}

	input[type='email'] {
		flex: 1;
		padding: 0.65rem 1rem;
		border: 2px solid rgba(0, 0, 0, 0.15);
		border-radius: 0.5rem;
		font-family: var(--font-body);
		font-size: 1rem;
		background: white;
		color: var(--black);
		min-width: 0;
	}

	input[type='email']:focus {
		outline: none;
		border-color: var(--black);
	}

	input[type='email']:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	button[type='submit'] {
		padding: 0.65rem 1.5rem;
		background: var(--black);
		color: var(--white);
		border: none;
		border-radius: 0.5rem;
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 1rem;
		cursor: pointer;
		white-space: nowrap;
		transition: opacity 0.15s;
	}

	button[type='submit']:hover:not(:disabled) {
		opacity: 0.8;
	}

	button[type='submit']:disabled {
		opacity: 0.55;
		cursor: not-allowed;
	}

	.feedback {
		margin: 0.5rem 0 0;
		font-size: 0.9rem;
	}

	.feedback.error {
		color: #7a0000;
	}

	@media (min-width: 640px) {
		.newsletter-cta {
			padding: 2.5rem 2rem;
		}

		.title {
			font-size: 1.6rem;
		}
	}

	@media (min-width: 1024px) {
		.newsletter-cta {
			flex-direction: row;
			align-items: center;
			justify-content: center;
			gap: 3rem;
			padding: 2.5rem 6rem;
		}

		.text,
		.form {
			max-width: none;
			margin: 0;
		}

		.text {
			flex: 1;
		}

		.form {
			flex: 0 0 26rem;
		}
	}
</style>
