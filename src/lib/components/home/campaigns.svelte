<script lang="ts">
	import Button from '$components/Button.svelte'
	import Fly from '$components/Fly.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import { MoveUpRight } from 'lucide-svelte'
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
				<a class="card-link" {href}>
					<article>
						<div class="content">
							<span class="category">{lang === 'en' ? 'Campaign' : 'Campagne'}</span>
							<h3>{info.title}</h3>
							<p>{info.description}</p>
						</div>
						<div class="footer">
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
		border-radius: 0.75rem;
		overflow: hidden;
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
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		height: 100%;
		background-color: var(--bg-subtle);
		border: 2px solid transparent;
		border-radius: 0.75rem;
		transition: border-color 0.2s ease;
	}

	.content {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.category {
		align-self: flex-start;
		font-size: 0.75rem;
		color: var(--brand);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		background-color: rgba(255, 148, 22, 0.12);
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
	}

	h3 {
		margin: 0;
		font-size: 1.125rem;
		font-weight: 700;
		line-height: 1.4;
		color: var(--text);
	}

	p {
		margin: 0;
		font-size: 0.9375rem;
		line-height: 1.6;
		color: var(--text-2);
		display: -webkit-box;
		-webkit-line-clamp: 4;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.footer {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--border);
	}

	.read-more {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text);
		transition: color 0.2s ease;
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
