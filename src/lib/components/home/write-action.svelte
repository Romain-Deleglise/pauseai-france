<script lang="ts">
	import { Landmark, Newspaper, Clock } from 'lucide-svelte'
	import type { Lang } from '$lib/i18n'

	export let lang: Lang = 'fr'
	$: isEn = lang === 'en'
	$: prefix = lang === 'fr' ? '/fr' : '/en'
</script>

<!--
	Action permanente, et non campagne ponctuelle : écrire à ses élus et à la
	presse reste l'action la plus rapide et la plus utile du site. Elle est donc
	posée au-dessus des campagnes du moment, dans un bloc à elle qui ne reprend
	pas le vocabulaire visuel des cartes de campagne (pas d'échéance, pas de
	badge « campagne en cours »).
-->
<section class="write-action" aria-labelledby="write-action-title">
	<div class="wa-head">
		<p class="wa-kicker">
			<Clock size="0.95em" aria-hidden="true" />
			{isEn ? 'Two minutes, from your own inbox' : 'Deux minutes, depuis votre boîte mail'}
		</p>
		<h2 id="write-action-title">
			{isEn ? 'Write to your representatives and the press' : 'Écrivez à vos élus et à la presse'}
		</h2>
		<p class="wa-lede">
			{isEn
				? 'The fastest way to weigh in. Our tool finds your representative or the newspaper you read, and writes the email for you — you personalise it and send it from your own mailbox.'
				: 'Le moyen le plus rapide de peser. Notre outil identifie votre élu·e ou le journal que vous lisez, et rédige l’email à votre place : vous le personnalisez et l’envoyez depuis votre propre messagerie.'}
		</p>
	</div>

	<div class="wa-links">
		<a class="wa-card" href="{prefix}/ecrire-a-mes-elus">
			<span class="wa-icon"><Landmark size="1.35rem" aria-hidden="true" /></span>
			<span class="wa-text">
				<span class="wa-title">{isEn ? 'Write to my MP' : 'Écrire à mes élu·e·s'}</span>
				<span class="wa-sub">
					{isEn
						? 'An email from a real constituent carries far more weight than a petition.'
						: 'Un email d’un vrai électeur pèse bien plus lourd qu’une pétition.'}
				</span>
			</span>
		</a>

		<a class="wa-card" href="{prefix}/ecrire-a-mes-elus?action=medias">
			<span class="wa-icon"><Newspaper size="1.35rem" aria-hidden="true" /></span>
			<span class="wa-text">
				<span class="wa-title">{isEn ? 'Write to the press' : 'Écrire à la presse'}</span>
				<span class="wa-sub">
					{isEn
						? 'Newsrooms cover what their readers ask for. Ask yours.'
						: 'Les rédactions couvrent ce que leurs lecteurs réclament. Réclamez.'}
				</span>
			</span>
		</a>
	</div>
</section>

<style>
	.write-action {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding: 2rem 1.75rem;
		margin: 0 0 2rem;
		background: color-mix(in srgb, var(--brand) 12%, var(--bg));
		border: 1px solid color-mix(in srgb, var(--brand) 35%, transparent);
		border-radius: 1.25rem;
	}

	.wa-head {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.wa-kicker {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		margin: 0;
		font-size: 0.85rem;
		font-weight: 700;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--brand-subtle, var(--brand));
	}

	.write-action h2 {
		margin: 0;
		font-size: clamp(1.5rem, 3.5vw, 2rem);
		line-height: 1.15;
	}

	.wa-lede {
		margin: 0;
		max-inline-size: 44rem;
		line-height: 1.65;
		text-align: left;
		color: var(--text-2);
	}

	.wa-links {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
		gap: 1rem;
	}

	.wa-card {
		display: flex;
		align-items: flex-start;
		gap: 0.85rem;
		padding: 1.1rem 1.2rem;
		background: var(--bg);
		border: 1px solid color-mix(in srgb, var(--brand) 30%, transparent);
		border-radius: 0.9rem;
		text-decoration: none;
		color: inherit;
		transition:
			border-color 0.15s ease,
			transform 0.15s ease;
	}

	.wa-card:hover,
	.wa-card:focus-visible {
		border-color: var(--brand);
		transform: translateY(-2px);
	}

	.wa-icon {
		flex: none;
		display: grid;
		place-items: center;
		inline-size: 2.5rem;
		block-size: 2.5rem;
		border-radius: 50%;
		background: color-mix(in srgb, var(--brand) 16%, transparent);
		color: var(--brand);
	}

	.wa-text {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.wa-title {
		font-weight: 700;
		line-height: 1.3;
	}

	.wa-sub {
		font-size: 0.9rem;
		line-height: 1.5;
		color: var(--text-2);
	}

	@media (max-width: 600px) {
		.write-action {
			padding: 1.5rem 1.15rem;
			gap: 1.25rem;
		}
	}
</style>
