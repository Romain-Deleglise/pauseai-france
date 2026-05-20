<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import { Brain, AlertTriangle, FileText, Megaphone, BookMarked, MoveUpRight } from 'lucide-svelte'
	import type { ComponentType } from 'svelte'

	const title = 'Ressources - Pause IA'
	const description =
		"Ressources, références et liens utiles : une base de connaissances sur l'IA et ses risques existentiels."

	type Lang = 'fr' | 'en'
	type Entry = {
		title: string
		desc: string
		url: string
		langs: Lang[]
		date?: string
	}
	type Group = { subtitle?: string; highlight?: boolean; entries: Entry[] }
	type Section = {
		id: string
		icon: ComponentType
		title: string
		intro?: string
		groups: Group[]
	}

	const sections: Section[] = [
		{
			id: 'pause-ia',
			icon: BookMarked,
			title: 'Ressources Pause IA',
			groups: [
				{
					entries: [
						{
							title: "Dangers pour les individus, la société et l'humanité",
							desc: "Panorama des dangers allant de l'individuel à la société jusqu'à la perte de contrôle.",
							url: 'https://pauseia.fr/dangers/pour-les-individus',
							langs: ['fr']
						}
					]
				}
			]
		},
		{
			id: 'comprendre',
			icon: Brain,
			title: "Mieux comprendre l'IA",
			groups: [
				{
					subtitle: 'Pour démarrer',
					entries: [
						{
							title: 'Comment fonctionne un LLM ? (3Blue1Brown)',
							desc: 'Vidéo pédagogique pour saisir le fonctionnement des grands modèles de langage.',
							url: 'https://www.3blue1brown.com/lessons/mini-llm',
							langs: ['fr'],
							date: 'nov. 2024'
						}
					]
				},
				{
					highlight: true,
					subtitle: "Vue d'ensemble : capacités et tendances actuelles",
					entries: [
						{
							title: 'CAIS Dashboard',
							desc: 'Comparaison interactive des IA de pointe (capacité et sécurité).',
							url: 'https://dashboard.safe.ai/',
							langs: ['en']
						},
						{
							title: 'Epoch AI Benchmarks',
							desc: "Comparaison des performances selon le modèle, à partir d'un ensemble d'évaluations de sécurité.",
							url: 'https://epoch.ai/benchmarks',
							langs: ['en']
						},
						{
							title: 'Long-horizon tasks (METR)',
							desc: 'Évaluation de la longueur des tâches réalisées en autonomie par les IA.',
							url: 'https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/',
							langs: ['en']
						}
					]
				},
				{
					subtitle: 'Pour aller plus loin',
					entries: [
						{
							title: "Définition de l'Intelligence Artificielle Générale (IAG)",
							desc: 'Mesure de la polyvalence cognitive.',
							url: 'https://www.agidefinition.ai/',
							langs: ['en'],
							date: 'oct. 2025'
						},
						{
							title: 'AI Safety Map',
							desc: "Carte existentielle de la sécurité de l'IA et ensemble de ressources.",
							url: 'https://www.aisafety.com/map',
							langs: ['en']
						},
						{
							title: 'International AI Safety Report 2026',
							desc: 'État des lieux mondial de référence des capacités et des risques.',
							url: 'https://internationalaisafetyreport.org/',
							langs: ['en']
						}
					]
				}
			]
		},
		{
			id: 'risques',
			icon: AlertTriangle,
			title: 'Risques existentiels',
			intro: "Perte de contrôle et menaces d'extinction.",
			groups: [
				{
					entries: [
						{
							title: 'Briefing on Extinction Threats (MIRI)',
							desc: 'Synthèse des risques existentiels et pourquoi ils sont probables.',
							url: 'https://intelligence.org/briefing/',
							langs: ['en']
						},
						{
							title: 'FAQ on Catastrophic Risks (Yoshua Bengio)',
							desc: 'Réponses aux questions fréquentes sur les risques catastrophiques.',
							url: 'https://yoshuabengio.org/2023/06/24/faq-on-catastrophic-ai-risks/',
							langs: ['fr', 'en'],
							date: 'juin 2023'
						},
						{
							title: "Probabilité d'extinction par IA (PauseAI Global)",
							desc: 'Quelle est la probabilité de conséquences catastrophiques ?',
							url: 'https://pauseai.info/faq#how-likely-is-it-that-superintelligent-ai-will-cause-very-bad-outcomes-like-human-extinction',
							langs: ['en']
						}
					]
				}
			]
		},
		{
			id: 'declarations',
			icon: FileText,
			title: "Déclarations et appels à l'action",
			groups: [
				{
					entries: [
						{
							title: "Lignes Rouges pour l'IA (CeSIA)",
							desc: 'Propositions de limites à ne pas franchir.',
							url: 'https://red-lines.ai/',
							langs: ['fr'],
							date: 'sept. 2025'
						},
						{
							title: 'Déclaration sur la Superintelligence (FLI)',
							desc: 'Appel international à interdire le développement de superintelligence artificielle.',
							url: 'https://superintelligence-statement.org/',
							langs: ['en'],
							date: 'oct. 2025'
						},
						{
							title: 'Statement on AI Risk (CAIS)',
							desc: "« La réduction du risque d'extinction lié à l'IA devrait être une priorité mondiale au même titre que les pandémies et la guerre nucléaire. »",
							url: 'https://aistatement.com/',
							langs: ['en'],
							date: 'mai 2023'
						}
					]
				}
			]
		},
		{
			id: 'agir',
			icon: Megaphone,
			title: 'Faire entendre votre voix',
			groups: [
				{
					entries: [
						{
							title: "L'IA ne détruira pas QUE votre emploi",
							desc: 'Témoigner, participer à l’enquête, envoyer un mail à vos représentants.',
							url: 'https://pauseia.fr/fr/emploi-ia',
							langs: ['fr']
						},
						{
							title: 'Rejoindre Pause Action',
							desc: 'Chaque semaine une action en quelques clics pour faire pencher la balance (WhatsApp).',
							url: 'https://chat.whatsapp.com/LThhghXc0Hk3sTwQMyy1wU',
							langs: ['fr']
						}
					]
				}
			]
		}
	]

	function flagSrc(l: Lang) {
		return l === 'fr' ? '/carte/flags/fr.svg' : '/carte/flags/gb.svg'
	}
	function flagAlt(l: Lang) {
		return l === 'fr' ? 'FR' : 'EN'
	}

	function countEntries(s: Section) {
		return s.groups.reduce((n, g) => n + g.entries.length, 0)
	}
</script>

<PostMeta {title} {description} />

<article class="ressources-page">
	<!-- Hero -->
	<section class="hero">
		<UnderlinedTitle as="h1">Ressources</UnderlinedTitle>
		<p class="hero-description">
			Une base de connaissances curée sur l'IA et ses risques&nbsp;: pour comprendre, approfondir et
			passer à l'action.
		</p>

		<!-- Quick nav / TOC -->
		<nav class="toc" aria-label="Sommaire">
			{#each sections as section}
				<a href={'#' + section.id} class="toc-link">
					<svelte:component this={section.icon} size="1em" />
					<span>{section.title}</span>
					<span class="toc-count">{countEntries(section)}</span>
				</a>
			{/each}
		</nav>
	</section>

	<!-- Sections -->
	{#each sections as section}
		<section id={section.id} class="res-section">
			<header class="res-section-header">
				<div class="section-icon" aria-hidden="true">
					<svelte:component this={section.icon} size="1.2em" />
				</div>
				<div>
					<h2>{section.title}</h2>
					{#if section.intro}<p class="section-intro">{section.intro}</p>{/if}
				</div>
			</header>

			{#each section.groups as group}
				<div class="res-group" class:highlight={group.highlight}>
					{#if group.subtitle}
						<h3 class="res-subtitle">{group.subtitle}</h3>
					{/if}
					<ul class="res-list">
						{#each group.entries as entry}
							<li class="res-entry">
								<a class="res-card" href={entry.url} target="_blank" rel="noopener noreferrer">
									<div class="res-card-main">
										<div class="res-card-header">
											<h4 class="res-title">{entry.title}</h4>
											<MoveUpRight class="res-arrow" size={16} aria-hidden="true" />
										</div>
										<p class="res-desc">{entry.desc}</p>
									</div>
									<div class="res-card-meta">
										<span class="res-flags">
											{#each entry.langs as l}
												<img class="res-flag" src={flagSrc(l)} alt={flagAlt(l)} />
											{/each}
										</span>
										{#if entry.date}<span class="res-date">{entry.date}</span>{/if}
									</div>
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</section>
	{/each}

	<!-- Bottom CTA -->
	<section class="cta-card">
		<h3>Une ressource à suggérer&nbsp;?</h3>
		<p>
			Vous connaissez une référence francophone ou internationale qui devrait figurer ici&nbsp;?
			Écrivez-nous à
			<a href="mailto:contact@pauseia.fr">contact@pauseia.fr</a>.
		</p>
	</section>
</article>

<style>
	.ressources-page {
		max-inline-size: 52rem;
		margin-inline: auto;
		margin-top: 2rem;
		padding: 0 1.25rem 4rem;
	}

	/* ─── Hero ─────────────────────────────────────────────── */
	.hero {
		text-align: center;
		margin-bottom: 3rem;
		background: var(--bg);
		padding: 2.5rem 1.5rem;
		border-radius: 12px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.08);
	}

	.hero-description {
		font-size: 1.1rem;
		line-height: 1.55;
		color: var(--text-secondary);
		max-width: 38rem;
		margin: 0 auto 2rem;
	}

	/* ─── Quick nav (TOC) ──────────────────────────────────── */
	.toc {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		justify-content: center;
	}

	.toc-link {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.45rem 0.85rem;
		border-radius: 999px;
		background: var(--bg-card, #fafafa);
		border: 1px solid var(--border);
		color: var(--text);
		text-decoration: none;
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 0.85rem;
		transition:
			background 0.18s,
			border-color 0.18s,
			color 0.18s,
			transform 0.18s;
	}

	.toc-link:hover {
		background: var(--brand-light, #fff5e8);
		border-color: var(--brand);
		color: var(--brand-subtle, var(--brand));
		transform: translateY(-1px);
	}

	:global([data-theme='dark']) .toc-link {
		background: rgba(255, 255, 255, 0.04);
	}

	:global([data-theme='dark']) .toc-link:hover {
		background: rgba(255, 148, 22, 0.12);
		color: var(--brand);
	}

	.toc-count {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 1.4rem;
		height: 1.4rem;
		padding: 0 0.4rem;
		border-radius: 999px;
		background: var(--brand);
		color: white;
		font-size: 0.72rem;
		font-weight: 700;
		line-height: 1;
	}

	/* ─── Section ──────────────────────────────────────────── */
	.res-section {
		margin-bottom: 2.5rem;
		scroll-margin-top: 5rem;
	}

	.res-section-header {
		display: flex;
		align-items: flex-start;
		gap: 0.85rem;
		margin-bottom: 1.25rem;
	}

	.section-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.4rem;
		height: 2.4rem;
		border-radius: 10px;
		background: var(--brand-light, #fff5e8);
		color: var(--brand-subtle, var(--brand));
		flex-shrink: 0;
		margin-top: 0.15rem;
	}

	:global([data-theme='dark']) .section-icon {
		background: rgba(255, 148, 22, 0.15);
		color: var(--brand);
	}

	.res-section-header h2 {
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 1.4rem;
		line-height: 1.2;
		margin: 0;
		color: var(--text);
		letter-spacing: -0.01em;
	}

	.section-intro {
		font-family: var(--font-body);
		font-size: 0.95rem;
		line-height: 1.5;
		color: var(--text-secondary);
		margin: 0.35rem 0 0;
	}

	/* ─── Group ────────────────────────────────────────────── */
	.res-group {
		margin-top: 1.5rem;
	}

	.res-group:first-of-type {
		margin-top: 0;
	}

	.res-group.highlight {
		background: var(--brand-light, #fff5e8);
		border: 1px solid rgba(255, 148, 22, 0.25);
		border-radius: 12px;
		padding: 1.1rem 1.25rem 1.25rem;
		margin-top: 1.5rem;
	}

	:global([data-theme='dark']) .res-group.highlight {
		background: rgba(255, 148, 22, 0.06);
		border-color: rgba(255, 148, 22, 0.2);
	}

	.res-subtitle {
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 0.78rem;
		text-transform: uppercase;
		letter-spacing: 0.09em;
		color: var(--text-secondary);
		margin: 0 0 0.7rem;
	}

	.res-group.highlight .res-subtitle {
		color: var(--brand-subtle, var(--brand));
	}

	:global([data-theme='dark']) .res-group.highlight .res-subtitle {
		color: var(--brand);
	}

	/* ─── Entries ──────────────────────────────────────────── */
	.res-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 0.65rem;
	}

	.res-entry {
		margin: 0;
	}

	.res-card {
		display: flex;
		gap: 1rem;
		align-items: flex-start;
		justify-content: space-between;
		padding: 1rem 1.1rem;
		background: var(--bg);
		border: 1px solid var(--border);
		border-radius: 10px;
		text-decoration: none;
		color: var(--text);
		transition:
			border-color 0.2s ease,
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}

	.res-card:hover {
		border-color: var(--brand);
		transform: translateY(-1px);
		box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
	}

	:global([data-theme='dark']) .res-card {
		background: rgba(255, 255, 255, 0.02);
	}

	:global([data-theme='dark']) .res-card:hover {
		box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
	}

	.res-card-main {
		flex: 1;
		min-width: 0;
	}

	.res-card-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 0.6rem;
		margin-bottom: 0.25rem;
	}

	.res-title {
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 1rem;
		line-height: 1.35;
		margin: 0;
		color: var(--brand-subtle, var(--brand));
	}

	:global([data-theme='dark']) .res-title {
		color: var(--brand);
	}

	:global(.res-arrow) {
		color: var(--text-secondary);
		flex-shrink: 0;
		margin-top: 0.15rem;
		transition:
			transform 0.2s ease,
			color 0.2s ease;
	}

	.res-card:hover :global(.res-arrow) {
		color: var(--brand);
		transform: translate(2px, -2px);
	}

	.res-desc {
		font-family: var(--font-body);
		font-weight: 400;
		font-size: 0.95rem;
		line-height: 1.5;
		color: var(--text);
		margin: 0;
	}

	.res-card-meta {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.4rem;
		flex-shrink: 0;
	}

	.res-flags {
		display: inline-flex;
		gap: 0.25rem;
	}

	.res-flag {
		width: 1.25rem;
		height: auto;
		display: block;
		border-radius: 2px;
		box-shadow: 0 0 0 1px var(--border);
	}

	.res-date {
		font-style: italic;
		color: var(--text-secondary);
		font-size: 0.8rem;
		white-space: nowrap;
	}

	/* ─── Bottom CTA ───────────────────────────────────────── */
	.cta-card {
		margin-top: 3rem;
		padding: 1.75rem;
		background: var(--bg);
		border: 1px solid var(--border);
		border-radius: 12px;
		text-align: center;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.04);
	}

	.cta-card h3 {
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 1.15rem;
		margin: 0 0 0.5rem;
		color: var(--text);
	}

	.cta-card p {
		font-family: var(--font-body);
		font-size: 0.95rem;
		color: var(--text-secondary);
		margin: 0;
		line-height: 1.55;
	}

	.cta-card a {
		color: var(--brand-subtle, var(--brand));
		font-weight: 600;
		text-decoration: none;
	}

	:global([data-theme='dark']) .cta-card a {
		color: var(--brand);
	}

	.cta-card a:hover {
		text-decoration: underline;
	}

	/* ─── Responsive ───────────────────────────────────────── */
	@media (max-width: 640px) {
		.hero {
			padding: 2rem 1.1rem;
		}
		.res-card {
			flex-direction: column;
			gap: 0.65rem;
			padding: 0.9rem 1rem;
		}
		.res-card-meta {
			flex-direction: row;
			align-items: center;
			align-self: flex-start;
		}
		.res-group.highlight {
			padding: 0.9rem 1rem 1rem;
		}
	}
</style>
