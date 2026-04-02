import * as config from '$config'
import { getNewsletters } from '$lib/notion'

export const prerender = false

export async function GET() {
	const newsletters = await getNewsletters()

	const headers = {
		'Content-Type': 'application/rss+xml',
		'Cache-Control': 'max-age=3600'
	}

	const items = newsletters
		.filter((n) => n.visible)
		.map(
			(n) => `
		<item>
			<title><![CDATA[${n.title}]]></title>
			<link>${config.url}/newsletters/${n.slug}</link>
			<guid isPermaLink="true">${config.url}/newsletters/${n.slug}</guid>
			${n.description ? `<description><![CDATA[${n.description}]]></description>` : ''}
			${n.date ? `<pubDate>${new Date(n.date).toUTCString()}</pubDate>` : ''}
		</item>`
		)
		.join('')

	const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>Pause IA - Newsletters</title>
		<description>Les newsletters de Pause IA</description>
		<link>${config.url}/newsletters</link>
		<atom:link href="${config.url}/rss/newsletters.xml" rel="self" type="application/rss+xml" />
		<language>fr</language>
		${items}
	</channel>
</rss>`.trim()

	return new Response(xml, { headers })
}
