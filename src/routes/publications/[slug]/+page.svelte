<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import { ArrowLeft, ExternalLink, Calendar } from 'lucide-svelte'
	import type { PageData } from './$types'

	export let data: PageData

	function formatDate(dateStr: string): string {
		if (!dateStr) return ''
		try {
			const d = new Date(dateStr)
			return d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
		} catch {
			return dateStr
		}
	}
</script>

<PostMeta title={data.newsletter.title} description={data.newsletter.description} />

<div class="page">
	<nav class="breadcrumb">
		<a href="/publications" class="back-link">
			<ArrowLeft size="1rem" />
			Toutes les newsletters
		</a>
	</nav>

	<header class="newsletter-header">
		<h1>{data.newsletter.title}</h1>
		<div class="newsletter-meta">
			{#if data.newsletter.date}
				<span class="date">
					<Calendar size="1rem" />
					{formatDate(data.newsletter.date)}
				</span>
			{/if}
			<a href={data.newsletter.url} target="_blank" rel="noopener noreferrer" class="original-link">
				<ExternalLink size="0.875rem" />
				Voir l'original
			</a>
		</div>
	</header>

	<article class="newsletter-content">
		{#if data.hasContent}
			{@html data.content}
		{:else}
			<iframe
				src={data.newsletter.url}
				title={data.newsletter.title}
				class="newsletter-iframe"
				sandbox="allow-same-origin"
			/>
		{/if}
	</article>

	<footer class="newsletter-footer">
		<a href="/publications" class="back-link">
			<ArrowLeft size="1rem" />
			Retour aux newsletters
		</a>
	</footer>
</div>

<style>
	.page {
		max-width: 52rem;
		margin: 0 auto;
		padding: 2rem 1rem 4rem;
	}

	.breadcrumb {
		margin-bottom: 2rem;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		color: var(--text-secondary, #676e7a);
		text-decoration: none;
		font-size: 0.9375rem;
		transition: color 0.2s;
	}

	.back-link:hover {
		color: var(--brand, #ff9416);
	}

	.newsletter-header {
		margin-bottom: 2.5rem;
		padding-bottom: 1.5rem;
		border-bottom: 2px solid var(--border, #e5e7eb);
	}

	.newsletter-header h1 {
		font-size: 2rem;
		font-weight: 800;
		line-height: 1.3;
		margin: 0 0 1rem;
	}

	.newsletter-meta {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		flex-wrap: wrap;
	}

	.date {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		color: var(--text-secondary, #676e7a);
		font-size: 0.9375rem;
	}

	.original-link {
		display: inline-flex;
		align-items: center;
		gap: 0.375rem;
		color: var(--text-secondary, #676e7a);
		text-decoration: none;
		font-size: 0.875rem;
		transition: color 0.2s;
	}

	.original-link:hover {
		color: var(--brand, #ff9416);
	}

	/* Newsletter content container - isolate CiviCRM styles */
	.newsletter-content {
		overflow-x: auto;
		line-height: 1.7;
	}

	/* Override CiviCRM table-based layout to be responsive */
	.newsletter-content :global(table) {
		max-width: 100% !important;
		width: 100% !important;
		height: auto !important;
	}

	.newsletter-content :global(td),
	.newsletter-content :global(th) {
		max-width: 100%;
		word-wrap: break-word;
		overflow-wrap: break-word;
	}

	.newsletter-content :global(img) {
		max-width: 100%;
		height: auto !important;
	}

	/* Ensure links in newsletter content are visible */
	.newsletter-content :global(a) {
		color: var(--brand, #ff9416);
		text-decoration: underline;
	}

	.newsletter-content :global(a:hover) {
		opacity: 0.8;
	}

	.newsletter-iframe {
		width: 100%;
		min-height: 80vh;
		border: 1px solid var(--border, #e5e7eb);
		border-radius: 0.5rem;
	}

	.newsletter-footer {
		margin-top: 3rem;
		padding-top: 2rem;
		border-top: 2px solid var(--border, #e5e7eb);
	}

	@media (min-width: 640px) {
		.page {
			padding: 3rem 2rem 6rem;
		}

		.newsletter-header h1 {
			font-size: 2.5rem;
		}
	}
</style>
