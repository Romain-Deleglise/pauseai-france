#!/usr/bin/env node
/**
 * Génère docs/plan-du-site.md : l'arborescence RÉELLE du site.
 *
 * Tout est lu dans le dépôt, jamais saisi à la main — le document ne peut donc
 * pas diverger du site :
 *   - les pages          : src/routes/**\/+page.svelte|md
 *   - le menu principal  : navGroups dans src/lib/components/Header.svelte
 *   - le pied de page    : les colonnes de src/lib/components/Footer.svelte
 *   - les libellés       : src/lib/i18n/fr.ts
 *   - les articles       : src/posts/**\/*.md
 *
 * Il signale les PAGES ORPHELINES : en ligne, mais qu'aucun menu ni pied de
 * page n'atteint. C'est la matière des tâches « harmoniser menu et pied de
 * page » et « trier les versions anglaises ».
 *
 * Usage : node scripts/plan-du-site.mjs
 */
import { readFile, writeFile, readdir } from 'node:fs/promises'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const RACINE = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SORTIE = join(RACINE, 'docs/plan-du-site.md')

const lire = (p) => readFile(join(RACINE, p), 'utf8')

async function parcourir(dir, filtre, acc = []) {
	for (const e of await readdir(join(RACINE, dir), { withFileTypes: true })) {
		const p = `${dir}/${e.name}`
		if (e.isDirectory()) await parcourir(p, filtre, acc)
		else if (filtre(e.name)) acc.push(p)
	}
	return acc
}

/** Libellés français, extraits de i18n/fr.ts (nav.* et footer.*). */
async function libelles() {
	const src = await lire('src/lib/i18n/fr.ts')
	const out = {}
	for (const bloc of ['nav', 'footer']) {
		const i = src.indexOf(`\t${bloc}: {`)
		if (i < 0) continue
		const fin = src.indexOf('\n\t},', i)
		for (const m of src.slice(i, fin).matchAll(/^\t\t(\w+):\s*'((?:[^'\\]|\\.)*)'/gm)) {
			out[`${bloc}.${m[1]}`] = m[2].replace(/\\'/g, "'")
		}
	}
	return out
}

/** Pages réelles, chemin sans préfixe de langue. */
async function pages() {
	const fichiers = await parcourir('src/routes', (n) => n === '+page.svelte' || n === '+page.md')
	return fichiers
		.map((f) =>
			f
				.replace('src/routes', '')
				.replace(/\/\+page\.(svelte|md)$/, '')
				.replace('/[lang=lang]', '')
		)
		.map((p) => p || '/')
		.filter((p) => !p.startsWith('/api'))
		.sort()
}

/** Groupes du menu principal, dans l'ordre d'affichage. */
async function menu(lib) {
	const src = await lire('src/lib/components/Header.svelte')
	const bloc = src.slice(src.indexOf('navGroups = ['), src.indexOf('\n\t// Language switcher'))
	const groupes = []
	for (const g of bloc.matchAll(
		/\{\s*id: '([^']+)',\s*label: t\.(nav\.\w+),\s*items: \[([\s\S]*?)\n\t\t\t\]/g
	)) {
		const items = []
		for (const i of g[3].matchAll(
			/href:\s*(?:`\$\{prefix\}([^`]*)`|'([^']+)'),\s*label: t\.(nav\.\w+)(,\s*external: true)?/g
		)) {
			items.push({
				href: i[1] ?? i[2],
				label: lib[i[3]] ?? i[3],
				externe: Boolean(i[4]) || Boolean(i[2])
			})
		}
		groupes.push({ label: lib[g[2]] ?? g[2], items })
	}
	return groupes
}

/** Colonnes du pied de page. */
async function pied(lib) {
	const src = await lire('src/lib/components/Footer.svelte')
	const colonnes = []
	const parts = src.split(/<h2>\{t\.(footer\.\w+)\}<\/h2>/).slice(1)
	for (let k = 0; k < parts.length; k += 2) {
		const liens = []
		for (const m of parts[k + 1].matchAll(
			/href=(?:"\{prefix\}([^"]*)"|"(https?:[^"]*)")[\s\S]{0,120}?\{t\.(footer\.\w+)\}/g
		)) {
			liens.push({ href: m[1] ?? m[2], label: lib[m[3]] ?? m[3], externe: Boolean(m[2]) })
		}
		if (liens.length) colonnes.push({ label: lib[parts[k]] ?? parts[k], liens })
	}
	return colonnes
}

/** Articles de src/posts, avec leur titre de frontmatter. */
async function articles() {
	const fichiers = await parcourir('src/posts', (n) => n.endsWith('.md'))
	const out = []
	for (const f of fichiers) {
		const t = (await lire(f)).match(/^title:\s*(.+)$/m)
		out.push({
			slug: '/' + f.replace('src/posts/', '').replace(/\.md$/, ''),
			titre: t ? t[1].trim().replace(/^['"]|['"]$/g, '') : '—'
		})
	}
	return out.sort((a, b) => a.slug.localeCompare(b.slug))
}

// Compteur plutôt qu'un hachage du libellé : deux entrées du même groupe
// produisaient le même identifiant tronqué, et Mermaid fusionnait les nœuds.
let compteur = 0
const id = () => 'n' + ++compteur
const echap = (s) => s.replace(/"/g, "'")

const toutes = await Promise.all([libelles(), pages(), articles()])
const [lib, listePages, listeArticles] = toutes
const groupes = await menu(lib)
const colonnes = await pied(lib)

// Pages atteignables depuis le menu ou le pied de page.
const atteignables = new Set()
for (const g of groupes)
	for (const i of g.items) if (!i.externe) atteignables.add(i.href.split('#')[0] || '/')
for (const c of colonnes)
	for (const l of c.liens) if (!l.externe) atteignables.add(l.href.split('#')[0] || '/')
atteignables.add('/')

const dynamiques = listePages.filter((p) => p.includes('['))
const statiques = listePages.filter((p) => !p.includes('['))
const orphelines = statiques.filter((p) => !atteignables.has(p))

// ── Diagramme ────────────────────────────────────────────────────────────────
const l = []
l.push('```mermaid')
l.push('flowchart LR')
l.push('  accueil(["Accueil /"])')
for (const [k, g] of groupes.entries()) {
	const gid = 'g' + k
	l.push(`  accueil --> ${gid}["${echap(g.label)}"]`)
	for (const i of g.items) {
		const n = id()
		l.push(
			`  ${gid} --> ${n}["${echap(i.label)}${i.externe ? ' ↗' : ''}<br/><small>${echap(i.externe ? 'site externe' : i.href)}</small>"]`
		)
		if (i.externe) l.push(`  class ${n} externe`)
	}
}
if (orphelines.length) {
	l.push('  accueil -.-> orph["Hors menu"]')
	for (const p of orphelines) {
		const n = id()
		l.push(`  orph -.-> ${n}["${echap(p)}"]`)
		l.push(`  class ${n} orpheline`)
	}
}
l.push('  classDef externe stroke-dasharray: 4 3')
l.push('  classDef orpheline fill:#fff5e8,stroke:#ff9416')
l.push('```')
const diagramme = l.join('\n')

// ── Document ─────────────────────────────────────────────────────────────────
const d = []
d.push('# Plan du site — pauseia.fr')
d.push('')
d.push('> **Document généré.** Ne pas le modifier à la main : relancer')
d.push('> `pnpm run plan-du-site`. Il est reconstruit à partir des routes,')
d.push('> du menu principal, du pied de page et des articles du dépôt, donc il ne')
d.push('> peut pas diverger du site.')
d.push('>')
d.push(`> Dernière génération : ${new Date().toISOString().slice(0, 10)}.`)
d.push('')
d.push('Ce document décrit le site **réel**. Le plan *souhaité* est une décision')
d.push("d'équipe et se tient ailleurs.")
d.push('')
d.push('## En un coup d’œil')
d.push('')
d.push(
	`- **${statiques.length} pages** (hors routes dynamiques), chacune en français et en anglais via le préfixe \`/fr\` ou \`/en\``
)
d.push(`- **${dynamiques.length} gabarits dynamiques** (articles, campagnes, dangers…)`)
d.push(`- **${listeArticles.length} articles** en Markdown dans \`src/posts\``)
d.push(
	`- **${orphelines.length} pages hors menu** : en ligne, mais qu’aucun menu ni pied de page n’atteint`
)
d.push('')
d.push('## Arborescence depuis le menu principal')
d.push('')
d.push('Les pages en pointillés sortent du site. Les pages orangées existent mais')
d.push('ne sont atteignables par aucun menu.')
d.push('')
d.push(diagramme)
d.push('')
d.push('## Menu principal')
d.push('')
for (const g of groupes) {
	d.push(`### ${g.label}`)
	d.push('')
	d.push('| Page | Chemin |')
	d.push('| --- | --- |')
	for (const i of g.items)
		d.push(`| ${i.label} | ${i.externe ? `_externe_ — ${i.href}` : `\`${i.href}\``} |`)
	d.push('')
}
d.push('## Pied de page')
d.push('')
for (const c of colonnes) {
	d.push(`### ${c.label}`)
	d.push('')
	d.push('| Lien | Chemin |')
	d.push('| --- | --- |')
	for (const x of c.liens)
		d.push(`| ${x.label} | ${x.externe ? `_externe_ — ${x.href}` : `\`${x.href}\``} |`)
	d.push('')
}
d.push('## Pages hors menu')
d.push('')
if (orphelines.length) {
	d.push('Ces pages sont en ligne et indexées, mais aucun menu ni pied de page n’y')
	d.push('mène. Soit elles méritent une entrée, soit elles sont à retirer — c’est la')
	d.push('matière des tâches « harmoniser menu et pied de page » et « trier les')
	d.push('versions anglaises ». Certaines sont normales : pages d’atterrissage de')
	d.push('campagne, confirmations, remerciements.')
	d.push('')
	for (const p of orphelines) d.push(`- \`${p}\``)
} else {
	d.push('Aucune : toutes les pages sont atteignables depuis le menu ou le pied de page.')
}
d.push('')
d.push('## Gabarits dynamiques')
d.push('')
d.push('Une seule route sert toutes les pages d’une famille ; le contenu vient de')
d.push('`src/posts` ou d’une source de données.')
d.push('')
for (const p of dynamiques) d.push(`- \`${p}\``)
d.push('')
d.push('## Articles')
d.push('')
d.push('| Titre | Fichier |')
d.push('| --- | --- |')
for (const a of listeArticles) d.push(`| ${a.titre} | \`src/posts${a.slug}.md\` |`)
d.push('')

// Formaté par Prettier avant écriture : sans cela, `pnpm lint` échouait après
// chaque génération, quel que soit le point d'entrée utilisé.
const brut = d.join('\n') + '\n'
let final = brut
try {
	const prettier = await import('prettier')
	const conf = (await prettier.resolveConfig(SORTIE)) ?? {}
	final = await prettier.format(brut, { ...conf, filepath: SORTIE })
} catch {
	console.warn('⚠️  Prettier indisponible : document écrit sans mise en forme.')
}
await writeFile(SORTIE, final)
console.log(
	`✓ docs/plan-du-site.md — ${statiques.length} pages, ${orphelines.length} hors menu, ${listeArticles.length} articles`
)
