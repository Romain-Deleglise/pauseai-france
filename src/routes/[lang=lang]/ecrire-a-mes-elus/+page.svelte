<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import Button from '$components/Button.svelte'
	import Accordion from '$components/Accordion.svelte'
	import { onMount } from 'svelte'
	import { lookupElus, isSampleData, type Elu, type LookupResult } from '$lib/data/elus'
	import type { PageData } from './$types'

	export let data: PageData
	$: lang = data.lang
	$: isEn = lang === 'en'

	const BCC = 'campagne@pauseia.fr'

	// ── Étape du parcours : 1 = trouver ses élus, 2 = rédiger le mail ──
	let step: 1 | 2 = 1
	let selectedElu: Elu | null = null

	// ── Recherche des élus par code postal ──
	let codePostal = ''
	let result: LookupResult | null = null
	let searched = false
	let searchError: 'format' | 'notfound' | null = null

	function search() {
		searched = true
		const clean = codePostal.replace(/\s/g, '')
		if (!/^\d{5}$/.test(clean)) {
			result = null
			searchError = 'format'
			return
		}
		result = lookupElus(clean)
		searchError = result ? null : 'notfound'
	}

	function choose(elu: Elu) {
		selectedElu = elu
		step = 2
		if (typeof window !== 'undefined') window.scrollTo({ top: 0 })
	}

	function back() {
		step = 1
		if (typeof window !== 'undefined') window.scrollTo({ top: 0 })
	}

	// Formule d'appel personnalisée (civilité + titre selon le rôle).
	function salutation(elu: Elu): string {
		if (isEn) return `Dear ${elu.nom},`
		const titre = elu.role === 'depute' ? 'Député' : 'Sénateur'
		if (elu.civ === 'Mme') return `Madame la ${titre === 'Député' ? 'Députée' : 'Sénatrice'},`
		if (elu.civ === 'M') return `Monsieur le ${titre},`
		return `Madame, Monsieur le ${titre},`
	}

	// Localité de l'élu (circonscription pour un député, département pour un sénateur).
	function localite(elu: Elu): string {
		return elu.role === 'depute'
			? (elu.nomCirco ?? `${isEn ? 'department' : 'département'} ${elu.departement}`)
			: (elu.nomDept ?? `${isEn ? 'department' : 'département'} ${elu.departement}`)
	}

	// 1re phrase, localisée : signale « je suis votre électeur ».
	function introLine(elu: Elu): string {
		const loc = localite(elu)
		const nom = userName.trim() || (isEn ? '[your name]' : '[votre nom]')
		const zone = isEn ? 'constituency' : 'circonscription'
		const zoneSen = isEn ? 'department' : 'département'
		if (isEn) {
			return elu.role === 'depute'
				? `My name is ${nom}, a resident of your constituency: ${loc}.`
				: `My name is ${nom}, a resident of your department: ${loc}.`
		}
		return elu.role === 'depute'
			? `Je suis ${nom}, habitant de votre ${zone} : ${loc}.`
			: `Je suis ${nom}, habitant de votre ${zoneSen} : ${loc}.`
	}

	// L'aperçu (#email-body) est déjà personnalisé pour l'élu choisi : il suffit
	// d'en prendre le texte brut.
	function buildBody(): string {
		const el = document.getElementById('email-body')
		return el ? el.innerText : ''
	}

	function mailtoHref(elu: Elu): string {
		const params = new URLSearchParams({ subject, bcc: BCC, body: buildBody() })
		// URLSearchParams encode les espaces en "+", à reconvertir en %20 pour mailto.
		return `mailto:${elu.email ?? ''}?${params.toString().replace(/\+/g, '%20')}`
	}

	// ── Infos utilisateur pour personnaliser le mail (jamais envoyées à un serveur,
	// seulement injectées dans le brouillon et mémorisées localement) ──
	let userName = ''
	let userCommune = ''
	function saveUser() {
		try {
			localStorage.setItem('elus-user', JSON.stringify({ userName, userCommune }))
		} catch {
			/* localStorage indisponible */
		}
	}

	// ── Suivi de progression : élus déjà contactés (mémorisé localement) ──
	let sent = new Set<string>()
	onMount(() => {
		try {
			sent = new Set(JSON.parse(localStorage.getItem('elus-contactes') ?? '[]'))
			const u = JSON.parse(localStorage.getItem('elus-user') ?? '{}')
			userName = u.userName ?? ''
			userCommune = u.userCommune ?? ''
		} catch {
			sent = new Set()
		}
	})
	function markSent(id: string) {
		sent = new Set(sent).add(id)
		try {
			localStorage.setItem('elus-contactes', JSON.stringify([...sent]))
		} catch {
			/* localStorage indisponible : on ignore */
		}
	}

	function openMail() {
		if (!selectedElu) return
		markSent(selectedElu.id)
		window.location.href = mailtoHref(selectedElu)
	}

	function confidenceNote(elu: Elu): string | null {
		if (elu.emailConfidence === 'high' || elu.emailConfidence === 'medium') return null
		if (isEn) return 'Please double-check this address before sending.'
		return "Vérifiez l'adresse avant l'envoi."
	}

	// Masque une photo qui ne charge pas (404) → les initiales restent visibles.
	function hideImg(e: Event) {
		;(e.currentTarget as HTMLImageElement).style.display = 'none'
	}

	function initials(elu: Elu): string {
		const parts = elu.nom.trim().split(/\s+/)
		const first = parts[0]?.[0] ?? ''
		const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
		return (first + last).toUpperCase()
	}

	function eluSubtitle(elu: Elu): string {
		const base =
			elu.role === 'depute'
				? (elu.nomCirco ?? `${isEn ? 'Dept.' : 'Dépt.'} ${elu.departement}`)
				: (elu.nomDept ?? `${isEn ? 'Dept.' : 'Dépt.'} ${elu.departement}`)
		return elu.groupe && elu.groupe !== '—' ? `${base} · ${elu.groupe}` : base
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
				{ list: result.senateurs, title: isEn ? 'Your senators' : 'Vos sénateurs' },
				{
					list: result.deputes,
					title: !result.exactDeputes
						? isEn
							? 'The MPs of your department'
							: 'Les députés de votre département'
						: result.deputes.length > 1
							? isEn
								? 'Your MPs (your city)'
								: 'Vos députés (votre ville)'
							: isEn
								? 'Your MP'
								: 'Votre député'
				}
			]
		: []

	$: allElus = result ? [...result.senateurs, ...result.deputes] : []
	$: sentCount = allElus.filter((e) => sent.has(e.id)).length
</script>

<PostMeta
	title={isEn ? 'Write to your representatives | Pause AI' : 'Écrivez à vos élus | Pause IA'}
	description={isEn
		? 'Take 2 minutes to write to your MP and senator about the risks of advanced AI systems. Enter your postal code and send a ready-made email.'
		: "Prenez 2 minutes pour écrire à votre député et à votre sénateur sur les risques des systèmes d'IA. Entrez votre code postal et envoyez un email prêt à l'emploi."}
/>

<article>
	{#if step === 1}
		<!-- ════════ Étape 1 : trouver ses élus ════════ -->
		<header class="hero-band">
			<div class="hero-inner">
				<h1>{isEn ? 'Write to your representatives' : 'Écrivez à vos élus'}</h1>
				<p class="hero-sub">
					{#if isEn}
						The most powerful AI is being built with no real safeguards. Your representatives can
						change that. Write to them: it takes two minutes.
					{:else}
						Les IA les plus puissantes se développent sans véritable garde-fou. Vos élus peuvent
						changer ça. Écrivez-leur : cela prend deux minutes.
					{/if}
				</p>
			</div>
		</header>

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
				<Button type="submit">{isEn ? 'Find' : 'Rechercher'}</Button>
			</form>

			{#if isSampleData}
				<p class="notice notice--warn">
					{isEn
						? 'Demo data. Run the generation script to load real representatives and emails.'
						: "Données d'exemple. Lancez le script de génération pour charger les vrais élus et emails."}
				</p>
			{/if}

			{#if searchError === 'format'}
				<p class="notice notice--error">
					{isEn
						? 'A French postal code has 5 digits (e.g. 75011). Please check what you typed.'
						: 'Un code postal français comporte 5 chiffres (ex. 75011). Vérifiez votre saisie.'}
				</p>
			{:else if searchError === 'notfound'}
				<p class="notice notice--error">
					{isEn
						? 'No representative found for this postal code. Double-check it, or use the official directories below.'
						: 'Aucun élu trouvé pour ce code postal. Vérifiez-le, ou utilisez les annuaires officiels ci-dessous.'}
				</p>
			{/if}

			{#if result}
				<p class="results-hint">
					{#if sentCount > 0}
						<strong>{sentCount}/{allElus.length}</strong>
						{isEn ? 'contacted.' : 'contactés.'}
						{#if sentCount < allElus.length}
							{isEn
								? 'Write to the others too. It all counts.'
								: 'Écrivez aussi aux autres, chaque message compte.'}
						{:else}
							🎉 {isEn
								? 'You contacted them all. Thank you!'
								: 'Vous les avez tous contactés. Merci !'}
						{/if}
					{:else}
						{isEn
							? 'Write to each of your representatives: one personal email each.'
							: 'Écrivez à chacun de vos élus : un email personnel pour chaque.'}
					{/if}
				</p>
				{#each eluGroups as group}
					{#if group.list.length}
						<div class="elu-group">
							<h3>{group.title}</h3>
							<ul class="elu-list">
								{#each group.list as elu (elu.id)}
									<li class="elu-card" class:done={sent.has(elu.id)}>
										<div class="elu-left">
											<span class="avatar">
												{initials(elu)}
												{#if elu.photo}
													<img src={elu.photo} alt="" loading="lazy" on:error={hideImg} />
												{/if}
											</span>
											<div class="elu-info">
												<strong>
													{#if sent.has(elu.id)}<span class="done-check">✓</span>{/if}{elu.nom}
												</strong>
												<small>{eluSubtitle(elu)}</small>
											</div>
										</div>
										<Button alt={sent.has(elu.id)} on:click={() => choose(elu)}>
											{#if sent.has(elu.id)}
												{isEn ? 'Written ✓' : 'Écrit ✓'}
											{:else}
												{isEn ? 'Write' : 'Écrire'}
											{/if}
										</Button>
									</li>
								{/each}
							</ul>
						</div>
					{/if}
				{/each}
			{/if}

			{#if searched && !result}
				<details class="manual-fallback" open>
					<summary>
						{isEn ? 'Official directories' : 'Annuaires officiels'}
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
			{/if}
		</section>

		<!-- Pourquoi c'est important -->
		<section class="card prose">
			<h2>{isEn ? 'Why it matters' : "Pourquoi c'est important"}</h2>
			{#if isEn}
				<p>
					MPs and senators take their constituents' messages into account. A personal email (even a
					short, sincere one) lands in a human inbox, gets read, and signals that a voter cares
					about this issue. Unlike a petition or a social media post, it carries real weight. A
					handful of emails from real citizens is often enough to put a topic on a committee's
					agenda.
				</p>
			{:else}
				<p>
					Les députés et sénateurs prennent en compte les messages de leurs électeurs. Un email
					personnel (même court et sincère) arrive dans une boite mail humaine, il est lu, et il
					signale qu'un électeur se préoccupe du sujet. Contrairement à une pétition ou à un post
					sur les réseaux, il a un vrai poids. Une poignée d'emails de vrais citoyens suffit souvent
					à inscrire un sujet à l'ordre du jour d'une commission.
				</p>
			{/if}
		</section>

		<!-- FAQ -->
		<section class="card faq">
			<h2>{isEn ? 'FAQ' : 'Questions fréquentes'}</h2>
			<Accordion id="faq-difference" noHash>
				<span slot="head">
					{isEn
						? 'Does contacting a representative really make a difference?'
						: 'Est-ce que contacter un élu change vraiment quelque chose ?'}
				</span>
				<p slot="details">
					{isEn
						? 'Yes. Representatives track how many constituents raise an issue, and it shapes what they prioritise. A few sincere emails can be enough to get a topic onto a committee’s agenda.'
						: "Oui. Les élus comptabilisent le nombre d'électeurs qui soulèvent un sujet, et cela oriente leurs priorités. Quelques emails sincères peuvent suffire à inscrire un sujet à l'ordre du jour d'une commission."}
				</p>
			</Accordion>
			<Accordion id="faq-duree" noHash>
				<span slot="head">{isEn ? 'How long does it take?' : 'Combien de temps ça prend ?'}</span>
				<p slot="details">
					{isEn
						? 'About two minutes. Enter your postal code, pick a representative, replace your name and town, and send.'
						: 'Environ deux minutes. Entrez votre code postal, choisissez un élu, remplacez votre nom et votre commune, puis envoyez.'}
				</p>
			</Accordion>
			<Accordion id="faq-donnees" noHash>
				<span slot="head">
					{isEn ? 'Is my information safe?' : 'Mes informations sont-elles protégées ?'}
				</span>
				<p slot="details">
					{isEn
						? 'We collect nothing. The email is sent from your own mail app directly to your representative. The blind copy (BCC) only lets us count how many emails were sent.'
						: "Nous ne collectons rien. L'email part de votre propre messagerie directement vers votre élu. La copie cachée (CCI) nous sert uniquement à compter le nombre d'emails envoyés."}
				</p>
			</Accordion>
		</section>
	{:else if selectedElu}
		<!-- ════════ Étape 2 : rédiger le mail ════════ -->
		<button class="back-link" on:click={back}>
			← {isEn ? 'Back to my representatives' : 'Retour à mes élus'}
		</button>

		<section class="card">
			<h2>
				<span class="step-num">2</span>{isEn ? 'Your message' : 'Votre message'}
			</h2>

			<div class="recipient">
				<span class="avatar avatar--lg">
					{initials(selectedElu)}
					{#if selectedElu.photo}
						<img src={selectedElu.photo} alt="" on:error={hideImg} />
					{/if}
				</span>
				<div>
					<span class="recipient-label">{isEn ? 'To:' : 'À :'}</span>
					<strong>{selectedElu.nom}</strong>
					<small>{eluSubtitle(selectedElu)}</small>
					{#if selectedElu.contactUrl}
						<a
							class="profile-link"
							href={selectedElu.contactUrl}
							target="_blank"
							rel="noopener noreferrer"
						>
							{isEn ? 'View official profile ↗' : 'Voir sa fiche officielle ↗'}
						</a>
					{/if}
				</div>
			</div>

			<p class="card-intro">
				{#if isEn}
					Add your name and town below and the email is fully written, ready to send.
				{:else}
					Indiquez votre nom et votre commune ci-dessous : l'email est alors entièrement rédigé,
					prêt à envoyer.
				{/if}
			</p>

			<!-- Vos infos : remplissent le mail (jamais envoyées à un serveur) -->
			<div class="user-fields">
				<input
					class="user-input"
					type="text"
					placeholder={isEn ? 'Your full name' : 'Votre nom complet'}
					autocomplete="name"
					bind:value={userName}
					on:input={saveUser}
				/>
				<input
					class="user-input"
					type="text"
					placeholder={isEn ? 'Your town' : 'Votre commune'}
					bind:value={userCommune}
					on:input={saveUser}
				/>
			</div>

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
					<p>{salutation(selectedElu)}</p>
					<p>{introLine(selectedElu)}</p>
					{#if version === 'short'}
						{#if isEn}
							<p>
								I am writing to draw your attention to the rapid development of increasingly
								autonomous artificial intelligence systems. The leaders of the world's largest AI
								labs acknowledge that these technologies could pose a serious threat to civilisation
								if their development is not properly governed. An international report led by Turing
								Prize winner Yoshua Bengio, backed by 30 countries, confirms that no current safety
								method is reliable.
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
								The Pause AI association (pauseia.fr) would be happy to provide a briefing to you or
								your team.
							</p>
						{:else}
							<p>
								Je vous contacte au sujet du développement rapide de systèmes d'intelligence
								artificielle de plus en plus autonomes et puissants. Les dirigeants des plus grands
								laboratoires d'IA reconnaissent eux-mêmes que ces technologies pourraient
								représenter une menace sérieuse pour la civilisation si leur développement n'est pas
								correctement encadré. Un rapport international dirigé par le prix Turing Yoshua
								Bengio, soutenu par 30 pays, confirme qu'aucune méthode de sécurité actuelle n'est
								fiable.
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
						{/if}
					{:else if isEn}
						<p>
							I am writing about the rapid development of increasingly powerful AI systems without
							any adequate regulatory framework. The leaders of the main AI labs acknowledge that
							their systems could pose a serious threat to civilisation if not properly governed.
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
							I ask you to raise this issue with the relevant committee and support measures
							requiring independent safety evaluations for the most powerful AI systems. The Pause
							AI association (pauseia.fr) would be happy to provide a briefing.
						</p>
					{:else}
						<p>
							Je vous écris au sujet du développement rapide de systèmes d'IA de plus en plus
							puissants, sans cadre réglementaire adapté. Les dirigeants des principaux laboratoires
							reconnaissent eux-mêmes que ces technologies pourraient représenter une menace
							sérieuse pour la civilisation.
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
								à grande échelle (vidéos et textes indiscernables du réel), fragilisant les processus
								démocratiques et la confiance dans les institutions.
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
							Je vous demande d'inscrire ce sujet à l'ordre du jour d'une commission compétente et
							de soutenir des évaluations de sécurité indépendantes pour les systèmes d'IA les plus
							puissants. L'association Pause IA (pauseia.fr) serait heureuse de vous fournir un
							briefing.
						</p>
					{/if}
					<p>
						{isEn ? 'Yours sincerely,' : 'Cordialement,'}<br />
						{userName.trim() || (isEn ? '[Your full name]' : '[Votre nom complet]')}<br />
						{userCommune.trim() || localite(selectedElu)}
					</p>
				</div>
			</div>

			{#if confidenceNote(selectedElu)}
				<p class="notice notice--warn">{confidenceNote(selectedElu)}</p>
			{/if}

			<div class="send-row">
				{#if selectedElu.email}
					<Button on:click={openMail}>{isEn ? 'Open my email' : 'Ouvrir mon email'}</Button>
				{:else if selectedElu.contactUrl}
					<Button href={selectedElu.contactUrl} target="_blank" rel="noopener noreferrer">
						{isEn ? 'Open contact form' : 'Ouvrir le formulaire'}
					</Button>
				{/if}
				<Button alt on:click={copyEmail}>
					{#if copied}
						{isEn ? '✓ Copied' : '✓ Copié'}
					{:else}
						{isEn ? 'Copy text' : 'Copier le texte'}
					{/if}
				</Button>
			</div>

			<p class="bcc-hint">
				{isEn ? 'BCC' : 'CCI'} <code>{BCC}</code>
				{isEn ? '(helps us count letters sent)' : '(pour compter les emails envoyés)'}
			</p>
		</section>
	{/if}
</article>

<style>
	article {
		max-inline-size: 50rem;
		margin-inline: auto;
		margin-top: 2.5rem;
		padding: 0 1.25rem 5rem;
	}

	/* Hero coloré pleine largeur (full-bleed : déborde de la largeur de l'article) */
	.hero-band {
		width: 100vw;
		margin-left: calc(50% - 50vw);
		margin-top: -2.5rem; /* annule le margin-top de l'article */
		margin-bottom: 2.75rem;
		padding: 3.5rem 1.25rem 3.25rem;
		background: var(--brand);
		text-align: center;
	}

	.hero-inner {
		max-inline-size: 44rem;
		margin-inline: auto;
	}

	.hero-band h1 {
		font-size: clamp(2rem, 6vw, 3rem);
		font-weight: 800;
		line-height: 1.05;
		margin: 0 0 1rem;
		color: #1a1a1a;
	}

	.hero-sub {
		font-size: clamp(1rem, 2.2vw, 1.2rem);
		line-height: 1.5;
		margin: 0 auto;
		max-inline-size: 36rem;
		color: #3a2600;
		font-weight: 500;
	}

	/* Cards */
	.card {
		background: var(--bg);
		border: 1px solid var(--border);
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
		margin: 0 0 1rem;
	}

	.step-num {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		inline-size: 1.7rem;
		block-size: 1.7rem;
		border-radius: 50%;
		background: var(--brand);
		color: #1a1a1a;
		font-size: 0.95rem;
		font-weight: 700;
		flex-shrink: 0;
	}

	.card-intro {
		font-size: 0.95rem;
		line-height: 1.6;
		color: var(--text-2);
		margin-bottom: 1.25rem;
	}

	/* Champs nom / commune */
	.user-fields {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		margin-bottom: 1.25rem;
	}

	.user-input {
		flex: 1;
		min-inline-size: 180px;
		padding: 0.7rem 0.9rem;
		border: 2px solid var(--border);
		border-radius: 9px;
		font-size: 0.95rem;
		background: var(--bg);
		color: var(--text);
	}

	.user-input:focus {
		outline: none;
		border-color: var(--brand);
	}

	/* Recherche code postal */
	.cp-form {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		align-items: center;
	}

	.cp-input {
		flex: 1;
		min-inline-size: 200px;
		padding: 0.85rem 1rem;
		border: 2px solid var(--border);
		border-radius: 10px;
		font-size: 1.05rem;
		background: var(--bg);
		color: var(--text);
	}

	.cp-input:focus {
		outline: none;
		border-color: var(--brand);
	}

	/* Notices */
	.notice {
		font-size: 0.9rem;
		border-radius: 8px;
		padding: 0.6rem 0.85rem;
		margin-top: 0.85rem;
	}

	.notice--warn {
		color: var(--brand-subtle);
		background: var(--brand-light);
		border: 1px solid var(--brand);
	}

	.notice--error {
		color: #c0392b;
		background: #fdecee;
		border: 1px solid #f6c6cc;
	}

	.results-hint {
		margin-top: 1.25rem;
		font-size: 0.9rem;
		color: var(--text-2);
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
		color: var(--text-secondary);
		margin: 0 0 0.5rem;
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
		border: 1px solid var(--border);
		border-radius: 10px;
		background: var(--bg-card);
		transition: opacity 0.15s;
	}

	.elu-card.done {
		opacity: 0.7;
		background: var(--brand-light);
		border-color: var(--brand);
	}

	.done-check {
		color: #2a9d5c;
		font-weight: 700;
		margin-right: 0.35rem;
	}

	/* Avatar (photo ou initiales) */
	.elu-left {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		min-inline-size: 0;
	}

	.avatar {
		position: relative;
		flex-shrink: 0;
		inline-size: 2.6rem;
		block-size: 2.6rem;
		border-radius: 50%;
		background: var(--brand-light);
		color: var(--brand-subtle);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.85rem;
		font-weight: 700;
		overflow: hidden;
	}

	.avatar img {
		position: absolute;
		inset: 0;
		inline-size: 100%;
		block-size: 100%;
		object-fit: cover;
	}

	.avatar--lg {
		inline-size: 3.4rem;
		block-size: 3.4rem;
		font-size: 1.05rem;
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
		color: var(--text-secondary);
	}

	/* Repli annuaires */
	.manual-fallback {
		margin-top: 1.5rem;
		font-size: 0.9rem;
	}

	.manual-fallback summary {
		cursor: pointer;
		color: var(--text-2);
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
		border: 1px solid var(--border);
		border-radius: 8px;
		text-decoration: none;
		color: var(--text);
		background: var(--bg-card);
		font-size: 0.88rem;
	}

	.find-btn:hover {
		border-color: var(--brand);
	}

	/* Retour */
	.back-link {
		background: none;
		border: none;
		color: var(--brand-subtle);
		font-size: 0.95rem;
		font-weight: 600;
		cursor: pointer;
		padding: 0;
		margin-bottom: 1rem;
	}

	.back-link:hover {
		text-decoration: underline;
	}

	/* Destinataire */
	.recipient {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.85rem 1rem;
		background: var(--brand-light);
		border-radius: 10px;
		margin-bottom: 1.25rem;
	}

	.recipient-label {
		font-size: 0.72rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--brand-subtle);
	}

	.recipient > div {
		display: flex;
		flex-direction: column;
		gap: 0.05rem;
	}

	.recipient small {
		font-size: 0.8rem;
		color: var(--text-2);
	}

	.profile-link {
		font-size: 0.78rem;
		color: var(--brand-subtle);
		margin-top: 0.15rem;
		width: fit-content;
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
		border: 1px solid var(--border);
		border-radius: 8px;
		overflow: hidden;
	}

	.segmented button {
		padding: 0.45rem 1rem;
		border: none;
		background: var(--bg);
		font-size: 0.88rem;
		cursor: pointer;
		color: var(--text-2);
	}

	.segmented button.active {
		background: var(--brand);
		color: #1a1a1a;
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
		border: 1px solid var(--border);
		background: var(--bg);
		font-size: 0.8rem;
		cursor: pointer;
		color: var(--text-2);
		transition: all 0.15s;
	}

	.chip.active {
		border-color: var(--brand);
		background: var(--brand);
		color: #1a1a1a;
	}

	/* Aperçu email */
	.email-preview {
		border: 1px solid var(--border);
		border-radius: 10px;
		overflow: hidden;
	}

	.email-subject-line {
		background: var(--bg-card);
		padding: 0.65rem 1.1rem;
		font-size: 0.85rem;
		border-bottom: 1px solid var(--border);
	}

	.subject-label {
		font-weight: 700;
		margin-right: 0.4rem;
		color: var(--text-2);
	}

	.email-body {
		padding: 1.4rem 1.6rem;
		font-size: 0.9rem;
		line-height: 1.7;
		background: var(--bg);
		max-block-size: 22rem;
		overflow-y: auto;
	}

	.email-body :global(p) {
		margin-bottom: 1em;
	}

	.send-row {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
		margin-top: 1.25rem;
	}

	.bcc-hint {
		font-size: 0.78rem;
		color: var(--text-secondary);
		margin-top: 0.85rem;
	}

	.bcc-hint code {
		background: var(--bg-card);
		padding: 0.05em 0.35em;
		border-radius: 4px;
		color: var(--brand-subtle);
		font-weight: 600;
	}

	/* Prose + FAQ (en boxes blanches comme les cartes d'étape) */
	.prose h2,
	.faq h2 {
		font-size: 1.3rem;
		font-weight: 700;
		margin: 0 0 1rem;
	}

	.prose p {
		line-height: 1.7;
		color: var(--text-2);
		margin: 0;
	}

	/* L'accordéon partagé gère son propre titre : on neutralise la marge h3 */
	.faq :global(.accordion .title) {
		font-size: 1.05rem;
	}

	.faq :global(.accordion .header) {
		padding: 1.1rem 0;
	}

	@media (max-width: 600px) {
		.card {
			padding: 1.25rem;
		}

		.elu-card {
			flex-direction: column;
			align-items: stretch;
		}
	}
</style>
