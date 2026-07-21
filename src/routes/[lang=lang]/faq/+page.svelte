<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import FaqList from '$components/FaqList.svelte'
	import { page } from '$app/stores'
	import { parseFaq, flattenFaq, faqJsonLd } from '$lib/faq'
	// @ts-ignore - Vite raw import
	import faqRaw from '$posts/faq.md?raw'
	// @ts-ignore - Vite raw import
	import faqRawEn from '$posts/en/faq.md?raw'

	$: isEn = $page.params.lang === 'en'
	$: categories = parseFaq(isEn ? faqRawEn : faqRaw)
	$: jsonLd = faqJsonLd(flattenFaq(categories))

	const t = {
		fr: {
			title: 'FAQ | Pause IA',
			desc: "Questions fréquentes sur Pause IA, les risques de l'intelligence artificielle et ce que nous demandons : qui nous sommes, notre financement, ce que nous demandons et comment s'impliquer.",
			heading: 'Foire aux questions',
			intro:
				'Des questions ? Voici les réponses aux interrogations les plus fréquentes de nos visiteurs, journalistes et soutiens.',
			search: 'Rechercher une question...',
			searchLabel: 'Rechercher dans la FAQ',
			result: (n: number) => `${n} résultat${n !== 1 ? 's' : ''}`,
			noResults: (query: string) =>
				`Aucun résultat pour « ${query} ». Essayez avec d'autres mots-clés.`
		},
		en: {
			title: 'FAQ | Pause IA',
			desc: 'Frequently asked questions about Pause IA, the risks of artificial intelligence and what we ask for: who we are, how we are funded, what we demand and how to get involved.',
			heading: 'Frequently asked questions',
			intro:
				'Have questions? Here are the answers to the questions most often asked by our visitors, journalists and supporters.',
			search: 'Search a question...',
			searchLabel: 'Search the FAQ',
			result: (n: number) => `${n} result${n !== 1 ? 's' : ''}`,
			noResults: (query: string) => `No results for "${query}". Try other keywords.`
		}
	}
	$: tr = isEn ? t.en : t.fr

	let query = ''
	$: q = query.trim().toLowerCase()
	$: filtered =
		q.length < 2
			? categories
			: categories
					.map((c) => ({
						...c,
						items: c.items.filter(
							(i) => i.question.toLowerCase().includes(q) || i.answerText.toLowerCase().includes(q)
						)
					}))
					.filter((c) => c.items.length > 0)
	$: resultCount = filtered.reduce((n, c) => n + c.items.length, 0)
	$: searching = q.length >= 2
</script>

<PostMeta title={tr.title} description={tr.desc} />

<svelte:head>
	{@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>

<article>
	<UnderlinedTitle>{tr.heading}</UnderlinedTitle>

	<p class="intro">{tr.intro}</p>

	<div class="search-wrapper">
		<svg
			class="search-icon"
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			aria-hidden="true"
		>
			<circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" />
			<path d="M16 16L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
		</svg>
		<input
			type="search"
			bind:value={query}
			placeholder={tr.search}
			aria-label={tr.searchLabel}
			autocomplete="off"
		/>
	</div>

	{#if searching}
		<p class="result-count">{tr.result(resultCount)}</p>
	{/if}

	{#if resultCount === 0}
		<p class="no-results">{tr.noResults(query)}</p>
	{:else}
		<FaqList categories={filtered} open={searching} />
	{/if}
</article>

<style>
	article {
		max-inline-size: 55rem;
		margin-inline: auto;
		padding: 2.5rem 1.25rem 5rem;
	}

	.intro {
		font-size: 1.05rem;
		line-height: 1.6;
		color: var(--text-2);
		max-width: 46rem;
		margin: 0 0 1.75rem;
	}

	.search-wrapper {
		position: relative;
		margin-bottom: 1.5rem;
	}

	.search-icon {
		position: absolute;
		left: 0.85rem;
		top: 50%;
		transform: translateY(-50%);
		color: var(--text-secondary);
		pointer-events: none;
	}

	.search-wrapper input {
		width: 100%;
		padding: 0.7rem 0.85rem 0.7rem 2.75rem;
		border: 2px solid var(--border);
		border-radius: 0.625rem;
		font-size: 1rem;
		font-family: inherit;
		background: var(--bg);
		color: var(--text);
	}

	.search-wrapper input:focus {
		outline: none;
		border-color: var(--brand);
	}

	.result-count {
		font-size: 0.85rem;
		color: var(--text-secondary);
		margin: 0 0 1rem;
	}

	.no-results {
		text-align: center;
		color: var(--text-secondary);
		padding: 2rem 1rem;
		font-style: italic;
	}
</style>
