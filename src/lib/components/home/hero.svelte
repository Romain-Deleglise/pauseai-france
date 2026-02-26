<script lang="ts">
	import Button from '$components/Button.svelte'
	import Mark from '$components/Mark.svelte'
	import LeftCorner from '$components/hero/LeftCorner.svelte'
	import RightCorner from '$components/hero/RightCorner.svelte'
	import { onMount } from 'svelte'
	import { fade, fly } from 'svelte/transition'
	const label_id = 'hero-title'

	const photos = [
		{ src: '/hero/tshirt-pauseai.png', alt: 'Militant avec t-shirt Pause AI' },
		{ src: '/hero/manif-01.jpeg', alt: 'Militant brandissant une pancarte' },
		{ src: '/hero/conference-salle.jpg', alt: 'Conférence Reprendre le Contrôle' },
		{ src: '/hero/manif-08.jpeg', alt: 'Pancarte Contrôlons les IA' },
		{ src: '/hero/megaphone.png', alt: 'Militant au mégaphone' },
		{ src: '/hero/manif-03.jpeg', alt: "Militant We can't steer" },
		{ src: '/hero/stop-course.png', alt: 'Pancarte Stop à la course' },
		{ src: '/hero/manif-07.jpeg', alt: 'Prise de parole au micro' },
		{ src: '/hero/manif-02.jpeg', alt: 'Militant AI Safety Summit' },
		{ src: '/hero/panneau-pauseai.png', alt: 'Militant avec panneau Pause AI' },
		{ src: '/hero/manif-10.jpeg', alt: 'Pancarte chronologie des crises' },
		{ src: '/hero/sans-ia-sure.png', alt: 'Sans IA sûre pas de futur' },
		{ src: '/hero/manif-05.jpeg', alt: 'Militants avec banderole' },
		{ src: '/hero/manif-11.jpeg', alt: 'Militant AI Safety Summit' },
		{ src: '/hero/discussion.png', alt: 'Discussion avec des passants' },
		{ src: '/hero/manif-04.jpeg', alt: 'Pancarte IA machine à virus' },
		{ src: '/hero/panneau-rue.png', alt: 'Pancarte dans la rue' },
		{ src: '/hero/manif-09.jpeg', alt: 'Militant Sans IA sûre pas de futur' },
		{ src: '/hero/manif-06.jpeg', alt: 'Militants tenant une banderole' },
		{ src: '/hero/conference-speaker.jpg', alt: 'Intervenant à la conférence' }
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
						<img src={photo.src} alt={photo.alt} loading="eager" />
					</div>
				{/each}
			</div>
			<div class="mosaic-overlay"></div>
		</div>
		<div class="content" in:fade={{ duration: 500, delay: 200 }}>
			<h1 id={label_id}>
				Pour garder l'IA sous contrôle, <br /><Mark>agissons maintenant</Mark>
			</h1>
			<div class="description">
				<p>
					L'IA redéfinit déjà nos emplois, nos élections et notre vie quotidienne. Tous les mois, de
					nouveaux systèmes franchissent des seuils que l'on pensait lointains. D'après la plupart
					des experts en sécurité de l'IA, poursuivre cette course sans garde-fous fait peser un
					risque catastrophique sur l'humanité à court terme.
				</p>
				<p>La fenêtre se referme vite : agissons maintenant.</p>
				<div class="buttons">
					<div in:fly={{ y: 20, duration: 300, delay: 700 }}>
						<Button alt href="/rejoindre">Rejoindre</Button>
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

	/* Photo mosaic grid */
	.mosaic {
		position: absolute;
		inset: 0;
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		grid-auto-rows: minmax(120px, 1fr);
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
		filter: grayscale(40%) sepia(30%) saturate(120%) brightness(0.95);
	}

	/* Overlay: gradient from solid left to transparent right + orange tint */
	.mosaic-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
				to right,
				#fffaf5 0%,
				rgba(255, 250, 245, 0.97) 20%,
				rgba(255, 250, 245, 0.85) 40%,
				rgba(255, 248, 240, 0.5) 60%,
				rgba(255, 245, 235, 0.25) 80%,
				rgba(255, 240, 225, 0.15) 100%
			),
			linear-gradient(
				to top,
				rgba(255, 250, 245, 0.6) 0%,
				transparent 15%,
				transparent 85%,
				rgba(255, 250, 245, 0.6) 100%
			);
		pointer-events: none;
	}

	.content {
		color: var(--black, #000);
		display: flex;
		flex-direction: column;
		justify-content: center;
		max-width: 100%;
		margin-bottom: 6.125rem;
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

	/* Mobile: fewer columns, stronger overlay */
	@media (max-width: 639px) {
		.mosaic {
			grid-template-columns: repeat(3, 1fr);
			grid-auto-rows: minmax(90px, 1fr);
		}

		.mosaic-overlay {
			background: linear-gradient(
					to right,
					#fffaf5 0%,
					rgba(255, 250, 245, 0.95) 30%,
					rgba(255, 250, 245, 0.8) 60%,
					rgba(255, 248, 240, 0.5) 100%
				),
				linear-gradient(
					to top,
					rgba(255, 250, 245, 0.5) 0%,
					transparent 20%,
					transparent 80%,
					rgba(255, 250, 245, 0.5) 100%
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
		.mosaic {
			grid-template-columns: repeat(5, 1fr);
			grid-auto-rows: minmax(140px, 1fr);
		}
	}

	@media (min-width: 1024px) {
		.content h1 {
			font-size: 3rem;
		}
		.mosaic {
			grid-template-columns: repeat(6, 1fr);
			grid-auto-rows: minmax(150px, 1fr);
			gap: 4px;
		}
	}

	@media (min-width: 1280px) {
		.content h1 {
			font-size: 3.5rem;
		}
	}
</style>
