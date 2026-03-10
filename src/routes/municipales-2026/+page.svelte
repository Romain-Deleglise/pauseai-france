<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import Button from '$lib/components/Button.svelte'

	const title = 'Élections municipales 2026'
	const description =
		"Les élections municipales de mars 2026 représentent une opportunité majeure de sensibilisation au niveau local. À cette occasion, Pause IA appelle les candidats à s'engager concrètement en signant notre charte."

	// --- Candidats signataires ---
	interface Candidate {
		id: string
		name: string
		city: string
		commitments: string // ex: "14/14" ou "13/14"
		charterFile: string // chemin dans /static/chartes-municipales-2026/
		charterType: 'image' | 'pdf'
	}

	const candidates: Candidate[] = [
		{
			id: 'stephane-baly-lille',
			name: 'Stéphane Baly',
			city: 'Lille',
			commitments: '14/14',
			charterFile: '/chartes-municipales-2026/Baly.pdf',
			charterType: 'pdf'
		},
		{
			id: 'jean-marc-governatori-nice',
			name: 'Jean-Marc Governatori',
			city: 'Nice',
			commitments: '14/14',
			charterFile: '/chartes-municipales-2026/Governatori.pdf',
			charterType: 'pdf'
		},
		{
			id: 'sebastien-muscat-brest',
			name: 'Sébastien Muscat',
			city: 'Brest',
			commitments: '14/14',
			charterFile: '/chartes-municipales-2026/Muscat.pdf',
			charterType: 'pdf'
		},
		{
			id: 'johanna-rolland-nantes',
			name: 'Johanna Rolland',
			city: 'Nantes',
			commitments: '13/14',
			charterFile: '/chartes-municipales-2026/Rolland.pdf',
			charterType: 'pdf'
		},
		{
			id: 'jeremy-roques-metz',
			name: 'Jérémy Roques',
			city: 'Metz',
			commitments: '12/14',
			charterFile: '/chartes-municipales-2026/Roques.webp',
			charterType: 'image'
		},
		{
			id: 'mariane-maximi-clermont-ferrand',
			name: 'Mariane Maximi',
			city: 'Clermont-Ferrand',
			commitments: '6/14',
			charterFile: '/chartes-municipales-2026/Maximi.pdf',
			charterType: 'pdf'
		},
		{
			id: 'vincent-belloteau-perigueux',
			name: 'Vincent Belloteau',
			city: 'Périgueux',
			commitments: '14/14',
			charterFile: '/chartes-municipales-2026/Belloteau.webp',
			charterType: 'image'
		},
		{
			id: 'sarah-hamza-reguig-paris11',
			name: 'Sarah Hamza Reguig',
			city: 'Paris 11e',
			commitments: '14/14',
			charterFile: '/chartes-municipales-2026/Charte Pause IA-Equinoxe.jpg',
			charterType: 'image'
		}
	]

	// --- Articles de presse sur la campagne municipales ---
	interface PressArticle {
		source: string
		title: string
		url: string
		date?: string
	}

	const pressArticles: PressArticle[] = [
		{
			source: 'Le Dauphiné Libéré',
			title: "Isère / Grenoble : l'association Pause IA appelle les candidats à s'engager sur sa charte",
			url: 'https://www.ledauphine.com/elections/2026/03/06/isere-grenoble-l-association-pause-ia-appelle-les-candidats-a-s-engager-sur-sa-charte',
			date: '2026-03-06'
		},
		{
			source: "Place Gre'net",
			title: "Municipales 2026 : Pause IA interpelle les candidats sur les dangers de l'intelligence artificielle",
			url: 'https://www.placegrenet.fr/2026/03/08/municipales-2026-pause-ia-interpelle-les-candidats-sur-les-dangers-de-lintelligence-artificielle/673506',
			date: '2026-03-08'
		},
		{
			source: "L'Opinion",
			title: "Risques IA : l'association interpelle les candidats aux municipales de Toulouse",
			url: 'https://lopinion.com/amp/articles/actualite/32757_risques-ia-association-candidats-municipales-toulouse'
		}
	]

	// --- Modal ---
	let showCharterModal = false
	let selectedCandidate: Candidate | null = null

	let showGeneralModal = false

	function openCandidate(candidate: Candidate) {
		selectedCandidate = candidate
		showCharterModal = true
	}

	function closeModal() {
		showCharterModal = false
		showGeneralModal = false
		selectedCandidate = null
	}

	function openActivoice() {
		const embedEl = document.getElementById(
			'activoice-embed-1d572d9b_9638_4731_84c0_ce7fd867cccb'
		) as any
		if ((window as any).Activoice) {
			;(window as any).Activoice.bootstrap().then(() => {
				embedEl?.openWithId('1d572d9b-9638-4731-84c0-ce7fd867cccb')
			})
		}
	}

	function formatDate(dateStr: string): string {
		const date = new Date(dateStr + 'T00:00:00')
		return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
	}

	function getCommitmentLabel(c: string): string {
		if (c === '14/14') return 'Charte complète'
		return `${c} engagements`
	}

	function getCommitmentClass(c: string): string {
		if (c === '14/14') return 'badge-full'
		const num = parseInt(c.split('/')[0])
		if (num >= 12) return 'badge-high'
		if (num >= 8) return 'badge-mid'
		return 'badge-low'
	}
</script>

<svelte:head>
	<script src="https://activoice.online/embed/activoice-12.0.0.js"></script>
</svelte:head>

<PostMeta {title} {description} />

<article>
	<section class="hero">
		<UnderlinedTitle as="h1">Élections municipales 2026</UnderlinedTitle>

		<p class="intro">
			{description}
		</p>
	</section>

	<!-- Section : Candidats engagés -->
	<section class="signatories-section">
		<h2>Les candidat·es engagé·es</h2>
		<p class="section-intro">
			Ces candidat·es ont signé la charte de Pause IA sur les risques de l'intelligence
			artificielle. Cliquez sur une carte pour découvrir leur engagement.
		</p>

		<div class="candidates-grid">
			{#each candidates as candidate}
				<button class="candidate-card" on:click={() => openCandidate(candidate)}>
					<div class="candidate-info">
						<span class="candidate-name">{candidate.name}</span>
						<span class="candidate-city">{candidate.city}</span>
					</div>
					<span class="commitment-badge {getCommitmentClass(candidate.commitments)}">
						{getCommitmentLabel(candidate.commitments)}
					</span>
					<span class="view-charter">Voir la charte →</span>
				</button>
			{/each}
		</div>
	</section>

	<!-- Section : Campagne en cours -->
	<section class="charte-engagement">
		<div class="charte-header">
			<h2>Demander à vos candidats de s'engager sur la charte de Pause IA</h2>
			<p>
				Vous pouvez agir localement en interpellant les candidats de votre ville. Invitez-les à
				découvrir et à signer la charte de Pause IA. L'ensemble des signataires sera prochainement
				affiché sur cette page.
			</p>
		</div>

		<div class="cta-container">
			<Button on:click={() => (showGeneralModal = true)}>Je découvre la charte</Button>
			<Button on:click={openActivoice}>J'interpelle les candidats de ma ville</Button>
		</div>

		<activoice-embed id="activoice-embed-1d572d9b_9638_4731_84c0_ce7fd867cccb" />
	</section>

	<!-- Section : Presse -->
	{#if pressArticles.length > 0}
		<section class="press-section">
			<h2>Ils en parlent</h2>
			<div class="press-grid">
				{#each pressArticles as article}
					<a
						class="press-card"
						href={article.url}
						target="_blank"
						rel="noopener noreferrer"
					>
						<span class="press-source">{article.source}</span>
						<span class="press-title">{article.title}</span>
						{#if article.date}
							<time class="press-date" datetime={article.date}>{formatDate(article.date)}</time>
						{/if}
					</a>
				{/each}
			</div>
		</section>
	{/if}
</article>

<!-- Modal : Charte d'un candidat -->
{#if showCharterModal && selectedCandidate}
	<button class="modal-overlay" aria-label="Fermer" on:click={closeModal}></button>
	<div class="modal-content" role="dialog" aria-modal="true" aria-label="Charte de {selectedCandidate.name}">
		<div class="modal-header">
			<div>
				<strong>{selectedCandidate.name}</strong> — {selectedCandidate.city}
				<span class="modal-badge commitment-badge {getCommitmentClass(selectedCandidate.commitments)}">
					{getCommitmentLabel(selectedCandidate.commitments)}
				</span>
			</div>
			<button class="close-button" on:click={closeModal} aria-label="Fermer">&times;</button>
		</div>
		{#if selectedCandidate.charterType === 'pdf'}
			<iframe
				src="{selectedCandidate.charterFile}"
				title="Charte signée par {selectedCandidate.name}"
				class="charter-iframe"
			></iframe>
		{:else}
			<img
				src="{selectedCandidate.charterFile}"
				alt="Charte signée par {selectedCandidate.name}"
				class="charter-img"
			/>
		{/if}
	</div>
{/if}

<!-- Modal : Charte générale -->
{#if showGeneralModal}
	<button class="modal-overlay" aria-label="Fermer" on:click={closeModal}></button>
	<div class="modal-content" role="dialog" aria-modal="true" aria-label="Charte Pause IA">
		<button class="close-button close-button--top" on:click={closeModal} aria-label="Fermer">
			&times;
		</button>
		<img src="/charte-municipales-2026.png" alt="La charte Pause IA pour les municipales" />
	</div>
{/if}

<style>
	article {
		max-inline-size: 60rem;
		margin-inline: auto;
		margin-top: 3rem;
		padding: 0 2rem;
	}

	.hero {
		text-align: left;
		margin-bottom: 4rem;
	}

	.intro {
		font-size: 1.25rem;
		line-height: 1.6;
		color: var(--text);
	}

	/* ── Signatories section ── */
	.signatories-section {
		margin-bottom: 4rem;
	}

	.signatories-section h2 {
		font-size: 2rem;
		margin-top: 0;
		margin-bottom: 0.75rem;
		color: var(--text);
	}

	.section-intro {
		font-size: 1.05rem;
		line-height: 1.6;
		color: var(--text);
		margin-bottom: 2rem;
	}

	.candidates-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
		gap: 1.25rem;
	}

	.candidate-card {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding: 1.25rem 1.5rem;
		background: var(--bg-subtle, #fafafa);
		border: 1px solid var(--border, #eee);
		border-radius: 12px;
		cursor: pointer;
		text-align: left;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease,
			border-color 0.2s ease;
		font-family: var(--font-body);
	}

	.candidate-card:hover {
		transform: translateY(-3px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
		border-color: var(--brand, #ff9416);
	}

	.candidate-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.candidate-name {
		font-size: 1.05rem;
		font-weight: 700;
		color: var(--text);
	}

	.candidate-city {
		font-size: 0.9rem;
		color: var(--text-secondary, #666);
	}

	.commitment-badge {
		display: inline-block;
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
		font-size: 0.75rem;
		font-weight: 700;
		width: fit-content;
	}

	.badge-full {
		background: #d1fae5;
		color: #065f46;
	}

	.badge-high {
		background: #dbeafe;
		color: #1e40af;
	}

	.badge-mid {
		background: #fef9c3;
		color: #854d0e;
	}

	.badge-low {
		background: #fce7f3;
		color: #831843;
	}

	.view-charter {
		font-size: 0.85rem;
		font-weight: 600;
		color: var(--brand, #ff9416);
		margin-top: auto;
	}

	/* ── Engagement section ── */
	.charte-engagement {
		background: var(--bg-subtle, #fafafa);
		border-radius: 16px;
		padding: 3rem 2rem;
		border: 1px solid var(--border, #eee);
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
		text-align: center;
		margin-bottom: 4rem;
	}

	.charte-header {
		max-width: 45rem;
		margin: 0 auto 2rem;
	}

	h2 {
		font-size: 2rem;
		margin-top: 0;
		margin-bottom: 1.5rem;
		color: var(--text);
	}

	.charte-engagement p {
		font-size: 1.1rem;
		line-height: 1.7;
		margin-bottom: 0;
	}

	.cta-container {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		justify-content: center;
		margin-top: 2rem;
	}

	/* ── Press section ── */
	.press-section {
		margin-bottom: 4rem;
	}

	.press-section h2 {
		font-size: 1.75rem;
		margin-bottom: 1.25rem;
	}

	.press-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
		gap: 1rem;
	}

	.press-card {
		display: flex;
		flex-direction: column;
		gap: 0.375rem;
		padding: 1.125rem 1.25rem;
		background: var(--bg-subtle, #fff);
		border: 1px solid var(--border, #eee);
		border-radius: 10px;
		text-decoration: none;
		color: var(--text);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease,
			border-color 0.2s ease;
	}

	.press-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
		border-color: var(--brand, #ff9416);
		color: var(--text);
	}

	.press-source {
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		color: var(--brand, #ff9416);
	}

	.press-title {
		font-size: 0.925rem;
		font-weight: 600;
		line-height: 1.4;
	}

	.press-date {
		font-size: 0.8rem;
		color: var(--text-secondary, #666);
	}

	/* ── Modal ── */
	.modal-overlay {
		position: fixed;
		inset: 0;
		background: rgba(0, 0, 0, 0.8);
		z-index: 2000;
		cursor: pointer;
		border: none;
		padding: 0;
	}

	.modal-content {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: min(90vw, 56rem);
		height: 90vh;
		max-height: 90vh;
		background: var(--bg, #fff);
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
		z-index: 2001;
		display: flex;
		flex-direction: column;
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem 1.25rem;
		border-bottom: 1px solid var(--border, #eee);
		font-size: 0.95rem;
		flex-shrink: 0;
	}

	.modal-badge {
		margin-left: 0.5rem;
		vertical-align: middle;
	}

	.close-button {
		background: rgba(0, 0, 0, 0.1);
		color: var(--text);
		border: none;
		border-radius: 50%;
		width: 2rem;
		height: 2rem;
		font-size: 1.25rem;
		line-height: 1;
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-shrink: 0;
		transition: background 0.2s;
	}

	.close-button:hover {
		background: rgba(0, 0, 0, 0.2);
	}

	.close-button--top {
		position: absolute;
		top: 1rem;
		right: 1rem;
		background: rgba(0, 0, 0, 0.5);
		color: white;
		width: 2.5rem;
		height: 2.5rem;
		font-size: 1.5rem;
		z-index: 10;
	}

	.close-button--top:hover {
		background: rgba(0, 0, 0, 0.8);
	}

	.charter-iframe {
		width: 100%;
		flex: 1;
		min-height: 0;
		border: none;
		height: calc(90vh - 4rem);
	}

	.charter-img,
	.modal-content > img {
		display: block;
		max-width: 100%;
		max-height: calc(90vh - 4rem);
		object-fit: contain;
	}

	@media (max-width: 600px) {
		h2 {
			font-size: 1.5rem;
		}

		.charte-engagement {
			padding: 1.5rem;
		}

		.cta-container {
			flex-direction: column;
		}

		.candidates-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
