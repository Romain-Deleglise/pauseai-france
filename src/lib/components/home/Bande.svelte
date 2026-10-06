<script lang="ts">
	/**
	 * Bande thématique de la page d'accueil : « Agir » puis « S'informer ».
	 *
	 * La page empilait neuf blocs de poids égal, sans hiérarchie. Le but est de
	 * créer deux territoires — et c'est LE CHANGEMENT DE FOND qui le fait, pas
	 * un en-tête de plus.
	 *
	 * Première version essayée : un gros titre avec filet de marque et un chapô.
	 * Mauvaise idée. Le chapô répétait presque mot pour mot le sous-titre du
	 * bloc situé trois lignes plus bas (« Interpellez, écrivez, témoignez :
	 * chaque action compte »), et le filet entrait en concurrence avec le
	 * sur-titre orange juste en dessous. Deux couches de titres pour une seule
	 * information : la page en devenait illisible.
	 *
	 * D'où un simple repère : un mot, en petit, qui nomme le territoire sans
	 * prétendre introduire ce qui suit. Les blocs s'introduisent déjà eux-mêmes.
	 */
	export let titre: string
	/** `creme` teinte la bande ; `aucun` la laisse sur le fond de page. */
	export let fond: 'creme' | 'aucun' = 'aucun'

	const id = `bande-${Math.random().toString(36).slice(2, 8)}`
</script>

<section class="bande {fond}" aria-labelledby={id}>
	<h2 {id} class="repere">{titre}</h2>
	<slot />
</section>

<style>
	/* La bande garde la LARGEUR NORMALE d'une section et peint son fond d'un
	   bord à l'autre avec un pseudo-élément. Faite en `inline-size: 100vw`, ses
	   enfants calculaient leur propre pleine largeur par rapport à elle et non à
	   la colonne : leur texte se retrouvait coupé hors écran. */
	.bande {
		position: relative;
		padding-block: 3rem;
	}

	/* z-index 0 et non -1 : à -1 le fond passait derrière le conteneur de page,
	   qui est opaque, et devenait invisible. Les enfants remontent d'un cran. */
	.bande.creme::before {
		content: '';
		position: absolute;
		z-index: 0;
		inset-block: 0;
		inset-inline-start: calc(50% - 50vw);
		inline-size: 100vw;
		background: var(--bg-subtle);
	}

	.bande > :global(*) {
		position: relative;
		z-index: 1;
	}

	/* app.css donne 5 rem — 10 rem en large — à toute `section`, y compris à la
	   bande et à chacun de ses enfants : un trou entre les deux bandes, et des
	   blocs trop espacés pour se lire comme un groupe. La bande gère son rythme. */
	.bande:not(:last-child) {
		margin-block-end: 0;
	}

	.bande :global(section:not(:last-child)) {
		margin-block-end: 2.5rem;
	}

	/* Un repère, pas un titre. Première tentative : petit, orange, en capitales —
	   exactement la forme du sur-titre que portent déjà les blocs à l'intérieur
	   (« CE QUE VOUS POUVEZ FAIRE DE PLUS UTILE… »). Deux libellés identiques à
	   quarante pixels d'écart : la page bégayait. Le repère prend donc une autre
	   forme — un trait de marque suivi du mot, en encre courante — pour se
	   distinguer sans peser. */
	.repere {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		margin: 0 0 1.75rem;
		font-size: 1.05rem;
		font-weight: 700;
		letter-spacing: 0;
		text-transform: none;
		color: var(--text);
	}

	.repere::before {
		content: '';
		inline-size: 1.75rem;
		block-size: 3px;
		border-radius: var(--radius-pill);
		background: var(--brand);
	}

	@media (max-width: 600px) {
		.bande {
			padding-block: 2rem;
		}

		.repere {
			margin-block-end: 1.25rem;
		}
	}
</style>
