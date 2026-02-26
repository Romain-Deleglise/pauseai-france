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
			<!-- Perspective grid landscape -->
			<div class="grid-scene">
				<div class="grid-floor">
					<svg
						class="grid-svg"
						viewBox="0 0 1200 600"
						preserveAspectRatio="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<!-- Horizontal lines (receding into distance) -->
						<line
							x1="0"
							y1="600"
							x2="1200"
							y2="600"
							stroke="rgba(255,148,22,0.18)"
							stroke-width="1.5"
						/>
						<line
							x1="0"
							y1="540"
							x2="1200"
							y2="540"
							stroke="rgba(255,148,22,0.16)"
							stroke-width="1.3"
						/>
						<line
							x1="0"
							y1="480"
							x2="1200"
							y2="480"
							stroke="rgba(255,148,22,0.14)"
							stroke-width="1.2"
						/>
						<line
							x1="0"
							y1="425"
							x2="1200"
							y2="425"
							stroke="rgba(255,148,22,0.12)"
							stroke-width="1.1"
						/>
						<line
							x1="0"
							y1="375"
							x2="1200"
							y2="375"
							stroke="rgba(255,148,22,0.11)"
							stroke-width="1"
						/>
						<line
							x1="0"
							y1="330"
							x2="1200"
							y2="330"
							stroke="rgba(255,148,22,0.10)"
							stroke-width="0.9"
						/>
						<line
							x1="0"
							y1="290"
							x2="1200"
							y2="290"
							stroke="rgba(255,148,22,0.09)"
							stroke-width="0.8"
						/>
						<line
							x1="0"
							y1="255"
							x2="1200"
							y2="255"
							stroke="rgba(255,148,22,0.08)"
							stroke-width="0.7"
						/>
						<line
							x1="0"
							y1="225"
							x2="1200"
							y2="225"
							stroke="rgba(255,148,22,0.07)"
							stroke-width="0.6"
						/>
						<line
							x1="0"
							y1="200"
							x2="1200"
							y2="200"
							stroke="rgba(255,148,22,0.06)"
							stroke-width="0.5"
						/>
						<line
							x1="0"
							y1="178"
							x2="1200"
							y2="178"
							stroke="rgba(255,148,22,0.05)"
							stroke-width="0.5"
						/>
						<line
							x1="0"
							y1="160"
							x2="1200"
							y2="160"
							stroke="rgba(255,148,22,0.04)"
							stroke-width="0.4"
						/>

						<!-- Vertical lines (converging to vanishing point at 600,140) -->
						<line
							x1="600"
							y1="140"
							x2="-200"
							y2="600"
							stroke="rgba(255,148,22,0.14)"
							stroke-width="1"
						/>
						<line
							x1="600"
							y1="140"
							x2="0"
							y2="600"
							stroke="rgba(255,148,22,0.14)"
							stroke-width="1"
						/>
						<line
							x1="600"
							y1="140"
							x2="150"
							y2="600"
							stroke="rgba(255,148,22,0.13)"
							stroke-width="1"
						/>
						<line
							x1="600"
							y1="140"
							x2="300"
							y2="600"
							stroke="rgba(255,148,22,0.12)"
							stroke-width="1"
						/>
						<line
							x1="600"
							y1="140"
							x2="420"
							y2="600"
							stroke="rgba(255,148,22,0.11)"
							stroke-width="0.8"
						/>
						<line
							x1="600"
							y1="140"
							x2="520"
							y2="600"
							stroke="rgba(255,148,22,0.10)"
							stroke-width="0.7"
						/>
						<line
							x1="600"
							y1="140"
							x2="600"
							y2="600"
							stroke="rgba(255,148,22,0.15)"
							stroke-width="1.2"
						/>
						<line
							x1="600"
							y1="140"
							x2="680"
							y2="600"
							stroke="rgba(255,148,22,0.10)"
							stroke-width="0.7"
						/>
						<line
							x1="600"
							y1="140"
							x2="780"
							y2="600"
							stroke="rgba(255,148,22,0.11)"
							stroke-width="0.8"
						/>
						<line
							x1="600"
							y1="140"
							x2="900"
							y2="600"
							stroke="rgba(255,148,22,0.12)"
							stroke-width="1"
						/>
						<line
							x1="600"
							y1="140"
							x2="1050"
							y2="600"
							stroke="rgba(255,148,22,0.13)"
							stroke-width="1"
						/>
						<line
							x1="600"
							y1="140"
							x2="1200"
							y2="600"
							stroke="rgba(255,148,22,0.14)"
							stroke-width="1"
						/>
						<line
							x1="600"
							y1="140"
							x2="1400"
							y2="600"
							stroke="rgba(255,148,22,0.14)"
							stroke-width="1"
						/>

						<!-- Glow at vanishing point -->
						<circle cx="600" cy="140" r="60" fill="url(#vanish-glow)" />
						<circle cx="600" cy="140" r="3" fill="rgba(255,148,22,0.4)" />

						<defs>
							<radialGradient id="vanish-glow" cx="50%" cy="50%" r="50%">
								<stop offset="0%" stop-color="rgba(255,148,22,0.12)" />
								<stop offset="100%" stop-color="rgba(255,148,22,0)" />
							</radialGradient>
						</defs>
					</svg>
				</div>
				<!-- Horizon glow line -->
				<div class="horizon-glow"></div>
			</div>
			<!-- Fade overlay on left side for text readability -->
			<div class="text-fade"></div>
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
		background: linear-gradient(to bottom, #1a0a00 0%, #2d1200 30%, #fffaf5 60%, #fffaf5 100%);
	}

	/* Grid scene container */
	.grid-scene {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
	}

	.grid-floor {
		position: relative;
		width: 100%;
		height: 55%;
		animation: grid-drift 4s linear infinite;
	}

	.grid-svg {
		width: 100%;
		height: 100%;
	}

	/* Horizon glow */
	.horizon-glow {
		position: absolute;
		top: 42%;
		left: 0;
		right: 0;
		height: 4px;
		background: linear-gradient(
			to right,
			transparent 5%,
			rgba(255, 148, 22, 0.3) 30%,
			rgba(255, 148, 22, 0.5) 50%,
			rgba(255, 148, 22, 0.3) 70%,
			transparent 95%
		);
		box-shadow: 0 0 30px 10px rgba(255, 148, 22, 0.15);
		animation: horizon-pulse 6s ease-in-out infinite;
	}

	/* Fade overlay for text readability on left side */
	.text-fade {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to right,
			#fffaf5 0%,
			rgba(255, 250, 245, 0.95) 25%,
			rgba(255, 250, 245, 0.6) 50%,
			transparent 70%
		);
		pointer-events: none;
	}

	@keyframes grid-drift {
		0% {
			transform: translateY(0);
		}
		100% {
			transform: translateY(12px);
		}
	}

	@keyframes horizon-pulse {
		0%,
		100% {
			opacity: 0.7;
		}
		50% {
			opacity: 1;
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
