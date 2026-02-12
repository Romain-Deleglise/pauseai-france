<script lang="ts">
	import { X, Megaphone } from 'lucide-svelte'
	import { slide } from 'svelte/transition'
	export let visible = true // Initially, the banner is visible
</script>

{#if visible}
	<div class="banner" transition:slide={{ duration: 300 }}>
		<div class="banner-content">
			<span class="banner-icon">
				<Megaphone size={18} strokeWidth={2.5} />
			</span>
			<div class="banner-message"><slot /></div>
		</div>
		<button class="close-btn" on:click={() => (visible = false)} aria-label="Fermer le bandeau">
			<X size={20} />
		</button>
	</div>
{/if}

<style>
	.banner {
		background: linear-gradient(135deg, var(--brand) 0%, #ffb347 100%);
		color: var(--black);
		font-family: var(--font-heading);
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.625rem 1rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.banner-content {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-grow: 1;
		gap: 0.75rem;
		font-size: 0.95rem;
		font-weight: 500;
	}

	.banner-icon {
		display: flex;
		align-items: center;
		flex-shrink: 0;
	}

	.banner-message {
		text-align: center;
	}

	:global(.banner a) {
		font-weight: 700;
		text-decoration: underline;
		text-underline-offset: 2px;
		transition: opacity 0.2s ease;
	}

	:global(.banner a:hover) {
		opacity: 0.8;
	}

	.close-btn {
		display: flex;
		justify-content: center;
		align-items: center;
		color: var(--black);
		cursor: pointer;
		border-radius: 50%;
		transition: background-color 0.2s ease;
		flex-shrink: 0;

		/* Appropriate tap targets */
		height: 36px;
		min-width: 36px;
	}

	.close-btn:hover {
		background-color: rgba(0, 0, 0, 0.1);
	}

	@media (max-width: 640px) {
		.banner-content {
			font-size: 0.875rem;
		}

		.banner-icon {
			display: none;
		}
	}
</style>
