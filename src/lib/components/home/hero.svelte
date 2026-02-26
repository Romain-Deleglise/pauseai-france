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
			<div class="pulse-origin">
				<div class="ring ring-1"></div>
				<div class="ring ring-2"></div>
				<div class="ring ring-3"></div>
				<div class="ring ring-4"></div>
				<div class="ring ring-5"></div>
				<div class="dot"></div>
			</div>
			<div class="pulse-origin pulse-secondary">
				<div class="ring ring-1"></div>
				<div class="ring ring-2"></div>
				<div class="ring ring-3"></div>
			</div>
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

	/* Pulse epicenter */
	.pulse-origin {
		position: absolute;
		top: 30%;
		right: 8%;
	}

	.pulse-secondary {
		top: auto;
		right: auto;
		bottom: 15%;
		left: 5%;
	}

	.dot {
		width: 8px;
		height: 8px;
		background: var(--brand, #ff9416);
		border-radius: 50%;
		position: relative;
		z-index: 1;
	}

	.ring {
		position: absolute;
		border: 1.5px solid var(--brand, #ff9416);
		border-radius: 50%;
		top: 50%;
		left: 50%;
		animation: pulse-expand 8s ease-out infinite;
	}

	.ring-1 {
		width: 80px;
		height: 80px;
		margin-top: -40px;
		margin-left: -40px;
		animation-delay: 0s;
	}

	.ring-2 {
		width: 200px;
		height: 200px;
		margin-top: -100px;
		margin-left: -100px;
		animation-delay: -1.6s;
	}

	.ring-3 {
		width: 360px;
		height: 360px;
		margin-top: -180px;
		margin-left: -180px;
		animation-delay: -3.2s;
	}

	.ring-4 {
		width: 560px;
		height: 560px;
		margin-top: -280px;
		margin-left: -280px;
		animation-delay: -4.8s;
	}

	.ring-5 {
		width: 800px;
		height: 800px;
		margin-top: -400px;
		margin-left: -400px;
		animation-delay: -6.4s;
	}

	/* Secondary pulse has smaller rings */
	.pulse-secondary .ring-1 {
		width: 60px;
		height: 60px;
		margin-top: -30px;
		margin-left: -30px;
	}

	.pulse-secondary .ring-2 {
		width: 160px;
		height: 160px;
		margin-top: -80px;
		margin-left: -80px;
	}

	.pulse-secondary .ring-3 {
		width: 300px;
		height: 300px;
		margin-top: -150px;
		margin-left: -150px;
	}

	.pulse-secondary .ring {
		animation-duration: 10s;
		border-width: 1px;
	}

	@keyframes pulse-expand {
		0% {
			transform: scale(0.3);
			opacity: 0.5;
		}
		50% {
			opacity: 0.2;
		}
		100% {
			transform: scale(1);
			opacity: 0;
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
		.ring-4 {
			width: 700px;
			height: 700px;
			margin-top: -350px;
			margin-left: -350px;
		}
		.ring-5 {
			width: 1000px;
			height: 1000px;
			margin-top: -500px;
			margin-left: -500px;
		}
	}

	@media (min-width: 1280px) {
		.content h1 {
			font-size: 3.5rem;
		}
	}
</style>
