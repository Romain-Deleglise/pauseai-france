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

	$: featured = activeCampaigns[0]
	$: secondary = activeCampaigns.slice(1)

	const label_id = 'home-campaigns-title'
</script>

{#if activeCampaigns.length > 0}
	<section class="campaigns" aria-labelledby={label_id}>
		<Fly>
			<UnderlinedTitle id={label_id} as="h2">{t.home.campaigns_title}</UnderlinedTitle>
		</Fly>
		<Fly>
			<p class="subtitle">{t.home.campaigns_subtitle}</p>
		</Fly>

		{#if featured}
			{@const info = lang === 'en' ? featured.en : featured.fr}
			{@const href = featured.url ?? `${prefix}/${featured.slug}`}
			{@const ctaLabel = info.homeCta ?? t.home.campaigns_cta}
			<Fly>
				<article class="card card-featured" class:has-image={!!featured.image}>
					{#if featured.image}
						<a class="cover-link" {href} aria-hidden="true" tabindex="-1">
							<div class="cover">
								<img src={featured.image} alt="" loading="lazy" />
							</div>
						</a>
					{/if}
					<div class="body">
						{#if info.progress}
							<span class="pill pill-progress">{info.progress}</span>
						{/if}
						<h3>
							<a class="title-link" {href}>{info.homeTitle ?? info.title}</a>
						</h3>
						<p class="desc">{info.shortDescription ?? info.description}</p>
						<div class="actions">
							<a
								class="action-cta"
								{href}
								aria-label={`${ctaLabel} : ${info.homeTitle ?? info.title}`}
							>
								{ctaLabel}
								<MoveUpRight size="1rem" aria-hidden="true" />
							</a>
						</div>
					</div>
				</article>
			</Fly>
		{/if}

		{#if secondary.length > 0}
			<div class="grid">
				{#each secondary as campaign}
					{@const info = lang === 'en' ? campaign.en : campaign.fr}
					{@const href = campaign.url ?? `${prefix}/${campaign.slug}`}
					{@const ctaLabel = info.homeCta ?? t.home.campaigns_cta}
					<article class="card" class:has-image={!!campaign.image}>
						{#if campaign.image}
							<a class="cover-link" {href} aria-hidden="true" tabindex="-1">
								<div class="cover">
									<img src={campaign.image} alt="" loading="lazy" />
								</div>
							</a>
						{/if}
						<div class="body">
							{#if info.progress}
								<span class="pill pill-progress">{info.progress}</span>
							{/if}
							<h3>
								<a class="title-link" {href}>{info.homeTitle ?? info.title}</a>
							</h3>
							<p class="desc">{info.shortDescription ?? info.description}</p>
							<div class="actions">
								<a
									class="action-cta"
									{href}
									aria-label={`${ctaLabel} : ${info.homeTitle ?? info.title}`}
								>
									{ctaLabel}
									<MoveUpRight size="1rem" aria-hidden="true" />
								</a>
							</div>
						</div>
					</article>
				{/each}
			</div>
		{/if}

		<div class="see-all">
			<Button href="{prefix}/campagnes" alt>{t.home.campaigns_see_all}</Button>
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

	/* ─── Card base ────────────────────────────────────────── */
	.card {
		display: flex;
		flex-direction: column;
		background-color: var(--bg);
		border: 2px solid var(--border);
		border-radius: 0.875rem;
		overflow: hidden;
		transition: border-color 0.2s ease;
		position: relative;
		height: 100%;
	}

	.card::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: var(--primary, #ff9416);
		z-index: 1;
	}

	.card:hover {
		border-color: var(--primary, #ff9416);
	}

	.cover-link {
		display: block;
		text-decoration: none;
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

	.card:hover .cover img {
		transform: scale(1.03);
	}

	.body {
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		flex: 1;
		gap: 0.75rem;
	}

	.pill {
		align-self: flex-start;
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		padding: 0.3rem 0.6rem;
		border-radius: 999px;
		line-height: 1.2;
	}

	.pill-progress {
		color: var(--brand);
		background-color: rgba(255, 148, 22, 0.12);
	}

	h3 {
		margin: 0;
		font-size: 1.15rem;
		font-weight: 700;
		line-height: 1.35;
		color: var(--text);
	}

	.title-link {
		color: inherit;
		text-decoration: none;
	}

	.title-link:hover,
	.title-link:focus-visible {
		color: var(--primary, #ff9416);
	}

	.desc {
		margin: 0;
		font-size: 0.9375rem;
		line-height: 1.55;
		color: var(--text-2);
		display: -webkit-box;
		-webkit-line-clamp: 4;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.actions {
		margin-top: auto;
		padding-top: 0.25rem;
	}

	.action-cta {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		background: var(--primary, #ff9416);
		color: white;
		text-decoration: none;
		font-weight: 700;
		font-size: 0.9rem;
		padding: 0.6rem 1rem;
		border-radius: 8px;
		transition:
			opacity 0.2s ease,
			transform 0.2s ease;
	}

	.action-cta:hover,
	.action-cta:focus-visible {
		opacity: 0.92;
		transform: translateY(-1px);
	}

	/* ─── Featured card (first / G7) ───────────────────────── */
	.card-featured {
		margin-bottom: 1.5rem;
	}

	.card-featured .body {
		padding: 1.75rem;
		gap: 0.85rem;
	}

	.card-featured h3 {
		font-size: 1.45rem;
		line-height: 1.25;
	}

	.card-featured .desc {
		font-size: 1rem;
		-webkit-line-clamp: 5;
	}

	@media (min-width: 768px) {
		.card-featured.has-image {
			flex-direction: row;
			align-items: stretch;
		}

		.card-featured.has-image .cover-link {
			flex: 0 0 45%;
		}

		.card-featured.has-image .cover {
			height: 100%;
			aspect-ratio: auto;
			min-height: 18rem;
		}

		.card-featured h3 {
			font-size: 1.6rem;
		}
	}

	/* ─── Secondary grid (other campaigns) ────────────────── */
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

	.see-all {
		display: flex;
		justify-content: center;
		margin-top: 1.5rem;
	}
</style>
