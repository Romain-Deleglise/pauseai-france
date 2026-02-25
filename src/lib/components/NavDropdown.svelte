<script lang="ts">
	import { page } from '$app/stores'

	export let label: string
	export let items: Array<{
		href: string
		label: string
		external?: boolean
	}>

	let open = false
	let dropdownEl: HTMLElement

	$: hasActiveChild = items.some((item) => {
		if (!item.href.startsWith('/')) return false
		return (
			$page.url.pathname === item.href ||
			$page.url.pathname.startsWith(item.href + '/') ||
			// Handle dangers section: /dangers/... matches /dangers
			($page.url.pathname.startsWith('/dangers') && item.href === '/dangers')
		)
	})
	$: isHomepage = $page.url.pathname === '/'

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			open = false
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="dropdown"
	bind:this={dropdownEl}
	on:mouseenter={() => (open = true)}
	on:mouseleave={() => (open = false)}
>
	<button
		class="trigger"
		class:active={hasActiveChild}
		class:white={isHomepage}
		on:click={() => (open = !open)}
		aria-expanded={open}
		aria-haspopup="menu"
	>
		{label}
		<svg
			class="chevron"
			class:rotated={open}
			width="10"
			height="6"
			viewBox="0 0 10 6"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
		>
			<path
				d="M1 1L5 5L9 1"
				stroke="currentColor"
				stroke-width="1.8"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	</button>

	<div class="menu" class:open role="menu">
		<!-- Arrow tip -->
		<div class="menu-arrow"></div>
		<div class="menu-inner">
			{#each items as item}
				<a
					href={item.href}
					class:active={!item.href.startsWith('http') &&
						($page.url.pathname === item.href ||
							$page.url.pathname.startsWith(item.href + '/') ||
							($page.url.pathname.startsWith('/dangers') && item.href === '/dangers'))}
					target={item.external ? '_blank' : undefined}
					rel={item.external ? 'noopener noreferrer' : undefined}
					role="menuitem"
					on:click={() => (open = false)}
				>
					<span class="item-dot"></span>
					<span class="item-label">{item.label}</span>
					{#if item.external}
						<svg
							class="ext-icon"
							width="11"
							height="11"
							viewBox="0 0 11 11"
							fill="none"
							aria-hidden="true"
						>
							<path
								d="M6.5 1h3.5v3.5M10 1L4.5 6.5M3 3H1.5A.5.5 0 001 3.5v6A.5.5 0 001.5 10h6a.5.5 0 00.5-.5V8"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					{/if}
				</a>
			{/each}
		</div>
	</div>
</div>

<style>
	.dropdown {
		position: relative;
		display: flex;
		align-items: center;
	}

	/* ─── Trigger button ─────────────────────────────────────────── */
	.trigger {
		display: flex;
		align-items: center;
		gap: 0.3rem;
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 1rem;
		color: var(--text);
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.25rem 0;
		min-width: 48px;
		transition: color 120ms;
		white-space: nowrap;
		position: relative;
	}

	/* Underline indicator */
	.trigger::after {
		content: '';
		position: absolute;
		bottom: -2px;
		left: 0;
		right: 0;
		height: 2px;
		background: var(--brand);
		border-radius: 2px;
		transform: scaleX(0);
		transform-origin: center;
		transition: transform 0.2s ease;
	}

	.trigger.active::after {
		transform: scaleX(1);
	}

	.trigger.white {
		color: white;
	}

	.trigger.active,
	.trigger:hover {
		color: var(--brand);
	}

	.trigger.white.active::after {
		background: white;
	}

	.chevron {
		transition: transform 0.2s ease;
		flex-shrink: 0;
		opacity: 0.7;
	}

	.chevron.rotated {
		transform: rotate(180deg);
	}

	/* ─── Dropdown menu ──────────────────────────────────────────── */
	.menu {
		position: absolute;
		top: calc(100% + 0.75rem);
		left: 50%;
		transform: translateX(-50%) translateY(-6px);
		min-width: 14rem;
		z-index: 200;
		opacity: 0;
		visibility: hidden;
		transition:
			opacity 0.18s ease,
			transform 0.18s ease,
			visibility 0.18s;
		pointer-events: none;
	}

	.menu.open {
		opacity: 1;
		visibility: visible;
		transform: translateX(-50%) translateY(0);
		pointer-events: auto;
	}

	/* Arrow tip */
	.menu-arrow {
		width: 12px;
		height: 7px;
		background: white;
		clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
		margin: 0 auto;
		position: relative;
		z-index: 1;
		filter: drop-shadow(0 -1px 1px rgba(0, 0, 0, 0.07));
	}

	.menu-inner {
		background: white;
		border: 1px solid rgba(0, 0, 0, 0.07);
		border-radius: 0.875rem;
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.07),
			0 12px 32px rgba(0, 0, 0, 0.1);
		padding: 0.4rem;
		overflow: hidden;
	}

	/* ─── Menu items ─────────────────────────────────────────────── */
	.menu a {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.55rem 0.75rem;
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 0.9rem;
		color: rgba(0, 0, 0, 0.75);
		text-decoration: none;
		border-radius: 0.5rem;
		transition:
			background-color 0.1s ease,
			color 0.1s ease;
		white-space: nowrap;
	}

	.menu a:hover {
		background-color: rgba(0, 0, 0, 0.04);
		color: black;
	}

	.menu a.active {
		background-color: rgba(255, 148, 22, 0.1);
		color: var(--brand);
	}

	.item-dot {
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: rgba(0, 0, 0, 0.2);
		flex-shrink: 0;
		transition: background 0.1s;
	}

	.menu a:hover .item-dot {
		background: rgba(0, 0, 0, 0.5);
	}

	.menu a.active .item-dot {
		background: var(--brand);
	}

	.ext-icon {
		opacity: 0.4;
		flex-shrink: 0;
		margin-left: auto;
	}

	@media (min-width: 1024px) {
		.trigger {
			font-size: 1.05rem;
		}
	}
</style>
