<script lang="ts">
	import LeadershipCard from '$components/LeadershipCard.svelte'
	import ScientificCouncilCard from '$components/ScientificCouncilCard.svelte'
	import WhoCard from '$components/WhoCard.svelte'
	import Button from '$components/Button.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import FAQ from '$posts/qui-sommes-nous.md'
	import FAQEn from '$posts/en/qui-sommes-nous.md'
	import type { TeamMember } from '$lib/notion'
	import type { Lang } from '$lib/i18n'

	export let teamMembers: TeamMember[] = []
	export let lang: Lang = 'fr'

	const label_id = 'who-title'

	// Fallback data when Notion is not configured
	const fallbackLeadership = [
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

	const fallbackScientificCouncil = [
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

	const fallbackMembers = [
		{
			name: 'Aurélia',
			image: 'membres/aurelia.jpg',
			job: "Professeur d'anglais en classe préparatoire"
		},
		{
			name: 'Éloïse',
			image: 'membres/eloise.jpg',
			job: "Chercheuse indépendante en sécurité de l'IA"
		},
		{
			name: 'Salim',
			image: 'membres/salim.jpg',
			job: 'Etudiant en mathématiques'
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
			name: 'Stélian',
			image: 'membres/stelian.jpg',
			job: 'Psychologue-psychothérapeute'
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
			name: 'Bahman',
			image: 'membres/bahman.jpeg',
			job: 'Psychologue cognitiviste'
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
		},
		{
			name: 'Damien',
			image: 'membres/damien.jpg',
			job: 'Ingénieur du son chez studiobreton.fr'
		},
		{
			name: 'Emmanuel',
			image: 'membres/emmanuel.jpg',
			job: ''
		}
	]

	// Derive display data from Notion or fallback
	$: hasNotionData = teamMembers.length > 0

	$: leadership = hasNotionData
		? teamMembers
				.filter((m) => m.category === 'Direction')
				.map((m) => ({ name: m.name, role: m.role, image: m.image || null }))
		: fallbackLeadership

	$: scientificCouncil = hasNotionData
		? teamMembers
				.filter((m) => m.category === 'Conseil scientifique')
				.map((m) => ({ name: m.name, job: m.profession, image: m.image || null }))
		: fallbackScientificCouncil

	$: members = hasNotionData
		? teamMembers
				.filter((m) => m.category === 'Membre')
				.map((m) => ({ name: m.name, job: m.profession, image: m.image || null }))
		: fallbackMembers
</script>

<section aria-labelledby={label_id}>
	<UnderlinedTitle id={label_id}
		>{lang === 'en' ? 'Who are we?' : 'Qui sommes-nous ?'}</UnderlinedTitle
	>

	<div class="intro">
		{#if lang === 'en'}
			<FAQEn />
		{:else}
			<FAQ />
		{/if}
		<div class="contact-cta">
			<Button href="mailto:contact@pauseia.fr"
				>{lang === 'en' ? 'Contact us' : 'Nous contacter'}</Button
			>
		</div>
	</div>

	<div class="team-section">
		<h2 class="section-title">{lang === 'en' ? 'Leadership' : 'Direction'}</h2>
		<p class="section-description">
			{#if lang === 'en'}
				The board members who lead the association's strategy and operations.
			{:else}
				Les membres du bureau et du conseil d'administration qui pilotent la stratégie et les
				opérations de l'association.
			{/if}
		</p>
		<div class="cards-grid cards-centered">
			{#each leadership as leader}
				<LeadershipCard name={leader.name} role={leader.role} image={leader.image} />
			{/each}
		</div>
	</div>

	{#if scientificCouncil.length > 0}
		<div class="team-section">
			<h2 class="section-title">
				{lang === 'en' ? 'Scientific Council' : 'Conseil scientifique'}
			</h2>
			<p class="section-description">
				{#if lang === 'en'}
					Our experts who inform our positions on the technical and scientific issues of artificial
					intelligence.
				{:else}
					Nos experts qui éclairent nos positions sur les enjeux techniques et scientifiques de
					l'intelligence artificielle.
				{/if}
			</p>
			<div class="cards-grid cards-centered">
				{#each scientificCouncil as scientist}
					<ScientificCouncilCard
						name={scientist.name}
						job={scientist.job}
						image={scientist.image}
					/>
				{/each}
			</div>
		</div>
	{/if}

	{#if members.length > 0}
		<div class="team-section">
			<h2 class="section-title">
				{lang === 'en' ? 'Members & Volunteers' : 'Membres et bénévoles'}
			</h2>
			<p class="section-description">
				{#if lang === 'en'}
					The volunteers who bring the association to life every day through their skills and
					commitment.
				{:else}
					Les bénévoles qui font vivre l'association au quotidien à travers leurs compétences et
					leur engagement.
				{/if}
			</p>
			<div class="cards-grid cards-centered">
				{#each members as member}
					<WhoCard name={member.name} image={member.image} job={member.job} />
				{/each}
			</div>
		</div>
	{/if}

	<p class="member-count">
		{lang === 'en'
			? '+ a hundred members and volunteers'
			: '+ une centaine de membres et bénévoles'}
	</p>
</section>

<style>
	section {
		max-width: 960px;
		margin: 0 auto;
	}

	.intro {
		text-align: justify;
		margin-bottom: 1rem;
	}

	.intro :global(p) {
		text-align: justify;
	}

	.contact-cta {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
		margin-top: 1.5rem;
	}

	.contact-cta :global(a),
	.contact-cta :global(button) {
		box-shadow: inset 0 0 0 2px var(--black, #000);
	}

	.team-section {
		margin-top: 2.5rem;
		padding: 2rem 2rem 2.5rem;
		background: var(--bg-card);
		border: 1px solid var(--border);
		border-radius: 1rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
	}

	.section-title {
		margin-top: 0;
		margin-bottom: 0.5rem;
		font-size: 1.5rem;
		font-weight: 700;
		text-align: center;
	}

	.section-description {
		margin-bottom: 2rem;
		color: var(--text-secondary, #676e7a);
		font-size: 1rem;
		text-align: center;
	}

	.cards-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 2rem;
	}

	.cards-centered {
		justify-content: center;
	}

	.member-count {
		margin-top: 3rem;
		padding: 1.25rem 2rem;
		font-size: 1.2rem;
		font-weight: 600;
		color: var(--text, #333);
		text-align: center;
		background: var(--bg-subtle, #fff5e8);
		border-radius: 0.5rem;
		border: 1px solid var(--border, #e5e7eb);
	}
</style>
