<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import Button from '$components/Button.svelte'
	import LocalGroupsMap from '$components/LocalGroupsMap.svelte'
	import {
		MessageSquare,
		PlusCircle,
		MapPin,
		Megaphone,
		Newspaper,
		Users,
		CalendarDays,
		Mic,
		Lightbulb,
		Radio,
		Landmark,
		FileText,
		Clock,
		ChevronLeft,
		ChevronRight
	} from 'lucide-svelte'
	import type { ComponentType } from 'svelte'
	import { localGroups, activeGroupsCount, formingGroupsCount } from '$lib/data/local-groups'
	import { onMount } from 'svelte'
	import type { PageData } from './$types'

	export let data: PageData

	$: lang = data.lang
	$: isEn = lang === 'en'
	$: prefix = isEn ? '/en' : '/fr'

	// Villes triées : groupes actifs d'abord, puis ceux en création.
	$: sortedGroups = [...localGroups].sort(
		(a, b) => Number(!!a.forming) - Number(!!b.forming) || a.name.localeCompare(b.name)
	)

	// ── Agenda des actions (depuis Notion, via /api/events, non prérendu) ──
	interface LocalEvent {
		id: string
		title: string
		date: string
		city: string
		type: string
		url: string
		time: string
		place: string
		description: string
		images: string[]
		featured: boolean
		volunteers: number
	}

	// Compression à la volée via le CDN d'images de Netlify : on demande l'image
	// redimensionnée et recompressée (au lieu de la photo Notion brute, souvent
	// lourde). En local (URL relative) ou si le CDN échoue, on retombe sur l'URL
	// d'origine via `on:error` → aucune régression.
	function cdnImg(url: string, w: number, fit?: 'cover'): string {
		if (!url || !/^https?:\/\//.test(url)) return url
		return `/.netlify/images?url=${encodeURIComponent(url)}&w=${w}&q=72${fit ? `&fit=${fit}` : ''}`
	}
	function cdnFallback(e: Event) {
		const img = e.currentTarget as HTMLImageElement
		if (img.dataset.raw && img.src !== img.dataset.raw) img.src = img.dataset.raw
	}

	// Carrousel des photos pour les actions « à la une » (index par action).
	let galleryIdx: Record<string, number> = {}
	function galStep(id: string, len: number, dir: number) {
		const cur = galleryIdx[id] ?? 0
		galleryIdx = { ...galleryIdx, [id]: (cur + dir + len) % len }
	}

	// Icône selon le type d'action, pour un repérage visuel rapide.
	function typeIcon(t: string): ComponentType {
		const k = (t || '').toLowerCase()
		if (k.includes('manif')) return Megaphone
		if (k.includes('tract')) return FileText
		if (k.includes('conf')) return Mic
		if (k.includes('atelier') || k.includes('fresque')) return Lightbulb
		if (k.includes('média') || k.includes('media') || k.includes('radio') || k.includes('presse'))
			return Radio
		if (k.includes('plaidoyer') || k.includes('élu') || k.includes('elu')) return Landmark
		return CalendarDays
	}
	let events: LocalEvent[] = []
	onMount(async () => {
		try {
			const res = await fetch('/api/events')
			if (res.ok) events = await res.json()
		} catch {
			/* agenda indisponible : la page reste fonctionnelle */
		}
	})

	const startOfToday = new Date()
	startOfToday.setHours(0, 0, 0, 0)
	$: upcoming = events.filter((e) => new Date(e.date) >= startOfToday)
	// Actions passées : les plus récentes d'abord (tri explicite pour une frise
	// toujours chronologique, indépendamment de l'ordre de la source).
	$: pastAll = events
		.filter((e) => new Date(e.date) < startOfToday)
		.slice()
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
	// Total de bénévoles mobilisés (sur les actions qui renseignent ce nombre).
	$: totalVolunteers = pastAll.reduce((sum, e) => sum + (e.volunteers || 0), 0)
	// Frise chronologique unifiée : toutes les actions sur un même rail, les
	// actions « à la une » formant de plus grands nœuds. On affiche d'abord les
	// plus récentes, puis un bouton déroule le reste.
	const PAST_PREVIEW = 8
	let showAllPast = false
	$: pastShown = showAllPast ? pastAll : pastAll.slice(0, PAST_PREVIEW)

	function fmtDate(d: string): string {
		const dt = new Date(d)
		if (Number.isNaN(dt.getTime())) return d
		return dt.toLocaleDateString(isEn ? 'en-GB' : 'fr-FR', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		})
	}

	function eventMeta(e: LocalEvent): string {
		return [e.city, e.type].filter(Boolean).join(' · ')
	}

	$: title = isEn ? 'Local groups | Pause AI' : 'Groupes locaux | Pause IA'
	$: description = isEn
		? 'Find a local Pause AI group near you or create one to take concrete action for a pause on artificial intelligence.'
		: "Trouvez un groupe local Pause IA près de chez vous ou créez-en un pour agir concrètement en faveur d'une pause sur l'intelligence artificielle."
</script>

<PostMeta {title} {description} />

<article>
	<section class="hero">
		<UnderlinedTitle as="h1">{isEn ? 'Local groups' : 'Groupes locaux'}</UnderlinedTitle>
		<p class="hero-description">
			{#if isEn}
				Local action is essential for raising public awareness, engaging elected officials and
				building a strong citizen movement. Join a team near you or start the momentum in your city.
			{:else}
				L'action locale est essentielle pour sensibiliser le public, interpeller les élus et
				construire un mouvement citoyen fort. Rejoignez une équipe près de chez vous ou lancez la
				dynamique dans votre ville.
			{/if}
		</p>
	</section>

	<section class="impact-section">
		<div class="impact-card">
			<Megaphone size="1.6rem" />
			<h3>{isEn ? 'Demonstrations & gatherings' : 'Manifestations & rassemblements'}</h3>
			<p>
				{isEn
					? 'Carry the message into the street, in several cities at once, to make the risks of AI visible.'
					: "Porter le message dans la rue, dans plusieurs villes à la fois, pour rendre visibles les risques de l'IA."}
			</p>
		</div>
		<div class="impact-card">
			<Users size="1.6rem" />
			<h3>{isEn ? 'Leafleting & outreach' : 'Tractage & sensibilisation'}</h3>
			<p>
				{isEn
					? 'Meet the public, hand out leaflets and start conversations to grow awareness on the ground.'
					: 'Aller à la rencontre du public, distribuer des tracts et engager la discussion pour sensibiliser sur le terrain.'}
			</p>
		</div>
		<div class="impact-card">
			<Newspaper size="1.6rem" />
			<h3>{isEn ? 'Press coverage' : 'Retombées presse'}</h3>
			<p>
				{#if isEn}
					These actions draw local media and give the movement real visibility. <a
						href="{prefix}/presse">See the press coverage</a
					>.
				{:else}
					Ces actions attirent les médias locaux et donnent de la visibilité au mouvement. <a
						href="{prefix}/presse">Voir la revue de presse</a
					>.
				{/if}
			</p>
		</div>
	</section>

	{#if upcoming.length}
		<section class="agenda-section">
			<div class="section-title-row">
				<CalendarDays size="1.2em" class="section-icon" />
				<h2>{isEn ? 'Upcoming actions' : 'Prochaines actions'}</h2>
			</div>
			<ul class="event-list">
				{#each upcoming as e (e.id)}
					<li class="event-card">
						<div class="event-date">
							{fmtDate(e.date)}{#if e.time}<span class="event-time">
									<Clock size="0.85em" />{e.time}</span
								>{/if}
						</div>
						<div class="event-body">
							<strong>{e.title}</strong>
							{#if eventMeta(e) || e.place}
								<small>
									<svelte:component this={typeIcon(e.type)} size="0.9em" />
									{[e.city, e.type, e.place].filter(Boolean).join(' · ')}
								</small>
							{/if}
							{#if e.description}<p>{e.description}</p>{/if}
						</div>
						{#if e.url}
							<a
								class="event-cta"
								href={e.url}
								target="_blank"
								rel="noopener noreferrer"
								aria-label={`${isEn ? 'Take part' : 'Participer'} : ${e.title}`}
							>
								{isEn ? 'Take part' : 'Participer'}
							</a>
						{/if}
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	<section class="cta-section">
		<div class="cta-card join">
			<span class="cta-icon"><MessageSquare size="1.6rem" /></span>
			<h2>{isEn ? 'Join a group' : 'Rejoindre un groupe'}</h2>
			<p>
				{#if isEn}
					Fill in the registration form to contribute concretely to Pause AI's local action by
					participating in collective awareness and citizen mobilization actions, and by nurturing
					an engaged community around the challenges linked to artificial intelligence.
				{:else}
					Remplissez le formulaire d'inscription pour contribuer concrètement à l'action de Pause IA
					au niveau local, en participant à des actions collectives de sensibilisation et de
					mobilisation citoyenne, et en faisant vivre une communauté engagée autour des enjeux liés
					à l'intelligence artificielle.
				{/if}
			</p>
			<Button href="https://pauseia.notion.site/2e128fc94b7780fd94b6d35c35b2f0ac">
				{isEn ? 'Sign up' : "S'inscrire"}
			</Button>
		</div>

		<div class="cta-card create">
			<span class="cta-icon"><PlusCircle size="1.6rem" /></span>
			<h2>{isEn ? 'Start a group' : 'Lancer un groupe'}</h2>
			<p>
				{#if isEn}
					Help Pause AI grow locally by leading a community of engaged volunteers, coordinating
					awareness and mobilization actions, and ensuring the link between the field and the
					national team.
				{:else}
					Faites vivre et grandir Pause IA localement en animant une communauté de bénévoles
					engagés, en coordonnant des actions de sensibilisation et de mobilisation, et en assurant
					le lien entre le terrain et l'équipe nationale.
				{/if}
			</p>
			<Button alt href="https://pauseia.notion.site/2e128fc94b7780fd94b6d35c35b2f0ac">
				{isEn ? 'Create a group' : 'Créer un groupe'}
			</Button>
		</div>
	</section>

	<section class="map-section">
		<div class="map-header">
			<div class="map-title-row">
				<MapPin size="1.2em" class="map-pin-icon" />
				<h2>{isEn ? 'Our local groups' : 'Nos groupes locaux'}</h2>
			</div>
			<div class="map-meta">
				<span class="map-stat">
					{activeGroupsCount}
					{isEn
						? activeGroupsCount === 1
							? 'active group'
							: 'active groups'
						: activeGroupsCount === 1
							? 'groupe actif'
							: 'groupes actifs'}
				</span>
				{#if formingGroupsCount > 0}
					<span class="map-sep">·</span>
					<span class="map-stat forming">
						{formingGroupsCount}
						{isEn ? 'forming' : 'en cours de création'}
					</span>
				{/if}
				<span class="map-sep">·</span>
				<span class="map-hint"
					>{isEn
						? 'hover a marker to see the city'
						: 'survolez un marqueur pour voir la ville'}</span
				>
			</div>
		</div>
		<LocalGroupsMap />

		<ul class="city-list" aria-label={isEn ? 'Cities with a group' : 'Villes avec un groupe'}>
			{#each sortedGroups as group}
				<li class="city-chip" class:forming={group.forming}>
					{group.name}
					{#if group.forming}<span class="city-tag">{isEn ? 'forming' : 'en création'}</span>{/if}
				</li>
			{/each}
		</ul>
	</section>

	{#if pastAll.length}
		<section class="past-section">
			<div class="stats-band">
				<div class="stat">
					<span class="stat-num">{activeGroupsCount}</span>
					<span class="stat-label">{isEn ? 'active groups' : 'groupes actifs'}</span>
				</div>
				<div class="stat">
					<span class="stat-num">{pastAll.length}</span>
					<span class="stat-label">{isEn ? 'actions carried out' : 'actions menées'}</span>
				</div>
				{#if totalVolunteers > 0}
					<div class="stat">
						<span class="stat-num">{totalVolunteers}+</span>
						<span class="stat-label">{isEn ? 'volunteers mobilised' : 'bénévoles mobilisés'}</span>
					</div>
				{/if}
			</div>

			<div class="section-title-row">
				<Megaphone size="1.2em" class="section-icon" />
				<h2>{isEn ? 'Recent actions' : 'Actions passées'}</h2>
			</div>

			<!-- Frise chronologique : un rail unique, les actions « à la une » en grands nœuds -->
			<div class="timeline">
				{#each pastShown as e (e.id)}
					{@const gi = galleryIdx[e.id] ?? 0}
					<div class="tl-item" class:featured={e.featured}>
						<div class="tl-rail">
							<time class="tl-date" datetime={e.date}>{fmtDate(e.date)}</time>
							{#if e.city}<span class="tl-city">{e.city}</span>{/if}
						</div>
						<div class="tl-marker" aria-hidden="true">
							<span class="tl-dot">
								{#if e.featured}<svelte:component this={typeIcon(e.type)} size="0.85em" />{/if}
							</span>
						</div>
						<article class="tl-card">
							{#if e.featured && e.images.length}
								<div class="feature-main">
									<div
										class="feature-main-bg"
										style="background-image:url('{cdnImg(e.images[gi], 1100)}')"
									></div>
									<img
										src={cdnImg(e.images[gi], 1100)}
										data-raw={e.images[gi]}
										on:error={cdnFallback}
										alt=""
										loading="lazy"
										decoding="async"
									/>
									{#if e.images.length > 1}
										<button
											class="gallery-nav prev"
											on:click={() => galStep(e.id, e.images.length, -1)}
											aria-label={isEn ? 'Previous photo' : 'Photo précédente'}
										>
											<ChevronLeft size="1.2em" />
										</button>
										<button
											class="gallery-nav next"
											on:click={() => galStep(e.id, e.images.length, 1)}
											aria-label={isEn ? 'Next photo' : 'Photo suivante'}
										>
											<ChevronRight size="1.2em" />
										</button>
										<span class="gallery-counter">{gi + 1}/{e.images.length}</span>
									{/if}
								</div>
								{#if e.images.length > 1}
									<div class="feature-thumbs">
										{#each e.images.slice(0, 5) as src, idx}
											<button
												class="feature-thumb"
												class:active={idx === gi}
												on:click={() => (galleryIdx = { ...galleryIdx, [e.id]: idx })}
												aria-label={`Photo ${idx + 1}`}
											>
												<img
													src={cdnImg(src, 240, 'cover')}
													data-raw={src}
													on:error={cdnFallback}
													alt=""
													loading="lazy"
													decoding="async"
												/>
											</button>
										{/each}
									</div>
								{/if}
							{:else if !e.featured}
								<div class="tl-thumb">
									{#if e.images.length}
										<div
											class="tl-thumb-bg"
											style="background-image:url('{cdnImg(e.images[0], 320)}')"
										></div>
										<img
											class="tl-thumb-img"
											src={cdnImg(e.images[0], 320)}
											data-raw={e.images[0]}
											on:error={cdnFallback}
											alt=""
											loading="lazy"
											decoding="async"
										/>
									{:else}
										<span class="tl-thumb-icon" aria-hidden="true">
											<svelte:component this={typeIcon(e.type)} size="1.5rem" />
										</span>
									{/if}
								</div>
							{/if}
							<div class="tl-body">
								<span class="tl-meta">
									{#if e.type}
										<span class="tl-tag">
											<svelte:component this={typeIcon(e.type)} size="0.78em" />
											{e.type}
										</span>
									{/if}
									<span class="tl-when">{fmtDate(e.date)}{e.city ? ` · ${e.city}` : ''}</span>
								</span>
								<h3 class="tl-title">{e.title}</h3>
								{#if e.volunteers > 0}
									<span class="volunteers">
										<Users size="0.9em" />
										{e.volunteers}
										{isEn ? (e.volunteers > 1 ? 'volunteers' : 'volunteer') : 'bénévoles'}
									</span>
								{/if}
								{#if e.featured && e.description}<p class="tl-desc">{e.description}</p>{/if}
								{#if e.url}
									<a
										class="tl-link"
										href={e.url}
										target="_blank"
										rel="noopener noreferrer"
										aria-label={`${isEn ? 'Read more' : 'En savoir plus'} : ${e.title}`}
									>
										{isEn ? 'Read more ↗' : 'En savoir plus ↗'}
									</a>
								{/if}
							</div>
						</article>
					</div>
				{/each}
			</div>

			{#if pastAll.length > PAST_PREVIEW}
				<button class="show-all-btn" on:click={() => (showAllPast = !showAllPast)}>
					{#if showAllPast}
						{isEn ? 'Show less' : 'Voir moins'}
					{:else}
						{isEn
							? `See all actions (${pastAll.length})`
							: `Voir toutes les actions (${pastAll.length})`}
					{/if}
				</button>
			{/if}
		</section>
	{/if}
</article>

<style>
	article {
		max-inline-size: 62rem;
		margin-inline: auto;
		margin-top: 3rem;
		padding: 0 2rem;
	}

	/* ── Hero ─────────────────────────────────────────────────────────── */

	.hero {
		text-align: left;
		margin-bottom: 3rem;
	}

	.hero-description {
		font-size: 1.2rem;
		color: var(--text-muted);
		line-height: 1.65;
		max-inline-size: 48rem;
	}

	.stats-band {
		display: flex;
		flex-wrap: wrap;
		gap: 1.5rem 3.5rem;
		justify-content: center;
		padding: 1.5rem 1.75rem;
		margin-bottom: 2.5rem;
		border: 1px solid var(--border);
		border-radius: 16px;
		background: color-mix(in srgb, var(--brand) 7%, var(--bg));
	}

	.stat {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.stat-num {
		font-size: 2.1rem;
		font-weight: 800;
		line-height: 1;
		color: var(--brand);
	}

	.stat-label {
		font-size: 0.85rem;
		color: var(--text-secondary);
		margin-top: 0.3rem;
	}

	/* ── Impact (ce que font les groupes) ────────────────────────────── */

	.impact-section {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 1.25rem;
		margin-bottom: 3.5rem;
	}

	.impact-card {
		padding: 1.5rem 1.5rem 1.6rem;
		border: 1px solid var(--border);
		border-radius: 14px;
		background: var(--bg-card);
	}

	.impact-card :global(svg) {
		color: var(--brand);
	}

	.impact-card h3 {
		margin: 0.6rem 0 0.4rem;
		font-size: 1.1rem;
	}

	.impact-card p {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.55;
		color: var(--text-2);
	}

	.impact-card a {
		color: var(--brand-subtle);
		font-weight: 600;
	}

	/* ── Liste des villes ─────────────────────────────────────────────── */

	.city-list {
		list-style: none;
		padding: 0;
		margin: 1.25rem 0 0;
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.city-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.35rem 0.8rem;
		border-radius: 999px;
		border: 1px solid var(--border);
		background: var(--bg-card);
		font-size: 0.88rem;
		font-weight: 600;
	}

	.city-chip.forming {
		color: var(--text-secondary);
		font-weight: 500;
	}

	.city-tag {
		font-size: 0.7rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.03em;
		color: var(--text-secondary);
	}

	/* ── Sections titrées (agenda, actions passées) ──────────────────── */

	.section-title-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	.section-title-row h2 {
		margin: 0;
	}

	.section-title-row :global(.section-icon) {
		color: var(--brand);
		flex-shrink: 0;
	}

	/* ── Agenda (prochaines actions) ──────────────────────────────────── */

	.agenda-section {
		margin-bottom: 3.5rem;
	}

	.event-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.event-card {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
		padding: 1rem 1.25rem;
		border: 1px solid var(--border);
		border-left: 4px solid var(--brand);
		border-radius: 12px;
		background: var(--bg-card);
	}

	.event-date {
		font-weight: 700;
		color: var(--brand-subtle);
		font-size: 0.9rem;
		min-inline-size: 8rem;
	}

	.event-time {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		margin-left: 0.5rem;
		font-weight: 600;
		color: var(--text-secondary);
	}

	.event-body {
		flex: 1;
		min-inline-size: 12rem;
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.event-body small {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		font-size: 0.82rem;
		color: var(--text-secondary);
	}

	.event-body small :global(svg) {
		color: var(--brand);
		flex-shrink: 0;
	}

	.event-body p {
		margin: 0.25rem 0 0;
		font-size: 0.9rem;
		color: var(--text-2);
		line-height: 1.5;
	}

	.event-cta {
		padding: 0.45rem 1rem;
		border-radius: 8px;
		background: var(--brand);
		color: #1a1a1a;
		font-size: 0.88rem;
		font-weight: 600;
		text-decoration: none;
		white-space: nowrap;
	}

	.event-cta:hover {
		filter: brightness(0.95);
	}

	/* ── Actions passées ──────────────────────────────────────────────── */

	.past-section {
		margin-bottom: 5rem;
	}

	/* ── Frise chronologique ──────────────────────────────────────────── */
	.timeline {
		margin-top: 1.5rem;
	}

	/* Une entrée = date (rail gauche) · nœud · carte. Les actions « à la une »
	   portent la classe .featured (nœud plus gros, carte enrichie). */
	.tl-item {
		display: grid;
		grid-template-columns: 6.5rem 1.75rem minmax(0, 1fr);
		column-gap: 1rem;
		padding-bottom: 1.4rem;
		position: relative;
	}

	.tl-item:last-child {
		padding-bottom: 0;
	}

	.tl-rail {
		display: flex;
		flex-direction: column;
		gap: 0.1rem;
		text-align: right;
		padding-top: 0.15rem;
		transition: color 0.18s;
	}

	.tl-date {
		font-weight: 700;
		font-size: 0.9rem;
		line-height: 1.2;
	}

	.tl-city {
		font-size: 0.78rem;
		color: var(--text-secondary);
	}

	/* Colonne du nœud : un point sur une ligne verticale continue. */
	.tl-marker {
		position: relative;
		display: flex;
		justify-content: center;
	}

	.tl-marker::before {
		content: '';
		position: absolute;
		top: 0.55rem;
		bottom: -1.4rem;
		left: 50%;
		inline-size: 2px;
		transform: translateX(-50%);
		background: var(--border);
	}

	.tl-item:last-child .tl-marker::before {
		display: none;
	}

	.tl-dot {
		margin-top: 0.3rem;
		inline-size: 0.85rem;
		block-size: 0.85rem;
		border-radius: 50%;
		background: var(--border);
		box-shadow: 0 0 0 3px var(--bg-card);
		z-index: 1;
		transition:
			transform 0.18s,
			background 0.18s;
	}

	.tl-item.featured .tl-dot {
		inline-size: 1.7rem;
		block-size: 1.7rem;
		margin-top: 0.1rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		background: var(--brand);
		color: #1a1a1a;
	}

	/* Carte */
	.tl-card {
		border: 1px solid var(--border);
		border-radius: 14px;
		overflow: hidden;
		background: var(--bg-card);
		transition:
			transform 0.18s,
			box-shadow 0.18s,
			border-color 0.18s;
	}

	/* Carte compacte (action normale) : vignette carrée + texte côte à côte. */
	.tl-item:not(.featured) .tl-card {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr);
		align-items: center;
	}

	.tl-item.featured .tl-card {
		box-shadow: 0 2px 14px rgba(0, 0, 0, 0.05);
		padding: 0.6rem 0.6rem 0;
	}

	/* Survol = finition décorative uniquement (l'info reste toujours visible). */
	.tl-item:hover .tl-card {
		transform: translateX(4px);
		box-shadow: 0 6px 20px rgba(0, 0, 0, 0.09);
		border-color: var(--brand);
	}

	.tl-item:hover .tl-dot {
		transform: scale(1.25);
	}

	.tl-item:hover .tl-rail,
	.tl-item:hover .tl-date {
		color: var(--brand-subtle);
	}

	@media (hover: none) {
		.tl-item:hover .tl-card {
			transform: none;
		}
	}

	/* Vignette carrée de taille fixe : robuste quelle que soit la forme de la
	   photo (image entière sur fond flou), avec repli sur l'icône du type. */
	.tl-thumb {
		position: relative;
		inline-size: 7rem;
		block-size: 7rem;
		margin: 0.65rem;
		border-radius: 10px;
		overflow: hidden;
		background: var(--brand-light);
		flex-shrink: 0;
	}

	.tl-thumb-bg {
		position: absolute;
		inset: -8%;
		background-size: cover;
		background-position: center;
		filter: blur(14px) brightness(0.9);
	}

	.tl-thumb-img {
		position: relative;
		z-index: 1;
		inline-size: 100%;
		block-size: 100%;
		object-fit: contain;
		display: block;
	}

	.tl-thumb-icon {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--brand);
		opacity: 0.5;
	}

	.tl-body {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		padding: 0.85rem 1rem;
	}

	.tl-item.featured .tl-body {
		padding: 0.9rem 1.1rem 1.2rem;
	}

	.tl-meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--text-secondary);
	}

	.tl-tag {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		background: var(--brand);
		color: #1a1a1a;
		padding: 0.12rem 0.55rem;
		border-radius: 999px;
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	/* La date est déjà sur le rail à gauche : on la masque dans la carte sur
	   grand écran, et on la réaffiche sur mobile (rail replié). */
	.tl-when {
		display: none;
	}

	.tl-title {
		margin: 0;
		line-height: 1.25;
		font-size: 1.05rem;
	}

	.tl-item.featured .tl-title {
		font-size: clamp(1.2rem, 2.4vw, 1.55rem);
	}

	.tl-desc {
		margin: 0;
		line-height: 1.6;
		color: var(--text-2);
	}

	.tl-link {
		align-self: flex-start;
		margin-top: 0.15rem;
		font-size: 0.88rem;
		font-weight: 700;
		color: var(--brand-subtle);
		white-space: nowrap;
	}

	.tl-link:hover {
		text-decoration: underline;
	}

	@media (max-width: 640px) {
		.tl-item {
			grid-template-columns: 1fr;
			padding-bottom: 1.5rem;
		}

		.tl-rail,
		.tl-marker {
			display: none;
		}

		.tl-when {
			display: inline;
		}

		.tl-card {
			border-left: 3px solid var(--brand);
		}

		.tl-thumb {
			inline-size: 5.5rem;
			block-size: 5.5rem;
		}
	}

	/* Carrousel d'une action « à la une » dans la frise : hauteur fixe. */
	.tl-item.featured .feature-main {
		block-size: 18rem;
	}

	.tl-item.featured .feature-thumbs {
		margin-top: 0.5rem;
		margin-bottom: 0.6rem;
	}

	@media (max-width: 640px) {
		.tl-item.featured .feature-main {
			block-size: 13rem;
		}
	}

	/* Photo principale adaptative : l'image est montrée en entier (contain),
	   quelle que soit sa forme, sur un fond flou de la même image. */
	.feature-main {
		position: relative;
		flex: 1;
		inline-size: 100%;
		min-block-size: 0;
		overflow: hidden;
		border-radius: 12px;
	}

	.feature-main-bg {
		position: absolute;
		inset: -8%;
		background-size: cover;
		background-position: center;
		filter: blur(22px) brightness(0.9);
	}

	.feature-main img {
		position: relative;
		z-index: 1;
		inline-size: 100%;
		block-size: 100%;
		object-fit: contain;
	}

	/* Flèches de navigation du carrousel */
	.gallery-nav {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		z-index: 2;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		inline-size: 2.1rem;
		block-size: 2.1rem;
		border: none;
		border-radius: 50%;
		background: rgba(0, 0, 0, 0.45);
		color: #fff;
		cursor: pointer;
		transition: background 0.15s;
	}

	.gallery-nav:hover {
		background: rgba(0, 0, 0, 0.7);
	}

	.gallery-nav.prev {
		left: 0.5rem;
	}

	.gallery-nav.next {
		right: 0.5rem;
	}

	.gallery-counter {
		position: absolute;
		z-index: 2;
		bottom: 0.5rem;
		right: 0.5rem;
		padding: 0.08rem 0.5rem;
		border-radius: 999px;
		background: rgba(0, 0, 0, 0.55);
		color: #fff;
		font-size: 0.72rem;
		font-weight: 600;
	}

	.feature-thumbs {
		display: flex;
		gap: 0.5rem;
		block-size: 5rem;
		flex-shrink: 0;
	}

	.feature-thumb {
		flex: 1;
		inline-size: 0;
		block-size: 100%;
		padding: 0;
		border: 2px solid transparent;
		border-radius: 9px;
		overflow: hidden;
		background: none;
		cursor: pointer;
	}

	.feature-thumb.active {
		border-color: var(--brand);
	}

	.feature-thumb img {
		inline-size: 100%;
		block-size: 100%;
		object-fit: cover;
		display: block;
	}

	.volunteers {
		align-self: flex-start;
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		font-size: 0.82rem;
		font-weight: 600;
		color: var(--brand-subtle);
		background: var(--brand-light);
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
	}

	.show-all-btn {
		display: block;
		margin: 1.25rem auto 0;
		padding: 0.55rem 1.4rem;
		border: 1px solid var(--brand);
		border-radius: 999px;
		background: transparent;
		color: var(--brand-subtle);
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
	}

	.show-all-btn:hover {
		background: var(--brand-light);
	}

	/* ── CTA cards ────────────────────────────────────────────────────── */

	.cta-section {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1.5rem;
		margin-bottom: 4rem;
	}

	.cta-card {
		padding: 2.25rem 2rem;
		border-radius: 20px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		transition: transform 0.2s;
	}

	.cta-card:hover {
		transform: translateY(-4px);
	}

	.cta-card.join {
		background: var(--bg-subtle, color-mix(in srgb, var(--brand) 7%, var(--bg)));
		border: 2px solid var(--brand);
	}

	.cta-card.create {
		background: var(--brand);
		color: white;
	}

	.cta-icon {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		inline-size: 3.2rem;
		block-size: 3.2rem;
		border-radius: 50%;
		background: color-mix(in srgb, var(--brand) 18%, transparent);
		color: var(--brand);
	}

	.cta-card.create .cta-icon {
		background: rgba(255, 255, 255, 0.22);
		color: white;
	}

	.cta-card h2 {
		margin: 0;
		font-size: 1.4rem;
	}

	.cta-card p {
		margin: 0;
		font-size: 1rem;
		opacity: 0.88;
		flex-grow: 1;
		line-height: 1.55;
	}

	/* ── Map section ──────────────────────────────────────────────────── */

	.map-section {
		margin-bottom: 5rem;
	}

	.map-header {
		margin-bottom: 1rem;
	}

	.map-title-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.4rem;
	}

	.map-title-row h2 {
		margin: 0;
	}

	.map-title-row :global(.map-pin-icon) {
		color: var(--brand, #ff9416);
		flex-shrink: 0;
	}

	.map-meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		flex-wrap: wrap;
		font-size: 0.875rem;
	}

	.map-stat {
		font-weight: 600;
		color: var(--brand, #ff9416);
	}

	.map-stat.forming {
		color: var(--text-secondary, #888);
	}

	.map-sep {
		color: var(--border, #d1d5db);
	}

	.map-hint {
		color: var(--text-secondary, #888);
	}

	/* ── Responsive ───────────────────────────────────────────────────── */

	@media (max-width: 640px) {
		article {
			padding: 0 1rem;
		}

		.cta-card {
			padding: 1.75rem 1.25rem;
		}
	}
</style>
