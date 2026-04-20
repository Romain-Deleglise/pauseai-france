<script lang="ts">
	import EmploiForm from '$components/EmploiForm.svelte'
	import TestimonialCarousel from '$components/TestimonialCarousel.svelte'
	import ArticleShowcase from '$components/ArticleShowcase.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import type { Testimonial, ArticleShowcaseItem } from '$lib/types'
	import type { Lang } from '$lib/i18n'
	import { getT } from '$lib/i18n'
	import { onMount } from 'svelte'

	export let data: PageData

	interface PageData {
		lang: Lang
		testimonials: Testimonial[]
		articleShowcaseItems: ArticleShowcaseItem[]
	}

	$: t = getT(data.lang)
	$: lang = data.lang
	$: isEn = lang === 'en'

	let testimonials = data.testimonials
	let articleShowcaseItems = data.articleShowcaseItems

	testimonials.sort((a, b) => {
		const dateA = a.date ? new Date(a.date).getTime() : 0
		const dateB = b.date ? new Date(b.date).getTime() : 0
		return dateB - dateA
	})

	articleShowcaseItems.sort((a, b) => {
		const dateA = a.date ? new Date(a.date).getTime() : 0
		const dateB = b.date ? new Date(b.date).getTime() : 0
		return dateB - dateA
	})

	articleShowcaseItems = articleShowcaseItems.map((item) => ({
		...item,
		image: item.image || '/emploi-ia/article-placeholder.svg'
	}))

	$: tocSections = [
		{ id: 'bigger-problem', label: isEn ? 'Why act?' : 'Pourquoi agir ?' },
		{ id: 'enquete', label: isEn ? 'Survey' : 'Enquête' },
		{ id: 'temoignage', label: isEn ? 'Testimonials' : 'Témoignages' },
		{ id: 'evolution', label: isEn ? 'AI job losses' : "Pertes d'emploi" },
		{ id: 'revue', label: isEn ? 'Press' : 'Revue de presse' }
	]

	let activeSection = 'bigger-problem'

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						activeSection = entry.target.id
					}
				}
			},
			{ rootMargin: '-15% 0px -65% 0px', threshold: 0 }
		)
		tocSections.forEach(({ id }) => {
			const el = document.getElementById(id)
			if (el) observer.observe(el)
		})
		return () => observer.disconnect()
	})
</script>

<svelte:head>
	<title>{t.emploi_ia.meta_title}</title>
	<meta name="description" content={t.emploi_ia.meta_desc} />
	<meta name="keywords" content={t.emploi_ia.keywords} />
	<meta name="robots" content="index, follow" />
	<meta property="og:title" content={t.emploi_ia.meta_title} />
	<meta property="og:description" content={t.emploi_ia.meta_desc} />
	<meta property="og:image" content="https://pauseia.fr/emploi-ia/emploi-IA.png" />
	<meta property="og:url" content="https://pauseia.fr/emploi-ia" />
	<meta property="og:type" content="website" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={t.emploi_ia.meta_title} />
	<meta name="twitter:description" content={t.emploi_ia.meta_desc} />
	<meta name="twitter:image" content="https://pauseia.fr/emploi-ia/emploi-IA.png" />
</svelte:head>

<div class="page-layout">
	<!-- Sticky sidebar (desktop only) -->
	<aside class="toc" aria-label={isEn ? 'On this page' : 'Sur cette page'}>
		<p class="toc-title">{isEn ? 'On this page' : 'Sur cette page'}</p>
		<ul>
			{#each tocSections as section}
				<li>
					<a href="#{section.id}" class:active={activeSection === section.id}>{section.label}</a>
				</li>
			{/each}
		</ul>
	</aside>

	<article>
		<hgroup>
			<UnderlinedTitle as="h1">{t.emploi_ia.title}</UnderlinedTitle>
		</hgroup>

		<p class="lead">{t.emploi_ia.intro_lead}</p>

		<p>{t.emploi_ia.intro_text}</p>

		<!-- Big stat -->
		<div class="stat-block">
			<span class="stat-number">{t.emploi_ia.stat_number}</span>
			<span class="stat-label">{t.emploi_ia.stat_label}</span>
			<span class="stat-source">{t.emploi_ia.stat_source}</span>
		</div>

		<!-- Why act — key section, placed high -->
		<section id="bigger-problem" aria-labelledby="bigger-problem-heading" class="bigger-problem">
			<h2 id="bigger-problem-heading">{t.emploi_ia.bigger_problem_title}</h2>
			<p>{t.emploi_ia.bigger_problem_text_1}</p>
			<p>{t.emploi_ia.bigger_problem_text_2}</p>

			<p class="cta-wrap">
				<a class="cta-button" href="/{lang}/ecrire-a-mes-elus">{t.emploi_ia.cta_button}</a>
			</p>
		</section>

		<section id="enquete" aria-labelledby="enquete-heading">
			<h2 id="enquete-heading">{t.emploi_ia.survey_section_title}</h2>
			<p>{t.emploi_ia.survey_section_text}</p>
			<EmploiForm {lang} />
		</section>

		<section id="temoignage" aria-labelledby="temoignage-heading">
			<h2 id="temoignage-heading">{t.emploi_ia.testimonials_section_title}</h2>
			<p>
				{t.emploi_ia.testimonials_section_text_1}<a href="/{lang}/emploi-ia/questionnaire"
					>{t.emploi_ia.testimonials_section_link}</a
				>{t.emploi_ia.testimonials_section_text_2}
			</p>
			<TestimonialCarousel {testimonials} {lang} />
		</section>

		<section id="evolution" aria-labelledby="evolution-heading">
			<h2 id="evolution-heading">{t.emploi_ia.evolution_section_title}</h2>
			<p>
				{t.emploi_ia.evolution_section_text_1}<strong>{t.emploi_ia.evolution_strong}</strong>{t
					.emploi_ia.evolution_section_text_2}
			</p>
			<p>{t.emploi_ia.evolution_section_text_3}</p>
			<p>
				<a href="https://jobloss.ai/" target="_blank" rel="noopener noreferrer">
					{t.emploi_ia.evolution_link}
				</a>
			</p>
		</section>

		<section id="revue" aria-labelledby="revue-heading">
			<h2 id="revue-heading">{t.emploi_ia.press_section_title}</h2>
			<p>{t.emploi_ia.press_section_text}</p>
			<ArticleShowcase articles={articleShowcaseItems} {lang} />
		</section>
	</article>
</div>

<style>
	/* ── Layout ── */
	.page-layout {
		display: grid;
		grid-template-columns: 1fr;
		max-width: 54rem;
		margin: 2rem auto 0;
		padding: 0 1rem;
		align-items: start;
	}

	@media (min-width: 1220px) {
		.page-layout {
			grid-template-columns: 11rem 1fr;
			gap: 3rem;
			max-width: 70rem;
		}
	}

	/* ── Article ── */
	article {
		min-width: 0;
		max-inline-size: 50rem;
	}

	section:not(:last-child) {
		margin-bottom: 5rem;
	}

	/* ── Sidebar TOC ── */
	.toc {
		display: none;
	}

	@media (min-width: 1220px) {
		.toc {
			display: block;
			position: sticky;
			top: 5.5rem;
		}
	}

	.toc-title {
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-secondary, #888);
		margin: 0 0 0.75rem;
	}

	.toc ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}

	.toc a {
		display: block;
		font-size: 0.85rem;
		font-weight: 500;
		color: var(--text-secondary, #888);
		text-decoration: none;
		padding: 0.3rem 0.6rem;
		border-left: 2px solid transparent;
		line-height: 1.35;
		transition:
			color 0.15s,
			border-color 0.15s;
	}

	.toc a:hover {
		color: var(--text, #111);
	}

	.toc a.active {
		color: var(--brand, #ff9416);
		border-left-color: var(--brand, #ff9416);
		font-weight: 600;
	}

	/* ── Lead callout ── */
	.lead {
		font-size: 1.2rem;
		font-weight: 500;
		line-height: 1.5;
		color: var(--brand-subtle, #c96900);
		border-left: 4px solid var(--brand, #ff9416);
		background: var(--brand-light, #fff5e8);
		padding: 1rem 1.25rem;
		margin: 1.5rem 0 1.5rem;
	}

	/* ── Stat block ── */
	.stat-block {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.4rem;
		text-align: center;
		border: 1px solid rgba(255, 148, 22, 0.35);
		border-radius: 12px;
		padding: 1.75rem 2rem;
		margin: 2rem 0 3rem;
		background: var(--bg, white);
	}

	.stat-number {
		font-size: clamp(2.5rem, 7vw, 4rem);
		font-weight: 800;
		line-height: 1;
		color: var(--brand-subtle, #c96900);
		letter-spacing: -0.02em;
	}

	.stat-label {
		font-size: 1rem;
		color: var(--text, #111);
		max-width: 26rem;
		line-height: 1.4;
	}

	.stat-source {
		font-size: 0.78rem;
		color: var(--text-secondary, #888);
		margin-top: 0.25rem;
	}

	/* ── Bigger-problem section ── */
	.bigger-problem {
		background: var(--bg-subtle, #f7f7f5);
		border-left: 4px solid var(--brand, #ff9416);
		border-radius: 0 12px 12px 0;
		padding: 2rem 2.25rem;
		margin-bottom: 5rem;
	}

	:global([data-theme='dark']) .bigger-problem {
		background: rgba(255, 255, 255, 0.04);
	}

	.bigger-problem h2 {
		margin-top: 0;
	}

	/* ── CTA button ── */
	.cta-wrap {
		text-align: center;
		margin-top: 2rem;
	}

	.cta-button {
		display: inline-block;
		background: var(--brand, #ff9416);
		color: white;
		padding: 0.9rem 1.75rem;
		border-radius: 999px;
		font-weight: 600;
		text-decoration: none;
		transition: background 0.2s;
	}

	.cta-button:hover {
		background: var(--brand-subtle, #c96900);
	}
</style>
