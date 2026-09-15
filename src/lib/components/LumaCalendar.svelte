<script lang="ts">
	import { theme } from '$lib/stores/theme'

	/** Identifiant du calendrier Luma, visible dans l’URL d’embed (cal-...). */
	export let calendarId: string
	export let title = 'Calendrier des événements'
	/** Hauteur de l’iframe. Luma gère son propre défilement interne. */
	export let height = '400px'
	/**
	 * Replie le calendrier derrière un résumé cliquable. Utile quand l’embed
	 * s’insère dans une liste d’actions : il ne mange alors qu’une ligne tant
	 * que le visiteur ne l’ouvre pas.
	 */
	export let collapsible = false
	/** Libellé du résumé quand `collapsible` est actif. */
	export let summary = 'Voir les prochaines dates'
	/** Ouvre le calendrier dès l’arrivée sur la page (avec `collapsible`). */
	export let open = false

	// Luma choisit son thème via ?lt=light|dark : on le cale sur celui du site
	// pour éviter un bloc blanc au milieu d’une page sombre. Changer l’URL suffit
	// à recharger l’iframe au basculement de thème.
	$: src = `https://luma.com/embed/calendar/${calendarId}/events?lt=${$theme === 'dark' ? 'dark' : 'light'}`
</script>

{#if collapsible}
	<details class="luma-details" {open}>
		<summary>{summary}</summary>
		<div class="luma" style:--luma-height={height}>
			<iframe {src} {title} frameborder="0" allowfullscreen loading="lazy"></iframe>
		</div>
	</details>
{:else}
	<div class="luma" style:--luma-height={height}>
		<iframe {src} {title} frameborder="0" allowfullscreen loading="lazy"></iframe>
	</div>
{/if}

<style>
	.luma {
		/* L’embed Luma est fourni en 600px de large : on le laisse s’étirer
		   jusqu’à la largeur du conteneur pour qu’il tienne sur mobile. */
		inline-size: 100%;
		max-inline-size: 600px;
	}

	.luma iframe {
		display: block;
		inline-size: 100%;
		block-size: var(--luma-height, 400px);
		border: 1px solid #bfcbda88;
		border-radius: 4px;
	}

	.luma-details summary {
		cursor: pointer;
		font-weight: 600;
		padding: 0.4rem 0;
	}

	.luma-details[open] summary {
		margin-bottom: 0.75rem;
	}
</style>
