<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import Button from '$components/Button.svelte'
	import Accordion from '$components/Accordion.svelte'
	import { title as siteName } from '$config'
	import { browser } from '$app/environment'

	const title = 'Faire un don à Pause IA'
	const description = 'Grâce à votre soutien financier, nous pouvons avoir un plus grand impact.'

	let showAmountForm = false
	let amount = 200
	let isProcessing = false
	let paymentError = ''

	function showAmountEntry() {
		showAmountForm = true
		paymentError = ''
	}

	function backToMain() {
		showAmountForm = false
		paymentError = ''
	}

	function handleBackToMain() {
		if (isProcessing) return
		backToMain()
	}

	async function proceedToPayment() {
		if (!browser) return

		isProcessing = true
		paymentError = ''

		try {
			// Create Checkout Session for bank transfer
			const response = await fetch('/api/create-checkout-session', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ amount: amount * 100 })
			})

			if (!response.ok) {
				const errorData = await response.text()
				throw new Error(`Erreur serveur: ${errorData}`)
			}

			const data = (await response.json()) as { url: string }
			const { url } = data

			// Redirect to Stripe Checkout
			window.location.href = url
		} catch (error) {
			console.error('Checkout Session creation error:', error)
			paymentError =
				error instanceof Error
					? error.message
					: 'Erreur lors de la création de la session de paiement'
		} finally {
			isProcessing = false
		}
	}

	function handleProceedToPayment() {
		if (isProcessing) return
		void proceedToPayment()
	}

	function handleAmountInput(event: Event) {
		const target = event.target as HTMLInputElement
		const value = parseInt(target.value)
		if (target.value === '' || value < 1) {
			amount = 1
			target.value = '1'
		} else {
			amount = value
		}
	}
</script>

<PostMeta title={`${title} | ${siteName}`} {description} />

<article>
	<!-- Main donation page -->
	<section class="hero">
		<UnderlinedTitle as="h1">{title}</UnderlinedTitle>
		<p class="hero-description">
			Les entreprises d'IA sont dans une course effrénée pour développer des systèmes de plus en
			plus puissants.
			<strong>Agissons vite pour garder l'IA sous contrôle</strong> avant qu'il ne soit trop tard.
		</p>

		<div class="tax-benefit">
			<strong>Vos dons sont déductibles à hauteur de 66% de vos impôts</strong><br />
			<small>Un don de 100€ ne vous coûte réellement que 34€</small>
		</div>
	</section>

	<section class="donation-options">
		{#if !showAmountForm}
			<div class="donation-card helloasso-card">
				<h3>💳 Don par carte bancaire <span class="monthly-badge">Simple & rapide</span></h3>
				<p>
					Choisissez entre un don ponctuel ou un soutien mensuel. Paiement sécurisé par carte
					bancaire via HelloAsso.
				</p>
				<Button href="https://www.helloasso.com/associations/pause-ia/formulaires/1"
					>Donner par carte</Button
				>
				<small class="donation-note"> 💳 Don ponctuel ou mensuel au choix </small>
			</div>

			<div class="donation-card">
				<h3>🏦 Don par virement bancaire</h3>
				<p>
					Idéal pour les montants importants. Frais de transaction très réduits par rapport aux
					paiements par carte.
				</p>
				<Button on:click={showAmountEntry}>Faire un virement</Button>
				<small class="donation-note"> 🏦 Recommandé pour les dons > 200€ </small>
			</div>
		{:else}
			<div class="donation-card amount-form-card">
				<h3 class="form-title">🏦 Don par virement bancaire</h3>

				<div class="amount-container">
					<label for="amount-input" class="amount-label">Montant du don</label>
					<input
						id="amount-input"
						type="number"
						bind:value={amount}
						on:input={handleAmountInput}
						class="amount-input"
						min="1"
						step="1"
					/>
					<span class="euro-symbol">€</span>
				</div>

				{#if paymentError}
					<div class="error-message">
						{paymentError}
					</div>
				{/if}

				<div class="bank-transfer-info">
					<p>
						💳 Vous allez être redirigé vers une page sécurisée avec les instructions de virement
						bancaire.
					</p>
				</div>

				<div class="form-buttons">
					<div class:disabled={isProcessing}>
						<Button on:click={handleProceedToPayment}>
							{isProcessing ? 'Redirection...' : 'Continuer vers le virement'}
						</Button>
					</div>
					<div class:disabled={isProcessing}>
						<Button alt on:click={handleBackToMain}>Retour</Button>
					</div>
				</div>
			</div>
		{/if}
	</section>

	<div class="impact-highlight">
		<h3>Votre impact face à l'urgence</h3>
		<p>
			Chaque jour compte face à l'accélération du développement de l'IA. Vos dons nous permettent
			d'éduquer le public, d'alerter les décideurs et de construire un mouvement pour ralentir cette
			course dangereuse.
		</p>
	</div>

	<section class="faq-section">
		<UnderlinedTitle>Questions fréquentes</UnderlinedTitle>

		<Accordion id="faq-usage" open={false}>
			<svelte:fragment slot="head">À quoi servent vos dons ?</svelte:fragment>
			<svelte:fragment slot="details">
				<p>
					Vos dons financent nos campagnes de sensibilisation, la production de contenus éducatifs,
					l'organisation d'événements, et le développement de notre infrastructure pour amplifier
					notre impact en France.
				</p>
			</svelte:fragment>
		</Accordion>

		<Accordion id="faq-payment" open={false}>
			<svelte:fragment slot="head">Quels moyens de paiement acceptez-vous ?</svelte:fragment>
			<svelte:fragment slot="details">
				<p>
					Nous acceptons les paiements par carte bancaire via HelloAsso (don ponctuel ou mensuel) et
					les virements bancaires. Le virement est recommandé pour les montants importants car les
					frais de transaction sont très réduits.
				</p>
			</svelte:fragment>
		</Accordion>

		<Accordion id="faq-about" open={false}>
			<svelte:fragment slot="head">Qu'est-ce que Pause IA ?</svelte:fragment>
			<svelte:fragment slot="details">
				<p>
					Pause IA est la branche française de PauseAI Global, une organisation à but non lucratif
					dédiée à promouvoir le développement responsable de l'intelligence artificielle. Nous
					militons pour une pause dans le développement des systèmes d'IA les plus dangereux.
				</p>
			</svelte:fragment>
		</Accordion>

		<Accordion id="faq-tax" open={false}>
			<svelte:fragment slot="head">Comment puis-je déduire mon don de mes impôts ?</svelte:fragment>
			<svelte:fragment slot="details">
				<p>
					En tant qu'organisation à but non lucratif, vos dons à Pause IA sont déductibles à 66% de
					vos impôts sur le revenu (cette réduction s'appliquant dans la limite de 20% de votre
					revenu imposable). Nous vous enverrons automatiquement un reçu fiscal après votre don.
				</p>
			</svelte:fragment>
		</Accordion>

		<Accordion id="faq-global" open={false}>
			<svelte:fragment slot="head">Quel est le lien avec PauseAI Global ?</svelte:fragment>
			<svelte:fragment slot="details">
				<p>
					Pause IA est la branche française autonome de PauseAI Global. Vos dons restent entièrement
					en France pour financer nos actions locales. Nous ne reversons aucune partie de ces dons à
					l'organisation internationale.
				</p>
			</svelte:fragment>
		</Accordion>
	</section>
</article>

<style>
	article {
		max-inline-size: 50rem;
		margin-inline: auto;
		margin-top: 3rem;
		padding: 0 2rem;
	}

	.hero {
		text-align: center;
		margin-bottom: 3rem;
		background: var(--bg);
		padding: 3rem 2rem;
		border-radius: 12px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.hero-description {
		font-size: 1.1rem;
		color: #666;
		margin-bottom: 1.5rem;
	}

	.tax-benefit {
		background: #e8f5e8;
		border: 2px solid #4caf50;
		border-radius: 8px;
		padding: 1rem;
		margin: 1.5rem 0;
		text-align: center;
	}

	.tax-benefit strong {
		color: #2e7d32;
		font-size: 1.1rem;
	}

	.donation-options {
		display: grid;
		gap: 1.5rem;
		margin-bottom: 3rem;
		transition: all 0.3s ease-out;
	}

	@media (min-width: 768px) {
		.donation-options {
			grid-template-columns: 1fr 1fr;
			gap: 2rem;
		}

		.donation-options:has(.amount-form-card) {
			grid-template-columns: 1fr;
		}
	}

	.donation-card {
		background: var(--bg);
		border-radius: 12px;
		padding: 2rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		border: 2px solid transparent;
		transition: all 0.3s ease-out;
		display: flex;
		flex-direction: column;
		height: 100%;
		animation: slideInFade 0.3s ease-out;
	}

	.donation-card:hover {
		border-color: var(--brand);
		transform: translateY(-2px);
	}

	.donation-card h3 {
		font-size: 1.3rem;
		margin-top: 0;
		margin-bottom: 1rem;
		color: var(--text);
	}

	.donation-card p {
		color: #666;
		margin-bottom: 1.5rem;
		flex-grow: 1;
	}

	.donation-card :global(a),
	.donation-card :global(button) {
		width: 100% !important;
		min-width: 100% !important;
		max-width: 100% !important;
	}

	.monthly-badge {
		background: #4caf50;
		color: white;
		padding: 0.25rem 0.75rem;
		border-radius: 20px;
		font-size: 0.9rem;
		font-weight: 500;
	}

	.donation-note {
		display: block;
		margin-top: 0.5rem;
		color: #666;
		font-size: 0.9rem;
		text-align: left;
	}

	.impact-highlight {
		background: linear-gradient(135deg, var(--brand), #ff6b35);
		color: var(--black);
		padding: 2rem;
		border-radius: 12px;
		margin: 2rem 0;
		text-align: center;
	}

	.impact-highlight h3 {
		margin-bottom: 1rem;
		color: var(--black);
	}

	.amount-form-card {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: center;
		padding: 2rem;
		grid-column: 1 / -1;
	}

	@keyframes slideInFade {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.form-title {
		font-size: 1.3rem;
		margin-top: 0;
		margin-bottom: 1rem;
		color: var(--text);
		text-align: center;
	}

	.amount-container {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 1.5rem;
		margin-bottom: 1rem;
		width: 100%;
		gap: 1rem;
	}

	.amount-input {
		width: 120px;
		padding: 0.75rem 1.25rem;
		border: 2px solid #e5e7eb;
		border-radius: 10px;
		font-size: 1.25rem;
		font-weight: 500;
		text-align: left;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		background: var(--bg);
		color: var(--text);
		box-sizing: border-box;
	}

	.amount-input:focus {
		outline: none;
		border-color: var(--brand);
		box-shadow: 0 0 0 3px rgba(255, 147, 23, 0.1);
	}

	.euro-symbol {
		color: #6b7280;
		font-weight: 600;
		font-size: 1.25rem;
		transition: all 0.3s ease;
	}

	.amount-input:focus + .euro-symbol {
		color: var(--brand);
	}

	.form-buttons {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		width: 100%;
	}

	.form-buttons :global(a),
	.form-buttons :global(button) {
		width: 100% !important;
		min-width: 100% !important;
		max-width: 100% !important;
	}

	.form-buttons :global(.alt) {
		border: 2px solid var(--brand) !important;
		background-color: var(--bg) !important;
		color: var(--brand) !important;
	}

	.form-buttons :global(.alt:hover) {
		background-color: var(--brand-light) !important;
	}

	.amount-label {
		font-weight: 600;
		color: var(--text);
		font-size: 1rem;
		white-space: nowrap;
	}

	.bank-transfer-info {
		margin: 1.5rem 0;
		padding: 1.5rem;
		background: #f8fafc;
		border-radius: 8px;
		border: 1px solid #e5e7eb;
		text-align: center;
	}

	.bank-transfer-info p {
		margin: 0;
		color: #6b7280;
		font-size: 0.95rem;
	}

	.error-message {
		background: #fee;
		border: 1px solid #fcc;
		border-radius: 4px;
		padding: 0.75rem;
		margin: 1rem 0;
		color: #c33;
		font-size: 0.9rem;
		text-align: center;
	}

	.form-buttons .disabled {
		opacity: 0.6 !important;
		cursor: not-allowed !important;
		pointer-events: none !important;
	}

	.faq-section {
		margin-top: 3rem;
	}

	@media (max-width: 480px) {
		article {
			padding: 0 1rem;
		}
	}
</style>
