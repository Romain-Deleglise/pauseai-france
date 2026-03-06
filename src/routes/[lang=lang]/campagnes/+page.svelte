<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import Button from '$lib/components/Button.svelte'
	import { getT } from '$lib/i18n'
	import type { PageData } from './$types'

	export let data: PageData

	$: t = getT(data.lang)
	$: prefix = data.lang === 'fr' ? '/fr' : '/en'
</script>

<PostMeta title={t.campagnes.meta_title} description={t.campagnes.meta_desc} />

<article>
	<section class="hero">
		<UnderlinedTitle as="h1">{t.campagnes.title}</UnderlinedTitle>
		<p class="intro">{t.campagnes.subtitle}</p>
	</section>

	<section class="campaigns-list">
		<div class="campaign-card">
			<div class="card-badge">{t.campagnes.active_badge}</div>
			<h2>{t.campagnes.municipales_title}</h2>
			<p>{t.campagnes.municipales_desc}</p>
			<Button href="{prefix}/municipales-2026">{t.campagnes.municipales_cta}</Button>
		</div>

		<div class="campaign-card">
			<div class="card-badge">{t.campagnes.active_badge}</div>
			<h2>{t.campagnes.sommet_title}</h2>
			<p>{t.campagnes.sommet_desc}</p>
			<Button href="{prefix}/sommet-ia-2026">{t.campagnes.sommet_cta}</Button>
		</div>
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
		gap: 2rem;
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
