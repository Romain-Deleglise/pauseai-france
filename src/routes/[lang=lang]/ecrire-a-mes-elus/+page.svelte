<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import { lookupElus, isSampleData, type Elu, type LookupResult } from '$lib/data/elus'
	import type { PageData } from './$types'

	export let data: PageData
	$: lang = data.lang
	$: isEn = lang === 'en'

	const BCC = 'campagne@pauseia.fr'

	// ── Recherche des élus par code postal ──
	let codePostal = ''
	let result: LookupResult | null = null
	let searched = false

	function search() {
		searched = true
		result = lookupElus(codePostal)
	}

	/**
	 * Construit le corps de l'email en texte brut à partir de l'aperçu affiché
	 * (qui reflète la version + les risques sélectionnés), avec la formule
	 * d'appel adaptée au rôle de l'élu.
	 */
	function buildBody(elu: Elu): string {
		const el = document.getElementById('email-body')
		let text = el ? el.innerText : ''
		if (isEn) {
			text = text.replace('Dear [Deputy/Senator name],', `Dear ${elu.nom},`)
		} else {
			const salutation =
				elu.role === 'depute' ? 'Madame, Monsieur le Député,' : 'Madame, Monsieur le Sénateur,'
			text = text.replace('Madame/Monsieur le Député / le Sénateur [nom],', salutation)
		}
		return text
	}

	function mailtoHref(elu: Elu): string {
		const params = new URLSearchParams({ subject, bcc: BCC, body: buildBody(elu) })
		// URLSearchParams encode les espaces en "+", à reconvertir en %20 pour mailto.
		return `mailto:${elu.email}?${params.toString().replace(/\+/g, '%20')}`
	}

	function confidenceNote(elu: Elu): string | null {
		if (elu.emailConfidence === 'high' || elu.emailConfidence === 'medium') return null
		if (isEn) return 'Please double-check this address before sending.'
		return "Vérifiez l'adresse avant l'envoi."
	}

	type Theme = 'individus' | 'societe' | 'economie' | 'humanite'

	const themes: { id: Theme; label: string; labelEn: string }[] = [
		{ id: 'individus', label: 'Vie privée et surveillance', labelEn: 'Privacy and surveillance' },
		{
			id: 'societe',
			label: 'Désinformation et démocratie',
			labelEn: 'Disinformation and democracy'
		},
		{ id: 'economie', label: "Perte d'emploi", labelEn: 'Job losses' },
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
	let version: Version = 'short'

	let copiedBcc = false
	function copyBcc() {
		navigator.clipboard.writeText('campagne@pauseia.fr').then(() => {
			copiedBcc = true
			setTimeout(() => {
				copiedBcc = false
			}, 2500)
		})
	}

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
	title={isEn ? 'Write to your representatives | Pause AI' : 'Écrivez à vos élus | Pause IA'}
	description={isEn
		? 'Take 5 minutes to write to your MP and senator about the risks of advanced AI systems. Use our email template to get started.'
		: "Prenez 5 minutes pour écrire à votre député et à votre sénateur sur les risques des systèmes d'IA avancés."}
/>

<article>
	<section class="hero">
		<UnderlinedTitle as="h1">
			{isEn ? 'Write to your representatives' : 'Écrivez à vos élus'}
		</UnderlinedTitle>
	</section>

	<!-- ── Pourquoi écrire ── -->
	<section class="content-section">
		<h2>{isEn ? 'Why write?' : 'Pourquoi écrire ?'}</h2>
		{#if isEn}
			<p>
				The most powerful AI systems are being developed without independent oversight or an
				adequate regulatory framework. Companies self-assess. No thresholds define what is too
				dangerous to deploy. This needs to change, and elected officials are the ones who can act.
			</p>
			<p>
				<strong>Email is more powerful than it seems.</strong> MPs and senators are required to respond
				to their constituents. A personal email, especially a brief and sincere one, carries real weight:
				it lands in a human inbox, it gets read, and it signals that a voter in their constituency cares
				about this issue. Unlike a petition or a social media post, it demands a response.
			</p>
			<div class="highlight-callout">
				A personal email to your MP or senator is one of the most effective ways to put this issue
				on their agenda. It takes five minutes.
			</div>
			<p>
				<strong>Email is more powerful than it seems.</strong> MPs and senators are required to respond
				to their constituents. A personal email, especially a brief and sincere one, carries real weight:
				it lands in a human inbox, it gets read, and it signals that a voter in their constituency cares
				about this issue. Unlike a petition or a social media post, it demands a response.
			</p>
			<p>
				A handful of emails from real citizens is often enough to get a topic onto a committee's
				agenda.
			</p>
		{:else}
			<p>
				Les systèmes d'IA les plus puissants se développent sans supervision indépendante ni cadre
				réglementaire adapté. Les entreprises s'auto-évaluent. Aucun seuil ne définit ce qui est
				trop dangereux pour être déployé. C'est aux élus d'agir.
			</p>
			<div class="highlight-callout">
				Un email personnel à votre député ou sénateur reste l'un des moyens les plus efficaces pour
				inscrire ce sujet à leur agenda. Cela prend cinq minutes.
			</div>
			<p>
				<strong>L'email est un outil plus puissant qu'on ne le croit.</strong> Les députés et sénateurs
				ont l'obligation de répondre à leurs concitoyens. Un email personnel, court et sincère, a un
				vrai impact : il arrive dans une boite mail humaine, il est lu, et il signale qu'un électeur
				de leur circonscription se préoccupe du sujet. Contrairement à une pétition ou à un post sur
				les réseaux, il appelle une réponse.
			</p>
			<p>
				Une poignée d'emails de vrais citoyens suffit souvent à inscrire un sujet à l'ordre du jour
				d'une commission.
			</p>
		{/if}
	</section>

	<!-- ── Comment faire ── -->
	<section class="content-section">
		<h2>{isEn ? 'How to do it' : 'Comment faire'}</h2>

		<!-- Étape 1 : personnaliser le message -->
		<div class="step">
			<div class="step-number">1</div>
			<div class="step-content">
				<h3>{isEn ? 'Personalise your message' : 'Personnalisez votre message'}</h3>
				{#if isEn}
					<p>
						The template below is ready to send. You can keep it as is, or switch to the full
						version and choose which risks to mention. You'll attach your representatives in the
						next step.
					</p>
				{:else}
					<p>
						Le modèle ci-dessous est prêt à l'envoi. Vous pouvez le garder tel quel, ou passer à la
						version complète et choisir les risques à mentionner. Vous y associerez vos élus à
						l'étape suivante.
					</p>
				{/if}

				<!-- Conseils compacts -->
				<div class="tips-box">
					{#if isEn}
						<ul>
							<li>
								<strong>Add a personal sentence</strong>: an authentic email carries far more weight
								than a copy-paste.
							</li>
							<li>
								<strong>Mention your full name and town</strong> (teams sort by constituency).
							</li>
						</ul>
					{:else}
						<ul>
							<li>
								<strong>Ajoutez une phrase personnelle</strong> : un email authentique pèse bien plus
								lourd qu'un copier-coller.
							</li>
							<li>
								<strong>Mentionnez votre nom complet et ville</strong> (les équipes trient par circonscription).
							</li>
						</ul>
					{/if}
					<div class="bcc-block">
						<span class="bcc-label">{isEn ? 'BCC (blind copy):' : 'CCI (copie cachée) :'}</span>
						<code class="bcc-email">campagne@pauseia.fr</code>
						<button class="bcc-copy-btn" class:copied={copiedBcc} on:click={copyBcc}>
							{copiedBcc ? '✓' : isEn ? 'Copy' : 'Copier'}
						</button>
						<span class="bcc-desc">
							{isEn ? 'helps us count letters sent' : 'pour nous aider à compter les mails envoyés'}
						</span>
					</div>
					<p class="personalise-reminder">
						{#if isEn}
							The recipient's name is filled in automatically. Just replace your
							<strong>[your name]</strong> and <strong>[your town]</strong> at the start and end of the
							email.
						{:else}
							Le nom du destinataire est rempli automatiquement. Indiquez simplement votre
							<strong>[votre nom]</strong> et votre <strong>[votre commune]</strong> en début et en fin
							de mail.
						{/if}
					</p>
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

				<!-- Chips risques (version complète) -->
				{#if version === 'long'}
					<div class="theme-chips-row">
						<span class="chips-label">
							{isEn ? 'Risks to include:' : 'Risques à inclure :'}
						</span>
						<div class="theme-chips">
							{#each themes as theme}
								<button
									class="chip"
									class:active={selectedThemes.has(theme.id)}
									on:click={() => toggleTheme(theme.id)}
								>
									{isEn ? theme.labelEn : theme.label}
								</button>
							{/each}
						</div>
					</div>
				{/if}

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
								<p>Madame/Monsieur le Député / le Sénateur [nom],</p>
								<p>Je suis [votre nom], habitant de [votre commune].</p>
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
								<p>My name is [your name], a resident of [your town/constituency].</p>
								<p>
									I am writing about the rapid development of increasingly powerful AI systems
									without any adequate regulatory framework. The leaders of the main AI labs
									acknowledge that their systems could pose a serious threat to civilisation if not
									properly governed.
								</p>
								{#if selectedThemes.has('individus')}
									<p>
										<strong>Privacy and surveillance.</strong> AI systems already enable mass surveillance
										and individual profiling on an unprecedented scale, often without people's knowledge
										or any possibility of redress.
									</p>
								{/if}
								{#if selectedThemes.has('societe')}
									<p>
										<strong>Disinformation and democracy.</strong> Content generation tools now produce
										disinformation at scale (videos and texts indistinguishable from reality), undermining
										democratic processes and trust in institutions.
									</p>
								{/if}
								{#if selectedThemes.has('economie')}
									<p>
										<strong>Job losses.</strong> Tens of millions of jobs in Europe could be significantly
										affected by 2030, across transport, accounting, legal and medical services, with
										no adaptation policy deployed at the scale required.
									</p>
								{/if}
								{#if selectedThemes.has('humanite')}
									<p>
										<strong>Existential risks.</strong> The International AI Safety Report 2025, led
										by Turing Prize winner Yoshua Bengio and backed by 30 countries, concludes that no
										current safety method can reliably guarantee safe behaviour.
									</p>
								{/if}
								<p>
									Today, no legal framework requires independent safety evaluations before deploying
									AI systems with potentially dangerous capabilities. Companies self-assess.
								</p>
								<p>
									I ask you to raise this issue with the relevant committee and support measures
									requiring independent safety evaluations for the most powerful AI systems. The
									Pause AI association (pauseia.fr) would be happy to provide a briefing.
								</p>
								<p>
									Yours sincerely,<br />
									[Your full name]<br />
									[Your town / constituency]
								</p>
							{:else}
								<p>Madame/Monsieur le Député / le Sénateur [nom],</p>
								<p>Je suis [votre nom], habitant de [votre commune/circonscription].</p>
								<p>
									Je vous écris au sujet du développement rapide de systèmes d'IA de plus en plus
									puissants, sans cadre réglementaire adapté. Les dirigeants des principaux
									laboratoires reconnaissent eux-mêmes que ces technologies pourraient représenter
									une menace sérieuse pour la civilisation.
								</p>
								{#if selectedThemes.has('individus')}
									<p>
										<strong>Vie privée et surveillance.</strong> Les systèmes d'IA permettent déjà une
										surveillance de masse et un profilage individuel sans précédent, souvent sans consentement
										ni recours possible.
									</p>
								{/if}
								{#if selectedThemes.has('societe')}
									<p>
										<strong>Désinformation et démocratie.</strong> Les outils d'IA produisent de la désinformation
										à grande échelle (vidéos et textes indiscernables du réel), fragilisant les processus
										démocratiques et la confiance dans les institutions.
									</p>
								{/if}
								{#if selectedThemes.has('economie')}
									<p>
										<strong>Perte d'emploi.</strong> Des dizaines de millions d'emplois en Europe pourraient
										être affectés d'ici 2030, des transports aux services juridiques et médicaux, sans
										politique d'adaptation à la hauteur.
									</p>
								{/if}
								{#if selectedThemes.has('humanite')}
									<p>
										<strong>Risques existentiels.</strong> Le rapport international dirigé par le prix
										Turing Yoshua Bengio, soutenu par 30 pays, conclut qu'aucune méthode actuelle ne
										garantit des comportements sûrs de manière fiable.
									</p>
								{/if}
								<p>
									Aujourd'hui, aucun cadre juridique n'exige d'évaluation de sécurité indépendante
									avant le déploiement de systèmes aux capacités potentiellement dangereuses. Les
									entreprises s'auto-évaluent.
								</p>
								<p>
									Je vous demande d'inscrire ce sujet à l'ordre du jour d'une commission compétente
									et de soutenir des évaluations de sécurité indépendantes pour les systèmes d'IA
									les plus puissants. L'association Pause IA (pauseia.fr) serait heureuse de vous
									fournir un briefing.
								</p>
								<p>
									Cordialement,<br />
									[Votre nom complet]<br />
									[Votre commune / circonscription]
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

		<!-- Étape 2 : trouver et contacter ses élus -->
		<div class="step">
			<div class="step-number">2</div>
			<div class="step-content">
				<h3>{isEn ? 'Find and contact your representatives' : 'Trouvez et contactez vos élus'}</h3>
				{#if isEn}
					<p>
						Enter your postal code: we'll list your senators (elected per department) and the MPs of
						your department. One click opens a ready-to-send email — your message and the BCC are
						already filled in.
					</p>
				{:else}
					<p>
						Entrez votre code postal : nous listons vos sénateurs (élus au département) et les
						députés de votre département. Un clic ouvre un email prêt à envoyer — votre message et
						la copie cachée sont déjà remplis.
					</p>
				{/if}

				<form class="cp-form" on:submit|preventDefault={search}>
					<input
						class="cp-input"
						type="text"
						inputmode="numeric"
						pattern="[0-9]&lbrace;5&rbrace;"
						maxlength="5"
						placeholder={isEn ? 'Postal code (e.g. 75011)' : 'Code postal (ex. 75011)'}
						bind:value={codePostal}
						aria-label={isEn ? 'Postal code' : 'Code postal'}
					/>
					<button class="cp-btn" type="submit">
						{isEn ? 'Find my representatives' : 'Trouver mes élus'}
					</button>
				</form>

				{#if isSampleData}
					<p class="sample-warning">
						{isEn
							? '⚠️ Demo data — run the generation script to load real representatives and emails.'
							: "⚠️ Données d'exemple — lancez le script de génération pour charger les vrais élus et emails."}
					</p>
				{/if}

				{#if searched && !result}
					<p class="cp-error">
						{isEn
							? "We couldn't find representatives for this postal code. Use the direct links below."
							: 'Aucun élu trouvé pour ce code postal. Utilisez les liens directs ci-dessous.'}
					</p>
				{/if}

				{#if result}
					{#each [{ key: 'senateurs', list: result.senateurs, fr: 'Vos sénateurs', en: 'Your senators' }, { key: 'deputes', list: result.deputes, fr: result.exactDeputes ? 'Votre député' : 'Les députés de votre département', en: result.exactDeputes ? 'Your MP' : 'The MPs of your department' }] as group}
						{#if group.list.length}
							<div class="elu-group">
								<h4>{isEn ? group.en : group.fr}</h4>
								<ul class="elu-list">
									{#each group.list as elu (elu.id)}
										<li class="elu-card">
											<div class="elu-info">
												<strong>{elu.nom}</strong>
												<small>
													{elu.role === 'depute'
														? elu.nomCirco || `${isEn ? 'Dept.' : 'Dépt.'} ${elu.departement}`
														: elu.nomDept || `${isEn ? 'Dept.' : 'Dépt.'} ${elu.departement}`}
													{#if elu.groupe && elu.groupe !== '—'}· {elu.groupe}{/if}
												</small>
												{#if confidenceNote(elu)}
													<small class="elu-note">{confidenceNote(elu)}</small>
												{/if}
											</div>
											{#if elu.email}
												<a class="elu-send" href={mailtoHref(elu)}>
													{isEn ? 'Write' : 'Écrire'}
												</a>
											{:else if elu.contactUrl}
												<a
													class="elu-send elu-send--alt"
													href={elu.contactUrl}
													target="_blank"
													rel="noopener noreferrer"
												>
													{isEn ? 'Contact form' : 'Formulaire'}
												</a>
											{/if}
										</li>
									{/each}
								</ul>
							</div>
						{/if}
					{/each}
				{/if}

				<!-- Repli : liens officiels pour rechercher manuellement -->
				<details class="manual-fallback">
					<summary>
						{isEn
							? "Can't find your representative? Official directories"
							: 'Vous ne trouvez pas ? Annuaires officiels'}
					</summary>
					<div class="find-links">
						<a
							class="find-btn"
							href="https://www.assemblee-nationale.fr/dyn/vos-deputes/carte-departements"
							target="_blank"
							rel="noopener noreferrer"
						>
							<span class="find-icon">🏛️</span>
							<span>
								<strong>{isEn ? 'Find my MP' : 'Trouver mon député'}</strong>
								<small>assemblee-nationale.fr</small>
							</span>
						</a>
						<a
							class="find-btn"
							href="https://www.senat.fr/vos-senateurs.html"
							target="_blank"
							rel="noopener noreferrer"
						>
							<span class="find-icon">🏛️</span>
							<span>
								<strong>{isEn ? 'Find my senator(s)' : 'Trouver mon/mes sénateurs'}</strong>
								<small>senat.fr</small>
							</span>
						</a>
					</div>
				</details>
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

	.highlight-callout {
		font-size: 1.1rem;
		font-weight: 600;
		line-height: 1.6;
		color: var(--brand-subtle, #c96900);
		border-left: 4px solid var(--brand, #ff9416);
		padding: 0.6rem 1rem;
		margin: 1.25rem 0;
		background: var(--brand-light, #fff5e8);
		border-radius: 0 6px 6px 0;
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
		margin-top: 0;
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

	.theme-chips-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
		padding: 0.6rem 0;
		margin-bottom: 0;
	}

	.chips-label {
		font-size: 0.82rem;
		font-weight: 600;
		color: #555;
		white-space: nowrap;
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

	.bcc-block {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 1.25rem;
		padding: 0.6rem 0.875rem;
		background: #f5f7ff;
		border: 1px solid #c5cef0;
		border-radius: 6px;
		font-size: 0.85rem;
		flex-wrap: wrap;
	}

	.bcc-label {
		font-weight: 700;
		color: #444;
	}

	.bcc-email {
		background: none;
		padding: 0;
		font-size: 0.9rem;
		font-weight: 700;
		color: var(--color-primary, #e63946);
		font-family: monospace;
	}

	.bcc-desc {
		color: #666;
		font-style: italic;
	}

	.personalise-reminder {
		margin-top: 0.75rem;
		font-size: 0.85rem;
		color: #555;
		line-height: 1.5;
	}

	.bcc-copy-btn {
		padding: 0.15rem 0.6rem;
		border: 1px solid #c5cef0;
		border-radius: 4px;
		background: white;
		font-size: 0.78rem;
		font-weight: 600;
		cursor: pointer;
		color: var(--color-primary, #e63946);
		transition: all 0.15s;
	}

	.bcc-copy-btn:hover {
		background: var(--color-primary, #e63946);
		color: white;
		border-color: var(--color-primary, #e63946);
	}

	.bcc-copy-btn.copied {
		background: #2a9d5c;
		color: white;
		border-color: #2a9d5c;
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

	/* Recherche par code postal */
	.cp-form {
		display: flex;
		gap: 0.5rem;
		margin: 1.25rem 0 0.5rem;
		flex-wrap: wrap;
	}

	.cp-input {
		flex: 1;
		min-width: 180px;
		padding: 0.6rem 0.9rem;
		border: 2px solid #ccc;
		border-radius: 8px;
		font-size: 1rem;
	}

	.cp-input:focus {
		outline: none;
		border-color: var(--color-primary, #e63946);
	}

	.cp-btn {
		padding: 0.6rem 1.4rem;
		background: var(--color-primary, #e63946);
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 0.95rem;
		font-weight: 600;
		cursor: pointer;
		transition: opacity 0.15s;
	}

	.cp-btn:hover {
		opacity: 0.88;
	}

	.sample-warning {
		font-size: 0.85rem;
		color: #8a6d00;
		background: #fff8e1;
		border: 1px solid #ffe08a;
		border-radius: 6px;
		padding: 0.5rem 0.75rem;
		margin: 0.5rem 0;
	}

	.cp-error {
		font-size: 0.9rem;
		color: var(--color-primary, #e63946);
		margin: 0.5rem 0;
	}

	.elu-group {
		margin-top: 1.5rem;
	}

	.elu-group h4 {
		font-size: 0.95rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--color-primary, #e63946);
		margin-bottom: 0.6rem;
	}

	.elu-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.elu-card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 0.75rem 1rem;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		background: white;
	}

	.elu-info {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.elu-info small {
		font-size: 0.8rem;
		color: #666;
	}

	.elu-note {
		color: #b06a00 !important;
		font-style: italic;
	}

	.elu-send {
		flex-shrink: 0;
		padding: 0.5rem 1.1rem;
		background: var(--color-primary, #e63946);
		color: white;
		border-radius: 6px;
		text-decoration: none;
		font-size: 0.9rem;
		font-weight: 600;
		transition: opacity 0.15s;
	}

	.elu-send:hover {
		opacity: 0.88;
	}

	.elu-send--alt {
		background: #666;
	}

	.manual-fallback {
		margin-top: 1.75rem;
		font-size: 0.9rem;
	}

	.manual-fallback summary {
		cursor: pointer;
		color: #555;
		font-weight: 500;
	}

	.manual-fallback .find-links {
		margin-top: 1rem;
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
