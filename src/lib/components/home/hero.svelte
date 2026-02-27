<script lang="ts">
	import Button from '$components/Button.svelte'
	import Mark from '$components/Mark.svelte'
	import LeftCorner from '$components/hero/LeftCorner.svelte'
	import RightCorner from '$components/hero/RightCorner.svelte'
	import { onMount } from 'svelte'
	import { fade, fly } from 'svelte/transition'
	const label_id = 'hero-title'

	// 4 rows of photos, each row scrolls in its own direction
	const row1 = [
		'/hero/tshirt-pauseai.webp',
		'/hero/senat-intro.webp',
		'/hero/manif-01.webp',
		'/hero/projection-gateau.webp',
		'/hero/conf-full-room.webp',
		'/hero/manif-08.webp',
		'/hero/fost-summit.webp',
		'/hero/senat-speaker2.webp',
		'/hero/manif-03.webp',
		'/hero/apidays-talk.webp',
		'/hero/panneau-pauseai.webp',
		'/hero/senat-audience1.webp'
	]
	const row2 = [
		'/hero/megaphone.webp',
		'/hero/senat-panel.webp',
		'/hero/manif-07.webp',
		'/hero/conf-audience.webp',
		'/hero/stop-course.webp',
		'/hero/projection-ambiance.webp',
		'/hero/manif-02.webp',
		'/hero/senat-talk.webp',
		'/hero/fost-talk.webp',
		'/hero/sans-ia-sure.webp',
		'/hero/conf-presenter.webp',
		'/hero/manif-05.webp'
	]
	const row3 = [
		'/hero/senat-orateur.webp',
		'/hero/manif-04.webp',
		'/hero/projection-discussion.webp',
		'/hero/conference-salle.webp',
		'/hero/manif-09.webp',
		'/hero/fost-speaker.webp',
		'/hero/panneau-rue.webp',
		'/hero/senat-salle.webp',
		'/hero/conf-panel.webp',
		'/hero/manif-11.webp',
		'/hero/apidays-slide.webp',
		'/hero/senat-discussion.webp'
	]
	const row4 = [
		'/hero/manif-06.webp',
		'/hero/senat-groupe.webp',
		'/hero/discussion.webp',
		'/hero/conf-reprise.webp',
		'/hero/manif-10.webp',
		'/hero/projection-conference.webp',
		'/hero/conference-speaker.webp',
		'/hero/senat-audience2.webp',
		'/hero/conf-question.webp',
		'/hero/apidays-expo.webp',
		'/hero/conf-speaker-new.webp',
		'/hero/senat-speaker1.webp'
	]

	// Workaround to trigger transitions on render
	let mounted = false
	onMount(() => {
		mounted = true
	})
</script>

{#if mounted}
	<section class="hero" aria-labelledby={label_id}>
		<div class="hero-bg" aria-hidden="true">
			<div class="marquee-container">
				<div class="marquee-row row-left">
					<div class="marquee-track">
						{#each [...row1, ...row1] as src}
							<img {src} alt="" loading="lazy" />
						{/each}
					</div>
				</div>
				<div class="marquee-row row-right">
					<div class="marquee-track">
						{#each [...row2, ...row2] as src}
							<img {src} alt="" loading="lazy" />
						{/each}
					</div>
				</div>
				<div class="marquee-row row-left row-slow">
					<div class="marquee-track">
						{#each [...row3, ...row3] as src}
							<img {src} alt="" loading="lazy" />
						{/each}
					</div>
				</div>
				<div class="marquee-row row-right row-slow">
					<div class="marquee-track">
						{#each [...row4, ...row4] as src}
							<img {src} alt="" loading="lazy" />
						{/each}
					</div>
				</div>
			</div>
			<div class="mosaic-overlay"></div>
		</div>
		<div class="content" in:fade={{ duration: 500, delay: 200 }}>
			<div class="content-box">
				<h1 id={label_id}>
					Pour garder l'IA sous contrôle, <br /><Mark>agissons maintenant</Mark>
				</h1>
				<div class="description">
					<p>
						L'IA redéfinit déjà nos emplois, nos élections et notre vie quotidienne. Tous les mois,
						de nouveaux systèmes franchissent des seuils que l'on pensait lointains. D'après la
						plupart des experts en sécurité de l'IA, poursuivre cette course sans garde-fous fait
						peser un risque catastrophique sur l'humanité à court terme.
					</p>
					<p>La fenêtre se referme vite : agissons maintenant.</p>
					<div class="buttons">
						<div in:fly={{ y: 20, duration: 300, delay: 700 }}>
							<Button href="/rejoindre">Rejoindre</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="corners">
			<LeftCorner />
			<RightCorner />
		</div>
	</section>
{/if}

<style>
	.hero {
		--hero-top-offset: -7.125rem;
		display: flex;
		min-height: calc(100svh + var(--hero-top-offset));
		align-items: center;
		z-index: 0;
		position: relative;
	}

	.hero-bg {
		position: absolute;
		overflow: hidden;
		top: var(--hero-top-offset);
		left: 50%;
		transform: translateX(-50%);
		width: 100vw;
		height: calc(100% - var(--hero-top-offset));
		z-index: -1;
		background: #fffaf5;
	}

	/* Marquee scrolling rows */
	.marquee-container {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 5px;
		padding: 0;
	}

	.marquee-row {
		overflow: hidden;
		flex: 1;
		min-height: 0;
	}

	.marquee-track {
		display: flex;
		gap: 5px;
		height: 100%;
		width: max-content;
	}

	.marquee-track img {
		height: 100%;
		aspect-ratio: 4/3;
		object-fit: cover;
		display: block;
		border-radius: 6px;
		flex-shrink: 0;
		/* No filter — natural colors, overlay handles readability */
	}

	/* Scroll left — slow, contemplative */
	.row-left .marquee-track {
		animation: scroll-left 140s linear infinite;
	}

	/* Scroll right */
	.row-right .marquee-track {
		animation: scroll-right 140s linear infinite;
	}

	.row-slow .marquee-track {
		animation-duration: 180s;
	}

	@keyframes scroll-left {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-50%);
		}
	}

	@keyframes scroll-right {
		0% {
			transform: translateX(-50%);
		}
		100% {
			transform: translateX(0);
		}
	}

	/* Respect user preference */
	@media (prefers-reduced-motion: reduce) {
		.row-left .marquee-track,
		.row-right .marquee-track {
			animation: none;
		}
	}

	/* Overlay: tight gradient on left for text, photos untouched on right */
	.mosaic-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
				to right,
				rgba(255, 250, 245, 0.97) 0%,
				rgba(255, 250, 245, 0.92) 15%,
				rgba(255, 250, 245, 0.6) 30%,
				rgba(255, 250, 245, 0.15) 45%,
				transparent 55%
			),
			linear-gradient(
				to top,
				rgba(255, 250, 245, 0.5) 0%,
				transparent 8%,
				transparent 92%,
				rgba(255, 250, 245, 0.5) 100%
			);
		pointer-events: none;
	}

	/* Text content */
	.content {
		color: var(--black, #000);
		display: flex;
		flex-direction: column;
		justify-content: center;
		max-width: 100%;
		margin-bottom: 6.125rem;
	}

	.content-box {
		max-width: 36rem;
	}

	.content h1 {
		margin-top: 0;
		margin-bottom: 1.5rem;
		font-size: 1.6rem;
	}

	.description {
		width: 0;
		min-width: 100%;
	}

	.description p {
		line-height: 1.7;
	}

	.corners {
		width: 100vw;
		bottom: -1px;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		border-bottom: 4px solid var(--brand, #ff9416);
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
	}

	.buttons {
		display: flex;
		align-items: center;
		flex-direction: column;
		gap: 2rem;
		margin-top: 2rem;
	}

	/* ─── Mobile (< 640px) ────────────────────────────────────── */
	@media (max-width: 639px) {
		.marquee-container {
			gap: 4px;
		}

		.marquee-track img {
			border-radius: 4px;
		}

		/* Overlay on mobile — covers more since text takes more width */
		.mosaic-overlay {
			background: linear-gradient(
					to right,
					rgba(255, 250, 245, 0.98) 0%,
					rgba(255, 250, 245, 0.93) 20%,
					rgba(255, 250, 245, 0.7) 40%,
					rgba(255, 250, 245, 0.2) 60%,
					transparent 75%
				),
				linear-gradient(
					to top,
					rgba(255, 250, 245, 0.6) 0%,
					transparent 10%,
					transparent 90%,
					rgba(255, 250, 245, 0.6) 100%
				);
		}
	}

	@media (min-width: 480px) {
		.buttons {
			flex-direction: row;
		}
	}

	@media (min-width: 640px) {
		.hero {
			--hero-top-offset: -8.125rem;
		}
		.content h1 {
			margin-bottom: 2rem;
			font-size: 2.1rem;
		}
	}

	@media (min-width: 768px) {
		.content h1 {
			font-size: 2.4rem;
		}
		.marquee-container {
			gap: 6px;
		}
		.marquee-track {
			gap: 6px;
		}
		.marquee-track img {
			border-radius: 8px;
		}
	}

	@media (min-width: 1024px) {
		.content h1 {
			font-size: 3rem;
		}
	}

	@media (min-width: 1280px) {
		.content h1 {
			font-size: 3.5rem;
		}
	}
</style>
