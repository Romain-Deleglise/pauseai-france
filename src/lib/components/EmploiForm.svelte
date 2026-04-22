<script lang="ts">
	import type { Lang } from '$lib/i18n'
	import { getT } from '$lib/i18n'

	export let lang: Lang = 'fr'

	$: t = getT(lang)
</script>

<a href="/{lang}/emploi-ia/questionnaire" title={t.emploi_ia.survey_card_title_attr}>
	<span class="card-title">{t.emploi_ia.survey_card_title}</span>
	<span class="card-text">{t.emploi_ia.survey_card_text}</span>
	<span class="card-arrow" aria-hidden="true">→</span>
</a>

<style>
	a {
		display: flex;
		align-items: center;
		gap: 1rem;
		background-color: var(--brand, #ff9416);
		text-decoration: none;
		padding: 1rem 1.25rem;
		border-radius: 10px;
		margin: 1.5rem 0;
		transition: background 0.2s;
	}

	a:hover {
		background-color: var(--brand-subtle, #c96900);
	}

	.card-title {
		font-weight: 700;
		color: white;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.card-text {
		font-size: 0.9rem;
		color: rgba(255, 255, 255, 0.88);
		line-height: 1.3;
	}

	.card-arrow {
		margin-left: auto;
		font-size: 1.2rem;
		color: white;
		flex-shrink: 0;
	}

	@media (max-width: 540px) {
		a {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.4rem;
		}

		.card-arrow {
			margin-left: 0;
			align-self: flex-end;
		}
	}
</style>
