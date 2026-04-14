<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import Button from '$lib/components/Button.svelte'
	import type { PageData } from './$types'

	export let data: PageData
	$: lang = data.lang
	$: isEn = lang === 'en'

	type Theme = 'individus' | 'societe' | 'economie' | 'humanite'

	const themes: { id: Theme; label: string; labelEn: string }[] = [
		{ id: 'individus', label: 'Vie privée et surveillance', labelEn: 'Privacy and surveillance' },
		{
			id: 'societe',
			label: 'Désinformation et démocratie',
			labelEn: 'Disinformation and democracy'
		},
		{ id: 'economie', label: 'Emploi et automatisation', labelEn: 'Jobs and automation' },
		{ id: 'humanite', label: 'Risques existentiels', labelEn: 'Existential risks' }
	]

	let selectedThemes = new Set<Theme>(['individus', 'societe', 'economie', 'humanite'])

	function toggleTheme(theme: Theme) {
		const next = new Set(selectedThemes)
		if (next.has(theme)) {
			if (next.size > 1) next.delete(theme)
		} else {
			next.add(theme)
		}
		selectedThemes = next
	}

	type Version = 'short' | 'long'
	let version: Version = 'long'

	let copied = false
	function copyEmail() {
		const el = document.getElementById('email-body')
		if (!el) return
		navigator.clipboard.writeText(el.innerText).then(() => {
			copied = true
			setTimeout(() => {
				copied = false
			}, 2500)
		})
	}

	$: subject = isEn
		? 'AI risks: concern from a constituent'
		: "Risques liés aux systèmes d'IA avancés"
</script>

<PostMeta
	title={isEn ? 'Write to your representatives | Pause AI' : 'Écrivez à vos élu·es | Pause IA'}
	description={isEn
		? 'Take 5 minutes to write to your MP and senator about the risks of advanced AI systems. Use our email template to get started.'
		: "Prenez 5 minutes pour écrire à votre député·e et à votre sénateur·rice sur les risques des systèmes d'IA avancés."}
/>

<article>
	<section class="hero">
		<UnderlinedTitle as="h1">
			{isEn ? 'Write to your representatives' : 'Écrivez à vos élu·es'}
		</UnderlinedTitle>
		<p class="hero-subtitle">
			{#if isEn}
				A 5-minute action to put AI risks on the agenda of your elected officials
			{:else}
				Une action en 5 minutes pour mettre les risques de l'IA à l'agenda de vos représentants
			{/if}
		</p>
	</section>

	<!-- ── Pourquoi écrire ── -->
	<section class="content-section">
		<h2>{isEn ? 'Why write?' : 'Pourquoi écrire ?'}</h2>
		{#if isEn}
			<p>
				The most powerful AI systems are being developed without independent oversight or an
				adequate regulatory framework. Companies self-assess. No thresholds define what is too
				dangerous to deploy.
			</p>
			<p>
				A personal email to your MP or senator remains one of the most effective ways to put this
				issue on their agenda. It takes five minutes.
			</p>
		{:else}
			<p>
				Les systèmes d'IA les plus puissants se développent sans supervision indépendante ni cadre
				réglementaire adapté. Les entreprises s'auto-évaluent. Aucun seuil ne définit ce qui est
				trop dangereux pour être déployé.
			</p>
			<p>
				Un email personnel à votre député·e ou sénateur·rice reste l'un des moyens les plus
				efficaces pour inscrire ce sujet à leur agenda. Cela prend cinq minutes.
			</p>
		{/if}
	</section>

	<!-- ── Comment faire ── -->
	<section class="content-section">
		<h2>{isEn ? 'How to do it' : 'Comment faire'}</h2>

		<!-- Étape 1 -->
		<div class="step">
			<div class="step-number">1</div>
			<div class="step-content">
				<h3>{isEn ? 'Find your representatives' : 'Trouvez vos représentants'}</h3>
				{#if isEn}
					<p>
						Use these links to find your MP (deputy) and senator(s) for your area. Note that each
						department has at least one senator, sometimes several.
					</p>
				{:else}
					<p>
						Utilisez ces liens pour trouver votre député·e et votre (ou vos) sénateur·rice·s. Chaque
						département compte au moins un·e sénateur·rice, parfois plusieurs selon la population.
					</p>
				{/if}
				<div class="find-links">
					<a
						class="find-btn"
						href="https://www.nosdeputes.fr/"
						target="_blank"
						rel="noopener noreferrer"
					>
						<span class="find-icon">🏛️</span>
						<span>
							<strong>{isEn ? 'Find my MP' : 'Trouver mon député·e'}</strong>
							<small>nosdeputes.fr</small>
						</span>
					</a>
					<a
						class="find-btn"
						href="https://www.nossenateurs.fr/"
						target="_blank"
						rel="noopener noreferrer"
					>
						<span class="find-icon">🏛️</span>
						<span>
							<strong>{isEn ? 'Find my senator(s)' : 'Trouver mon/mes sénateur·rice·s'}</strong>
							<small>nossenateurs.fr</small>
						</span>
					</a>
				</div>
			</div>
		</div>

		<!-- Étape 2 -->
		<div class="step">
			<div class="step-number">2</div>
			<div class="step-content">
				<h3>{isEn ? 'Choose your concerns' : 'Choisissez vos préoccupations'}</h3>
				{#if isEn}
					<p>
						Select the risks that concern you most. The email template will adapt automatically.
						Keep all selected for the most complete message.
					</p>
				{:else}
					<p>
						Sélectionnez les risques qui vous préoccupent le plus. Le modèle d'email s'adaptera
						automatiquement. Gardez tout sélectionné pour un message plus complet.
					</p>
				{/if}
				<div class="theme-chips">
					{#each themes as theme}
						<button
							class="chip"
							class:active={selectedThemes.has(theme.id)}
							on:click={() => toggleTheme(theme.id)}
							aria-pressed={selectedThemes.has(theme.id)}
						>
							{isEn ? theme.labelEn : theme.label}
						</button>
					{/each}
				</div>
			</div>
		</div>

		<!-- Étape 3 -->
		<div class="step">
			<div class="step-number">3</div>
			<div class="step-content">
				<h3>{isEn ? 'Send your email' : 'Envoyez votre email'}</h3>

				<!-- Conseils -->
				<div class="tips-box">
					<h4>{isEn ? 'A few tips' : 'Quelques conseils'}</h4>
					{#if isEn}
						<ul>
							<li>
								<strong>Be brief.</strong> A short, clear email is more likely to be read than a long
								one.
							</li>
							<li>
								<strong>Personalise it.</strong> Parliamentary teams recognise mass emails. Even one
								or two sentences in your own words carry much more weight.
							</li>
							<li>
								<strong>Mention your constituency.</strong> Include your full name and your town or district.
								Teams sort mail by constituency.
							</li>
							<li>
								<strong>No need to be an expert.</strong> You don't have to explain the technical details
								what matters is signalling that real citizens care about this.
							</li>
							<li>
								<strong>BCC us.</strong> Add <code>campagne@pauseia.fr</code> in BCC when you send. This
								helps us count the letters sent.
							</li>
						</ul>
					{:else}
						<ul>
							<li>
								<strong>Soyez bref.</strong> Un email court et clair a plus de chances d'être lu qu'un
								long message.
							</li>
							<li>
								<strong>Personnalisez.</strong> Les équipes parlementaires reconnaissent les emails de
								masse. Même une ou deux phrases de votre cru ont bien plus de poids.
							</li>
							<li>
								<strong>Mentionnez votre circonscription.</strong> Indiquez votre nom complet et votre
								commune ou arrondissement. Les équipes trient le courrier par circonscription.
							</li>
							<li>
								<strong>Inutile d'être expert·e.</strong> Vous n'avez pas à expliquer les détails techniques.
								L'important est de montrer que de vrais citoyens s'en préoccupent.
							</li>
							<li>
								<strong>Mettez-nous en copie cachée.</strong> Ajoutez
								<code>campagne@pauseia.fr</code>
								en CCI lors de l'envoi. Cela nous aide à comptabiliser les lettres envoyées.
							</li>
						</ul>
					{/if}
				</div>

				<!-- Sélecteur de version -->
				<div class="version-tabs">
					<button
						class="tab-btn"
						class:active={version === 'short'}
						on:click={() => (version = 'short')}
					>
						{isEn ? 'Short version' : 'Version courte'}
					</button>
					<button
						class="tab-btn"
						class:active={version === 'long'}
						on:click={() => (version = 'long')}
					>
						{isEn ? 'Full version' : 'Version complète'}
					</button>
				</div>

				<!-- Modèle d'email -->
				<div class="email-preview">
					<div class="email-subject-line">
						<span class="subject-label">{isEn ? 'Subject:' : 'Objet :'}</span>
						<span>{subject}</span>
					</div>
					<div class="email-body" id="email-body">
						{#if version === 'short'}
							{#if isEn}
								<p>Dear [Deputy/Senator name],</p>
								<p>My name is [your name] and I am a resident of [your town/constituency].</p>
								<p>
									I am writing to draw your attention to the rapid development of increasingly
									autonomous artificial intelligence systems. The leaders of the world's largest AI
									labs acknowledge that these technologies could pose a serious threat to
									civilisation if their development is not properly governed. An international
									report led by Turing Prize winner Yoshua Bengio, backed by 30 countries, confirms
									that no current safety method is reliable.
								</p>
								<p>
									There is currently no legal framework requiring independent safety evaluations
									before these systems are developed or deployed. Companies self-regulate.
								</p>
								<p>
									I ask you to put this issue on your committee's agenda and to support measures
									requiring independent safety evaluations for the most powerful AI systems.
								</p>
								<p>
									The Pause AI association (pauseia.fr) would be happy to provide a briefing to you
									or your team.
								</p>
								<p>
									Yours sincerely,<br />
									[Your full name]<br />
									[Your town / constituency]
								</p>
							{:else}
								<p>Madame/Monsieur le/la Député·e / Sénateur·rice [nom],</p>
								<p>Je suis [votre nom], habitant·e de [votre commune].</p>
								<p>
									Je vous contacte au sujet du développement rapide de systèmes d'intelligence
									artificielle de plus en plus autonomes et puissants. Les dirigeants des plus
									grands laboratoires d'IA reconnaissent eux-mêmes que ces technologies pourraient
									représenter une menace sérieuse pour la civilisation si leur développement n'est
									pas correctement encadré. Un rapport international dirigé par le prix Turing
									Yoshua Bengio, soutenu par 30 pays, confirme qu'aucune méthode de sécurité
									actuelle n'est fiable.
								</p>
								<p>
									Il n'existe aujourd'hui aucun cadre juridique exigeant des évaluations de sécurité
									indépendantes avant que ces systèmes ne soient développés ou déployés. Les
									entreprises s'auto-évaluent.
								</p>
								<p>
									Je vous demande d'inscrire ce sujet à l'ordre du jour de votre commission et de
									soutenir des mesures imposant des évaluations de sécurité indépendantes pour les
									systèmes d'IA les plus puissants.
								</p>
								<p>
									L'association Pause IA (pauseia.fr) serait heureuse de vous fournir un briefing, à
									vous ou à votre équipe.
								</p>
								<p>
									Cordialement,<br />
									[Votre nom complet]<br />
									[Votre commune / circonscription]
								</p>
							{/if}
						{:else}
							<!-- Version longue -->
							{#if isEn}
								<p>Dear [Deputy/Senator name],</p>
								<p>My name is [your name] and I am a resident of [your town/constituency].</p>
								<p>
									I am writing about an issue I consider one of the most important for our
									collective security in the years ahead: the development of increasingly autonomous
									and capable artificial intelligence systems, in the absence of any adequate
									regulatory framework.
								</p>
								<p>
									<strong>Rapidly growing capabilities.</strong> The world's largest AI labs (OpenAI,
									Google DeepMind, Anthropic, Meta and others) are currently building systems that can
									write code, use computer tools, browse the web and act autonomously. The next generations
									of these systems will be significantly more powerful. Their own creators acknowledge
									that they do not yet fully understand how these systems behave and that current safety
									methods may prove insufficient.
								</p>
								{#if selectedThemes.has('individus')}
									<p>
										<strong>Threats to fundamental rights.</strong> AI systems enable unprecedented mass
										surveillance and individual profiling. Facial recognition technologies, systematic
										behavioural data collection and automated decision-making algorithms already affect
										millions of people, often without their knowledge or any possibility of appeal. Biases
										in training data reproduce and amplify discrimination in critical areas such as employment,
										housing and justice.
									</p>
								{/if}
								{#if selectedThemes.has('societe')}
									<p>
										<strong>Threats to democracy and social cohesion.</strong> Content generation tools
										now enable the production of disinformation at scale, with videos, images and texts
										indistinguishable from reality. This undermines democratic processes, amplifies existing
										polarisation and erodes trust in institutions and the media.
									</p>
								{/if}
								{#if selectedThemes.has('economie')}
									<p>
										<strong>Economic disruption ahead.</strong> Rapid automation threatens to upend the
										labour market at unprecedented speed. Recent studies estimate that tens of millions
										of jobs in Europe could be significantly affected by 2030, across sectors from transport
										to accounting, legal and medical services. Our social protection systems were not
										designed to absorb such rapid change, and no adaptation policy is being deployed
										at the scale required.
									</p>
								{/if}
								{#if selectedThemes.has('humanite')}
									<p>
										<strong>A long-horizon risk acknowledged by experts.</strong> Hundreds of AI researchers
										and the leaders of the main labs have publicly acknowledged that these systems could,
										if not properly governed, pose a risk to civilisation itself. The International AI
										Safety Report 2025, led by Turing Prize winner Yoshua Bengio with contributions from
										over 100 experts and the backing of 30 countries, concludes that no current method
										can reliably guarantee safe behaviour. The core problem: we do not yet know how to
										build AI systems whose objectives remain aligned with human wellbeing as they become
										very powerful.
									</p>
								{/if}
								<p>
									<strong>An absence of regulatory framework.</strong> There is currently no legal framework,
									in France or internationally, that requires an independent safety evaluation before
									the development or deployment of AI systems with potentially dangerous capabilities,
									defines capability thresholds beyond which specific precautions would be mandatory,
									or provides a mechanism to suspend the deployment of a system deemed dangerous. Companies
									self-assess and decide for themselves what is acceptable. This situation is unlike
									any other area where public safety is at stake.
								</p>
								<p>I ask you to:</p>
								<ol>
									<li>
										Raise this issue with the relevant committee and request a briefing on the risks
										posed by advanced AI systems and the current state of French and European
										regulation.
									</li>
									<li>
										Support efforts to require binding independent safety evaluations before AI
										systems with potentially dangerous capabilities are developed or deployed.
									</li>
									<li>
										Advocate for international cooperation to govern the most powerful AI systems,
										as exists for other high-risk technologies.
									</li>
								</ol>
								<p>
									If you or your team would like more information, the Pause AI organisation
									(pauseia.fr) works on these issues and would be happy to provide a briefing.
								</p>
								<p>
									Yours sincerely,<br />
									[Your full name]<br />
									[Your address / town / constituency]
								</p>
							{:else}
								<p>Madame/Monsieur le/la Député·e / Sénateur·rice [nom],</p>
								<p>
									Je m'appelle [votre nom] et je suis un·e habitant·e de [votre
									commune/circonscription].
								</p>
								<p>
									Je vous écris au sujet d'un enjeu que je considère comme l'un des plus importants
									pour notre sécurité collective dans les années à venir : le développement de
									systèmes d'intelligence artificielle de plus en plus autonomes et capables, sans
									cadre réglementaire adapté.
								</p>
								<p>
									<strong>Des capacités en croissance rapide.</strong> Les plus grands laboratoires d'IA
									au monde (OpenAI, Google DeepMind, Anthropic, Meta et d'autres) développent actuellement
									des systèmes capables d'écrire du code, d'utiliser des outils informatiques, de naviguer
									sur le web et d'agir de manière autonome. Les prochaines générations de ces systèmes
									seront significativement plus puissantes. Leurs propres créateurs reconnaissent qu'ils
									ne maîtrisent pas encore pleinement le comportement de ces systèmes et que les méthodes
									de sécurité actuelles pourraient se révéler insuffisantes.
								</p>
								{#if selectedThemes.has('individus')}
									<p>
										<strong>Des atteintes aux droits fondamentaux.</strong> Les systèmes d'IA permettent
										une surveillance de masse et un profilage des individus sans précédent. Les technologies
										de reconnaissance faciale, la collecte systématique de données comportementales et
										les algorithmes de décision automatisée affectent déjà des millions de personnes,
										souvent sans leur consentement ni recours possible. Les biais présents dans les données
										d'entraînement reproduisent et amplifient des discriminations dans des domaines aussi
										critiques que l'accès à l'emploi, au logement ou à la justice.
									</p>
								{/if}
								{#if selectedThemes.has('societe')}
									<p>
										<strong>Des menaces pour la cohésion sociale et la démocratie.</strong> Les outils
										de génération de contenu permettent désormais de produire de la désinformation à
										grande échelle, avec des vidéos, images et textes indiscernables du réel. Cette capacité
										fragilise les processus démocratiques, amplifie les polarisations existantes et mine
										la confiance dans les institutions et dans les médias.
									</p>
								{/if}
								{#if selectedThemes.has('economie')}
									<p>
										<strong>Une déstabilisation économique à anticiper.</strong> L'automatisation rapide
										menace de bouleverser le marché du travail à une vitesse sans précédent. Des études
										récentes estiment que des dizaines de millions d'emplois en Europe pourraient être
										significativement affectés d'ici 2030, dans des secteurs allant du transport à la
										comptabilité, en passant par les services juridiques et médicaux. Nos systèmes de
										protection sociale n'ont pas été conçus pour absorber une transformation aussi rapide,
										et aucune politique d'adaptation n'est déployée à la hauteur du défi.
									</p>
								{/if}
								{#if selectedThemes.has('humanite')}
									<p>
										<strong>Un risque à longue portée reconnu par les experts.</strong> Des centaines
										de chercheurs en IA et les dirigeants des principaux laboratoires ont publiquement
										reconnu que ces systèmes pourraient, s'ils ne sont pas correctement encadrés, représenter
										un risque pour l'ensemble de la civilisation. Le Rapport international de sécurité
										IA 2025, dirigé par le prix Turing Yoshua Bengio avec la contribution de plus de
										100 experts et le soutien de 30 pays, conclut qu'aucune méthode actuelle ne permet
										de garantir des comportements sûrs de manière fiable. Le problème de fond : nous
										ne savons pas encore comment concevoir des systèmes dont les objectifs restent alignés
										avec le bien humain lorsqu'ils deviennent très puissants.
									</p>
								{/if}
								<p>
									<strong>L'absence de cadre réglementaire.</strong> Il n'existe aujourd'hui aucun cadre
									juridique, en France ou à l'international, qui exige une évaluation de sécurité indépendante
									avant le développement ou le déploiement de systèmes d'IA aux capacités potentiellement
									dangereuses, ni ne définit de seuils au-delà desquels des précautions spécifiques seraient
									obligatoires. Les entreprises s'auto-évaluent et décident seules de ce qui est acceptable.
									Cette situation n'est comparable à aucun autre domaine où la sécurité publique est
									en jeu.
								</p>
								<p>Ce que je vous demande :</p>
								<ol>
									<li>
										Soulever cette question auprès de la commission compétente et demander un
										briefing sur les risques posés par les systèmes d'IA avancés et sur l'état de la
										réglementation française et européenne en la matière.
									</li>
									<li>
										Soutenir les efforts visant à exiger des évaluations de sécurité indépendantes
										et contraignantes avant que des systèmes d'IA aux capacités potentiellement
										dangereuses ne soient développés ou déployés.
									</li>
									<li>
										Plaider en faveur d'une coopération internationale pour encadrer les systèmes
										d'IA les plus puissants, à l'image des cadres existants pour d'autres
										technologies à haut risque.
									</li>
								</ol>
								<p>
									Si vous ou votre équipe souhaitez plus d'informations, l'organisation Pause IA
									(pauseia.fr) travaille sur ces questions et serait heureuse de vous fournir un
									briefing.
								</p>
								<p>
									Cordialement,<br />
									[Votre nom complet]<br />
									[Votre adresse / commune / circonscription]
								</p>
							{/if}
						{/if}
					</div>
					<div class="email-actions">
						<button class="copy-btn" class:copied on:click={copyEmail}>
							{#if copied}
								{isEn ? '✓ Copied!' : '✓ Copié !'}
							{:else}
								{isEn ? 'Copy email' : "Copier l'email"}
							{/if}
						</button>
					</div>
				</div>
			</div>
		</div>
	</section>
</article>

<style>
	article {
		max-inline-size: 60rem;
		margin-inline: auto;
		margin-top: 3rem;
		padding: 0 2rem;
		padding-bottom: 5rem;
	}

	.hero {
		margin-bottom: 3rem;
	}

	.hero-subtitle {
		font-size: 1.15rem;
		color: var(--color-text-muted, #555);
		margin-top: 0.75rem;
		max-width: 45rem;
	}

	.content-section {
		margin-bottom: 3rem;
	}

	.content-section h2 {
		font-size: 1.5rem;
		font-weight: 700;
		margin-bottom: 1.25rem;
		padding-bottom: 0.5rem;
		border-bottom: 2px solid var(--color-primary, #e63946);
	}

	.content-section p {
		line-height: 1.7;
		margin-bottom: 1rem;
	}

	/* Steps */
	.step {
		display: flex;
		gap: 1.25rem;
		margin-bottom: 2.5rem;
		align-items: flex-start;
	}

	.step-number {
		flex-shrink: 0;
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		background: var(--color-primary, #e63946);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: 0.9rem;
		margin-top: 0.2rem;
	}

	.step-content {
		flex: 1;
	}

	.step-content h3 {
		font-size: 1.15rem;
		font-weight: 700;
		margin-bottom: 0.75rem;
	}

	.step-content p {
		line-height: 1.7;
		margin-bottom: 0.75rem;
	}

	/* Find links */
	.find-links {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		margin-top: 1rem;
	}

	.find-btn {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1.25rem;
		border: 2px solid var(--color-primary, #e63946);
		border-radius: 8px;
		text-decoration: none;
		color: inherit;
		background: white;
		transition:
			background 0.15s,
			color 0.15s;
		min-width: 200px;
	}

	.find-btn:hover {
		background: var(--color-primary, #e63946);
		color: white;
	}

	.find-icon {
		font-size: 1.4rem;
	}

	.find-btn span {
		display: flex;
		flex-direction: column;
	}

	.find-btn strong {
		font-size: 0.9rem;
		line-height: 1.3;
	}

	.find-btn small {
		font-size: 0.75rem;
		opacity: 0.7;
	}

	/* Theme chips */
	.theme-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-top: 0.75rem;
	}

	.chip {
		padding: 0.45rem 1rem;
		border-radius: 999px;
		border: 2px solid #ccc;
		background: #f5f5f5;
		font-size: 0.85rem;
		cursor: pointer;
		transition: all 0.15s;
		color: #555;
	}

	.chip.active {
		border-color: var(--color-primary, #e63946);
		background: var(--color-primary, #e63946);
		color: white;
		font-weight: 600;
	}

	.chip-hint {
		font-size: 0.82rem;
		color: #666;
		margin-top: 0.5rem;
	}

	.chip-hint a {
		color: var(--color-primary, #e63946);
	}

	/* Tips box */
	.tips-box {
		background: #fafafa;
		border: 1px solid #e8e8e8;
		border-left: 4px solid var(--color-primary, #e63946);
		border-radius: 0 8px 8px 0;
		padding: 1.25rem 1.5rem;
		margin-bottom: 1.5rem;
	}

	.tips-box h4 {
		font-size: 0.95rem;
		font-weight: 700;
		margin-bottom: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--color-primary, #e63946);
	}

	.tips-box ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.tips-box li {
		font-size: 0.9rem;
		line-height: 1.5;
		padding-left: 1rem;
		position: relative;
	}

	.tips-box li::before {
		content: '→';
		position: absolute;
		left: 0;
		color: var(--color-primary, #e63946);
	}

	.tips-box code {
		background: #eee;
		padding: 0.1em 0.4em;
		border-radius: 4px;
		font-size: 0.85em;
	}

	/* Version tabs */
	.version-tabs {
		display: flex;
		gap: 0;
		margin-bottom: 0;
		border-bottom: 2px solid #e0e0e0;
	}

	.tab-btn {
		padding: 0.6rem 1.4rem;
		border: none;
		background: none;
		font-size: 0.9rem;
		cursor: pointer;
		color: #888;
		border-bottom: 3px solid transparent;
		margin-bottom: -2px;
		transition: all 0.15s;
		font-weight: 500;
	}

	.tab-btn.active {
		color: var(--color-primary, #e63946);
		border-bottom-color: var(--color-primary, #e63946);
		font-weight: 700;
	}

	/* Email preview */
	.email-preview {
		border: 1px solid #ddd;
		border-radius: 0 8px 8px 8px;
		overflow: hidden;
	}

	.email-subject-line {
		background: #f0f0f0;
		padding: 0.6rem 1.25rem;
		font-size: 0.85rem;
		border-bottom: 1px solid #ddd;
	}

	.subject-label {
		font-weight: 700;
		margin-right: 0.5rem;
		color: #555;
	}

	.email-body {
		padding: 1.5rem 1.75rem;
		font-size: 0.9rem;
		line-height: 1.7;
		background: white;
	}

	.email-body p {
		margin-bottom: 1em;
	}

	.email-body ol {
		padding-left: 1.5rem;
		margin-bottom: 1em;
	}

	.email-body ol li {
		margin-bottom: 0.5em;
		line-height: 1.6;
	}

	.email-body strong {
		font-weight: 700;
	}

	.email-actions {
		padding: 0.75rem 1.25rem;
		background: #f9f9f9;
		border-top: 1px solid #eee;
		display: flex;
		justify-content: flex-end;
	}

	.copy-btn {
		padding: 0.5rem 1.25rem;
		background: var(--color-primary, #e63946);
		color: white;
		border: none;
		border-radius: 6px;
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.15s;
	}

	.copy-btn:hover {
		opacity: 0.88;
	}

	.copy-btn.copied {
		background: #2a9d5c;
	}

	@media (max-width: 600px) {
		.find-links {
			flex-direction: column;
		}

		.find-btn {
			min-width: unset;
		}

		.step {
			flex-direction: column;
			gap: 0.75rem;
		}

		.step-number {
			margin-top: 0;
		}
	}
</style>
