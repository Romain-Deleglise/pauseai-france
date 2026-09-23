<script lang="ts">
	import { onMount } from 'svelte'
	import PostMeta from '$components/PostMeta.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import DeclarationNextSteps from '$components/DeclarationNextSteps.svelte'
	import type { DeclarationStats } from '../../api/declaration/+server'
	import type { GlobalSignatories } from '$lib/server/declarationGlobal'
	import type { PageData } from './$types'

	export let data: PageData
	$: isEn = data.lang === 'en'
	$: prefix = `/${data.lang}`

	$: title = isEn ? 'The PauseAI statement' : 'La déclaration PauseAI'
	$: description = isEn
		? 'We call on the governments of the world to sign an international treaty implementing a pause on the training of the most powerful general AI systems. Sign the statement.'
		: 'Nous appelons les gouvernements du monde entier à signer un traité international instaurant une pause dans l’entraînement des systèmes d’IA généralistes les plus puissants. Signez la déclaration.'

	// ── Compteur et liste (non prérendus, via /api/declaration) ──
	interface Entry {
		name: string
		title?: string
		country?: string
	}
	let local: NonNullable<DeclarationStats['local']> | null = null
	let global: GlobalSignatories | null = null
	/** Liste de Global issue de la copie figée au déploiement (API injoignable). */
	let globalFromSnapshot = false

	async function loadStats() {
		try {
			const res = await fetch('/api/declaration')
			if (res.ok) {
				const stats = (await res.json()) as DeclarationStats
				local = stats.local
				global = stats.global
			}
		} catch {
			/* compteur indisponible : la page et le formulaire restent fonctionnels */
		}
		if (!global) {
			try {
				const res = await fetch('/api/declaration/global.json')
				const snapshot = res.ok ? ((await res.json()) as GlobalSignatories) : null
				if (snapshot && snapshot.totalCount > 0) {
					global = snapshot
					globalFromSnapshot = true
				}
			} catch {
				/* pas de copie de secours : on affiche seulement nos signataires */
			}
		}
	}
	onMount(loadStats)

	// Les signatures de pauseia.fr ne sont pas comptées par pauseai.info : on
	// additionne les deux.
	$: localCount = local?.count ?? 0
	$: worldCount = global ? global.totalCount + localCount : null

	const isFrance = (country?: string) => !!country && /france/i.test(country)
	$: entries = [
		...(local?.signatories ?? []).map((s) => ({ ...s, country: 'France' })),
		...(global?.signatories ?? []).map((s) => ({ name: s.name, title: s.bio, country: s.country }))
	] as Entry[]
	$: franceCount = localCount + (global?.signatories.filter((s) => isFrance(s.country)).length ?? 0)

	// ── Filtres ──
	const ALL = ''
	const FRANCE = 'France'
	let country = FRANCE
	let query = ''
	// Pas encore de signataire en France : on montre directement tous les pays.
	$: if (country === FRANCE && entries.length && !entries.some((e) => isFrance(e.country)))
		country = ALL
	$: countries = (() => {
		const counts = new Map<string, number>()
		for (const e of entries) {
			const c = isFrance(e.country) ? FRANCE : e.country
			if (c) counts.set(c, (counts.get(c) ?? 0) + 1)
		}
		return [...counts.entries()].sort((a, b) =>
			a[0] === FRANCE ? -1 : b[0] === FRANCE ? 1 : a[0].localeCompare(b[0])
		)
	})()
	const norm = (s: string) =>
		s
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.toLowerCase()
	$: q = norm(query.trim())
	$: filtered = entries.filter(
		(e) =>
			(country === ALL || (country === FRANCE ? isFrance(e.country) : e.country === country)) &&
			(!q || norm(`${e.name} ${e.title ?? ''}`).includes(q))
	)
	const PAGE = 30
	let limit = PAGE
	$: country, query, (limit = PAGE)
	$: shown = filtered.slice(0, limit)

	const fmt = (n: number) => n.toLocaleString(isEn ? 'en-GB' : 'fr-FR')
	const fmtDate = (iso: string) =>
		new Date(iso).toLocaleDateString(isEn ? 'en-GB' : 'fr-FR', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		})

	// ── Formulaire ──
	let firstName = ''
	let lastName = ''
	let email = ''
	let jobTitle = ''
	let showName = false
	let newsletter = false
	let website = '' // champ piège anti-robots
	let submitting = false
	let error = ''
	/** pending : e-mail de confirmation envoyé ; already : déjà signataire confirmé. */
	let done: 'pending' | 'already' | null = null
	let sentTo = ''

	function restart() {
		done = null
		error = ''
	}

	async function sign() {
		error = ''
		if (!firstName.trim() || !lastName.trim()) {
			error = isEn
				? 'Please enter your first and last name.'
				: 'Merci d’indiquer votre prénom et votre nom.'
			return
		}
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
			error = isEn
				? 'Please enter a valid email address.'
				: 'Merci d’indiquer une adresse e-mail valide.'
			return
		}
		submitting = true
		try {
			const res = await fetch('/api/declaration', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					firstName,
					lastName,
					email,
					title: jobTitle,
					showName,
					newsletter,
					website,
					lang: data.lang
				})
			})
			const result = (await res.json()) as {
				success?: boolean
				pending?: boolean
				alreadySigned?: boolean
				error?: string
			}
			if (res.ok && result.success) {
				// Rien n'est compté avant le clic dans l'e-mail de confirmation.
				done = result.pending ? 'pending' : 'already'
				sentTo = email.trim()
			} else {
				error =
					result.error ||
					(isEn
						? 'Something went wrong, please try again.'
						: 'Une erreur est survenue, merci de réessayer.')
			}
		} catch {
			error = isEn
				? 'Connection error, please try again.'
				: 'Erreur de connexion, merci de réessayer.'
		} finally {
			submitting = false
		}
	}
</script>

<PostMeta {title} {description} />

<article>
	<section class="hero">
		<UnderlinedTitle as="h1">{title}</UnderlinedTitle>
		<p class="lede">
			{#if isEn}
				This statement summarises what PauseAI volunteers and supporters are asking for, in France
				and around the world. Sign it to add your voice to ours.
			{:else}
				Cette déclaration résume ce que les bénévoles et sympathisants de PauseAI demandent, en
				France comme dans le reste du monde. Signez-la pour joindre votre voix à la nôtre.
			{/if}
		</p>
	</section>

	<blockquote class="statement">
		{#if isEn}
			We call on the governments of the world to sign an international treaty implementing a pause
			on the training of the most powerful general AI systems, until we know how to build them
			safely and keep them under democratic control.
		{:else}
			Nous appelons les gouvernements du monde entier à signer un traité international instaurant
			une pause dans l’entraînement des systèmes d’IA généralistes les plus puissants, jusqu’à ce
			que nous sachions les construire de manière sûre et les maintenir sous contrôle démocratique.
		{/if}
	</blockquote>

	<p class="source">
		{#if isEn}
			This is the statement of the international PauseAI movement, also available on
			<a href="https://pauseai.info/statement" target="_blank" rel="noopener">pauseai.info</a>.
		{:else}
			Traduction de la déclaration du mouvement international PauseAI, également disponible sur
			<a href="https://pauseai.info/statement" target="_blank" rel="noopener">pauseai.info</a>.
		{/if}
	</p>

	{#if worldCount != null || localCount > 0}
		<div class="counter" aria-live="polite">
			{#if worldCount != null}
				<div class="stat">
					<span class="num">{fmt(worldCount)}</span>
					<span class="label">{isEn ? 'signatures worldwide' : 'signatures dans le monde'}</span>
				</div>
			{/if}
			{#if franceCount > 0}
				<div class="stat">
					<span class="num">{fmt(franceCount)}</span>
					<span class="label">{isEn ? 'in France' : 'en France'}</span>
				</div>
			{/if}
		</div>
	{/if}

	<section class="embed-section" id="signer">
		<h2 class="embed-title">{isEn ? 'Sign the statement' : 'Signer la déclaration'}</h2>

		{#if done === 'pending'}
			<p class="success" role="status">
				{isEn ? 'Check your inbox!' : 'Vérifiez votre boîte mail !'}
			</p>
			<p>
				{#if isEn}
					We have sent a confirmation email to <strong>{sentTo}</strong>. Your signature will be
					counted as soon as you click the link it contains.
				{:else}
					Nous venons d’envoyer un e-mail de confirmation à <strong>{sentTo}</strong>. Votre
					signature sera comptabilisée dès que vous aurez cliqué sur le lien qu’il contient.
				{/if}
			</p>
			<p class="notice">
				{#if isEn}
					Nothing received after a few minutes? Check your spam folder, or
					<button type="button" class="link" on:click={restart}>correct your email address</button>.
				{:else}
					Rien reçu après quelques minutes ? Vérifiez vos courriers indésirables, ou
					<button type="button" class="link" on:click={restart}>corrigez votre adresse</button>.
				{/if}
			</p>
		{:else if done === 'already'}
			<p class="success" role="status">
				{isEn
					? 'You had already signed the statement: thank you for your support!'
					: 'Vous aviez déjà signé la déclaration : merci pour votre soutien !'}
			</p>
			<DeclarationNextSteps lang={data.lang} />
		{:else}
			<form on:submit|preventDefault={sign} novalidate>
				<div class="row">
					<label>
						<span>{isEn ? 'First name' : 'Prénom'} *</span>
						<input bind:value={firstName} autocomplete="given-name" maxlength="64" required />
					</label>
					<label>
						<span>{isEn ? 'Last name' : 'Nom'} *</span>
						<input bind:value={lastName} autocomplete="family-name" maxlength="64" required />
					</label>
				</div>
				<label>
					<span>{isEn ? 'Email' : 'E-mail'} *</span>
					<input type="email" bind:value={email} autocomplete="email" maxlength="254" required />
				</label>
				<label>
					<span>{isEn ? 'Title or occupation (optional)' : 'Titre ou profession (facultatif)'}</span
					>
					<input
						bind:value={jobTitle}
						autocomplete="organization-title"
						maxlength="120"
						placeholder={isEn
							? 'e.g. AI researcher, city councillor…'
							: 'ex. : chercheuse en IA, conseiller municipal…'}
					/>
				</label>
				<!-- Champ piège : invisible pour les humains, rempli par les robots. -->
				<label class="hp" aria-hidden="true">
					Website <input bind:value={website} tabindex="-1" autocomplete="off" />
				</label>
				<label class="check">
					<input type="checkbox" bind:checked={showName} />
					<span>
						{isEn
							? 'Show my name (and title) in the public list of signatories'
							: 'Afficher mon nom (et mon titre) dans la liste publique des signataires'}
					</span>
				</label>
				<label class="check">
					<input type="checkbox" bind:checked={newsletter} />
					<span>
						{isEn ? 'Receive the Pause IA newsletter' : 'Recevoir la newsletter de Pause IA'}
					</span>
				</label>

				{#if error}<p class="error" role="alert">{error}</p>{/if}

				<button type="submit" class="submit" disabled={submitting}>
					{#if submitting}
						{isEn ? 'Signing…' : 'Signature…'}
					{:else}
						{isEn ? 'I sign' : 'Je signe'}
					{/if}
				</button>
				<p class="legal">
					{#if isEn}
						Your email is never published. Your data is kept by Pause IA and is not shared.
						<a href="{prefix}/politique-de-confidentialite">Privacy policy</a>.
					{:else}
						Votre e-mail n’est jamais publié. Vos données sont conservées par Pause IA et ne sont
						pas partagées.
						<a href="{prefix}/politique-de-confidentialite">Politique de confidentialité</a>.
					{/if}
				</p>
			</form>
		{/if}
	</section>

	{#if entries.length > 0}
		<section class="signatories" data-pagefind-ignore>
			<h2>{isEn ? 'Signatories' : 'Signataires'}</h2>
			<div class="filters">
				<label>
					<span>{isEn ? 'Search' : 'Rechercher'}</span>
					<input
						type="search"
						bind:value={query}
						placeholder={isEn ? 'Name, title…' : 'Nom, titre…'}
					/>
				</label>
				<label>
					<span>{isEn ? 'Country' : 'Pays'}</span>
					<select bind:value={country}>
						<option value={ALL}
							>{isEn ? 'All countries' : 'Tous les pays'} ({fmt(entries.length)})</option
						>
						{#each countries as [c, n]}
							<option value={c}>{c} ({fmt(n)})</option>
						{/each}
					</select>
				</label>
			</div>
			<p class="result-count" aria-live="polite">
				{#if isEn}
					{fmt(filtered.length)} {filtered.length > 1 ? 'names' : 'name'} shown
				{:else}
					{fmt(filtered.length)} {filtered.length > 1 ? 'noms affichés' : 'nom affiché'}
				{/if}
			</p>
			<ul>
				{#each shown as s}
					<li>
						<span class="name">{s.name}</span>
						{#if s.title}<span class="title">{s.title}</span>{/if}
						{#if country !== FRANCE && s.country}<span class="country">{s.country}</span>{/if}
					</li>
				{/each}
			</ul>
			{#if filtered.length > limit}
				<button class="toggle" on:click={() => (limit += PAGE * 3)}>
					{isEn ? 'Show more' : 'Voir plus'} ({fmt(filtered.length - limit)})
				</button>
			{/if}
			<p class="legal">
				{#if isEn}
					Includes the signatories collected by PauseAI Global on
					<a href="https://pauseai.info/statement" target="_blank" rel="noopener">pauseai.info</a
					>{#if globalFromSnapshot && global?.fetchedAt}&nbsp;(list as of {fmtDate(
							global.fetchedAt
						)}){/if}. Anonymous signatures are counted but not listed.
				{:else}
					Inclut les signataires recueillis par PauseAI Global sur
					<a href="https://pauseai.info/statement" target="_blank" rel="noopener">pauseai.info</a
					>{#if globalFromSnapshot && global?.fetchedAt}&nbsp;(liste au {fmtDate(
							global.fetchedAt
						)}){/if}. Les signatures anonymes sont comptées mais pas affichées.
				{/if}
			</p>
		</section>
	{/if}
</article>

<style>
	article {
		max-inline-size: var(--width-wide);
		margin-inline: auto;
		margin-top: 3rem;
		padding: 0 2rem;
		margin-bottom: 5rem;
	}

	.hero {
		margin-bottom: 2rem;
	}

	.lede {
		font-size: 1.2rem;
		line-height: 1.6;
		color: var(--text);
		margin-top: 1.5rem;
	}

	.statement {
		margin: 2rem 0 1rem;
		padding: 1rem 1.8rem;
		border-left: 4px solid var(--brand);
		background: var(--bg-subtle);
		border-radius: 0 10px 10px 0;
		font-weight: 500;
		font-size: 1.15rem;
		line-height: 1.7;
		color: var(--text);
	}

	@media (min-width: 600px) {
		.statement {
			font-size: 1.45rem;
		}
	}

	.source,
	.legal {
		color: var(--text-2);
		font-size: 0.9rem;
		line-height: 1.6;
	}

	.counter {
		display: flex;
		justify-content: center;
		gap: 3rem;
		margin: 2.5rem 0;
		text-align: center;
	}

	.stat {
		display: flex;
		flex-direction: column;
	}

	.num {
		font-size: 2.5rem;
		font-weight: 700;
		color: var(--brand-subtle);
		line-height: 1.1;
	}

	.label {
		color: var(--text-2);
	}

	.embed-section {
		background: var(--bg-secondary);
		border-radius: var(--radius-lg);
		padding: 2rem;
		border: 1px solid var(--border);
		box-shadow: var(--shadow-card);
		margin: 2rem 0 2.5rem;
		scroll-margin-top: 5rem;
	}

	.embed-title {
		margin: 0 0 1.25rem;
		font-size: 1.5rem;
	}

	form {
		display: grid;
		gap: 1rem;
	}

	.row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		font-size: 0.95rem;
	}

	input:not([type='checkbox']) {
		font: inherit;
		padding: 0.6rem 0.8rem;
		border: 1px solid var(--border);
		border-radius: 6px;
		background: var(--bg);
		color: var(--text);
	}

	input:focus-visible {
		outline: 2px solid var(--brand);
		outline-offset: 1px;
	}

	label.check {
		flex-direction: row;
		align-items: flex-start;
		gap: 0.6rem;
	}

	label.check input {
		margin-top: 0.25rem;
		accent-color: var(--brand);
	}

	.hp {
		position: absolute;
		left: -9999px;
		width: 1px;
		height: 1px;
		overflow: hidden;
	}

	.submit,
	.toggle {
		justify-self: start;
		padding: 0.7rem 1.6rem;
		background: var(--brand);
		color: var(--on-brand);
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font: inherit;
		font-weight: 700;
	}

	.submit:disabled {
		opacity: 0.6;
		cursor: wait;
	}

	.error {
		color: var(--error);
		margin: 0;
	}

	.notice {
		color: var(--text-2);
		font-size: 0.95rem;
	}

	.link {
		background: none;
		border: none;
		padding: 0;
		font: inherit;
		color: var(--brand-subtle);
		text-decoration: underline;
		cursor: pointer;
	}

	.success {
		font-size: 1.15rem;
		font-weight: 600;
	}

	.signatories h2 {
		font-size: 1.5rem;
		margin-bottom: 1rem;
	}

	.signatories ul {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
		gap: 0.9rem 1.5rem;
		list-style: none;
		padding: 0;
	}

	.signatories li {
		display: flex;
		flex-direction: column;
	}

	.name {
		font-weight: 600;
	}

	.title {
		font-style: italic;
		color: var(--text-2);
		font-size: 0.9rem;
	}

	.filters {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		margin-bottom: 0.5rem;
	}

	.filters label {
		flex: 1 1 14rem;
	}

	select {
		font: inherit;
		padding: 0.6rem 0.8rem;
		border: 1px solid var(--border);
		border-radius: 6px;
		background: var(--bg);
		color: var(--text);
	}

	.result-count {
		color: var(--text-2);
		font-size: 0.9rem;
		margin: 0.5rem 0 1rem;
	}

	.country {
		color: var(--text-2);
		font-size: 0.85rem;
	}

	.signatories .legal {
		margin-top: 1.5rem;
	}

	.toggle {
		margin-top: 1.5rem;
		font-weight: 400;
	}

	@media (max-width: 600px) {
		article {
			padding: 0 1rem;
		}
		.embed-section {
			padding: 1.25rem;
		}
		.row {
			grid-template-columns: 1fr;
		}
		.counter {
			gap: 1.5rem;
		}
	}
</style>
