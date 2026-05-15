<script lang="ts">
	import Fly from '$components/Fly.svelte'
	import UnderlinedTitle from '$components/UnderlinedTitle.svelte'
	import type { Lang } from '$lib/i18n'

	export let lang: Lang = 'fr'

	const label_id = 'quotes-title'

	interface Quote {
		textFr: string
		textEn: string
		author: string
		titleFr: string
		titleEn: string
		year: number
		source?: string
	}

	const quotes: Quote[] = [
		{
			textFr:
				'L’extinction de l’humanité est une possibilité réelle. Si nous continuons sur cette voie, nous pourrions perdre le contrôle.',
			textEn:
				'Human extinction is a real possibility. If we continue on this path, we could lose control.',
			author: 'Geoffrey Hinton',
			titleFr: 'Prix Nobel de physique 2024, pionnier de l’apprentissage profond',
			titleEn: '2024 Nobel Prize in Physics, pioneer of deep learning',
			year: 2023,
			source: 'https://www.bbc.com/news/world-us-canada-65452940'
		},
		{
			textFr:
				'Je pense que nous fabriquons peut-être l’une des technologies les plus transformatrices et potentiellement dangereuses de l’histoire humaine.',
			textEn:
				'I think we may be building one of the most transformative and potentially dangerous technologies in human history.',
			author: 'Yoshua Bengio',
			titleFr: 'Prix Turing 2018, fondateur de Mila (Institut québécois d’IA)',
			titleEn: '2018 Turing Award, founder of Mila (Quebec AI Institute)',
			year: 2023,
			source: 'https://yoshuabengio.org/2023/05/22/how-rogue-ais-may-arise/'
		},
		{
			textFr:
				'L’IA pourrait être la technologie la plus transformatrice et potentiellement dangereuse que l’humanité ait jamais développée. Le risque d’extinction mérite d’être pris au sérieux.',
			textEn:
				'AI could be the most transformative and potentially dangerous technology humanity has ever developed. The risk of extinction deserves to be taken seriously.',
			author: 'Sam Altman',
			titleFr: 'PDG d’OpenAI',
			titleEn: 'CEO of OpenAI',
			year: 2023,
			source: 'https://www.lesswrong.com/posts/gJHgcshQc4eqe5dPC/sam-altman-on-ai-extinction'
		},
		{
			textFr:
				'L’IA est potentiellement la technologie la plus dangereuse que l’humanité ait jamais inventée. Nous devons agir maintenant pour nous assurer qu’elle reste bénéfique.',
			textEn:
				'AI is potentially the most dangerous technology humanity has ever invented. We must act now to ensure it remains beneficial.',
			author: 'Demis Hassabis',
			titleFr: 'Prix Nobel de chimie 2024, PDG de Google DeepMind',
			titleEn: '2024 Nobel Prize in Chemistry, CEO of Google DeepMind',
			year: 2024,
			source: 'https://time.com/6266923/demis-hassabis-google-deepmind-interview/'
		},
		{
			textFr:
				'Si nous créons des machines plus intelligentes que nous-mêmes et ne savons pas comment aligner leurs objectifs sur les nôtres, il n’y a aucune raison de s’attendre à ce qu’elles nous traitent bien.',
			textEn:
				'If we create machines smarter than ourselves and don’t know how to align their goals with ours, there is no reason to expect them to treat us well.',
			author: 'Stuart Russell',
			titleFr: 'Professeur à l’UC Berkeley, auteur de « Human Compatible »',
			titleEn: 'Professor at UC Berkeley, author of "Human Compatible"',
			year: 2023,
			source: 'https://humancompatible.ai/'
		},
		{
			textFr:
				'Atténuer le risque d’extinction lié à l’IA devrait être une priorité mondiale au même titre que d’autres risques à l’échelle sociétale comme les pandémies et la guerre nucléaire.',
			textEn:
				'Mitigating the risk of extinction from AI should be a global priority alongside other societal-scale risks such as pandemics and nuclear war.',
			author: 'Center for AI Safety',
			titleFr: 'Signé par Hinton, Bengio, Altman, Hassabis et plus de 350 experts',
			titleEn: 'Signed by Hinton, Bengio, Altman, Hassabis and over 350 experts',
			year: 2023,
			source: 'https://www.safe.ai/work/statement-on-ai-risk'
		}
	]
</script>

<section aria-labelledby={label_id}>
	<Fly>
		<UnderlinedTitle id={label_id}>
			{lang === 'en' ? 'What experts say' : 'Ce que disent les experts'}
		</UnderlinedTitle>
		<p class="subtitle">
			{#if lang === 'en'}
				Leading AI researchers and lab executives publicly warn about catastrophic risks.
			{:else}
				Les plus grands chercheurs en IA et dirigeants de laboratoires alertent publiquement sur les
				risques catastrophiques.
			{/if}
		</p>
	</Fly>

	<div class="carousel" role="list">
		{#each quotes as quote, i}
			<Fly flyParams={{ y: 40, duration: 400 }}>
				<article class="quote-card" role="listitem" style="--card-delay: {i * 60}ms">
					<blockquote>
						<p class="quote-text">
							«&nbsp;{lang === 'en' ? quote.textEn : quote.textFr}&nbsp;»
						</p>
					</blockquote>
					<footer class="quote-footer">
						<div class="author-info">
							<span class="author-name">{quote.author}</span>
							<span class="author-title"
								>{lang === 'en' ? quote.titleEn : quote.titleFr}, {quote.year}</span
							>
						</div>
						{#if quote.source}
							<a
								href={quote.source}
								target="_blank"
								rel="noopener noreferrer"
								class="source-link"
								aria-label={lang === 'en' ? 'Source' : 'Source'}
							>
								<svg
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									aria-hidden="true"
								>
									<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
									<polyline points="15 3 21 3 21 9" />
									<line x1="10" y1="14" x2="21" y2="3" />
								</svg>
							</a>
						{/if}
					</footer>
				</article>
			</Fly>
		{/each}
	</div>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.subtitle {
		margin: -0.5rem 0 0;
		color: var(--text-2);
		font-size: 1rem;
		line-height: 1.5;
		max-width: 48rem;
	}

	.carousel {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(17rem, 1fr));
		gap: 1rem;
	}

	.quote-card {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 1.25rem;
		padding: 1.5rem;
		background: var(--bg-subtle);
		border: 1px solid color-mix(in srgb, var(--brand) 20%, transparent);
		border-radius: 1.25rem;
		border-left: 4px solid var(--brand);
		transition: box-shadow 0.2s ease;
	}

	.quote-card:hover {
		box-shadow: 0 4px 20px color-mix(in srgb, var(--brand) 15%, transparent);
	}

	blockquote {
		margin: 0;
		padding: 0;
	}

	.quote-text {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.65;
		color: var(--text);
		font-style: italic;
	}

	.quote-footer {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 0.5rem;
	}

	.author-info {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.author-name {
		font-weight: 700;
		font-size: 0.9rem;
		color: var(--text);
	}

	.author-title {
		font-size: 0.78rem;
		color: var(--text-2);
		line-height: 1.4;
	}

	.source-link {
		flex-shrink: 0;
		color: var(--text-2);
		opacity: 0.6;
		transition:
			opacity 0.15s,
			color 0.15s;
		display: flex;
		align-items: center;
	}

	.source-link:hover {
		opacity: 1;
		color: var(--brand);
	}

	@media (min-width: 640px) {
		.carousel {
			grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
			gap: 1.25rem;
		}
	}

	@media (min-width: 1024px) {
		.carousel {
			grid-template-columns: repeat(3, 1fr);
			gap: 1.5rem;
		}
	}
</style>
