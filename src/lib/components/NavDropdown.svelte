<script lang="ts">
	import { page } from '$app/stores'

	export let label: string
	export let white = false
	export let items: Array<{
		href: string
		label: string
		external?: boolean
		muted?: boolean
	}>

	let open = false

	$: hasActiveChild = items.some((item) => {
		if (!item.href.startsWith('/')) return false
		return (
			$page.url.pathname === item.href ||
			$page.url.pathname.startsWith(item.href + '/') ||
			($page.url.pathname.startsWith('/dangers') && item.href === '/dangers')
		)
	})

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') open = false
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="dropdown" on:mouseenter={() => (open = true)} on:mouseleave={() => (open = false)}>
	<button
		class="trigger"
		class:active={hasActiveChild}
		class:white
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

	<!--
		The menu starts at top:100% with padding-top to bridge the gap
		between trigger and the visual box — this prevents mouseleave
		from firing when moving the cursor through the gap.
	-->
	<div class="menu" class:open role="menu">
		<div class="menu-arrow" aria-hidden="true"></div>
		<div class="menu-inner">
			{#each items as item}
				<a
					href={item.href}
					class:active={!item.href.startsWith('http') &&
						($page.url.pathname === item.href ||
							$page.url.pathname.startsWith(item.href + '/') ||
							($page.url.pathname.startsWith('/dangers') && item.href === '/dangers'))}
					class:muted={item.muted}
					target={item.external ? '_blank' : undefined}
					rel={item.external ? 'noopener noreferrer' : undefined}
					role="menuitem"
					on:click={() => (open = false)}
				>
					{item.label}
					{#if item.external}
						<svg
							class="ext-icon"
							width="10"
							height="10"
							viewBox="0 0 10 10"
							fill="none"
							aria-hidden="true"
						>
							<path
								d="M5.5 1h3.5v3.5M9 1L4 6M3 3H1.5A.5.5 0 001 3.5v5A.5.5 0 001.5 9h5a.5.5 0 00.5-.5V7"
								stroke="currentColor"
								stroke-width="1.4"
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
	/* ─── Dropdown container ─────────────────────────────────────── */
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
		padding: 0.5rem 0.6rem;
		border-radius: 0.5rem;
		transition:
			color 120ms,
			background-color 120ms;
		white-space: nowrap;
	}

	.trigger.white {
		color: rgba(255, 255, 255, 0.9);
	}

	.trigger:hover,
	.trigger.active {
		background: rgba(0, 0, 0, 0.05);
		color: var(--text);
	}

	.trigger.white:hover,
	.trigger.white.active {
		background: rgba(255, 255, 255, 0.15);
		color: white;
	}

	.trigger {
		position: relative;
	}

	.chevron {
		transition: transform 0.2s ease;
		flex-shrink: 0;
		opacity: 0.6;
	}

	.chevron.rotated {
		transform: rotate(180deg);
	}

	/* ─── Dropdown menu ──────────────────────────────────────────── */
	.menu {
		position: absolute;
		top: 100%; /* no gap — padding-top bridges hover area */
		left: 50%;
		transform: translateX(-50%) translateY(-4px);
		min-width: 13rem;
		padding-top: 0.5rem; /* hover bridge — invisible but keeps mouseenter active */
		z-index: 200;
		opacity: 0;
		visibility: hidden;
		transition:
			opacity 0.16s ease,
			transform 0.16s ease,
			visibility 0.16s;
		pointer-events: none;
	}

	.menu.open {
		opacity: 1;
		visibility: visible;
		transform: translateX(-50%) translateY(0);
		pointer-events: auto;
	}

	/* Arrow tip sits in the padding-top area */
	.menu-arrow {
		width: 10px;
		height: 6px;
		background: #1e1e24;
		clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
		margin: 0 auto 0;
	}

	.menu-inner {
		background: #1e1e24;
		border: 1px solid rgba(255, 255, 255, 0.07);
		border-radius: 0.875rem;
		box-shadow:
			0 4px 6px -1px rgba(0, 0, 0, 0.3),
			0 16px 40px rgba(0, 0, 0, 0.25);
		padding: 0.35rem;
		overflow: hidden;
	}

	/* ─── Menu items ─────────────────────────────────────────────── */
	.menu a {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.55rem 0.8rem;
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 0.88rem;
		color: rgba(255, 255, 255, 0.75);
		text-decoration: none;
		border-radius: 0.5rem;
		transition:
			background-color 0.1s ease,
			color 0.1s ease;
		white-space: nowrap;
	}

	.menu a:hover {
		background-color: rgba(255, 255, 255, 0.08);
		color: white;
	}

	.menu a.active {
		background-color: rgba(255, 148, 22, 0.18);
		color: #ff9416;
	}

	.menu a.muted {
		color: rgba(255, 255, 255, 0.35);
		font-size: 0.8rem;
		font-style: italic;
	}

	.menu a.muted:hover {
		background-color: rgba(255, 255, 255, 0.04);
		color: rgba(255, 255, 255, 0.5);
	}

	.ext-icon {
		opacity: 0.4;
		flex-shrink: 0;
		margin-left: auto;
	}

	@media (min-width: 1024px) {
		.trigger {
			font-size: 1rem;
		}
	}
</style>
