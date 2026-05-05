<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import Button from '$components/Button.svelte'
	import LocalGroupsMap from '$components/LocalGroupsMap.svelte'
	import { MessageSquare, PlusCircle, MapPin } from 'lucide-svelte'

	const title = 'Groupes locaux | Pause IA'
	const description =
		"Trouvez un groupe local Pause IA près de chez vous ou créez-en un pour agir concrètement en faveur d'une pause sur l'intelligence artificielle."
</script>

<PostMeta {title} {description} />

<article>
	<section class="hero">
		<UnderlinedTitle as="h1">Groupes locaux</UnderlinedTitle>
		<p class="hero-description">
			L'action locale est essentielle pour sensibiliser le public, interpeller les élus et
			construire un mouvement citoyen fort. Rejoignez une équipe près de chez vous ou lancez la
			dynamique dans votre ville.
		</p>
	</section>

	<section class="cta-section">
		<div class="cta-card join">
			<MessageSquare size="2rem" />
			<h2>Rejoindre un groupe</h2>
			<p>
				Participez à des actions collectives de sensibilisation et de mobilisation citoyenne autour
				des enjeux de l'intelligence artificielle.
			</p>
			<Button href="https://pauseia.notion.site/2e128fc94b7780fd94b6d35c35b2f0ac">S'inscrire</Button
			>
		</div>

		<div class="cta-card create">
			<PlusCircle size="2rem" />
			<h2>Lancer un groupe</h2>
			<p>
				Animez une communauté de bénévoles engagés et coordonnez les actions locales de Pause IA
				dans votre ville.
			</p>
			<Button alt href="https://pauseia.notion.site/2e128fc94b7780fd94b6d35c35b2f0ac"
				>Créer un groupe</Button
			>
		</div>
	</section>

	<section class="map-section">
		<div class="map-header">
			<div class="map-title-row">
				<MapPin size="1.2em" class="map-pin-icon" />
				<h2>Nos groupes en France</h2>
			</div>
			<p class="map-subtitle">Survolez ou cliquez sur un marqueur pour voir la ville.</p>
		</div>
		<LocalGroupsMap />
	</section>
</article>

<style>
	article {
		max-inline-size: 62rem;
		margin-inline: auto;
		margin-top: 3rem;
		padding: 0 2rem;
	}

	/* ── Hero ─────────────────────────────────────────────────────────── */

	.hero {
		text-align: left;
		margin-bottom: 3rem;
	}

	.hero-description {
		font-size: 1.2rem;
		color: var(--text-muted);
		line-height: 1.65;
		max-inline-size: 48rem;
	}

	/* ── CTA cards ────────────────────────────────────────────────────── */

	.cta-section {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 1.5rem;
		margin-bottom: 4rem;
	}

	.cta-card {
		padding: 2.25rem 2rem;
		border-radius: 20px;
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		transition: transform 0.2s;
	}

	.cta-card:hover {
		transform: translateY(-4px);
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
		font-size: 1.4rem;
	}

	.cta-card p {
		margin: 0;
		font-size: 1rem;
		opacity: 0.88;
		flex-grow: 1;
		line-height: 1.55;
	}

	/* ── Map section ──────────────────────────────────────────────────── */

	.map-section {
		margin-bottom: 5rem;
	}

	.map-header {
		margin-bottom: 1rem;
	}

	.map-title-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.25rem;
	}

	.map-title-row h2 {
		margin: 0;
	}

	.map-title-row :global(.map-pin-icon) {
		color: var(--brand, #ff9416);
		flex-shrink: 0;
	}

	.map-subtitle {
		font-size: 0.875rem;
		color: var(--text-secondary, #888);
		margin: 0;
	}

	/* ── Responsive ───────────────────────────────────────────────────── */

	@media (max-width: 640px) {
		article {
			padding: 0 1rem;
		}

		.cta-card {
			padding: 1.75rem 1.25rem;
		}
	}
</style>
