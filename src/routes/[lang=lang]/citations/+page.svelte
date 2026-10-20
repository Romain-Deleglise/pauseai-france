<script lang="ts">
	// Citations sur les risques de l'IA (perte de contrôle, extinction, superintelligence).
	// Les données sont dans src/lib/data/citations.json. Comme pour les démissions,
	// seules les citations relues et validées (« statut » : "valide") s'affichent en
	// production ; en développement, les citations « à vérifier » apparaissent aussi.
	import { dev } from '$app/environment'
	import PostMeta from '$components/PostMeta.svelte'
	import { Card, FilterChips, PageHero } from '$components/ui'
	import brutes from '$lib/data/citations.json'
	import type { PageData } from './$types'

	type Categorie = 'scientifiques' | 'labos' | 'politiques' | 'declarations'

	interface Citation {
		id: string
		auteur: string
		fonction: string
		categorie: Categorie
		date: string // AAAA, AAAA-MM
		citation: string // en français
		citation_originale?: string // dans la langue d'origine, si traduite
		contexte?: string // facultatif : ce qu'il faut savoir pour bien lire la citation
		source: { titre: string; url: string }
		statut: 'a_verifier' | 'valide'
	}

	export let data: PageData

	$: isEn = data.lang === 'en'
	$: title = isEn ? 'They warn about AI risks' : 'Ils alertent sur les risques de l’IA'
	$: description = isEn
		? 'Scientists, AI lab leaders and policymakers on the risks of losing control of AI, in their own words.'
		: 'Scientifiques, dirigeants des laboratoires d’IA, responsables politiques : ce qu’ils disent des risques de perte de contrôle de l’IA, dans leurs propres mots.'

	$: libelles = {
		scientifiques: isEn ? 'Scientists' : 'Scientifiques',
		labos: isEn ? 'AI lab leaders' : 'Dirigeants de labos d’IA',
		politiques: isEn ? 'Policymakers' : 'Responsables politiques',
		declarations: isEn ? 'Joint statements' : 'Déclarations collectives'
	} as Record<Categorie, string>

	const toutes = (brutes as Citation[])
		.filter((c) => dev || c.statut === 'valide')
		.sort((a, b) => b.date.localeCompare(a.date))
	const aVerifier = toutes.filter((c) => c.statut !== 'valide').length

	let categorie = 'toutes'
	// Une pastille par catégorie présente dans les données (pas de filtre vide).
	$: options = [
		{ value: 'toutes', label: isEn ? 'All' : 'Toutes', count: toutes.length },
		...(Object.keys(libelles) as Categorie[])
			.filter((k) => toutes.some((c) => c.categorie === k))
			.map((k) => ({
				value: k,
				label: libelles[k],
				count: toutes.filter((c) => c.categorie === k).length
			}))
	]
	$: affichees = categorie === 'toutes' ? toutes : toutes.filter((c) => c.categorie === categorie)

	// « 1951 » -> 1951 ; « 2025-09 » -> septembre 2025.
	$: fmtDate = (date: string) =>
		date.length === 4
			? date
			: new Date(`${date}-01`).toLocaleDateString(isEn ? 'en-GB' : 'fr-FR', {
					month: 'long',
					year: 'numeric'
				})
</script>

<PostMeta {title} {description} />

<article>
	<PageHero>
		{title}
		<svelte:fragment slot="lede">{description}</svelte:fragment>
	</PageHero>

	{#if aVerifier}
		<p class="brouillon">
			Mode développement : {aVerifier} citation(s) « à vérifier » affichée(s) ici, mais pas en production.
		</p>
	{/if}

	<FilterChips {options} bind:selected={categorie} />

	<div class="liste">
		{#each affichees as c (c.id)}
			<Card padding="compact">
				<blockquote>
					<p>«&nbsp;{c.citation}&nbsp;»</p>
					{#if c.citation_originale}
						<p class="originale" lang="en">“{c.citation_originale}”</p>
					{/if}
				</blockquote>

				<div class="auteur">
					<p class="nom">
						{c.auteur}
						{#if c.statut !== 'valide'}<span class="a-verifier">À vérifier</span>{/if}
					</p>
					<p class="fonction">{c.fonction}</p>
				</div>

				{#if c.contexte}<p class="contexte">{c.contexte}</p>{/if}

				<p class="source">
					<span class="categorie">{libelles[c.categorie]}</span> · {fmtDate(c.date)} ·
					<a href={c.source.url} target="_blank" rel="noopener">{c.source.titre}</a>
				</p>
			</Card>
		{/each}
	</div>

	<p class="note">
		{isEn
			? 'Quotes translated by Pause IA; the original wording is shown below each translation.'
			: 'Citations traduites par Pause IA ; la formulation d’origine figure sous chaque traduction.'}
	</p>
</article>

<style>
	article {
		max-inline-size: var(--width-wide);
		margin-inline: auto;
		margin-top: 3rem;
		margin-bottom: 5rem;
		padding: 0 1.5rem;
	}

	.liste {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 22rem), 1fr));
		gap: 1.25rem;
	}

	blockquote {
		margin: 0 0 1rem;
		padding-inline-start: 1rem;
		border-inline-start: 3px solid var(--brand);
	}

	blockquote p {
		margin: 0;
		font-size: 1.1rem;
		line-height: 1.5;
	}

	blockquote .originale {
		margin-top: 0.5rem;
		color: var(--text-2);
		font-size: 0.85rem;
		font-style: italic;
	}

	.auteur {
		margin-bottom: 0.75rem;
	}

	.nom {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		margin: 0;
		font-weight: 700;
	}

	.fonction,
	.contexte,
	.source,
	.note,
	.brouillon {
		color: var(--text-2);
		font-size: 0.9rem;
		line-height: 1.5;
	}

	.fonction {
		margin: 0.15rem 0 0;
	}

	.contexte {
		margin: 0 0 0.75rem;
	}

	.source {
		margin: 0;
	}

	.source a {
		color: inherit;
	}

	.categorie {
		font-weight: 600;
	}

	.a-verifier {
		padding: 0.1rem 0.55rem;
		border: 1px solid var(--brand);
		border-radius: var(--radius-pill);
		font-size: 0.75rem;
		font-weight: 600;
	}

	.brouillon {
		padding: 0.75rem 1rem;
		border: 1px dashed var(--brand);
		border-radius: var(--radius-lg);
	}

	.note {
		margin-top: 2rem;
	}

	@media (max-width: 600px) {
		article {
			padding: 0 1.1rem;
		}
	}
</style>
