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
		<div class="campaign-card ended">
			<span class="badge badge-ended">Terminée</span>
			<h2>Élections municipales 2026</h2>
			<p>Sensibilisons nos futurs élus locaux et demandons-leur de signer la charte Pause IA.</p>
		</div>

		<div class="campaign-card ended">
			<span class="badge badge-ended">Terminée</span>
			<h2>Sommet de l'IA 2026</h2>
			<p>
				Mobilisons-nous pour que le Sommet international de l'IA en Inde place la sécurité au
				premier plan.
			</p>
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
		color: var(--text-secondary);
	}

	.campaigns-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		margin-bottom: 5rem;
	}

	.campaign-card {
		background: var(--bg-subtle);
		border-radius: 16px;
		padding: 2.5rem 2rem;
		border: 1px solid var(--border);
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-start;
	}

	.campaign-card.ended {
		opacity: 0.75;
	}

	.badge {
		display: inline-block;
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
		margin-bottom: 1rem;
	}

	.badge-ended {
		background: #f5f5f5;
		color: #888;
	}

	h2 {
		font-size: 1.75rem;
		margin-top: 0;
		margin-bottom: 1rem;
		color: var(--text);
	}

	.campaign-card p {
		font-size: 1.1rem;
		line-height: 1.6;
		margin-bottom: 2rem;
		color: var(--text-secondary);
	}

	@media (max-width: 600px) {
		.campaign-card {
			padding: 1.5rem;
		}
	}
</style>
