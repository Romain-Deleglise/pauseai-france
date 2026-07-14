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
		'../../assets/emploi-ia/temoignages/*.{svg,png,jpg,jpeg,webp,avif}',
		{ eager: true, import: 'default' }
	)

	const slides: string[] = Object.keys(modules)
		.sort()
		.map((path) => modules[path])

	let current = 0
	let zoomed = false

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

	const openZoom = () => (zoomed = true)
	const closeZoom = () => (zoomed = false)

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Escape') closeZoom()
	}
</script>

<svelte:window on:keydown={zoomed ? handleKeydown : undefined} />

<section class="slideshow" aria-roledescription="carousel">
	{#if slides.length}
		{#key current}
			<figure class="slide" aria-live="polite">
				<button
					type="button"
					class="zoom-trigger"
					on:click={openZoom}
					title={t.emploi_ia.slideshow_zoom}
				>
					<img src={slides[current]} alt={`${t.emploi_ia.slideshow_alt} ${current + 1}`} />
					<span class="zoom-hint" aria-hidden="true">⤢ {t.emploi_ia.slideshow_zoom}</span>
				</button>
				<figcaption class="counter">{current + 1} / {slides.length}</figcaption>
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

{#if zoomed}
	<!-- Vue plein écran pour lire les cartes chargées en texte.
	     Fermeture au clic (fond ou image), via le bouton ×, ou avec Échap. -->
	<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions a11y-no-noninteractive-element-interactions -->
	<div
		class="lightbox"
		role="dialog"
		aria-modal="true"
		aria-label={t.emploi_ia.slideshow_alt}
		on:click={closeZoom}
	>
		<button
			type="button"
			class="lightbox-close"
			on:click={closeZoom}
			aria-label={t.emploi_ia.slideshow_close}
		>
			×
		</button>
		<img
			class="lightbox-img"
			src={slides[current]}
			alt={`${t.emploi_ia.slideshow_alt} ${current + 1}`}
		/>
	</div>
{/if}

<style>
	.slideshow {
		margin: 2rem 0 1rem;
	}

	.slide {
		margin: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.6rem;
	}

	.zoom-trigger {
		display: block;
		width: 100%;
		max-width: 640px;
		padding: 0;
		border: 0;
		background: none;
		cursor: zoom-in;
		position: relative;
		border-radius: 14px;
	}

	.zoom-trigger img {
		width: 100%;
		height: auto;
		border-radius: 14px;
		border: 1px solid var(--border, #d9c7b0);
		display: block;
		background: var(--bg, #fff);
	}

	.zoom-hint {
		position: absolute;
		right: 0.6rem;
		bottom: 0.6rem;
		font-size: 0.75rem;
		font-weight: 600;
		color: white;
		background: rgba(0, 0, 0, 0.6);
		padding: 0.3rem 0.55rem;
		border-radius: 6px;
		opacity: 0;
		transition: opacity 0.2s;
	}

	.zoom-trigger:hover .zoom-hint,
	.zoom-trigger:focus-visible .zoom-hint {
		opacity: 1;
	}

	.counter {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--text-secondary, #888);
	}

	.empty {
		margin: 0;
		text-align: center;
		font-size: 1rem;
		color: var(--text-secondary, #888);
		padding: 2rem 1rem;
	}

	/* ── Lightbox plein écran ── */
	.lightbox {
		position: fixed;
		inset: 0;
		z-index: 1000;
		background: rgba(0, 0, 0, 0.85);
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
		overflow: auto;
		cursor: zoom-out;
	}

	.lightbox-img {
		max-width: 100%;
		max-height: 95vh;
		width: auto;
		height: auto;
		border-radius: 8px;
		background: #fff;
		cursor: default;
	}

	.lightbox-close {
		position: fixed;
		top: 1rem;
		right: 1.25rem;
		width: 2.5rem;
		height: 2.5rem;
		font-size: 1.8rem;
		line-height: 1;
		color: white;
		background: rgba(255, 255, 255, 0.15);
		border: 0;
		border-radius: 50%;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.lightbox-close:hover {
		background: rgba(255, 255, 255, 0.3);
	}
</style>
