<script lang="ts">
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import FAQ from '$posts/faq.md'
	import Fly from '$components/Fly.svelte'
	import { faqBulkAction } from '$lib/stores/faq'
	import { onMount } from 'svelte'
	// @ts-ignore - Vite raw import
	import faqRaw from '$posts/faq.md?raw'

	const label_id = 'faq-title'

	let searchQuery = ''
	let faqContainer: HTMLElement
	let allExpanded = false

	// Extract FAQ Q&A pairs from raw markdown for JSON-LD
	function extractFaqData(raw: string) {
		const lines = raw.split('\n')
		const faqs: { question: string; answer: string }[] = []
		let currentQuestion = ''
		let currentAnswer = ''

		for (const line of lines) {
			if (line.startsWith('## ')) {
				// Category header — close current Q/A if any
				if (currentQuestion) {
					faqs.push({ question: currentQuestion, answer: stripMarkdown(currentAnswer.trim()) })
					currentQuestion = ''
					currentAnswer = ''
				}
			} else if (line.startsWith('### ')) {
				if (currentQuestion) {
					faqs.push({ question: currentQuestion, answer: stripMarkdown(currentAnswer.trim()) })
				}
				currentQuestion = line.replace('### ', '')
				currentAnswer = ''
			} else if (currentQuestion) {
				currentAnswer += line + '\n'
			}
		}
		if (currentQuestion) {
			faqs.push({ question: currentQuestion, answer: stripMarkdown(currentAnswer.trim()) })
		}
		return faqs
	}

	function stripMarkdown(text: string) {
		return text
			.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // [links](url) → links
			.replace(/\*\*([^*]+)\*\*/g, '$1') // **bold** → bold
			.replace(/_([^_]+)_/g, '$1') // _italic_ → italic
			.replace(/^- /gm, '• ') // list markers
			.replace(/\n{3,}/g, '\n\n') // collapse excessive newlines
			.trim()
	}

	const faqData = extractFaqData(faqRaw)

	const jsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqData.map((item) => ({
			'@type': 'Question',
			name: item.question,
			acceptedAnswer: {
				'@type': 'Answer',
				text: item.answer
			}
		}))
	})

	// Search filtering via DOM
	function filterFaq(query: string) {
		if (!faqContainer) return
		const normalizedQuery = query.toLowerCase().trim()
		const accordions = faqContainer.querySelectorAll<HTMLElement>('.accordion')
		const categories = faqContainer.querySelectorAll<HTMLElement>('.faq-category')

		if (!normalizedQuery) {
			// Show everything
			accordions.forEach((el) => {
				const wrapper = el.closest<HTMLElement>('div.inView') || el.parentElement
				if (wrapper) wrapper.style.display = ''
			})
			categories.forEach((el) => (el.style.display = ''))
			return
		}

		// Hide/show each accordion based on title match
		accordions.forEach((el) => {
			const title = el.querySelector('.title')?.textContent?.toLowerCase() || ''
			const matches = title.includes(normalizedQuery)
			const wrapper = el.closest<HTMLElement>('div.inView') || el.parentElement
			if (wrapper) wrapper.style.display = matches ? '' : 'none'
		})

		// Hide categories that have no visible accordions after them
		categories.forEach((cat) => {
			let sibling = cat.nextElementSibling as HTMLElement | null
			let hasVisibleAccordion = false

			while (sibling && !sibling.classList.contains('faq-category')) {
				if (sibling.style.display !== 'none') {
					hasVisibleAccordion = true
					break
				}
				sibling = sibling.nextElementSibling as HTMLElement | null
			}
			cat.style.display = hasVisibleAccordion ? '' : 'none'
		})
	}

	$: if (faqContainer) filterFaq(searchQuery)

	function expandAll() {
		allExpanded = true
		faqBulkAction.set({ action: 'expand', ts: Date.now() })
	}

	function collapseAll() {
		allExpanded = false
		faqBulkAction.set({ action: 'collapse', ts: Date.now() })
	}
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>

<section class="faq" aria-labelledby={label_id}>
	<Fly>
		<UnderlinedTitle id={label_id}>F.A.Q.</UnderlinedTitle>
	</Fly>

	<div class="faq-toolbar">
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
				bind:value={searchQuery}
				placeholder="Rechercher une question..."
				aria-label="Rechercher dans la FAQ"
			/>
		</div>
		<div class="bulk-actions">
			{#if allExpanded}
				<button class="bulk-btn" on:click={collapseAll}>Tout replier</button>
			{:else}
				<button class="bulk-btn" on:click={expandAll}>Tout déplier</button>
			{/if}
		</div>
	</div>

	<div class="faq-content" bind:this={faqContainer}>
		<FAQ />
	</div>
</section>

<style>
	.faq-toolbar {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		align-items: center;
		margin-bottom: 2rem;
	}

	.search-wrapper {
		position: relative;
		flex: 1;
		min-width: 200px;
	}

	.search-icon {
		position: absolute;
		left: 0.85rem;
		top: 50%;
		transform: translateY(-50%);
		color: #999;
		pointer-events: none;
	}

	.search-wrapper input {
		width: 100%;
		padding: 0.7rem 0.85rem 0.7rem 2.75rem;
		border: 2px solid #e5e7eb;
		border-radius: 0.625rem;
		font-size: 1rem;
		font-family: inherit;
		background: white;
		transition: border-color 0.2s;
	}

	.search-wrapper input:focus {
		outline: none;
		border-color: var(--brand);
	}

	.search-wrapper input::placeholder {
		color: #999;
	}

	.bulk-actions {
		flex-shrink: 0;
	}

	.bulk-btn {
		padding: 0.7rem 1.25rem;
		border: 2px solid #e5e7eb;
		border-radius: 0.625rem;
		background: white;
		font-size: 0.9rem;
		font-family: inherit;
		cursor: pointer;
		color: var(--text-secondary, #676e7a);
		transition:
			border-color 0.2s,
			color 0.2s;
		white-space: nowrap;
	}

	.bulk-btn:hover {
		border-color: var(--brand);
		color: var(--text);
	}

	/* Category headings rendered by faqPlugin */
	.faq-content :global(.faq-category) {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--brand);
		margin-top: 2.5rem;
		margin-bottom: 0.5rem;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid var(--brand);
	}

	.faq-content :global(.faq-category:first-child) {
		margin-top: 0;
	}
</style>
