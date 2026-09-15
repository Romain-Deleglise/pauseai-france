<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import EcrireOutil from '$components/EcrireOutil.svelte'
	import YouTubeEmbed from '$components/YouTubeEmbed.svelte'
	import { Landmark, Newspaper, Users, MoveUpRight, Share2 } from 'lucide-svelte'
	import type { PageData } from './$types'

	export let data: PageData
	$: isEn = data.lang === 'en'
	$: prefix = isEn ? '/en' : '/fr'

	// Recentre la vue sur la section presse quand l’outil intégré change d’étape
	// (choix d’un journal / retour), au lieu de remonter en haut de la page.
	let pressSection: HTMLElement
	function scrollToPress() {
		pressSection?.scrollIntoView({ behavior: 'smooth', block: 'start' })
	}

	const VIDEO_ID = 'WhQViEjkg7s'

	// ── À COMPLÉTER avant mise en ligne ───────────────────────────────────────
	// Les articles de blog de la campagne « Perte de contrôle » ne sont pas encore
	// publiés : tant que l’URL est vide, la carte s’affiche sans lien plutôt que
	// de pointer dans le vide.
	const BLOG_CONTROLE_URL = ''
	const BLOG_MORATOIRE_URL = ''
	// Dates du temps fort militant, à renseigner (ex. « du 12 au 19 octobre »).
	const MOBILISATION_DATES = ''
	// ──────────────────────────────────────────────────────────────────────────

	$: title = isEn
		? 'We are on the brink of losing control: let’s react'
		: 'Nous sommes au bord de la perte de contrôle : réagissons'
	$: description = isEn
		? 'AI now outperforms humans at computer security, and the researchers who train these systems no longer fully control them. Join our call for a global moratorium on frontier AI development.'
		: 'L’IA dépasse désormais les humains en sécurité informatique, et les chercheurs qui les entraînent ne les maîtrisent plus. Relayez notre appel à un moratoire mondial sur le développement des IA de pointe.'
</script>

<PostMeta {title} {description} />

<article>
	<!-- ── Hero ─────────────────────────────────────────────── -->
	<header class="hero">
		<h1>
			{isEn
				? 'We are on the brink of losing control: let’s react!'
				: 'Nous sommes au bord de la perte de contrôle : réagissons !'}
		</h1>
	</header>

	<!-- ── Le constat ───────────────────────────────────────── -->
	<section class="prose">
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
	</section>

	<!-- ── Nos analyses ─────────────────────────────────────── -->
	<section class="analyses">
		<h2>{isEn ? 'Our analyses' : 'Nos analyses'}</h2>

		<div class="analysis-card analysis-card--video">
			<div class="analysis-body">
				<h3>{isEn ? '“It will soon be too late”.' : '« Il sera bientôt trop tard ».'}</h3>
				<p class="analysis-byline">
					{isEn
						? 'Maxime Fournes, president of PauseAI global and of PauseIA France'
						: 'Maxime Fournes, président de PauseAI global et de PauseIA France'}
				</p>
			</div>
			<div class="analysis-video">
				<YouTubeEmbed
					id={VIDEO_ID}
					title={isEn ? '“It will soon be too late”' : '« Il sera bientôt trop tard »'}
				/>
			</div>
		</div>

		<div class="analysis-card">
			<div class="analysis-body">
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
				{#if BLOG_CONTROLE_URL}
					<a
						class="analysis-link"
						href={BLOG_CONTROLE_URL}
						target="_blank"
						rel="noopener noreferrer"
					>
						{isEn ? 'Read the article' : 'Lire l’article'}
						<MoveUpRight size="0.85em" aria-hidden="true" />
					</a>
				{/if}
			</div>
		</div>

		<div class="analysis-card">
			<div class="analysis-body">
				<h3>
					{isEn
						? 'Let’s stop frontier AI development before it is too late'
						: 'Stoppons le développement de l’IA de pointe avant qu’il ne soit trop tard'}
				</h3>
				{#if BLOG_MORATOIRE_URL}
					<a
						class="analysis-link"
						href={BLOG_MORATOIRE_URL}
						target="_blank"
						rel="noopener noreferrer"
					>
						{isEn ? 'Read the article' : 'Lire l’article'}
						<MoveUpRight size="0.85em" aria-hidden="true" />
					</a>
				{/if}
			</div>
		</div>
	</section>

	<!-- ── Participez à notre campagne ──────────────────────── -->
	<section class="prose">
		<h2>{isEn ? 'Take part in our campaign' : 'Participez à notre campagne'}</h2>
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
	</section>

	<!-- ── Les trois actions ────────────────────────────────── -->
	<section class="actions">
		<!-- 1 · Rejoindre les militants (groupes locaux) -->
		<div class="action-card">
			<div class="action-head">
				<div class="action-icon"><Users size="1.4rem" aria-hidden="true" /></div>
				<h3>
					<span class="action-step">1</span>
					{#if isEn}
						{MOBILISATION_DATES
							? `${MOBILISATION_DATES}, join the PauseIA activists near you`
							: 'Join the PauseIA activists near you'}
					{:else}
						{MOBILISATION_DATES
							? `${MOBILISATION_DATES}, rejoignez les militants de PauseIA près de chez vous`
							: 'Rejoignez les militants de PauseIA près de chez vous'}
					{/if}
				</h3>
			</div>
			<p>
				{isEn
					? 'Local groups hold street actions, public talks and stands all over France. Find the one closest to you and join the mobilisation.'
					: 'Les groupes locaux organisent des actions de rue, des conférences et des stands partout en France. Trouvez celui le plus proche de chez vous et rejoignez la mobilisation.'}
			</p>
			<a class="action-cta" href="{prefix}/groupes-locaux">
				{isEn ? 'Find my local group' : 'Trouver mon groupe local'}
			</a>
		</div>

		<!-- 2 · Écrire à ses parlementaires (outil intégré) -->
		<div class="action-card">
			<div class="action-head">
				<div class="action-icon"><Landmark size="1.4rem" aria-hidden="true" /></div>
				<h3>
					<span class="action-step">2</span>
					{isEn ? 'Write to your representatives' : 'Écrivez à vos parlementaires'}
				</h3>
			</div>
			<p>
				{isEn
					? 'Representatives take their constituents’ messages into account. Our tool identifies yours and gives you a ready-to-personalise email.'
					: 'Les parlementaires tiennent compte des messages de leurs électeurs. Notre outil identifie le vôtre et vous fournit un email prêt à personnaliser.'}
			</p>
			<a class="action-cta" href="{prefix}/ecrire-a-mes-elus">
				{isEn ? 'Write to my representative' : 'Écrire à mon élu·e'}
			</a>
		</div>

		<!-- 3 · Mobiliser la presse (outil intégré directement sur la page) -->
		<div class="action-card press-block" bind:this={pressSection}>
			<div class="action-head">
				<div class="action-icon"><Newspaper size="1.4rem" aria-hidden="true" /></div>
				<h3>
					<span class="action-step">3</span>
					{isEn ? 'Mobilise the press' : 'Mobilisez la presse'}
				</h3>
			</div>
			<p>
				{isEn
					? 'Newsrooms cover what their readers ask for. Choose the newspaper you read and send it an email, directly here.'
					: 'Les rédactions couvrent ce que leurs lecteurs réclament. Choisissez le journal que vous lisez et envoyez-lui un email, directement ici.'}
			</p>
			<div class="press-tool">
				<EcrireOutil
					lang={data.lang}
					forcedActionId="medias"
					embedded
					requireName
					on:navigate={scrollToPress}
				/>
			</div>
		</div>
	</section>

	<p class="closing">
		<Share2 size="1em" aria-hidden="true" />
		<span>
			{isEn
				? 'Every message counts. To amplify your action, share this campaign around you.'
				: 'Chaque message compte. Pour amplifier votre action, partagez cette campagne autour de vous.'}
		</span>
	</p>
</article>

<style>
	article {
		max-inline-size: 54rem;
		margin-inline: auto;
		margin-top: 2.5rem;
		padding: 0 1.5rem;
	}

	/* ── Hero ─────────────────────────────────────────────── */
	.hero h1 {
		font-size: clamp(2rem, 5vw, 3rem);
		line-height: 1.12;
		margin: 0 0 1.5rem;
		text-wrap: balance;
	}

	/* ── Corps de texte ───────────────────────────────────── */
	.prose {
		margin-block: 2.5rem;
	}

	.prose h2,
	.analyses h2 {
		font-size: clamp(1.4rem, 3vw, 1.8rem);
		margin: 0 0 1rem;
	}

	.prose p {
		font-size: 1.05rem;
		line-height: 1.7;
		margin: 0 0 1.1rem;
	}

	.measures {
		margin: 0.5rem 0 0;
		padding-inline-start: 1.4rem;
		display: grid;
		gap: 0.85rem;
	}

	.measures li {
		font-size: 1.05rem;
		line-height: 1.7;
	}

	/* ── Nos analyses ─────────────────────────────────────── */
	.analyses {
		margin-block: 3rem;
		display: grid;
		gap: 1.25rem;
	}

	.analysis-card {
		border: 1px solid var(--border, rgba(0, 0, 0, 0.12));
		border-radius: 12px;
		padding: 1.5rem;
		background: var(--bg-secondary, rgba(0, 0, 0, 0.02));
	}

	.analysis-card h3 {
		margin: 0 0 0.6rem;
		font-size: 1.15rem;
		line-height: 1.35;
	}

	.analysis-card p {
		margin: 0;
		line-height: 1.65;
	}

	.analysis-byline {
		font-size: 0.95rem;
		color: var(--text-secondary, #676e7a);
	}

	.analysis-video {
		margin-top: 1.25rem;
	}

	.analysis-link {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		margin-top: 0.9rem;
		font-weight: 600;
	}

	/* ── Actions ──────────────────────────────────────────── */
	.actions {
		margin-block: 3rem;
		display: grid;
		gap: 1.25rem;
	}

	.action-card {
		border: 1px solid var(--border, rgba(0, 0, 0, 0.12));
		border-radius: 12px;
		padding: 1.5rem;
	}

	.action-head {
		display: flex;
		align-items: flex-start;
		gap: 0.85rem;
		margin-bottom: 0.75rem;
	}

	.action-icon {
		flex: none;
		display: grid;
		place-items: center;
		inline-size: 2.5rem;
		block-size: 2.5rem;
		border-radius: 50%;
		background: var(--brand-light, rgba(0, 0, 0, 0.05));
	}

	.action-head h3 {
		margin: 0;
		font-size: 1.15rem;
		line-height: 1.35;
		align-self: center;
	}

	.action-step {
		display: inline-grid;
		place-items: center;
		inline-size: 1.5rem;
		block-size: 1.5rem;
		margin-inline-end: 0.4rem;
		border-radius: 50%;
		background: var(--brand, #ff9416);
		color: #fff;
		font-size: 0.85rem;
		font-weight: 700;
		vertical-align: middle;
	}

	.action-card > p {
		margin: 0 0 1.1rem;
		line-height: 1.65;
	}

	.action-cta {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.7rem 1.2rem;
		border-radius: 8px;
		background: var(--brand, #ff9416);
		color: #fff;
		font-weight: 600;
		text-decoration: none;
	}

	.action-cta:hover {
		filter: brightness(0.94);
	}

	.press-tool {
		margin-top: 0.5rem;
	}

	/* ── Clôture ──────────────────────────────────────────── */
	.closing {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		margin-block: 3rem 4rem;
		padding: 1rem 1.25rem;
		border-radius: 10px;
		background: var(--bg-secondary, rgba(0, 0, 0, 0.03));
		line-height: 1.6;
	}

	@media (max-width: 640px) {
		article {
			padding: 0 1rem;
		}

		.analysis-card,
		.action-card {
			padding: 1.15rem;
		}
	}
</style>
