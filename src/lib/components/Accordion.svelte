<script lang="ts">
	import { slide, fade } from 'svelte/transition'
	import { page } from '$app/stores'
	import Fly from './Fly.svelte'

	export let open = false
	export let id: string

	const details_id = `${id}-details`
	const title_id = `${id}-title`
	const handleClick = () => (open = !open)

	$: if ($page.url.hash === `#${id}`) {
		open = true
	}
</script>

<Fly>
	<div class="accordion" {id}>
		<button on:click={handleClick} class="header" aria-expanded={open} aria-controls={details_id}>
			<h3 class="title" id={title_id}>
				<slot name="head" />
			</h3>

			<span class="icon">{open ? '\u2212' : '+'}</span>
		</button>
		{#if open}
			<div class="details" transition:slide id={details_id} aria-labelledby={title_id}>
				<div transition:fade={{ duration: 500 }}>
					<slot name="details" />
				</div>
			</div>
		{/if}
	</div>
</Fly>

<style>
	:global(div.inView:not(:last-child)) > .accordion {
		border-bottom: solid 2px #e6e6e6;
	}

	.header {
		cursor: pointer;
		display: flex;
		width: 100%;
		border: none;
		background-color: transparent;
		text-align: left;
		align-items: center;
		padding: 1.5rem 0;
	}

	.header .title {
		flex: 1;
	}

	.details {
		padding: 1rem 1.5rem 1.5rem 1.5rem;
		margin: 0.25rem 0.5rem 1rem 0.5rem;
		background-color: white;
		border-radius: 0.75rem;
		box-shadow:
			0 1px 3px rgba(0, 0, 0, 0.08),
			0 4px 12px rgba(0, 0, 0, 0.06);
		text-align: justify;
	}

	.icon {
		font-size: 3rem;
		font-weight: 200;
		line-height: 0;
		margin-left: 1rem;
	}

	h3 {
		margin: 0;
	}
</style>
