<script lang="ts">
	export let name: string
	export let role: string
	export let image: string | null = null
</script>

<article class="leadership-card">
	<div class="leader-image">
		{#if image}
			<img src={image} alt={name} loading="lazy" width="208" height="208" />
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
	<div class="leader-info">
		<h3>{name}</h3>
		<p class="role">{role}</p>
	</div>
</article>

<style>
	.leadership-card {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
		width: 13rem;
	}

	.leader-image {
		width: 10rem;
		height: 10rem;
		transition: transform 0.2s ease;
	}

	.leadership-card:hover .leader-image {
		transform: scale(1.05);
	}

	.leader-image img {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		object-fit: cover;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
		border: 3px solid var(--brand, #ff9416);
	}

	.placeholder {
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background: linear-gradient(135deg, #e8e8e8 0%, #d0d0d0 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		border: 3px solid var(--border, #e5e7eb);
	}

	.placeholder svg {
		width: 40%;
		height: 40%;
		color: #999;
	}

	.leader-info {
		max-width: 13rem;
		text-align: center;
	}

	h3 {
		margin: 0;
		font-weight: 700;
		font-size: 1.05rem;
	}

	.role {
		margin: 0.25rem 0 0 0;
		font-weight: 400;
		font-size: 0.9rem;
		color: var(--text-secondary, #666);
		line-height: 1.3;
	}
</style>
