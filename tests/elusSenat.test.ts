import { describe, it, expect } from 'vitest'
// @ts-expect-error — script Node sans types, importé pour sa fonction pure.
import { analyserSenateurs } from '../scripts/generate-elus.js'

/* Le fichier ODSEN du Sénat a fait tomber la mise à jour des élus avec
   « nombre de sénateurs suspect : 0 » : l'analyse renvoyait zéro ligne sans
   lever d'erreur. Ces tests fixent les variations que le parseur doit absorber,
   et surtout celles sur lesquelles il doit échouer EN NOMMANT la cause. */

const ENTETE =
	'Matricule,Qualité,Nom usuel,Prénom usuel,Groupe politique,Circonscription,État,Courrier électronique'
const LIGNE = '1234a,Mme,Durand,Marie,SOC,Gironde,ACTIF,m.durand@senat.fr'
const INACTIF = '9999z,M.,Ancien,Paul,LR,Creuse,ANCIEN SENATEUR,p.ancien@senat.fr'

const octets = (texte: string, encodage: 'utf-8' | 'latin1' = 'utf-8') =>
	encodage === 'utf-8'
		? new TextEncoder().encode(texte).buffer
		: Uint8Array.from([...texte].map((c) => c.charCodeAt(0))).buffer

const fichier = (entete = ENTETE, lignes = [LIGNE, INACTIF]) =>
	['% préambule du Sénat', entete, ...lignes].join('\n')

describe('analyserSenateurs', () => {
	it('lit un fichier UTF-8 séparé par des virgules', () => {
		const r = analyserSenateurs(octets(fichier()))
		expect(r).toHaveLength(1)
		expect(r[0].nom).toBe('Marie Durand')
		expect(r[0].email).toBe('m.durand@senat.fr')
		expect(r[0].departement).toBe('33')
		expect(r[0].civ).toBe('Mme')
	})

	it('lit encore le latin1, encodage historique du fichier', () => {
		const r = analyserSenateurs(octets(fichier(), 'latin1'))
		expect(r).toHaveLength(1)
		expect(r[0].nom).toBe('Marie Durand')
	})

	it('accepte un séparateur point-virgule', () => {
		const r = analyserSenateurs(octets(fichier().replace(/,/g, ';')))
		expect(r).toHaveLength(1)
		expect(r[0].nom).toBe('Marie Durand')
	})

	it('tolère un BOM et des en-têtes entre guillemets', () => {
		const entete = '"' + ENTETE.split(',').join('","') + '"'
		const r = analyserSenateurs(octets('﻿' + fichier(entete)))
		expect(r).toHaveLength(1)
	})

	it('tolère la casse de la valeur ACTIF', () => {
		const r = analyserSenateurs(octets(fichier(ENTETE, [LIGNE.replace('ACTIF', 'Actif')])))
		expect(r).toHaveLength(1)
	})

	it('ne retient que les sénateurs en exercice', () => {
		const r = analyserSenateurs(octets(fichier(ENTETE, [LIGNE, INACTIF, INACTIF])))
		expect(r).toHaveLength(1)
	})

	// ── Les cas où il faut échouer bruyamment ────────────────────────────────
	it('nomme la colonne manquante plutôt que de renvoyer zéro sénateur', () => {
		const entete = ENTETE.replace('État', 'Statut')
		expect(() => analyserSenateurs(octets(fichier(entete)))).toThrow(/colonnes absentes.*État/s)
	})

	it('signale un changement de la valeur du filtre ACTIF', () => {
		const lignes = [LIGNE.replace('ACTIF', 'EN EXERCICE')]
		expect(() => analyserSenateurs(octets(fichier(ENTETE, lignes)))).toThrow(/aucune ligne/)
	})

	it('signale un fichier vide', () => {
		expect(() => analyserSenateurs(octets('% que du préambule'))).toThrow(/vide ou sans en-tête/)
	})
})
