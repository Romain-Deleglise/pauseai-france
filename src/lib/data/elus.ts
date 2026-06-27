// Accès aux données des élus (députés + sénateurs) pour la page « Écrire à mes élus ».
//
// Le fichier elus.json est généré par `node scripts/generate-elus.js` à partir
// de sources ouvertes (NosDéputés / NosSénateurs), avec croisement des emails.
// Voir l'en-tête du script pour le détail des niveaux de confiance.
//
// La résolution se fait au niveau DÉPARTEMENT : on déduit le département du code
// postal (déterministe, sans appel réseau au runtime), puis on présente les
// sénateurs du département (élus au département) et les députés du département
// (l'utilisateur choisit sa circonscription dans la liste, identifiée par nom).

import eluxData from './elus.json'

export type EmailConfidence = 'high' | 'medium' | 'low' | 'none'

export interface Elu {
	id: string
	nom: string
	role: 'depute' | 'senateur'
	departement: string
	circo?: number | null
	nomCirco?: string | null
	nomDept?: string | null
	groupe?: string | null
	email: string | null
	emailConfidence: EmailConfidence
	emailSources: string[]
	contactUrl: string | null
}

interface ElusData {
	generatedAt: string
	sample?: boolean
	senateursParDept: Record<string, Elu[] | undefined>
	deputesParDept: Record<string, Elu[] | undefined>
	deputes: Elu[]
	senateurs: Elu[]
}

const data = eluxData as unknown as ElusData

export const generatedAt = data.generatedAt
export const isSampleData = data.sample === true

/**
 * Déduit le ou les départements à partir d'un code postal français.
 * Renvoie plusieurs départements pour la Corse (20 → 2A/2B, ambigu sur le seul
 * code postal). Renvoie [] si le code postal est invalide.
 */
export function departementsFromCodePostal(cp: string): string[] {
	const clean = (cp || '').replace(/\s/g, '')
	if (!/^\d{5}$/.test(clean)) return []

	// Outre-mer et collectivités : département sur 3 chiffres (97x / 98x).
	if (clean.startsWith('97') || clean.startsWith('98')) {
		return [clean.slice(0, 3)]
	}

	const deux = clean.slice(0, 2)

	// Corse : ambigu sur le seul code postal → on propose les deux départements.
	if (deux === '20') return ['2A', '2B']

	return [deux]
}

export interface LookupResult {
	departements: string[]
	senateurs: Elu[]
	deputes: Elu[]
}

/** Renvoie tous les élus (sénateurs + députés) pour un code postal donné. */
export function lookupElus(codePostal: string): LookupResult | null {
	const depts = departementsFromCodePostal(codePostal)
	if (depts.length === 0) return null

	const senateurs: Elu[] = []
	const deputes: Elu[] = []
	for (const dept of depts) {
		senateurs.push(...(data.senateursParDept[dept] ?? []))
		deputes.push(...(data.deputesParDept[dept] ?? []))
	}
	if (senateurs.length === 0 && deputes.length === 0) return null

	return { departements: depts, senateurs, deputes }
}
