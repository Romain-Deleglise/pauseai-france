<script lang="ts">
	import { Landmark, Newspaper } from 'lucide-svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import Fly from '$components/Fly.svelte'
	import type { Lang } from '$lib/i18n'

	export let lang: Lang = 'fr'
	$: isEn = lang === 'en'
	$: prefix = lang === 'fr' ? '/fr' : '/en'

	const label_id = 'home-write-action-title'
</script>

<!--
	Action permanente, et non campagne ponctuelle : écrire à ses élus et à la
	presse reste l'action la plus rapide et la plus utile du site. Elle est donc
	posée au-dessus des campagnes du moment.

	La section suit la même charpente que les autres sections de l'accueil
	(UnderlinedTitle + sous-titre + Fly) : pas d'encadré de couleur, qui ferait
	doublon visuel avec le bloc « groupes locaux » juste en dessous.
-->
<section class="write-action" aria-labelledby={label_id}>
	<Fly>
		<UnderlinedTitle id={label_id} as="h2">
			{isEn ? 'Write to your representatives and the press' : 'Écrivez à vos élus et à la presse'}
		</UnderlinedTitle>
	</Fly>
	<Fly>
		<p class="subtitle">
			{isEn
				? 'We find your MP, or the right newsroom, and draft the email. You read it over and send it from your own inbox. About two minutes.'
				: 'On trouve votre député ou le bon journaliste, et on prépare le brouillon. Vous relisez, vous envoyez depuis votre messagerie. Comptez deux minutes.'}
		</p>
	</Fly>

	<Fly>
		<div class="wa-links">
			<a class="wa-card" href="{prefix}/ecrire-a-mes-elus">
				<span class="wa-icon"><Landmark size="1.3rem" aria-hidden="true" /></span>
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
				<span class="wa-icon"><Newspaper size="1.3rem" aria-hidden="true" /></span>
				<span class="wa-text">
					<span class="wa-title">{isEn ? 'Write to the press' : 'Écrire à la presse'}</span>
					<span class="wa-sub">
						{isEn
							? 'A newsroom covers what its readers ask it to cover.'
							: 'Une rédaction couvre ce que ses lecteurs lui demandent de couvrir.'}
					</span>
				</span>
			</a>
		</div>
	</Fly>
</section>

<style>
	.write-action {
		margin: 1rem 0 2rem;
	}

	/* Repris à l'identique de la section « campagnes » pour que les deux
	   sous-titres s'alignent. */
	.subtitle {
		font-size: 1.05rem;
		line-height: 1.6;
		color: var(--text-2);
		max-width: 42rem;
		margin: 0.5rem 0 2rem;
	}

	.wa-links {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr));
		gap: 1.25rem;
	}

	.wa-card {
		display: flex;
		align-items: flex-start;
		gap: 0.85rem;
		padding: 1.35rem 1.4rem;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: 14px;
		text-decoration: none;
		color: inherit;
		transition:
			border-color 0.15s ease,
			box-shadow 0.15s ease;
	}

	.wa-card:hover,
	.wa-card:focus-visible {
		border-color: var(--brand);
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
	}

	.wa-icon {
		flex: none;
		display: grid;
		place-items: center;
		inline-size: 2.4rem;
		block-size: 2.4rem;
		border-radius: 50%;
		background: color-mix(in srgb, var(--brand) 16%, transparent);
		color: var(--brand);
	}

	.wa-text {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
	}

	.wa-title {
		font-weight: 700;
		line-height: 1.3;
	}

	.wa-sub {
		font-size: 0.92rem;
		line-height: 1.55;
		color: var(--text-2);
	}
</style>
