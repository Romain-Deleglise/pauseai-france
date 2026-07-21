// Parsing partagé de la FAQ (src/posts/faq.md) pour la page d'accueil (teaser)
// et la page dédiée /faq. La FAQ est écrite en markdown : « ## » = catégorie,
// « ### » = question, le reste = réponse. On en tire une version HTML statique
// (bonne pour le SEO) et une version texte (pour la recherche et le JSON-LD).

export interface FaqItem {
	id: string
	question: string
	/** Réponse en markdown brut. */
	answerMd: string
	/** Réponse en HTML (paragraphes, gras, liens). */
	answerHtml: string
	/** Réponse en texte simple (recherche, JSON-LD). */
	answerText: string
	category: string
}

export interface FaqCategory {
	category: string
	items: FaqItem[]
}

function escapeHtml(s: string): string {
	return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/** Rendu markdown minimal suffisant pour nos réponses : gras et liens. */
function renderInline(s: string): string {
	return escapeHtml(s)
		.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
		.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
}

function renderAnswerHtml(md: string): string {
	return md
		.trim()
		.split(/\n{2,}/)
		.map((para) => `<p>${renderInline(para.trim())}</p>`)
		.join('\n')
}

function stripMarkdown(md: string): string {
	return md
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
		.replace(/\*\*([^*]+)\*\*/g, '$1')
		.replace(/_([^_]+)_/g, '$1')
		.replace(/\n{3,}/g, '\n\n')
		.trim()
}

/** Découpe le markdown de la FAQ en catégories → questions. */
export function parseFaq(raw: string): FaqCategory[] {
	// Retire le frontmatter éventuel.
	const body = raw.replace(/^---\n[\s\S]*?\n---\n/, '')
	const lines = body.split('\n')
	const categories: FaqCategory[] = []
	let current: FaqCategory | null = null
	let question = ''
	let answer = ''
	let count = 0

	const flush = () => {
		if (!question || !current) return
		count++
		current.items.push({
			id: `accordion${count}`,
			question,
			answerMd: answer.trim(),
			answerHtml: renderAnswerHtml(answer),
			answerText: stripMarkdown(answer),
			category: current.category
		})
		question = ''
		answer = ''
	}

	for (const line of lines) {
		if (line.startsWith('## ')) {
			flush()
			current = { category: line.replace('## ', '').trim(), items: [] }
			categories.push(current)
		} else if (line.startsWith('### ')) {
			flush()
			question = line.replace('### ', '').trim()
			answer = ''
		} else if (question) {
			answer += line + '\n'
		}
	}
	flush()
	return categories.filter((c) => c.items.length > 0)
}

/** Liste plate de toutes les questions. */
export function flattenFaq(categories: FaqCategory[]): FaqItem[] {
	return categories.flatMap((c) => c.items)
}

/** JSON-LD FAQPage (rich snippets Google). */
export function faqJsonLd(items: FaqItem[]): string {
	return JSON.stringify({
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: items.map((item) => ({
			'@type': 'Question',
			name: item.question,
			acceptedAnswer: { '@type': 'Answer', text: item.answerText }
		}))
	})
}
