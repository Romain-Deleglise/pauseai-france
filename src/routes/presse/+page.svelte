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
</script>

<svelte:head>
	<title>Espace Presse - Pause IA</title>
	<meta
		name="description"
		content="Espace presse de Pause IA : communiqu\u00e9s de presse, contact m\u00e9dias et ressources pour les journalistes."
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
			<p class="contact-note">R\u00e9serv\u00e9 aux journalistes</p>
			<div class="contact-info">
				<p>
					<strong>Email :</strong>
					<a href="mailto:presse@pauseia.fr">presse@pauseia.fr</a>
				</p>
			</div>
			<p class="redirect">
				Si vous n'\u00eates pas journaliste, nous vous invitons \u00e0
				<a href="/rejoindre">vous rendre sur cette page</a> pour nous contacter.
			</p>
		</div>
	</section>

	<section class="press-releases-section">
		<h2>Nos communiqu\u00e9s de presse</h2>
		<div class="press-releases-list">
			{#each pressReleases as pr (pr.id)}
				<a class="press-release-card" href={pr.url} target="_blank" rel="noopener noreferrer">
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
							Lire le communiqu\u00e9
							<span class="link-icon"><MoveUpRight size="1.25rem" /></span>
						</span>
					</div>
				</a>
			{/each}
		</div>
	</section>
</div>

<style>
	.press-page {
		max-width: 50rem;
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

	.press-releases-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.press-release-card {
		display: flex;
		flex-direction: column;
		padding: 1.5rem;
		background-color: var(--bg-subtle);
		border: 2px solid transparent;
		border-radius: 0.75rem;
		text-decoration: none;
		color: var(--text);
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
		border-top: 1px solid rgba(0, 0, 0, 0.08);
	}

	time {
		font-size: 0.85rem;
		color: var(--text-secondary);
	}

	.read-link {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text);
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
