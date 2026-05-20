<script lang="ts">
	import Who from '$components/home/who.svelte'
	import PostMeta from '$components/PostMeta.svelte'
	import Accordion from '$components/Accordion.svelte'
	import type { PageData } from './$types'

	export let data: PageData

	const title = 'Qui sommes-nous ? - Pause IA'
	const description =
		"Découvrez l'équipe de Pause IA France : direction, conseil scientifique et bénévoles engagés pour une gouvernance responsable de l'intelligence artificielle."
</script>

<PostMeta {title} {description} />

<Who teamMembers={data.teamMembers}>
	<div slot="intro" class="custom-intro">
		<p>
			<strong>
				Pause IA est une <a href="/mentions-legales">association</a> qui alerte les citoyens et les
				pouvoirs publics français sur les <a href="/dangers">graves dangers</a> de la course à l'intelligence
				artificielle, et les incite à agir pour s'y opposer.
			</strong>
		</p>

		<p>
			<strong>
				Pause IA est la représentation en France de <a href="https://pauseai.info">PauseAI Global</a
				>, qui demande un
				<a href="/propositions">moratoire sur l'entraînement des systèmes d'IA généralistes</a>
				jusqu'à ce que toutes les conditions de sécurité et de contrôle démocratique soient réunies.
			</strong>
		</p>

		<Accordion id="quelle-ia">
			<svelte:fragment slot="head">Quelle IA ?</svelte:fragment>
			<svelte:fragment slot="details">
				<ul>
					<li>Nous ne sommes pas contre toute forme d'IA.</li>
					<li>
						Nous sommes contre <strong
							>le développement sans contrôle et sans limite de l'intelligence artificielle
							généraliste</strong
						> car il expose notre civilisation à des risques catastrophiques.
					</li>
				</ul>
			</svelte:fragment>
		</Accordion>

		<Accordion id="pourquoi">
			<svelte:fragment slot="head">Pourquoi ?</svelte:fragment>
			<svelte:fragment slot="details">
				<ul>
					<li>
						Les modèles d'IA généralistes (aujourd'hui tels que GPT, Claude, Gemini) deviennent
						chaque jour plus puissants, ils sont faciles à utiliser et se déploient à grande vitesse
						dans la société, sans réelles normes de sécurité et hors de tout contrôle
						institutionnel.
					</li>
					<li>
						Ils présentent déjà des risques majeurs pour la sécurité de nos infrastructures, pour
						nos institutions, pour notre modèle social.
					</li>
					<li>
						Ces modèles d'IA commencent à échapper à leurs créateurs. Certains le reconnaissent
						publiquement.
					</li>
					<li>
						Dans un scénario catastrophe que l'on ne peut exclure, ils pourraient donner naissance à
						une super-intelligence incontrôlable.
					</li>
				</ul>
			</svelte:fragment>
		</Accordion>

		<Accordion id="que-faire">
			<svelte:fragment slot="head">Que faire ?</svelte:fragment>
			<svelte:fragment slot="details">
				<ul>
					<li>
						Les discours «&nbsp;rassuristes&nbsp;» nous font perdre du temps. <em
							>L'IA ne serait pas vraiment intelligente, les géants de la tech exagéreraient les
							performances de leurs modèles, on serait à la veille de l'explosion d'une bulle
							spéculative…</em
						> Rien de tout cela ne nous protège du danger, bien au contraire.
					</li>
					<li>
						La violence, que nous condamnons par principe, est également contre-productive. Elle
						renforce des antagonismes stériles au moment où l'avenir de l'humanité est en jeu.
					</li>
					<li>
						La seule réponse au danger est la mise en place d'une gouvernance mondiale qui ait les
						moyens institutionnels, techniques et financiers de contrôler l'IA.
					</li>
				</ul>
			</svelte:fragment>
		</Accordion>

		<p>
			Association à but non lucratif enregistrée depuis juin 2024, Pause IA rassemble plus d'une
			centaine d'adhérents et bénévoles. Nous ne recevons aucun financement d'entreprises d'IA ou de
			la tech&nbsp;: notre indépendance vis-à-vis de l'industrie est totale. Notre
			professionnalisation (recrutement d'une directrice exécutive, organisation d'événements comme
			la conférence au Sénat) est rendue possible par les <a href="/dons">dons</a> de nos soutiens, que
			nous consacrons à des événements impactants, à des campagnes de sensibilisation et au fonctionnement
			de notre structure.
		</p>
	</div>
</Who>

<style>
	.custom-intro :global(p) {
		text-align: justify;
	}
	.custom-intro :global(ul) {
		padding-left: 1.25rem;
	}
	.custom-intro :global(li) {
		margin-bottom: 0.5rem;
	}
</style>
