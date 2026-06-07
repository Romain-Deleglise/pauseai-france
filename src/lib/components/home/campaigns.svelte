<script lang="ts">
	import Button from '$components/Button.svelte'
	import Fly from '$components/Fly.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import { MoveUpRight } from 'lucide-svelte'
	import { getSortedCampaigns, formatCampaignDate } from '$lib/campaigns'
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
				<a class="card-link" {href}>
					<article class:has-image={!!campaign.image}>
						{#if campaign.image}
							<div class="cover">
								<img src={campaign.image} alt="" loading="lazy" />
							</div>
						{/if}
						<div class="body">
							<div class="meta">
								<span class="pill pill-brand">
									{lang === 'en' ? 'Campaign' : 'Campagne'}
								</span>
								<span class="pill pill-outline">
									{lang === 'en' ? 'Since' : 'Depuis'}
									{formatCampaignDate(campaign.startDate, lang)}
								</span>
							</div>
							<h3>{info.title}</h3>
							<p class="desc">{info.description}</p>
							<span class="read-more">
								{t.home.campaigns_cta}
								<span class="link-icon"><MoveUpRight size="1.125rem" /></span>
							</span>
						</div>
					</article>
				</a>
			{/each}
		</div>

		<div class="see-all">
			<Button href="{prefix}/campagnes">{t.home.campaigns_see_all}</Button>
		</div>
	</section>
{/if}

<style>
	.campaigns {
		margin: 1rem 0 2rem;
	}

	.subtitle {
		font-size: 1.05rem;
		line-height: 1.6;
		color: var(--text-2);
		max-width: 42rem;
		margin: 0.5rem 0 2rem;
	}

	.grid {
		display: grid;
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	@media (min-width: 640px) {
		.grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 960px) {
		.grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.card-link {
		text-decoration: none;
		display: block;
		height: 100%;
		border-radius: 0.875rem;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.card-link:hover {
		transform: translateY(-4px);
		box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.15);
	}

	.card-link:hover article {
		border-color: var(--primary, #ff9416);
	}

	.card-link:hover .read-more {
		color: var(--primary, #ff9416);
	}

	.card-link:hover .link-icon {
		transform: translate(2px, -2px);
	}

	article {
		display: flex;
		flex-direction: column;
		height: 100%;
		background-color: var(--bg);
		border: 2px solid var(--border);
		border-radius: 0.875rem;
		overflow: hidden;
		transition: border-color 0.2s ease;
		position: relative;
	}

	article::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: var(--primary, #ff9416);
	}

	.cover {
		width: 100%;
		aspect-ratio: 16 / 9;
		overflow: hidden;
		background: var(--bg-subtle);
	}

	.cover img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		transition: transform 0.4s ease;
	}

	.card-link:hover .cover img {
		transform: scale(1.03);
	}

	.body {
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		flex: 1;
		gap: 0.75rem;
	}

	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.pill {
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		padding: 0.25rem 0.55rem;
		border-radius: 4px;
		line-height: 1.2;
	}

	.pill-brand {
		color: var(--brand);
		background-color: rgba(255, 148, 22, 0.12);
	}

	.pill-outline {
		color: var(--text-2);
		border: 1px solid var(--border);
		background: transparent;
	}

	h3 {
		margin: 0;
		font-size: 1.2rem;
		font-weight: 700;
		line-height: 1.35;
		color: var(--text);
	}

	.desc {
		margin: 0;
		font-size: 0.9375rem;
		line-height: 1.6;
		color: var(--text-2);
		display: -webkit-box;
		-webkit-line-clamp: 4;
		-webkit-box-orient: vertical;
		overflow: hidden;
		flex: 1;
	}

	.read-more {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text);
		transition: color 0.2s ease;
		margin-top: auto;
	}

	.link-icon {
		display: flex;
		align-items: center;
		transition: transform 0.2s ease;
	}

	.see-all {
		display: flex;
		justify-content: center;
	}
</style>
