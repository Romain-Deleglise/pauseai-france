<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import Button from '$lib/components/Button.svelte'
	import { getT } from '$lib/i18n'
	import { getSortedCampaigns } from '$lib/campaigns'
	import type { PageData } from './$types'

	export let data: PageData

	$: t = getT(data.lang)
	$: isEn = data.lang === 'en'
	$: prefix = isEn ? '/en' : '/fr'
	$: sortedCampaigns = getSortedCampaigns()
</script>

<PostMeta title={t.campagnes.meta_title} description={t.campagnes.meta_desc} />

<article>
	<section class="hero">
		<UnderlinedTitle as="h1">{t.campagnes.title}</UnderlinedTitle>
		<p class="intro">{t.campagnes.subtitle}</p>
	</section>

	<section class="campaigns-list">
		{#each sortedCampaigns as campaign}
			{@const content = isEn ? campaign.en : campaign.fr}
			<div class="campaign-card" class:ended={campaign.status === 'ended'}>
				<div class="card-badge" class:badge-ended={campaign.status === 'ended'}>
					{campaign.status === 'active' ? t.campagnes.badge_active : t.campagnes.badge_ended}
				</div>
				<h2>{content.title}</h2>
				<p>{content.description}</p>
				{#if campaign.status === 'active'}
					<Button href="{prefix}/{campaign.slug}">{content.cta}</Button>
				{:else}
					<a class="archive-link" href="{prefix}/{campaign.slug}">{t.campagnes.see_archive} →</a>
				{/if}
			</div>
		{/each}
	</section>
</article>

<style>
	article {
		max-inline-size: 60rem;
		margin-inline: auto;
		margin-top: 3rem;
		padding: 0 2rem;
	}

	.hero {
		text-align: left;
		margin-bottom: 4rem;
	}

	.intro {
		font-size: 1.25rem;
		line-height: 1.6;
		color: var(--text-muted, #444);
	}

	.campaigns-list {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		margin-bottom: 5rem;
	}

	.campaign-card {
		background: #fafafa;
		border-radius: 16px;
		padding: 2.5rem 2rem;
		border: 1px solid #eee;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	.campaign-card.ended {
		opacity: 0.65;
	}

	.card-badge {
		display: inline-block;
		background: #e8f5e9;
		color: #2e7d32;
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
		margin-bottom: 1rem;
	}

	.card-badge.badge-ended {
		background: #f5f5f5;
		color: #888;
	}

	h2 {
		font-size: 1.75rem;
		margin-top: 0;
		margin-bottom: 1rem;
		color: var(--text-heading, #222);
	}

	.campaign-card p {
		font-size: 1.05rem;
		line-height: 1.7;
		color: var(--text-muted, #444);
		margin-bottom: 1.5rem;
	}

	.archive-link {
		font-size: 0.95rem;
		color: #888;
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.archive-link:hover {
		color: #555;
	}

	@media (max-width: 600px) {
		h2 {
			font-size: 1.4rem;
		}

		.campaign-card {
			padding: 1.5rem;
		}
	}
</style>
