<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import Button from '$lib/components/Button.svelte'
	import { getT } from '$lib/i18n'
	import { getSortedCampaigns } from '$lib/campaigns'
	import type { Campaign } from '$lib/campaigns'
	import { fade } from 'svelte/transition'
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

	let selectedCampaign: Campaign | null = null

	function openSummary(campaign: Campaign) {
		if (campaign.status === 'ended' && campaign.summary) {
			selectedCampaign = campaign
		}
	}

	function closeSummary() {
		selectedCampaign = null
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') closeSummary()
	}
</script>

<svelte:window on:keydown={handleKeydown} />

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
			{@const hasSummary = campaign.status === 'ended' && campaign.summary}
			<div
				class="campaign-card"
				class:ended={campaign.status === 'ended'}
				class:clickable={hasSummary}
				role={hasSummary ? 'button' : undefined}
				tabindex={hasSummary ? 0 : undefined}
				on:click={() => hasSummary && openSummary(campaign)}
				on:keydown={(e) => e.key === 'Enter' && hasSummary && openSummary(campaign)}
			>
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
				{:else if hasSummary}
					<span class="see-results">{isEn ? 'View results' : 'Voir le bilan'} →</span>
				{/if}
			</div>
		{/each}
	</section>
</article>

{#if selectedCampaign?.summary}
	{@const summary = isEn ? selectedCampaign.summary.en : selectedCampaign.summary.fr}
	{@const content = isEn ? selectedCampaign.en : selectedCampaign.fr}
	<div
		class="modal-overlay"
		role="presentation"
		on:click={closeSummary}
		transition:fade={{ duration: 150 }}
	>
		<div
			class="modal"
			role="dialog"
			aria-modal="true"
			aria-label={isEn ? 'Campaign results' : 'Bilan de la campagne'}
			on:click|stopPropagation
		>
			<button class="modal-close" on:click={closeSummary} aria-label={isEn ? 'Close' : 'Fermer'}
				>&times;</button
			>

			<div class="modal-header">
				<div class="card-badge badge-ended">
					{t.campagnes.badge_ended}
				</div>
				<h2>{content.title}</h2>
				{#if selectedCampaign.startDate}
					<p class="modal-dates">
						{formatDate(
							selectedCampaign.startDate
						)}{#if selectedCampaign.endDate && selectedCampaign.endDate !== selectedCampaign.startDate}
							– {formatDate(selectedCampaign.endDate)}{/if}
					</p>
				{/if}
			</div>

			<p class="modal-text">{summary.text}</p>

			{#if summary.results.length > 0}
				<div class="results-grid">
					{#each summary.results as result}
						<div class="result-card">
							<span class="result-value">{result.value}</span>
							<span class="result-label">{result.label}</span>
						</div>
					{/each}
				</div>
			{/if}

			{#if summary.link}
				<a
					href={summary.link.url}
					target={summary.link.url.startsWith('http') ? '_blank' : undefined}
					rel="noopener noreferrer"
					class="modal-link-btn"
				>
					{summary.link.label} ↗
				</a>
			{/if}
		</div>
	</div>
{/if}

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

	.campaign-card.clickable {
		cursor: pointer;
	}

	.campaign-card.clickable:hover {
		opacity: 1;
		transform: translateY(-2px);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
		border-color: color-mix(in srgb, var(--brand) 30%, transparent);
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

	.see-results {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--brand);
		margin-top: auto;
	}

	/* Modal */
	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 2000;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		backdrop-filter: blur(3px);
	}

	.modal {
		background: var(--bg, #fff);
		border-radius: 1rem;
		padding: 2.5rem;
		max-width: 36rem;
		width: 100%;
		max-height: 90dvh;
		overflow-y: auto;
		position: relative;
		box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
	}

	.modal-close {
		position: absolute;
		top: 1rem;
		right: 1rem;
		font-size: 1.75rem;
		line-height: 1;
		color: var(--text-secondary, #666);
		cursor: pointer;
		padding: 0.25rem 0.5rem;
		border-radius: 0.5rem;
		transition: background 0.15s;
	}

	.modal-close:hover {
		background: var(--bg-subtle, #f5f5f5);
	}

	.modal-header {
		margin-bottom: 1.5rem;
	}

	.modal-header h2 {
		font-size: 1.5rem;
		margin-top: 0.75rem;
		margin-bottom: 0.25rem;
	}

	.modal-dates {
		font-size: 0.9rem;
		color: #999;
		margin: 0;
	}

	.modal-text {
		font-size: 1rem;
		line-height: 1.6;
		margin-bottom: 1.5rem;
		color: var(--text, #222);
	}

	.results-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.75rem;
	}

	.result-card {
		background: var(--bg-subtle, #f5f5f5);
		border-radius: 0.75rem;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.result-value {
		font-weight: 700;
		font-size: 1rem;
		color: var(--text, #222);
	}

	.result-label {
		font-size: 0.8rem;
		color: var(--text-secondary, #666);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.modal-link-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		margin-top: 1.5rem;
		padding: 0.55rem 1.1rem;
		border-radius: 999px;
		font-size: 0.9rem;
		font-weight: 600;
		text-decoration: none;
		background: color-mix(in srgb, var(--brand) 12%, var(--bg, #fff));
		color: var(--brand);
		border: 1.5px solid color-mix(in srgb, var(--brand) 35%, transparent);
		transition:
			background 0.15s,
			border-color 0.15s;
	}

	.modal-link-btn:hover {
		background: color-mix(in srgb, var(--brand) 20%, var(--bg, #fff));
		border-color: color-mix(in srgb, var(--brand) 55%, transparent);
	}

	@media (max-width: 600px) {
		h2 {
			font-size: 1.4rem;
		}

		.campaign-card {
			padding: 1.5rem;
		}

		.modal-overlay {
			align-items: flex-end;
			padding: 0;
		}

		.modal {
			width: 100%;
			max-width: 100%;
			max-height: 88dvh;
			border-radius: 1.25rem 1.25rem 0 0;
			padding: 1.25rem 1.25rem calc(1.25rem + env(safe-area-inset-bottom));
		}

		.modal::before {
			content: '';
			display: block;
			width: 2.5rem;
			height: 0.25rem;
			background: #ccc;
			border-radius: 999px;
			margin: 0 auto 1.25rem;
		}

		.modal-close {
			top: 0.75rem;
			right: 0.75rem;
		}

		.results-grid {
			grid-template-columns: 1fr 1fr;
		}

		.modal-link-btn {
			width: 100%;
			justify-content: center;
		}
	}
</style>
