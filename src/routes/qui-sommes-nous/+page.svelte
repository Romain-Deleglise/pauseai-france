<script lang="ts">
	import Who from '$components/home/who.svelte'
	import PostMeta from '$components/PostMeta.svelte'
	import type { PageData } from './$types'

	export let data: PageData

	const title = 'Qui sommes-nous ? - Pause IA'
	const description =
		"Découvrez l'équipe de Pause IA France : direction, conseil scientifique et bénévoles engagés pour une gouvernance responsable de l'intelligence artificielle."
</script>

<PostMeta {title} {description} />

<Who teamMembers={data.teamMembers} />
