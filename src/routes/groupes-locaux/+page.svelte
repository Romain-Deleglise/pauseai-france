<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import Button from '$components/Button.svelte'
	import { MessageSquare, PlusCircle } from 'lucide-svelte'

	const title = 'Groupes locaux | Pause IA'
	const description =
		'Trouvez un groupe local Pause IA près de chez vous ou créez-en un pour agir concrètement en faveur d’une pause sur l’intelligence artificielle.'
</script>

<PostMeta {title} {description} />

<article>
	<section class="hero">
		<UnderlinedTitle as="h1">Groupes locaux</UnderlinedTitle>
		<p class="hero-description">
			L'action locale est essentielle pour sensibiliser le public, interpeller les élus et
			construire un mouvement citoyen fort. En groupe, nous pouvons organiser des rencontres,
			distribuer des tracts, et créer un impact visible sur le terrain. Rejoignez une équipe près de
			chez vous ou lancez la dynamique dans votre ville !
		</p>
	</section>

	<section class="cta-section">
		<div class="cta-card join">
			<MessageSquare size="2.5em" />
			<h2>Je m'inscris pour rejoindre un groupe</h2>
			<p>
				Remplissez le formulaire d'inscription pour contribuer concrètement à l’action de Pause IA
				au niveau local en participant à des actions collectives de sensibilisation et de
				mobilisation citoyenne, et en faisant vivre une communauté engagée autour des enjeux liés à
				l’intelligence artificielle.
			</p>
			<Button href="https://pauseia.notion.site/2e128fc94b7780fd94b6d35c35b2f0ac"
				>Rejoindre un groupe</Button
			>
		</div>

		<div class="cta-card create">
			<PlusCircle size="2.5em" />
			<h2>Je lance un nouveau groupe</h2>
			<p>
				Faites vivre et grandir Pause IA localement en animant une communauté de bénévoles engagés,
				en coordonnant des actions de sensibilisation et de mobilisation, et en assurant le lien
				entre le terrain et l’équipe nationale.
			</p>
			<Button alt href="https://pauseia.notion.site/2e128fc94b7780fd94b6d35c35b2f0ac"
				>Lancer un groupe</Button
			>
		</div>
	</section>
</article>

<style>
	article {
		max-inline-size: 60rem;
		margin-inline: auto;
		margin-top: 3rem;
		padding: 0 2rem;
	}

	.hero {
		text-align: left;
		margin-bottom: 4rem;
	}

	.hero-description {
		font-size: 1.25rem;
		color: var(--text-muted);
		line-height: 1.6;
	}

	.cta-section {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		margin-bottom: 5rem;
	}

	.cta-card {
		padding: 3rem 2rem;
		border-radius: 20px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		transition: transform 0.2s;
	}

	.cta-card:hover {
		transform: translateY(-5px);
	}

	.cta-card.join {
		background: var(--bg-subtle);
		border: 2px solid var(--brand);
	}

	.cta-card.create {
		background: var(--brand);
		color: white;
	}

	.cta-card.create :global(svg) {
		color: white;
	}

	.cta-card h2 {
		margin: 0;
		font-size: 1.8rem;
	}

	.cta-card p {
		margin: 0;
		font-size: 1.1rem;
		opacity: 0.9;
		flex-grow: 1;
	}

	@media (max-width: 640px) {
		article {
			padding: 0 1rem;
		}

		.cta-card {
			padding: 2rem 1rem;
		}
	}
</style>
