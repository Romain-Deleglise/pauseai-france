<script lang="ts">
	import Who from '$components/home/who.svelte'
	import type { PageData } from './$types'

	export let data: PageData

	const title = 'Qui sommes-nous ? - Pause IA'
	const description =
		"Découvrez l'équipe de Pause IA France : direction, conseil scientifique et bénévoles engagés pour une gouvernance responsable de l'intelligence artificielle."
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
</svelte:head>

<Who teamMembers={data.teamMembers} />
