<script lang="ts">
	import EmploiForm from '$components/EmploiForm.svelte'
	import TestimonialCarousel from '$components/TestimonialCarousel.svelte'
	import ArticleShowcase from '$components/ArticleShowcase.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import type { Testimonial, ArticleShowcaseItem } from '$lib/types'
	import type { Lang } from '$lib/i18n'
	import { getT } from '$lib/i18n'

	export let data: PageData

	interface PageData {
		lang: Lang
		testimonials: Testimonial[]
		articleShowcaseItems: ArticleShowcaseItem[]
	}

	$: t = getT(data.lang)
	$: lang = data.lang

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

<article>
	<hgroup>
		<UnderlinedTitle as="h1">{t.emploi_ia.title}</UnderlinedTitle>
	</hgroup>

	<div>
		<p class="lead">{t.emploi_ia.intro_lead}</p>

		<p>{t.emploi_ia.intro_text}</p>

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

		<section id="bigger-problem" aria-labelledby="bigger-problem-heading" class="bigger-problem">
			<h2 id="bigger-problem-heading">{t.emploi_ia.bigger_problem_title}</h2>
			<p>{t.emploi_ia.bigger_problem_text_1}</p>
			<p>{t.emploi_ia.bigger_problem_text_2}</p>
			<p>{t.emploi_ia.bigger_problem_text_3}</p>
			<p>{t.emploi_ia.bigger_problem_text_4}</p>

			<p class="cta-wrap">
				<a class="cta-button" href="/{lang}/ecrire-a-mes-elus">{t.emploi_ia.cta_button}</a>
			</p>
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
	</div>
</article>

<style>
	article {
		max-inline-size: 50rem;
		margin-inline: auto;
		margin-top: 2rem;
	}

	section:not(:last-child) {
		margin-bottom: 5rem;
	}

	.lead {
		font-size: 1.25rem;
		font-weight: 500;
		line-height: 1.5;
		color: var(--brand-subtle, #c96900);
		border-left: 4px solid var(--brand, #ff9416);
		background: var(--brand-light, #fff5e8);
		padding: 1rem 1.25rem;
		margin: 1.5rem 0 2rem;
	}

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
