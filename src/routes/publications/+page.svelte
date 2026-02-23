<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import NewsletterCard from '$components/NewsletterCard.svelte'
	import Button from '$components/Button.svelte'
	import { Search, X, Mail } from 'lucide-svelte'
	import type { Article } from '$lib/notion'
	import type { PageData } from './$types'

	export let data: PageData

	// Fallback newsletters if Notion data is not available
	const fallbackNewsletters: Article[] = [
		{
			id: '1',
			title: 'Newsletter Pause IA - Janvier 2025',
			slug: 'newsletter-pause-ia---janvier-2025',
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
			slug: 'newsletter-pause-ia---decembre-2024',
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
			slug: 'newsletter-pause-ia---novembre-2024',
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
			slug: 'newsletter-pause-ia---octobre-2024',
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

	// Pagination
	const PAGE_SIZE = 12
	let currentPage = 1

	// Reset to page 1 when search changes
	$: if (searchQuery !== undefined) currentPage = 1

	$: totalPages = Math.max(1, Math.ceil(filteredNewsletters.length / PAGE_SIZE))
	$: paginatedNewsletters = filteredNewsletters.slice(
		(currentPage - 1) * PAGE_SIZE,
		currentPage * PAGE_SIZE
	)

	function goToPage(page: number) {
		currentPage = page
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	function clearSearch() {
		searchQuery = ''
	}

	// Newsletter subscription form
	let email = ''
	let isSubmitting = false
	let message = ''
	let isError = false

	interface ApiResponse {
		success?: boolean
		message?: string
		error?: string
	}

	async function handleSubscribe(event: Event) {
		event.preventDefault()
		message = ''
		isError = false

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!email || !emailRegex.test(email)) {
			message = 'Adresse e-mail invalide'
			isError = true
			return
		}

		isSubmitting = true

		try {
			const response = await fetch('/api/subscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email,
					subscribeNewsletter: true,
					subscribeSubstack: false,
					source: 'publications-page'
				})
			})

			const result = (await response.json()) as ApiResponse

			if (response.ok) {
				message = 'Inscription confirmée !'
				isError = false
				email = ''
			} else {
				message = result.error ?? 'Une erreur est survenue'
				isError = true
			}
		} catch {
			message = 'Erreur de connexion'
			isError = true
		} finally {
			isSubmitting = false
		}
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

	<div class="subscribe-bar">
		<div class="subscribe-icon">
			<Mail size="1.25rem" />
		</div>
		<form on:submit={handleSubscribe} class="subscribe-form">
			<div class="subscribe-input-group">
				<input
					type="email"
					bind:value={email}
					placeholder="votre@email.com"
					disabled={isSubmitting}
					aria-label="Adresse e-mail"
				/>
				<button type="submit" disabled={isSubmitting}>
					{#if isSubmitting}...{:else}S'abonner{/if}
				</button>
			</div>
			{#if message}
				<p class="subscribe-message" class:error={isError} class:success={!isError}>
					{message}
				</p>
			{/if}
		</form>
	</div>

	<div class="search-bar">
		<label for="newsletter-search" class="search-label">Rechercher :</label>
		<div class="search-input-wrapper">
			<span class="search-icon"><Search size="1rem" /></span>
			<input
				id="newsletter-search"
				type="text"
				bind:value={searchQuery}
				placeholder="Titre, mots-clés, date..."
				aria-label="Rechercher une newsletter"
				autocomplete="off"
			/>
			{#if searchQuery}
				<button class="clear-btn" on:click={clearSearch} aria-label="Effacer la recherche">
					<X size="1rem" />
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
			{#each paginatedNewsletters as newsletter (newsletter.id)}
				<NewsletterCard
					title={newsletter.title}
					description={newsletter.description}
					url={newsletter.url}
					slug={newsletter.slug}
					date={newsletter.date || ''}
					image={newsletter.image || ''}
				/>
			{/each}
		</div>

		{#if totalPages > 1}
			<nav class="pagination" aria-label="Pagination des newsletters">
				<button
					class="pagination-btn"
					disabled={currentPage === 1}
					on:click={() => goToPage(currentPage - 1)}
					aria-label="Page précédente"
				>
					&larr;
				</button>
				{#each Array.from({ length: totalPages }, (_, i) => i + 1) as page}
					<button
						class="pagination-btn"
						class:active={page === currentPage}
						on:click={() => goToPage(page)}
						aria-label="Page {page}"
						aria-current={page === currentPage ? 'page' : undefined}
					>
						{page}
					</button>
				{/each}
				<button
					class="pagination-btn"
					disabled={currentPage === totalPages}
					on:click={() => goToPage(currentPage + 1)}
					aria-label="Page suivante"
				>
					&rarr;
				</button>
			</nav>
		{/if}
	{:else}
		<div class="empty-state">
			<p>Aucune newsletter ne correspond à votre recherche.</p>
			<Button on:click={clearSearch}>Effacer la recherche</Button>
		</div>
	{/if}
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

	/* Subscribe bar */
	.subscribe-bar {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		max-width: 36rem;
		margin: 0 auto 2rem;
		padding: 1rem 1.25rem;
		background: linear-gradient(135deg, #fff8f0 0%, #fff0e0 100%);
		border: 1px solid rgba(255, 148, 22, 0.2);
		border-radius: 0.75rem;
	}

	.subscribe-icon {
		color: var(--brand, #ff9416);
		flex-shrink: 0;
		margin-top: 0.5rem;
	}

	.subscribe-form {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
	}

	.subscribe-input-group {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.subscribe-form input[type='email'] {
		flex: 1;
		min-width: 160px;
		padding: 0.5rem 0.75rem;
		border: 1.5px solid rgba(0, 0, 0, 0.12);
		border-radius: 0.375rem;
		font-size: 0.9rem;
		font-family: inherit;
		background: white;
		color: var(--text);
		transition: border-color 0.2s;
	}

	.subscribe-form input[type='email']:focus {
		outline: none;
		border-color: var(--brand, #ff9416);
	}

	.subscribe-form input[type='email']:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.subscribe-form button {
		padding: 0.5rem 1rem;
		background: var(--brand, #ff9416);
		color: white;
		border: none;
		border-radius: 0.375rem;
		font-size: 0.9rem;
		font-weight: 600;
		font-family: inherit;
		cursor: pointer;
		transition: opacity 0.2s;
		white-space: nowrap;
	}

	.subscribe-form button:hover:not(:disabled) {
		opacity: 0.85;
	}

	.subscribe-form button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.subscribe-message {
		margin: 0;
		font-size: 0.8125rem;
		font-weight: 500;
	}

	.subscribe-message.success {
		color: #166534;
	}

	.subscribe-message.error {
		color: #991b1b;
	}

	/* Search bar — matches press page combobox style */
	.search-bar {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		max-width: 36rem;
		margin: 0 auto 2rem;
		flex-wrap: wrap;
	}

	.search-label {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--text, black);
		white-space: nowrap;
	}

	.search-input-wrapper {
		flex: 1;
		display: flex;
		align-items: center;
		border: 1px solid var(--border, #e5e7eb);
		border-radius: 0.5rem;
		background-color: white;
		transition:
			border-color 0.15s ease,
			box-shadow 0.15s ease;
	}

	.search-input-wrapper:focus-within {
		border-color: var(--brand, #ff9416);
		box-shadow: 0 0 0 3px rgba(255, 148, 22, 0.1);
	}

	.search-icon {
		display: flex;
		align-items: center;
		padding-left: 0.75rem;
		color: var(--text-secondary, #676e7a);
		flex-shrink: 0;
	}

	.search-input-wrapper input {
		flex: 1;
		padding: 0.5rem 0.5rem;
		font-size: 0.9rem;
		font-family: var(--font-body, inherit);
		border: none;
		background: transparent;
		color: var(--text, black);
		outline: none;
		min-width: 0;
	}

	.search-input-wrapper input::placeholder {
		color: var(--text-secondary, #676e7a);
		opacity: 0.7;
	}

	.clear-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.375rem;
		margin-right: 0.375rem;
		border: none;
		background: transparent;
		color: var(--text-secondary, #676e7a);
		cursor: pointer;
		border-radius: 0.25rem;
		transition:
			color 0.15s ease,
			background-color 0.15s ease;
	}

	.clear-btn:hover {
		color: var(--text, black);
		background-color: rgba(0, 0, 0, 0.06);
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

	/* Pagination */
	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.5rem;
		margin-top: 3rem;
	}

	.pagination-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 2.5rem;
		height: 2.5rem;
		padding: 0 0.75rem;
		border: 1.5px solid var(--border, #e5e7eb);
		border-radius: 0.5rem;
		background: white;
		color: var(--text, black);
		font-size: 0.9375rem;
		font-weight: 500;
		font-family: inherit;
		cursor: pointer;
		transition:
			border-color 0.2s,
			background 0.2s,
			color 0.2s;
	}

	.pagination-btn:hover:not(:disabled):not(.active) {
		border-color: var(--brand, #ff9416);
		color: var(--brand, #ff9416);
	}

	.pagination-btn.active {
		background: var(--brand, #ff9416);
		border-color: var(--brand, #ff9416);
		color: white;
		font-weight: 700;
	}

	.pagination-btn:disabled {
		opacity: 0.35;
		cursor: not-allowed;
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
	}
</style>
