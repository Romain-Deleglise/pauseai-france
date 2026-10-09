<script lang="ts">
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'

	/**
	 * Bande thématique de la page d'accueil : « Agir » puis « S'informer ».
	 *
	 * La page empilait neuf blocs de poids égal, sans hiérarchie. Le but est de
	 * créer deux territoires, et c'est LE CHANGEMENT DE FOND qui le fait.
	 *
	 * Le titre reprend exactement la forme du titre de la F.A.Q.
	 * (UnderlinedTitle) : ce sont les trois repères de même niveau de la page,
	 * ils doivent se ressembler. Les blocs internes sont passés en h3, donc la
	 * hiérarchie visuelle et la hiérarchie du document disent la même chose.
	 */
	export let titre: string
	/** `creme` teinte la bande ; `aucun` la laisse sur le fond de page. */
	export let fond: 'creme' | 'aucun' = 'aucun'

	const id = `bande-${Math.random().toString(36).slice(2, 8)}`
</script>

<section class="bande {fond}" aria-labelledby={id}>
	<UnderlinedTitle {id}>{titre}</UnderlinedTitle>
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

	/* Sur le crème, les cartes se détachaient beaucoup moins bien que sur le
	   blanc, et le ressenti était juste : ce n'est pas le texte qui perd (noir
	   sur crème : 19,5:1 contre 21:1 sur blanc, imperceptible), c'est le CONTOUR
	   des cartes. --border vaut #e5e7eb, un gris froid : 1,24:1 sur blanc, et
	   seulement 1,15:1 sur le crème, où il jure en plus avec la teinte chaude.
	   Résultat : des cartes blanches sur crème sans arête nette, donc une
	   section qui paraît plate.

	   La bande redéfinit donc le trait et l'ombre pour ses enfants, qui les
	   consomment déjà par var(). Le trait est dérivé de l'encre et du fond :
	   il reste neutre, prend la chaleur du crème, et se recalcule tout seul en
	   thème sombre. Mesuré : 1,52:1 contre la bande et 1,64:1 contre la carte,
	   au lieu de 1,15:1. */
	.bande.creme {
		--border: color-mix(in srgb, var(--text) 18%, var(--bg-subtle));
		--shadow-card: 0 4px 18px rgba(var(--ink-rgb), 0.07);
		--shadow-raised: 0 8px 26px rgba(var(--ink-rgb), 0.1);
		/* Un panneau orange pâle sur du crème ne se voit pas : sur cette bande,
		   les panneaux d'accent passent au blanc. Sur la bande blanche ils
		   gardent leur orange pâle, qui y ressort très bien. */
		--panneau-bg: var(--bg);
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

	/* app.css donne 5 rem (10 rem en large) à toute `section`, y compris à la
	   bande et à chacun de ses enfants : un trou entre les deux bandes, et des
	   blocs trop espacés pour se lire comme un groupe. La bande gère son rythme. */
	.bande:not(:last-child) {
		margin-block-end: 0;
	}

	.bande :global(section:not(:last-child)) {
		margin-block-end: 2.5rem;
	}

	@media (max-width: 600px) {
		.bande {
			padding-block: 2rem;
		}
	}
</style>
