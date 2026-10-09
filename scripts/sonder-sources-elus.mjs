#!/usr/bin/env node
// @ts-nocheck
/*
 * Cherche sur data.gouv.fr les jeux de données susceptibles de remplacer le
 * fichier ODSEN du Sénat, fermé derrière une authentification en octobre 2026.
 *
 * À LANCER DEPUIS UNE MACHINE QUI A ACCÈS À INTERNET :
 *     node scripts/sonder-sources-elus.mjs
 *
 * N'écrit rien et ne modifie rien : il liste les jeux trouvés et, pour chacun,
 * ses fichiers téléchargeables avec leur format et leur date de mise à jour.
 * Pour les fichiers tabulaires de taille raisonnable, il lit l'en-tête et dit
 * s'il contient une colonne d'adresse électronique, c'est le critère qui
 * décide, le garde-fou exigeant 80 % de sénateurs avec e-mail.
 */
const API = 'https://www.data.gouv.fr/api/1'
const RECHERCHES = ['sénateurs', 'senat', 'parlementaires', 'répertoire national des élus']
const UA = { 'User-Agent': 'pauseia.fr elus source finder (contact: campagne@pauseia.fr)' }
const MOTS_MAIL = [
	'mail',
	'courriel',
	'courrier electronique',
	'courrier électronique',
	'email',
	'e-mail'
]

const sansAccent = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

async function jget(url) {
	const r = await fetch(url, { headers: UA })
	if (!r.ok) throw new Error(`HTTP ${r.status}`)
	return r.json()
}

/** Lit le début d'un fichier tabulaire et renvoie son en-tête. */
async function entete(url) {
	try {
		const r = await fetch(url, { headers: { ...UA, Range: 'bytes=0-8000' } })
		if (!r.ok) return null
		const buf = await r.arrayBuffer()
		let texte
		try {
			texte = new TextDecoder('utf-8', { fatal: true }).decode(buf)
		} catch {
			texte = new TextDecoder('latin1').decode(buf)
		}
		if (/^\s*(<!doctype|<html)/i.test(texte)) return 'PAGE HTML, pas un fichier de données'
		const ligne = texte.split(/\r?\n/).find((l) => l && !l.startsWith('%') && !l.startsWith('#'))
		return ligne ? ligne.slice(0, 400) : null
	} catch {
		return null
	}
}

const vus = new Set()
for (const q of RECHERCHES) {
	let data
	try {
		data = await jget(`${API}/datasets/?q=${encodeURIComponent(q)}&page_size=6`)
	} catch (e) {
		console.log(`\n### « ${q} » → échec : ${e.message}`)
		continue
	}
	console.log(`\n${'═'.repeat(72)}\n### Recherche « ${q} », ${data.total ?? '?'} résultats\n`)
	for (const d of data.data ?? []) {
		if (vus.has(d.id)) continue
		vus.add(d.id)
		console.log(`▸ ${d.title}`)
		console.log(`  organisation : ${d.organization?.name ?? d.owner?.first_name ?? ' '}`)
		console.log(`  mis à jour   : ${(d.last_update || '').slice(0, 10)}`)
		console.log(`  page         : ${d.page}`)
		const fichiers = (d.resources ?? []).filter((r) =>
			['csv', 'json', 'xlsx', 'tsv'].includes((r.format || '').toLowerCase())
		)
		if (!fichiers.length) {
			console.log('  (aucun fichier csv/json/xlsx)')
			continue
		}
		for (const r of fichiers.slice(0, 5)) {
			console.log(`   • [${(r.format || '').toUpperCase()}] ${r.title}`)
			console.log(`     ${r.url}`)
			const h = await entete(r.url)
			if (h) {
				const mail = MOTS_MAIL.some((m) => sansAccent(h).includes(m))
				console.log(`     en-tête : ${h}`)
				console.log(`     e-mail dans l'en-tête : ${mail ? 'OUI ✅' : 'non'}`)
			}
		}
		console.log()
	}
}
console.log(
	'\nCollez cette sortie dans la conversation : le critère qui décide est\n' +
		'« liste des sénateurs en exercice » + « e-mail dans l’en-tête : OUI ».'
)
