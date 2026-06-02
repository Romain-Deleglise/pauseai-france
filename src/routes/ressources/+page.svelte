<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import {
		Brain,
		AlertTriangle,
		FileText,
		Megaphone,
		BookMarked,
		BookOpen,
		Mail,
		MoveUpRight,
		Search,
		X,
		Map as MapIcon,
		Github
	} from 'lucide-svelte'
	import type { ComponentType } from 'svelte'
	import {
		resources,
		SUBGROUPS,
		CATEGORY_ORDER,
		RESOURCES_LAST_UPDATED,
		type Category,
		type Lang,
		type Resource
	} from '$lib/data/resources'

	const title = 'Ressources - Pause IA'
	const description =
		"Ressources, références et liens utiles : une base de connaissances sur l'IA, ses risques existentiels et le problème de l'alignement."

	type CategoryMeta = { label: string; icon: ComponentType; intro?: string }
	const CATEGORIES: Record<Category, CategoryMeta> = {
		'pause-ia': { label: 'Ressources Pause IA', icon: BookMarked },
		livres: { label: 'Livres', icon: BookOpen },
		comprendre: { label: "Mieux comprendre l'IA", icon: Brain },
		risques: {
			label: 'Risques existentiels',
			icon: AlertTriangle,
			intro: "Perte de contrôle, menaces d'extinction et recherche en alignement."
		},
		declarations: { label: "Déclarations et appel à l'action", icon: FileText },
		newsletters: { label: "Suivre l'actualité", icon: Mail },
		agir: { label: 'Faire entendre votre voix', icon: Megaphone }
	}

	// Subgroup ordering inside each category
	const SUBGROUP_ORDER: Record<string, string[]> = {
		livres: ['essentiels', 'recommandes'],
		comprendre: ['demarrer', 'vue-ensemble', 'aller-plus-loin'],
		risques: ['general', 'recherche-alignement']
	}

	let query = ''
	let langFilter: Lang | 'all' = 'all'
	let categoryFilter: Category | 'all' = 'all'

	function matches(r: Resource): boolean {
		if (langFilter !== 'all' && !r.langs.includes(langFilter)) return false
		if (categoryFilter !== 'all' && r.category !== categoryFilter) return false
		if (query.trim()) {
			const q = query.toLowerCase()
			if (!r.title.toLowerCase().includes(q) && !r.description.toLowerCase().includes(q))
				return false
		}
		return true
	}

	$: filtered = resources.filter(matches)

	$: byCategory = (() => {
		const m: Record<string, Resource[]> = {}
		for (const r of filtered) {
			if (!m[r.category]) m[r.category] = []
			m[r.category].push(r)
		}
		return m
	})()

	function groupBySubgroup(list: Resource[], category: string) {
		const m: Record<string, Resource[]> = {}
		for (const r of list) {
			const key = r.subgroup ?? '__no_subgroup__'
			if (!m[key]) m[key] = []
			m[key].push(r)
		}
		const order = SUBGROUP_ORDER[category] ?? []
		const keys = Object.keys(m).sort((a, b) => {
			if (a === '__no_subgroup__') return -1
			if (b === '__no_subgroup__') return 1
			return order.indexOf(a) - order.indexOf(b) || a.localeCompare(b)
		})
		return keys.map((k) => ({ key: k, label: SUBGROUPS[k] ?? '', items: m[k] }))
	}

	function flagSrc(l: Lang) {
		return l === 'fr' ? '/flags/fr.svg' : '/flags/gb.svg'
	}
	function flagAlt(l: Lang) {
		return l === 'fr' ? 'FR' : 'EN'
	}

	function clearFilters() {
		query = ''
		langFilter = 'all'
		categoryFilter = 'all'
	}

	const totalCount = resources.length
	$: visibleCount = filtered.length
	$: hasActiveFilter = query.trim() !== '' || langFilter !== 'all' || categoryFilter !== 'all'

	// GitHub issue template URL
	const SUGGEST_URL =
		'https://github.com/Romain-Deleglise/pauseai-france/issues/new?title=Suggestion+de+ressource&body=%23%23+Ressource+%C3%A0+ajouter%0A%0A-+**Titre**+%3A+%0A-+**URL**+%3A+%0A-+**Langue**+%3A+FR+%2F+EN%0A-+**Cat%C3%A9gorie**+%3A+(pause-ia+%2F+livres+%2F+comprendre+%2F+risques+%2F+declarations+%2F+newsletters+%2F+agir)%0A-+**Description+courte**+%3A+%0A%0A%23%23+Pourquoi+cette+ressource+est-elle+utile+%3F%0A%0A'
</script>

<PostMeta {title} {description} />

<article class="ressources-page">
	<!-- Hero -->
	<section class="hero">
		<UnderlinedTitle as="h1">Ressources</UnderlinedTitle>
		<p class="hero-description">
			Une base de connaissances curée sur l'IA, ses risques existentiels et le problème de
			l'alignement.
		</p>

		<a href="/carte" class="map-link">
			<MapIcon size={16} />
			<span>Voir l'écosystème en vue cartographique</span>
		</a>
	</section>

	<!-- Controls -->
	<section class="controls" aria-label="Filtres">
		<div class="search">
			<Search size={16} class="search-icon" />
			<input
				type="search"
				placeholder="Rechercher une ressource…"
				bind:value={query}
				aria-label="Rechercher"
			/>
			{#if query}
				<button class="clear-btn" on:click={() => (query = '')} aria-label="Effacer la recherche">
					<X size={14} />
				</button>
			{/if}
		</div>

		<div class="filter-row">
			<div class="filter-group" role="radiogroup" aria-label="Langue">
				<button
					class="pill"
					class:active={langFilter === 'all'}
					on:click={() => (langFilter = 'all')}
					role="radio"
					aria-checked={langFilter === 'all'}
				>
					Toutes
				</button>
				<button
					class="pill"
					class:active={langFilter === 'fr'}
					on:click={() => (langFilter = 'fr')}
					role="radio"
					aria-checked={langFilter === 'fr'}
				>
					<img src="/flags/fr.svg" alt="" width="16" /> FR
				</button>
				<button
					class="pill"
					class:active={langFilter === 'en'}
					on:click={() => (langFilter = 'en')}
					role="radio"
					aria-checked={langFilter === 'en'}
				>
					<img src="/flags/gb.svg" alt="" width="16" /> EN
				</button>
			</div>

			<div class="filter-group" role="radiogroup" aria-label="Catégorie">
				<button
					class="pill"
					class:active={categoryFilter === 'all'}
					on:click={() => (categoryFilter = 'all')}
					role="radio"
					aria-checked={categoryFilter === 'all'}
				>
					Toutes catégories
				</button>
				{#each CATEGORY_ORDER as cat}
					<button
						class="pill"
						class:active={categoryFilter === cat}
						on:click={() => (categoryFilter = cat)}
						role="radio"
						aria-checked={categoryFilter === cat}
					>
						<svelte:component this={CATEGORIES[cat].icon} size={14} />
						<span>{CATEGORIES[cat].label}</span>
					</button>
				{/each}
			</div>
		</div>

		<div class="meta-row">
			<p class="count">
				<strong>{visibleCount}</strong>
				{visibleCount === 1 ? 'ressource' : 'ressources'}
				{#if hasActiveFilter}
					<span class="count-total">sur {totalCount}</span>
					<button class="reset-btn" on:click={clearFilters}>Réinitialiser</button>
				{/if}
			</p>
			<p class="updated">Mise à jour : {RESOURCES_LAST_UPDATED}</p>
		</div>
	</section>

	<!-- Sections -->
	{#if visibleCount === 0}
		<p class="empty">Aucune ressource ne correspond à votre recherche.</p>
	{/if}

	{#each CATEGORY_ORDER as cat}
		{@const items = byCategory[cat] ?? []}
		{#if items.length > 0}
			<section id={cat} class="res-section">
				<header class="res-section-header">
					<div class="section-icon" aria-hidden="true">
						<svelte:component this={CATEGORIES[cat].icon} size="1.2em" />
					</div>
					<div>
						<h2>{CATEGORIES[cat].label}</h2>
						{#if CATEGORIES[cat].intro}
							<p class="section-intro">{CATEGORIES[cat].intro}</p>
						{/if}
					</div>
				</header>

				{#each groupBySubgroup(items, cat) as group}
					<div class="res-group">
						{#if group.label}
							<h3 class="res-subtitle">{group.label}</h3>
						{/if}
						<ul class="res-list">
							{#each group.items as entry}
								<li class="res-entry">
									<a
										class="res-card"
										href={entry.url}
										target={entry.internal ? undefined : '_blank'}
										rel={entry.internal ? undefined : 'noopener noreferrer'}
									>
										<div class="res-card-main">
											<div class="res-card-header">
												<h4 class="res-title">{entry.title}</h4>
												<MoveUpRight class="res-arrow" size={16} aria-hidden="true" />
											</div>
											<p class="res-desc">{entry.description}</p>
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
		{/if}
	{/each}

	<!-- Bottom CTA -->
	<section class="cta-card">
		<h3>Une ressource à suggérer&nbsp;?</h3>
		<p>
			Vous connaissez une référence francophone ou internationale qui devrait figurer ici&nbsp;?
			Ouvrez une issue sur le dépôt GitHub avec le template pré-rempli.
		</p>
		<a class="cta-btn" href={SUGGEST_URL} target="_blank" rel="noopener noreferrer">
			<Github size={16} />
			<span>Suggérer une ressource</span>
		</a>
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
		margin-bottom: 2rem;
		background: var(--bg);
		padding: 2rem 1.5rem 1.75rem;
		border-radius: 12px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.08);
	}

	.hero-description {
		font-size: 1.05rem;
		line-height: 1.55;
		color: var(--text-secondary);
		max-width: 38rem;
		margin: 0 auto 1.25rem;
	}

	.map-link {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.5rem 1rem;
		border-radius: 999px;
		border: 1px solid var(--brand);
		color: var(--brand-subtle, var(--brand));
		text-decoration: none;
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 0.9rem;
		transition:
			background 0.18s,
			color 0.18s,
			transform 0.18s;
	}

	.map-link:hover {
		background: var(--brand);
		color: white;
		transform: translateY(-1px);
	}

	:global([data-theme='dark']) .map-link {
		color: var(--brand);
	}

	:global([data-theme='dark']) .map-link:hover {
		color: white;
	}

	/* ─── Controls ─────────────────────────────────────────── */
	.controls {
		margin-bottom: 2rem;
	}

	.search {
		position: relative;
		margin-bottom: 0.85rem;
	}

	.search :global(.search-icon) {
		position: absolute;
		left: 0.85rem;
		top: 50%;
		transform: translateY(-50%);
		color: var(--text-secondary);
		pointer-events: none;
	}

	.search input {
		width: 100%;
		padding: 0.7rem 2.25rem 0.7rem 2.4rem;
		font-family: var(--font-body);
		font-size: 1rem;
		border: 1px solid var(--border);
		border-radius: 10px;
		background: var(--bg);
		color: var(--text);
		transition:
			border-color 0.18s,
			box-shadow 0.18s;
	}

	.search input:focus {
		outline: none;
		border-color: var(--brand);
		box-shadow: 0 0 0 3px rgba(255, 148, 22, 0.15);
	}

	.clear-btn {
		position: absolute;
		right: 0.6rem;
		top: 50%;
		transform: translateY(-50%);
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 1.6rem;
		height: 1.6rem;
		border-radius: 50%;
		border: none;
		background: rgba(0, 0, 0, 0.06);
		color: var(--text-secondary);
		cursor: pointer;
	}

	.clear-btn:hover {
		background: rgba(0, 0, 0, 0.12);
		color: var(--text);
	}

	:global([data-theme='dark']) .clear-btn {
		background: rgba(255, 255, 255, 0.08);
	}

	.filter-row {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 0.75rem;
	}

	.filter-group {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.pill {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		padding: 0.4rem 0.75rem;
		border-radius: 999px;
		border: 1px solid var(--border);
		background: var(--bg);
		color: var(--text-secondary);
		font-family: var(--font-heading);
		font-weight: 600;
		font-size: 0.8rem;
		cursor: pointer;
		transition: all 0.15s;
	}

	.pill:hover {
		border-color: var(--brand);
		color: var(--brand-subtle, var(--brand));
	}

	.pill.active {
		background: var(--brand);
		border-color: var(--brand);
		color: white;
	}

	.pill img {
		display: block;
		border-radius: 2px;
	}

	:global([data-theme='dark']) .pill:hover {
		color: var(--brand);
	}

	.meta-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
		font-size: 0.85rem;
		color: var(--text-secondary);
	}

	.count {
		margin: 0;
	}

	.count strong {
		color: var(--text);
	}

	.count-total {
		margin-left: 0.3rem;
		opacity: 0.7;
	}

	.reset-btn {
		margin-left: 0.5rem;
		padding: 0.2rem 0.55rem;
		font-size: 0.78rem;
		font-family: var(--font-heading);
		font-weight: 600;
		background: transparent;
		border: 1px solid var(--border);
		border-radius: 999px;
		color: var(--text-secondary);
		cursor: pointer;
		transition: all 0.15s;
	}

	.reset-btn:hover {
		border-color: var(--brand);
		color: var(--brand-subtle, var(--brand));
	}

	.updated {
		margin: 0;
		font-style: italic;
	}

	.empty {
		text-align: center;
		padding: 3rem 1rem;
		color: var(--text-secondary);
	}

	/* ─── Sections ──────────────────────────────────────────── */
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

	.res-group {
		margin-top: 1.5rem;
	}

	.res-group:first-of-type {
		margin-top: 0;
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

	/* ─── CTA ──────────────────────────────────────────────── */
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
		margin: 0 0 1.25rem;
		line-height: 1.55;
	}

	.cta-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		padding: 0.6rem 1.15rem;
		border-radius: 8px;
		background: var(--brand);
		color: white;
		text-decoration: none;
		font-family: var(--font-heading);
		font-weight: 700;
		font-size: 0.95rem;
		transition:
			opacity 0.18s,
			transform 0.18s;
	}

	.cta-btn:hover {
		opacity: 0.9;
		transform: translateY(-1px);
	}

	/* ─── Responsive ───────────────────────────────────────── */
	@media (max-width: 640px) {
		.hero {
			padding: 1.5rem 1rem 1.5rem;
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
	}
</style>
