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
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	</button>

	<div class="menu" class:open role="menu">
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
				{item.label}
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

<style>
	.dropdown {
		position: relative;
		display: flex;
		align-items: center;
	}

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
		padding: 0;
		min-width: 48px;
		transition: color 100ms;
		white-space: nowrap;
	}

	.trigger.white {
		color: white;
	}

	.trigger.active,
	.trigger:hover {
		color: var(--brand);
	}

	/* Keep white text hover on homepage */
	.trigger.white:not(.active):hover {
		color: var(--brand);
	}

	.chevron {
		transition: transform 0.2s ease;
		flex-shrink: 0;
	}

	.chevron.rotated {
		transform: rotate(180deg);
	}

	.menu {
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%) translateY(-6px);
		min-width: 15rem;
		padding: 0.75rem 0 0;
		z-index: 200;
		opacity: 0;
		visibility: hidden;
		transition:
			opacity 0.15s ease,
			transform 0.15s ease,
			visibility 0.15s;
		pointer-events: none;
	}

	/* Inner box with visual styling */
	.menu::after {
		content: '';
		position: absolute;
		inset: 0.75rem 0 0;
		background: white;
		border: 1px solid rgba(0, 0, 0, 0.08);
		border-radius: 0.75rem;
		box-shadow:
			0 8px 24px rgba(0, 0, 0, 0.12),
			0 2px 8px rgba(0, 0, 0, 0.06);
		z-index: -1;
	}

	/* Small arrow pointing up */
	.menu::before {
		content: '';
		position: absolute;
		top: calc(0.75rem - 6px);
		left: 50%;
		transform: translateX(-50%);
		width: 12px;
		height: 6px;
		background: white;
		clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
		filter: drop-shadow(0 -1px 1px rgba(0, 0, 0, 0.08));
	}

	.menu.open {
		opacity: 1;
		visibility: visible;
		transform: translateX(-50%) translateY(0);
		pointer-events: auto;
	}

	.menu a {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		padding: 0.6rem 0.875rem;
		font-family: var(--font-heading);
		font-weight: 500;
		font-size: 0.95rem;
		color: var(--text);
		text-decoration: none;
		border-radius: 0.5rem;
		transition:
			background-color 0.1s ease,
			color 0.1s ease;
		white-space: nowrap;
	}

	.menu a:hover,
	.menu a.active {
		background-color: rgba(255, 148, 22, 0.1);
		color: var(--brand);
	}

	.ext-icon {
		opacity: 0.5;
		flex-shrink: 0;
	}

	@media (min-width: 1024px) {
		.trigger {
			font-size: 1.1rem;
		}
	}
</style>
