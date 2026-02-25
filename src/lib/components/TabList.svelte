<script lang="ts">
	export let tabs: string[]
	export let id: string
	export let label_id: string

	let active = tabs[0]
</script>

<div class="tabs" {id}>
	<!-- Ligne titre + pills (côte à côte sur desktop, empilés sur mobile) -->
	<div class="tabs-header">
		<slot name="header" />
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
	</div>

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
	/* --- Mobile : titre puis pills empilées --- */
	.tabs-header {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1.5rem;
	}

	ul {
		padding: 0;
		margin: 0;
		list-style: none;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		gap: 0.5rem;
		width: 100%;
	}

	li {
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
		justify-content: center;
	}

	button.active {
		background: var(--brand);
		color: white;
	}

	button:not(.active):hover {
		background: rgba(255, 148, 22, 0.2);
	}

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

	/* --- Desktop : titre à gauche, pills en grille 2×2 à droite --- */
	@media (min-width: 768px) {
		.tabs-header {
			flex-direction: row;
			align-items: flex-start;
			justify-content: space-between;
			gap: 2.5rem;
		}

		ul {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 0.5rem;
			flex-shrink: 0;
			width: 340px;
		}

		li {
			display: flex;
		}

		button {
			width: 100%;
			font-size: 0.95rem;
			padding: 0.65rem 0.75rem;
			white-space: normal;
			text-align: center;
		}
	}
</style>
