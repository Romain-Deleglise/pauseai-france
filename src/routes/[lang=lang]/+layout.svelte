<script lang="ts">
	import { page } from '$app/stores'
	import { fade } from 'svelte/transition'
	import { Toaster } from 'svelte-french-toast'
	import { ProgressBar } from '@prgm/sveltekit-progress-bar'

	import Footer from '$components/Footer.svelte'
	import Header from '$components/Header.svelte'
	import { bannerStore } from '$lib/stores/banner'
	import { onMount } from 'svelte'
	import type { LayoutData } from './$types'

	import '@fontsource/ibm-plex-sans/200.css'
	import '@fontsource/ibm-plex-sans/400.css'
	import '@fontsource/ibm-plex-sans/500.css'
	import '@fontsource/ibm-plex-sans/700.css'

	import '../../reset.css'
	import '../../app.css'

	export let data: LayoutData

	$: lang = data.lang
	$: bgWhite = $page.url.pathname === `/${lang}` || $page.url.pathname === `/${lang}/`

	onMount(async () => {
		try {
			const res = await fetch('/api/banner')
			if (res.ok) {
				const banner = await res.json()
				if (banner) {
					bannerStore.set(banner)
				}
			}
		} catch {
			// Silently fall back to default banner
		}
	})
</script>

<svelte:head>
	<html {lang} />
</svelte:head>

<h2 style="width: 0; height: 0; margin: 0; padding: 0; visibility: hidden;">(Top)</h2>

<div class="layout" class:bgWhite>
	<Header {lang} />

	{#key $page.url.pathname}
		<main in:fade>
			<slot />
		</main>
	{/key}

	<Footer {lang} />
</div>

<Toaster
	toastOptions={{
		style: 'background-color: var(--bg-subtle); color: var(--text)',
		iconTheme: {
			primary: 'var(--brand)',
			secondary: 'white'
		}
	}}
/>

<ProgressBar color="var(--brand)" />

<style>
	.layout {
		max-inline-size: var(--page-width);
		display: grid;
		grid-template-rows: auto 1fr auto;
		grid-auto-columns: 100%;
		background-color: var(--bg-subtle);
	}

	.layout.bgWhite {
		background-color: var(--bg);
	}

	main {
		padding: 1rem;
		display: flex;
		flex-direction: column;
	}

	@media (min-width: 640px) {
		main {
			padding: 0rem 2rem 7.5rem 2rem;
		}
	}

	@media (min-width: 768px) {
		main {
			padding: 0rem 4rem 7.5rem 4rem;
		}
	}
	@media (min-width: 1024px) {
		main {
			padding: 0rem 6rem 7.5rem 6rem;
		}
	}
</style>
