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
		background: #fff8f0;
	}

	/* Organic blob shapes */
	.blob {
		position: absolute;
		animation: drift 25s ease-in-out infinite;
	}

	.blob-1 {
		width: 420px;
		height: 380px;
		background: rgba(255, 148, 22, 0.25);
		border-radius: 60% 40% 55% 45% / 50% 60% 40% 50%;
		top: -5%;
		right: 5%;
		animation-duration: 28s;
	}

	.blob-2 {
		width: 300px;
		height: 280px;
		background: rgba(255, 148, 22, 0.35);
		border-radius: 45% 55% 40% 60% / 55% 45% 55% 45%;
		top: 5%;
		right: 12%;
		animation-delay: -8s;
		animation-duration: 24s;
	}

	.blob-3 {
		width: 350px;
		height: 320px;
		background: rgba(255, 148, 22, 0.18);
		border-radius: 55% 45% 60% 40% / 45% 55% 45% 55%;
		bottom: 5%;
		left: -3%;
		animation-delay: -15s;
		animation-duration: 30s;
	}

	.blob-4 {
		width: 220px;
		height: 200px;
		background: rgba(255, 148, 22, 0.3);
		border-radius: 50% 50% 45% 55% / 55% 45% 50% 50%;
		bottom: 12%;
		right: 30%;
		animation-delay: -20s;
		animation-duration: 22s;
	}

	@keyframes drift {
		0%,
		100% {
			transform: translate(0, 0) rotate(0deg);
		}
		25% {
			transform: translate(20px, -15px) rotate(3deg);
		}
		50% {
			transform: translate(-15px, 10px) rotate(-2deg);
		}
		75% {
			transform: translate(10px, 20px) rotate(1deg);
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
		.blob-1 {
			width: 520px;
			height: 470px;
		}
		.blob-2 {
			width: 380px;
			height: 350px;
		}
		.blob-3 {
			width: 430px;
			height: 390px;
		}
	}

	@media (min-width: 1024px) {
		.content h1 {
			font-size: 3rem;
		}
		.blob-1 {
			width: 620px;
			height: 560px;
		}
		.blob-2 {
			width: 450px;
			height: 410px;
		}
		.blob-3 {
			width: 500px;
			height: 460px;
		}
		.blob-4 {
			width: 300px;
			height: 270px;
		}
	}

	@media (min-width: 1280px) {
		.content h1 {
			font-size: 3.5rem;
		}
	}
</style>
