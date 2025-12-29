<script lang="ts">
	export let name: string
	export let job: string
	export let image: string | null = null
</script>

<article class="scientist-card">
	<div class="scientist-image">
		{#if image}
			<img src={image} alt={name} />
		{:else}
			<div class="placeholder">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
					<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
				</svg>
			</div>
		{/if}
	</div>
	<div class="scientist-info">
		<h3>{name}</h3>
		<p class="job">{job}</p>
	</div>
</article>

<style>
	.scientist-card {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.scientist-image {
		width: 11rem;
		height: 11rem;
	}

	.scientist-image img {
		width: 100%;
		height: 100%;
		border-radius: 0.3125rem;
		object-fit: cover;
	}

	.placeholder {
		width: 100%;
		height: 100%;
		border-radius: 0.3125rem;
		background: linear-gradient(135deg, #e0e0e0 0%, #c0c0c0 100%);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.placeholder svg {
		width: 50%;
		height: 50%;
		color: #888;
	}

	.scientist-info {
		max-width: 11rem;
	}

	h3 {
		margin: 0;
		font-weight: 700;
		font-size: 1rem;
	}

	.job {
		margin: 0.2rem 0 0 0;
		font-weight: 300;
		font-size: 0.9rem;
	}

	@media (min-width: 768px) {
		.scientist-image {
			width: 13rem;
			height: 13rem;
		}
		.scientist-info {
			max-width: 13rem;
		}
	}
</style>
