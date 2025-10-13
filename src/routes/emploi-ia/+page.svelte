<script lang="ts">
	import EmploiForm from '$components/EmploiForm.svelte'
	import TestimonialCarousel from '$components/TestimonialCarousel.svelte'
	import ArticleShowcase from '$components/ArticleShowcase.svelte'
	import EmploiAvisForm from '$components/EmploiAvisForm.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import A from '$components/custom/a.svelte'

	export let data: PageData

	console.log(data)

	interface Testimonial {
		name: string | null
		age: number | null
		job: string
		date: string
		testimony: string
	}

	interface ArticleShowcaseItem {
		category: string
		image: string
		date: string
		title: string
		summary: string
		url: string
	}

	interface PageData {
		testimonials: Testimonial[]
		articleShowcaseItems: ArticleShowcaseItem[]
	}

	let testimonials = data.testimonials

	let articleShowcaseItems = data.articleShowcaseItems

	// Sort testimonials by date descending (most recent first)
	testimonials.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

	// Sort articleShowcaseItems by date descending
	articleShowcaseItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

	// Set default image for articleShowcaseItems if undefined
	articleShowcaseItems = articleShowcaseItems.map((item) => ({
		...item,
		image: item.image || '/emploi-ia/article-placeholder.svg'
	}))
</script>

<svelte:head>
	<title>Emploi et IA - Informez vous et agissez | PauseAI France</title>
	<meta
		name="description"
		content="Découvrez Emploi IA, un groupe de Pause IA dédié à comprendre l'impact de l'intelligence artificielle sur le travail et à préparer l'avenir."
	/>
</svelte:head>

<article>
	<hgroup>
		<UnderlinedTitle as="h1">Emploi et IA - Informez vous et agissez</UnderlinedTitle>
	</hgroup>

	<div>
		<h2>Qui sommes-nous ?</h2>

		<p>
			Nous sommes un groupe de contributeurs de Pause IA qui réfléchit spécifiquement à l'impact de
			l'IA sur les emplois, aujourd'hui, dans 1 mois, dans 1 an, dans 2 ans... Comment le travail
			humain va-t-il évoluer ? Quand et comment chacun de nous sera impacté ? Quel risque avons-nous
			de perdre notre emploi ? Quelle reconversion envisager ? Quelles sont les nouvelles
			compétences demandées ? Vers quelle nouvelle organisation du travail allons-nous ? Comment
			subsisterons-nous?
		</p>

		<h2>Nos ressources</h2>
		<p>Nous sommes au début de nos réflexions, et nous vous proposons déjà :</p>
		<ul>
			<li>
				<A href="#enquete">Un questionnaire pour savoir quel impact a l'IA sur votre travail</A>
			</li>
			<li>
				<A href="#temoignage"
					>Des témoignages illustrant l'impact de l'IA sur des parcours professionnels</A
				>
			</li>
			<li><A href="#revue">Une revue de presse sur l'impact de l'IA sur le monde du travail</A></li>
			<li>
				<A href="#avis-form">Un formulaire pour que vous puissiez nous donner un feedback</A>
			</li>
		</ul>

		<h2>L’IA : une menace croissante pour de nombreux emplois</h2>
		<p>
			Avec les progrès rapides de l’intelligence artificielle, de nombreux métiers risquent d’être
			automatisés, partiellement ou totalement. L’essor des IA génératives a déjà commencé à
			affecter des professions comme journaliste, traducteur ou illustrateur. Et cette tendance
			pourrait s’étendre à d’autres secteurs à mesure que <a
				href="https://fr.wikipedia.org/wiki/Intelligence_artificielle_g%C3%A9n%C3%A9rale"
				target="_blank"
				rel="noopener noreferrer">l’IA devient plus générale</a
			>.
		</p>

		<section id="enquete" aria-labelledby="enquete-heading">
			<h2 id="enquete-heading">Je participe à la grande enquête sur l'IA au travail !</h2>
			<p>
				Comment l’IA impacte-t-elle votre vie professionnelle ? L’association Pause IA réalise une
				enquête sur l’IA et l’emploi pour évaluer et comprendre l’impact de l’IA sur le monde du
				travail.
			</p>

			<EmploiForm />
		</section>

		<section id="temoignage" aria-labelledby="temoignage-heading">
			<h2 id="temoignage-heading">L'IA et mon travail : je témoigne !</h2>
			<p>
				Nous recueillons régulièrement des témoignages de personnes dont la vie professionnelle a
				été impactée par l’IA. Si vous aussi avez été concerné, ou pensez que cela pourrait arriver,
				vous pouvez partager votre expérience <a
					href="https://framaforms.org/enquete-2025-ia-et-emploi-1750943896"
					target="_blank"
					rel="noopener noreferrer">grâce à notre questionnaire</a
				>.
			</p>

			<TestimonialCarousel {testimonials} />
		</section>

		<section id="revue" aria-labelledby="revue-heading">
			<h2 id="revue-heading">Revue de presse : je reste informé !</h2>
			<p>
				De nombreux médias abordent l’impact de l’IA sur le marché du travail. Nous collectons
				régulièrement des articles de presse traitant de ce sujet.
			</p>

			<ArticleShowcase articles={articleShowcaseItems} />
		</section>

		<section id="avis-form" aria-labelledby="avis-heading">
			<h2 id="avis-heading">Donnez-nous votre avis</h2>
			<p>
				Merci de nous faire un retour : vos avis nous aident à affiner la réflexion et les actions
				de Pause IA.
			</p>

			<EmploiAvisForm />
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
</style>
