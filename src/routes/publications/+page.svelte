<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import NewsletterCard from '$components/NewsletterCard.svelte'
	import Button from '$components/Button.svelte'
	import { Search, X } from 'lucide-svelte'
	import type { Article } from '$lib/notion'
	import type { PageData } from './$types'

	export let data: PageData

	// Fallback newsletters if Notion data is not available
	const fallbackNewsletters: Article[] = [
		{
			id: '1',
			title: 'Newsletter Pause IA - Janvier 2025',
			description:
				"Pourquoi l'IA est notre priorité absolue ; Action au sommet pour l'action sur l'IA ; Nouvelles du front ; Les actus du mois.",
			url: 'https://civicrm.pauseia.fr/civicrm/mailing/view?id=88&reset=1',
			type: 'Newsletter' as const,
			order: 1,
			visible: true,
			date: '2025-01-15'
		},
		{
			id: '2',
			title: 'Newsletter Pause IA - Décembre 2024',
			description:
				'Retour sur le colloque au Sénat ; Notre roadmap pour 2025 ; Nouvelles du front ; Les actus du mois.',
			url: 'https://civicrm.pauseia.fr/civicrm/mailing/view?id=85&reset=1',
			type: 'Newsletter' as const,
			order: 2,
			visible: true,
			date: '2024-12-15'
		},
		{
			id: '3',
			title: 'Newsletter Pause IA - Novembre 2024',
			description:
				'Colloque au Sénat - programme et inscription ; Nouvelles du front ; Les actus du mois.',
			url: 'https://civicrm.pauseia.fr/civicrm/mailing/view?id=82&reset=1',
			type: 'Newsletter' as const,
			order: 3,
			visible: true,
			date: '2024-11-15'
		},
		{
			id: '4',
			title: 'Newsletter Pause IA - Octobre 2024',
			description:
				'Retour sur nos actions de rentrée ; Annonce du colloque au Sénat ; Nouvelles du front ; Les actus du mois.',
			url: 'https://civicrm.pauseia.fr/civicrm/mailing/view?id=78&reset=1',
			type: 'Newsletter' as const,
			order: 4,
			visible: true,
			date: '2024-10-15'
		}
	]

	$: newsletters = data.newsletters.length > 0 ? data.newsletters : fallbackNewsletters

	// Search
	let searchQuery = ''

	$: filteredNewsletters = searchQuery.trim()
		? newsletters.filter((n) => {
				const query = searchQuery.toLowerCase()
				return (
					n.title.toLowerCase().includes(query) ||
					n.description.toLowerCase().includes(query) ||
					(n.date && n.date.includes(query))
				)
			})
		: newsletters

	function clearSearch() {
		searchQuery = ''
	}

	const title = 'Newsletters'
	const description = 'Retrouvez toutes les newsletters de Pause IA'
</script>

<PostMeta {title} {description} />

<div class="page">
	<header class="page-header">
		<UnderlinedTitle as="h1">Nos newsletters</UnderlinedTitle>
		<p class="page-subtitle">
			Retrouvez l'ensemble de nos newsletters mensuelles. Chaque édition couvre nos actions, les
			actualités de l'IA et les moyens d'agir.
		</p>
	</header>

	<div class="search-bar">
		<div class="search-input-wrapper">
			<Search size="1.25rem" />
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Rechercher une newsletter..."
				aria-label="Rechercher une newsletter"
			/>
			{#if searchQuery}
				<button class="clear-btn" on:click={clearSearch} aria-label="Effacer la recherche">
					<X size="1.125rem" />
				</button>
			{/if}
		</div>
	</div>

	{#if filteredNewsletters.length > 0}
		<p class="results-count">
			{filteredNewsletters.length}
			{filteredNewsletters.length === 1 ? 'newsletter' : 'newsletters'}
			{#if searchQuery.trim()}
				pour «&nbsp;{searchQuery.trim()}&nbsp;»
			{/if}
		</p>
		<div class="newsletter-grid">
			{#each filteredNewsletters as newsletter (newsletter.id)}
				<NewsletterCard
					title={newsletter.title}
					description={newsletter.description}
					url={newsletter.url}
					date={newsletter.date || ''}
					image={newsletter.image || ''}
				/>
			{/each}
		</div>
	{:else}
		<div class="empty-state">
			<p>Aucune newsletter ne correspond à votre recherche.</p>
			<Button on:click={clearSearch}>Effacer la recherche</Button>
		</div>
	{/if}

	<div class="cta-section">
		<div class="cta-content">
			<h2>Ne manquez aucune newsletter</h2>
			<p>
				Recevez chaque mois nos actualités, analyses et appels à l'action directement dans votre
				boîte mail.
			</p>
			<Button href="/#newsletter">S'abonner à la newsletter</Button>
		</div>
	</div>
</div>

<style>
	.page {
		max-width: 72rem;
		margin: 0 auto;
		padding: 2rem 1rem 4rem;
	}

	.page-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.page-header :global(h1) {
		display: inline-block;
	}

	.page-subtitle {
		max-width: 40rem;
		margin: 0 auto;
		color: var(--text-secondary, #676e7a);
		font-size: 1.125rem;
		line-height: 1.6;
	}

	/* Search bar */
	.search-bar {
		max-width: 36rem;
		margin: 0 auto 2rem;
	}

	.search-input-wrapper {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		background: white;
		border: 2px solid var(--border, #e5e7eb);
		border-radius: 0.75rem;
		padding: 0.75rem 1rem;
		transition:
			border-color 0.2s ease,
			box-shadow 0.2s ease;
		color: var(--text-secondary, #676e7a);
	}

	.search-input-wrapper:focus-within {
		border-color: var(--brand, #ff9416);
		box-shadow: 0 0 0 3px rgba(255, 148, 22, 0.15);
	}

	.search-input-wrapper input {
		flex: 1;
		border: none;
		outline: none;
		background: transparent;
		font-family: var(--font-body);
		font-size: 1rem;
		color: var(--text, black);
	}

	.search-input-wrapper input::placeholder {
		color: var(--text-secondary, #676e7a);
	}

	.clear-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		background: none;
		border: none;
		cursor: pointer;
		color: var(--text-secondary, #676e7a);
		padding: 0.25rem;
		border-radius: 4px;
		transition: color 0.2s ease;
	}

	.clear-btn:hover {
		color: var(--text, black);
	}

	/* Results count */
	.results-count {
		font-size: 0.875rem;
		color: var(--text-secondary, #676e7a);
		margin-bottom: 1.5rem;
	}

	/* Newsletter grid */
	.newsletter-grid {
		display: grid;
		gap: 1.5rem;
		grid-template-columns: 1fr;
	}

	/* Empty state */
	.empty-state {
		text-align: center;
		padding: 4rem 1rem;
		color: var(--text-secondary, #676e7a);
	}

	.empty-state p {
		font-size: 1.125rem;
		margin-bottom: 1.5rem;
	}

	/* CTA section */
	.cta-section {
		margin-top: 4rem;
		padding: 3rem 2rem;
		background: linear-gradient(135deg, #fff8f0 0%, #fff0e0 100%);
		border-radius: 1rem;
		text-align: center;
	}

	.cta-content h2 {
		margin-top: 0;
		margin-bottom: 0.75rem;
		font-size: 1.5rem;
	}

	.cta-content p {
		color: var(--text-secondary, #676e7a);
		max-width: 32rem;
		margin: 0 auto 1.5rem;
		line-height: 1.6;
	}

	@media (min-width: 640px) {
		.page {
			padding: 3rem 2rem 6rem;
		}

		.page-header {
			margin-bottom: 3rem;
		}

		.newsletter-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.search-bar {
			margin-bottom: 2.5rem;
		}
	}

	@media (min-width: 1024px) {
		.page {
			padding: 4rem 4rem 8rem;
		}

		.newsletter-grid {
			grid-template-columns: repeat(3, 1fr);
		}

		.cta-section {
			margin-top: 5rem;
		}
	}
</style>
