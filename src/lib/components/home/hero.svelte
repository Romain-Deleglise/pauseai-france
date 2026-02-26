<script lang="ts">
	import Button from '$components/Button.svelte'
	import Mark from '$components/Mark.svelte'
	import LeftCorner from '$components/hero/LeftCorner.svelte'
	import RightCorner from '$components/hero/RightCorner.svelte'
	import { onMount } from 'svelte'
	import { fade, fly } from 'svelte/transition'
	const label_id = 'hero-title'

	// Workaround to trigger transitions on render
	let mounted = false
	onMount(() => {
		mounted = true
	})
</script>

{#if mounted}
	<section class="hero" aria-labelledby={label_id}>
		<div class="hero-bg" aria-hidden="true">
			<div class="word-wall">
				<div class="word-track">
					{#each Array(8) as _}
						<div class="word-row">
							<span>PAUSE</span><span>PAUSE</span><span>PAUSE</span><span>PAUSE</span><span
								>PAUSE</span
							><span>PAUSE</span><span>PAUSE</span><span>PAUSE</span>
						</div>
					{/each}
					{#each Array(8) as _}
						<div class="word-row">
							<span>PAUSE</span><span>PAUSE</span><span>PAUSE</span><span>PAUSE</span><span
								>PAUSE</span
							><span>PAUSE</span><span>PAUSE</span><span>PAUSE</span>
						</div>
					{/each}
				</div>
			</div>
			<div class="vignette"></div>
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
						<Button href="/rejoindre">Rejoindre</Button>
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

	/* Giant word wall */
	.word-wall {
		position: absolute;
		inset: 0;
		overflow: hidden;
		transform: rotate(-12deg) scale(1.3);
		transform-origin: center center;
	}

	.word-track {
		display: flex;
		flex-direction: column;
		animation: word-scroll 60s linear infinite;
	}

	.word-row {
		display: flex;
		white-space: nowrap;
		line-height: 1;
		padding: 0.15em 0;
	}

	.word-row span {
		font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
		font-size: clamp(5rem, 10vw, 10rem);
		font-weight: 900;
		letter-spacing: 0.08em;
		color: var(--brand, #ff9416);
		opacity: 0.045;
		padding: 0 0.3em;
		user-select: none;
	}

	/* Alternate rows offset for brick pattern */
	.word-row:nth-child(even) {
		transform: translateX(-2.5em);
	}

	/* Subtle vignette overlay to fade edges */
	.vignette {
		position: absolute;
		inset: 0;
		background: radial-gradient(ellipse at center, transparent 30%, #fffaf5 75%);
		pointer-events: none;
	}

	@keyframes word-scroll {
		0% {
			transform: translateY(0);
		}
		100% {
			transform: translateY(-50%);
		}
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
