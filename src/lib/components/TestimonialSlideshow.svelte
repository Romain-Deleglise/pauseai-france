<script lang="ts">
	import CarouselNavigation from '$components/CarouselNavigation.svelte'
	import type { Lang } from '$lib/i18n'
	import { getT } from '$lib/i18n'

	export let lang: Lang = 'fr'

	$: t = getT(lang)

	// Diaporama des témoignages illustrés (préparés pour les réseaux sociaux).
	// Pour ajouter un témoignage : déposez simplement le fichier image dans
	// src/assets/emploi-ia/temoignages/ — il est repris automatiquement ici,
	// trié par nom de fichier (préfixez par 01-, 02-, … pour ordonner).
	const modules = import.meta.glob<string>(
		'../../assets/emploi-ia/temoignages/*.{png,jpg,jpeg,webp,avif}',
		{ eager: true, import: 'default' }
	)

	const slides: string[] = Object.keys(modules)
		.sort()
		.map((path) => modules[path])

	let current = 0

	const goTo = (index: number) => {
		if (!slides.length) return
		const total = slides.length
		current = ((index % total) + total) % total
	}

	const previous = () => goTo(current - 1)
	const next = () => goTo(current + 1)

	$: navItems = slides.map(() => ({ label: t.emploi_ia.slideshow_item }))

	const handleSelect = (event: CustomEvent<{ index: number }>) => {
		goTo(event.detail.index)
	}
</script>

<section class="slideshow" aria-roledescription="carousel">
	{#if slides.length}
		{#key current}
			<figure class="slide" aria-live="polite">
				<img src={slides[current]} alt={`${t.emploi_ia.slideshow_alt} ${current + 1}`} />
			</figure>
		{/key}

		<CarouselNavigation
			items={navItems}
			{current}
			ariaLabel={t.emploi_ia.slideshow_nav_aria}
			previousLabel={t.emploi_ia.slideshow_prev}
			nextLabel={t.emploi_ia.slideshow_next}
			showArrows={slides.length > 1}
			showDots={slides.length > 1}
			on:previous={previous}
			on:next={next}
			on:select={handleSelect}
		/>
	{:else}
		<p class="empty">{t.emploi_ia.slideshow_empty}</p>
	{/if}
</section>

<style>
	.slideshow {
		margin: 2rem 0 1rem;
	}

	.slide {
		margin: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		background: var(--bg-subtle, #f7f7f5);
		border: 1px solid var(--border, #d9c7b0);
		border-radius: 18px;
		padding: 1rem;
	}

	:global([data-theme='dark']) .slide {
		background: rgba(255, 255, 255, 0.04);
	}

	.slide img {
		max-width: 100%;
		max-height: 70vh;
		height: auto;
		border-radius: 10px;
		display: block;
	}

	.empty {
		margin: 0;
		text-align: center;
		font-size: 1rem;
		color: var(--text-secondary, #888);
		padding: 2rem 1rem;
	}
</style>
