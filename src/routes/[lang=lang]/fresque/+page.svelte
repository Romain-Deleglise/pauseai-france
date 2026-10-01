<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import Button from '$components/Button.svelte'
	import { Card, SectionTitle } from '$components/ui'
	import type { PageData } from './$types'

	export let data: PageData
	$: isEn = data.lang === 'en'

	const SITE = 'https://fresquedesrisquesdelia.org'

	/* Bandeau panoramique : les photos d'atelier de l'accueil du site de la
	   fresque. Il n'y en a que cinq, donc le ruban les répète — mais dans un
	   ordre différent à chaque passage, sinon l'œil voit une boucle de cinq
	   images plutôt qu'un défilé. */
	const P = '/campaigns/fresque/photos'
	const PHOTOS = [
		`${P}/table-et-cartes.webp`,
		`${P}/fresque-en-cours.webp`,
		`${P}/tour-de-table.webp`,
		`${P}/premieres-cartes.webp`,
		`${P}/photo-de-groupe.webp`
	]
	const BANDE = [
		PHOTOS[0],
		PHOTOS[1],
		PHOTOS[2],
		PHOTOS[3],
		PHOTOS[4],
		PHOTOS[2],
		PHOTOS[0],
		PHOTOS[4],
		PHOTOS[1],
		PHOTOS[3],
		PHOTOS[4],
		PHOTOS[3],
		PHOTOS[1],
		PHOTOS[0],
		PHOTOS[2],
		PHOTOS[1],
		PHOTOS[4],
		PHOTOS[0],
		PHOTOS[3],
		PHOTOS[2]
	]

	/* Les trois cartes du hero du site de la fresque, recto et verso.
	   Visuels issus du dépôt de la fresque (Pause IA, CC BY-SA 4.0). */
	const CARTES = [
		{
			recto: '/campaigns/fresque/14.webp',
			verso: '/campaigns/fresque/14-verso.webp',
			fr: 'Deepfake',
			en: 'Deepfake'
		},
		{
			recto: '/campaigns/fresque/08.webp',
			verso: '/campaigns/fresque/08-verso.webp',
			fr: 'Génération d’images',
			en: 'Image generation'
		},
		{
			recto: '/campaigns/fresque/28.webp',
			verso: '/campaigns/fresque/28-verso.webp',
			fr: 'Systèmes d’armes létales autonomes',
			en: 'Lethal autonomous weapons'
		}
	]
	// Une carte retournée à la fois : deux versos ouverts côte à côte dans un
	// éventail se recouvrent et deviennent illisibles.
	let retournee: number | null = null
	const retourner = (i: number) => (retournee = retournee === i ? null : i)

	/* Formulaire d'intérêt. Il passe par /api/subscribe, qui exige au moins une
	   case cochée : l'inscription à la lettre d'information est donc le support
	   de l'envoi, et la page le dit au lieu de le faire en silence. Le champ
	   `source` distingue une demande personnelle d'une demande de structure,
	   ce qui est la question posée sur la maquette. */
	let prenom = ''
	let nom = ''
	let email = ''
	let pour: 'personnel' | 'structure' = 'personnel'
	let envoi = false
	let message = ''
	let erreur = false

	interface Reponse {
		success?: boolean
		message?: string
		error?: string
	}

	async function envoyer() {
		message = ''
		erreur = false
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			erreur = true
			message = isEn
				? 'Please enter a valid e-mail address.'
				: 'Indiquez une adresse e-mail valide.'
			return
		}
		envoi = true
		try {
			const res = await fetch('/api/subscribe', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email,
					subscribeNewsletter: true,
					subscribeSubstack: false,
					firstName: prenom || undefined,
					lastName: nom || undefined,
					source: pour === 'structure' ? 'fresque-structure' : 'fresque'
				})
			})
			const json = (await res.json()) as Reponse
			if (res.ok && json.success) {
				message = isEn
					? 'Thank you — we have your interest and will get back to you.'
					: 'Merci, votre intérêt est enregistré. Nous reviendrons vers vous.'
				prenom = ''
				nom = ''
				email = ''
			} else {
				erreur = true
				message =
					json.message ||
					json.error ||
					(isEn ? 'Sending failed. Please try again.' : 'L’envoi a échoué. Réessayez.')
			}
		} catch {
			erreur = true
			message = isEn
				? 'Service unavailable. Please try again later.'
				: 'Service indisponible. Réessayez plus tard.'
		} finally {
			envoi = false
		}
	}
</script>

<PostMeta
	title={isEn ? 'The AI Risks Fresk' : 'La Fresque des risques de l’IA'}
	description={isEn
		? 'A collaborative card-game workshop to build an overall picture of artificial intelligence, from its capabilities to its risks and the possible solutions.'
		: 'Un atelier collaboratif autour d’un jeu de cartes pour se faire une vision d’ensemble de l’intelligence artificielle, de ses capacités à ses risques, jusqu’aux solutions possibles.'}
/>

<div class="page">
	<header class="hero">
		<h1>{isEn ? 'The AI Risks Fresk' : 'La Fresque des risques de l’IA'}</h1>
		<span class="filet" aria-hidden="true"></span>
		<p class="lede">
			{isEn
				? 'A collaborative workshop built around a deck of cards, to build an overall picture of artificial intelligence — from what it can do to the risks it carries, through to the possible solutions.'
				: 'Un atelier collaboratif autour d’un jeu de cartes pour se faire une vision d’ensemble de l’intelligence artificielle, de ses capacités à ses risques, jusqu’aux solutions possibles.'}
		</p>
		<p class="hero-action">
			<Button href={SITE} target="_blank" rel="noopener noreferrer">
				{isEn ? 'Discover the Fresk' : 'Découvrir la Fresque'}
			</Button>
		</p>
	</header>
</div>

<!-- Bandeau panoramique, pleine largeur : il sort de la colonne de contenu. -->
<div
	class="bandeau"
	role="img"
	aria-label={isEn
		? 'Photographs taken during AI Risks Fresk workshops.'
		: 'Photographies prises pendant des ateliers de la Fresque des risques de l’IA.'}
>
	<div class="ruban">
		{#each [...BANDE, ...BANDE] as src}
			<img {src} alt="" loading="lazy" />
		{/each}
	</div>
</div>

<div class="page">
	<section class="atelier">
		<div class="prose">
			<p>
				{isEn
					? 'Each workshop brings together two to eight participants. They are handed cards standing for key concepts, connect them with arrows and talk them through. Little by little the fresk takes shape: it starts from what AI is and what it can do, passes through current and existential risks, and ends with the solutions.'
					: 'Chaque atelier réunit deux à huit participants. Ils reçoivent des cartes représentant des concepts clés, les relient par des flèches et en discutent. Peu à peu, la fresque prend forme : elle part de ce qu’est l’IA et de ce qu’elle sait faire, passe par les risques actuels et existentiels, et aboutit aux solutions.'}
			</p>
			<p>
				{isEn
					? 'The workshop needs no prior knowledge. Everything is on the cards: nobody has to be an expert, not even the facilitator. It runs around a table or online, on a shared board. The deck is free, openly licensed and ready to print.'
					: 'L’atelier ne demande aucun prérequis. Toutes les informations sont sur les cartes : personne n’a besoin d’être expert, pas même l’animateur. Il a lieu autour d’une table ou en ligne, sur un tableau partagé. Le jeu de cartes est gratuit, en licence libre et prêt à imprimer.'}
			</p>
		</div>

		<div class="visuel">
			<div class="pile">
				{#each CARTES as carte, i}
					<button
						type="button"
						class="carte carte-{i}"
						class:ouverte={retournee === i}
						aria-pressed={retournee === i}
						on:click={() => retourner(i)}
					>
						<span class="face recto">
							<img src={carte.recto} alt="" loading="lazy" />
						</span>
						<span class="face verso">
							<img src={carte.verso} alt="" loading="lazy" />
						</span>
						<span class="sr">
							{isEn
								? `“${carte.en}” card — flip to read the back`
								: `Carte « ${carte.fr} » — retourner pour lire le verso`}
						</span>
					</button>
				{/each}
			</div>
			<p class="legende">
				{isEn
					? 'Three of the 39 cards. Click one to read its back.'
					: 'Trois des 39 cartes. Cliquez une carte pour lire son verso.'}
			</p>
		</div>
	</section>

	<section class="rejoindre">
		<SectionTitle>
			{isEn ? 'Attend or run a workshop' : 'Participer ou animer un atelier'}
		</SectionTitle>
		<p class="intro">
			{#if isEn}
				Anyone can join or run a workshop <strong>near them</strong> or
				<strong>online</strong>.
			{:else}
				Chacun peut rejoindre ou animer un atelier <strong>près de chez soi</strong> ou
				<strong>en ligne</strong>.
			{/if}
		</p>

		<div class="duo">
			<Card variant="plain" class="carte-participer">
				<h3>{isEn ? 'Attend' : 'Participer'}</h3>
				<p>
					{isEn
						? 'Scheduled workshops, online as well as in person, are listed on the Fresk website. Pick the one that suits you and sign up. You then get all the details by e-mail.'
						: 'Les ateliers programmés, en ligne comme en présentiel, sont listés sur le site de la Fresque. Il suffit de choisir celui qui vous convient et de vous inscrire. Vous recevez ensuite toutes les informations par e-mail.'}
				</p>
				<p class="action">
					<Button href="{SITE}/participer/" target="_blank" rel="noopener noreferrer" alt>
						{isEn ? 'See the workshops' : 'Voir les ateliers'}
					</Button>
				</p>
			</Card>

			<Card variant="plain" class="carte-animer">
				<h3>{isEn ? 'Facilitate' : 'Animer'}</h3>
				<p>
					{isEn
						? 'Everything you need to facilitate is freely available: the facilitation guide, the deck of cards and the online tool. You can schedule your workshop directly on the website. In public mode it appears in the list of workshops and anyone can sign up. In private mode, only the people you send the link to can take part.'
						: 'Tout le nécessaire pour animer est en accès libre : le guide d’animation, le jeu de cartes et l’outil en ligne. Vous pouvez programmer votre atelier directement sur le site. En mode public, il apparaît dans la liste des ateliers et chacun peut s’y inscrire. En mode privé, seules les personnes à qui vous transmettez le lien y ont accès.'}
				</p>
				<p class="action">
					<Button href="{SITE}/devenir-animateur/" target="_blank" rel="noopener noreferrer">
						{isEn ? 'Become a facilitator' : 'Devenir animateur·ice'}
					</Button>
				</p>
			</Card>
		</div>
	</section>

	<section class="interet">
		<Card variant="plain" class="bande-formulaire">
			<h3>
				{isEn
					? 'Interested in the project, for yourself or for your organisation?'
					: 'Le projet vous intéresse, à titre personnel ou pour votre association ?'}
			</h3>
			<p class="intro">
				{isEn ? 'Tell us about your interest.' : 'Faites-nous part de votre intérêt.'}
			</p>
			<form on:submit|preventDefault={envoyer}>
				<div class="champs">
					<label>
						{isEn ? 'First name' : 'Prénom'}
						<input type="text" bind:value={prenom} autocomplete="given-name" maxlength="80" />
					</label>
					<label>
						{isEn ? 'Last name' : 'Nom'}
						<input type="text" bind:value={nom} autocomplete="family-name" maxlength="80" />
					</label>
				</div>
				<label class="plein">
					{isEn ? 'E-mail' : 'E-mail'}
					<input
						type="email"
						bind:value={email}
						autocomplete="email"
						maxlength="160"
						required
						placeholder={isEn ? 'you@example.org' : 'vous@exemple.fr'}
					/>
				</label>
				<fieldset>
					<legend>{isEn ? 'You are writing' : 'Vous écrivez'}</legend>
					<label class="radio">
						<input type="radio" bind:group={pour} value="personnel" />
						{isEn ? 'for myself' : 'à titre personnel'}
					</label>
					<label class="radio">
						<input type="radio" bind:group={pour} value="structure" />
						{isEn ? 'for an organisation or a company' : 'pour une association ou une organisation'}
					</label>
				</fieldset>
				<Button type="submit" disabled={envoi}>
					{envoi
						? isEn
							? 'Sending…'
							: 'Envoi…'
						: isEn
							? 'Register my interest'
							: 'Faire part de mon intérêt'}
				</Button>
				{#if message}
					<p class="msg" class:err={erreur} role="status">{message}</p>
				{/if}
				<p class="rgpd">
					{isEn
						? 'You will also receive the Pause IA newsletter, which is how we reply. One-click unsubscribe in every message.'
						: 'Vous recevrez aussi la lettre d’information de Pause IA, par laquelle nous répondons. Désabonnement en un clic dans chaque message.'}
				</p>
			</form>
		</Card>
	</section>

	<footer class="credits">
		<p>
			{isEn
				? 'The Fresk is inspired by the Climate Fresk. It was built by the Pause IA volunteer team from the AI Safety Fresk shared by CeSIA. The cards are licensed CC BY-SA 4.0.'
				: 'La Fresque s’inspire de la Fresque du Climat. Elle a été construite par l’équipe bénévole de Pause IA à partir de la Fresque de la sécurité de l’IA, partagée par le CeSIA. Les cartes sont sous licence CC BY-SA 4.0.'}
		</p>
	</footer>
</div>

<style>
	/* `main` est un conteneur flex : sans largeur explicite, chaque bloc se
	   rétrécit à son contenu et `margin-inline: auto` le centre sur sa propre
	   largeur. Le hero se retrouvait décalé de 120 px par rapport au reste. */
	.page {
		inline-size: 100%;
		max-inline-size: var(--width-wide);
		margin-inline: auto;
		padding-inline: 1.5rem;
	}

	/* Échelle typographique reprise de `PageHero`. Le filet orange est placé
	   SOUS le titre, comme sur le croquis — la charte le met au-dessus, d'où le
	   hero écrit ici plutôt qu'une option ajoutée à la brique partagée. */
	.hero {
		margin-bottom: 2.5rem;
	}

	.hero h1 {
		margin: 0;
		font-size: clamp(2rem, 5.5vw, 3rem);
		line-height: 1.08;
		letter-spacing: -0.02em;
		color: var(--text);
	}

	.filet {
		display: block;
		inline-size: 3rem;
		block-size: 4px;
		border-radius: var(--radius-pill);
		background: var(--brand);
		margin-block: 1.1rem 0;
	}

	.lede {
		margin: 1rem 0 0;
		max-inline-size: var(--width-text);
		font-size: 1.1rem;
		line-height: 1.6;
		color: var(--text-2);
	}

	.hero-action {
		margin: 1.6rem 0 0;
	}

	/* --- Bandeau panoramique ------------------------------------------------
	   Même cadrage que la page d'accueil : vignettes 4/3, 5 px de gouttière,
	   rayon de carte. Le ruban contient deux fois la même suite et se déplace
	   de -50 % : la boucle est invisible. */
	.bandeau {
		/* Pleine largeur : le bandeau sort de la gouttière de `main`. Même
		   technique que le bandeau newsletter de l'accueil. */
		inline-size: 100vw;
		margin-inline: calc(50% - 50vw);
		overflow: hidden;
		margin-block: 0 3.5rem;
		block-size: clamp(9rem, 19vw, 15rem);
		background: var(--bg-subtle);
		border-block: 1px solid var(--border);
	}

	.ruban {
		display: flex;
		gap: 5px;
		block-size: 100%;
		inline-size: max-content;
		padding: 5px 0;
		animation: defile 150s linear infinite;
	}

	.ruban img {
		block-size: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		display: block;
		border-radius: var(--radius-sm);
		flex-shrink: 0;
	}

	@keyframes defile {
		from {
			transform: translateX(0);
		}

		to {
			transform: translateX(-50%);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.ruban {
			animation: none;
		}
	}

	/* --- L'atelier : texte et éventail de cartes ---------------------------- */
	.atelier {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 0.8fr);
		gap: 2.5rem;
		align-items: start;
		margin-bottom: 3.5rem;
	}

	.prose {
		max-inline-size: var(--width-text);
	}

	.prose p {
		margin: 0 0 1rem;
		color: var(--text-2);
		line-height: 1.7;
	}

	.prose p:last-child {
		margin-bottom: 0;
	}

	.legende {
		margin: 0.9rem 0 0;
		font-size: 0.88rem;
		color: var(--text-2);
		text-align: center;
	}

	/* Éventail repris du hero du site de la fresque, mais plus ouvert : avec
	   l'écartement d'origine, la carte du milieu recouvrait les trois quarts de
	   ses voisines, qui n'étaient donc cliquables que sur un quart de leur
	   surface — on visait une carte et c'est une autre qui se retournait.
	   La hauteur suit la largeur (aspect-ratio) : une hauteur fixe laissait les
	   cartes dépasser du bloc dès que la colonne se resserrait. */
	.pile {
		position: relative;
		aspect-ratio: 1.35 / 1;
	}

	.carte {
		position: absolute;
		top: 50%;
		left: 50%;
		inline-size: 66%;
		aspect-ratio: 1.41 / 1;
		padding: 0;
		border: 0;
		background: transparent;
		border-radius: var(--radius-sm);
		cursor: pointer;
		transition: translate 0.18s ease;
	}

	.face {
		position: absolute;
		inset: 0;
		border-radius: var(--radius-sm);
		overflow: hidden;
		box-shadow:
			0 2px 5px rgb(27 26 23 / 16%),
			0 14px 28px -10px rgb(27 26 23 / 35%);
		transition: opacity 0.3s ease;
	}

	.face img {
		position: absolute;
		inset: 0;
		inline-size: 100%;
		block-size: 100%;
		object-fit: cover;
	}

	.verso {
		opacity: 0;
	}

	.carte.ouverte .recto {
		opacity: 0;
	}

	.carte.ouverte .verso {
		opacity: 1;
	}

	/* L'éventail : la carte du milieu devant, les deux autres inclinées. Le
	   `rotate`/`translate` de l'éventail est porté par `transform`, et le
	   soulèvement au survol par `translate` — sinon le survol écrase
	   l'inclinaison. */
	.carte-0 {
		transform: translate(-50%, -50%) rotate(-9deg) translate(-36%, 9%);
		z-index: 1;
	}

	.carte-1 {
		transform: translate(-50%, -50%) translateY(-8%);
		z-index: 3;
	}

	.carte-2 {
		transform: translate(-50%, -50%) rotate(9deg) translate(36%, 9%);
		z-index: 2;
	}

	.carte:hover,
	.carte:focus-visible {
		translate: 0 -8px;
		z-index: 5;
	}

	.carte.ouverte {
		z-index: 5;
	}

	.sr {
		position: absolute;
		inline-size: 1px;
		block-size: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	/* --- Participer ou animer ---------------------------------------------- */
	.rejoindre {
		margin-bottom: 3.5rem;
	}

	.intro {
		margin: 0 0 1.8rem;
		max-inline-size: var(--width-text);
		color: var(--text-2);
		line-height: 1.7;
	}

	.duo {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
		gap: 1.5rem;
	}

	/* Le texte des deux cartes n'a pas la même longueur. Sans étirement, leurs
	   boutons se retrouvent à deux hauteurs différentes ; on les aligne en
	   poussant l'action en bas d'une carte de hauteur commune. */
	.duo :global(.ui-card) {
		display: flex;
		flex-direction: column;
	}

	.duo .action {
		margin-block-start: auto;
		padding-block-start: 1.3rem;
	}

	.duo h3,
	.interet h3 {
		margin: 0 0 0.7rem;
		font-size: 1.25rem;
		color: var(--text);
	}

	.duo p {
		margin: 0;
		color: var(--text-2);
		line-height: 1.65;
	}

	/* Ces règles viennent APRÈS `.duo h3` / `.duo p` à dessein : Svelte ajoute
	   sa classe de portée des deux côtés, les deux sélecteurs se retrouvent à
	   spécificité égale, et c'est l'ordre qui tranche. Placées plus haut, elles
	   étaient écrasées et le texte de la carte orange tombait à 3,4:1.

	   « Participer » est l'action principale : aplat orange. Le texte posé
	   dessus est `--on-brand`, jamais blanc — le blanc ne donne que 2,2:1 sur
	   cet orange, en dessous du seuil même pour les grands caractères. */
	.duo :global(.carte-participer) {
		background: var(--brand);
		border-color: var(--brand);
	}

	.duo :global(.carte-participer h3),
	.duo :global(.carte-participer p) {
		color: var(--on-brand);
	}

	/* « Animer » : même carte, en contour. */
	.duo :global(.carte-animer) {
		background: var(--bg-card);
		border-color: var(--brand);
		box-shadow: var(--shadow-card);
	}

	/* --- Formulaire d'intérêt ---------------------------------------------- */
	.interet {
		margin-bottom: 3.5rem;
	}

	/* Bande orange pâle du croquis. Le fond de page est déjà le crème
	   `--bg-subtle` : un `--brand-light` par-dessus serait invisible, d'où un
	   voile d'orange construit sur `--brand-rgb`, que la charte fournit
	   justement pour les `rgba()`. */
	.interet :global(.bande-formulaire) {
		max-inline-size: 48rem;
		margin-inline: auto;
		background: rgb(var(--brand-rgb) / 13%);
		border-color: transparent;
	}

	.interet .intro {
		margin-bottom: 1.4rem;
	}

	.interet form {
		display: grid;
		gap: 1.1rem;
		justify-items: start;
		max-inline-size: var(--width-text);
	}

	.champs {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
		gap: 1.1rem;
		inline-size: 100%;
	}

	/* `:not(.radio)` est nécessaire : `.interet label` l'emporte en spécificité
	   sur `.radio`, et les boutons radio se retrouvaient en grille, décalés
	   au-dessus de leur libellé. */
	.interet label:not(.radio) {
		display: grid;
		gap: 0.35rem;
		font-size: 0.92rem;
		font-weight: 600;
		color: var(--text);
	}

	.plein {
		inline-size: 100%;
	}

	.interet input[type='text'],
	.interet input[type='email'] {
		inline-size: 100%;
		min-block-size: 48px;
		padding: 0.6rem 0.8rem;
		font: inherit;
		font-weight: 400;
		color: var(--text);
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: var(--radius-sm);
	}

	.interet fieldset {
		margin: 0;
		padding: 0;
		border: 0;
	}

	.interet legend {
		padding: 0;
		margin-bottom: 0.4rem;
		font-size: 0.92rem;
		font-weight: 600;
		color: var(--text);
	}

	.radio {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin: 0.3rem 0;
		font-weight: 400;
		color: var(--text-2);
		cursor: pointer;
	}

	.msg {
		margin: 0;
		padding: 0.7rem 0.9rem;
		font-size: 0.95rem;
		color: var(--success);
		background: var(--success-bg);
		border: 1px solid var(--success-border);
		border-radius: var(--radius-sm);
	}

	.msg.err {
		color: var(--error);
		background: var(--error-bg);
		border-color: var(--error-border);
	}

	.rgpd {
		margin: 0;
		font-size: 0.85rem;
		line-height: 1.55;
		color: var(--text-2);
	}

	/* --- Crédits ----------------------------------------------------------- */
	.credits {
		max-inline-size: var(--width-text);
		padding-top: 1.6rem;
		margin-bottom: 3.5rem;
		border-top: 1px solid var(--border);
	}

	.credits p {
		margin: 0;
		font-size: 0.9rem;
		line-height: 1.6;
		color: var(--text-2);
	}

	@media (max-width: 820px) {
		.atelier {
			grid-template-columns: 1fr;
			gap: 2rem;
		}

		.pile {
			aspect-ratio: 1.78 / 1;
		}

		.carte {
			inline-size: 54%;
		}
	}
</style>
