<script lang="ts">
	import type { LayoutData } from './$types'
	import { browser } from '$app/environment'

	export let data: LayoutData

	$: if (browser && data?.lang) {
		document.documentElement.lang = data.lang
	}
</script>

<slot />
