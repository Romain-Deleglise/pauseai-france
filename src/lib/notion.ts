import { env } from '$env/dynamic/private'

const NOTION_API_VERSION = '2022-06-28'

interface NotionRichText {
	plain_text: string
}

interface NotionProperty {
	type: string
	title?: NotionRichText[]
	rich_text?: NotionRichText[]
	url?: string
	number?: number
	checkbox?: boolean
	select?: { name: string }
}

interface NotionPage {
	id: string
	properties: Record<string, NotionProperty>
}

interface NotionQueryResponse {
	results: NotionPage[]
	has_more: boolean
	next_cursor: string | null
}

// Types for our content
export interface Video {
	id: string
	title: string
	youtubeId: string
	order: number
	visible: boolean
}

export interface Article {
	id: string
	title: string
	description: string
	url: string
	type: 'Article' | 'Newsletter'
	order: number
	visible: boolean
}

export interface Report {
	id: string
	title: string
	description: string
	url: string
	image: string
	order: number
	visible: boolean
}

export interface Banner {
	id: string
	message: string
	linkText: string
	linkUrl: string
	visible: boolean
}

// Helper to extract text from Notion rich_text or title
function getText(property: NotionProperty | undefined): string {
	if (!property) return ''
	if (property.title && property.title.length > 0) {
		return property.title.map((t) => t.plain_text).join('')
	}
	if (property.rich_text && property.rich_text.length > 0) {
		return property.rich_text.map((t) => t.plain_text).join('')
	}
	return ''
}

// Helper to extract URL
function getUrl(property: NotionProperty | undefined): string {
	if (!property) return ''
	return property.url || ''
}

// Helper to extract number
function getNumber(property: NotionProperty | undefined): number {
	if (!property) return 0
	return property.number || 0
}

// Helper to extract checkbox
function getCheckbox(property: NotionProperty | undefined): boolean {
	if (!property) return false
	return property.checkbox || false
}

// Helper to extract select
function getSelect(property: NotionProperty | undefined): string {
	if (!property) return ''
	return property.select?.name || ''
}

// Validation helpers
function isValidVideo(video: Video): boolean {
	// YouTube ID must be present and look valid (11 characters)
	if (!video.youtubeId || video.youtubeId.length < 5) {
		console.warn(`Invalid video: missing or invalid YouTube ID for "${video.title}"`)
		return false
	}
	if (!video.title) {
		console.warn(`Invalid video: missing title for YouTube ID "${video.youtubeId}"`)
		return false
	}
	return true
}

function isValidArticle(article: Article): boolean {
	if (!article.title) {
		console.warn(`Invalid article: missing title`)
		return false
	}
	if (!article.url) {
		console.warn(`Invalid article: missing URL for "${article.title}"`)
		return false
	}
	return true
}

function isValidReport(report: Report): boolean {
	if (!report.title) {
		console.warn(`Invalid report: missing title`)
		return false
	}
	if (!report.url) {
		console.warn(`Invalid report: missing URL for "${report.title}"`)
		return false
	}
	return true
}

function isValidBanner(banner: Banner): boolean {
	if (!banner.message) {
		console.warn(`Invalid banner: missing message`)
		return false
	}
	return true
}

async function queryDatabase<T>(databaseId: string, mapper: (page: NotionPage) => T): Promise<T[]> {
	const apiKey = env.NOTION_API_KEY
	if (!apiKey || !databaseId) {
		console.warn('Notion API key or database ID not configured')
		return []
	}

	try {
		const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Notion-Version': NOTION_API_VERSION,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				sorts: [{ property: 'Ordre', direction: 'ascending' }]
			})
		})

		if (!response.ok) {
			const errorText = await response.text()
			console.error(`Notion API error: ${response.status} - ${errorText}`)
			return []
		}

		const data = (await response.json()) as NotionQueryResponse
		return data.results.map(mapper).filter((item) => item !== null)
	} catch (error) {
		console.error('Failed to fetch from Notion:', error)
		return []
	}
}

export async function getVideos(): Promise<Video[]> {
	const databaseId = env.NOTION_VIDEOS_DATABASE_ID
	if (!databaseId) return []

	const videos = await queryDatabase<Video | null>(databaseId, (page) => {
		const visible = getCheckbox(page.properties['Visible'])
		if (!visible) return null

		const video: Video = {
			id: page.id,
			title: getText(page.properties['Titre']),
			youtubeId: getText(page.properties['YouTube ID']),
			order: getNumber(page.properties['Ordre']),
			visible
		}

		// Validate before returning
		return isValidVideo(video) ? video : null
	})

	return videos.filter((v): v is Video => v !== null)
}

export async function getArticles(): Promise<Article[]> {
	const databaseId = env.NOTION_ARTICLES_DATABASE_ID
	if (!databaseId) return []

	const articles = await queryDatabase<Article | null>(databaseId, (page) => {
		const visible = getCheckbox(page.properties['Visible'])
		if (!visible) return null

		const typeValue = getSelect(page.properties['Type'])

		const article: Article = {
			id: page.id,
			title: getText(page.properties['Titre']),
			description: getText(page.properties['Description']),
			url: getUrl(page.properties['URL']),
			type: typeValue === 'Newsletter' ? 'Newsletter' : 'Article',
			order: getNumber(page.properties['Ordre']),
			visible
		}

		// Validate before returning
		return isValidArticle(article) ? article : null
	})

	return articles.filter((a): a is Article => a !== null)
}

export async function getReports(): Promise<Report[]> {
	const databaseId = env.NOTION_REPORTS_DATABASE_ID
	if (!databaseId) return []

	const reports = await queryDatabase<Report | null>(databaseId, (page) => {
		const visible = getCheckbox(page.properties['Visible'])
		if (!visible) return null

		const report: Report = {
			id: page.id,
			title: getText(page.properties['Titre']),
			description: getText(page.properties['Description']),
			url: getUrl(page.properties['URL']),
			image: getUrl(page.properties['Image']),
			order: getNumber(page.properties['Ordre']),
			visible
		}

		// Validate before returning
		return isValidReport(report) ? report : null
	})

	return reports.filter((r): r is Report => r !== null)
}

export async function getBanner(): Promise<Banner | null> {
	const databaseId = env.NOTION_BANNER_DATABASE_ID
	if (!databaseId) return null

	const banners = await queryDatabase<Banner | null>(databaseId, (page) => {
		const visible = getCheckbox(page.properties['Visible'])
		if (!visible) return null

		const banner: Banner = {
			id: page.id,
			message: getText(page.properties['Message']),
			linkText: getText(page.properties['Texte du lien']),
			linkUrl: getUrl(page.properties['URL du lien']),
			visible
		}

		// Validate before returning
		return isValidBanner(banner) ? banner : null
	})

	// Return the first visible banner
	return banners.find((b): b is Banner => b !== null) || null
}
