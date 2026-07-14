#!/usr/bin/env node
/**
 * Découpe le GeoJSON national des circonscriptions législatives (source
 * data.gouv « Contours géographiques des circonscriptions législatives », p20)
 * en un fichier léger PAR DÉPARTEMENT dans static/circo-geo/<dept>.json.
 *
 * Objectif : au runtime, la page « écrire à mes élus » ne charge QUE le
 * département concerné (connu via le code postal), et seulement dans le cas
 * ambigu (un code postal couvrant plusieurs circonscriptions). Charge donc
 * quelques dizaines/centaines de Ko une seule fois, sur action.
 *
 * Chaque feature de sortie ne garde que { circo: <int> } + la géométrie, avec
 * les coordonnées arrondies (précision ~1 m) pour alléger sans nuire au
 * point-in-polygon à l'échelle d'une ville.
 *
 * Source (à régénérer au prochain redécoupage) :
 *   https://www.data.gouv.fr/datasets/contours-geographiques-des-circonscriptions-legislatives
 *   → ressource GeoJSON « p20 », déposée dans scripts/data/.
 *
 * Usage : node scripts/build-circo-geo.js
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const SRC = path.join(ROOT, 'scripts/data/circonscriptions-legislatives-p20.geojson')
const OUT_DIR = path.join(ROOT, 'static/circo-geo')

// Codes « Z » du fichier électoral → codes département INSEE (utilisés par les
// données élus et le géocodage code postal). Complété pour l'outre-mer présent.
const Z_TO_INSEE = {
	ZA: '971', // Guadeloupe
	ZB: '972', // Martinique
	ZC: '973', // Guyane
	ZD: '974', // La Réunion
	ZM: '976', // Mayotte
	ZS: '975', // Saint-Pierre-et-Miquelon
	ZN: '988', // Nouvelle-Calédonie
	ZP: '987', // Polynésie française
	ZW: '986' // Wallis-et-Futuna
}

const DECIMALS = 5 // ~1,1 m : largement suffisant à l'échelle d'une circonscription

/** Arrondit récursivement toutes les coordonnées d'une géométrie. */
function roundCoords(c) {
	if (typeof c === 'number') return Math.round(c * 10 ** DECIMALS) / 10 ** DECIMALS
	return c.map(roundCoords)
}

function main() {
	if (!fs.existsSync(SRC)) {
		console.error(`✗ Source introuvable : ${SRC}`)
		console.error('  Téléchargez le GeoJSON « p20 » depuis data.gouv et déposez-le ici.')
		process.exit(1)
	}
	const data = JSON.parse(fs.readFileSync(SRC, 'utf8'))
	const byDept = new Map()

	for (const f of data.features) {
		const p = f.properties || {}
		const rawDept = p.codeDepartement
		const cc = p.codeCirconscription
		if (!rawDept || !cc) continue
		const dept = Z_TO_INSEE[rawDept] ?? rawDept
		const circo = parseInt(cc.slice(rawDept.length), 10)
		if (Number.isNaN(circo)) {
			console.warn(`⚠ circo illisible pour ${cc} (dept ${rawDept}) — ignorée`)
			continue
		}
		if (!byDept.has(dept)) byDept.set(dept, [])
		byDept.get(dept).push({
			type: 'Feature',
			properties: { circo },
			geometry: { type: f.geometry.type, coordinates: roundCoords(f.geometry.coordinates) }
		})
	}

	fs.mkdirSync(OUT_DIR, { recursive: true })
	// Nettoyage des anciens fichiers pour éviter les orphelins.
	for (const file of fs.readdirSync(OUT_DIR)) {
		if (file.endsWith('.json')) fs.unlinkSync(path.join(OUT_DIR, file))
	}

	let total = 0
	let maxName = ''
	let maxSize = 0
	const depts = [...byDept.keys()].sort()
	for (const dept of depts) {
		const fc = { type: 'FeatureCollection', features: byDept.get(dept) }
		const out = path.join(OUT_DIR, `${dept}.json`)
		fs.writeFileSync(out, JSON.stringify(fc))
		const size = fs.statSync(out).size
		total += size
		if (size > maxSize) {
			maxSize = size
			maxName = dept
		}
	}

	console.log(`✓ ${depts.length} départements écrits dans static/circo-geo/`)
	console.log(`  Total : ${(total / 1e6).toFixed(2)} Mo`)
	console.log(`  Plus gros : ${maxName}.json = ${(maxSize / 1024).toFixed(0)} Ko`)
	console.log(`  Moyen : ${(total / depts.length / 1024).toFixed(0)} Ko/département`)
}

main()
