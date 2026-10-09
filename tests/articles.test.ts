import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'

/* Convention d'URL des articles : /{lang}/articles/AAAA-MM-JJ-slug
   Un test plutôt qu'une ligne de documentation : la règle ne tient que si elle
   est vérifiée. Le jour où quelqu'un dépose « mon-article.md », la CI le dit. */

const DOSSIERS = ['src/posts/articles', 'src/posts/en/articles']
const NOM = /^(\d{4}-\d{2}-\d{2})-[a-z0-9]+(-[a-z0-9]+)*\.md$/

const fichiers = DOSSIERS.filter((d) => existsSync(d)).flatMap((d) =>
	readdirSync(d)
		.filter((f) => f.endsWith('.md'))
		.map((f) => ({ dossier: d, nom: f }))
)

describe('convention de nommage des articles', () => {
	it('il existe des articles à vérifier', () => {
		expect(fichiers.length).toBeGreaterThan(0)
	})

	it.each(fichiers)('$dossier/$nom suit AAAA-MM-JJ-slug', ({ nom }) => {
		expect(nom).toMatch(NOM)
	})

	it.each(fichiers)('$nom : la date du nom est celle du frontmatter', ({ dossier, nom }) => {
		const dateNom = nom.match(NOM)?.[1]
		const contenu = readFileSync(join(dossier, nom), 'utf8')
		const dateMeta = contenu.match(/^date:\s*'?(\d{4}-\d{2}-\d{2})'?/m)?.[1]
		expect(dateMeta, `${nom} n'a pas de date dans son frontmatter`).toBeDefined()
		expect(dateMeta).toBe(dateNom)
	})

	it('aucun article n’est resté à la racine de src/posts', () => {
		// Les pages institutionnelles y restent ; un fichier daté, non.
		const egares = readdirSync('src/posts')
			.filter((f) => f.endsWith('.md'))
			.filter((f) => /^date:/m.test(readFileSync(join('src/posts', f), 'utf8')))
			.filter((f) => !f.startsWith('waitbutwhy')) // pages de démonstration
		expect(egares).toEqual([])
	})
})
