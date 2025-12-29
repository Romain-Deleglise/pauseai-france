<script lang="ts">
	import LeadershipCard from '$components/LeadershipCard.svelte'
	import ScientificCouncilCard from '$components/ScientificCouncilCard.svelte'
	import SupporterCard from '$components/WhoCard.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import FAQ from '$posts/qui-sommes-nous.md'

	const label_id = 'who-title'

	const leadership = [
		{
			name: 'Maxime Fournes',
			role: 'Co-fondateur et Président',
			image: 'membres/maxime.png'
		},
		{
			name: 'Gilles Bréda',
			role: 'Co-fondateur et Trésorier',
			image: 'membres/gilles.png'
		},
		{
			name: 'Clémence Peyrot',
			role: 'Directrice exécutive',
			image: null
		},
		{
			name: 'Moïri',
			role: 'Secrétaire général',
			image: 'membres/moiri.jpeg'
		},
		{
			name: 'Pierre Lamotte',
			role: "Conseil d'administration et Responsable communication",
			image: 'membres/pierre.png'
		},
		{
			name: 'Romain',
			role: "Conseil d'administration et Responsable financement",
			image: null
		}
	]

	const scientificCouncil = [
		{
			name: 'Maxime Fournes',
			job: 'Ingénieur et chercheur en IA',
			image: 'membres/maxime.png'
		},
		{
			name: 'Jérémy Perret',
			job: "Chercheur en sécurité de l'IA, Suboptimal IA",
			image: 'membres/jeremy.png'
		}
	]

	const members = [
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
			job: "Chercheuse indépendante en sécurité de l'IA"
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
</script>

<section aria-labelledby={label_id}>
	<UnderlinedTitle id={label_id}>Qui sommes-nous ?</UnderlinedTitle>
	<FAQ />

	<h2 class="section-title">Direction</h2>
	<div class="cards-grid leadership-grid">
		{#each leadership as leader}
			<LeadershipCard name={leader.name} role={leader.role} image={leader.image} />
		{/each}
	</div>

	<h2 class="section-title">Conseil scientifique</h2>
	<div class="cards-grid council-grid">
		{#each scientificCouncil as scientist}
			<ScientificCouncilCard name={scientist.name} job={scientist.job} image={scientist.image} />
		{/each}
	</div>

	<h2 class="section-title">Membres bénévoles</h2>
	<div class="cards-grid members-grid">
		{#each members as supporter}
			<SupporterCard
				name={supporter.name}
				blurb={supporter.blurb}
				image={supporter.image}
				job={supporter.job}
			/>
		{/each}
	</div>

	<p class="member-count">+ une centaine de membres et bénévoles</p>
</section>

<style>
	.section-title {
		margin-top: 3rem;
		margin-bottom: 1.5rem;
		font-size: 1.5rem;
		font-weight: 600;
	}

	.cards-grid {
		display: grid;
		gap: 2rem;
	}

	.leadership-grid {
		grid-template-columns: repeat(1, 1fr);
	}

	.council-grid {
		grid-template-columns: repeat(1, 1fr);
	}

	.members-grid {
		grid-template-columns: repeat(1, 1fr);
	}

	@media (min-width: 600px) {
		.leadership-grid {
			grid-template-columns: repeat(2, 1fr);
		}
		.council-grid {
			grid-template-columns: repeat(2, 1fr);
		}
		.members-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (min-width: 768px) {
		.leadership-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (min-width: 1024px) {
		.leadership-grid {
			grid-template-columns: repeat(3, 1fr);
		}
		.council-grid {
			grid-template-columns: repeat(2, 1fr);
		}
		.members-grid {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	@media (min-width: 1280px) {
		.leadership-grid {
			grid-template-columns: repeat(3, 1fr);
		}
		.members-grid {
			grid-template-columns: repeat(5, 1fr);
		}
	}

	.member-count {
		margin-top: 2rem;
		font-size: 1.1rem;
		font-style: italic;
		color: var(--text-secondary, #666);
		text-align: center;
	}
</style>
