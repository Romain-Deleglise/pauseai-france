<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import Button from '$lib/components/Button.svelte'

	const title = 'Nos Campagnes'
	const description =
		'Découvrez les campagnes menées par notre association pour sensibiliser et agir face aux risques de l’IA.'
</script>

<PostMeta {title} {description} />

<article>
	<section class="hero">
		<UnderlinedTitle as="h1">Nos Campagnes</UnderlinedTitle>
		<p class="intro">
			{description}
		</p>
	</section>

	<section class="campaigns-grid">
		<div class="campaign-card">
			<h2>Élections municipales 2026</h2>
			<p>Sensibilisons nos futurs élus locaux et demandons-leur de signer la charte Pause IA.</p>
			<Button href="/municipales-2026">Voir la campagne</Button>
		</div>

		<div class="campaign-card">
			<h2>Sommet de l'IA 2026</h2>
			<p>
				Mobilisons-nous pour que le Sommet international de l'IA en Inde place la sécurité au
				premier plan.
			</p>
			<Button href="/sommet-ia-2026">Voir la campagne</Button>
		</div>
	</section>
</article>

<style>
	article {
		max-inline-size: 60rem;
		margin-inline: auto;
		margin-top: 3rem;
		padding: 0 2rem;
	}

	.hero {
		text-align: left;
		margin-bottom: 4rem;
	}

	.intro {
		font-size: 1.25rem;
		line-height: 1.6;
		color: var(--text-muted, #444);
	}

	.campaigns-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		margin-bottom: 5rem;
	}

	.campaign-card {
		background: #fafafa;
		border-radius: 16px;
		padding: 2.5rem 2rem;
		border: 1px solid #eee;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-start;
	}

	h2 {
		font-size: 1.75rem;
		margin-top: 0;
		margin-bottom: 1rem;
		color: var(--text-heading, #222);
	}

	.campaign-card p {
		font-size: 1.1rem;
		line-height: 1.6;
		margin-bottom: 2rem;
		color: var(--text-muted, #444);
	}

	@media (max-width: 600px) {
		.campaign-card {
			padding: 1.5rem;
		}
	}
</style>
