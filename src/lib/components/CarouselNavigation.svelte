<script lang="ts">
	import { createEventDispatcher } from 'svelte'

	interface NavItem {
		label: string
	}

	interface DotItem {
		type: 'dot'
		index: number
		item: NavItem
	}

	interface EllipsisItem {
		type: 'ellipsis'
	}

	type DotOrEllipsis = DotItem | EllipsisItem

	const dispatch = createEventDispatcher()

	export let items: NavItem[] = []
	export let current = 0
	export let previousLabel = 'Précédent'
	export let nextLabel = 'Suivant'
	export let ariaLabel = 'Contrôles du carrousel'
	export let showArrows = true
	export let showDots = true
	export let maxVisibleDots = 7
	export let href: string | null = null

	const select = (index: number) => {
		dispatch('select', { index })
	}

	const previous = () => {
		dispatch('previous')
	}

	const next = () => {
		dispatch('next')
	}

	$: dotItems = (() => {
		if (items.length <= maxVisibleDots) {
			return items.map((item, index) => ({ type: 'dot' as const, index, item }))
		}

		const result: DotOrEllipsis[] = []
		const total = items.length
		const half = Math.floor((maxVisibleDots - 2) / 2) // -2 for first and last

		result.push({ type: 'dot', index: 0, item: items[0] })

		let start = Math.max(1, current - half)
		let end = Math.min(total - 2, current + half)

		if (start > 1) {
			result.push({ type: 'ellipsis' })
		}

		for (let i = start; i <= end; i++) {
			result.push({ type: 'dot', index: i, item: items[i] })
		}

		if (end < total - 2) {
			result.push({ type: 'ellipsis' })
		}

		if (total > 1) {
			result.push({ type: 'dot', index: total - 1, item: items[total - 1] })
		}

		return result
	})()
</script>

{#if items.length > 1 || showArrows}
	<a class="controls" {href} aria-label={ariaLabel}>
		{#if showArrows}
			<button class="nav" type="button" aria-label={previousLabel} on:click={previous}>
				&lsaquo;
			</button>
		{/if}

		{#if showDots && items.length > 1}
			<div class="dots" role="tablist" aria-label="Navigation par éléments">
				{#each dotItems as dotItem}
					{#if dotItem.type === 'dot'}
						<button
							type="button"
							class="dots__dot"
							class:dots__dot--active={dotItem.index === current}
							aria-label={dotItem.item.label}
							aria-current={dotItem.index === current ? 'true' : undefined}
							on:click={() => {
								select(dotItem.index)
							}}
						/>
					{:else}
						<span class="dots__ellipsis">…</span>
					{/if}
				{/each}
			</div>
		{/if}

		{#if showArrows}
			<button class="nav" type="button" aria-label={nextLabel} on:click={next}> &rsaquo; </button>
		{/if}
	</a>
{/if}

<style>
	.controls {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1.5rem;
		margin-top: 1.5rem;
		text-decoration: none;
	}

	.nav {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		border: 1px solid var(--carousel-border, #d9c7b0);
		background: #fff7ed;
		color: var(--carousel-accent, #ff9416);
		font-size: 1.45rem;
		line-height: 1;
		cursor: pointer;
		transition:
			background 150ms ease,
			color 150ms ease,
			transform 150ms ease;
	}

	.nav:hover,
	.nav:focus-visible {
		background: var(--carousel-accent, #ff9416);
		color: #ffffff;
		outline: none;
		transform: translateY(-1px);
	}

	.dots {
		display: flex;
		gap: 0.45rem;
		align-items: center;
	}

	.dots__dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		border: none;
		background: #d0c6bc;
		cursor: pointer;
		padding: 0;
		transition:
			transform 120ms ease,
			background 120ms ease;
	}

	.dots__dot--active {
		background: var(--carousel-accent, #ff9416);
		width: 12px;
		height: 12px;
		transform: scale(1.08);
	}

	.dots__ellipsis {
		color: #6b6b6b;
		font-size: 1.2rem;
		line-height: 1;
		margin: 0 0.2rem;
	}
</style>
