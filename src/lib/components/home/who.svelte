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
			image: 'membres/clemence.jpeg'
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
			image: 'membres/aurelia.jpg',
			job: "Professeur d'anglais en classe préparatoire"
		},
		{
			name: 'Salim',
			image: 'membres/salim.jpg',
			job: 'Etudiant en mathématiques'
		},
		{
			name: 'Stélian',
			image: 'membres/stelian.jpg',
			job: 'Psychologue-psychothérapeute'
		},
		{
			name: 'Bahman',
			image: 'membres/bahman.jpeg',
			job: 'Psychologue cognitiviste'
		},
		{
			name: 'Damien',
			image: 'membres/damien.jpg',
			job: 'Ingénieur du son chez studiobreton.fr'
		},
		{
			name: 'Éloïse',
			image: 'membres/eloise.jpg',
			job: "Chercheuse indépendante en sécurité de l'IA"
		},
		{
			name: 'Emmanuel',
			image: 'membres/emmanuel.jpg',
			job: ''
		},
		{
			name: 'Karine',
			image: 'membres/karine.jpg',
			job: 'Hypnothérapeute et coach bien-être'
		},
		{
			name: 'Muriel',
			image: 'membres/muriel.jpg',
			job: 'Traductrice'
		},
		{
			name: 'Sandra',
			image: 'membres/sandra.jfif',
			job: 'Enseignante de littérature et autrice'
		},
		{
			name: 'Sandrine',
			image: 'membres/sandrine.jpg',
			job: 'Psychopédagogue'
		},
		{
			name: 'Mandelle',
			image: 'membres/Mandelle.jpg',
			job: 'Enseignante'
		},
		{
			name: 'Marilyn',
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

	<h2 class="section-title">Membres et bénévoles</h2>
	<div class="cards-grid members-grid">
		{#each members as supporter}
			<SupporterCard
				name={supporter.name}
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
		margin-top: 2.5rem;
		padding: 1rem 2rem;
		font-size: 1.3rem;
		font-weight: 600;
		color: var(--text-primary, #333);
		text-align: center;
		background: linear-gradient(135deg, #f0f0f0 0%, #e8e8e8 100%);
		border-radius: 0.5rem;
	}
</style>
