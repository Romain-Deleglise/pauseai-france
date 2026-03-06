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
	$: activeCount = sortedCampaigns.filter((c) => c.status === 'active').length

	const MONTHS_FR = [
		'jan.',
		'fév.',
		'mars',
		'avr.',
		'mai',
		'juin',
		'juil.',
		'août',
		'sept.',
		'oct.',
		'nov.',
		'déc.'
	]
	const MONTHS_EN = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	]

	function formatDate(yyyymm: string): string {
		const [year, month] = yyyymm.split('-')
		const m = parseInt(month, 10) - 1
		const months = isEn ? MONTHS_EN : MONTHS_FR
		return `${months[m]} ${year}`
	}
</script>

<PostMeta title={t.campagnes.meta_title} description={t.campagnes.meta_desc} />

<article>
	<section class="hero">
		<UnderlinedTitle as="h1">{t.campagnes.title}</UnderlinedTitle>
		<p class="intro">{t.campagnes.subtitle}</p>
		<p class="active-count">
			{activeCount}
			{activeCount === 1 ? t.campagnes.active_count_singular : t.campagnes.active_count_plural}
		</p>
	</section>

	<section class="campaigns-list">
		{#each sortedCampaigns as campaign}
			{@const content = isEn ? campaign.en : campaign.fr}
			{@const href = campaign.url ?? `${prefix}/${campaign.slug}`}
			<div class="campaign-card" class:ended={campaign.status === 'ended'}>
				<div class="card-top">
					<div class="card-badge" class:badge-ended={campaign.status === 'ended'}>
						{campaign.status === 'active' ? t.campagnes.badge_active : t.campagnes.badge_ended}
					</div>
					<span class="card-date">
						{#if campaign.endDate}
							{formatDate(campaign.startDate)} – {formatDate(campaign.endDate)}
						{:else}
							{t.campagnes.since} {formatDate(campaign.startDate)}
						{/if}
					</span>
				</div>
				<h2>{content.title}</h2>
				<p>{content.description}</p>
				{#if campaign.status === 'active'}
					<Button {href}>{content.cta}</Button>
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
		margin-bottom: 2rem;
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
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease,
			border-color 0.2s ease;
	}

	.campaign-card:hover {
		transform: translateY(-3px);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
		border-color: #d0d0d0;
	}

	.campaign-card.ended {
		opacity: 0.75;
		cursor: default;
	}

	.campaign-card.ended:hover {
		transform: none;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
		border-color: #eee;
	}

	.active-count {
		font-size: 1rem;
		font-weight: 600;
		color: #2e7d32;
		background: #e8f5e9;
		display: inline-block;
		padding: 0.3rem 0.8rem;
		border-radius: 999px;
		margin-top: 0.5rem;
	}

	.card-top {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.card-date {
		font-size: 0.85rem;
		color: #999;
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

	@media (max-width: 600px) {
		h2 {
			font-size: 1.4rem;
		}

		.campaign-card {
			padding: 1.5rem;
		}
	}
</style>
