<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import Button from '$lib/components/Button.svelte'
	import type { PageData } from './$types'

	export let data: PageData

	$: lang = data.lang
	$: isEn = lang === 'en'

	$: title = isEn ? 'Municipal elections 2026 | Pause AI' : 'Élections municipales 2026 | Pause IA'
	$: description = isEn
		? 'The March 2026 municipal elections represent a major opportunity for local awareness. Pause AI is calling on candidates to make a concrete commitment by signing our charter.'
		: "Les élections municipales de mars 2026 représentent une opportunité majeure de sensibilisation au niveau local. À cette occasion, Pause IA appelle les candidats à s'engager concrètement en signant notre charte."

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
			charterFile: '/chartes-municipales-2026/stephane-baly-lille.pdf',
			charterType: 'pdf'
		},
		{
			id: 'jean-marc-governatori-nice',
			name: 'Jean-Marc Governatori',
			city: 'Nice',
			commitments: '14/14',
			charterFile: '/chartes-municipales-2026/jean-marc-governatori-nice.pdf',
			charterType: 'pdf'
		},
		{
			id: 'sebastien-muscat-brest',
			name: 'Sébastien Muscat',
			city: 'Brest',
			commitments: '14/14',
			charterFile: '/chartes-municipales-2026/sebastien-muscat-brest.pdf',
			charterType: 'pdf'
		},
		{
			id: 'johanna-rolland-nantes',
			name: 'Johanna Rolland',
			city: 'Nantes',
			commitments: '13/14',
			charterFile: '/chartes-municipales-2026/johanna-rolland-nantes.pdf',
			charterType: 'pdf'
		},
		{
			id: 'jeremy-roques-metz',
			name: 'Jérémy Roques',
			city: 'Metz',
			commitments: '12/14',
			charterFile: '/chartes-municipales-2026/jeremy-roques-metz.pdf',
			charterType: 'pdf'
		},
		{
			id: 'mariane-maximi-clermont-ferrand',
			name: 'Mariane Maximi',
			city: 'Clermont-Ferrand',
			commitments: '6/14',
			charterFile: '/chartes-municipales-2026/mariane-maximi-clermont-ferrand.pdf',
			charterType: 'pdf'
		},
		{
			id: 'vincent-belloteau-perigueux',
			name: 'Vincent Belloteau',
			city: 'Périgueux',
			commitments: '14/14',
			charterFile: '/chartes-municipales-2026/vincent-belloteau-perigueux.pdf',
			charterType: 'pdf'
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
		// Ajoutez ici les articles de presse sur la campagne municipales 2026
		// Exemple :
		// {
		//   source: 'Le Monde',
		//   title: 'Des candidats aux municipales signent la charte Pause IA',
		//   url: 'https://lemonde.fr/...',
		//   date: '2026-02-15'
		// }
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
		return date.toLocaleDateString(isEn ? 'en-GB' : 'fr-FR', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		})
	}

	function getCommitmentLabel(c: string): string {
		if (c === '14/14') return isEn ? 'Full charter' : 'Charte complète'
		const num = parseInt(c.split('/')[0])
		return isEn ? `${num} of 14 commitments` : `${num}/14 engagements`
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
		<UnderlinedTitle as="h1">
			{isEn ? 'Municipal elections 2026' : 'Élections municipales 2026'}
		</UnderlinedTitle>

		<p class="intro">{description}</p>
	</section>

	<!-- Section : Candidats engagés -->
	<section class="signatories-section">
		<h2>{isEn ? 'Committed candidates' : 'Les candidat·es engagé·es'}</h2>
		<p class="section-intro">
			{#if isEn}
				These candidates have signed the Pause AI charter on the risks of artificial intelligence.
				Click on a card to discover their commitment.
			{:else}
				Ces candidat·es ont signé la charte de Pause IA sur les risques de l'intelligence
				artificielle. Cliquez sur une carte pour découvrir leur engagement.
			{/if}
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
					<span class="view-charter"
						>{isEn ? 'View charter →' : 'Voir la charte →'}</span
					>
				</button>
			{/each}
		</div>
	</section>

	<!-- Section : Campagne en cours -->
	<section class="charte-engagement">
		<div class="charte-header">
			{#if isEn}
				<h2>Ask your candidates to commit to the Pause AI charter</h2>
				<p>
					You can act locally by challenging the candidates in your city. Invite them to discover
					and sign the Pause AI charter. All signatories will soon be displayed on this page.
				</p>
			{:else}
				<h2>Demander à vos candidats de s'engager sur la charte de Pause IA</h2>
				<p>
					Vous pouvez agir localement en interpellant les candidats de votre ville. Invitez-les à
					découvrir et à signer la charte de Pause IA. L'ensemble des signataires sera prochainement
					affiché sur cette page.
				</p>
			{/if}
		</div>

		<div class="cta-container">
			<Button on:click={() => (showGeneralModal = true)}>
				{isEn ? 'Discover the charter' : 'Je découvre la charte'}
			</Button>
			<Button on:click={openActivoice}>
				{isEn ? 'Challenge my city candidates' : "J'interpelle les candidats de ma ville"}
			</Button>
		</div>

		<activoice-embed id="activoice-embed-1d572d9b_9638_4731_84c0_ce7fd867cccb" />
	</section>

	<!-- Section : Presse -->
	{#if pressArticles.length > 0}
		<section class="press-section">
			<h2>{isEn ? 'Press coverage' : 'Ils en parlent'}</h2>
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
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="modal-overlay" on:click={closeModal}>
		<div
			class="modal-content"
			on:click|stopPropagation
			role="dialog"
			aria-modal="true"
			aria-label={isEn
				? `Charter signed by ${selectedCandidate.name}`
				: `Charte de ${selectedCandidate.name}`}
		>
			<div class="modal-header">
				<div>
					<strong>{selectedCandidate.name}</strong> — {selectedCandidate.city}
					<span
						class="modal-badge commitment-badge {getCommitmentClass(selectedCandidate.commitments)}"
					>
						{getCommitmentLabel(selectedCandidate.commitments)}
					</span>
				</div>
				<button
					class="close-button"
					on:click={closeModal}
					aria-label={isEn ? 'Close' : 'Fermer'}
				>
					&times;
				</button>
			</div>
			{#if selectedCandidate.charterType === 'pdf'}
				<iframe
					src={selectedCandidate.charterFile}
					title={isEn
						? `Charter signed by ${selectedCandidate.name}`
						: `Charte signée par ${selectedCandidate.name}`}
					class="charter-iframe"
				></iframe>
			{:else}
				<img
					src={selectedCandidate.charterFile}
					alt={isEn
						? `Charter signed by ${selectedCandidate.name}`
						: `Charte signée par ${selectedCandidate.name}`}
					class="charter-img"
				/>
			{/if}
		</div>
	</div>
{/if}

<!-- Modal : Charte générale -->
{#if showGeneralModal}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="modal-overlay" on:click={closeModal}>
		<div
			class="modal-content modal-content--img"
			on:click|stopPropagation
			role="dialog"
			aria-modal="true"
			aria-label={isEn ? 'Pause AI Charter' : 'Charte Pause IA'}
		>
			<button
				class="close-button close-button--top"
				on:click={closeModal}
				aria-label={isEn ? 'Close' : 'Fermer'}
			>
				&times;
			</button>
			<img
				src="/charte-municipales-2026.png"
				alt={isEn
					? 'The Pause AI charter for municipal elections'
					: 'La charte Pause IA pour les municipales'}
			/>
		</div>
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
		color: var(--text-muted, #444);
	}

	/* ── Signatories section ── */
	.signatories-section {
		margin-bottom: 4rem;
	}

	.signatories-section h2 {
		font-size: 2rem;
		margin-top: 0;
		margin-bottom: 0.75rem;
		color: var(--text-heading, #222);
	}

	.section-intro {
		font-size: 1.05rem;
		line-height: 1.6;
		color: var(--text-muted, #444);
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
		background: #fafafa;
		border: 1px solid #eee;
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
		color: var(--text-heading, #222);
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
		background: #fafafa;
		border-radius: 16px;
		padding: 3rem 2rem;
		border: 1px solid #eee;
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
		color: var(--text-heading, #222);
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
		background: white;
		border: 1px solid #eee;
		border-radius: 10px;
		text-decoration: none;
		color: var(--text-heading, #222);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease,
			border-color 0.2s ease;
	}

	.press-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
		border-color: var(--brand, #ff9416);
		color: var(--text-heading, #222);
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
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.8);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 2000;
		cursor: pointer;
		padding: 2rem;
	}

	.modal-content {
		position: relative;
		width: min(90vw, 56rem);
		max-height: 90vh;
		background: white;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
		cursor: default;
		display: flex;
		flex-direction: column;
	}

	.modal-content--img {
		width: auto;
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding: 1rem 1.25rem;
		border-bottom: 1px solid #eee;
		font-size: 0.95rem;
		flex-shrink: 0;
	}

	.modal-badge {
		margin-left: 0.5rem;
		vertical-align: middle;
	}

	.close-button {
		background: rgba(0, 0, 0, 0.1);
		color: #333;
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
