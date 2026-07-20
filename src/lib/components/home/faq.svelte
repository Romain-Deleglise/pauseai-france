<script lang="ts">
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import Accordion from '$components/Accordion.svelte'
	import Fly from '$components/Fly.svelte'
	import type { Lang } from '$lib/i18n'
	// @ts-ignore - Vite raw import
	import faqRaw from '$posts/faq.md?raw'

	export let lang: Lang = 'fr'

	const label_id = 'faq-title'

	interface FaqItem {
		id: string
		question: string
		answer: string
		category: string
	}

	// Extract FAQ Q&A pairs from raw markdown for JSON-LD (SEO) and the teaser.
	function extractFaqData(raw: string): FaqItem[] {
		const lines = raw.split('\n')
		const faqs: FaqItem[] = []
		let currentQuestion = ''
		let currentAnswer = ''
		let currentCategory = ''
		let count = 0
		const push = () => {
			if (!currentQuestion) return
			count++
			faqs.push({
				id: `accordion${count}`,
				question: currentQuestion,
				answer: stripMarkdown(currentAnswer.trim()),
				category: currentCategory
			})
		}
		for (const line of lines) {
			if (line.startsWith('## ')) {
				push()
				currentQuestion = ''
				currentAnswer = ''
				currentCategory = line.replace('## ', '')
			} else if (line.startsWith('### ')) {
				push()
				currentQuestion = line.replace('### ', '')
				currentAnswer = ''
			} else if (currentQuestion) {
				currentAnswer += line + '\n'
			}
		}
		push()
		return faqs
	}

	function stripMarkdown(text: string) {
		return text
			.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
			.replace(/\*\*([^*]+)\*\*/g, '$1')
			.replace(/_([^_]+)_/g, '$1')
			.replace(/^- /gm, '• ')
			.replace(/\n{3,}/g, '\n\n')
			.trim()
	}

	const faqData = extractFaqData(faqRaw)

	// JSON-LD reste sur l'INTÉGRALITÉ des questions (SEO : Google peut afficher
	// des « rich snippets »), même si l'accueil n'en montre qu'une sélection.
	const jsonLd = JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqData.map((item) => ({
			'@type': 'Question',
			name: item.question,
			acceptedAnswer: { '@type': 'Answer', text: item.answer }
		}))
	})

	// Sélection des questions les plus utiles pour un visiteur qui arrive
	// (identité, crédibilité, objections courantes, passage à l'action).
	const featuredIds = [
		'accordion1',
		'accordion3',
		'accordion6',
		'accordion7',
		'accordion12',
		'accordion14'
	]
	$: featured = featuredIds
		.map((id) => faqData.find((f) => f.id === id))
		.filter((f): f is FaqItem => Boolean(f))
</script>

<svelte:head>
	{@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>

{#if lang !== 'en'}
	<section class="faq" aria-labelledby={label_id}>
		<Fly>
			<UnderlinedTitle id={label_id}>F.A.Q.</UnderlinedTitle>
		</Fly>

		<p class="faq-intro">
			Des questions ? Voici les réponses aux interrogations les plus fréquentes de nos visiteurs,
			journalistes et soutiens.
		</p>

		<div class="faq-content">
			{#each featured as item (item.id)}
				<Accordion id={item.id} noHash>
					<span slot="head">{item.question}</span>
					<div slot="details">
						{#each item.answer.split('\n\n') as para}
							<p>{para}</p>
						{/each}
					</div>
				</Accordion>
			{/each}
		</div>

		<div class="faq-more">
			<a class="faq-more-link" href="/fr/faq">Voir toutes les questions →</a>
		</div>
	</section>
{/if}

<style>
	.faq-intro {
		margin: 0 0 2rem;
		font-size: 1.05rem;
		line-height: 1.6;
		color: var(--text-2);
		max-width: 46rem;
	}

	.faq-more {
		margin-top: 2rem;
		text-align: center;
	}

	.faq-more-link {
		display: inline-block;
		padding: 0.8rem 1.6rem;
		border: 2px solid var(--brand);
		border-radius: 0.625rem;
		font-weight: 600;
		color: var(--brand-subtle);
		text-decoration: none;
		transition:
			background-color 0.15s ease,
			color 0.15s ease;
	}

	.faq-more-link:hover {
		background: var(--brand);
		color: #1a1a1a;
	}
</style>
