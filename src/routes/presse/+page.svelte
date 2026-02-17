<script lang="ts">
	import { MoveUpRight } from 'lucide-svelte'
	import type { PressRelease } from '$lib/notion'

	export let data: { pressReleases: PressRelease[] }

	const fallbackPressReleases: PressRelease[] = [
		{
			id: '1',
			title: 'Forum des solutions pour une IA compatible avec l\u2019humanit\u00e9',
			date: '2024-11-21',
			url: '/pdfs/communique_de_presse_forum_des_solutions.pdf',
			description:
				'Communiqu\u00e9 de presse pour le forum des solutions organis\u00e9 au S\u00e9nat.',
			order: 1,
			visible: true
		}
	]

	$: pressReleases = data.pressReleases.length > 0 ? data.pressReleases : fallbackPressReleases

	function formatDate(dateStr: string): string {
		if (!dateStr) return ''
		const date = new Date(dateStr + 'T00:00:00')
		return date.toLocaleDateString('fr-FR', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		})
	}

	function formatDateShort(dateStr: string): string {
		if (!dateStr) return ''
		const date = new Date(dateStr + 'T00:00:00')
		return date.toLocaleDateString('fr-FR', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		})
	}

	function scrollToCard(id: string) {
		const el = document.getElementById(`pr-${id}`)
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'start' })
		}
	}
</script>

<svelte:head>
	<title>Espace Presse - Pause IA</title>
	<meta
		name="description"
		content="Espace presse de Pause IA : communiqués de presse, contact médias et ressources pour les journalistes."
	/>
</svelte:head>

<div class="press-page">
	<header class="press-header">
		<h1>Espace Presse</h1>
		<p class="subtitle">Ressources et informations pour les journalistes</p>
	</header>

	<section class="contact-section">
		<div class="contact-card">
			<h2>Contact presse</h2>
			<p class="contact-note">Réservé aux journalistes</p>
			<div class="contact-info">
				<p class="contact-name">Maxime Fournes</p>
				<p class="contact-role">Co-fondateur de Pause IA</p>
				<p>
					<strong>Email :</strong>
					<a href="mailto:presse@pauseia.fr">presse@pauseia.fr</a>
				</p>
				<p>
					<strong>Tél. :</strong>
					<a href="tel:+33743155617">07 43 15 56 17</a>
				</p>
			</div>
			<p class="redirect">
				Si vous n'êtes pas journaliste, nous vous invitons à
				<a href="/qui-sommes-nous">vous rendre sur cette page</a> pour nous contacter.
			</p>
		</div>
	</section>

	<section class="press-releases-section">
		<h2>Nos communiqués de presse</h2>

		<div class="press-layout">
			<!-- Sidebar navigation -->
			<nav class="press-sidebar">
				<h3 class="sidebar-title">Accès rapide</h3>
				<ul class="sidebar-list">
					{#each pressReleases as pr (pr.id)}
						<li>
							<button class="sidebar-item" on:click={() => scrollToCard(pr.id)}>
								<span class="sidebar-item-title">{pr.title}</span>
								{#if pr.date}
									<time class="sidebar-item-date" datetime={pr.date}
										>{formatDateShort(pr.date)}</time
									>
								{/if}
							</button>
						</li>
					{/each}
				</ul>
			</nav>

			<!-- Press releases list -->
			<div class="press-releases-list">
				{#each pressReleases as pr (pr.id)}
					<a
						id="pr-{pr.id}"
						class="press-release-card"
						href={pr.url}
						target="_blank"
						rel="noopener noreferrer"
					>
						<div class="pr-content">
							<h3>{pr.title}</h3>
							{#if pr.description}
								<p class="pr-description">{pr.description}</p>
							{/if}
						</div>
						<div class="pr-footer">
							{#if pr.date}
								<time datetime={pr.date}>{formatDate(pr.date)}</time>
							{/if}
							<span class="read-link">
								Lire le communiqué
								<span class="link-icon"><MoveUpRight size="1.25rem" /></span>
							</span>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<section class="about-section">
		<div class="about-card">
			<h2>À propos de Pause IA</h2>
			<p>
				Pause IA est une association de bénévoles qui alerte les citoyens et les pouvoirs publics
				français sur les graves dangers que la course à l'intelligence artificielle fait courir à la
				société humaine, et les incite à agir à leur niveau pour s'y opposer.
			</p>
			<p>
				Pause IA est la représentation en France de Pause AI Global, qui demande un moratoire sur
				l'entraînement des systèmes d'IA générale (IAG) jusqu'à ce que toutes les conditions de
				sécurité et de contrôle démocratique soient réunies.
			</p>
		</div>
	</section>
</div>

<style>
	.press-page {
		max-width: 64rem;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.press-header {
		margin-bottom: 3rem;
	}

	.press-header h1 {
		font-size: 2rem;
		margin-bottom: 0.5rem;
	}

	.subtitle {
		font-size: 1.1rem;
		color: var(--text-secondary);
		margin: 0;
	}

	/* Contact section */
	.contact-section {
		margin-bottom: 3rem;
	}

	.contact-card {
		background-color: var(--bg-subtle);
		border: 2px solid var(--brand);
		border-radius: 0.5rem;
		padding: 1.5rem;
	}

	.contact-card h2 {
		margin-top: 0;
		margin-bottom: 0.25rem;
		font-size: 1.4rem;
	}

	.contact-note {
		font-size: 0.9rem;
		color: var(--text-secondary);
		margin-bottom: 1rem;
		font-style: italic;
	}

	.contact-info {
		margin-bottom: 1rem;
	}

	.contact-info p {
		margin: 0.25rem 0;
	}

	.contact-name {
		font-weight: 700;
		font-size: 1.05rem;
		margin-bottom: 0;
	}

	.contact-role {
		color: var(--text-secondary);
		font-size: 0.9rem;
		margin-bottom: 0.75rem;
	}

	.contact-info a {
		color: var(--brand);
		font-weight: 600;
	}

	.redirect {
		font-size: 0.9rem;
		color: var(--text-secondary);
		margin-bottom: 0;
		padding-top: 1rem;
		border-top: 1px solid rgba(0, 0, 0, 0.08);
	}

	.redirect a {
		color: var(--brand);
	}

	/* Press releases section */
	.press-releases-section h2 {
		margin-top: 0;
		margin-bottom: 2rem;
		font-size: 1.4rem;
	}

	/* Layout with sidebar */
	.press-layout {
		display: flex;
		gap: 2rem;
		align-items: flex-start;
	}

	/* Sidebar */
	.press-sidebar {
		position: sticky;
		top: 1rem;
		flex-shrink: 0;
		width: 16rem;
		max-height: calc(100vh - 2rem);
		overflow-y: auto;
		background-color: var(--bg-subtle);
		border: 1px solid var(--border);
		border-radius: 0.75rem;
		padding: 1.25rem;
	}

	.sidebar-title {
		margin: 0 0 0.75rem;
		font-size: 0.85rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--brand);
	}

	.sidebar-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.sidebar-list li {
		padding: 0;
		margin: 0;
	}

	.sidebar-item {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
		width: 100%;
		padding: 0.5rem 0.625rem;
		border: none;
		background: transparent;
		border-radius: 0.375rem;
		cursor: pointer;
		text-align: left;
		transition: background-color 0.15s ease;
	}

	.sidebar-item:hover {
		background-color: rgba(0, 0, 0, 0.05);
	}

	.sidebar-item-title {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--text);
		line-height: 1.3;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.sidebar-item-date {
		font-size: 0.7rem;
		color: var(--text-secondary);
	}

	/* Press releases list */
	.press-releases-list {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		flex-grow: 1;
		min-width: 0;
	}

	.press-release-card {
		display: flex;
		flex-direction: column;
		padding: 1.5rem;
		background-color: var(--white);
		border: 1px solid var(--border);
		border-radius: 0.75rem;
		text-decoration: none;
		color: var(--text);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease,
			border-color 0.2s ease;
	}

	.press-release-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 20px -6px rgba(0, 0, 0, 0.12);
		border-color: var(--brand);
		color: var(--text);
	}

	.pr-content {
		flex-grow: 1;
	}

	.pr-content h3 {
		margin: 0 0 0.5rem;
		font-size: 1.125rem;
		font-weight: 700;
		line-height: 1.4;
		color: var(--text);
	}

	.pr-description {
		margin: 0;
		font-size: 0.95rem;
		color: var(--text-secondary);
		line-height: 1.5;
	}

	.pr-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--border);
	}

	.press-release-card time {
		font-size: 0.85rem;
		color: var(--text-secondary);
	}

	.read-link {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--brand);
		transition: color 0.2s ease;
	}

	.press-release-card:hover .read-link {
		color: var(--brand);
	}

	.link-icon {
		display: flex;
		align-items: center;
		transition: transform 0.2s ease;
	}

	.press-release-card:hover .link-icon {
		transform: translate(2px, -2px);
	}

	/* About section */
	.about-section {
		margin-top: 3rem;
	}

	.about-card {
		background-color: var(--bg-subtle);
		border-left: 4px solid var(--brand);
		border-radius: 0.5rem;
		padding: 1.5rem 2rem;
	}

	.about-card h2 {
		margin-top: 0;
		margin-bottom: 1rem;
		font-size: 1.3rem;
	}

	.about-card p {
		font-size: 0.95rem;
		line-height: 1.6;
		color: var(--text-secondary);
		margin-bottom: 0.75rem;
	}

	.about-card p:last-child {
		margin-bottom: 0;
	}

	/* Responsive: sidebar hidden on mobile, shown as horizontal scroll */
	@media (max-width: 768px) {
		.press-layout {
			flex-direction: column;
		}

		.press-sidebar {
			position: static;
			width: 100%;
			max-height: 12rem;
			overflow-y: auto;
		}
	}

	@media (min-width: 640px) {
		.press-page {
			padding: 3rem 2rem;
		}

		.press-header h1 {
			font-size: 2.5rem;
		}

		.contact-card {
			padding: 2rem;
		}
	}
</style>
