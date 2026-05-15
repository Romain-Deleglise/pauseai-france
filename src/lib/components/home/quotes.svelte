<script lang="ts">
	import { onDestroy, onMount } from 'svelte'
	import { fade } from 'svelte/transition'
	import type { Lang } from '$lib/i18n'

	export let lang: Lang = 'fr'

	const INTERVAL_MS = 6000

	interface Quote {
		textFr: string
		textEn: string
		author: string
		titleFr: string
		titleEn: string
		source: string
	}

	/* prettier-ignore */
	const quotes: Quote[] = [
		{
			textFr: "Cela pourrait-il éliminer l'humanité ? Je pense que la réponse est oui.",
			textEn: "Could it wipe out humanity? I think the answer is yes.",
			author: "Geoffrey Hinton",
			titleFr: "Prix Nobel de physique 2024 · Pionnier de l'apprentissage profond",
			titleEn: "2024 Nobel Prize in Physics · Pioneer of deep learning",
			source: "https://www.bbc.com/news/world-us-canada-65452940"
		},
		{
			textFr: "J'ai peur. Et je pense que nous devrions tous avoir peur.",
			textEn: "I'm scared. And I think all of us should be scared.",
			author: "Yoshua Bengio",
			titleFr: "Prix Turing 2018 · Fondateur de Mila",
			titleEn: "2018 Turing Award · Founder of Mila",
			source: "https://yoshuabengio.org/2023/05/22/how-rogue-ais-may-arise/"
		},
		{
			textFr: "Le développement d'une intelligence artificielle complète pourrait signifier la fin de la race humaine.",
			textEn: "The development of full artificial intelligence could spell the end of the human race.",
			author: "Stephen Hawking",
			titleFr: "Physicien théoricien, cosmologue",
			titleEn: "Theoretical physicist, cosmologist",
			source: "https://www.bbc.com/news/technology-30290540"
		},
		{
			textFr: "Si cette technologie tourne mal, elle peut très mal tourner. Nous voulons être clairs là-dessus.",
			textEn: "If this technology goes wrong, it can go quite wrong. We want to be vocal about that.",
			author: "Sam Altman",
			titleFr: "PDG d'OpenAI · Témoignage au Sénat américain",
			titleEn: "CEO of OpenAI · US Senate testimony",
			source: "https://www.judiciary.senate.gov/committee-activity/hearings/oversight-of-ai-rules-for-artificial-intelligence"
		},
		{
			textFr: "Avec l'intelligence artificielle, nous invoquons le démon.",
			textEn: "With artificial intelligence we are summoning the demon.",
			author: "Elon Musk",
			titleFr: "PDG de Tesla et xAI · Symposium aérospatial du MIT",
			titleEn: "CEO of Tesla and xAI · MIT Aeronautics Symposium",
			source: "https://www.washingtonpost.com/news/innovations/wp/2014/10/24/elon-musk-with-artificial-intelligence-we-are-summoning-the-demon/"
		},
		{
			textFr: "Réussir à créer une IA serait le plus grand événement de l'histoire humaine. Malheureusement, ce pourrait aussi être le dernier.",
			textEn: "Success in creating AI would be the biggest event in human history. Unfortunately, it might also be the last.",
			author: "Max Tegmark",
			titleFr: "Physicien au MIT · Président du Future of Life Institute",
			titleEn: "MIT Physicist · President of the Future of Life Institute",
			source: "https://futureoflife.org/open-letter/pause-giant-ai-experiments/"
		},
		{
			textFr: "Atténuer le risque d'extinction lié à l'IA devrait être une priorité mondiale, au même titre que les pandémies et la guerre nucléaire.",
			textEn: "Mitigating the risk of extinction from AI should be a global priority alongside pandemics and nuclear war.",
			author: "Center for AI Safety",
			titleFr: "Signé par Hinton, Bengio, Altman, Hassabis et plus de 350 experts",
			titleEn: "Signed by Hinton, Bengio, Altman, Hassabis and 350+ experts",
			source: "https://www.safe.ai/work/statement-on-ai-risk"
		},
		{
			textFr: "Je suis dans le camp de ceux qui s'inquiètent de la superintelligence.",
			textEn: "I am in the camp that is concerned about super intelligence.",
			author: "Bill Gates",
			titleFr: "Co-fondateur de Microsoft · Reddit AMA",
			titleEn: "Co-founder of Microsoft · Reddit AMA",
			source: "https://www.reddit.com/r/IAmA/comments/2tzjp7/hi_reddit_im_bill_gates_and_im_back_for_my_third/"
		},
		{
			textFr: "Nous construisons une technologie qui pourrait être la plus transformatrice et la plus dangereuse que l'humanité ait jamais créée.",
			textEn: "We're building a technology that could be the most transformative and potentially dangerous humanity has ever created.",
			author: "Mustafa Suleyman",
			titleFr: "Co-fondateur de DeepMind · PDG de Microsoft AI",
			titleEn: "Co-founder of DeepMind · CEO of Microsoft AI",
			source: "https://www.thewave.ai/"
		},
		{
			textFr: "Je crois que les systèmes que nous construisons sont dangereux — peut-être les plus dangereux que l'humanité ait jamais construits.",
			textEn: "I believe the systems we are building are dangerous — perhaps the most dangerous things humanity has ever built.",
			author: "Ilya Sutskever",
			titleFr: "Co-fondateur d'OpenAI et de Safe Superintelligence Inc.",
			titleEn: "Co-founder of OpenAI and Safe Superintelligence Inc.",
			source: "https://twitter.com/ilyasut/status/1491554478243258368"
		}
	]

	let current = 0
	let paused = false
	let progress = 0
	let animKey = 0
	let timer: ReturnType<typeof setInterval> | undefined
	let progressTimer: ReturnType<typeof setInterval> | undefined

	function goTo(index: number) {
		current = (index + quotes.length) % quotes.length
		animKey++
		resetProgress()
	}

	function next() {
		goTo(current + 1)
	}

	function prev() {
		goTo(current - 1)
	}

	function resetProgress() {
		progress = 0
		clearInterval(progressTimer)
		if (!paused) startProgress()
	}

	function startProgress() {
		const step = 50
		progressTimer = setInterval(() => {
			progress += (step / INTERVAL_MS) * 100
			if (progress >= 100) progress = 100
		}, step)
	}

	function startAuto() {
		clearInterval(timer)
		timer = setInterval(() => {
			if (!paused) next()
		}, INTERVAL_MS)
	}

	function pause() {
		paused = true
		clearInterval(progressTimer)
	}

	function resume() {
		paused = false
		startProgress()
	}

	onMount(() => {
		startAuto()
		startProgress()
	})

	onDestroy(() => {
		clearInterval(timer)
		clearInterval(progressTimer)
	})

	$: quote = quotes[current]
</script>

<section aria-label={lang === 'en' ? 'What experts say' : 'Ce que disent les experts'}>
	<p class="eyebrow">
		{lang === 'en' ? 'What experts say' : 'Ce que disent les experts'}
	</p>

	<div
		class="carousel-area"
		on:mouseenter={pause}
		on:mouseleave={resume}
		on:focusin={pause}
		on:focusout={resume}
	>
		<span class="quote-glyph" aria-hidden="true">&ldquo;</span>

		{#key animKey}
			<blockquote class="quote-body" in:fade={{ duration: 300 }}>
				<p class="quote-text">
					{lang === 'en' ? quote.textEn : quote.textFr}
				</p>
				<footer class="quote-footer">
					<cite class="author-name">{quote.author}</cite>
					<span class="author-title">{lang === 'en' ? quote.titleEn : quote.titleFr}</span>
					<a
						href={quote.source}
						target="_blank"
						rel="noopener noreferrer"
						class="source-link"
						aria-label={lang === 'en' ? 'View source' : 'Voir la source'}
					>
						{lang === 'en' ? 'Source' : 'Source'}
						<svg
							width="11"
							height="11"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.5"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
						>
							<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
							<polyline points="15 3 21 3 21 9" />
							<line x1="10" y1="14" x2="21" y2="3" />
						</svg>
					</a>
				</footer>
			</blockquote>
		{/key}
	</div>

	<div class="nav-row">
		<button
			class="arrow"
			on:click={prev}
			aria-label={lang === 'en' ? 'Previous quote' : 'Citation précédente'}
		>
			<svg
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<polyline points="15 18 9 12 15 6" />
			</svg>
		</button>

		<div class="dots" role="tablist">
			{#each quotes as _, i}
				<button
					class="dot"
					class:active={i === current}
					role="tab"
					aria-selected={i === current}
					aria-label="{lang === 'en' ? 'Quote' : 'Citation'} {i + 1}"
					on:click={() => goTo(i)}
				></button>
			{/each}
		</div>

		<button
			class="arrow"
			on:click={next}
			aria-label={lang === 'en' ? 'Next quote' : 'Citation suivante'}
		>
			<svg
				width="18"
				height="18"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<polyline points="9 18 15 12 9 6" />
			</svg>
		</button>
	</div>

	<div class="progress-bar" aria-hidden="true">
		<div class="progress-fill" style="width: {progress}%"></div>
	</div>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		padding: 1rem 0;
	}

	.eyebrow {
		margin: 0;
		font-size: 0.78rem;
		font-weight: 700;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--brand);
	}

	.carousel-area {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		max-width: 52rem;
	}

	.quote-glyph {
		font-family: Georgia, 'Times New Roman', serif;
		font-size: 7rem;
		line-height: 1;
		color: var(--brand);
		opacity: 0.2;
		position: absolute;
		top: -1.5rem;
		left: 0;
		user-select: none;
		pointer-events: none;
	}

	.quote-body {
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		text-align: center;
		min-height: 9rem;
		justify-content: center;
		width: 100%;
	}

	.quote-text {
		margin: 0;
		font-size: 1.2rem;
		line-height: 1.75;
		color: var(--text);
		font-style: italic;
		font-weight: 400;
		max-width: 42rem;
		position: relative;
	}

	.quote-footer {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.15rem;
	}

	.author-name {
		font-style: normal;
		font-weight: 700;
		font-size: 0.95rem;
		color: var(--text);
	}

	.author-title {
		font-size: 0.8rem;
		color: var(--text-2);
		line-height: 1.4;
	}

	.source-link {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		margin-top: 0.25rem;
		font-size: 0.75rem;
		color: var(--brand);
		opacity: 0.65;
		text-decoration: none;
		transition: opacity 0.15s;
	}

	.source-link:hover {
		opacity: 1;
		text-decoration: underline;
	}

	.nav-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.arrow {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border: 1.5px solid color-mix(in srgb, var(--text-2) 25%, transparent);
		border-radius: 50%;
		background: transparent;
		color: var(--text-2);
		cursor: pointer;
		transition:
			background 0.15s,
			color 0.15s,
			border-color 0.15s;
		flex-shrink: 0;
	}

	.arrow:hover {
		background: color-mix(in srgb, var(--brand) 10%, transparent);
		color: var(--brand);
		border-color: var(--brand);
	}

	.dots {
		display: flex;
		gap: 0.45rem;
		align-items: center;
	}

	.dot {
		width: 0.45rem;
		height: 0.45rem;
		border-radius: 50%;
		border: none;
		background: color-mix(in srgb, var(--text-2) 40%, transparent);
		cursor: pointer;
		padding: 0;
		transition:
			background 0.2s,
			width 0.2s;
	}

	.dot.active {
		background: var(--brand);
		width: 1.25rem;
		border-radius: 0.25rem;
	}

	.progress-bar {
		width: 100%;
		max-width: 52rem;
		height: 1.5px;
		background: color-mix(in srgb, var(--text-2) 15%, transparent);
		border-radius: 1px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: var(--brand);
		border-radius: 1px;
		transition: width 0.05s linear;
	}

	@media (min-width: 640px) {
		.quote-text {
			font-size: 1.3rem;
		}

		.quote-body {
			min-height: 7rem;
		}
	}

	@media (min-width: 1024px) {
		.quote-text {
			font-size: 1.4rem;
		}

		.quote-body {
			min-height: 6rem;
		}
	}
</style>
