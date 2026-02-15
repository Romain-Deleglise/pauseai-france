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
			title: 'Newsletter Pause IA - Janvier 2025',
			description:
				"Pourquoi l'IA est notre priorité absolue ; Action au sommet pour l'action sur l'IA ; Nouvelles du front ; Les actus du mois.",
			url: 'https://civicrm.pauseia.fr/civicrm/mailing/view?id=88&reset=1',
			type: 'Newsletter',
			order: 1,
			visible: true
		},
		{
			id: '2',
			title: 'Newsletter Pause IA - Décembre 2024',
			description:
				'Retour sur le colloque au Sénat ; Notre roadmap pour 2025 ; Nouvelles du front ; Les actus du mois.',
			url: 'https://civicrm.pauseia.fr/civicrm/mailing/view?id=85&reset=1',
			type: 'Newsletter',
			order: 2,
			visible: true
		},
		{
			id: '3',
			title: 'Newsletter Pause IA - Novembre 2024',
			description:
				'Colloque au Sénat - programme et inscription ; Nouvelles du front ; Les actus du mois.',
			url: 'https://civicrm.pauseia.fr/civicrm/mailing/view?id=82&reset=1',
			type: 'Newsletter',
			order: 3,
			visible: true
		},
		{
			id: '4',
			title: 'Newsletter Pause IA - Octobre 2024',
			description:
				'Retour sur nos actions de rentrée ; Annonce du colloque au Sénat ; Nouvelles du front ; Les actus du mois.',
			url: 'https://civicrm.pauseia.fr/civicrm/mailing/view?id=78&reset=1',
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
