<script lang="ts">
	import type { LayoutData } from './$types'

	export let data: LayoutData
</script>

<svelte:head>
	<html lang={data.lang} />
</svelte:head>

<slot />
