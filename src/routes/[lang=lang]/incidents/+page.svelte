<script lang="ts">
	// Incidents IA : des systèmes d'IA qui échappent aux consignes, trompent ou agissent
	// hors de leur cadre. Les données sont dans src/lib/data/incidents.json, choisies dans
	// des bases existantes (AI Incident Database, observatoire des incidents de l'OCDE)
	// et dans la presse. Comme pour les autres pages, seuls les incidents relus et
	// validés (« statut » : "valide") s'affichent en production.
	import { dev } from '$app/environment'
	import PostMeta from '$components/PostMeta.svelte'
	import { Card, FilterChips, PageHero } from '$components/ui'
	import brutes from '$lib/data/incidents.json'
	import type { PageData } from './$types'

	type Categorie = 'agents' | 'intrusions' | 'tromperie'

	interface Incident {
		id: string
		titre: string
		date: string // AAAA-MM
		categorie: Categorie
		systeme: string
		resume: string
		enjeu?: string // en une phrase : ce que l'incident montre
		source: { titre: string; url: string }
		voir_aussi?: { titre: string; url: string }
		statut: 'a_verifier' | 'valide'
	}

	export let data: PageData

	$: isEn = data.lang === 'en'
	$: title = isEn ? 'AI incidents' : 'Incidents IA'
	$: description = isEn
		? 'AI systems that ignored instructions, deceived their users or acted outside their intended scope: documented cases, with their sources.'
		: 'Des systèmes d’IA qui ignorent les consignes, trompent leurs utilisateurs ou agissent hors de leur cadre : des cas documentés, avec leurs sources.'

	$: libelles = {
		agents: isEn ? 'Agents out of control' : 'Agents hors de contrôle',
		intrusions: isEn ? 'Intrusions' : 'Intrusions informatiques',
		tromperie: isEn ? 'Deception' : 'Tromperie'
	} as Record<Categorie, string>

	const tous = (brutes as Incident[])
		.filter((i) => dev || i.statut === 'valide')
		.sort((a, b) => b.date.localeCompare(a.date))
	const aVerifier = tous.filter((i) => i.statut !== 'valide').length

	let categorie = 'tous'
	$: options = [
		{ value: 'tous', label: isEn ? 'All' : 'Tous', count: tous.length },
		...(Object.keys(libelles) as Categorie[])
			.filter((k) => tous.some((i) => i.categorie === k))
			.map((k) => ({
				value: k,
				label: libelles[k],
				count: tous.filter((i) => i.categorie === k).length
			}))
	]
	$: affiches = categorie === 'tous' ? tous : tous.filter((i) => i.categorie === categorie)

	$: fmtDate = (aaaamm: string) =>
		new Date(`${aaaamm}-01`).toLocaleDateString(isEn ? 'en-GB' : 'fr-FR', {
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
			Mode développement : {aVerifier} incident(s) « à vérifier » affiché(s) ici, mais pas en production.
		</p>
	{/if}

	<FilterChips {options} bind:selected={categorie} />

	<div class="liste">
		{#each affiches as i (i.id)}
			<Card padding="compact">
				<p class="meta">
					<span class="categorie">{libelles[i.categorie]}</span> · {fmtDate(i.date)}
					{#if i.statut !== 'valide'}<span class="a-verifier">À vérifier</span>{/if}
				</p>
				<h2>{i.titre}</h2>
				<p class="systeme">{i.systeme}</p>
				<p class="resume">{i.resume}</p>
				{#if i.enjeu}<p class="enjeu">{i.enjeu}</p>{/if}
				<p class="source">
					{isEn ? 'Source:' : 'Source :'}
					<a href={i.source.url} target="_blank" rel="noopener">{i.source.titre}</a>
					{#if i.voir_aussi}
						· <a href={i.voir_aussi.url} target="_blank" rel="noopener">{i.voir_aussi.titre}</a>
					{/if}
				</p>
			</Card>
		{/each}
	</div>

	<p class="note">
		{#if isEn}
			Selected from existing databases, which list many more cases:
		{:else}
			Une sélection tirée de bases existantes, qui recensent bien d’autres cas :
		{/if}
		<a href="https://incidentdatabase.ai/" target="_blank" rel="noopener">AI Incident Database</a>,
		<a href="https://oecd.ai/en/incidents" target="_blank" rel="noopener"
			>{isEn ? 'OECD AI Incidents Monitor' : 'observatoire des incidents d’IA de l’OCDE'}</a
		>.
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

	h2 {
		margin: 0.3rem 0 0.2rem;
		font-size: 1.15rem;
		line-height: 1.35;
	}

	.meta,
	.systeme,
	.source,
	.note,
	.brouillon {
		color: var(--text-2);
		font-size: 0.9rem;
		line-height: 1.5;
	}

	.meta {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin: 0;
	}

	.categorie {
		font-weight: 600;
	}

	.systeme {
		margin: 0 0 0.75rem;
	}

	.resume {
		margin: 0 0 0.75rem;
		font-size: 0.95rem;
		line-height: 1.55;
	}

	.enjeu {
		margin: 0 0 0.75rem;
		padding-inline-start: 0.8rem;
		border-inline-start: 3px solid var(--brand);
		font-weight: 600;
		line-height: 1.5;
	}

	.source {
		margin: 0;
	}

	.source a,
	.note a {
		color: inherit;
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
