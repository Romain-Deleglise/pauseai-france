/**
 * Signataires de la tribune (page /fr/tribune-signataires, raccourci
 * pauseia.fr/signataires).
 *
 * La page n'affiche que cette liste, dans l'ordre ci-dessous. Tant qu'elle est
 * vide, la page indique que la liste est en cours de finalisation.
 *
 * Exemple :
 *   { nom: 'Prénom Nom', qualite: 'chercheuse en informatique, CNRS' },
 *   { nom: 'Prénom Nom' },
 */
export interface Signataire {
	nom: string
	/** Fonction, titre ou affiliation, affichée après le nom (facultatif). */
	qualite?: string
}

/** Date d'édition de la liste (AAAA-MM-JJ), affichée en haut de la page. */
export const miseAJour = '2026-10-16'

/** Titre de la tribune, affiché sous le titre de la page s'il est renseigné. */
export const tribuneTitre = ''

export const signataires: Signataire[] = []
