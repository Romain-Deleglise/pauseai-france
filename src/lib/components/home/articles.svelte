<script lang="ts">
	import ArticleCard from '$components/ArticleCard.svelte'
	import Button from '$components/Button.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import type { Article } from '$lib/notion'

	export let articles: Article[] = []

	const label_id = 'articles-title'

	// Fallback articles if Notion data is not available
	const fallbackArticles: Article[] = [
		{
			id: '1',
			title: "WaitButWhy et l'IA, 10 ans après",
			description:
				"En 2015, WaitButWhy écrivait sur les dangers de l'IA. Nous avons traduit la série originelle, et donné une perspective 10 ans après.",
			url: 'https://pauseia.substack.com/p/la-revolution-de-lia-dix-ans-apres',
			type: 'Article',
			order: 1,
			visible: true
		},
		{
			id: '2',
			title: "L'IA et la Cybersécurité",
			description:
				"Les systèmes d'IA peuvent déjà analyser et écrire du code, identifier des vulnérabilités et les exploiter.",
			url: 'https://pauseia.substack.com/p/lia-et-la-cybersecurite',
			type: 'Article',
			order: 2,
			visible: true
		},
		{
			id: '3',
			title: "Quatre niveaux de réglementation de l'IA",
			description:
				"Clarifier et mesurer l'efficacité des réglementations aux différentes étapes du processus de création d'un modèle.",
			url: 'https://pauseia.substack.com/p/quatre-niveaux-de-reglementation',
			type: 'Article',
			order: 3,
			visible: true
		},
		{
			id: '4',
			title: 'Newsletter Pause IA - Février 2025',
			description:
				"Retrouvez toute l'actualité de Pause IA : actions, événements, et analyses sur les risques de l'intelligence artificielle.",
			url: 'https://civicrm.pauseia.fr/civicrm/mailing/view?id=93&reset=1',
			type: 'Newsletter',
			order: 4,
			visible: true
		}
	]

	$: displayArticles = articles.length > 0 ? articles : fallbackArticles
</script>

<section aria-labelledby={label_id}>
	<UnderlinedTitle id={label_id}>Nos publications</UnderlinedTitle>
	<div class="articles-grid">
		{#each displayArticles as article (article.id)}
			<ArticleCard
				title={article.title}
				blurb={article.description}
				url={article.url}
				category={article.type}
			/>
		{/each}
	</div>
	<div class="buttons-row">
		<Button href="https://pauseia.substack.com/">Voir tous les articles</Button>
		<Button alt href="https://pauseia.substack.com/subscribe" target="_blank">
			S'abonner au blog
		</Button>
	</div>
</section>

<style>
	section {
		margin-bottom: 1rem;
	}

	.articles-grid {
		display: grid;
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.buttons-row {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		justify-content: center;
	}

	.buttons-row :global(a.alt) {
		border: 2px solid var(--text);
	}

	@media (min-width: 640px) {
		.articles-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (min-width: 640px) {
		.articles-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
