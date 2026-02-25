<script lang="ts">
	export let id = ''
	export let as = 'h2'
	export let underlineColor = 'var(--brand)'
</script>

{#if as === 'h1'}
	<h1 {id} style={`--underline-color: ${underlineColor}`}>
		<span>
			<slot />
		</span>
	</h1>
{:else if as === 'h2'}
	<h2 {id} style={`--underline-color: ${underlineColor}`}>
		<span>
			<slot />
		</span>
	</h2>
{/if}

<style>
	h1,
	h2 {
		margin-top: 0;
		margin-bottom: 2rem;
		padding-bottom: 1.25rem;
		position: relative;
	}

	/* Full-width gradient line fading left-to-right */
	h1::after,
	h2::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: linear-gradient(to right, var(--underline-color) 0%, transparent 75%);
		border-radius: 2px;
	}

	@media (min-width: 640px) {
		h1,
		h2 {
			margin-bottom: 4rem;
			padding-bottom: 1.5rem;
		}

		h1::after,
		h2::after {
			height: 5px;
		}
	}
</style>
