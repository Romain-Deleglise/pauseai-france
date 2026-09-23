<script lang="ts">
	import { onMount } from 'svelte'
	import PostMeta from '$components/PostMeta.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import type { SignatoriesResponse } from '../../api/signatories/+server'
	import type { PageData } from './$types'

	export let data: PageData
	$: isEn = data.lang === 'en'

	// Formulaire Tally de PauseAI Global (pauseai.info/statement) : les signatures
	// recueillies ici s'ajoutent directement au décompte mondial.
	const TALLY_FORM_ID = '315xdg'
	const TALLY_SRC = `https://tally.so/embed/${TALLY_FORM_ID}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`
	const TALLY_SCRIPT = 'https://tally.so/widgets/embed.js'

	$: title = isEn ? 'The PauseAI statement' : 'La déclaration PauseAI'
	$: description = isEn
		? 'We call on the governments of the world to sign an international treaty implementing a pause on the training of the most powerful general AI systems. Sign the statement.'
		: 'Nous appelons les gouvernements du monde entier à signer un traité international instaurant une pause dans l’entraînement des systèmes d’IA généralistes les plus puissants. Signez la déclaration.'

	let stats: SignatoriesResponse | null = null
	const PREVIEW = 12
	let showAll = false
	$: shown = stats ? (showAll ? stats.france : stats.france.slice(0, PREVIEW)) : []

	const fmt = (n: number) => n.toLocaleString(isEn ? 'en-GB' : 'fr-FR')

	onMount(async () => {
		if (!document.querySelector(`script[src="${TALLY_SCRIPT}"]`)) {
			const script = document.createElement('script')
			script.src = TALLY_SCRIPT
			script.async = true
			document.body.appendChild(script)
		} else {
			;(window as Window & { Tally?: { loadEmbeds: () => void } }).Tally?.loadEmbeds()
		}

		try {
			const res = await fetch('/api/signatories')
			if (res.ok) stats = (await res.json()) as SignatoriesResponse
		} catch {
			/* compteur indisponible : la page et le formulaire restent fonctionnels */
		}
	})
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

	{#if !isEn}
		<p class="source">
			Traduction de la
			<a href="https://pauseai.info/statement" target="_blank" rel="noopener">déclaration PauseAI</a
			>
			(texte de référence en anglais). Les signatures recueillies sur cette page sont comptabilisées
			avec celles du monde entier.
		</p>
	{:else}
		<p class="source">
			Same statement and signature list as
			<a href="https://pauseai.info/statement" target="_blank" rel="noopener"
				>pauseai.info/statement</a
			>.
		</p>
	{/if}

	{#if stats && stats.totalCount > 0}
		<div class="counter" aria-live="polite">
			<div class="stat">
				<span class="num">{fmt(stats.totalCount)}</span>
				<span class="label">{isEn ? 'signatures worldwide' : 'signatures dans le monde'}</span>
			</div>
			<div class="stat">
				<span class="num">{fmt(stats.franceCount)}</span>
				<span class="label">{isEn ? 'in France' : 'en France'}</span>
			</div>
		</div>
	{/if}

	<section class="embed-section" id="signer">
		<h2 class="embed-title">{isEn ? 'Sign the statement' : 'Signer la déclaration'}</h2>
		{#if !isEn}
			<p class="note">
				Le formulaire est celui de PauseAI Global, en anglais. Indiquez « France » comme pays pour
				apparaître parmi les signataires français, puis confirmez votre signature via l’e-mail de
				vérification.
			</p>
		{/if}
		<iframe
			data-tally-src={TALLY_SRC}
			loading="lazy"
			width="100%"
			height="282"
			frameborder="0"
			marginheight="0"
			marginwidth="0"
			title={isEn ? 'Sign the PauseAI statement' : 'Signer la déclaration PauseAI'}
		></iframe>
	</section>

	{#if stats && stats.france.length > 0}
		<section class="signatories" data-pagefind-ignore>
			<h2>{isEn ? 'Signatories in France' : 'Signataires en France'} ({fmt(stats.franceCount)})</h2>
			<ul>
				{#each shown as s}
					<li>
						<span class="name">{s.name}</span>
						{#if s.bio}<span class="bio">{s.bio}</span>{/if}
					</li>
				{/each}
			</ul>
			{#if stats.france.length > PREVIEW}
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
	.note {
		color: var(--text-2);
		font-size: 0.95rem;
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
		margin: 0 0 1rem;
		font-size: 1.5rem;
	}

	.embed-section iframe {
		width: 100%;
		border: 0;
		margin-top: 1rem;
	}

	.signatories h2 {
		font-size: 1.5rem;
		margin-bottom: 1rem;
	}

	.signatories ul {
		display: grid;
		gap: 0.9rem;
		list-style: none;
		padding: 0;
	}

	.signatories li {
		display: flex;
		flex-direction: column;
	}

	.name {
		font-weight: 600;
		text-transform: capitalize;
	}

	.bio {
		font-style: italic;
		color: var(--text-2);
		font-size: 0.95rem;
	}

	.toggle {
		margin-top: 1.5rem;
		padding: 0.5rem 1.2rem;
		background: var(--brand);
		color: var(--on-brand);
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font: inherit;
	}

	@media (max-width: 600px) {
		article {
			padding: 0 1rem;
		}
		.embed-section {
			padding: 1.25rem;
		}
		.counter {
			gap: 1.5rem;
		}
	}
</style>
