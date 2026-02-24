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
		padding: 1.5rem 0.75rem;
		border-radius: 0.5rem;
		transition: background-color 0.2s ease;
	}

	.header:hover {
		background-color: var(--brand-light, #fff5e8);
	}

	.header .title {
		flex: 1;
	}

	.details {
		padding: 1rem 1.25rem 1.5rem 1.25rem;
		margin: 0 0.25rem 0.75rem 0.25rem;
		background-color: var(--brand-light, #fff5e8);
		border-radius: 0.5rem;
		border-left: 3px solid var(--brand, #ff9416);
		text-align: justify;
	}

	.icon {
		font-size: 2.5rem;
		font-weight: 300;
		line-height: 0;
		margin-left: 1rem;
		color: var(--brand, #ff9416);
		transition: transform 0.3s ease;
	}

	.header[aria-expanded='true'] .icon {
		transform: rotate(90deg);
	}

	h3 {
		margin: 0;
	}
</style>
