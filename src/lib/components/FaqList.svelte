<script lang="ts">
	import { onMount } from 'svelte'
	import type { FaqCategory } from '$lib/faq'

	export let categories: FaqCategory[]
	// Ouvre tous les items (utile pendant une recherche).
	export let open = false

	// Deep-linking : ouvre et fait défiler vers la question ciblée par le hash de
	// l'URL (les <details> natifs ne s'ouvrent pas tout seuls sur une ancre).
	function openFromHash() {
		const id = decodeURIComponent(location.hash.slice(1))
		if (!id) return
		const el = document.getElementById(id)
		if (el instanceof HTMLDetailsElement) {
			el.open = true
			el.scrollIntoView({ behavior: 'smooth', block: 'start' })
		}
	}
	onMount(() => {
		openFromHash()
		window.addEventListener('hashchange', openFromHash)
		return () => window.removeEventListener('hashchange', openFromHash)
	})
</script>

<div class="faq-list">
	{#each categories as cat (cat.category)}
		<section class="faq-cat-block">
			<h3 class="faq-cat">{cat.category}</h3>
			{#each cat.items as item (item.id)}
				<details class="faq-item" id={item.id} {open}>
					<summary>
						<span class="faq-q">{item.question}</span>
						<span class="faq-chevron" aria-hidden="true">
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
								<path
									d="M5 7.5L10 12.5L15 7.5"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						</span>
					</summary>
					<!-- Contenu toujours présent dans le HTML (visible des robots) -->
					<div class="faq-answer">{@html item.answerHtml}</div>
				</details>
			{/each}
		</section>
	{/each}
</div>

<style>
	.faq-cat-block {
		margin-bottom: 2rem;
	}

	.faq-cat {
		font-size: 1.3rem;
		font-weight: 700;
		color: var(--brand);
		margin: 2.5rem 0 1rem;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid var(--brand);
	}

	.faq-cat-block:first-child .faq-cat {
		margin-top: 0;
	}

	.faq-item {
		border-bottom: 1px solid var(--border);
	}

	.faq-item summary {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1.15rem 0;
		cursor: pointer;
		list-style: none;
		font-weight: 600;
		font-size: 1.05rem;
		color: var(--text);
	}

	.faq-item summary::-webkit-details-marker {
		display: none;
	}

	.faq-item summary:hover {
		color: var(--brand-subtle);
	}

	.faq-chevron {
		flex-shrink: 0;
		color: var(--text-secondary);
		transition: transform 0.25s ease;
	}

	.faq-item[open] .faq-chevron {
		transform: rotate(180deg);
	}

	.faq-answer {
		padding: 0 0 1.35rem;
	}

	.faq-answer :global(p) {
		line-height: 1.65;
		color: var(--text-2);
		margin: 0 0 0.85rem;
	}

	.faq-answer :global(p:last-child) {
		margin-bottom: 0;
	}

	.faq-answer :global(a) {
		color: var(--brand-subtle);
		font-weight: 600;
	}
</style>
