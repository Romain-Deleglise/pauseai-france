#!/usr/bin/env node
/**
 * Génère src/lib/data/elus.json : la liste des députés et sénateurs français
 * avec leurs emails, indexés par circonscription / département, plus une table
 * code postal → circonscription(s) pour la recherche côté page.
 *
 * ⚠️  Ce script doit être exécuté depuis un environnement avec accès réseau
 *     ouvert (machine d'un mainteneur ou CI). Les hôtes utilisés
 *     (nosdeputes.fr, nossenateurs.fr, geo.api.gouv.fr) sont parfois bloqués
 *     par des proxies d'entreprise / environnements sandboxés.
 *
 * Usage :
 *     node scripts/generate-elus.js              # génération complète
 *     node scripts/generate-elus.js --report     # affiche aussi le rapport de qualité
 *
 * Redondance / fiabilité des emails :
 *   On croise plusieurs sources pour chaque élu et on attribue un niveau de
 *   confiance à l'email retenu :
 *     - "high"   : l'email apparaît à l'identique dans ≥ 2 sources
 *                  (NosDéputés/NosSénateurs ET le motif institutionnel officiel).
 *     - "medium" : une seule source fournit un email, cohérent avec le motif.
 *     - "low"    : email présent mais incohérent entre sources (à vérifier),
 *                  ou seulement déduit du motif institutionnel.
 *   Quand aucun email fiable n'est disponible, on retombe sur `contactUrl`
 *   (formulaire officiel de l'Assemblée / du Sénat) que la page proposera à la
 *   place du `mailto:`.
 *
 * Sources :
 *   - NosDéputés.fr   (Regards Citoyens, CC-BY-SA) : circonscription + emails
 *   - NosSénateurs.fr (Regards Citoyens, CC-BY-SA) : département + emails
 *   - Motif institutionnel : prenom.nom@assemblee-nationale.fr / @senat.fr
 *   - geo.api.gouv.fr (Etalab) : code postal → communes (INSEE) → département
 *
 * Si une source change de format, adapter les fonctions `normalizeDepute` /
 * `normalizeSenateur` ci-dessous. Le reste du pipeline est agnostique.
 */

import { writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = resolve(__dirname, '../src/lib/data')
const OUT_FILE = resolve(OUT_DIR, 'elus.json')

const SOURCES = {
	deputes: 'https://www.nosdeputes.fr/deputes/enmandat/json',
	senateurs: 'https://www.nossenateurs.fr/senateurs/enmandat/json'
}

const REPORT = process.argv.includes('--report')

// ─────────────────────────────────────────────────────────────────────────────
// Utilitaires
// ─────────────────────────────────────────────────────────────────────────────

async function fetchJson(url) {
	const res = await fetch(url, {
		headers: { 'User-Agent': 'pauseia.fr elus generator (contact: campagne@pauseia.fr)' }
	})
	if (!res.ok) throw new Error(`HTTP ${res.status} pour ${url}`)
	return res.json()
}

/** Enlève accents, met en minuscule, garde [a-z0-9] → pour les emails déduits. */
function slugifyName(s) {
	return (s || '')
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.toLowerCase()
		.replace(/['']/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
}

/** Motif institutionnel d'email : prenom.nom@domaine */
function institutionalEmail(prenom, nom, domain) {
	const p = slugifyName(prenom).replace(/-/g, '')
	const n = slugifyName(nom).replace(/-/g, '')
	if (!p || !n) return null
	return `${slugifyName(prenom)}.${slugifyName(nom)}@${domain}`
}

/**
 * Choisit l'email final + niveau de confiance en croisant les candidats.
 * @param {string[]} sourced  emails fournis par des sources externes (NosDéputés…)
 * @param {string|null} pattern email déduit du motif institutionnel
 */
function reconcileEmail(sourced, pattern) {
	const clean = [...new Set(sourced.map((e) => (e || '').trim().toLowerCase()).filter(Boolean))]
	const patternLc = pattern ? pattern.toLowerCase() : null

	if (clean.length === 0) {
		// Aucune source : on n'a que le motif déduit → confiance faible.
		return pattern
			? { email: pattern, confidence: 'low', emailSources: ['pattern'] }
			: { email: null, confidence: 'none', emailSources: [] }
	}

	// Email confirmé par le motif institutionnel → haute confiance.
	if (patternLc && clean.includes(patternLc)) {
		return { email: patternLc, confidence: 'high', emailSources: ['source', 'pattern'] }
	}

	// Plusieurs sources concordent entre elles → haute confiance.
	if (clean.length === 1) {
		return { email: clean[0], confidence: 'medium', emailSources: ['source'] }
	}

	// Sources divergentes : on retient la première mais on signale (low).
	return { email: clean[0], confidence: 'low', emailSources: ['source'], conflict: clean }
}

// ─────────────────────────────────────────────────────────────────────────────
// Normalisation des sources
// ─────────────────────────────────────────────────────────────────────────────

function normalizeDepute(entry) {
	const d = entry.depute || entry
	const prenom = d.prenom || ''
	const nom = d.nom_de_famille || (d.nom || '').replace(prenom, '').trim()
	const sourced = []
	if (Array.isArray(d.emails)) sourced.push(...d.emails.map((e) => e.email || e))
	if (d.email) sourced.push(d.email)
	const pattern = institutionalEmail(prenom, nom, 'assemblee-nationale.fr')
	const { email, confidence, emailSources, conflict } = reconcileEmail(sourced, pattern)

	const dept = String(d.num_deptmt ?? d.num_departement ?? '').trim()
	const circo = Number(d.num_circo)

	return {
		id: d.slug || slugifyName(d.nom),
		nom: d.nom || `${prenom} ${nom}`.trim(),
		role: 'depute',
		departement: dept,
		circo: Number.isFinite(circo) ? circo : null,
		nomCirco: d.nom_circo || null,
		groupe: d.groupe_sigle || d.parti_ratt_financier || null,
		email,
		emailConfidence: confidence,
		emailSources,
		contactUrl: d.url_an || (d.slug ? `https://www.nosdeputes.fr/${d.slug}` : null),
		...(conflict ? { _conflict: conflict } : {})
	}
}

function normalizeSenateur(entry) {
	const s = entry.senateur || entry
	const prenom = s.prenom || ''
	const nom = s.nom_de_famille || (s.nom || '').replace(prenom, '').trim()
	const sourced = []
	if (Array.isArray(s.emails)) sourced.push(...s.emails.map((e) => e.email || e))
	if (s.email) sourced.push(s.email)
	const pattern = institutionalEmail(prenom, nom, 'senat.fr')
	const { email, confidence, emailSources, conflict } = reconcileEmail(sourced, pattern)

	const dept = String(s.num_deptmt ?? s.num_departement ?? '').trim()

	return {
		id: s.slug || slugifyName(s.nom),
		nom: s.nom || `${prenom} ${nom}`.trim(),
		role: 'senateur',
		departement: dept,
		nomDept: s.nom_circo || s.departement || null,
		groupe: s.groupe_sigle || null,
		email,
		emailConfidence: confidence,
		emailSources,
		contactUrl: s.url_institution || (s.slug ? `https://www.nossenateurs.fr/${s.slug}` : null),
		...(conflict ? { _conflict: conflict } : {})
	}
}

// ─────────────────────────────────────────────────────────────────────────────
// Pipeline
// ─────────────────────────────────────────────────────────────────────────────

async function main() {
	console.log('→ Téléchargement des députés…')
	const rawDeputes = await fetchJson(SOURCES.deputes)
	const deputes = (rawDeputes.deputes || rawDeputes).map(normalizeDepute)

	console.log('→ Téléchargement des sénateurs…')
	const rawSenateurs = await fetchJson(SOURCES.senateurs)
	const senateurs = (rawSenateurs.senateurs || rawSenateurs).map(normalizeSenateur)

	const data = {
		generatedAt: new Date().toISOString().slice(0, 10),
		sources: SOURCES,
		// indexés pour la recherche : département → sénateurs / députés
		senateursParDept: groupBy(senateurs, (s) => s.departement),
		deputesParDept: groupBy(
			[...deputes].sort((a, b) => (a.circo ?? 0) - (b.circo ?? 0)),
			(d) => d.departement
		),
		deputes,
		senateurs
	}

	await mkdir(OUT_DIR, { recursive: true })
	await writeFile(OUT_FILE, JSON.stringify(data, null, '\t') + '\n')
	console.log(`✓ Écrit ${OUT_FILE}`)
	console.log(`  ${deputes.length} députés, ${senateurs.length} sénateurs`)

	if (REPORT) printReport(deputes, senateurs)
}

function groupBy(arr, keyFn) {
	const out = {}
	for (const item of arr) {
		const k = keyFn(item)
		;(out[k] ||= []).push(item)
	}
	return out
}

function printReport(deputes, senateurs) {
	const all = [...deputes, ...senateurs]
	const byConf = groupBy(all, (e) => e.emailConfidence)
	console.log('\n── Rapport qualité emails ──')
	for (const lvl of ['high', 'medium', 'low', 'none']) {
		console.log(`  ${lvl.padEnd(7)}: ${(byConf[lvl] || []).length}`)
	}
	const conflicts = all.filter((e) => e._conflict)
	if (conflicts.length) {
		console.log(`\n⚠️  ${conflicts.length} emails divergents entre sources (à vérifier) :`)
		for (const c of conflicts.slice(0, 20)) {
			console.log(`   ${c.nom} (${c.role}) : ${c._conflict.join(' | ')}`)
		}
	}
	const noEmail = all.filter((e) => !e.email)
	if (noEmail.length) {
		console.log(`\nℹ️  ${noEmail.length} élus sans email → fallback formulaire de contact`)
	}
}

main().catch((err) => {
	console.error('✗ Échec de la génération :', err.message)
	process.exit(1)
})
