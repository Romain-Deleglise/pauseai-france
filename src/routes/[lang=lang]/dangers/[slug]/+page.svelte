<script lang="ts">
	import type { PageData } from './$types'
	import PostMeta from '$components/PostMeta.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'

	import { title as siteName } from '$config'

	export let data: PageData

	const { metadata, slug, content } = data
	const { title = slug, date, description, image } = metadata
</script>

<PostMeta title={`${title} | ${siteName}`} {description} {date} {image} />

<hgroup>
	<UnderlinedTitle as="h1">{title}</UnderlinedTitle>
	{#if date}
		<!-- <p>Published at {formatDate(date)}</p> -->
	{/if}
</hgroup>

<div>
	<svelte:component this={content} />
</div>
