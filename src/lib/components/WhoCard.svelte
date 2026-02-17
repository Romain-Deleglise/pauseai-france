<script lang="ts">
	export let name: string
	export let image: string | null = null
	export let job: string = ''
</script>

<article class="member-card">
	<div class="member-image">
		{#if image}
			<img src={image} alt={name} loading="lazy" width="144" height="144" />
		{:else}
			<div class="placeholder">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
					/>
				</svg>
			</div>
		{/if}
	</div>
	<div class="info">
		<h3>{name}</h3>
		{#if job}
			<p class="job">{job}</p>
		{/if}
	</div>
</article>

<style>
	.member-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		width: 10rem;
	}

	.member-image {
		width: 7rem;
		height: 7rem;
		flex-shrink: 0;
		transition: transform 0.2s ease;
	}

	.member-card:hover .member-image {
		transform: scale(1.05);
	}

	.member-image img {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		object-fit: cover;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		border: 2px solid var(--border, #e5e7eb);
	}

	.placeholder {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background: linear-gradient(135deg, #e8e8e8 0%, #d0d0d0 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		border: 2px solid var(--border, #e5e7eb);
	}

	.placeholder svg {
		width: 40%;
		height: 40%;
		color: #999;
	}

	.info {
		max-width: 10rem;
		text-align: center;
	}

	h3 {
		margin: 0;
		font-weight: 600;
		font-size: 0.95rem;
	}

	.job {
		margin: 0.15rem 0 0 0;
		font-weight: 400;
		font-size: 0.8rem;
		color: var(--text-secondary, #666);
		line-height: 1.3;
	}
</style>
