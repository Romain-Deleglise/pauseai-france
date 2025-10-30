<script lang="ts">
	let firstName = ''
	let lastName = ''
	let email = ''
	let subscribeNewsletter = true
	let subscribeSubstack = false
	let subscribePolicyProposals = true
	let subscribeConferenceReport = true
	let isSubmitting = false
	let message = ''
	let isError = false

	async function submitForm(event: Event) {
		event.preventDefault()
		isError = false
		message = ''

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!email || !emailRegex.test(email)) {
			isError = true
			message = 'Veuillez saisir une adresse e-mail valide'
			return
		}

		// Require at least one subscription option
		if (
			!subscribeNewsletter &&
			!subscribeSubstack &&
			!subscribeConferenceReport &&
			!subscribePolicyProposals
		) {
			isError = true
			message = 'Sélectionnez au moins une option'
			return
		}

		isSubmitting = true
		try {
			const res = await fetch('/api/subscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email,
					subscribeNewsletter,
					subscribeSubstack,
					subscribeConferenceReport,
					subscribePolicyProposals,
					firstName: firstName || undefined,
					lastName: lastName || undefined,
					source: 'senat2025'
				})
			})
			const json = await res.json()
			if (res.ok && json.success) {
				message = json.message || 'Merci, inscription enregistrée.'
				firstName = ''
				lastName = ''
				email = ''
				// Keep defaults for toggles for faster multiple entries
			} else {
				isError = true
				message = json.error || 'Une erreur est survenue.'
			}
		} catch (e) {
			isError = true
			message = 'Erreur réseau, réessayez.'
		} finally {
			isSubmitting = false
		}
	}
</script>

<svelte:head>
	<meta
		name="description"
		content="Colloque au Sénat — Accédez aux recommandations, synthèses et prochaines étapes. Inscrivez-vous pour recevoir notre compte-rendu et nos propositions législatives."
	/>
	<title>Colloque Sénat — Recommandations & compte-rendu | Pause IA</title>
</svelte:head>

<section class="wrap">
	<div class="hero">
		<img
			src="/Cover.jpg"
			alt="Colloque Sénat — Intelligence Artificielle : Sécuriser les pratiques, contenir les risques"
		/>
		<div class="hero-text">
			<h1>COLLOQUE SÉNAT — 31 OCTOBRE 2025</h1>
			<p class="subtitle">
				Intelligence Artificielle : Sécuriser les Pratiques, Contenir les Risques
			</p>
			<p class="cta">Accédez à nos recommandations pour les décideurs</p>
		</div>
	</div>

	<div class="content">
		<div class="two-col">
			<div>
				<h2>Restez informé·e</h2>
				<p>Inscrivez-vous pour recevoir :</p>
				<ul class="features">
					<li>→ Notre analyse détaillée</li>
					<li>→ Notre newsletter</li>
					<li>→ Nos propositions législatives</li>
					<li>→ Les prochains événements</li>
				</ul>
			</div>
			<div>
				<h2>Ce que vous trouverez</h2>
				<ul class="features">
					<li>✓ Synthèse des interventions</li>
					<li>✓ Recommandations concrètes pour les parlementaires</li>
					<li>✓ Ressources pour approfondir</li>
					<li>✓ Prochaines étapes & actions</li>
				</ul>
			</div>
		</div>

		<form on:submit|preventDefault={submitForm} class="form">
			<div class="grid">
				<label>
					<span>Prénom</span>
					<input type="text" bind:value={firstName} autocomplete="given-name" />
				</label>
				<label>
					<span>Nom</span>
					<input type="text" bind:value={lastName} autocomplete="family-name" />
				</label>
			</div>

			<label>
				<span>Adresse e-mail</span>
				<input type="email" bind:value={email} required autocomplete="email" />
			</label>

			<fieldset class="choices">
				<legend>Choix d'abonnement</legend>
				<label class="check">
					<input type="checkbox" bind:checked={subscribeConferenceReport} disabled={isSubmitting} />
					<span>Recevoir le compte-rendu de la conférence</span>
				</label>
				<label class="check">
					<input type="checkbox" bind:checked={subscribePolicyProposals} disabled={isSubmitting} />
					<span>Nos propositions législatives</span>
				</label>
				<label class="check">
					<input type="checkbox" bind:checked={subscribeNewsletter} disabled={isSubmitting} />
					<span>Newsletter Pause IA</span>
				</label>
				<label class="check">
					<input type="checkbox" bind:checked={subscribeSubstack} disabled={isSubmitting} />
					<span>Blog Substack Pause IA</span>
				</label>
			</fieldset>

			{#if message}
				<div class:msg-error={isError} class="msg">{message}</div>
			{/if}

			<button type="submit" disabled={isSubmitting}>Envoyer</button>
		</form>
	</div>
</section>

<style>
	.wrap {
		max-width: 960px;
		margin: 0 auto;
		padding: 1.5rem 1rem 3rem;
	}
	.hero {
		position: relative;
		border-radius: 12px;
		overflow: hidden;
	}
	.hero img {
		width: 100%;
		display: block;
		object-fit: cover;
		max-height: 360px;
	}
	.hero-text {
		position: absolute;
		inset: auto 0 0 0;
		padding: 1rem;
		background: linear-gradient(
			180deg,
			rgba(0, 0, 0, 0) 0%,
			rgba(0, 0, 0, 0.55) 60%,
			rgba(0, 0, 0, 0.75) 100%
		);
		color: #fff;
	}
	.hero-text h1 {
		margin: 0 0 0.25rem 0;
		font-size: 1.25rem;
	}
	.hero-text .subtitle {
		margin: 0 0 0.25rem 0;
		font-weight: 600;
	}
	.hero-text .cta {
		margin: 0;
		opacity: 0.9;
	}

	.two-col {
		display: grid;
		gap: 1.25rem;
		grid-template-columns: 1fr;
		margin-top: 1.25rem;
	}
	@media (min-width: 760px) {
		.two-col {
			grid-template-columns: 1fr 1fr;
		}
	}
	.features {
		list-style: none;
		padding: 0;
		margin: 0.5rem 0 0 0;
	}
	.features li {
		margin: 0.25rem 0;
	}

	.form {
		margin-top: 1rem;
		display: grid;
		gap: 1rem;
	}
	.grid {
		display: grid;
		gap: 1rem;
		grid-template-columns: 1fr;
	}
	@media (min-width: 600px) {
		.grid {
			grid-template-columns: 1fr 1fr;
		}
	}
	label span {
		display: block;
		font-weight: 600;
		margin-bottom: 0.25rem;
	}
	input[type='text'],
	input[type='email'] {
		width: 100%;
		padding: 0.6rem 0.7rem;
		border: 1px solid #ccc;
		border-radius: 6px;
		font-size: 1rem;
	}
	fieldset.choices {
		border: 1px solid #e5e5e5;
		border-radius: 8px;
		padding: 0.75rem 1rem;
	}
	fieldset.choices legend {
		padding: 0 0.25rem;
		font-weight: 600;
	}
	.check {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin: 0.25rem 0;
	}
	.msg {
		margin: 0.25rem 0 0;
		font-weight: 600;
	}
	.msg-error {
		color: #b00020;
	}
	button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: var(--brand, #ffd42a);
		color: var(--black, #000);
		border: 0;
		padding: 0.7rem 1.1rem;
		border-radius: 8px;
		font-weight: 700;
		cursor: pointer;
	}
</style>
