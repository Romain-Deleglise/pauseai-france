<script lang="ts">
	import { onMount } from 'svelte'
	import PostMeta from '$components/PostMeta.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'

	const CAMPAIGN_ID = 'ffccd310-c37c-406b-8425-0225f237857b'
	const CAMPAIGN_ID_G7 = 'c858d3be-34d3-4478-b199-0b8d01fcdc4e'

	const title = 'G7 2026 : sécuriser plutôt qu’accélérer l’IA'
	const description =
		'En 2026, la France accueille le G7. Pause IA demande que la sécurité de l’IA soit remise au cœur de l’agenda international.'

	onMount(() => {
		const SCRIPT_SRC = 'https://beta.app.activoice.org/embed/v1/loader.js'

		function initEmbeds() {
			const w = window as Window & {
				Activoice?: { init: (opts: Record<string, unknown>) => void }
			}
			if (!w.Activoice) return
			w.Activoice.init({
				container: '#av-embed-container',
				campaignId: CAMPAIGN_ID,
				embedOptions: { spinnerColor: '#005DCA' }
			})
			w.Activoice.init({
				container: '#av-embed-container-g7',
				campaignId: CAMPAIGN_ID_G7,
				embedOptions: { spinnerColor: '#005DCA' }
			})
		}

		const existing = document.querySelector(
			`script[src="${SCRIPT_SRC}"]`
		) as HTMLScriptElement | null
		if (existing) {
			if ((window as Window & { Activoice?: unknown }).Activoice) {
				initEmbeds()
			} else {
				existing.addEventListener('load', initEmbeds, { once: true })
			}
			return
		}

		const script = document.createElement('script')
		script.src = SCRIPT_SRC
		script.async = true
		script.addEventListener('load', initEmbeds, { once: true })
		document.head.appendChild(script)
	})
</script>

<PostMeta {title} {description} />

<article>
	<section class="hero">
		<UnderlinedTitle as="h1"
			>Le rôle du G7 ne devrait pas être d’accélérer mais de sécuriser l’IA</UnderlinedTitle
		>
		<p class="lede">
			<strong
				>En 2026, la France accueille le G7. Alors que les systèmes d’IA deviennent plus puissants
				et plus difficiles à contrôler, Pause IA demande que la sécurité soit mise au cœur de
				l’agenda.</strong
			>
		</p>
	</section>

	<section class="prose">
		<p>
			En 2023, sous présidence japonaise, le G7 avait lancé le
			<strong>Processus d’Hiroshima sur l’IA</strong>, avec pour objectif de promouvoir un code de
			conduite international pour les organisations développant des systèmes d’IA avancés. Le Japon
			avait alors utilisé sa présidence pour mettre concrètement la sécurité de l’IA à l’agenda
			international et souligner la nécessité de standards communs.
		</p>
		<p>
			Mais depuis, le ton a changé. En 2025, au Canada, la déclaration des dirigeants du G7 sur l’IA
			s’intitulait <strong>« L’IA pour la prospérité »</strong>. Le cœur du message n’était plus la
			prudence face à des systèmes de plus en plus puissants, mais l’accélération de leur adoption
			dans l’économie et les services publics.
		</p>

		<h2>Accélérer ou sécuriser : je choisis la sécurité</h2>
		<p>
			Pour le sommet de 2026, la présidence française a identifié 4 enjeux :
			<strong>garantir une IA sûre au service du bien commun</strong>,
			<strong>accélérer la diffusion et l’innovation de l’IA dans l’économie</strong>,
			<strong>concilier résilience et durabilité dans le secteur numérique</strong>, et
			<strong>protéger les mineurs en ligne</strong>.
		</p>
		<p>
			La sécurité est inscrite dans une logique d’accélération : développer, diffuser, intégrer l’IA
			partout, puis tenter d’en limiter les risques par des engagements volontaires.
		</p>
		<p>
			Pause IA dénonce cette approche : on ne peut pas, en même temps, accélérer le déploiement de
			systèmes d’IA toujours plus puissants et prétendre garantir leur sécurité avec de simples
			codes de conduite non contraignants. La sécurité doit devenir une condition préalable au
			développement et au déploiement des systèmes d’IA avancés.
		</p>
		<p>
			Nous sommes très nombreux à le penser. Publiée en mai 2026, une <a
				href="https://cesia.org/fr/publications/sondage-ia-2026/"
				target="_blank"
				rel="noopener noreferrer">enquête d’opinion</a
			> conduite par OpinionWay pour le Centre pour la Sécurité de l’IA révèle que seuls 8 % des Français
			souhaitent accélérer le développement de l’IA. À l’inverse, une très large majorité d’entre eux,
			tous bords politiques confondus, se déclarent favorables à ce que cette technologie soit davantage
			encadrée et à ce que son développement soit prioritairement orienté vers la « sécurité, les droits
			et l’éthique ».
		</p>

		<h2>J’agis pour la sécurité de l’IA</h2>
		<p>
			Interpellons le Président et la ministre chargée du numérique pour leur demander de remettre
			la sécurité au centre des discussions pour le G7.
		</p>
	</section>

	<section class="embed-section">
		<div id="av-embed-container"></div>
	</section>

	<section class="prose">
		<h2>Interpellons les dirigeants du G7</h2>
		<p>
			Interpellons en anglais les Chefs d’État et les ministres chargés du numérique des pays du G7.
		</p>
	</section>

	<section class="embed-section">
		<div id="av-embed-container-g7"></div>
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
		margin-bottom: 2.5rem;
	}

	.lede {
		font-size: 1.2rem;
		line-height: 1.6;
		color: var(--text);
		margin-top: 1.5rem;
	}

	.prose {
		font-size: 1.05rem;
		line-height: 1.7;
		color: var(--text);
		margin-bottom: 2.5rem;
	}

	.prose h2 {
		font-size: 1.5rem;
		margin-top: 2.5rem;
		margin-bottom: 1rem;
	}

	.prose p {
		margin-bottom: 1.2rem;
	}

	.embed-section {
		background: #fafafa;
		border-radius: 16px;
		padding: 2rem;
		border: 1px solid #eee;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
		margin-bottom: 5rem;
	}

	#av-embed-container,
	#av-embed-container-g7 {
		min-height: 400px;
		width: 100%;
		max-width: 100%;
	}

	#av-embed-container :global(iframe),
	#av-embed-container-g7 :global(iframe) {
		width: 100% !important;
		max-width: 100% !important;
		min-height: 400px;
		border: 0;
		display: block;
	}

	@media (max-width: 600px) {
		.embed-section {
			padding: 1rem;
		}
	}
</style>
