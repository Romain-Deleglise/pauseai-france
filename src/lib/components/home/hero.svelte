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
		<div class="hero-bg">
			<div class="mesh-layer mesh-1"></div>
			<div class="mesh-layer mesh-2"></div>
			<div class="mesh-layer mesh-3"></div>
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

	/* Mesh gradient layers */
	.mesh-layer {
		position: absolute;
		inset: 0;
		opacity: 0.9;
	}

	.mesh-1 {
		background: radial-gradient(
				ellipse 80% 60% at 10% 20%,
				rgba(255, 148, 22, 0.4) 0%,
				transparent 70%
			),
			radial-gradient(ellipse 60% 80% at 85% 75%, rgba(255, 169, 69, 0.35) 0%, transparent 65%);
		animation: mesh-drift-1 20s ease-in-out infinite;
	}

	.mesh-2 {
		background: radial-gradient(
				ellipse 70% 50% at 70% 15%,
				rgba(255, 200, 120, 0.3) 0%,
				transparent 60%
			),
			radial-gradient(ellipse 50% 70% at 25% 80%, rgba(255, 148, 22, 0.25) 0%, transparent 65%);
		animation: mesh-drift-2 26s ease-in-out infinite;
	}

	.mesh-3 {
		background: radial-gradient(
				ellipse 55% 55% at 50% 50%,
				rgba(255, 180, 80, 0.2) 0%,
				transparent 70%
			),
			radial-gradient(ellipse 40% 60% at 90% 30%, rgba(255, 148, 22, 0.15) 0%, transparent 60%);
		animation: mesh-drift-3 30s ease-in-out infinite;
	}

	@keyframes mesh-drift-1 {
		0%,
		100% {
			transform: translate(0, 0) scale(1);
		}
		33% {
			transform: translate(4%, -3%) scale(1.05);
		}
		66% {
			transform: translate(-3%, 4%) scale(0.97);
		}
	}

	@keyframes mesh-drift-2 {
		0%,
		100% {
			transform: translate(0, 0) scale(1) rotate(0deg);
		}
		25% {
			transform: translate(-5%, 2%) scale(1.03) rotate(1deg);
		}
		50% {
			transform: translate(3%, -4%) scale(0.98) rotate(-1deg);
		}
		75% {
			transform: translate(2%, 3%) scale(1.04) rotate(0.5deg);
		}
	}

	@keyframes mesh-drift-3 {
		0%,
		100% {
			transform: translate(0, 0) scale(1);
		}
		50% {
			transform: translate(-2%, -2%) scale(1.06);
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
