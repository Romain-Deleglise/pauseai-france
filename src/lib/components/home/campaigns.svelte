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
	const liveLabel = { fr: 'En cours', en: 'Live' } as const
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
						<span class="badge">
							<span class="badge-dot" aria-hidden="true"></span>
							{liveLabel[lang]}
						</span>
						{#if campaign.icon}
							<span class="icon" aria-hidden="true">{campaign.icon}</span>
						{/if}
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
		margin-bottom: 2.5rem;
	}

	.card {
		--brand: #005dca;
		position: relative;
		background: var(--bg-subtle, #fafafa);
		border: 1px solid var(--border, #eee);
		border-radius: 16px;
		padding: 1.75rem 1.5rem 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		text-decoration: none;
		color: inherit;
		overflow: hidden;
		transition:
			transform 0.18s ease,
			box-shadow 0.18s ease,
			border-color 0.18s ease;
		height: 100%;
	}

	.card::before {
		content: '';
		position: absolute;
		inset: 0 auto 0 0;
		width: 4px;
		background: linear-gradient(180deg, var(--brand), color-mix(in srgb, var(--brand) 60%, white));
		transition: width 0.18s ease;
	}

	.card:hover {
		transform: translateY(-3px);
		box-shadow: 0 10px 28px rgba(0, 93, 202, 0.12);
		border-color: color-mix(in srgb, var(--brand) 30%, var(--border, #eee));
	}

	.card:hover::before {
		width: 6px;
	}

	.card:hover h3 {
		color: var(--brand);
	}

	.icon {
		font-size: 2rem;
		line-height: 1;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 3rem;
		height: 3rem;
		border-radius: 12px;
		background: color-mix(in srgb, var(--brand) 10%, white);
		margin-top: 0.25rem;
	}

	.badge {
		position: absolute;
		top: 1rem;
		right: 1rem;
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--brand);
		background: color-mix(in srgb, var(--brand) 12%, white);
		padding: 0.25rem 0.6rem;
		border-radius: 999px;
	}

	.badge-dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--brand);
		position: relative;
		box-shadow: 0 0 0 0 color-mix(in srgb, var(--brand) 60%, transparent);
		animation: pulse 1.8s ease-out infinite;
	}

	@keyframes pulse {
		0% {
			box-shadow: 0 0 0 0 color-mix(in srgb, var(--brand) 50%, transparent);
		}
		70% {
			box-shadow: 0 0 0 8px transparent;
		}
		100% {
			box-shadow: 0 0 0 0 transparent;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.badge-dot {
			animation: none;
		}
		.card,
		.card::before {
			transition: none;
		}
	}

	.card h3 {
		font-size: 1.2rem;
		margin: 0;
		line-height: 1.3;
		padding-right: 4.5rem;
		transition: color 0.18s ease;
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
		color: var(--brand);
		margin-top: 0.25rem;
	}

	.see-all {
		display: flex;
		justify-content: center;
	}
</style>
