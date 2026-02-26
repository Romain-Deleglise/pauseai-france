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
			<div class="blob blob-1"></div>
			<div class="blob blob-2"></div>
			<div class="blob blob-3"></div>
			<div class="blob blob-4"></div>
		</div>
		<div class="content" in:fade={{ duration: 500, delay: 200 }}>
			<h1 id={label_id}>
				Pour garder l'IA sous contrôle, <br /><Mark>agissons maintenant</Mark>
			</h1>
			<div class="description">
				<p>
					L’IA redéfinit déjà nos emplois, nos élections et notre vie quotidienne. Tous les mois, de
					nouveaux systèmes franchissent des seuils que l’on pensait lointains. D'après la plupart
					des experts en sécurité de l'IA, poursuivre cette course sans garde-fous fait peser un
					risque catastrophique sur l’humanité à court terme.
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

	/* Floating gradient blobs */
	.blob {
		position: absolute;
		border-radius: 50%;
		filter: blur(80px);
		opacity: 0.5;
		will-change: transform;
	}

	.blob-1 {
		width: 45vw;
		height: 45vw;
		max-width: 600px;
		max-height: 600px;
		background: radial-gradient(circle, #ff9416 0%, #ffbe6b 50%, transparent 70%);
		top: -10%;
		right: -5%;
		opacity: 0.35;
		animation: drift-1 20s ease-in-out infinite;
	}

	.blob-2 {
		width: 35vw;
		height: 35vw;
		max-width: 450px;
		max-height: 450px;
		background: radial-gradient(circle, #ff6b2c 0%, #ffad70 50%, transparent 70%);
		bottom: 5%;
		left: -8%;
		opacity: 0.28;
		animation: drift-2 25s ease-in-out infinite;
	}

	.blob-3 {
		width: 28vw;
		height: 28vw;
		max-width: 350px;
		max-height: 350px;
		background: radial-gradient(circle, #ffd700 0%, #ffe680 50%, transparent 70%);
		top: 35%;
		right: 20%;
		opacity: 0.22;
		animation: drift-3 18s ease-in-out infinite;
	}

	.blob-4 {
		width: 20vw;
		height: 20vw;
		max-width: 260px;
		max-height: 260px;
		background: radial-gradient(circle, #ff4500 0%, #ff8c5a 50%, transparent 70%);
		bottom: 25%;
		left: 30%;
		opacity: 0.18;
		animation: drift-4 22s ease-in-out infinite;
	}

	@keyframes drift-1 {
		0%,
		100% {
			transform: translate(0, 0) scale(1);
		}
		33% {
			transform: translate(-30px, 40px) scale(1.05);
		}
		66% {
			transform: translate(20px, -20px) scale(0.95);
		}
	}

	@keyframes drift-2 {
		0%,
		100% {
			transform: translate(0, 0) scale(1);
		}
		33% {
			transform: translate(40px, -30px) scale(1.08);
		}
		66% {
			transform: translate(-20px, 20px) scale(0.96);
		}
	}

	@keyframes drift-3 {
		0%,
		100% {
			transform: translate(0, 0) scale(1);
		}
		50% {
			transform: translate(-35px, 25px) scale(1.1);
		}
	}

	@keyframes drift-4 {
		0%,
		100% {
			transform: translate(0, 0) scale(1);
		}
		40% {
			transform: translate(25px, -35px) scale(1.06);
		}
		70% {
			transform: translate(-15px, 15px) scale(0.94);
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
