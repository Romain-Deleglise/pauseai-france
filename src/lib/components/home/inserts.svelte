<script lang="ts">
	import ArticleCard from '$components/ArticleCard.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	const label_id = 'inserts-title'
</script>

<section aria-labelledby={label_id}>
	<UnderlinedTitle id={label_id}>Rapports et Solutions</UnderlinedTitle>
	<div class="inserts-grid">
		<ArticleCard
			title="IA{' '}: nos craintes pour la France"
			blurb="Analyse critique du rapport de la Commission IA, soulignant les risques ignorés et les conflits d'intérêts."
			url="https://contre-rapport-ia.fr/"
			linkText="Voir le site"
		/>
		<ArticleCard
			title="Reprendre le Contrôle: Forum des solutions pour une IA compatible avec l'humanité"
			blurb="Explorer les approches et solutions pour une gestion responsable de l'IA."
			url="https://controleia.org/solutions/"
			linkText="Voir le site"
		/>
	</div>
</section>

<style>
	.inserts-grid {
		display: grid;
		gap: 1rem;
		margin-bottom: 2rem; /* Match spacing if needed */
	}

	@media (min-width: 640px) {
		.inserts-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	/* Optional: Adjust grid for larger screens if desired, like articles */
	/* @media (min-width: 1024px) {
		.inserts-grid {
			grid-template-columns: 1fr 1fr 1fr; // If you want 3 columns on large screens
		}
	} */
</style>
