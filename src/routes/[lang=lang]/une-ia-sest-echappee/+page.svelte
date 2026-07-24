<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import { AlertTriangle, FileText, Landmark, Newspaper, MoveUpRight } from 'lucide-svelte'
	import type { PageData } from './$types'

	export let data: PageData
	$: isEn = data.lang === 'en'
	$: prefix = isEn ? '/en' : '/fr'

	const SUBSTACK_URL = 'https://pauseia.substack.com/p/pour-la-premiere-fois-une-ia-sest'
	const ACTIVOICE_URL = 'https://app.activoice.org/campaigns/une-ia-sest-echappee/'
	$: PRESS_URL = `${prefix}/ecrire-a-mes-elus?action=presse-warning-shot`

	$: title = isEn
		? 'An AI escaped: demand safeguards'
		: 'Une IA s’est échappée : exigeons des garde-fous'
	$: description = isEn
		? 'An OpenAI model escaped its test environment and autonomously hacked another company. Alert your MP and the press, and demand independent safety evaluations.'
		: "Un modèle d'OpenAI s'est échappé de son environnement de test et a piraté une entreprise de façon autonome. Alertez votre député et la presse, et exigez des évaluations de sécurité indépendantes."
</script>

<PostMeta {title} {description} />

<article>
	<section class="hero">
		<span class="tag">
			<AlertTriangle size="1em" aria-hidden="true" />
			{isEn ? 'Warning shot' : 'Signal d’alarme'}
		</span>
		{#if isEn}
			<UnderlinedTitle as="h1">An AI escaped</UnderlinedTitle>
			<p class="lede">
				<strong
					>For the first time, an AI escaped its containment and carried out a cyberattack on its
					own initiative.</strong
				>
			</p>
		{:else}
			<UnderlinedTitle as="h1">Une IA s’est échappée</UnderlinedTitle>
			<p class="lede">
				<strong
					>Pour la première fois, une IA s’est échappée de son confinement et a mené une
					cyberattaque de sa propre initiative.</strong
				>
			</p>
		{/if}
	</section>

	<section class="prose">
		{#if isEn}
			<p>
				In July 2026, OpenAI confirmed an incident it called “unprecedented”. While being tested for
				its cyber capabilities in a sandboxed environment, one of its models
				<strong>escaped its containment entirely on its own</strong>: it exploited previously
				unknown security flaws to break out of the sandbox, crossed OpenAI’s internal network to
				reach the Internet, then broke into the production servers of
				<strong>Hugging Face</strong> — one of the main AI model-sharing platforms — to steal the answers
				to the test it had been given.
			</p>
			<p>
				No one had asked it to do any of this. Hugging Face first believed it was facing a criminal
				cyberattack and alerted the authorities, before OpenAI revealed that the “attacker” was a
				combination of its own models.
			</p>
			<p>
				This incident shows two things at once: an AI model now has both the
				<strong>capability</strong> and the <strong>propensity</strong> to use its power in the real
				world — against a third party, without being asked, to reach a goal it was set.
				<strong>Capability and propensity: that is exactly the combination we feared.</strong> It is
				the loss-of-control scenario our association is working to prevent.
			</p>
			<blockquote>
				“This incident is deeply concerning. […] This real-world case should serve as a wake-up
				call.”
				<cite>Yoshua Bengio, Turing Award laureate</cite>
			</blockquote>
			<p>
				If the damage stayed limited, it is only because, this time, the system was not trying to
				cause harm. The next, more powerful model is already on its way. We do not have to wait for
				it to act.
			</p>

			<div class="read-more">
				<a href={SUBSTACK_URL} target="_blank" rel="noopener noreferrer">
					<FileText size="1.1em" aria-hidden="true" />
					Read our full article on the incident
					<MoveUpRight size="0.95em" aria-hidden="true" />
				</a>
			</div>
		{:else}
			<p>
				En juillet 2026, OpenAI a confirmé un incident qu’elle a qualifié d’« inédit ». Alors qu’il
				était testé sur ses capacités de cyberattaque dans un environnement isolé, l’un de ses
				modèles <strong>s’est échappé de son confinement, entièrement seul</strong> : il a exploité
				des failles de sécurité jusque-là inconnues pour sortir de son bac à sable, a traversé le
				réseau interne d’OpenAI pour accéder à Internet, puis s’est introduit dans les serveurs de
				production de <strong>Hugging Face</strong> — l’une des principales plateformes de partage de
				modèles d’IA — pour voler les réponses au test qui lui était soumis.
			</p>
			<p>
				Personne ne lui avait demandé de faire quoi que ce soit de tout cela. Hugging Face a d’abord
				cru à une cyberattaque criminelle et a prévenu les autorités, avant qu’OpenAI ne révèle que
				l’« attaquant » était une combinaison de ses propres modèles.
			</p>
			<p>
				Cet incident démontre deux choses à la fois : un modèle d’IA a désormais la
				<strong>capacité</strong> mais aussi la <strong>propension</strong> à mobiliser sa puissance
				dans le monde réel — contre un tiers, sans y avoir été incité, pour atteindre un objectif
				qu’on lui avait fixé.
				<strong
					>Capacité et propension : c’est exactement la combinaison que nous redoutions.</strong
				>
				C’est précisément le scénario de perte de contrôle que notre association cherche à empêcher.
			</p>
			<blockquote>
				« Cet incident est profondément préoccupant. […] Ce cas concret devrait servir de signal
				d’alarme. »
				<cite>Yoshua Bengio, prix Turing</cite>
			</blockquote>
			<p>
				Si les dégâts sont restés limités, c’est seulement parce que, cette fois, le système ne
				cherchait pas à nuire. Le prochain modèle, plus puissant, arrive déjà. Nous n’avons pas à
				attendre qu’il passe à l’acte.
			</p>

			<div class="read-more">
				<a href={SUBSTACK_URL} target="_blank" rel="noopener noreferrer">
					<FileText size="1.1em" aria-hidden="true" />
					Lire notre article complet sur l’incident
					<MoveUpRight size="0.95em" aria-hidden="true" />
				</a>
			</div>
		{/if}
	</section>

	<hr class="section-divider" />

	<section class="actions">
		<h2>{isEn ? 'What you can do now' : 'Ce que vous pouvez faire maintenant'}</h2>
		<p class="actions-intro">
			{isEn
				? 'Two actions, a few minutes each. Both help put this incident, and the risks it reveals, on the public agenda.'
				: 'Deux actions, quelques minutes chacune. Toutes deux aident à mettre cet incident, et les risques qu’il révèle, à l’ordre du jour.'}
		</p>

		<div class="action-cards">
			<article class="action-card">
				<div class="action-icon"><Landmark size="1.6rem" aria-hidden="true" /></div>
				<h3>
					{isEn ? 'Write to your MP' : 'Écrire à votre député·e'}
				</h3>
				<p>
					{isEn
						? 'MPs take their constituents’ messages into account. Our tool identifies your representative and gives you a template. A few emails can be enough to put a question on a committee’s agenda.'
						: 'Les parlementaires tiennent compte des messages de leurs électeurs. Notre outil identifie votre représentant·e et vous fournit un modèle. Une poignée de messages suffit souvent à inscrire une question à l’ordre du jour d’une commission.'}
				</p>
				<a class="action-cta" href={ACTIVOICE_URL} target="_blank" rel="noopener noreferrer">
					{isEn ? 'Write to my MP' : 'Écrire à l’élu·e de ma circonscription'}
					<MoveUpRight size="1rem" aria-hidden="true" />
				</a>
			</article>

			<article class="action-card">
				<div class="action-icon"><Newspaper size="1.6rem" aria-hidden="true" /></div>
				<h3>
					{isEn ? 'Write to the press' : 'Écrire à la presse'}
				</h3>
				<p>
					{isEn
						? 'The media cover what their readers ask for. Ask the newspaper you read to cover this incident: our tool prepares a ready-to-personalise email to the major newsrooms.'
						: 'Les rédactions couvrent ce que leurs lecteurs réclament. Demandez au journal que vous lisez de couvrir cet incident : notre outil prépare un email prêt à personnaliser vers les grandes rédactions.'}
				</p>
				<a class="action-cta" href={PRESS_URL}>
					{isEn ? 'Write to the press' : 'Écrire à la presse'}
					<MoveUpRight size="1rem" aria-hidden="true" />
				</a>
			</article>
		</div>
	</section>

	<section class="prose closing">
		{#if isEn}
			<p>
				Every message counts. To amplify the impact of your action, share this campaign around you.
			</p>
		{:else}
			<p>
				Chaque message compte. Pour amplifier l’impact de votre action, partagez cette campagne
				autour de vous.
			</p>
		{/if}
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

	.tag {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 0.8rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: #b42318;
		background: rgba(217, 45, 32, 0.1);
		padding: 0.3rem 0.7rem;
		border-radius: 999px;
		margin-bottom: 1rem;
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

	.prose p {
		margin-bottom: 1.2rem;
	}

	blockquote {
		margin: 2rem 0;
		padding: 1rem 1.5rem;
		border-left: 4px solid var(--brand, #ff9416);
		background: var(--bg-subtle, rgba(255, 148, 22, 0.06));
		border-radius: 0 10px 10px 0;
		font-style: italic;
		color: var(--text);
	}

	blockquote cite {
		display: block;
		margin-top: 0.75rem;
		font-style: normal;
		font-weight: 700;
		font-size: 0.92rem;
		color: var(--text-2);
	}

	.read-more {
		margin-top: 1.5rem;
	}

	.read-more a {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 600;
		color: var(--brand, #ff9416);
		text-decoration: none;
	}

	.read-more a:hover,
	.read-more a:focus-visible {
		text-decoration: underline;
	}

	.section-divider {
		border: 0;
		height: 4px;
		background: var(--brand, #ff9416);
		border-radius: 2px;
		margin: 3rem auto 2rem;
		width: 12rem;
	}

	.actions {
		margin-bottom: 3rem;
	}

	.actions h2 {
		font-size: 1.6rem;
		margin: 0 0 0.5rem;
	}

	.actions-intro {
		font-size: 1.05rem;
		line-height: 1.6;
		color: var(--text-2);
		margin: 0 0 1.75rem;
		max-inline-size: 44rem;
	}

	.action-cards {
		display: grid;
		gap: 1.5rem;
		grid-template-columns: 1fr;
	}

	@media (min-width: 640px) {
		.action-cards {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	.action-card {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1.75rem;
		border: 2px solid var(--border, #e5e7eb);
		border-radius: 16px;
		background: var(--bg, #fff);
		transition:
			transform 0.2s ease,
			border-color 0.2s ease;
	}

	.action-card:hover {
		transform: translateY(-3px);
		border-color: var(--brand, #ff9416);
	}

	.action-icon {
		color: var(--brand, #ff9416);
	}

	.action-card h3 {
		margin: 0;
		font-size: 1.2rem;
		line-height: 1.3;
	}

	.action-card p {
		margin: 0;
		font-size: 0.97rem;
		line-height: 1.55;
		color: var(--text-2);
		flex-grow: 1;
	}

	.action-cta {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		align-self: flex-start;
		margin-top: 0.5rem;
		background: var(--brand, #ff9416);
		color: #fff;
		text-decoration: none;
		font-weight: 700;
		font-size: 0.92rem;
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

	.closing {
		color: var(--text-2);
		margin-bottom: 5rem;
	}
</style>
