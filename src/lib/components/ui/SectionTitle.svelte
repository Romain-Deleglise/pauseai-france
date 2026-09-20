<script lang="ts">
	/** Titre de section : niveau h2 par défaut, pastille de compte optionnelle. */
	export let id: string | undefined = undefined
	export let count: number | string | undefined = undefined
</script>

<h2 {id} class="ui-section-title">
	<slot />
	{#if count !== undefined}<span class="count">{count}</span>{/if}
</h2>

<style>
	.ui-section-title {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		margin: 0 0 1.25rem;
		font-size: clamp(1.4rem, 3vw, 1.75rem);
		line-height: 1.2;
		color: var(--text);
	}

	.count {
		background: var(--brand);
		color: var(--on-brand);
		border-radius: var(--radius-pill);
		padding: 0.15rem 0.6rem;
		font-size: 0.75rem;
		font-weight: 700;
	}
</style>
