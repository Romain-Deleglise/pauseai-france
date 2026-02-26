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
			<!-- Cluster haut-droite -->
			<svg
				class="topo topo-top-right"
				viewBox="0 0 600 500"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				aria-hidden="true"
			>
				<path
					d="M300,250 C320,180 400,150 430,190 C460,230 420,300 370,310 C320,320 280,290 300,250Z"
					stroke="rgba(255,148,22,0.35)"
					stroke-width="1.5"
				/>
				<path
					d="M300,250 C330,160 420,120 470,170 C520,220 460,330 380,345 C300,360 260,310 300,250Z"
					stroke="rgba(255,148,22,0.28)"
					stroke-width="1.5"
				/>
				<path
					d="M300,250 C340,130 450,90 510,155 C570,220 500,360 390,385 C280,410 240,320 300,250Z"
					stroke="rgba(255,148,22,0.22)"
					stroke-width="1.5"
				/>
				<path
					d="M300,250 C350,100 480,55 550,140 C620,225 540,395 400,425 C260,455 220,340 300,250Z"
					stroke="rgba(255,148,22,0.17)"
					stroke-width="1.5"
				/>
				<path
					d="M300,250 C360,70 510,20 590,120 C670,220 580,430 410,465 C240,500 200,360 300,250Z"
					stroke="rgba(255,148,22,0.12)"
					stroke-width="1.5"
				/>
				<path
					d="M300,250 C370,40 540,-15 630,100 C720,215 620,460 420,500 C220,540 180,380 300,250Z"
					stroke="rgba(255,148,22,0.08)"
					stroke-width="1.5"
				/>
			</svg>

			<!-- Cluster bas-gauche -->
			<svg
				class="topo topo-bottom-left"
				viewBox="0 0 500 450"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				aria-hidden="true"
			>
				<path
					d="M220,220 C200,170 230,130 280,140 C330,150 350,200 330,240 C310,280 240,270 220,220Z"
					stroke="rgba(255,148,22,0.30)"
					stroke-width="1.5"
				/>
				<path
					d="M220,220 C190,150 220,95 290,110 C360,125 390,195 360,255 C330,315 250,310 220,220Z"
					stroke="rgba(255,148,22,0.22)"
					stroke-width="1.5"
				/>
				<path
					d="M220,220 C175,120 215,55 305,75 C395,95 435,190 395,275 C355,360 265,355 220,220Z"
					stroke="rgba(255,148,22,0.16)"
					stroke-width="1.5"
				/>
				<path
					d="M220,220 C160,90 210,10 320,40 C430,70 480,185 430,295 C380,405 280,400 220,220Z"
					stroke="rgba(255,148,22,0.10)"
					stroke-width="1.5"
				/>
			</svg>

			<!-- Cluster centre-bas (petit, subtil) -->
			<svg
				class="topo topo-center"
				viewBox="0 0 300 300"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				aria-hidden="true"
			>
				<path
					d="M150,150 C160,120 190,110 210,130 C230,150 220,185 195,190 C170,195 140,175 150,150Z"
					stroke="rgba(255,148,22,0.20)"
					stroke-width="1.2"
				/>
				<path
					d="M150,150 C165,100 205,85 235,115 C265,145 245,205 210,215 C175,225 130,195 150,150Z"
					stroke="rgba(255,148,22,0.14)"
					stroke-width="1.2"
				/>
				<path
					d="M150,150 C170,80 220,60 260,100 C300,140 270,225 225,240 C180,255 120,215 150,150Z"
					stroke="rgba(255,148,22,0.09)"
					stroke-width="1.2"
				/>
			</svg>
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

	/* Topographic contour lines */
	.topo {
		position: absolute;
		animation: topo-breathe 25s ease-in-out infinite;
	}

	.topo path {
		fill: none;
	}

	.topo-top-right {
		width: 55%;
		min-width: 340px;
		top: -8%;
		right: -8%;
		animation-duration: 28s;
	}

	.topo-bottom-left {
		width: 45%;
		min-width: 280px;
		bottom: -5%;
		left: -8%;
		animation-delay: -10s;
		animation-duration: 32s;
	}

	.topo-center {
		width: 25%;
		min-width: 180px;
		bottom: 20%;
		right: 25%;
		animation-delay: -18s;
		animation-duration: 24s;
		opacity: 0.7;
	}

	@keyframes topo-breathe {
		0%,
		100% {
			transform: scale(1) rotate(0deg);
		}
		50% {
			transform: scale(1.04) rotate(1.5deg);
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
		.topo-top-right {
			width: 50%;
		}
		.topo-bottom-left {
			width: 40%;
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
