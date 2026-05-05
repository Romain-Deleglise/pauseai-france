<script lang="ts">
	const LON_MIN = -5.5
	const LON_MAX = 10.5
	const LAT_MAX = 51.6
	const LAT_MIN = 41.8
	const W = 600
	const H = 580

	function px(lon: number) {
		return ((lon - LON_MIN) / (LON_MAX - LON_MIN)) * W
	}
	function py(lat: number) {
		return ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * H
	}
	function pt(lon: number, lat: number) {
		return `${px(lon).toFixed(1)},${py(lat).toFixed(1)}`
	}

	// Simplified mainland France outline, clockwise from Dunkerque
	const outline: [number, number][] = [
		[2.4, 51.0], // Dunkerque
		[3.8, 50.38], // Belgian border / Valenciennes
		[5.7, 49.55], // Luxembourg border
		[6.35, 49.2], // Moselle
		[7.77, 48.58], // Strasbourg
		[7.55, 47.55], // Basel / Alsace sud
		[6.0, 46.1], // Jura / Lac Léman
		[7.1, 44.1], // Alpes / frontière italienne
		[7.38, 43.75], // Near Nice
		[5.5, 43.3], // Marseille area
		[4.4, 43.35], // Camargue
		[3.55, 43.4], // Languedoc
		[2.85, 42.45], // Perpignan / frontière espagnole
		[0.0, 42.5], // Pyrénées centre
		[-1.7, 43.38], // Pays Basque
		[-1.07, 45.57], // Pointe de Grave
		[-1.78, 46.5], // Vendée
		[-2.22, 47.27], // Saint-Nazaire
		[-3.37, 47.75], // Lorient
		[-4.78, 48.03], // Pointe du Raz
		[-4.5, 48.4], // Brest
		[-2.0, 48.65], // Nord Bretagne
		[-1.6, 49.7], // Cherbourg
		[0.15, 49.7], // Normandie
		[1.6, 50.87] // Cap Gris Nez
	]

	const francePath = 'M ' + outline.map(([lon, lat]) => pt(lon, lat)).join(' L ') + ' Z'

	interface Group {
		name: string
		lat: number
		lon: number
		forming?: boolean
	}

	const groups: Group[] = [
		{ name: 'Paris', lat: 48.86, lon: 2.35 },
		{ name: 'Lyon', lat: 45.76, lon: 4.84 },
		{ name: 'Toulouse', lat: 43.6, lon: 1.44 },
		{ name: 'Bordeaux', lat: 44.84, lon: -0.58 },
		{ name: 'Colmar', lat: 48.08, lon: 7.36 },
		{ name: 'Poitiers', lat: 46.58, lon: 0.34 },
		{ name: 'Dordogne', lat: 45.18, lon: 0.72 },
		{ name: 'Strasbourg', lat: 48.57, lon: 7.75 },
		{ name: 'Grenoble', lat: 45.19, lon: 5.72 },
		{ name: 'Lille', lat: 50.63, lon: 3.06, forming: true },
		{ name: 'Genève', lat: 46.2, lon: 6.14 }
	]

	let activeCity: string | null = null

	function labelPos(cx: number, cy: number, name: number) {
		const labelW = name * 8 + 24
		const labelH = 30
		const offX = cx > W * 0.72 ? cx - labelW - 16 : cx - labelW / 2
		const offY = cy > H * 0.78 ? cy - labelH - 14 : cy + 14
		return { x: offX, y: offY, w: labelW, h: labelH }
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
<div class="map-wrap">
	<svg
		viewBox="0 0 {W} {H}"
		class="france-map"
		aria-label="Carte des groupes locaux de Pause IA"
		on:click={() => (activeCity = null)}
	>
		<path class="land" d={francePath} />

		{#each groups as g}
			{@const cx = px(g.lon)}
			{@const cy = py(g.lat)}
			{@const isActive = activeCity === g.name}
			{@const lp = labelPos(cx, cy, g.name.length)}
			<g
				class="city"
				class:forming={g.forming}
				class:active={isActive}
				role="button"
				tabindex="0"
				aria-label={g.name}
				on:mouseenter={() => (activeCity = g.name)}
				on:mouseleave={() => (activeCity = null)}
				on:click|stopPropagation={() => (activeCity = isActive ? null : g.name)}
				on:keydown={(e) => e.key === 'Enter' && (activeCity = isActive ? null : g.name)}
			>
				<circle class="hit" r="20" {cx} {cy} />
				<circle class="pulse" r="14" {cx} {cy} />
				<circle class="ring" r="9" {cx} {cy} />
				<circle class="dot" r="4" {cx} {cy} />

				{#if isActive}
					<g class="label-bubble">
						<rect x={lp.x} y={lp.y} width={lp.w} height={lp.h} rx="6" />
						<text
							x={lp.x + lp.w / 2}
							y={lp.y + lp.h / 2}
							text-anchor="middle"
							dominant-baseline="central">{g.name}</text
						>
					</g>
				{/if}
			</g>
		{/each}
	</svg>

	<div class="legend">
		<span class="legend-item">
			<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
				<circle cx="8" cy="8" r="7" fill="var(--brand, #ff9416)" />
				<circle cx="8" cy="8" r="3.5" fill="white" />
			</svg>
			Groupe actif
		</span>
		<span class="legend-item">
			<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
				<circle
					cx="8"
					cy="8"
					r="6.5"
					fill="none"
					stroke="var(--brand, #ff9416)"
					stroke-width="2"
					stroke-dasharray="4 3"
				/>
				<circle cx="8" cy="8" r="3.5" fill="var(--brand, #ff9416)" opacity="0.35" />
			</svg>
			En cours de création
		</span>
	</div>
</div>

<style>
	.map-wrap {
		max-width: 560px;
		margin: 0 auto;
	}

	.france-map {
		width: 100%;
		height: auto;
		display: block;
		overflow: visible;
	}

	.land {
		fill: var(--bg-subtle, #f0f0ee);
		stroke: var(--border, #ccc);
		stroke-width: 1.5;
		stroke-linejoin: round;
	}

	:global([data-theme='dark']) .land {
		fill: rgba(255, 255, 255, 0.06);
		stroke: rgba(255, 255, 255, 0.2);
	}

	.city {
		cursor: pointer;
	}

	.hit {
		fill: transparent;
	}

	.pulse {
		fill: var(--brand, #ff9416);
		opacity: 0;
		transition: opacity 0.2s;
	}

	.ring {
		fill: var(--brand, #ff9416);
		transition: r 0.15s ease;
	}

	.dot {
		fill: white;
	}

	/* forming (Lille) */
	.city.forming .ring {
		fill: none;
		stroke: var(--brand, #ff9416);
		stroke-width: 2;
		stroke-dasharray: 5 3;
	}

	.city.forming .dot {
		fill: var(--brand, #ff9416);
		opacity: 0.4;
	}

	/* hover / active state */
	.city:hover .pulse,
	.city.active .pulse {
		opacity: 0.18;
	}

	.city:focus-visible .pulse {
		opacity: 0.25;
	}

	.city:focus-visible {
		outline: none;
	}

	.label-bubble rect {
		fill: var(--text, #111);
		filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.25));
	}

	.label-bubble text {
		fill: #fff;
		font-size: 12px;
		font-weight: 700;
		font-family: inherit;
		pointer-events: none;
	}

	.legend {
		display: flex;
		gap: 1.5rem;
		justify-content: center;
		margin-top: 0.75rem;
		font-size: 0.82rem;
		color: var(--text-secondary, #676e7a);
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}
</style>
