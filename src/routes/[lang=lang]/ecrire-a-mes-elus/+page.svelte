<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
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
		return `mailto:${elu.email ?? ''}?${params.toString().replace(/\+/g, '%20')}`
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

	let copied = false
	function copyEmail() {
		const el = document.getElementById('email-body')
		if (!el) return
		void navigator.clipboard.writeText(el.innerText).then(() => {
			copied = true
			setTimeout(() => {
				copied = false
			}, 2500)
		})
	}

	$: subject = isEn
		? 'AI risks: concern from a constituent'
		: "Risques liés aux systèmes d'IA avancés"

	$: eluGroups = result
		? [
				{
					list: result.senateurs,
					title: isEn ? 'Your senators' : 'Vos sénateurs'
				},
				{
					list: result.deputes,
					title: result.exactDeputes
						? isEn
							? 'Your MP'
							: 'Votre député'
						: isEn
							? 'The MPs of your department'
							: 'Les députés de votre département'
				}
			]
		: []
</script>

<PostMeta
	title={isEn ? 'Write to your representatives | Pause AI' : 'Écrivez à vos élus | Pause IA'}
	description={isEn
		? 'Take 2 minutes to write to your MP and senator about the risks of advanced AI systems. Enter your postal code and send a ready-made email.'
		: "Prenez 2 minutes pour écrire à votre député et à votre sénateur sur les risques des systèmes d'IA. Entrez votre code postal et envoyez un email prêt à l'emploi."}
/>

<article>
	<!-- ── Hero ── -->
	<header class="hero">
		<h1>{isEn ? 'Write to your representatives' : 'Écrivez à vos élus'}</h1>
		<p class="hero-sub">
			{#if isEn}
				The most powerful AI systems are being built without independent oversight. A personal email
				to your representative is one of the most effective ways to change that — and it takes two
				minutes.
			{:else}
				Les systèmes d'IA les plus puissants se développent sans supervision indépendante. Un email
				personnel à votre élu est l'un des moyens les plus efficaces d'y remédier — et cela prend
				deux minutes.
			{/if}
		</p>
	</header>

	<!-- ── Étape 1 : trouver ses élus ── -->
	<section class="card">
		<h2>
			<span class="step-num">1</span>{isEn ? 'Find your representatives' : 'Trouvez vos élus'}
		</h2>

		<form class="cp-form" on:submit|preventDefault={search}>
			<input
				class="cp-input"
				type="text"
				inputmode="numeric"
				pattern="[0-9]&lbrace;5&rbrace;"
				maxlength="5"
				placeholder={isEn ? 'Your postal code (e.g. 75011)' : 'Votre code postal (ex. 75011)'}
				bind:value={codePostal}
				aria-label={isEn ? 'Postal code' : 'Code postal'}
			/>
			<button class="cp-btn" type="submit">
				{isEn ? 'Find' : 'Rechercher'}
			</button>
		</form>

		{#if isSampleData}
			<p class="notice notice--warn">
				{isEn
					? '⚠️ Demo data — run the generation script to load real representatives and emails.'
					: "⚠️ Données d'exemple — lancez le script de génération pour charger les vrais élus et emails."}
			</p>
		{/if}

		{#if searched && !result}
			<p class="notice notice--error">
				{isEn
					? "We couldn't find representatives for this postal code. Use the official directories below."
					: 'Aucun élu trouvé pour ce code postal. Utilisez les annuaires officiels ci-dessous.'}
			</p>
		{/if}

		{#if result}
			<p class="results-hint">
				{isEn
					? 'Click “Write” — your email opens ready to send.'
					: 'Cliquez sur « Écrire » — votre email s’ouvre prêt à envoyer.'}
			</p>
			{#each eluGroups as group}
				{#if group.list.length}
					<div class="elu-group">
						<h3>{group.title}</h3>
						<ul class="elu-list">
							{#each group.list as elu (elu.id)}
								<li class="elu-card">
									<div class="elu-info">
										<strong>{elu.nom}</strong>
										<small>
											{elu.role === 'depute'
												? (elu.nomCirco ?? `${isEn ? 'Dept.' : 'Dépt.'} ${elu.departement}`)
												: (elu.nomDept ?? `${isEn ? 'Dept.' : 'Dépt.'} ${elu.departement}`)}
											{#if elu.groupe && elu.groupe !== '—'}· {elu.groupe}{/if}
										</small>
										{#if confidenceNote(elu)}
											<small class="elu-note">{confidenceNote(elu)}</small>
										{/if}
									</div>
									{#if elu.email}
										<a class="elu-send" href={mailtoHref(elu)}>
											{isEn ? 'Write ✉' : 'Écrire ✉'}
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

		<details class="manual-fallback">
			<summary>
				{isEn
					? "Can't find them? Official directories"
					: 'Vous ne les trouvez pas ? Annuaires officiels'}
			</summary>
			<div class="find-links">
				<a
					class="find-btn"
					href="https://www.assemblee-nationale.fr/dyn/vos-deputes/carte-departements"
					target="_blank"
					rel="noopener noreferrer"
				>
					🏛️ {isEn ? 'Find my MP' : 'Trouver mon député'} · assemblee-nationale.fr
				</a>
				<a
					class="find-btn"
					href="https://www.senat.fr/vos-senateurs.html"
					target="_blank"
					rel="noopener noreferrer"
				>
					🏛️ {isEn ? 'Find my senator(s)' : 'Trouver mon/mes sénateurs'} · senat.fr
				</a>
			</div>
		</details>
	</section>

	<!-- ── Étape 2 : le message ── -->
	<section class="card">
		<h2><span class="step-num">2</span>{isEn ? 'Your message' : 'Votre message'}</h2>
		<p class="card-intro">
			{#if isEn}
				Ready to send. Personalise it if you like — just replace <strong>[your name]</strong> and
				<strong>[your town]</strong>. The recipient's name is filled in automatically.
			{:else}
				Prêt à l'envoi. Personnalisez-le si vous voulez — remplacez simplement
				<strong>[votre nom]</strong> et <strong>[votre commune]</strong>. Le nom du destinataire est
				rempli automatiquement.
			{/if}
		</p>

		<!-- Réglages compacts -->
		<div class="msg-toolbar">
			<div class="segmented" role="group" aria-label={isEn ? 'Length' : 'Longueur'}>
				<button class:active={version === 'short'} on:click={() => (version = 'short')}>
					{isEn ? 'Short' : 'Courte'}
				</button>
				<button class:active={version === 'long'} on:click={() => (version = 'long')}>
					{isEn ? 'Detailed' : 'Détaillée'}
				</button>
			</div>
			{#if version === 'long'}
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
			{/if}
		</div>

		<!-- Aperçu de l'email -->
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
							autonomous artificial intelligence systems. The leaders of the world's largest AI labs
							acknowledge that these technologies could pose a serious threat to civilisation if
							their development is not properly governed. An international report led by Turing
							Prize winner Yoshua Bengio, backed by 30 countries, confirms that no current safety
							method is reliable.
						</p>
						<p>
							There is currently no legal framework requiring independent safety evaluations before
							these systems are developed or deployed. Companies self-regulate.
						</p>
						<p>
							I ask you to put this issue on your committee's agenda and to support measures
							requiring independent safety evaluations for the most powerful AI systems.
						</p>
						<p>
							The Pause AI association (pauseia.fr) would be happy to provide a briefing to you or
							your team.
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
							artificielle de plus en plus autonomes et puissants. Les dirigeants des plus grands
							laboratoires d'IA reconnaissent eux-mêmes que ces technologies pourraient représenter
							une menace sérieuse pour la civilisation si leur développement n'est pas correctement
							encadré. Un rapport international dirigé par le prix Turing Yoshua Bengio, soutenu par
							30 pays, confirme qu'aucune méthode de sécurité actuelle n'est fiable.
						</p>
						<p>
							Il n'existe aujourd'hui aucun cadre juridique exigeant des évaluations de sécurité
							indépendantes avant que ces systèmes ne soient développés ou déployés. Les entreprises
							s'auto-évaluent.
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
				{:else if isEn}
					<p>Dear [Deputy/Senator name],</p>
					<p>My name is [your name], a resident of [your town/constituency].</p>
					<p>
						I am writing about the rapid development of increasingly powerful AI systems without any
						adequate regulatory framework. The leaders of the main AI labs acknowledge that their
						systems could pose a serious threat to civilisation if not properly governed.
					</p>
					{#if selectedThemes.has('individus')}
						<p>
							<strong>Privacy and surveillance.</strong> AI systems already enable mass surveillance
							and individual profiling on an unprecedented scale, often without people's knowledge or
							any possibility of redress.
						</p>
					{/if}
					{#if selectedThemes.has('societe')}
						<p>
							<strong>Disinformation and democracy.</strong> Content generation tools now produce disinformation
							at scale (videos and texts indistinguishable from reality), undermining democratic processes
							and trust in institutions.
						</p>
					{/if}
					{#if selectedThemes.has('economie')}
						<p>
							<strong>Job losses.</strong> Tens of millions of jobs in Europe could be significantly
							affected by 2030, across transport, accounting, legal and medical services, with no adaptation
							policy deployed at the scale required.
						</p>
					{/if}
					{#if selectedThemes.has('humanite')}
						<p>
							<strong>Existential risks.</strong> The International AI Safety Report 2025, led by Turing
							Prize winner Yoshua Bengio and backed by 30 countries, concludes that no current safety
							method can reliably guarantee safe behaviour.
						</p>
					{/if}
					<p>
						Today, no legal framework requires independent safety evaluations before deploying AI
						systems with potentially dangerous capabilities. Companies self-assess.
					</p>
					<p>
						I ask you to raise this issue with the relevant committee and support measures requiring
						independent safety evaluations for the most powerful AI systems. The Pause AI
						association (pauseia.fr) would be happy to provide a briefing.
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
						puissants, sans cadre réglementaire adapté. Les dirigeants des principaux laboratoires
						reconnaissent eux-mêmes que ces technologies pourraient représenter une menace sérieuse
						pour la civilisation.
					</p>
					{#if selectedThemes.has('individus')}
						<p>
							<strong>Vie privée et surveillance.</strong> Les systèmes d'IA permettent déjà une surveillance
							de masse et un profilage individuel sans précédent, souvent sans consentement ni recours
							possible.
						</p>
					{/if}
					{#if selectedThemes.has('societe')}
						<p>
							<strong>Désinformation et démocratie.</strong> Les outils d'IA produisent de la désinformation
							à grande échelle (vidéos et textes indiscernables du réel), fragilisant les processus démocratiques
							et la confiance dans les institutions.
						</p>
					{/if}
					{#if selectedThemes.has('economie')}
						<p>
							<strong>Perte d'emploi.</strong> Des dizaines de millions d'emplois en Europe pourraient
							être affectés d'ici 2030, des transports aux services juridiques et médicaux, sans politique
							d'adaptation à la hauteur.
						</p>
					{/if}
					{#if selectedThemes.has('humanite')}
						<p>
							<strong>Risques existentiels.</strong> Le rapport international dirigé par le prix Turing
							Yoshua Bengio, soutenu par 30 pays, conclut qu'aucune méthode actuelle ne garantit des
							comportements sûrs de manière fiable.
						</p>
					{/if}
					<p>
						Aujourd'hui, aucun cadre juridique n'exige d'évaluation de sécurité indépendante avant
						le déploiement de systèmes aux capacités potentiellement dangereuses. Les entreprises
						s'auto-évaluent.
					</p>
					<p>
						Je vous demande d'inscrire ce sujet à l'ordre du jour d'une commission compétente et de
						soutenir des évaluations de sécurité indépendantes pour les systèmes d'IA les plus
						puissants. L'association Pause IA (pauseia.fr) serait heureuse de vous fournir un
						briefing.
					</p>
					<p>
						Cordialement,<br />
						[Votre nom complet]<br />
						[Votre commune / circonscription]
					</p>
				{/if}
			</div>
			<div class="email-actions">
				<span class="bcc-hint">
					{isEn ? 'BCC' : 'CCI'} <code>{BCC}</code>
					{isEn ? '— helps us count letters sent' : '— pour compter les emails envoyés'}
				</span>
				<button class="copy-btn" class:copied on:click={copyEmail}>
					{#if copied}
						{isEn ? '✓ Copied' : '✓ Copié'}
					{:else}
						{isEn ? 'Copy' : 'Copier'}
					{/if}
				</button>
			</div>
		</div>
	</section>

	<!-- ── Pourquoi c'est important ── -->
	<section class="why">
		<h2>{isEn ? 'Why it matters' : "Pourquoi c'est important"}</h2>
		{#if isEn}
			<p>
				MPs and senators are required to respond to their constituents. A personal email — even a
				short, sincere one — lands in a human inbox, gets read, and signals that a voter cares about
				this issue. Unlike a petition or a social media post, it demands a response. A handful of
				emails from real citizens is often enough to put a topic on a committee's agenda.
			</p>
		{:else}
			<p>
				Les députés et sénateurs ont l'obligation de répondre à leurs concitoyens. Un email
				personnel — même court et sincère — arrive dans une boite mail humaine, il est lu, et il
				signale qu'un électeur se préoccupe du sujet. Contrairement à une pétition ou à un post sur
				les réseaux, il appelle une réponse. Une poignée d'emails de vrais citoyens suffit souvent à
				inscrire un sujet à l'ordre du jour d'une commission.
			</p>
		{/if}
	</section>

	<!-- ── FAQ ── -->
	<section class="faq">
		<h2>{isEn ? 'FAQ' : 'Questions fréquentes'}</h2>
		<details>
			<summary>
				{isEn
					? 'Does contacting a representative really make a difference?'
					: 'Est-ce que contacter un élu change vraiment quelque chose ?'}
			</summary>
			<p>
				{isEn
					? 'Yes. Representatives track how many constituents raise an issue, and it shapes what they prioritise. A few sincere emails can be enough to get a topic onto a committee’s agenda.'
					: "Oui. Les élus comptabilisent le nombre d'électeurs qui soulèvent un sujet, et cela oriente leurs priorités. Quelques emails sincères peuvent suffire à inscrire un sujet à l'ordre du jour d'une commission."}
			</p>
		</details>
		<details>
			<summary>
				{isEn ? 'How long does it take?' : 'Combien de temps ça prend ?'}
			</summary>
			<p>
				{isEn
					? 'About two minutes. Enter your postal code, click “Write”, replace your name and town, and send.'
					: 'Environ deux minutes. Entrez votre code postal, cliquez sur « Écrire », remplacez votre nom et votre commune, puis envoyez.'}
			</p>
		</details>
		<details>
			<summary>
				{isEn ? 'Is my information safe?' : 'Mes informations sont-elles protégées ?'}
			</summary>
			<p>
				{isEn
					? 'We collect nothing. The email is sent from your own mail app directly to your representative. The blind copy (BCC) only lets us count how many emails were sent.'
					: "Nous ne collectons rien. L'email part de votre propre messagerie directement vers votre élu. La copie cachée (CCI) nous sert uniquement à compter le nombre d'emails envoyés."}
			</p>
		</details>
	</section>
</article>

<style>
	article {
		max-inline-size: 50rem;
		margin-inline: auto;
		margin-top: 2.5rem;
		padding: 0 1.25rem 5rem;
	}

	/* Hero */
	.hero {
		text-align: center;
		margin-bottom: 2.5rem;
	}

	.hero h1 {
		font-size: clamp(1.8rem, 5vw, 2.6rem);
		font-weight: 800;
		line-height: 1.1;
		margin-bottom: 1rem;
	}

	.hero-sub {
		font-size: 1.05rem;
		line-height: 1.6;
		color: #444;
		max-inline-size: 38rem;
		margin-inline: auto;
	}

	/* Cards */
	.card {
		background: white;
		border: 1px solid #e8e8e8;
		border-radius: 14px;
		padding: 1.75rem;
		margin-bottom: 1.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
	}

	.card h2 {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		font-size: 1.25rem;
		font-weight: 700;
		margin-bottom: 1rem;
	}

	.step-num {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		inline-size: 1.7rem;
		block-size: 1.7rem;
		border-radius: 50%;
		background: var(--color-primary, #e63946);
		color: white;
		font-size: 0.95rem;
		font-weight: 700;
		flex-shrink: 0;
	}

	.card-intro {
		font-size: 0.95rem;
		line-height: 1.6;
		color: #555;
		margin-bottom: 1.25rem;
	}

	/* Recherche code postal */
	.cp-form {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.cp-input {
		flex: 1;
		min-inline-size: 200px;
		padding: 0.85rem 1rem;
		border: 2px solid #d8d8d8;
		border-radius: 10px;
		font-size: 1.05rem;
	}

	.cp-input:focus {
		outline: none;
		border-color: var(--color-primary, #e63946);
	}

	.cp-btn {
		padding: 0.85rem 1.75rem;
		background: var(--color-primary, #e63946);
		color: white;
		border: none;
		border-radius: 10px;
		font-size: 1.05rem;
		font-weight: 700;
		cursor: pointer;
		transition: opacity 0.15s;
	}

	.cp-btn:hover {
		opacity: 0.9;
	}

	/* Notices */
	.notice {
		font-size: 0.9rem;
		border-radius: 8px;
		padding: 0.6rem 0.85rem;
		margin-top: 0.85rem;
	}

	.notice--warn {
		color: #8a6d00;
		background: #fff8e1;
		border: 1px solid #ffe08a;
	}

	.notice--error {
		color: var(--color-primary, #e63946);
		background: #fdecee;
		border: 1px solid #f6c6cc;
	}

	.results-hint {
		margin-top: 1.25rem;
		font-size: 0.9rem;
		color: #666;
	}

	/* Élus */
	.elu-group {
		margin-top: 1rem;
	}

	.elu-group h3 {
		font-size: 0.8rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #888;
		margin-bottom: 0.5rem;
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
		padding: 0.8rem 1rem;
		border: 1px solid #eee;
		border-radius: 10px;
		background: #fafafa;
	}

	.elu-info {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
	}

	.elu-info strong {
		font-size: 1rem;
	}

	.elu-info small {
		font-size: 0.8rem;
		color: #777;
	}

	.elu-note {
		color: #b06a00 !important;
		font-style: italic;
	}

	.elu-send {
		flex-shrink: 0;
		padding: 0.55rem 1.25rem;
		background: var(--color-primary, #e63946);
		color: white;
		border-radius: 8px;
		text-decoration: none;
		font-size: 0.92rem;
		font-weight: 700;
		white-space: nowrap;
		transition: opacity 0.15s;
	}

	.elu-send:hover {
		opacity: 0.9;
	}

	.elu-send--alt {
		background: #6b7280;
	}

	/* Repli annuaires */
	.manual-fallback {
		margin-top: 1.5rem;
		font-size: 0.9rem;
	}

	.manual-fallback summary {
		cursor: pointer;
		color: #666;
	}

	.find-links {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-top: 0.85rem;
	}

	.find-btn {
		display: block;
		padding: 0.65rem 0.9rem;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		text-decoration: none;
		color: #333;
		background: #fafafa;
		font-size: 0.88rem;
	}

	.find-btn:hover {
		border-color: var(--color-primary, #e63946);
	}

	/* Toolbar message */
	.msg-toolbar {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
		margin-bottom: 1rem;
	}

	.segmented {
		display: inline-flex;
		border: 1px solid #d8d8d8;
		border-radius: 8px;
		overflow: hidden;
	}

	.segmented button {
		padding: 0.45rem 1rem;
		border: none;
		background: white;
		font-size: 0.88rem;
		cursor: pointer;
		color: #555;
	}

	.segmented button.active {
		background: var(--color-primary, #e63946);
		color: white;
		font-weight: 600;
	}

	.theme-chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.chip {
		padding: 0.35rem 0.8rem;
		border-radius: 999px;
		border: 1px solid #d8d8d8;
		background: white;
		font-size: 0.8rem;
		cursor: pointer;
		color: #555;
		transition: all 0.15s;
	}

	.chip.active {
		border-color: var(--color-primary, #e63946);
		background: var(--color-primary, #e63946);
		color: white;
	}

	/* Aperçu email */
	.email-preview {
		border: 1px solid #e4e4e4;
		border-radius: 10px;
		overflow: hidden;
	}

	.email-subject-line {
		background: #f5f5f5;
		padding: 0.65rem 1.1rem;
		font-size: 0.85rem;
		border-bottom: 1px solid #e4e4e4;
	}

	.subject-label {
		font-weight: 700;
		margin-right: 0.4rem;
		color: #555;
	}

	.email-body {
		padding: 1.4rem 1.6rem;
		font-size: 0.9rem;
		line-height: 1.7;
		background: white;
		max-block-size: 24rem;
		overflow-y: auto;
	}

	.email-body :global(p) {
		margin-bottom: 1em;
	}

	.email-actions {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		flex-wrap: wrap;
		padding: 0.65rem 1.1rem;
		background: #fafafa;
		border-top: 1px solid #eee;
	}

	.bcc-hint {
		font-size: 0.78rem;
		color: #888;
	}

	.bcc-hint code {
		background: #eee;
		padding: 0.05em 0.35em;
		border-radius: 4px;
		color: var(--color-primary, #e63946);
		font-weight: 600;
	}

	.copy-btn {
		padding: 0.45rem 1.1rem;
		background: white;
		color: var(--color-primary, #e63946);
		border: 1px solid var(--color-primary, #e63946);
		border-radius: 8px;
		font-size: 0.88rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.15s;
	}

	.copy-btn:hover {
		background: var(--color-primary, #e63946);
		color: white;
	}

	.copy-btn.copied {
		background: #2a9d5c;
		border-color: #2a9d5c;
		color: white;
	}

	/* Why + FAQ */
	.why,
	.faq {
		margin-top: 2.5rem;
	}

	.why h2,
	.faq h2 {
		font-size: 1.3rem;
		font-weight: 700;
		margin-bottom: 1rem;
	}

	.why p {
		line-height: 1.7;
		color: #444;
	}

	.faq details {
		border-bottom: 1px solid #eee;
		padding: 0.4rem 0;
	}

	.faq summary {
		cursor: pointer;
		font-weight: 600;
		padding: 0.6rem 0;
		list-style: none;
	}

	.faq summary::-webkit-details-marker {
		display: none;
	}

	.faq summary::before {
		content: '+';
		display: inline-block;
		inline-size: 1.2rem;
		color: var(--color-primary, #e63946);
		font-weight: 700;
	}

	.faq details[open] summary::before {
		content: '−';
	}

	.faq details p {
		padding: 0 0 0.75rem 1.2rem;
		line-height: 1.65;
		color: #555;
		font-size: 0.95rem;
	}

	@media (max-width: 600px) {
		.card {
			padding: 1.25rem;
		}

		.elu-card {
			flex-direction: column;
			align-items: stretch;
			text-align: left;
		}

		.elu-send {
			text-align: center;
		}
	}
</style>
