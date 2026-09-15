<script lang="ts">
	import { goto } from '$app/navigation'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import Fly from '$components/Fly.svelte'
	import type { Lang } from '$lib/i18n'

	export let lang: Lang = 'fr'
	$: isEn = lang === 'en'
	$: prefix = lang === 'fr' ? '/fr' : '/en'

	const label_id = 'home-write-action-title'

	// Le code postal saisi ici est transmis à l'outil via ?cp= : le visiteur
	// arrive avec son député déjà identifié plutôt que sur un formulaire vide.
	// Les données des élus (1,3 Mo) ne sont pas chargées ici, c'est l'outil qui
	// résout le code postal.
	let codePostal = ''
	let error = false

	function submit() {
		const clean = codePostal.replace(/\s/g, '')
		if (!/^\d{5}$/.test(clean)) {
			error = true
			return
		}
		error = false
		void goto(`${prefix}/ecrire-a-mes-elus?cp=${clean}`)
	}
</script>

<!--
	Action permanente, et non campagne ponctuelle : écrire à ses élus reste
	l'action la plus rapide et la plus utile du site. Elle est donc posée
	au-dessus des campagnes du moment.

	Une seule voie proposée : écrire à ses élus est nettement plus utile que
	d'écrire à la presse, et un menu à deux entrées oblige à trancher avant
	d'agir. L'outil presse reste accessible par le menu « Agir » et depuis les
	pages campagne.

	L'argumentaire est repris du bloc « Pourquoi c'est important » d'EcrireOutil
	pour que les deux disent la même chose.
-->
<section class="write-action" aria-labelledby={label_id}>
	<Fly>
		<UnderlinedTitle id={label_id} as="h2">
			{isEn ? 'Write to my representatives' : 'Écrire à mes élus'}
		</UnderlinedTitle>
	</Fly>

	<div class="wa-grid">
		<div class="wa-main">
			<Fly>
				<p class="wa-why">
					{isEn
						? 'Unlike a petition, a personal email gets read, and a handful of them is often enough to put a topic on a committee’s agenda.'
						: 'Contrairement à une pétition, un email personnel est lu, et quelques-uns suffisent souvent à inscrire un sujet à l’ordre du jour d’une commission.'}
				</p>
			</Fly>

			<Fly>
				<form class="wa-form" on:submit|preventDefault={submit}>
					<div class="wa-field">
						<label for="wa-cp">
							{isEn ? 'Your postal code' : 'Votre code postal'}
						</label>
						<input
							id="wa-cp"
							type="text"
							inputmode="numeric"
							autocomplete="postal-code"
							maxlength="5"
							placeholder={isEn ? 'e.g. 75011' : 'ex. 75011'}
							bind:value={codePostal}
							on:input={() => (error = false)}
							aria-invalid={error}
							aria-describedby={error ? 'wa-cp-error' : undefined}
						/>
					</div>
					<button type="submit">
						{isEn ? 'See my representatives' : 'Voir mes élus'}
					</button>
				</form>
			</Fly>

			{#if error}
				<p class="wa-error" id="wa-cp-error" role="alert">
					{isEn
						? 'A French postal code has five digits (e.g. 75011).'
						: 'Un code postal français comporte cinq chiffres (ex. 75011).'}
				</p>
			{/if}
		</div>

		<div class="wa-media">
			<img
				src="/campaigns/960px-Palais_Bourbon.jpg"
				alt={isEn
					? 'The Palais Bourbon, seat of the French National Assembly'
					: 'Le Palais Bourbon, siège de l’Assemblée nationale'}
				loading="lazy"
				decoding="async"
			/>
		</div>
	</div>
</section>

<style>
	.write-action {
		margin: 1rem 0 2rem;
	}

	.wa-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 18rem;
		gap: 2rem;
		align-items: stretch;
	}

	/* La photo se cale sur la hauteur de la colonne de texte et ne l'augmente
	   jamais : c'est la colonne de gauche qui commande. */
	.wa-media {
		position: relative;
		min-block-size: 100%;
		border-radius: 12px;
		overflow: hidden;
		border: 1px solid var(--border);
	}

	.wa-media img {
		position: absolute;
		inset: 0;
		inline-size: 100%;
		block-size: 100%;
		object-fit: cover;
		display: block;
	}

	.wa-why {
		margin: 1.25rem 0 0;
		max-inline-size: 44rem;
		line-height: 1.65;
		text-align: left;
		color: var(--text-2);
	}

	.wa-form {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-end;
		gap: 0.75rem;
		margin-top: 1.25rem;
	}

	.wa-field {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.wa-field label {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--text-2);
	}

	.wa-field input {
		inline-size: 9rem;
		height: 48px;
		padding: 0 0.9rem;
		font-size: 1.05rem;
		font-family: var(--font-body);
		color: var(--text);
		background: var(--bg);
		border: 1px solid var(--border);
		border-radius: 0.625rem;
	}

	.wa-field input:focus-visible {
		outline: 0.25rem solid var(--btn-focus-border);
		outline-offset: 1px;
	}

	.wa-field input[aria-invalid='true'] {
		border-color: #c0392b;
	}

	.wa-form button {
		height: 48px;
		padding: 0 1.4rem;
		font-family: var(--font-body);
		font-weight: bold;
		color: var(--text);
		background-color: var(--btn-bg);
		border: none;
		border-radius: 0.625rem;
		cursor: pointer;
	}

	.wa-form button:hover {
		background-color: var(--btn-hover-bg);
	}

	.wa-form button:active {
		background-color: var(--btn-active-bg);
	}

	.wa-form button:focus-visible {
		outline: 0.25rem solid var(--btn-focus-border);
		outline-offset: 1px;
	}

	.wa-error {
		margin: 0.6rem 0 0;
		font-size: 0.9rem;
		color: #c0392b;
		text-align: left;
	}

	@media (max-width: 820px) {
		.wa-grid {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}

		/* Empilée, la photo est plafonnée pour ne pas allonger la page. */
		.wa-media {
			min-block-size: 0;
			block-size: 9rem;
		}
	}

	@media (max-width: 480px) {
		.wa-field,
		.wa-field input,
		.wa-form button {
			inline-size: 100%;
		}
	}
</style>
