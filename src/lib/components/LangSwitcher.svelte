<script lang="ts">
	import { locale, t } from '$lib/i18n'

	export let onHero = false
	export let inSidebar = false
</script>

{#if inSidebar}
	<button
		class="sidebar-lang-btn"
		on:click={() => locale.toggle()}
		aria-label={$t.nav.langue}
		title={$t.nav.langue}
	>
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
		>
			<circle cx="12" cy="12" r="10" />
			<line x1="2" y1="12" x2="22" y2="12" />
			<path
				d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
			/>
		</svg>
		{$locale === 'fr' ? 'English' : 'Français'}
	</button>
{:else}
	<button
		class="lang-btn"
		class:on-hero={onHero}
		on:click={() => locale.toggle()}
		aria-label={$t.nav.langue}
		title={$t.nav.langue}
	>
		{$locale === 'fr' ? 'EN' : 'FR'}
	</button>
{/if}

<style>
	/* ─── Desktop language button ─────────────────────────── */
	.lang-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 2rem;
		padding: 0 0.55rem;
		border-radius: 0.4rem;
		border: 1.5px solid rgba(0, 0, 0, 0.2);
		background: transparent;
		color: black;
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 0.8rem;
		letter-spacing: 0.04em;
		cursor: pointer;
		transition:
			background 0.15s,
			border-color 0.15s,
			color 0.15s;
	}

	.lang-btn:hover {
		background: rgba(0, 0, 0, 0.06);
		border-color: rgba(0, 0, 0, 0.35);
	}

	.lang-btn.on-hero {
		color: white;
		border-color: rgba(255, 255, 255, 0.45);
	}

	.lang-btn.on-hero:hover {
		background: rgba(255, 255, 255, 0.15);
		border-color: rgba(255, 255, 255, 0.7);
	}

	:global([data-theme='dark']) .lang-btn {
		color: var(--text);
		border-color: rgba(255, 255, 255, 0.2);
	}

	:global([data-theme='dark']) .lang-btn:hover {
		background: rgba(255, 255, 255, 0.08);
		border-color: rgba(255, 255, 255, 0.4);
	}

	/* ─── Sidebar language button ─────────────────────────── */
	.sidebar-lang-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
		padding: 0.55rem 0.6rem;
		border: none;
		border-radius: 0.45rem;
		background: rgba(0, 0, 0, 0.05);
		color: rgba(0, 0, 0, 0.78);
		font-size: 0.95rem;
		font-family: var(--font-heading);
		font-weight: 600;
		cursor: pointer;
		transition: background 0.1s;
	}

	.sidebar-lang-btn:hover {
		background: rgba(255, 148, 22, 0.1);
		color: var(--brand);
	}

	:global([data-theme='dark']) .sidebar-lang-btn {
		background: rgba(255, 255, 255, 0.07);
		color: var(--text);
	}

	:global([data-theme='dark']) .sidebar-lang-btn:hover {
		background: rgba(255, 148, 22, 0.15);
		color: var(--brand);
	}
</style>
