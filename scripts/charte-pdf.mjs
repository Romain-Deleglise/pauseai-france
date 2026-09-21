// Génère docs/charte-graphique.pdf à partir de docs/charte-graphique.html.
//
//   node scripts/charte-pdf.mjs
//
// Playwright n'est pas une dépendance du projet : si le script échoue faute de
// navigateur, ouvrir le HTML dans un navigateur et imprimer en PDF donne le
// même résultat (A4, marges par défaut, fonds d'impression activés).
import { chromium } from 'playwright'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const source = resolve(here, '../docs/charte-graphique.html')
const output = resolve(here, '../docs/charte-graphique.pdf')

const browser = await chromium.launch()
const page = await browser.newPage()
await page.goto(`file://${source}`, { waitUntil: 'networkidle' })
await page.emulateMedia({ media: 'print' })
await page.pdf({
	path: output,
	format: 'A4',
	printBackground: true,
	displayHeaderFooter: true,
	headerTemplate: '<span></span>',
	footerTemplate: `<div style="width:100%;font-family:sans-serif;font-size:7pt;color:#676e7a;padding:0 14mm;display:flex;justify-content:space-between;">
		<span>Charte graphique — Pause IA</span><span class="pageNumber"></span>
	</div>`,
	margin: { top: '16mm', right: '14mm', bottom: '18mm', left: '14mm' }
})
await browser.close()
console.log(`PDF écrit : ${output}`)
