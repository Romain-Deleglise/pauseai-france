<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	export let options: { value: string; label: string; count?: number }[] = []
	export let selected: string

	const dispatch = createEventDispatcher<{ select: string }>()

	function choose(value: string) {
		selected = value
		dispatch('select', value)
	}
</script>

<div class="ui-chips" role="tablist">
	{#each options as option (option.value)}
		<button
			type="button"
			role="tab"
			aria-selected={selected === option.value}
			class="chip"
			class:active={selected === option.value}
			on:click={() => {
				choose(option.value)
			}}
		>
			{option.label}
			{#if option.count !== undefined}<span class="count">{option.count}</span>{/if}
		</button>
	{/each}
</div>

<style>
	.ui-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
	}

	.chip {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.5rem 1rem;
		border: 1px solid var(--border);
		border-radius: var(--radius-pill);
		background: var(--bg-card);
		color: var(--text-2);
		font-family: inherit;
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
		transition:
			background 0.15s ease,
			color 0.15s ease,
			border-color 0.15s ease;
	}

	.chip:hover {
		border-color: var(--brand-subtle);
		color: var(--text);
	}

	.chip.active {
		background: var(--brand);
		border-color: var(--brand-subtle);
		color: var(--on-brand);
	}

	.count {
		font-size: 0.75rem;
		opacity: 0.8;
	}
</style>
