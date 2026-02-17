<script lang="ts">
	import { MoveUpRight, ChevronLeft, ChevronRight } from 'lucide-svelte'
	import type { PressRelease, LocalPressRelease } from '$lib/notion'

	export let data: { pressReleases: PressRelease[]; localPressReleases: LocalPressRelease[] }

	const PER_PAGE = 15

	const fallbackPressReleases: PressRelease[] = [
		{
			id: '1',
			title: 'Forum des solutions pour une IA compatible avec l\u2019humanit\u00e9',
			date: '2024-11-21',
			url: '/pdfs/communique_de_presse_forum_des_solutions.pdf',
			description:
				'Communiqu\u00e9 de presse pour le forum des solutions organis\u00e9 au S\u00e9nat.',
			order: 1,
			visible: true
		}
	]

	$: pressReleases = data.pressReleases.length > 0 ? data.pressReleases : fallbackPressReleases
	$: localPressReleases = data.localPressReleases

	// Tabs
	type Tab = 'national' | 'local'
	let activeTab: Tab = 'national'

	function switchTab(tab: Tab) {
		activeTab = tab
		currentPage = 1
		localCurrentPage = 1
		selectedDepartment = ''
	}

	// --- National pagination ---
	let currentPage = 1
	$: totalPages = Math.ceil(pressReleases.length / PER_PAGE)
	$: startIndex = (currentPage - 1) * PER_PAGE
	$: paginatedReleases = pressReleases.slice(startIndex, startIndex + PER_PAGE)

	function goToPage(page: number) {
		currentPage = page
		const section = document.getElementById('press-releases-top')
		if (section) {
			section.scrollIntoView({ behavior: 'smooth', block: 'start' })
		}
	}

	// --- Local (departmental) filtering & pagination ---
	let selectedDepartment = ''
	$: departments = [
		...new Set(localPressReleases.map((pr) => pr.department).filter(Boolean))
	].sort()
	$: filteredLocalReleases = selectedDepartment
		? localPressReleases.filter((pr) => pr.department === selectedDepartment)
		: localPressReleases

	let localCurrentPage = 1
	$: localTotalPages = Math.ceil(filteredLocalReleases.length / PER_PAGE)
	$: localStartIndex = (localCurrentPage - 1) * PER_PAGE
	$: paginatedLocalReleases = filteredLocalReleases.slice(
		localStartIndex,
		localStartIndex + PER_PAGE
	)

	function goToLocalPage(page: number) {
		localCurrentPage = page
		const section = document.getElementById('press-releases-top')
		if (section) {
			section.scrollIntoView({ behavior: 'smooth', block: 'start' })
		}
	}

	function onDepartmentChange() {
		localCurrentPage = 1
	}

	// --- Shared helpers ---
	function formatDate(dateStr: string): string {
		if (!dateStr) return ''
		const date = new Date(dateStr + 'T00:00:00')
		return date.toLocaleDateString('fr-FR', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		})
	}

	function formatDateShort(dateStr: string): string {
		if (!dateStr) return ''
		const date = new Date(dateStr + 'T00:00:00')
		return date.toLocaleDateString('fr-FR', {
			day: 'numeric',
			month: 'short',
			year: 'numeric'
		})
	}

	function scrollToCard(id: string) {
		const el = document.getElementById(`pr-${id}`)
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'start' })
		}
	}

	function onMobileSelect(event: Event) {
		const select = event.target as HTMLSelectElement
		const id = select.value
		if (id) {
			scrollToCard(id)
			select.value = ''
		}
	}
</script>

<svelte:head>
	<title>Espace Presse - Pause IA</title>
	<meta
		name="description"
		content="Espace presse de Pause IA : communiqués de presse, contact médias et ressources pour les journalistes."
	/>
</svelte:head>

<div class="press-page">
	<header class="press-header">
		<h1>Espace Presse</h1>
		<p class="subtitle">Ressources et informations pour les journalistes</p>
	</header>

	<section class="contact-section">
		<div class="contact-card">
			<h2>Contact presse</h2>
			<p class="contact-note">Réservé aux journalistes</p>
			<div class="contact-info">
				<div class="contact-person">
					<p class="contact-name">Clémence Peyrot</p>
					<p>
						<strong>Email :</strong>
						<a href="mailto:presse@pauseia.fr">presse@pauseia.fr</a>
					</p>
					<p>
						<strong>Tél. :</strong>
						<a href="tel:+33645513415">06 45 51 34 15</a>
					</p>
				</div>
				<div class="contact-person">
					<p class="contact-name">Maxime Fournes</p>
					<p class="contact-role">Co-fondateur de Pause IA</p>
					<p>
						<strong>Email :</strong>
						<a href="mailto:presse@pauseia.fr">presse@pauseia.fr</a>
					</p>
					<p>
						<strong>Tél. :</strong>
						<a href="tel:+33743155617">07 43 15 56 17</a>
					</p>
				</div>
			</div>
			<p class="redirect">
				Si vous n'êtes pas journaliste, nous vous invitons à
				<a href="/qui-sommes-nous">vous rendre sur cette page</a> pour nous contacter.
			</p>
		</div>
	</section>

	<section class="press-releases-section">
		<h2 id="press-releases-top">Nos communiqués de presse</h2>

		<!-- Tabs -->
		<div class="tabs" role="tablist">
			<button
				class="tab"
				class:active={activeTab === 'national'}
				on:click={() => switchTab('national')}
				role="tab"
				aria-selected={activeTab === 'national'}
			>
				Nationaux
			</button>
			<button
				class="tab"
				class:active={activeTab === 'local'}
				on:click={() => switchTab('local')}
				role="tab"
				aria-selected={activeTab === 'local'}
			>
				Par département
			</button>
		</div>

		<!-- ===== NATIONAL TAB ===== -->
		{#if activeTab === 'national'}
			<!-- Mobile: dropdown navigation -->
			<div class="mobile-nav">
				<select class="mobile-select" on:change={onMobileSelect}>
					<option value="" disabled selected>Accès rapide...</option>
					{#each paginatedReleases as pr (pr.id)}
						<option value={pr.id}>
							{pr.title} ({formatDateShort(pr.date)})
						</option>
					{/each}
				</select>
			</div>

			<div class="press-layout">
				<!-- Desktop: sidebar navigation -->
				<nav class="press-sidebar">
					<h3 class="sidebar-title">Accès rapide</h3>
					<ul class="sidebar-list">
						{#each paginatedReleases as pr (pr.id)}
							<li>
								<button class="sidebar-item" on:click={() => scrollToCard(pr.id)}>
									<span class="sidebar-item-title">{pr.title}</span>
									{#if pr.date}
										<time class="sidebar-item-date" datetime={pr.date}
											>{formatDateShort(pr.date)}</time
										>
									{/if}
								</button>
							</li>
						{/each}
					</ul>
					{#if totalPages > 1}
						<div class="sidebar-page-info">
							Page {currentPage} / {totalPages}
						</div>
					{/if}
				</nav>

				<!-- Press releases list -->
				<div class="press-releases-list">
					{#each paginatedReleases as pr (pr.id)}
						<a
							id="pr-{pr.id}"
							class="press-release-card"
							href={pr.url}
							target="_blank"
							rel="noopener noreferrer"
						>
							<div class="pr-content">
								<h3>{pr.title}</h3>
								{#if pr.description}
									<p class="pr-description">{pr.description}</p>
								{/if}
							</div>
							<div class="pr-footer">
								{#if pr.date}
									<time datetime={pr.date}>{formatDate(pr.date)}</time>
								{/if}
								<span class="read-link">
									Lire le communiqué
									<span class="link-icon"><MoveUpRight size="1.25rem" /></span>
								</span>
							</div>
						</a>
					{/each}

					{#if totalPages > 1}
						<nav class="pagination" aria-label="Pagination des communiqués nationaux">
							<button
								class="pagination-btn"
								disabled={currentPage === 1}
								on:click={() => goToPage(currentPage - 1)}
								aria-label="Page précédente"
							>
								<ChevronLeft size="1.25rem" />
							</button>

							{#each Array(totalPages) as _, i}
								<button
									class="pagination-num"
									class:active={currentPage === i + 1}
									on:click={() => goToPage(i + 1)}
									aria-label="Page {i + 1}"
									aria-current={currentPage === i + 1 ? 'page' : undefined}
								>
									{i + 1}
								</button>
							{/each}

							<button
								class="pagination-btn"
								disabled={currentPage === totalPages}
								on:click={() => goToPage(currentPage + 1)}
								aria-label="Page suivante"
							>
								<ChevronRight size="1.25rem" />
							</button>
						</nav>
					{/if}
				</div>
			</div>
		{/if}

		<!-- ===== LOCAL (DEPARTMENTAL) TAB ===== -->
		{#if activeTab === 'local'}
			<!-- Department filter -->
			<div class="department-filter">
				<label for="dept-select" class="dept-label">Filtrer par département :</label>
				<select
					id="dept-select"
					class="dept-select"
					bind:value={selectedDepartment}
					on:change={onDepartmentChange}
				>
					<option value="">Tous les départements</option>
					{#each departments as dept}
						<option value={dept}>{dept}</option>
					{/each}
				</select>
			</div>

			{#if filteredLocalReleases.length === 0}
				<div class="empty-state">
					<p>
						{#if selectedDepartment}
							Aucun communiqué pour le département {selectedDepartment}.
						{:else}
							Aucun communiqué départemental disponible pour le moment.
						{/if}
					</p>
				</div>
			{:else}
				<!-- Mobile: dropdown navigation -->
				<div class="mobile-nav">
					<select class="mobile-select" on:change={onMobileSelect}>
						<option value="" disabled selected>Accès rapide...</option>
						{#each paginatedLocalReleases as pr (pr.id)}
							<option value={pr.id}>
								[{pr.department}] {pr.title} ({formatDateShort(pr.date)})
							</option>
						{/each}
					</select>
				</div>

				<div class="press-layout">
					<!-- Desktop: sidebar navigation -->
					<nav class="press-sidebar">
						<h3 class="sidebar-title">Accès rapide</h3>
						<ul class="sidebar-list">
							{#each paginatedLocalReleases as pr (pr.id)}
								<li>
									<button class="sidebar-item" on:click={() => scrollToCard(pr.id)}>
										<span class="sidebar-item-dept">{pr.department}</span>
										<span class="sidebar-item-title">{pr.title}</span>
										{#if pr.date}
											<time class="sidebar-item-date" datetime={pr.date}
												>{formatDateShort(pr.date)}</time
											>
										{/if}
									</button>
								</li>
							{/each}
						</ul>
						{#if localTotalPages > 1}
							<div class="sidebar-page-info">
								Page {localCurrentPage} / {localTotalPages}
							</div>
						{/if}
					</nav>

					<!-- Local press releases list -->
					<div class="press-releases-list">
						{#each paginatedLocalReleases as pr (pr.id)}
							<a
								id="pr-{pr.id}"
								class="press-release-card"
								href={pr.url}
								target="_blank"
								rel="noopener noreferrer"
							>
								<div class="pr-content">
									<div class="pr-dept-badge">{pr.department}</div>
									<h3>{pr.title}</h3>
									{#if pr.description}
										<p class="pr-description">{pr.description}</p>
									{/if}
								</div>
								<div class="pr-footer">
									{#if pr.date}
										<time datetime={pr.date}>{formatDate(pr.date)}</time>
									{/if}
									<span class="read-link">
										Lire le communiqué
										<span class="link-icon"><MoveUpRight size="1.25rem" /></span>
									</span>
								</div>
							</a>
						{/each}

						{#if localTotalPages > 1}
							<nav class="pagination" aria-label="Pagination des communiqués départementaux">
								<button
									class="pagination-btn"
									disabled={localCurrentPage === 1}
									on:click={() => goToLocalPage(localCurrentPage - 1)}
									aria-label="Page précédente"
								>
									<ChevronLeft size="1.25rem" />
								</button>

								{#each Array(localTotalPages) as _, i}
									<button
										class="pagination-num"
										class:active={localCurrentPage === i + 1}
										on:click={() => goToLocalPage(i + 1)}
										aria-label="Page {i + 1}"
										aria-current={localCurrentPage === i + 1 ? 'page' : undefined}
									>
										{i + 1}
									</button>
								{/each}

								<button
									class="pagination-btn"
									disabled={localCurrentPage === localTotalPages}
									on:click={() => goToLocalPage(localCurrentPage + 1)}
									aria-label="Page suivante"
								>
									<ChevronRight size="1.25rem" />
								</button>
							</nav>
						{/if}
					</div>
				</div>
			{/if}
		{/if}
	</section>

	<section class="about-section">
		<div class="about-card">
			<h2>À propos de Pause IA</h2>
			<p>
				Pause IA est une association de bénévoles qui alerte les citoyens et les pouvoirs publics
				français sur les graves dangers que la course à l'intelligence artificielle fait courir à la
				société humaine, et les incite à agir à leur niveau pour s'y opposer.
			</p>
			<p>
				Pause IA est la représentation en France de Pause AI Global, qui demande un moratoire sur
				l'entraînement des systèmes d'IA générale (IAG) jusqu'à ce que toutes les conditions de
				sécurité et de contrôle démocratique soient réunies.
			</p>
		</div>
	</section>
</div>

<style>
	.press-page {
		max-width: 64rem;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	.press-header {
		margin-bottom: 3rem;
	}

	.press-header h1 {
		font-size: 2rem;
		margin-bottom: 0.5rem;
	}

	.subtitle {
		font-size: 1.1rem;
		color: var(--text-secondary);
		margin: 0;
	}

	/* Contact section */
	.contact-section {
		margin-bottom: 3rem;
	}

	.contact-card {
		background-color: var(--bg-subtle);
		border: 2px solid var(--brand);
		border-radius: 0.5rem;
		padding: 1.5rem;
	}

	.contact-card h2 {
		margin-top: 0;
		margin-bottom: 0.25rem;
		font-size: 1.4rem;
	}

	.contact-note {
		font-size: 0.9rem;
		color: var(--text-secondary);
		margin-bottom: 1rem;
		font-style: italic;
	}

	.contact-info {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.contact-person {
		padding-bottom: 1rem;
		border-bottom: 1px solid rgba(0, 0, 0, 0.06);
	}

	.contact-person:last-child {
		padding-bottom: 0;
		border-bottom: none;
	}

	.contact-person p {
		margin: 0.25rem 0;
	}

	.contact-name {
		font-weight: 700;
		font-size: 1.05rem;
		margin-bottom: 0;
	}

	.contact-role {
		color: var(--text-secondary);
		font-size: 0.9rem;
		margin-bottom: 0.5rem;
	}

	.contact-info a {
		color: var(--brand);
		font-weight: 600;
	}

	.redirect {
		font-size: 0.9rem;
		color: var(--text-secondary);
		margin-bottom: 0;
		padding-top: 1rem;
		border-top: 1px solid rgba(0, 0, 0, 0.08);
	}

	.redirect a {
		color: var(--brand);
	}

	/* Press releases section */
	.press-releases-section h2 {
		margin-top: 0;
		margin-bottom: 1.5rem;
		font-size: 1.4rem;
	}

	/* Tabs */
	.tabs {
		display: flex;
		gap: 0;
		margin-bottom: 1.5rem;
		border-bottom: 2px solid var(--border);
	}

	.tab {
		padding: 0.75rem 1.5rem;
		border: none;
		background: transparent;
		font-size: 0.95rem;
		font-weight: 600;
		color: var(--text-secondary);
		cursor: pointer;
		position: relative;
		transition:
			color 0.15s ease,
			background-color 0.15s ease;
		border-radius: 0.375rem 0.375rem 0 0;
	}

	.tab:hover {
		color: var(--text);
		background-color: rgba(0, 0, 0, 0.03);
	}

	.tab.active {
		color: var(--brand);
	}

	.tab.active::after {
		content: '';
		position: absolute;
		bottom: -2px;
		left: 0;
		right: 0;
		height: 2px;
		background-color: var(--brand);
	}

	/* Department filter */
	.department-filter {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1.5rem;
		flex-wrap: wrap;
	}

	.dept-label {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--text);
		white-space: nowrap;
	}

	.dept-select {
		padding: 0.5rem 2.25rem 0.5rem 0.75rem;
		font-size: 0.9rem;
		border: 1px solid var(--border);
		border-radius: 0.375rem;
		background-color: var(--white);
		color: var(--text);
		appearance: none;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23676e7a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 0.5rem center;
		cursor: pointer;
		min-width: 14rem;
	}

	.dept-select:focus {
		outline: 2px solid var(--brand);
		outline-offset: 2px;
	}

	/* Empty state */
	.empty-state {
		text-align: center;
		padding: 3rem 1rem;
		color: var(--text-secondary);
		font-size: 0.95rem;
	}

	/* Department badge on cards */
	.pr-dept-badge {
		display: inline-block;
		padding: 0.2rem 0.5rem;
		margin-bottom: 0.5rem;
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--brand);
		background-color: rgba(var(--brand-rgb, 0, 0, 0), 0.08);
		border: 1px solid var(--brand);
		border-radius: 0.25rem;
	}

	/* Sidebar department label */
	.sidebar-item-dept {
		font-size: 0.7rem;
		font-weight: 700;
		color: var(--brand);
		text-transform: uppercase;
		letter-spacing: 0.03em;
	}

	/* Mobile dropdown nav - hidden on desktop */
	.mobile-nav {
		display: none;
		margin-bottom: 1.5rem;
	}

	.mobile-select {
		width: 100%;
		padding: 0.75rem 1rem;
		font-size: 0.95rem;
		font-family: var(--font-body);
		border: 1px solid var(--border);
		border-radius: 0.5rem;
		background-color: var(--white);
		color: var(--text);
		appearance: none;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23676e7a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 0.75rem center;
		padding-right: 2.5rem;
		cursor: pointer;
	}

	.mobile-select:focus {
		outline: 2px solid var(--brand);
		outline-offset: 2px;
	}

	/* Layout with sidebar */
	.press-layout {
		display: flex;
		gap: 2rem;
		align-items: flex-start;
	}

	/* Sidebar - hidden on mobile */
	.press-sidebar {
		position: sticky;
		top: 1rem;
		flex-shrink: 0;
		width: 16rem;
		max-height: calc(100vh - 2rem);
		overflow-y: auto;
		background-color: var(--bg-subtle);
		border: 1px solid var(--border);
		border-radius: 0.75rem;
		padding: 1.25rem;
	}

	.sidebar-title {
		margin: 0 0 0.75rem;
		font-size: 0.85rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--brand);
	}

	.sidebar-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.sidebar-list li {
		padding: 0;
		margin: 0;
	}

	.sidebar-item {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
		width: 100%;
		padding: 0.5rem 0.625rem;
		border: none;
		background: transparent;
		border-radius: 0.375rem;
		cursor: pointer;
		text-align: left;
		transition: background-color 0.15s ease;
	}

	.sidebar-item:hover {
		background-color: rgba(0, 0, 0, 0.05);
	}

	.sidebar-item-title {
		font-size: 0.8rem;
		font-weight: 600;
		color: var(--text);
		line-height: 1.3;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.sidebar-item-date {
		font-size: 0.7rem;
		color: var(--text-secondary);
	}

	.sidebar-page-info {
		margin-top: 0.75rem;
		padding-top: 0.75rem;
		border-top: 1px solid var(--border);
		font-size: 0.75rem;
		color: var(--text-secondary);
		text-align: center;
	}

	/* Press releases list */
	.press-releases-list {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		flex-grow: 1;
		min-width: 0;
	}

	.press-release-card {
		display: flex;
		flex-direction: column;
		padding: 1.5rem;
		background-color: var(--white);
		border: 1px solid var(--border);
		border-radius: 0.75rem;
		text-decoration: none;
		color: var(--text);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease,
			border-color 0.2s ease;
	}

	.press-release-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 20px -6px rgba(0, 0, 0, 0.12);
		border-color: var(--brand);
		color: var(--text);
	}

	.pr-content {
		flex-grow: 1;
	}

	.pr-content h3 {
		margin: 0 0 0.5rem;
		font-size: 1.125rem;
		font-weight: 700;
		line-height: 1.4;
		color: var(--text);
	}

	.pr-description {
		margin: 0;
		font-size: 0.95rem;
		color: var(--text-secondary);
		line-height: 1.5;
	}

	.pr-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--border);
	}

	.press-release-card time {
		font-size: 0.85rem;
		color: var(--text-secondary);
	}

	.read-link {
		display: flex;
		align-items: center;
		gap: 0.375rem;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--brand);
		transition: color 0.2s ease;
	}

	.press-release-card:hover .read-link {
		color: var(--brand);
	}

	.link-icon {
		display: flex;
		align-items: center;
		transition: transform 0.2s ease;
	}

	.press-release-card:hover .link-icon {
		transform: translate(2px, -2px);
	}

	/* Pagination */
	.pagination {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.375rem;
		margin-top: 1rem;
		padding-top: 1.5rem;
	}

	.pagination-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.25rem;
		height: 2.25rem;
		border: 1px solid var(--border);
		border-radius: 0.375rem;
		background: var(--white);
		color: var(--text);
		cursor: pointer;
		transition:
			background-color 0.15s ease,
			border-color 0.15s ease;
	}

	.pagination-btn:hover:not(:disabled) {
		background-color: var(--bg-subtle);
		border-color: var(--brand);
	}

	.pagination-btn:disabled {
		opacity: 0.35;
		cursor: not-allowed;
	}

	.pagination-num {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.25rem;
		height: 2.25rem;
		border: 1px solid var(--border);
		border-radius: 0.375rem;
		background: var(--white);
		color: var(--text);
		font-size: 0.875rem;
		font-weight: 600;
		cursor: pointer;
		transition:
			background-color 0.15s ease,
			border-color 0.15s ease;
	}

	.pagination-num:hover {
		background-color: var(--bg-subtle);
		border-color: var(--brand);
	}

	.pagination-num.active {
		background-color: var(--brand);
		border-color: var(--brand);
		color: var(--white);
	}

	/* About section */
	.about-section {
		margin-top: 3rem;
	}

	.about-card {
		background-color: var(--bg-subtle);
		border-left: 4px solid var(--brand);
		border-radius: 0.5rem;
		padding: 1.5rem 2rem;
	}

	.about-card h2 {
		margin-top: 0;
		margin-bottom: 1rem;
		font-size: 1.3rem;
	}

	.about-card p {
		font-size: 0.95rem;
		line-height: 1.6;
		color: var(--text-secondary);
		margin-bottom: 0.75rem;
	}

	.about-card p:last-child {
		margin-bottom: 0;
	}

	/* Mobile */
	@media (max-width: 768px) {
		.mobile-nav {
			display: block;
		}

		.press-layout {
			flex-direction: column;
		}

		.press-sidebar {
			display: none;
		}

		.tabs {
			gap: 0;
		}

		.tab {
			flex: 1;
			padding: 0.625rem 0.5rem;
			font-size: 0.875rem;
			text-align: center;
		}

		.department-filter {
			flex-direction: column;
			align-items: stretch;
		}

		.dept-select {
			min-width: 0;
			width: 100%;
		}

		.contact-info {
			gap: 0.75rem;
		}
	}

	@media (min-width: 640px) {
		.press-page {
			padding: 3rem 2rem;
		}

		.press-header h1 {
			font-size: 2.5rem;
		}

		.contact-card {
			padding: 2rem;
		}
	}
</style>
