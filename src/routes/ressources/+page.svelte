<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'

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
	type Group = { subtitle?: string; subgroup?: boolean; entries: Entry[] }
	type Section = {
		emoji?: string
		logo?: string
		title: string
		intro?: string
		groups: Group[]
	}

	const sections: Section[] = [
		{
			logo: '/carte/logos/pauseialogo.png',
			title: 'Ressources Pause IA',
			groups: [
				{
					entries: [
						{
							title: "Dangers pour les individus, la société et l'humanité (Pause IA)",
							desc: "Panorama des dangers allant de l'individuel à la société jusqu'à la perte de contrôle.",
							url: 'https://pauseia.fr/dangers/pour-les-individus',
							langs: ['fr']
						}
					]
				}
			]
		},
		{
			emoji: '🧠',
			title: "Mieux comprendre l'IA",
			groups: [
				{
					subtitle: 'Pour démarrer',
					entries: [
						{
							title: 'Comment fonctionne un LLM ? (3Blue1Brown)',
							desc: 'Vidéo pédagogique.',
							url: 'https://www.3blue1brown.com/lessons/mini-llm',
							langs: ['fr'],
							date: '(nov. 2024)'
						}
					]
				},
				{
					subgroup: true,
					subtitle: "Pour avoir une vue d'ensemble sur les capacités actuelles et tendances",
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
							desc: 'Évaluation de la longueur des tâches réalisées en autonomie.',
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
							date: '(octobre 2025)'
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
			emoji: '☢️',
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
							date: '(juin 2023)'
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
			emoji: '📜',
			title: "Déclarations et appel à l'action",
			groups: [
				{
					entries: [
						{
							title: "Lignes Rouges pour l'IA (CeSIA)",
							desc: 'Propositions de limites à ne pas franchir.',
							url: 'https://red-lines.ai/',
							langs: ['fr'],
							date: '(septembre 2025)'
						},
						{
							title: 'Déclaration sur la Superintelligence (FLI)',
							desc: 'Appel international à interdire le développement de superintelligence artificielle.',
							url: 'https://superintelligence-statement.org/',
							langs: ['en'],
							date: '(octobre 2025)'
						},
						{
							title: 'Statement on AI Risk (CAIS)',
							desc: "« La réduction du risque d'extinction lié à l'IA devrait être une priorité mondiale au même titre que les pandémies et la guerre nucléaire. »",
							url: 'https://aistatement.com/',
							langs: ['en'],
							date: '(mai 2023)'
						}
					]
				}
			]
		},
		{
			emoji: '📢',
			title: 'Faire entendre votre voix',
			groups: [
				{
					entries: [
						{
							title: "L'IA ne détruira pas QUE votre emploi (Pause IA)",
							desc: 'Perte de contrôle croissante sur nos vies et nos sociétés. Témoigner, participer à enquête, envoyer un mail à vos représentants.',
							url: 'https://pauseia.fr/fr/emploi-ia',
							langs: ['fr']
						},
						{
							title: 'Rejoindre Pause Action (Pause IA)',
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
</script>

<PostMeta {title} {description} />

<div class="liens-page">
	<main class="res-container">
		<header class="res-hero">
			<h1>Ressources, références et <span class="brand">liens utiles</span></h1>
			<p class="subtitle">Une base de connaissances sur l'IA et ses risques existentiels.</p>
		</header>

		{#each sections as section}
			<section class="res-section">
				<div class="res-section-header">
					<h2>
						{#if section.logo}
							<img class="section-logo" src={section.logo} alt="" />
						{:else if section.emoji}
							<span class="section-emoji">{section.emoji}</span>
						{/if}
						{section.title}
					</h2>
					{#if section.intro}<p class="section-intro">{section.intro}</p>{/if}
				</div>
				<div class="res-section-body">
					{#each section.groups as group}
						<div class={group.subgroup ? 'res-subgroup' : 'res-group'}>
							{#if group.subtitle}
								<h3 class="res-subtitle">{group.subtitle}</h3>
							{/if}
							<ul class="res-list">
								{#each group.entries as entry}
									<li class="res-entry">
										<div class="res-flags">
											{#each entry.langs as l}
												<img class="res-flag" src={flagSrc(l)} alt={flagAlt(l)} />
											{/each}
										</div>
										<div class="res-content">
											<a
												class="res-title"
												href={entry.url}
												target="_blank"
												rel="noopener noreferrer"
											>
												{entry.title}
											</a><span class="res-desc">{entry.desc}</span>{#if entry.date}<span
													class="res-date">{entry.date}</span
												>{/if}
										</div>
									</li>
								{/each}
							</ul>
						</div>
					{/each}
				</div>
			</section>
		{/each}
	</main>
</div>

<style>
	.liens-page {
		background: var(--bg);
		color: var(--text);
		padding: 3rem 0 5rem;
		min-height: 60vh;
	}

	.res-container {
		max-width: 48rem;
		margin: 0 auto;
		padding: 0 1.25rem;
	}

	/* ─── Hero ─────────────────────────────────────────────── */
	.res-hero {
		text-align: center;
		margin-bottom: 3rem;
		padding-bottom: 0;
	}

	.res-hero h1 {
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: clamp(2rem, 4vw, 2.75rem);
		line-height: 1.15;
		margin: 0 0 1rem;
		color: var(--text);
		letter-spacing: -0.015em;
	}

	.brand {
		color: var(--brand);
	}

	.res-hero .subtitle {
		font-family: var(--font-body);
		font-size: 1.15rem;
		line-height: 1.55;
		color: var(--text-secondary);
		margin: 0 auto;
		max-width: 36rem;
	}

	/* ─── Section card ─────────────────────────────────────── */
	.res-section {
		margin-top: 2rem;
		border: 1px solid var(--border);
		border-radius: 0.75rem;
		overflow: hidden;
		background: var(--bg-card, #fafafa);
		transition:
			border-color 0.2s ease,
			box-shadow 0.2s ease;
	}

	.res-section:hover {
		border-color: rgba(255, 148, 22, 0.4);
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
	}

	:global([data-theme='dark']) .res-section {
		background: rgba(255, 255, 255, 0.02);
		border-color: var(--border);
	}

	:global([data-theme='dark']) .res-section:hover {
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
	}

	.res-section-header {
		padding: 1.25rem 1.5rem 0.85rem;
		border-bottom: 1px solid var(--border);
		background: transparent;
	}

	.res-section-header h2 {
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 1.15rem;
		color: var(--text);
		margin: 0;
		display: flex;
		align-items: center;
		gap: 0.65rem;
		letter-spacing: -0.005em;
	}

	.section-emoji {
		font-size: 1.35rem;
		line-height: 1;
	}

	.section-logo {
		width: 1.6rem;
		height: 1.6rem;
		object-fit: contain;
		flex-shrink: 0;
	}

	.section-intro {
		font-family: var(--font-body);
		font-size: 0.9rem;
		line-height: 1.5;
		color: var(--text-secondary);
		margin: 0.4rem 0 0;
	}

	.res-section-body {
		padding: 0.5rem 1.5rem 1.25rem;
	}

	/* ─── Subtitles & subgroups ─────────────────────────────── */
	.res-subtitle {
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 0.78rem;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--text-secondary);
		margin: 1.5rem 0 0.5rem;
	}

	.res-group:first-child > .res-subtitle:first-child,
	.res-subgroup:first-child > .res-subtitle:first-child {
		margin-top: 0.75rem;
	}

	.res-subgroup {
		background: var(--brand-light, rgba(255, 148, 22, 0.06));
		padding: 0.85rem 1.25rem;
		margin: 1.25rem -1.5rem;
		border-top: 1px solid rgba(255, 148, 22, 0.18);
		border-bottom: 1px solid rgba(255, 148, 22, 0.18);
	}

	:global([data-theme='dark']) .res-subgroup {
		background: rgba(255, 148, 22, 0.06);
	}

	.res-subgroup > .res-subtitle {
		margin-top: 0;
		color: var(--brand-subtle, var(--brand));
	}

	:global([data-theme='dark']) .res-subgroup > .res-subtitle {
		color: var(--brand);
	}

	/* ─── Entries ──────────────────────────────────────────── */
	.res-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.res-entry {
		display: flex;
		gap: 0.85rem;
		padding: 0.8rem 0;
		border-bottom: 1px solid var(--border);
	}

	.res-entry:last-child {
		border-bottom: none;
		padding-bottom: 0.25rem;
	}

	.res-flags {
		display: flex;
		gap: 0.25rem;
		flex-shrink: 0;
		padding-top: 0.3rem;
	}

	.res-flag {
		width: 1.25rem;
		height: auto;
		display: block;
		border-radius: 2px;
		box-shadow: 0 0 0 1px var(--border);
	}

	.res-content {
		flex: 1;
		min-width: 0;
		line-height: 1.5;
	}

	.res-title {
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 1rem;
		color: var(--brand-subtle, var(--brand));
		text-decoration: none;
		transition: color 0.15s;
	}

	:global([data-theme='dark']) .res-title {
		color: var(--brand);
	}

	.res-title:hover {
		text-decoration: underline;
		text-decoration-thickness: 1.5px;
		text-underline-offset: 3px;
	}

	.res-desc {
		font-family: var(--font-body);
		font-weight: 400;
		font-size: 0.95rem;
		color: var(--text);
		margin-left: 0.2rem;
	}

	.res-desc::before {
		content: ' — ';
		color: var(--text-secondary);
		font-weight: 300;
	}

	.res-date {
		font-style: italic;
		color: var(--text-secondary);
		font-size: 0.85rem;
		margin-left: 0.35rem;
		white-space: nowrap;
	}

	@media (max-width: 640px) {
		.res-section-header {
			padding: 0.85rem 1rem;
		}
		.res-section-body {
			padding: 0.85rem 1.1rem;
		}
		.res-subgroup {
			margin: 1rem -1.1rem;
			padding: 0.85rem 1.1rem;
		}
	}
</style>
