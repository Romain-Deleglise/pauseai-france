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
		<div class="gradient-bg">
			<div class="blob blob-1"></div>
			<div class="blob blob-2"></div>
			<div class="blob blob-3"></div>
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
		overflow: hidden;
	}

	/* Animated gradient background */
	.gradient-bg {
		position: absolute;
		overflow: hidden;
		top: var(--hero-top-offset);
		left: 50%;
		transform: translateX(-50%);
		width: 100vw;
		height: calc(100% - var(--hero-top-offset));
		z-index: -1;
		background: linear-gradient(
			135deg,
			#0d0d1a 0%,
			#1a1028 25%,
			#1c1333 50%,
			#12101e 75%,
			#0d0d1a 100%
		);
	}

	/* Floating blurred blobs */
	.blob {
		position: absolute;
		border-radius: 50%;
		filter: blur(80px);
		opacity: 0.5;
		animation: float 20s ease-in-out infinite;
	}

	.blob-1 {
		width: 500px;
		height: 500px;
		background: radial-gradient(circle, rgba(255, 148, 22, 0.4) 0%, rgba(255, 148, 22, 0) 70%);
		top: -10%;
		left: -10%;
		animation-delay: 0s;
		animation-duration: 22s;
	}

	.blob-2 {
		width: 400px;
		height: 400px;
		background: radial-gradient(circle, rgba(255, 120, 0, 0.3) 0%, rgba(255, 120, 0, 0) 70%);
		bottom: 10%;
		right: -5%;
		animation-delay: -7s;
		animation-duration: 18s;
	}

	.blob-3 {
		width: 350px;
		height: 350px;
		background: radial-gradient(circle, rgba(200, 100, 255, 0.2) 0%, rgba(200, 100, 255, 0) 70%);
		top: 40%;
		left: 30%;
		animation-delay: -14s;
		animation-duration: 25s;
	}

	@keyframes float {
		0%,
		100% {
			transform: translate(0, 0) scale(1);
		}
		25% {
			transform: translate(30px, -40px) scale(1.05);
		}
		50% {
			transform: translate(-20px, 20px) scale(0.95);
		}
		75% {
			transform: translate(40px, 30px) scale(1.02);
		}
	}

	.content {
		color: #fff;
		display: flex;
		flex-direction: column;
		justify-content: center;
		max-width: 100%;
		/* height of the nav */
		margin-bottom: 6.125rem;
	}

	.content h1 {
		margin-top: 0;
		margin-bottom: 1.5rem;
		font-size: 1.6rem;
	}
	/* Ensures that the description is constrained by the width of h1 */
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
		.blob-1 {
			width: 600px;
			height: 600px;
		}
		.blob-2 {
			width: 500px;
			height: 500px;
		}
	}
	@media (min-width: 1024px) {
		.content h1 {
			font-size: 3rem;
		}
		.blob-1 {
			width: 700px;
			height: 700px;
		}
		.blob-2 {
			width: 600px;
			height: 600px;
		}
		.blob-3 {
			width: 500px;
			height: 500px;
		}
	}
	@media (min-width: 1280px) {
		.content h1 {
			font-size: 3.5rem;
		}
	}
</style>
