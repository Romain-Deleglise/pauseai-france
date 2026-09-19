<script lang="ts">
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import FaqList from '$components/FaqList.svelte'
	import Fly from '$components/Fly.svelte'
	import { parseFaq, flattenFaq, faqJsonLd } from '$lib/faq'
	import type { Lang } from '$lib/i18n'
	// @ts-ignore - Vite raw import
	import faqRaw from '$posts/faq.md?raw'
	// @ts-ignore - Vite raw import
	import faqRawEn from '$posts/en/faq.md?raw'

	export let lang: Lang = 'fr'

	const label_id = 'faq-title'
	$: isEn = lang === 'en'
	$: categories = parseFaq(isEn ? faqRawEn : faqRaw)
	// La FAQ n'existe plus qu'ici : les données structurées suivent, sinon on
	// perdrait l'affichage enrichi de Google.
	$: jsonLd = faqJsonLd(flattenFaq(categories))
</script>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>

<section id="faq" class="faq" aria-labelledby={label_id}>
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
</section>

<style>
	.faq-intro {
		margin: 0 0 2rem;
		font-size: 1.05rem;
		line-height: 1.6;
		color: var(--text-2);
	}
</style>
