<script lang="ts">
	import Button from '$components/Button.svelte'
	import Mark from '$components/Mark.svelte'
	import LeftCorner from '$components/hero/LeftCorner.svelte'
	import RightCorner from '$components/hero/RightCorner.svelte'
	import { onMount } from 'svelte'
	import { fade, fly } from 'svelte/transition'
	const label_id = 'hero-title'

	const photos = [
		{ src: '/hero/tshirt-pauseai.webp', alt: 'Militant avec t-shirt Pause AI' },
		{ src: '/hero/manif-01.webp', alt: 'Militant brandissant une pancarte' },
		{ src: '/hero/conference-salle.webp', alt: 'Conférence Reprendre le Contrôle' },
		{ src: '/hero/manif-08.webp', alt: 'Pancarte Contrôlons les IA' },
		{ src: '/hero/megaphone.webp', alt: 'Militant au mégaphone' },
		{ src: '/hero/manif-03.webp', alt: "Militant We can't steer" },
		{ src: '/hero/stop-course.webp', alt: 'Pancarte Stop à la course' },
		{ src: '/hero/manif-07.webp', alt: 'Prise de parole au micro' },
		{ src: '/hero/manif-02.webp', alt: 'Militant AI Safety Summit' },
		{ src: '/hero/panneau-pauseai.webp', alt: 'Militant avec panneau Pause AI' },
		{ src: '/hero/manif-10.webp', alt: 'Pancarte chronologie des crises' },
		{ src: '/hero/sans-ia-sure.webp', alt: 'Sans IA sûre pas de futur' },
		{ src: '/hero/manif-05.webp', alt: 'Militants avec banderole' },
		{ src: '/hero/manif-11.webp', alt: 'Militant AI Safety Summit' },
		{ src: '/hero/discussion.webp', alt: 'Discussion avec des passants' },
		{ src: '/hero/manif-04.webp', alt: 'Pancarte IA machine à virus' },
		{ src: '/hero/panneau-rue.webp', alt: 'Pancarte dans la rue' },
		{ src: '/hero/manif-09.webp', alt: 'Militant Sans IA sûre pas de futur' },
		{ src: '/hero/manif-06.webp', alt: 'Militants tenant une banderole' },
		{ src: '/hero/conference-speaker.webp', alt: 'Intervenant à la conférence' }
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
			<div class="mosaic">
				{#each photos as photo, i}
					<div
						class="mosaic-cell"
						class:tall={i === 0 || i === 4 || i === 7 || i === 11}
						class:wide={i === 2}
					>
						<img src={photo.src} alt={photo.alt} loading={i < 6 ? 'eager' : 'lazy'} />
					</div>
				{/each}
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
		background: #1a1a1a;
	}

	/* Photo mosaic grid — fill the entire background */
	.mosaic {
		position: absolute;
		inset: 0;
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		grid-auto-rows: 1fr;
		gap: 3px;
	}

	.mosaic-cell {
		overflow: hidden;
		position: relative;
	}

	.mosaic-cell.tall {
		grid-row: span 2;
	}

	.mosaic-cell.wide {
		grid-column: span 2;
	}

	.mosaic-cell img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		filter: grayscale(30%) sepia(20%) saturate(130%) brightness(0.85);
	}

	/* Overlay: strong left side for text + top gradient for header */
	.mosaic-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
				to bottom,
				rgba(20, 20, 20, 0.7) 0%,
				rgba(20, 20, 20, 0.3) 12%,
				transparent 22%
			),
			linear-gradient(
				to right,
				rgba(20, 20, 20, 0.88) 0%,
				rgba(20, 20, 20, 0.75) 25%,
				rgba(20, 20, 20, 0.45) 50%,
				rgba(20, 20, 20, 0.15) 75%,
				transparent 100%
			),
			linear-gradient(to top, rgba(20, 20, 20, 0.5) 0%, transparent 15%);
		pointer-events: none;
	}

	/* Text content */
	.content {
		color: white;
		display: flex;
		flex-direction: column;
		justify-content: center;
		max-width: 100%;
		margin-bottom: 6.125rem;
	}

	.content-box {
		max-width: 38rem;
	}

	.content h1 {
		margin-top: 0;
		margin-bottom: 1.5rem;
		font-size: 1.6rem;
		color: white;
		text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
	}

	.description {
		width: 0;
		min-width: 100%;
		color: rgba(255, 255, 255, 0.92);
		text-shadow: 0 1px 10px rgba(0, 0, 0, 0.4);
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
		border-bottom: 1px solid white;
	}

	.buttons {
		display: flex;
		align-items: center;
		flex-direction: column;
		gap: 2rem;
		margin-top: 2rem;
	}

	/* Mobile: fewer columns */
	@media (max-width: 639px) {
		.mosaic {
			grid-template-columns: repeat(3, 1fr);
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
		.mosaic {
			grid-template-columns: repeat(5, 1fr);
		}
	}

	@media (min-width: 1024px) {
		.content h1 {
			font-size: 3rem;
		}
		.mosaic {
			grid-template-columns: repeat(6, 1fr);
			gap: 4px;
		}
	}

	@media (min-width: 1280px) {
		.content h1 {
			font-size: 3.5rem;
		}
	}
</style>
