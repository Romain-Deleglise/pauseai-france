<script lang="ts">
	import PostMeta from '$lib/components/PostMeta.svelte'
	import UnderlinedTitle from '$lib/components/UnderlinedTitle.svelte'
</script>

<PostMeta
	title="Merci pour votre don - Pause IA"
	description="Votre don a été reçu avec succès. Merci de soutenir Pause IA dans sa mission."
/>

<main class="container">
	<section class="success-content">
		<UnderlinedTitle>Merci pour votre générosité !</UnderlinedTitle>

		<div class="success-message">
			<div class="success-icon">✅</div>
			<h2>Votre don a été reçu avec succès</h2>
			<p>
				Merci infiniment pour votre soutien à Pause IA. Votre contribution nous aide à poursuivre
				notre mission de sensibilisation aux risques de l'intelligence artificielle.
			</p>
			<p>
				Vous recevrez un reçu de don par email dans les prochaines minutes. Ce reçu vous permettra
				de bénéficier des avantages fiscaux en vigueur.
			</p>
		</div>

		<div class="next-steps">
			<h3>Et maintenant ?</h3>
			<ul>
				<li>📧 Restez informé·e en vous inscrivant à notre newsletter</li>
				<li>🤝 Rejoignez notre communauté sur les réseaux sociaux</li>
				<li>📰 Partagez nos contenus pour sensibiliser votre entourage</li>
				<li>🗳️ Participez à nos actions de plaidoyer</li>
			</ul>
		</div>

		<div class="return-link">
			<a href="/">Retour à l'accueil</a>
		</div>
	</section>
</main>

<style>
	.container {
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem;
	}

	.success-content {
		text-align: center;
	}

	.success-message {
		background: white;
		border-radius: 12px;
		padding: 3rem 2rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		margin: 2rem 0;
	}

	.success-icon {
		font-size: 4rem;
		margin-bottom: 1rem;
	}

	.success-message h2 {
		color: var(--brand);
		margin-bottom: 1.5rem;
		font-size: 1.75rem;
	}

	.success-message p {
		color: var(--text);
		line-height: 1.6;
		margin-bottom: 1rem;
		font-size: 1.1rem;
	}

	.next-steps {
		background: var(--bg);
		border-radius: 12px;
		padding: 2rem;
		margin: 2rem 0;
		border: 2px solid var(--brand-light);
	}

	.next-steps h3 {
		color: var(--brand);
		margin-bottom: 1rem;
	}

	.next-steps ul {
		list-style: none;
		padding: 0;
		text-align: left;
		display: inline-block;
	}

	.next-steps li {
		color: var(--text);
		margin-bottom: 0.5rem;
		font-size: 1.1rem;
	}

	.return-link {
		margin-top: 2rem;
	}

	.return-link a {
		color: var(--brand);
		text-decoration: none;
		font-weight: 600;
		font-size: 1.1rem;
		border: 2px solid var(--brand);
		padding: 0.75rem 1.5rem;
		border-radius: 8px;
		transition: all 0.3s;
	}

	.return-link a:hover {
		background-color: var(--brand);
		color: white;
	}
</style>
