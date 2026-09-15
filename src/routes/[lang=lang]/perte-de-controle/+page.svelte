<script lang="ts">
	import {
		CampaignPage,
		CampaignHero,
		CampaignSection,
		CampaignEmbed,
		LumaCalendar
	} from '$components/campaign'
	import EcrireOutil from '$components/EcrireOutil.svelte'
	import Button from '$components/Button.svelte'
	import { onMount } from 'svelte'
	import type { PageData } from './$types'

	export let data: PageData
	$: isEn = data.lang === 'en'
	$: prefix = isEn ? '/en' : '/fr'

	// Recentre la vue sur la section presse quand l'outil intégré change d'étape
	// (choix d'un journal / retour), au lieu de remonter en haut de la page.
	let pressSection: HTMLElement
	// Déplié via l'ancre #ecrire (bouton du hero ou lien partagé).
	let toolOpen = false
	function scrollToPress() {
		pressSection?.scrollIntoView({ behavior: 'smooth', block: 'start' })
	}

	// Le bouton du hero pointe sur #ecrire. Button ne relaie pas le clic sur sa
	// variante lien, donc on écoute le hash : l'outil se déplie aussi bien au
	// clic du bouton que sur un lien partagé /perte-de-controle#ecrire.
	onMount(() => {
		const sync = () => {
			if (window.location.hash === '#ecrire') toolOpen = true
		}
		sync()
		window.addEventListener('hashchange', sync)
		return () => window.removeEventListener('hashchange', sync)
	})

	const VIDEO_ID = 'WhQViEjkg7s'
	// Calendrier Luma des actions militantes (agrège aussi les événements créés
	// par d'autres organisateurs).
	const LUMA_CALENDAR_ID = 'cal-5ZNtr1GO7aUSyiY'

	// ── À COMPLÉTER avant mise en ligne ───────────────────────────────────────
	// Dates du temps fort militant, à renseigner (ex. « du 12 au 19 octobre »).
	const MOBILISATION_DATES = ''
	// ──────────────────────────────────────────────────────────────────────────

	$: title = isEn
		? 'We are on the brink of losing control: let’s react'
		: 'Nous sommes au bord de la perte de contrôle : réagissons'
	$: description = isEn
		? 'AI now outperforms humans at computer security, and the researchers who train these systems no longer control them. Join our call for a global moratorium on frontier AI development.'
		: 'L’IA dépasse désormais les humains en sécurité informatique, et les chercheurs qui les entraînent ne les maîtrisent plus. Relayez notre appel à un moratoire mondial sur le développement des IA de pointe.'

	$: mobilisationTitle = isEn
		? MOBILISATION_DATES
			? `${MOBILISATION_DATES}, join the PauseIA activists near you`
			: 'Join the PauseIA activists near you'
		: MOBILISATION_DATES
			? `${MOBILISATION_DATES}, rejoignez les militants de PauseIA près de chez vous`
			: 'Rejoignez les militants de PauseIA près de chez vous'
</script>

<CampaignPage {title} {description}>
	<CampaignHero
		title={isEn
			? 'We are on the brink of losing control: let’s react!'
			: 'Nous sommes au bord de la perte de contrôle : réagissons !'}
		eyebrow={isEn ? 'Campaign under way' : 'Campagne en cours'}
		lede={isEn
			? 'We are asking for the race to superintelligence to stop, for as long as nobody knows how to build these systems safely. No government will move on this while it stays a subject for insiders.'
			: 'Nous demandons l’arrêt de la course à la superintelligence, tant que personne ne sait construire ces systèmes sans danger. Aucun gouvernement ne bougera là-dessus si le sujet reste réservé aux initiés.'}
	>
		<!-- Un visiteur déjà convaincu doit pouvoir agir sans traverser la page. -->
		<Button href="#ecrire">{isEn ? 'Take action now' : 'Passer à l’action'}</Button>
	</CampaignHero>

	<!-- ── Le constat ───────────────────────────────────────── -->
	<CampaignSection>
		{#if isEn}
			<p>
				AI now outperforms humans at computer security. Given that security and hacking are two
				sides of the same expertise, and that attack is incomparably easier than defence,
				<strong>AI has become a weapon of mass cybercrime</strong>.
			</p>
			<p>
				On top of that, recent incidents have shown that the researchers who train these AIs no
				longer control them well enough. They are building
				<strong
					>highly intelligent autonomous agents that escape their oversight and their control.</strong
				>
			</p>
			<p>
				In a world entirely dependent on digital technology, we are therefore at the mercy of a
				series of <strong>deliberate but also accidental disasters.</strong>
			</p>
			<p>
				The warnings keep coming. The latest: researcher Jacob Coxon has just resigned from
				Anthropic, stating that
				<strong
					>“The people building AI sincerely believe it could kill us all by the end of the decade.
					This is not a marketing stunt”.</strong
				>
			</p>
			<p>
				In response, the American labs promise to agree among themselves to devote a little more
				time and resources to safety.
				<strong>A derisory promise, an astounding situation: we must react.</strong>
			</p>
		{:else}
			<p>
				L’IA dépasse désormais les humains en matière de sécurité informatique. Sachant que sécurité
				et piratage sont deux facettes d’une même expertise et que l’attaque est incomparablement
				plus facile que la défense,
				<strong>l’IA est devenue une arme de cybercriminalité massive</strong>.
			</p>
			<p>
				En outre, de récents incidents ont montré que les chercheurs qui entraînent les IA ne les
				maîtrisent plus suffisamment. Ils créent des
				<strong
					>agents autonomes très intelligents qui échappent à leur surveillance et à leur contrôle.</strong
				>
			</p>
			<p>
				Dans un monde entièrement dépendant des technologies numériques, nous sommes donc à la merci
				d’une série de <strong>catastrophes intentionnelles mais aussi accidentelles.</strong>
			</p>
			<p>
				Les alertes se multiplient. Dernière en date, le chercheur Jacob Coxon vient de démissionner
				d’Anthropic en affirmant
				<strong
					>« Les gens qui construisent l’IA croient sincèrement qu’elle pourrait tous nous tuer
					d’ici à la fin de la décennie. Ce n’est pas un coup marketing ».</strong
				>
			</p>
			<p>
				En réaction, les laboratoires américains promettent de s’entendre pour dédier un peu plus de
				temps et de moyens à la sécurité.
				<strong>Une promesse dérisoire, une situation hallucinante : nous devons réagir.</strong>
			</p>
		{/if}
	</CampaignSection>

	<!-- ── Nos analyses ─────────────────────────────────────── -->
	<CampaignSection id="analyses" title={isEn ? 'Our analyses' : 'Nos analyses'}>
		<div class="analyses">
			<div class="analysis">
				<h3>{isEn ? '“It will soon be too late”.' : '« Il sera bientôt trop tard ».'}</h3>
				<p class="byline">
					{isEn
						? 'Maxime Fournes, president of PauseAI global and of PauseIA France'
						: 'Maxime Fournes, président de PauseAI global et de PauseIA France'}
				</p>
				<CampaignEmbed
					src="https://www.youtube-nocookie.com/embed/{VIDEO_ID}"
					title={isEn ? '“It will soon be too late”' : '« Il sera bientôt trop tard »'}
					height={340}
					mobileHeight={220}
				/>
			</div>

			<div class="analysis">
				<h3>
					{isEn
						? 'Nobody controls AI, the danger is imminent'
						: 'Personne ne contrôle l’IA, le danger est imminent'}
				</h3>
				<p>
					{isEn
						? 'When AI masters computing better than the world’s best experts, we humans enter a zone of great danger.'
						: 'Quand l’IA maîtrise l’informatique mieux que les meilleurs experts du monde, nous, humains, entrons dans une zone de grand danger.'}
				</p>
				<p class="analysis-link">
					<a href="{prefix}/personne-ne-controle-lia">
						{isEn ? 'Read the article' : 'Lire l’article'}
					</a>
				</p>
			</div>
		</div>
	</CampaignSection>

	<!-- ── Participez à notre campagne ──────────────────────── -->
	<CampaignSection
		id="campagne"
		title={isEn ? 'Take part in our campaign' : 'Participez à notre campagne'}
	>
		{#if isEn}
			<p>
				Relay the call for a <strong>real pause</strong>: the race to superintelligence must be
				stopped by putting in place a
				<strong>global moratorium on the development of frontier AI</strong>. Framed by an
				<strong>international treaty</strong>, this moratorium must last for as long as the
				feasibility of safe AI has not been
				<strong>scientifically demonstrated.</strong>
			</p>
			<p>
				Time is short, but we can act. Citizen and political will can speed up the moratorium and
				win <strong>two immediate safeguards</strong>:
			</p>
		{:else}
			<p>
				Relayez l’appel à une <strong>véritable pause</strong> : il faut arrêter la course à la
				super-intelligence en instaurant un
				<strong>moratoire mondial sur le développement des IA de pointe</strong>. Encadré par un
				<strong>traité international</strong>, ce moratoire devra durer tant que la faisabilité
				d’une IA sécurisée ne sera pas <strong>scientifiquement démontrée.</strong>
			</p>
			<p>
				Le temps presse mais nous pouvons agir. La volonté citoyenne et politique peut accélérer
				l’instauration de la pause et obtenir
				<strong>deux mesures de sauvegarde immédiates</strong> :
			</p>
		{/if}
		<ol class="measures">
			<li>
				{#if isEn}
					That the labs developing these frontier systems be subject to
					<strong>independent safety evaluations.</strong>
				{:else}
					Que les laboratoires qui développent ces systèmes de pointe soient soumis à des
					<strong>évaluations de sécurité indépendantes.</strong>
				{/if}
			</li>
			<li>
				{#if isEn}
					That <strong>AI-related safety incidents be reported</strong> to authorities with policing
					powers, and made public.
				{:else}
					Que les <strong>incidents de sécurité liés à l’IA soient déclarés</strong> aux autorités ayant
					pouvoir de police et rendus publics.
				{/if}
			</li>
		</ol>
	</CampaignSection>

	<!-- ── Action 1 · Mobilisation militante (calendrier Luma) ─ -->
	<CampaignSection id="evenements" variant="card" title={mobilisationTitle}>
		<p>
			{isEn
				? 'Local groups hold street actions, public talks and stands all over France. Find the one closest to you and join the mobilisation.'
				: 'Les groupes locaux organisent des actions de rue, des conférences et des stands partout en France. Trouvez celui le plus proche de chez vous et rejoignez la mobilisation.'}
		</p>
		<LumaCalendar
			calendarId={LUMA_CALENDAR_ID}
			title={isEn ? 'Upcoming Pause IA events' : 'Prochains événements Pause IA'}
			collapsible
			summary={isEn ? 'See upcoming dates' : 'Voir les prochaines dates'}
			height={420}
			mobileHeight={520}
		/>
		<p class="cta-row">
			<Button href="{prefix}/groupes-locaux" alt>
				{isEn ? 'Find my local group' : 'Trouver mon groupe local'}
			</Button>
		</p>
	</CampaignSection>

	<!-- ── Action 2 · Écrire à ses élus et à la presse ───────── -->
	<!--
		Une seule section : l'outil gère lui-même le basculement entre « élus » et
		« presse » via ses onglets. Le sortir en deux blocs faisait doublon.
	-->
	<div bind:this={pressSection}>
		<CampaignSection
			id="ecrire"
			variant="card"
			title={isEn
				? 'Write to your representatives and the press'
				: 'Écrivez à vos élus et à la presse'}
		>
			<!--
				L'outil est un formulaire multi-étapes très haut : replié, il ne coûte
				qu'une ligne au bas de page et s'ouvre en un clic. headingLevel=h3
				pour qu'il s'imbrique sous le h2 de la section au lieu de le doubler.
			-->
			<details class="tool-details" bind:open={toolOpen}>
				<summary>
					{isEn ? 'Open the tool and write my email' : 'Ouvrir l’outil et rédiger mon email'}
				</summary>
				<div class="tool-body">
					<EcrireOutil
						lang={data.lang}
						embedded
						requireName
						headingLevel="h3"
						on:navigate={scrollToPress}
					/>
				</div>
			</details>
		</CampaignSection>
	</div>
</CampaignPage>

<style>
	.analyses {
		display: grid;
		gap: 1.25rem;
	}

	.analysis {
		padding: 1.5rem;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: 14px;
	}

	.analysis h3 {
		margin: 0 0 0.6rem;
		font-size: 1.15rem;
		line-height: 1.35;
	}

	.analysis p {
		margin: 0;
	}

	.byline {
		color: var(--text-2);
		font-size: 0.95rem;
		margin-bottom: 1.25rem !important;
	}

	.analysis-link {
		margin-top: 0.9rem !important;
		font-weight: 600;
	}

	.analysis-link a {
		color: var(--brand-subtle);
	}

	.measures {
		margin: 0.5rem 0 0;
		padding-inline-start: 1.4rem;
		display: grid;
		gap: 0.85rem;
	}

	.measures li {
		line-height: 1.75;
	}

	.cta-row {
		margin-top: 1.5rem;
	}

	.tool-details > summary {
		cursor: pointer;
		font-weight: 700;
		padding: 0.5rem 0;
		color: var(--brand-subtle);
	}

	.tool-body {
		margin-top: 1.25rem;
	}
</style>
