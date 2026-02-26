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
			<!-- Large arcs -->
			<div class="arc arc-1"></div>
			<div class="arc arc-2"></div>
			<div class="arc arc-3"></div>
			<!-- Small accent dots -->
			<div class="dot dot-1"></div>
			<div class="dot dot-2"></div>
			<div class="dot dot-3"></div>
			<div class="dot dot-4"></div>
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

	/* Light background that breaks out of parent padding */
	.hero-bg {
		position: absolute;
		overflow: hidden;
		top: var(--hero-top-offset);
		left: 50%;
		transform: translateX(-50%);
		width: 100vw;
		height: calc(100% - var(--hero-top-offset));
		z-index: -1;
		background: linear-gradient(160deg, #ffffff 0%, #fff8f0 40%, #fff1e0 100%);
	}

	/* Geometric arc rings */
	.arc {
		position: absolute;
		border-radius: 50%;
		border-style: solid;
		border-color: rgba(255, 148, 22, 0.15);
		animation: drift 30s ease-in-out infinite;
	}

	.arc-1 {
		width: 600px;
		height: 600px;
		border-width: 3px;
		top: -15%;
		right: -10%;
		animation-duration: 35s;
	}

	.arc-2 {
		width: 450px;
		height: 450px;
		border-width: 2px;
		border-color: rgba(255, 148, 22, 0.12);
		bottom: -5%;
		left: -8%;
		animation-delay: -12s;
		animation-duration: 28s;
	}

	.arc-3 {
		width: 300px;
		height: 300px;
		border-width: 2px;
		border-color: rgba(255, 148, 22, 0.1);
		top: 30%;
		right: 25%;
		animation-delay: -20s;
		animation-duration: 32s;
	}

	/* Accent dots */
	.dot {
		position: absolute;
		border-radius: 50%;
		background-color: rgba(255, 148, 22, 0.2);
		animation: drift 20s ease-in-out infinite;
	}

	.dot-1 {
		width: 12px;
		height: 12px;
		top: 20%;
		right: 15%;
		animation-duration: 22s;
	}

	.dot-2 {
		width: 8px;
		height: 8px;
		top: 55%;
		right: 35%;
		background-color: rgba(255, 148, 22, 0.15);
		animation-delay: -5s;
		animation-duration: 18s;
	}

	.dot-3 {
		width: 16px;
		height: 16px;
		bottom: 25%;
		left: 20%;
		background-color: rgba(255, 148, 22, 0.18);
		animation-delay: -10s;
		animation-duration: 25s;
	}

	.dot-4 {
		width: 10px;
		height: 10px;
		top: 15%;
		left: 40%;
		background-color: rgba(255, 148, 22, 0.12);
		animation-delay: -15s;
		animation-duration: 20s;
	}

	@keyframes drift {
		0%,
		100% {
			transform: translate(0, 0);
		}
		25% {
			transform: translate(15px, -20px);
		}
		50% {
			transform: translate(-10px, 10px);
		}
		75% {
			transform: translate(20px, 15px);
		}
	}

	.content {
		color: var(--black, #000);
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
		.arc-1 {
			width: 750px;
			height: 750px;
		}
		.arc-2 {
			width: 550px;
			height: 550px;
		}
	}
	@media (min-width: 1024px) {
		.content h1 {
			font-size: 3rem;
		}
		.arc-1 {
			width: 900px;
			height: 900px;
			border-width: 4px;
		}
		.arc-2 {
			width: 650px;
			height: 650px;
			border-width: 3px;
		}
		.arc-3 {
			width: 400px;
			height: 400px;
			border-width: 3px;
		}
	}
	@media (min-width: 1280px) {
		.content h1 {
			font-size: 3.5rem;
		}
	}
</style>
