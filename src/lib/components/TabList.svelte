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
	/* Annule le margin-bottom imposé par UnderlinedTitle dans ce contexte */
	:global(.tabs-header h2) {
		margin-bottom: 0;
	}

	/* --- Mobile : titre puis pills --- */
	.tabs-header {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
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
		background: rgba(0, 0, 0, 0.05);
		border: 1.5px solid rgba(0, 0, 0, 0.12);
		border-radius: 2rem;
		font-family: var(--font-body);
		font-size: 0.9rem;
		font-weight: 600;
		white-space: nowrap;
		cursor: pointer;
		color: var(--text);
		transition:
			background-color 0.15s ease,
			color 0.15s ease,
			border-color 0.15s ease,
			box-shadow 0.15s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	button.active {
		background: var(--brand);
		border-color: var(--brand);
		color: white;
		box-shadow: 0 2px 8px rgba(255, 148, 22, 0.35);
	}

	button:not(.active):hover {
		background: rgba(255, 148, 22, 0.1);
		border-color: rgba(255, 148, 22, 0.45);
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

	/* --- Desktop : titre à gauche, pills en ligne à droite --- */
	@media (min-width: 768px) {
		.tabs-header {
			flex-direction: row;
			flex-wrap: wrap;
			align-items: center;
			justify-content: space-between;
			gap: 0.75rem 2rem;
		}

		ul {
			flex-wrap: wrap;
			width: auto;
			justify-content: flex-end;
		}

		button {
			font-size: 0.95rem;
			padding: 0.65rem 1.25rem;
		}
	}
</style>
