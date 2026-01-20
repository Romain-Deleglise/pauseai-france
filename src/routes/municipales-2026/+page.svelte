<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import Button from '$lib/components/Button.svelte'

	const title = 'Élections municipales 2026'
	const description =
		'Les élections municipales de mars 2026 représentent une opportunité majeure de sensibilisation au niveau local. À cette occasion, Pause IA appelle les candidats à s’engager concrètement en signant notre charte.'

	let showModal = false
</script>

<PostMeta {title} {description} />

<section class="wrap">
	<div class="content">
		<h1>{title}</h1>

		<p class="intro">
			{description}
		</p>

		<section class="charte-engagement">
			<h2>Demander à vos candidats de s'engager sur la charte de Pause IA</h2>
			<p>
				Vous pouvez agir localement en interpellant les candidats de votre ville. Invitez-les à
				découvrir et à signer la charte de Pause IA. L'ensemble des signataires sera prochainement
				affiché sur cette page.
			</p>

			<div class="cta-container">
				<Button on:click={() => (showModal = true)}>Je découvre la charte</Button>
			</div>
		</section>
	</div>
</section>

{#if showModal}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<div class="modal-overlay" on:click={() => (showModal = false)}>
		<div class="modal-content" on:click|stopPropagation>
			<button class="close-button" on:click={() => (showModal = false)} aria-label="Fermer">
				&times;
			</button>
			<img src="/charte-municipales-2026.png" alt="La charte Pause IA pour les municipales" />
		</div>
	</div>
{/if}

<style>
	.wrap {
		max-width: 800px;
		margin: 0 auto;
		padding: 3rem 1rem 5rem;
	}

	.content {
		display: flex;
		flex-direction: column;
		gap: 2.5rem;
	}

	h1 {
		font-size: 3rem;
		font-weight: 800;
		text-align: center;
		margin: 0;
		color: var(--text-heading, #111);
	}

	.intro {
		font-size: 1.25rem;
		line-height: 1.6;
		text-align: center;
		color: var(--text-muted, #444);
		max-width: 700px;
		margin: 0 auto;
	}

	.charte-engagement {
		background: #fafafa;
		border-radius: 16px;
		padding: 2.5rem;
		border: 1px solid #eee;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
	}

	h2 {
		font-size: 2rem;
		margin-top: 0;
		margin-bottom: 1.5rem;
		color: var(--text-heading, #222);
	}

	.charte-engagement p {
		font-size: 1.1rem;
		line-height: 1.7;
		margin-bottom: 2rem;
	}

	.cta-container {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	/* Modal Styles */
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.8);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 2000;
		cursor: pointer;
		padding: 2rem;
	}

	.modal-content {
		position: relative;
		max-width: 90%;
		max-height: 90vh;
		background: white;
		border-radius: 8px;
		overflow: hidden;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
		cursor: default;
	}

	.close-button {
		position: absolute;
		top: 1rem;
		right: 1rem;
		background: rgba(0, 0, 0, 0.5);
		color: white;
		border: none;
		border-radius: 50%;
		width: 2.5rem;
		height: 2.5rem;
		font-size: 1.5rem;
		line-height: 1;
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
		transition: background 0.2s;
		z-index: 10;
	}

	.close-button:hover {
		background: rgba(0, 0, 0, 0.8);
	}

	.modal-content img {
		display: block;
		max-width: 100%;
		max-height: calc(90vh - 2rem);
		object-fit: contain;
	}

	@media (max-width: 600px) {
		h1 {
			font-size: 2.5rem;
		}

		h2 {
			font-size: 1.5rem;
		}

		.charte-engagement {
			padding: 1.5rem;
		}

		.cta-container {
			flex-direction: column;
		}
	}
</style>
