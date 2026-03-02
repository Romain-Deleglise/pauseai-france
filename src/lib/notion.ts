import { env } from '$env/dynamic/private'

const NOTION_API_VERSION = '2022-06-28'

interface NotionRichText {
	plain_text: string
}

interface NotionFile {
	type: 'file' | 'external'
	file?: { url: string; expiry_time?: string }
	external?: { url: string }
}

interface NotionProperty {
	type: string
	title?: NotionRichText[]
	rich_text?: NotionRichText[]
	url?: string
	number?: number
	checkbox?: boolean
	select?: { name: string }
	date?: { start: string; end?: string | null }
	files?: NotionFile[]
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
	slug: string
	description: string
	url: string
	type: 'Article' | 'Newsletter'
	order: number
	visible: boolean
	image?: string
	date?: string
}

function generateSlug(title: string): string {
	return title
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '') // Remove diacritics
		.replace(/[^a-z0-9\s-]/g, '') // Remove special chars
		.replace(/\s+/g, '-') // Spaces to hyphens
		.replace(/-+/g, '-') // Collapse multiple hyphens
		.replace(/^-|-$/g, '') // Trim hyphens
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

export interface PressRelease {
	id: string
	title: string
	date: string
	url: string
	description: string
	order: number
	visible: boolean
}

export interface LocalPressRelease {
	id: string
	title: string
	date: string
	url: string
	description: string
	department: string
	order: number
	visible: boolean
}

export interface PressCoverage {
	id: string
	title: string
	source: string
	date: string
	url: string
	order: number
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

// Helper to extract date
function getDate(property: NotionProperty | undefined): string {
	if (!property) return ''
	return property.date?.start || ''
}

// Helper to extract file URL from Notion files/attachments
function getFileUrl(property: NotionProperty | undefined): string {
	if (!property) return ''
	// Support both "files" type (attachments) and "url" type
	if (property.files && property.files.length > 0) {
		const file = property.files[0]
		if (file.type === 'file' && file.file?.url) return file.file.url
		if (file.type === 'external' && file.external?.url) return file.external.url
	}
	return property.url || ''
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

function isValidPressRelease(pr: PressRelease): boolean {
	if (!pr.title) {
		console.warn(`Invalid press release: missing title`)
		return false
	}
	if (!pr.url) {
		console.warn(`Invalid press release: missing URL for "${pr.title}"`)
		return false
	}
	return true
}

function isValidLocalPressRelease(pr: LocalPressRelease): boolean {
	if (!pr.title) {
		console.warn(`Invalid local press release: missing title`)
		return false
	}
	if (!pr.url) {
		console.warn(`Invalid local press release: missing URL for "${pr.title}"`)
		return false
	}
	if (!pr.department) {
		console.warn(`Invalid local press release: missing department for "${pr.title}"`)
		return false
	}
	return true
}

function isValidPressCoverage(pc: PressCoverage): boolean {
	if (!pc.title) {
		console.warn(`Invalid press coverage: missing title`)
		return false
	}
	if (!pc.url) {
		console.warn(`Invalid press coverage: missing URL for "${pc.title}"`)
		return false
	}
	if (!pc.source) {
		console.warn(`Invalid press coverage: missing source for "${pc.title}"`)
		return false
	}
	return true
}

async function queryDatabase<T>(
	databaseId: string,
	mapper: (page: NotionPage) => T,
	options?: { sortBy?: string; sortDirection?: 'ascending' | 'descending' }
): Promise<T[]> {
	const apiKey = env.NOTION_API_KEY
	if (!apiKey || !databaseId) {
		console.warn('Notion API key or database ID not configured')
		return []
	}

	try {
		const body: { sorts?: Array<{ property: string; direction: string }> } = {}
		if (options?.sortBy) {
			body.sorts = [{ property: options.sortBy, direction: options.sortDirection ?? 'ascending' }]
		}

		const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Notion-Version': NOTION_API_VERSION,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
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

	const videos = await queryDatabase<Video | null>(
		databaseId,
		(page) => {
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
		},
		{ sortBy: 'Ordre' }
	)

	return videos.filter((v): v is Video => v !== null)
}

export async function getArticles(): Promise<Article[]> {
	const databaseId = env.NOTION_ARTICLES_DATABASE_ID
	if (!databaseId) return []

	const articles = await queryDatabase<Article | null>(
		databaseId,
		(page) => {
			const visible = getCheckbox(page.properties['Visible'])
			if (!visible) return null

			const typeValue = getSelect(page.properties['Type'])

			const title = getText(page.properties['Titre'])
			const article: Article = {
				id: page.id,
				title,
				slug: generateSlug(title),
				description: getText(page.properties['Description']),
				url: getUrl(page.properties['URL']),
				type: typeValue === 'Newsletter' ? 'Newsletter' : 'Article',
				order: getNumber(page.properties['Ordre']),
				visible,
				image: getFileUrl(page.properties['Image']) || undefined,
				date: getDate(page.properties['Date de publication']) || undefined
			}

			// Validate before returning
			return isValidArticle(article) ? article : null
		},
		{ sortBy: 'Date de publication', sortDirection: 'descending' }
	)

	return articles.filter((a): a is Article => a !== null)
}

export async function getNewsletters(): Promise<Article[]> {
	const articles = await getArticles()
	return articles.filter((a) => a.type === 'Newsletter')
}

export async function getNewsletterBySlug(slug: string): Promise<Article | null> {
	const newsletters = await getNewsletters()
	return newsletters.find((n) => n.slug === slug) || null
}

/**
 * Fetches newsletter HTML content from a CiviCRM mailing URL and extracts the body.
 * Returns cleaned HTML string, or null if fetch fails.
 */
export async function fetchNewsletterContent(url: string): Promise<string | null> {
	try {
		const response = await fetch(url, {
			headers: {
				'User-Agent':
					'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
				Accept: 'text/html,application/xhtml+xml'
			}
		})

		if (!response.ok) {
			console.error(`[Newsletter] HTTP ${response.status} for ${url}`)
			return null
		}

		const html = await response.text()

		const content = extractMailingContent(html)

		// Check if extracted content has meaningful text (strip tags and check length)
		const textOnly = content.replace(/<[^>]*>/g, '').trim()

		if (textOnly.length < 100) {
			console.warn(
				`[Newsletter] Content too short (${textOnly.length} chars text), raw HTML preview:`
			)
			console.warn(html.substring(0, 2000))
			console.warn('--- end preview ---')
		}

		return content
	} catch (error) {
		console.error('[Newsletter] Failed to fetch content:', error)
		return null
	}
}

/**
 * Extracts the newsletter body from a CiviCRM mailing view HTML page.
 * Tries multiple strategies to find the content.
 */
function extractMailingContent(html: string): string {
	// Strategy 1: Look for CiviCRM mailing body wrapper
	const bodyPatterns = [
		// CiviCRM mailing body container
		/<div[^>]*class="[^"]*crm-mailing-body[^"]*"[^>]*>([\s\S]*?)<\/div>\s*(?:<div[^>]*class="[^"]*crm-mailing-footer|$)/i,
		// The actual email content is often in a centered table
		/(<table[^>]*width="[56]\d{2}"[^>]*>[\s\S]*?<\/table>)\s*(?:<\/(?:div|td|body)>)/i,
		// CiviCRM view-content wrapper
		/<div[^>]*class="[^"]*view-content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/i,
		// Generic content wrapper in CiviCRM pages
		/<div[^>]*id="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*(?:<\/div>|<div[^>]*id="footer)/i
	]

	for (const pattern of bodyPatterns) {
		const match = html.match(pattern)
		if (match && match[1]) {
			const cleaned = cleanContent(match[1])
			const textOnly = cleaned.replace(/<[^>]*>/g, '').trim()
			if (textOnly.length > 100) {
				return cleaned
			}
		}
	}

	// Strategy 2: Extract full <body> content and clean it
	const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)
	if (bodyMatch && bodyMatch[1]) {
		return cleanContent(bodyMatch[1])
	}

	// Strategy 3: If no body tag, the response might already be the content
	if (html.length > 200 && !html.includes('<!DOCTYPE')) {
		return cleanContent(html)
	}

	console.warn(`[Newsletter] No extraction strategy matched`)
	return html
}

/**
 * Cleans extracted HTML content by removing CiviCRM chrome,
 * scripts, and fixing relative URLs.
 */
function cleanContent(html: string): string {
	let cleaned = html

	// Remove script tags
	cleaned = cleaned.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')

	// Remove style tags
	cleaned = cleaned.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')

	// Remove HTML comments
	cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '')

	// Remove head tag content if present
	cleaned = cleaned.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '')

	// Remove link, meta tags
	cleaned = cleaned.replace(/<(?:link|meta)[^>]*\/?>/gi, '')

	// Remove CiviCRM navigation/chrome elements
	cleaned = cleaned.replace(/<div[^>]*id="[^"]*crm-navigation[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')
	cleaned = cleaned.replace(/<div[^>]*class="[^"]*crm-breadcrumb[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '')

	// Remove unsubscribe/opt-out links section
	cleaned = cleaned.replace(/<[^>]*class="[^"]*opt-out[^"]*"[^>]*>[\s\S]*?<\/[^>]+>/gi, '')

	// Remove CiviCRM form elements
	cleaned = cleaned.replace(/<form[^>]*>[\s\S]*?<\/form>/gi, '')

	// Remove hidden elements
	cleaned = cleaned.replace(
		/<[^>]*style="[^"]*display\s*:\s*none[^"]*"[^>]*>[\s\S]*?<\/[^>]+>/gi,
		''
	)

	// --- Remove CiviCRM mailing footer ---
	// Cut everything from the org signature/footer block onwards.
	// Typical patterns: "Gérer mes préférences", org address, "Se désinscrire"
	// Look for the footer starting with the org name + address pattern
	const footerPatterns = [
		// "Gérer mes préférences" and everything after
		/[\s\S]*?G[ée]rer\s+mes\s+pr[ée]f[ée]rences[\s\S]*/i,
		// Organization address block and everything after
		/[\s\S]*?32\s+boulevard\s+de\s+Strasbourg[\s\S]*/i,
		// "Se désinscrire" link and everything after
		/[\s\S]*?[Ss]e\s+d[ée]sinscrire[\s\S]*/i
	]

	for (const pattern of footerPatterns) {
		const match = cleaned.match(pattern)
		if (match) {
			// Find the position of the footer text and cut from a reasonable point before it
			const footerText =
				match[0].match(
					/G[ée]rer\s+mes\s+pr[ée]f[ée]rences|32\s+boulevard\s+de\s+Strasbourg|[Ss]e\s+d[ée]sinscrire/i
				)?.[0] || ''
			const idx = cleaned.indexOf(footerText)
			if (idx > 0) {
				// Walk back to find the nearest table/div opening tag to cut cleanly
				const before = cleaned.substring(0, idx)
				// Find the last "Soutenir Pause IA" or similar section header before footer
				const soutenirIdx = before.lastIndexOf('Soutenir Pause IA')
				if (soutenirIdx > 0) {
					cleaned = cleaned.substring(0, soutenirIdx)
				} else {
					// Just cut at the footer text position
					cleaned = before
				}
				break
			}
		}
	}

	// Remove "View in browser" / "Lire dans le navigateur" text and links
	cleaned = cleaned.replace(
		/<a[^>]*>[^<]{0,100}(?:voir[^<]{0,30}navigateur|view[^<]{0,30}browser|lire[^<]{0,30}navigateur)[^<]{0,50}<\/a>/gi,
		''
	)

	// Remove unsubscribe / "Se désinscrire" links (in case any remain)
	cleaned = cleaned.replace(
		/<a[^>]*>[^<]{0,100}(?:d[eé]sinscri|unsubscribe|opt.?out)[^<]{0,50}<\/a>/gi,
		''
	)

	// Fix relative URLs to CiviCRM
	cleaned = cleaned.replace(
		/(?:src|href)="(?!http|mailto|#|data:)([^"]*)"/gi,
		(_match, path: string) => {
			const attr = _match.startsWith('src') ? 'src' : 'href'
			return `${attr}="https://civicrm.pauseia.fr/${path.replace(/^\//, '')}"`
		}
	)

	// --- Clean up spacing ---
	// Strip inline height attributes from table elements (spacer rows)
	cleaned = cleaned.replace(/(<(?:tr|td|th|table|div)[^>]*)\s+height="[^"]*"/gi, '$1')

	// Strip inline style padding/margin/height that create excessive spacing
	cleaned = cleaned.replace(/style="([^"]*)"/gi, (_match, styles: string) => {
		const filtered = styles
			.split(';')
			.filter((s: string) => {
				const prop = s.trim().toLowerCase()
				// Remove excessive spacing properties
				if (/^(padding|margin)(-top|-bottom)?\s*:/i.test(prop)) {
					// Keep small values (less than 15px), remove large ones
					const valueMatch = prop.match(/:\s*(\d+)/)
					if (valueMatch && parseInt(valueMatch[1]) > 15) return false
				}
				if (/^(height|min-height|line-height)\s*:/i.test(prop)) {
					const valueMatch = prop.match(/:\s*(\d+)/)
					if (valueMatch && parseInt(valueMatch[1]) > 30) return false
				}
				return true
			})
			.join(';')
		return filtered.trim() ? `style="${filtered}"` : ''
	})

	// Remove empty spacer elements (td/div/p with only &nbsp; or whitespace)
	cleaned = cleaned.replace(/<(td|div|p|span)[^>]*>(\s|&nbsp;|&#160;|\u00a0)*<\/\1>/gi, '')

	// Remove empty table rows
	cleaned = cleaned.replace(/<tr[^>]*>\s*<\/tr>/gi, '')

	// Remove <br> chains (more than 1 consecutive)
	cleaned = cleaned.replace(/(<br\s*\/?\s*>\s*){2,}/gi, '<br>')

	// Collapse multiple &nbsp;
	cleaned = cleaned.replace(/(&nbsp;\s*){3,}/gi, ' ')

	return cleaned.trim()
}

export async function getReports(): Promise<Report[]> {
	const databaseId = env.NOTION_REPORTS_DATABASE_ID
	if (!databaseId) return []

	const reports = await queryDatabase<Report | null>(
		databaseId,
		(page) => {
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
		},
		{ sortBy: 'Ordre' }
	)

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

export async function getPressReleases(): Promise<PressRelease[]> {
	const databaseId = env.NOTION_PRESS_DATABASE_ID
	if (!databaseId) return []

	const pressReleases = await queryDatabase<PressRelease | null>(
		databaseId,
		(page) => {
			const visible = getCheckbox(page.properties['Visible'])
			if (!visible) return null

			const pr: PressRelease = {
				id: page.id,
				title: getText(page.properties['Titre']),
				date: getDate(page.properties['Date']),
				url: getUrl(page.properties['URL']),
				description: getText(page.properties['Description']),
				order: getNumber(page.properties['Ordre']),
				visible
			}

			return isValidPressRelease(pr) ? pr : null
		},
		{ sortBy: 'Date', sortDirection: 'descending' }
	)

	return pressReleases.filter((pr): pr is PressRelease => pr !== null)
}

export async function getLocalPressReleases(): Promise<LocalPressRelease[]> {
	const databaseId = env.NOTION_LOCAL_PRESS_DATABASE_ID
	if (!databaseId) return []

	const pressReleases = await queryDatabase<LocalPressRelease | null>(
		databaseId,
		(page) => {
			const visible = getCheckbox(page.properties['Visible'])
			if (!visible) return null

			const pr: LocalPressRelease = {
				id: page.id,
				title: getText(page.properties['Titre']),
				date: getDate(page.properties['Date']),
				url: getUrl(page.properties['URL']),
				description: getText(page.properties['Description']),
				department: getText(page.properties['Département']),
				order: getNumber(page.properties['Ordre']),
				visible
			}

			return isValidLocalPressRelease(pr) ? pr : null
		},
		{ sortBy: 'Date', sortDirection: 'descending' }
	)

	return pressReleases.filter((pr): pr is LocalPressRelease => pr !== null)
}

export async function getPressCoverage(): Promise<PressCoverage[]> {
	const databaseId = env.NOTION_PRESS_COVERAGE_DATABASE_ID
	if (!databaseId) return []

	const items = await queryDatabase<PressCoverage | null>(
		databaseId,
		(page) => {
			const visible = getCheckbox(page.properties['Visible'])
			if (!visible) return null

			const pc: PressCoverage = {
				id: page.id,
				title: getText(page.properties['Titre']),
				source: getText(page.properties['Source']),
				date: getDate(page.properties['Date']),
				url: getUrl(page.properties['URL']),
				order: getNumber(page.properties['Ordre']),
				visible
			}

			return isValidPressCoverage(pc) ? pc : null
		},
		{ sortBy: 'Ordre' }
	)

	return items.filter((pc): pc is PressCoverage => pc !== null)
}

// Team members
export type TeamCategory = 'Direction' | 'Conseil scientifique' | 'Membre'

export interface TeamMember {
	id: string
	name: string
	role: string
	profession: string
	category: TeamCategory
	image: string
	order: number
	visible: boolean
}

function isValidTeamMember(member: TeamMember): boolean {
	if (!member.name) {
		console.warn(`Invalid team member: missing name`)
		return false
	}
	if (!member.category) {
		console.warn(`Invalid team member: missing category for "${member.name}"`)
		return false
	}
	return true
}

export async function getTeamMembers(): Promise<TeamMember[]> {
	const databaseId = env.NOTION_TEAM_DATABASE_ID
	if (!databaseId) return []

	const members = await queryDatabase<TeamMember | null>(
		databaseId,
		(page) => {
			const visible = getCheckbox(page.properties['Visible'])
			if (!visible) return null

			const categoryValue = getSelect(page.properties['Catégorie'])

			const member: TeamMember = {
				id: page.id,
				name: getText(page.properties['Nom']),
				role: getText(page.properties['Rôle']),
				profession: getText(page.properties['Profession']),
				category: (categoryValue as TeamCategory) || 'Membre',
				image: getFileUrl(page.properties['Photo']),
				order: getNumber(page.properties['Ordre']),
				visible
			}

			return isValidTeamMember(member) ? member : null
		},
		{ sortBy: 'Ordre' }
	)

	return members.filter((m): m is TeamMember => m !== null)
}
