<script lang="ts">
	import PostMeta from '$components/PostMeta.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import Button from '$lib/components/Button.svelte'

	const title = "Sommet de l'IA 2026"
	const description =
		"Le Sommet de l'IA 2026 en Inde est un moment crucial pour l'avenir de notre société. Vous pouvez agir avec Pause IA pour que les enjeux de sécurité et de contrôle démocratique soient au cœur des discussions."

	function openActivoice() {
		const embedEl = document.getElementById(
			'activoice-embed-a0fa93be_f050_4d77_8a0c_9e70e3fe02b6'
		) as any
		if ((window as any).Activoice) {
			;(window as any).Activoice.bootstrap().then(() => {
				embedEl?.openWithId('a0fa93be-f050-4d77-8a0c-9e70e3fe02b6')
			})
		}
	}
</script>

<svelte:head>
	<script src="https://activoice.online/embed/activoice-12.0.0.js"></script>
</svelte:head>

<PostMeta {title} {description} />

<article>
	<section class="hero">
		<UnderlinedTitle as="h1">Sommet de l'IA 2026</UnderlinedTitle>
	</section>

	<section class="campaign-content">
		<div class="content-header">
			<p>
				{description}
			</p>
		</div>

		<div class="cta-container">
			<Button on:click={openActivoice}>J'interpelle les politiques</Button>
		</div>

		<activoice-embed id="activoice-embed-a0fa93be_f050_4d77_8a0c_9e70e3fe02b6" />
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

	.hero {
		text-align: left;
		margin-bottom: 4rem;
	}

	.campaign-content {
		background: #fafafa;
		border-radius: 16px;
		padding: 3rem 2rem;
		border: 1px solid #eee;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
		text-align: center;
		margin-bottom: 5rem;
	}

	.content-header {
		max-width: 45rem;
		margin: 0 auto 2rem;
	}

	.content-header {
		max-width: 45rem;
		margin: 0 auto 2rem;
	}

	.campaign-content p {
		font-size: 1.1rem;
		line-height: 1.7;
		margin-bottom: 0;
	}

	.cta-container {
		display: flex;
		gap: 1.5rem;
		flex-wrap: wrap;
		justify-content: center;
		margin-top: 2rem;
	}

	@media (max-width: 600px) {
		.campaign-content {
			padding: 1.5rem;
		}

		.cta-container {
			flex-direction: column;
		}
	}
</style>
