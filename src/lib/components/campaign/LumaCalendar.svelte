<script lang="ts">
	import { theme } from '$lib/stores/theme'

	/**
	 * Identifiant du calendrier Luma, visible dans l'URL d'intégration :
	 * https://luma.com/embed/calendar/<calendarId>/events
	 * ex. « cal-5ZNtr1GO7aUSyiY »
	 */
	export let calendarId: string
	/** Titre accessible de l'iframe. */
	export let title = 'Calendrier des événements Pause IA'
	/** Hauteur en pixels sur desktop. */
	export let height = 560
	/** Hauteur en pixels sur mobile. */
	export let mobileHeight = 620
	/** Lien « Voir tous les événements » affiché sous le calendrier. */
	export let calendarUrl = ''
	/** Libellé de ce lien. */
	export let calendarLinkLabel = 'Voir tous les événements sur Luma'
	/**
	 * Replie le calendrier derrière un résumé cliquable. Utile quand l'embed
	 * s'insère dans une liste d'actions : il ne prend alors qu'une ligne tant
	 * que le visiteur ne l'ouvre pas.
	 */
	export let collapsible = false
	/** Libellé du résumé quand `collapsible` est actif. */
	export let summary = 'Voir les prochaines dates'
	/** Ouvre le calendrier dès l'arrivée sur la page (avec `collapsible`). */
	export let open = false

	// Luma expose un paramètre `lt` (light/dark) : on le synchronise avec le
	// thème du site pour que l'embed ne reste pas blanc en mode sombre.
	$: src = `https://luma.com/embed/calendar/${calendarId}/events?lt=${$theme === 'dark' ? 'dark' : 'light'}`
</script>

{#if collapsible}
	<details class="luma-details" {open}>
		<summary>{summary}</summary>
		<div class="luma" style="--luma-h: {height}px; --luma-h-mobile: {mobileHeight}px;">
			{#key src}
				<iframe {src} {title} loading="lazy" allowfullscreen></iframe>
			{/key}
		</div>
		{#if calendarUrl}
			<p class="luma-link">
				<a href={calendarUrl} target="_blank" rel="noopener noreferrer">{calendarLinkLabel} ↗</a>
			</p>
		{/if}
	</details>
{:else}
	<div class="luma" style="--luma-h: {height}px; --luma-h-mobile: {mobileHeight}px;">
		{#key src}
			<iframe {src} {title} loading="lazy" allowfullscreen></iframe>
		{/key}
	</div>

	{#if calendarUrl}
		<p class="luma-link">
			<a href={calendarUrl} target="_blank" rel="noopener noreferrer">{calendarLinkLabel} ↗</a>
		</p>
	{/if}
{/if}

<style>
	.luma {
		border: 1px solid var(--border);
		border-radius: 12px;
		overflow: hidden;
		background: var(--bg);
	}

	iframe {
		display: block;
		width: 100%;
		height: var(--luma-h);
		border: 0;
	}

	.luma-link {
		margin: 0.85rem 0 0;
		text-align: left;
		font-size: 0.95rem;
	}

	.luma-link a {
		color: var(--brand-subtle);
		font-weight: 600;
	}

	.luma-details summary {
		cursor: pointer;
		font-weight: 600;
		padding: 0.4rem 0;
		color: var(--brand-subtle);
	}

	.luma-details[open] summary {
		margin-bottom: 0.85rem;
	}

	@media (max-width: 600px) {
		iframe {
			height: var(--luma-h-mobile);
		}
	}
</style>
