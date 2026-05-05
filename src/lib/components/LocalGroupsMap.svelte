<script lang="ts">
	import { onMount, onDestroy } from 'svelte'

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

	let mapContainer: HTMLDivElement
	let map: import('leaflet').Map | null = null

	onMount(async () => {
		const L = (await import('leaflet')).default
		await import('leaflet/dist/leaflet.css')

		map = L.map(mapContainer, {
			scrollWheelZoom: false,
			zoomControl: true,
			attributionControl: true
		})

		map.fitBounds(
			[
				[41.3, -5.5],
				[51.6, 10.0]
			],
			{ padding: [10, 10] }
		)

		L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
			subdomains: 'abcd',
			maxZoom: 19
		}).addTo(map)

		for (const group of groups) {
			const marker = L.circleMarker([group.lat, group.lon], {
				radius: 11,
				fillColor: '#ff9416',
				color: group.forming ? '#ff9416' : '#fff',
				weight: group.forming ? 2.5 : 2.5,
				opacity: 1,
				fillOpacity: group.forming ? 0.35 : 1,
				className: group.forming ? 'marker-forming' : 'marker-active'
			}).addTo(map)

			const tooltipContent = group.forming
				? `<strong>${group.name}</strong><br><em>En cours de création</em>`
				: `<strong>${group.name}</strong>`

			marker.bindTooltip(tooltipContent, {
				direction: 'top',
				offset: [0, -8],
				className: 'map-tooltip'
			})

			marker.on('click', function () {
				this.openTooltip()
			})
		}
	})

	onDestroy(() => {
		map?.remove()
	})
</script>

<div class="map-wrap">
	<div bind:this={mapContainer} class="map-container"></div>

	<div class="legend">
		<span class="legend-item">
			<span class="legend-dot active"></span>
			Groupe actif
		</span>
		<span class="legend-item">
			<span class="legend-dot forming"></span>
			En cours de création
		</span>
	</div>
</div>

<style>
	.map-wrap {
		width: 100%;
	}

	.map-container {
		height: 480px;
		border-radius: 14px;
		overflow: hidden;
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
		border: 1px solid var(--border, #e5e7eb);
	}

	:global(.map-tooltip) {
		background: #111 !important;
		color: #fff !important;
		border: none !important;
		border-radius: 6px !important;
		padding: 6px 12px !important;
		font-size: 13px !important;
		font-weight: 600 !important;
		font-family: inherit !important;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
		white-space: nowrap !important;
	}

	:global(.map-tooltip em) {
		font-style: normal;
		font-weight: 400;
		font-size: 11px;
		opacity: 0.75;
	}

	:global(.map-tooltip::before) {
		border-top-color: #111 !important;
	}

	:global(.leaflet-attribution-flag) {
		display: none !important;
	}

	:global(.leaflet-control-attribution) {
		font-size: 10px;
		opacity: 0.6;
	}

	:global(.marker-forming) {
		stroke-dasharray: 5 3 !important;
	}

	.legend {
		display: flex;
		gap: 1.5rem;
		justify-content: center;
		margin-top: 0.875rem;
		font-size: 0.82rem;
		color: var(--text-secondary, #676e7a);
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.45rem;
	}

	.legend-dot {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		display: inline-block;
		flex-shrink: 0;
	}

	.legend-dot.active {
		background: #ff9416;
		border: 2.5px solid #fff;
		box-shadow: 0 0 0 1.5px #ff9416;
	}

	.legend-dot.forming {
		background: rgba(255, 148, 22, 0.35);
		border: 2px dashed #ff9416;
	}
</style>
