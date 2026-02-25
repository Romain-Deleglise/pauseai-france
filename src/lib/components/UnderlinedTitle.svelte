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
		position: relative;
		padding-left: 1rem;
	}

	/* Vertical accent bar on the left */
	h1::before,
	h2::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.1em;
		bottom: 0.1em;
		width: 4px;
		background: var(--underline-color);
		border-radius: 2px;
	}

	/* Refined text underline */
	h1 span,
	h2 span {
		text-decoration: underline;
		text-decoration-color: var(--underline-color);
		text-decoration-thickness: 3px;
		text-underline-offset: 5px;
	}

	@media (min-width: 640px) {
		h1,
		h2 {
			padding-left: 1.25rem;
			margin-bottom: 4rem;
		}

		h1::before,
		h2::before {
			width: 5px;
		}

		h1 span,
		h2 span {
			text-decoration-thickness: 4px;
			text-underline-offset: 7px;
		}
	}
</style>
