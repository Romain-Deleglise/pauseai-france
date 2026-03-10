<script lang="ts">
	// import { formatDate } from '$lib/utils'
	import PostMeta from '$components/PostMeta.svelte'

	const title = 'Articles'
	const description =
		"Tous les articles et actualités de Pause IA sur l'intelligence artificielle et sa sécurité."

	export let data
	const { posts } = data
</script>

<PostMeta {title} {description} />

<section>
	<ul class="posts">
		{#each posts as { slug, title, description, date }}
			<li class="post">
				<a href={slug} class="title">{title}</a>
				<!-- <p class="date">{formatDate(date)}</p> -->
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

	/* .date {
		color: var(--text-2);
	} */

	.description {
		margin-top: var(--size-3);
	}
</style>
