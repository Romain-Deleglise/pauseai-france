<script lang="ts">
	export let tabs: string[]
	export let id: string
	export let label_id: string

	let active = tabs[0]
</script>

<div class="tabs" {id}>
	<ul role="tablist" aria-labelledby={label_id}>
		{#each tabs as tab, i}
			<li role="presentation">
				<button
					type="button"
					role="tab"
					class:active={active === tab}
					on:click={() => (active = tab)}
					aria-selected={active === tab}
					aria-controls={`${id}-${i.toString()}`}
					tabindex={active === tab ? 0 : -1}
				>
					<slot {tab}></slot>
				</button>
			</li>
		{/each}
	</ul>

	{#each tabs as tab, i}
		{#key active}
			<div
				role="tabpanel"
				class="panel"
				tabindex="0"
				aria-labelledby={`${id}-${i.toString()}`}
				style={`display: ${active === tab ? 'block' : 'none'}`}
			>
				<h3 class="panel-title" id={`${id}-${i.toString()}`}>
					<slot {tab}></slot>
				</h3>
				<slot name="panel" {tab}></slot>
			</div>
		{/key}
	{/each}
</div>

<style>
	.tabs {
		--padding-side: 1rem;
	}

	/* Mobile : pills horizontales défilables */
	ul {
		padding: 0;
		margin: 0 0 1.5rem;
		list-style: none;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		overflow-x: auto;
		scrollbar-width: none;
		-ms-overflow-style: none;
		gap: 0.5rem;
		width: 100%;
	}

	ul::-webkit-scrollbar {
		display: none;
	}

	li {
		flex-shrink: 0;
		display: flex;
	}

	button {
		padding: 0.6rem 1.1rem;
		background: rgba(0, 0, 0, 0.07);
		border: none;
		border-radius: 2rem;
		font-family: var(--font-body);
		font-size: 0.9rem;
		font-weight: 600;
		white-space: nowrap;
		cursor: pointer;
		color: var(--text);
		transition:
			background-color 0.15s ease,
			color 0.15s ease;
		display: flex;
		align-items: center;
	}

	button.active {
		background: var(--brand);
		color: white;
	}

	button:not(.active):hover {
		background: rgba(255, 148, 22, 0.2);
	}

	/* Animation d'entrée du panneau */
	.panel {
		animation: panelIn 0.2s ease;
	}

	@keyframes panelIn {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.panel {
			animation: none;
		}
	}

	.panel-title {
		display: none;
	}

	/* Desktop : colonne verticale + grille côte à côte */
	@media (min-width: 768px) {
		.tabs {
			display: grid;
			grid-template-columns: max-content minmax(2rem, 1fr) minmax(auto, 50rem) 3fr;
		}

		ul {
			flex-direction: column;
			overflow-x: visible;
			width: fit-content;
			gap: 0.25rem;
			margin-bottom: 0;
			grid-column: 1;
		}

		li {
			flex-shrink: 1;
		}

		button {
			padding: 0.75rem 1.5rem;
			border-radius: 0.625rem;
			white-space: normal;
			text-align: left;
			font-size: 1rem;
			min-width: 11rem;
		}

		.panel {
			grid-column: 3;
		}

		.panel-title {
			display: block;
			padding-bottom: 1rem;
		}
	}

	@media (min-width: 1024px) {
		button {
			padding: 0.9rem 2rem;
		}
	}
</style>
