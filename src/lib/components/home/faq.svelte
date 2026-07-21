<script lang="ts">
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import FaqList from '$components/FaqList.svelte'
	import Fly from '$components/Fly.svelte'
	import { parseFaq } from '$lib/faq'
	import type { Lang } from '$lib/i18n'
	// @ts-ignore - Vite raw import
	import faqRaw from '$posts/faq.md?raw'
	// @ts-ignore - Vite raw import
	import faqRawEn from '$posts/en/faq.md?raw'

	export let lang: Lang = 'fr'

	const label_id = 'faq-title'
	$: isEn = lang === 'en'
	$: categories = parseFaq(isEn ? faqRawEn : faqRaw)
</script>

<section class="faq" aria-labelledby={label_id}>
	<Fly>
		<UnderlinedTitle id={label_id}>F.A.Q.</UnderlinedTitle>
	</Fly>

	<p class="faq-intro">
		{#if isEn}
			Have questions? Here are the answers to the questions most often asked by our visitors,
			journalists and supporters.
		{:else}
			Des questions ? Voici les réponses aux interrogations les plus fréquentes de nos visiteurs,
			journalistes et soutiens.
		{/if}
	</p>

	<FaqList {categories} />

	<div class="faq-more">
		<a class="faq-more-link" href={isEn ? '/en/faq' : '/fr/faq'}>
			{isEn ? 'Open the FAQ (with search) →' : 'Ouvrir la FAQ (avec recherche) →'}
		</a>
	</div>
</section>

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
