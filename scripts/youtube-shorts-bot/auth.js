#!/usr/bin/env node
/**
 * Setup OAuth one-time — Bot YouTube Shorts Pause IA.
 *
 * À lancer UNE SEULE FOIS (idéalement sur votre machine, navigateur dispo) :
 *
 *   cd scripts/youtube-shorts-bot
 *   npm install
 *   cp .env.example .env   # puis remplir GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET
 *   npm run auth
 *
 * Le script ouvre une URL Google, vous autorisez l'accès à la chaîne YouTube
 * + au Drive, et il affiche le GOOGLE_REFRESH_TOKEN à coller dans .env
 * (sur le serveur Hetzner). Ce token ne s'expire pas tant que l'accès n'est
 * pas révoqué, donc cette étape n'est faite qu'une fois.
 */

import http from 'node:http'
import { URL } from 'node:url'
import { google } from 'googleapis'
import { loadEnv } from './lib/env.js'

loadEnv()

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
	console.error(
		'❌ GOOGLE_CLIENT_ID et GOOGLE_CLIENT_SECRET doivent être définis dans .env avant de lancer l\'authentification.'
	)
	process.exit(1)
}

// Scopes : upload + gestion des vidéos YouTube, et accès Drive complet
// (lecture du dossier + déplacement des fichiers après publication).
const SCOPES = [
	'https://www.googleapis.com/auth/youtube.upload',
	'https://www.googleapis.com/auth/youtube',
	'https://www.googleapis.com/auth/drive'
]

const PORT = 4773
const REDIRECT_URI = `http://localhost:${PORT}`

const oauth2 = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URI)

const authUrl = oauth2.generateAuthUrl({
	access_type: 'offline', // nécessaire pour obtenir un refresh_token
	prompt: 'consent', // force la délivrance d'un refresh_token à chaque fois
	scope: SCOPES
})

const server = http.createServer(async (req, res) => {
	try {
		const url = new URL(req.url, REDIRECT_URI)
		const code = url.searchParams.get('code')
		if (!code) {
			res.writeHead(400).end('Paramètre "code" manquant.')
			return
		}

		const { tokens } = await oauth2.getToken(code)
		res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }).end(
			'<h1>✅ Autorisation réussie</h1><p>Vous pouvez fermer cet onglet et revenir au terminal.</p>'
		)

		if (!tokens.refresh_token) {
			console.error(
				'\n❌ Aucun refresh_token reçu. Révoquez l\'accès de l\'app dans https://myaccount.google.com/permissions puis relancez `npm run auth`.'
			)
			process.exit(1)
		}

		console.log('\n✅ Authentification réussie !\n')
		console.log('Collez cette ligne dans le fichier .env du serveur :\n')
		console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}\n`)
		server.close()
		process.exit(0)
	} catch (err) {
		console.error('❌ Erreur lors de l\'échange du code :', err.message)
		res.writeHead(500).end('Erreur. Voir le terminal.')
		process.exit(1)
	}
})

server.listen(PORT, () => {
	console.log('\n🔐 Authentification Google — Bot YouTube Shorts Pause IA\n')
	console.log('Ouvrez cette URL dans votre navigateur et autorisez l\'accès :\n')
	console.log(authUrl + '\n')
	console.log(`(En attente de la redirection sur ${REDIRECT_URI} …)`)
})
