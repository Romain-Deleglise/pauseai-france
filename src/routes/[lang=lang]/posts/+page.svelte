<script lang="ts">
	import { getT } from '$lib/i18n'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import type { PageData } from './$types'

	export let data: PageData

	$: lang = data.lang
	$: t = getT(lang)
	$: prefix = `/${lang}`
	$: posts = data.posts
</script>

<svelte:head>
	<title>{t.posts.meta_title}</title>
</svelte:head>

<section>
	<UnderlinedTitle as="h1">{t.posts.title}</UnderlinedTitle>
	<ul class="posts">
		{#each posts as { slug, title, description }}
			<li class="post">
				<a href="{prefix}/{slug}" class="title">{title}</a>
				{#if description}
					<p class="description">{description}</p>
				{/if}
			</li>
		{/each}
	</ul>
</section>

<style>
	.posts {
		display: grid;
		gap: 1rem;
	}

	.title {
		color: var(--text);
		font-family: var(--font-heading);
		font-weight: bold;
		text-decoration: none;
		font-size: 1.3rem;
		text-transform: capitalize;
	}

	.title:hover {
		text-decoration: underline;
	}

	.description {
		margin-top: 0.5rem;
	}
</style>
