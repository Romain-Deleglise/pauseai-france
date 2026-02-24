<script lang="ts">
	import NavLink from '$components/Navlink.svelte'
	import NavDropdown from '$components/NavDropdown.svelte'
	import Logo from '$components/Logo.svelte'
	import { page } from '$app/stores'
	import Button from '$components/Button.svelte'
	import Banner from '$components/Banner.svelte'
	import { bannerStore } from '$lib/stores/banner'

	import { onMount } from 'svelte'
	import { fade } from 'svelte/transition'

	$: onHomepage = $page.url.pathname == '/'

	$: onEmploiePage = /^\/emploi-ia(?:\/|$)/.test($page.url.pathname)

	let open = false
	let expandedSection: string | null = null
	// Workaround to trigger transitions on render
	let mounted = false
	onMount(() => {
		mounted = true
	})

	function closeMenu() {
		open = false
		expandedSection = null
	}

	function toggleSection(section: string) {
		expandedSection = expandedSection === section ? null : section
	}

	// Navigation groups — modify here to add/remove pages from the nav
	const navGroups = [
		{
			id: 'comprendre',
			label: 'Comprendre',
			items: [
				{ href: '/dangers', label: "Les dangers de l'IA" },
				{ href: '/faq', label: 'FAQ' },
				{ href: '/videos', label: 'Vidéos' }
			]
		},
		{
			id: 'agir',
			label: 'Agir',
			items: [
				{ href: '/agir', label: 'Comment agir ?' },
				{ href: '/groupes-locaux', label: 'Groupes locaux' }
			]
		},
		{
			id: 'campagnes',
			label: 'Campagnes',
			items: [
				{ href: '/campagnes', label: 'Toutes nos campagnes' },
				{ href: '/sommet-ia-2026', label: 'Sommet IA 2026' },
				{ href: '/municipales-2026', label: 'Municipales 2026' },
				{ href: '/senat2025', label: 'Sénat 2025' }
			]
		},
		{
			id: 'apropos',
			label: 'À propos',
			items: [
				{ href: '/qui-sommes-nous', label: 'Qui sommes-nous ?' },
				{ href: '/propositions', label: 'Nos propositions' },
				{ href: '/presse', label: 'Espace presse' },
				{ href: '/newsletters', label: 'Newsletters' },
				{ href: 'https://pauseia.substack.com/', label: 'Blog', external: true }
			]
		}
	]
</script>

<Banner visible={$bannerStore.visible}>
	{$bannerStore.message}
	{#if $bannerStore.linkUrl}
		<a href={$bannerStore.linkUrl}>{$bannerStore.linkText}</a>
	{/if}
</Banner>

<!-- probably have to change nav colors and classes to respond to banner presence instead of route -->
{#if mounted || !onHomepage}
	<nav in:fade={{ duration: 500, delay: 200 }}>
		<a href={onEmploiePage ? '/emploi-ia' : '/'} class="logo">
			<div class="big-logo">
				<Logo animate fill_pause={onHomepage ? 'white' : 'black'} emploi_ia={onEmploiePage} />
			</div>
			<div class="small-logo">
				<Logo animate only_circle />
			</div>
		</a>

		<div class="nav-right">
			<div class="nav-links">
				{#each navGroups as group}
					<NavDropdown label={group.label} items={group.items} />
				{/each}
				<NavLink href="/dons" c2a>Donner</NavLink>
				<Button href="/rejoindre" alt={onHomepage}>Rejoindre</Button>
			</div>
			<button aria-label="Open mobile menu" class="hamburger" on:click={() => (open = !open)}>
				<svg
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<rect y="0" height="3" width="24" fill={onHomepage ? 'white' : 'black'} />
					<rect y="10.5" height="3" width="24" fill={onHomepage ? 'white' : 'black'} />
					<rect y="21" height="3" width="24" fill={onHomepage ? 'white' : 'black'} />
				</svg>
			</button>
		</div>

		<!-- Mobile/tablet sidebar -->
		<div class="sidebar" class:open>
			<div class="sidebar-head">
				<a href="/" class="logo" on:click={closeMenu}>
					<Logo animate={onHomepage} fill_circle="white" fill_ai="white" />
				</a>
				<button aria-label="Close mobile menu" class="hamburger" on:click={closeMenu}>
					<svg
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<rect
							y="2.21387"
							width="3.13043"
							height="30.8142"
							transform="rotate(-45 0 2.21387)"
							fill="black"
						/>
						<rect
							x="21.7891"
							y="0.000244141"
							width="3.13043"
							height="30.8142"
							transform="rotate(45 21.7891 0.000244141)"
							fill="black"
						/>
					</svg>
				</button>
			</div>

			<div class="sidebar-links">
				<a href="/qui-sommes-nous" on:click={() => (open = !open)}><h2>A propos</h2></a>
				<a href="/dangers" on:click={() => (open = !open)}><h2>Dangers</h2></a>
				<a href="/propositions" on:click={() => (open = !open)}><h2>Propositions</h2></a>
				<a href="/agir" on:click={() => (open = !open)}><h2>Agir</h2></a>
				<a href="/campagnes" on:click={() => (open = !open)}><h2>Campagnes</h2></a>
				<a href="/groupes-locaux" on:click={() => (open = !open)}><h2>Groupes locaux</h2></a>
				<a href="/dons" on:click={() => (open = !open)}><h2>Dons</h2></a>
				<a href="/rejoindre" on:click={() => (open = !open)}><h2>Nous rejoindre</h2></a>
			</div>
		</div>
	</nav>
{/if}

<style>
	.sidebar {
		position: fixed;
		height: 100%;
		width: 100%;
		background: #ff9416;
		top: 0;
		left: 100%;
		transition: left 0.3s ease-in-out;
		z-index: 1000;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
	}

	/* Sidebar sections */
	.sidebar-links {
		display: flex;
		flex-direction: column;
	}

	.sidebar-section {
		border-bottom: 1px solid rgba(0, 0, 0, 0.1);
	}

	.sidebar-section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		cursor: pointer;
		padding: 0.25rem 0;
		user-select: none;
	}

	.sidebar-section-header:hover {
		opacity: 0.8;
	}

	.sidebar-section-header h2 {
		margin: 0;
	}

	.section-chevron {
		transition: transform 0.2s ease;
		flex-shrink: 0;
		opacity: 0.7;
	}

	.section-chevron.rotated {
		transform: rotate(180deg);
	}

	.sidebar-subsection {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		padding: 0.25rem 0 0.75rem 1rem;
	}

	.sidebar-subsection a {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		text-decoration: none;
		font-size: 1.1rem;
		font-family: var(--font-heading);
		font-weight: 500;
		color: rgba(0, 0, 0, 0.8);
		padding: 0.35rem 0;
		transition: color 0.15s;
	}

	.sidebar-subsection a:hover {
		color: black;
	}

	.ext-icon {
		opacity: 0.5;
		flex-shrink: 0;
	}

	.sidebar-divider {
		height: 1px;
		background: rgba(0, 0, 0, 0.15);
		margin: 1.25rem 0 1rem;
	}

	.sidebar-cta {
		display: block;
		text-decoration: none;
		font-size: 1.5rem;
		font-family: var(--font-heading);
		font-weight: 700;
		padding: 0.25rem 0;
		margin-bottom: 1rem;
		color: black;
		transition: opacity 0.15s;
	}

	.sidebar-cta:hover {
		opacity: 0.7;
	}

	.sidebar-join {
		display: block;
		text-decoration: none;
		background: black;
		color: white;
		text-align: center;
		padding: 0.75rem 1.5rem;
		border-radius: 0.5rem;
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 1.25rem;
		transition: opacity 0.15s;
	}

	.sidebar-join:hover {
		opacity: 0.85;
	}

	.sidebar-head {
		display: flex;
		justify-content: space-between;
		margin-bottom: 2rem;
	}

	.sidebar-links h2 {
		font-size: 1.5rem;
		margin-bottom: 0;
		margin-top: 0;
		padding: 0.5rem 0;
	}

	.open {
		left: 0;
	}

	nav {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		z-index: 2;
	}

	nav,
	.sidebar {
		padding: 1rem;
	}

	.nav-right {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.nav-links {
		display: none;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}

	.hamburger {
		display: flex;
		align-items: center;
		cursor: pointer;
	}

	.logo {
		line-height: 0;
	}

	.small-logo {
		display: block;
	}

	.small-logo :global(svg) {
		width: 3rem;
	}

	.big-logo {
		display: none;
	}

	@media (min-width: 480px) {
		.big-logo {
			display: block;
		}

		.small-logo {
			display: none;
		}
	}

	@media (min-width: 640px) {
		nav,
		.sidebar {
			padding: 2rem 2rem;
		}
	}
	@media (min-width: 768px) {
		nav,
		.sidebar {
			padding: 2rem 4rem;
		}
	}

	@media (min-width: 1024px) {
		nav {
			flex-direction: row;
			align-items: center;
		}

		.nav-links {
			display: flex;
		}

		.hamburger,
		.sidebar {
			display: none;
		}
		nav {
			padding: 2rem 6rem;
		}
		.nav-links {
			gap: 1.3rem;
		}
	}

	@media (min-width: 1280px) {
		.big-logo {
			display: block;
		}

		.small-logo {
			display: none;
		}

		.nav-links {
			gap: 2rem;
		}
	}
</style>
