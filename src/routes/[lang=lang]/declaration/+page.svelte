<script lang="ts">
	import { onMount } from 'svelte'
	import PostMeta from '$components/PostMeta.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import type { DeclarationStats } from '../../api/declaration/+server'
	import type { PageData } from './$types'

	export let data: PageData
	$: isEn = data.lang === 'en'
	$: prefix = `/${data.lang}`

	$: title = isEn ? 'The PauseAI statement' : 'La déclaration PauseAI'
	$: description = isEn
		? 'We call on the governments of the world to sign an international treaty implementing a pause on the training of the most powerful general AI systems. Sign the statement.'
		: 'Nous appelons les gouvernements du monde entier à signer un traité international instaurant une pause dans l’entraînement des systèmes d’IA généralistes les plus puissants. Signez la déclaration.'

	// ── Compteur et liste (non prérendus, via /api/declaration) ──
	let stats: DeclarationStats | null = null
	const PREVIEW = 12
	let showAll = false
	$: shown = stats ? (showAll ? stats.signatories : stats.signatories.slice(0, PREVIEW)) : []
	// Les signatures de pauseia.fr ne sont pas comptées par pauseai.info : on
	// additionne les deux quand le total mondial est disponible.
	$: worldCount = stats?.globalCount != null ? stats.globalCount + stats.count : null

	const fmt = (n: number) => n.toLocaleString(isEn ? 'en-GB' : 'fr-FR')

	async function loadStats() {
		try {
			const res = await fetch('/api/declaration')
			if (res.ok) stats = (await res.json()) as DeclarationStats
		} catch {
			/* compteur indisponible : la page et le formulaire restent fonctionnels */
		}
	}
	onMount(loadStats)

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
	let done: 'signed' | 'already' | null = null

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
					website
				})
			})
			const result = (await res.json()) as {
				success?: boolean
				alreadySigned?: boolean
				error?: string
			}
			if (res.ok && result.success) {
				done = result.alreadySigned ? 'already' : 'signed'
				void loadStats()
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

	{#if stats && stats.count > 0}
		<div class="counter" aria-live="polite">
			{#if worldCount != null}
				<div class="stat">
					<span class="num">{fmt(worldCount)}</span>
					<span class="label">{isEn ? 'signatures worldwide' : 'signatures dans le monde'}</span>
				</div>
			{/if}
			<div class="stat">
				<span class="num">{fmt(stats.count)}</span>
				<span class="label">{isEn ? 'on pauseia.fr' : 'sur pauseia.fr'}</span>
			</div>
		</div>
	{/if}

	<section class="embed-section" id="signer">
		<h2 class="embed-title">{isEn ? 'Sign the statement' : 'Signer la déclaration'}</h2>

		{#if done}
			<p class="success" role="status">
				{#if done === 'already'}
					{isEn
						? 'You had already signed the statement: thank you for your support!'
						: 'Vous aviez déjà signé la déclaration : merci pour votre soutien !'}
				{:else}
					{isEn
						? 'Thank you, your signature has been recorded!'
						: 'Merci, votre signature a bien été enregistrée !'}
				{/if}
			</p>
			<p>
				{#if isEn}
					Want to go further? <a href="{prefix}/ecrire-a-mes-elus">Write to your representatives</a>
					or <a href="{prefix}/rejoindre">join us</a>.
				{:else}
					Envie d’aller plus loin ? <a href="{prefix}/ecrire-a-mes-elus">Écrivez à vos élus</a>
					ou <a href="{prefix}/rejoindre">rejoignez-nous</a>.
				{/if}
			</p>
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

	{#if stats && stats.signatories.length > 0}
		<section class="signatories" data-pagefind-ignore>
			<h2>{isEn ? 'Signatories' : 'Signataires'}</h2>
			<ul>
				{#each shown as s}
					<li>
						<span class="name">{s.name}</span>
						{#if s.title}<span class="title">{s.title}</span>{/if}
					</li>
				{/each}
			</ul>
			{#if stats.signatories.length > PREVIEW}
				<button class="toggle" on:click={() => (showAll = !showAll)}>
					{#if showAll}
						{isEn ? 'Show less' : 'Voir moins'}
					{:else}
						{isEn ? 'Show all signatories' : 'Voir tous les signataires'}
					{/if}
				</button>
			{/if}
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
