<script lang="ts">
	import SupporterCard from '$components/WhoCard.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import FAQ from '$posts/qui-sommes-nous.md'

	const label_id = 'who-title'

	const supporters = [
		{
			name: 'Maxime Fournes',
			blurb: 'Cofondateur',
			image: 'membres/maxime.png',
			job: 'Ingénieur et chercheur en IA'
		},
		{
			name: 'Gilles Bréda',
			blurb: 'Cofondateur',
			image: 'membres/gilles.png',
			job: 'Musicien'
		},
		{
			name: 'Moïri',
			blurb: 'Référent Plateformes',
			image: 'membres/moiri.jpeg',
			job: 'Ingénieur informatique'
		},
		{
			name: 'Pierre',
			blurb: 'Référent Rédaction',
			image: 'membres/pierre.png',
			job: 'Archéologue et forgeron'
		},
		{
			name: 'Aurélia',
			blurb: 'Volontaire',
			image: 'membres/aurelia.jpg',
			job: "Professeur d'anglais en classe préparatoire"
		},
		{
			name: 'Salim',
			blurb: 'Volontaire',
			image: 'membres/salim.jpg',
			job: 'Etudiant en mathématiques'
		},
		{
			name: 'Shaïman',
			blurb: 'Volontaire',
			image: 'membres/shaiman.png',
			job: 'Vidéaste et podcasteur sur les enjeux de l’intelligence artificielle'
		},
		{
			name: 'Stélian',
			blurb: 'Volontaire',
			image: 'membres/stelian.jpg',
			job: 'Psychologue-psychothérapeute'
		},
		{
			name: 'Bahman',
			blurb: 'Volontaire',
			image: 'membres/bahman.jpeg',
			job: 'Psychologue cognitiviste'
		},
		{
			name: 'Damien',
			blurb: 'Volontaire',
			image: 'membres/damien.jpg',
			job: 'Ingénieur du son chez studiobreton.fr'
		},
		{
			name: 'Éloïse',
			blurb: 'Volontaire',
			image: 'membres/eloise.jpg',
			job: 'Chercheuse indépendante en sécurité de l\'IA'
		},
		{
			name: 'Emmanuel',
			blurb: 'Volontaire',
			image: 'membres/emmanuel.jpg',
			job: ''
		},
		{
			name: 'Karine',
			blurb: 'Volontaire',
			image: 'membres/karine.jpg',
			job: 'Hypnothérapeute et coach bien-être'
		},
		{
			name: 'Muriel',
			blurb: 'Volontaire',
			image: 'membres/muriel.jpg',
			job: 'Traductrice'
		},
		{
			name: 'Sandra',
			blurb: 'Volontaire',
			image: 'membres/sandra.jfif',
			job: 'Enseignante de littérature et autrice'
		},
		{
			name: 'Sandrine',
			blurb: 'Volontaire',
			image: 'membres/sandrine.jpg',
			job: 'Psychopédagogue'
		},
		{
			name: 'Jérémy',
			blurb: 'Volontaire',
			image: 'membres/jeremy.png',
			job: 'Chercheur en sécurité de l\'IA, Suboptimal IA'
		},
		{
			name: 'Mandelle',
			blurb: 'Volontaire',
			image: 'membres/Mandelle.jpg',
			job: 'Enseignante'
		},
		{
			name: 'Marilyn',
			blurb: 'Volontaire',
			image: 'membres/Marilyn.jpg',
			job: 'Cheffe de projet en communication digitale'
		}
	]

	const secondsPerLogo = 5
	$: animationDuration = secondsPerLogo * supporters.length
</script>

<section aria-labelledby={label_id}>
	<UnderlinedTitle id={label_id}>Qui sommes-nous ?</UnderlinedTitle>
	<FAQ />
	<div class="logos" style="--animation-duration: {animationDuration}s;">
		<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
		<div class="logo_items">
			{#each supporters as supporter}
				<SupporterCard
					name={supporter.name}
					blurb={supporter.blurb}
					image={supporter.image}
					job={supporter.job}
				/>
			{/each}
		</div>
	</div>
</section>

<style>
	@keyframes slides {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(calc(-100% - 1rem));
		}
	}

	.logos {
		display: flex;
		gap: 1rem;
	}

	.logo_items {
		display: grid;
		grid-template-columns: repeat(1, 1fr);
		gap: 2rem;
	}

	@media (min-width: 600px) {
		.logo_items {
			grid-template-columns: repeat(1, 1fr);
		}
	}
	@media (min-width: 768px) {
		.logo_items {
			grid-template-columns: repeat(2, 1fr);
		}
	}
	@media (min-width: 1024px) {
		.logo_items {
			grid-template-columns: repeat(4, 1fr);
		}
	}
	@media (min-width: 1280px) {
		.logo_items {
			grid-template-columns: repeat(5, 1fr);
		}
	}

	.logos:hover .logo_items {
		animation-play-state: paused;
	}
</style>
