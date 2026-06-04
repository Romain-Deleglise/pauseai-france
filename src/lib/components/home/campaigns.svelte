<script lang="ts">
	import Button from '$components/Button.svelte'
	import Fly from '$components/Fly.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import { getSortedCampaigns } from '$lib/campaigns'
	import { getT, type Lang } from '$lib/i18n'

	export let lang: Lang = 'fr'

	$: t = getT(lang)
	$: prefix = lang === 'en' ? '/en' : '/fr'
	$: activeCampaigns = getSortedCampaigns()
		.filter((c) => c.status === 'active')
		.slice(0, 3)

	const label_id = 'home-campaigns-title'
</script>

{#if activeCampaigns.length > 0}
	<section class="campaigns" aria-labelledby={label_id}>
		<Fly>
			<UnderlinedTitle id={label_id}>{t.home.campaigns_title}</UnderlinedTitle>
		</Fly>
		<Fly>
			<p class="subtitle">{t.home.campaigns_subtitle}</p>
		</Fly>

		<div class="grid">
			{#each activeCampaigns as campaign}
				{@const info = lang === 'en' ? campaign.en : campaign.fr}
				{@const href = campaign.url ?? `${prefix}/${campaign.slug}`}
				<Fly>
					<a class="card" {href}>
						<h3>{info.title}</h3>
						<p>{info.description}</p>
						<span class="cta">{t.home.campaigns_cta} →</span>
					</a>
				</Fly>
			{/each}
		</div>

		<div class="see-all">
			<Button href="{prefix}/campagnes">{t.home.campaigns_see_all}</Button>
		</div>
	</section>
{/if}

<style>
	.campaigns {
		max-width: 70rem;
		margin: 4rem auto;
		padding: 0 1.5rem;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.subtitle {
		font-size: 1.1rem;
		line-height: 1.6;
		color: var(--text-secondary);
		text-align: center;
		max-width: 40rem;
		margin: 0 0 2.5rem;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 1.5rem;
		width: 100%;
		margin-bottom: 2rem;
	}

	.card {
		background: var(--bg-subtle, #fafafa);
		border: 1px solid var(--border, #eee);
		border-radius: 16px;
		padding: 1.75rem 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		text-decoration: none;
		color: inherit;
		transition:
			transform 0.15s ease,
			box-shadow 0.15s ease;
		height: 100%;
	}

	.card:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
	}

	.card h3 {
		font-size: 1.2rem;
		margin: 0;
		line-height: 1.3;
	}

	.card p {
		font-size: 0.95rem;
		line-height: 1.55;
		color: var(--text-secondary);
		margin: 0;
		flex: 1;
	}

	.cta {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--brand, #005dca);
		margin-top: 0.25rem;
	}

	.see-all {
		display: flex;
		justify-content: center;
	}
</style>
