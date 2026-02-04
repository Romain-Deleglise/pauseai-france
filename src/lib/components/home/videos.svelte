<script lang="ts">
	import Button from '$components/Button.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import YouTubeEmbed from '$components/YouTubeEmbed.svelte'
	import type { Video } from '$lib/notion'

	export let videos: Video[] = []

	const label_id = 'videos-title'

	// Fallback videos if Notion data is not available
	const fallbackVideos: Video[] = [
		{ id: '1', title: 'Vidéo 1', youtubeId: '9tpzIk5Polo', order: 1, visible: true },
		{ id: '2', title: 'Vidéo 2', youtubeId: 'NRa2MC974tc', order: 2, visible: true },
		{ id: '3', title: 'Vidéo 3', youtubeId: 'XQv_3gO7Zxo', order: 3, visible: true }
	]

	$: displayVideos = videos.length > 0 ? videos : fallbackVideos
</script>

<section aria-labelledby={label_id}>
	<UnderlinedTitle id={label_id}>Nos vidéos</UnderlinedTitle>
	<div class="video-grid">
		{#each displayVideos as video (video.id)}
			<YouTubeEmbed id={video.youtubeId} />
		{/each}
	</div>
	<Button href="https://www.youtube.com/@Pause_IA">Voir plus de vidéos</Button>
</section>

<style>
	.video-grid {
		display: grid;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.video-grid :global(iframe) {
		aspect-ratio: 16 / 9;
		width: 100%;
		height: unset;
	}

	@media (min-width: 768px) {
		.video-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (min-width: 1280px) {
		.video-grid {
			grid-template-columns: 1fr 1fr 1fr;
		}
	}
</style>
