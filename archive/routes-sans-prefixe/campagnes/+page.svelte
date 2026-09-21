<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import { getSortedCampaigns } from '$lib/campaigns'
	import type { Campaign } from '$lib/campaigns'
	import { fade } from 'svelte/transition'

	const title = 'Nos Campagnes'
	const description =
		'Découvrez les campagnes menées par notre association pour sensibiliser et agir face aux risques de l\u2019IA.'

	const campaigns = getSortedCampaigns()

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

<PostMeta {title} {description} />

<article>
	<section class="hero">
		<UnderlinedTitle as="h1">Nos Campagnes</UnderlinedTitle>
		<p class="intro">
			{description}
		</p>
	</section>

	<section class="campaigns-grid">
		{#each campaigns as campaign}
			{@const info = campaign.fr}
			{@const hasSummary = campaign.status === 'ended' && campaign.summary}
			<button
				class="campaign-card"
				class:ended={campaign.status === 'ended'}
				class:clickable={hasSummary}
				on:click={() => openSummary(campaign)}
				disabled={!hasSummary}
			>
				{#if campaign.status === 'ended'}
					<span class="badge badge-ended">Terminée</span>
				{:else}
					<span class="badge badge-active">En cours</span>
				{/if}
				<h2>{info.title}</h2>
				<p>{info.description}</p>
				{#if hasSummary}
					<span class="see-results">Voir le bilan</span>
				{/if}
			</button>
		{/each}
	</section>
</article>

{#if selectedCampaign?.summary}
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
			aria-label="Bilan de la campagne"
			on:click|stopPropagation
		>
			<button class="modal-close" on:click={closeSummary} aria-label="Fermer">&times;</button>

			<div class="modal-header">
				<span class="badge badge-ended">Terminée</span>
				<h2>{selectedCampaign.fr.title}</h2>
				{#if selectedCampaign.startDate}
					<p class="modal-dates">
						{selectedCampaign.startDate}{#if selectedCampaign.endDate && selectedCampaign.endDate !== selectedCampaign.startDate}
							&ndash; {selectedCampaign.endDate}{/if}
					</p>
				{/if}
			</div>

			<p class="modal-text">{selectedCampaign.summary.fr.text}</p>

			{#if selectedCampaign.summary.fr.results.length > 0}
				<div class="results-grid">
					{#each selectedCampaign.summary.fr.results as result}
						<div class="result-card">
							<span class="result-value">{result.value}</span>
							<span class="result-label">{result.label}</span>
						</div>
					{/each}
				</div>
			{/if}

			{#if selectedCampaign.summary.fr.link}
				<a
					href={selectedCampaign.summary.fr.link.url}
					target="_blank"
					rel="noopener noreferrer"
					class="modal-link"
				>
					{selectedCampaign.summary.fr.link.label} ↗
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
		margin-bottom: 4rem;
	}

	.intro {
		font-size: 1.25rem;
		line-height: 1.6;
		color: var(--text-secondary);
	}

	.campaigns-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		margin-bottom: 5rem;
	}

	.campaign-card {
		background: var(--bg-subtle);
		border-radius: 16px;
		padding: 2.5rem 2rem;
		border: 1px solid var(--border);
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		text-align: left;
		cursor: default;
		width: 100%;
	}

	.campaign-card.ended {
		opacity: 0.75;
	}

	.campaign-card.clickable {
		cursor: pointer;
		transition:
			opacity 0.2s,
			box-shadow 0.2s;
	}

	.campaign-card.clickable:hover {
		opacity: 1;
		box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
	}

	.badge {
		display: inline-block;
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
		margin-bottom: 1rem;
	}

	.badge-ended {
		background: #f5f5f5;
		color: #888;
	}

	.badge-active {
		background: color-mix(in srgb, var(--brand) 15%, white);
		color: var(--brand);
	}

	h2 {
		font-size: 1.75rem;
		margin-top: 0;
		margin-bottom: 1rem;
		color: var(--text);
	}

	.campaign-card p {
		font-size: 1.1rem;
		line-height: 1.6;
		margin-bottom: 1.5rem;
		color: var(--text-secondary);
	}

	.see-results {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--brand);
		margin-top: auto;
	}

	.campaign-card.clickable:hover .see-results {
		text-decoration: underline;
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
		background: var(--bg);
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
		color: var(--text-secondary);
		cursor: pointer;
		padding: 0.25rem 0.5rem;
		border-radius: 0.5rem;
		transition: background 0.15s;
	}

	.modal-close:hover {
		background: var(--bg-subtle);
	}

	.modal-header {
		margin-bottom: 1.5rem;
	}

	.modal-header h2 {
		font-size: 1.5rem;
		margin-bottom: 0.25rem;
	}

	.modal-dates {
		font-size: 0.9rem;
		color: var(--text-secondary);
		margin: 0;
	}

	.modal-text {
		font-size: 1rem;
		line-height: 1.6;
		margin-bottom: 1.5rem;
		color: var(--text);
	}

	.results-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 0.75rem;
	}

	.result-card {
		background: var(--bg-subtle);
		border-radius: 0.75rem;
		padding: 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.result-value {
		font-weight: 700;
		font-size: 1rem;
		color: var(--text);
	}

	.result-label {
		font-size: 0.8rem;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.modal-link {
		display: inline-block;
		margin-top: 1.25rem;
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--brand-subtle);
		text-decoration: none;
	}

	.modal-link:hover {
		text-decoration: underline;
	}

	@media (max-width: 600px) {
		.campaign-card {
			padding: 1.5rem;
		}

		.modal {
			padding: 1.5rem;
			border-radius: 1rem 1rem 0 0;
			max-height: 85dvh;
			align-self: flex-end;
		}

		.modal-overlay {
			align-items: flex-end;
			padding: 0;
		}

		.results-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
