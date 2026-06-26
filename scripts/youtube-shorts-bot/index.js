#!/usr/bin/env node
/**
 * Bot YouTube Shorts Pause IA.
 *
 * À chaque exécution (déclenchée par cron sur le serveur Hetzner) :
 *   1. Liste les vidéos du dossier Drive surveillé (« À publier »).
 *   2. Pour chacune (jusqu'à MAX_PER_RUN) :
 *        a. Télécharge la vidéo depuis Drive.
 *        b. L'uploade sur la chaîne YouTube (titre = nom du fichier).
 *        c. Déplace le fichier Drive vers le dossier « Publié ».
 *   3. Journalise le résultat.
 *
 * Garde-fous :
 *   - Le bot ne touche QU'AU dossier surveillé : rien n'est publié par accident.
 *   - MAX_PER_RUN limite le nombre d'uploads (et reste sous le quota YouTube).
 *   - Un fichier de verrou empêche deux exécutions simultanées.
 *   - Si l'upload échoue, le fichier n'est PAS déplacé → il sera retenté.
 *
 * Déploiement Hetzner — voir README.md.
 * CRON exemple :
 *   0 * * * * cd /opt/scripts/youtube-shorts-bot && /usr/bin/node index.js \
 *     >> /var/log/youtube-shorts-bot.log 2>&1
 */

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { pipeline } from 'node:stream/promises'
import { google } from 'googleapis'
import { loadEnv } from './lib/env.js'

loadEnv()

const {
	GOOGLE_CLIENT_ID,
	GOOGLE_CLIENT_SECRET,
	GOOGLE_REFRESH_TOKEN,
	DRIVE_SOURCE_FOLDER_ID,
	DRIVE_PUBLISHED_FOLDER_ID,
	MAX_PER_RUN = '5',
	PRIVACY_STATUS = 'public',
	DEFAULT_DESCRIPTION = '#Shorts',
	YOUTUBE_CATEGORY_ID = '25',
	DEFAULT_LANGUAGE = 'fr'
} = process.env

const LOCK_FILE = path.join(os.tmpdir(), 'youtube-shorts-bot.lock')
const maxPerRun = Math.max(1, parseInt(MAX_PER_RUN, 10) || 5)

function log(msg) {
	console.log(`[${new Date().toISOString()}] ${msg}`)
}

function fail(msg) {
	console.error(`[${new Date().toISOString()}] ❌ ${msg}`)
}

function requireEnv() {
	const missing = []
	for (const key of [
		'GOOGLE_CLIENT_ID',
		'GOOGLE_CLIENT_SECRET',
		'GOOGLE_REFRESH_TOKEN',
		'DRIVE_SOURCE_FOLDER_ID',
		'DRIVE_PUBLISHED_FOLDER_ID'
	]) {
		if (!process.env[key]) missing.push(key)
	}
	if (missing.length) {
		fail(`Variables d'environnement manquantes : ${missing.join(', ')}`)
		process.exit(1)
	}
}

/** Verrou anti-exécutions concurrentes (un upload peut être long). */
function acquireLock() {
	try {
		// wx : échoue si le fichier existe déjà.
		const fd = fs.openSync(LOCK_FILE, 'wx')
		fs.writeSync(fd, String(process.pid))
		fs.closeSync(fd)
		return true
	} catch {
		// Verrou périmé ? (process mort > 2h). On le considère comme libérable.
		try {
			const stat = fs.statSync(LOCK_FILE)
			if (Date.now() - stat.mtimeMs > 2 * 60 * 60 * 1000) {
				fs.unlinkSync(LOCK_FILE)
				return acquireLock()
			}
		} catch {
			/* ignore */
		}
		return false
	}
}

function releaseLock() {
	try {
		fs.unlinkSync(LOCK_FILE)
	} catch {
		/* ignore */
	}
}

function getAuth() {
	const oauth2 = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)
	oauth2.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN })
	return oauth2
}

/** Titre YouTube = nom du fichier sans extension, tronqué à 100 caractères. */
function titleFromFilename(name) {
	const base = name.replace(/\.[^.]+$/, '').trim()
	return base.slice(0, 100) || 'Short'
}

async function listPendingVideos(drive) {
	const res = await drive.files.list({
		q: `'${DRIVE_SOURCE_FOLDER_ID}' in parents and mimeType contains 'video/' and trashed = false`,
		fields: 'files(id, name, mimeType, size, createdTime)',
		orderBy: 'createdTime', // les plus anciennes d'abord (FIFO)
		pageSize: 100,
		supportsAllDrives: true,
		includeItemsFromAllDrives: true
	})
	return res.data.files ?? []
}

async function downloadToTemp(drive, file) {
	const tmpPath = path.join(os.tmpdir(), `yt-short-${file.id}-${path.basename(file.name)}`)
	const dest = fs.createWriteStream(tmpPath)
	const res = await drive.files.get(
		{ fileId: file.id, alt: 'media', supportsAllDrives: true },
		{ responseType: 'stream' }
	)
	await pipeline(res.data, dest)
	return tmpPath
}

async function uploadToYouTube(youtube, file, tmpPath) {
	const res = await youtube.videos.insert({
		part: ['snippet', 'status'],
		requestBody: {
			snippet: {
				title: titleFromFilename(file.name),
				description: DEFAULT_DESCRIPTION,
				categoryId: YOUTUBE_CATEGORY_ID,
				defaultLanguage: DEFAULT_LANGUAGE,
				defaultAudioLanguage: DEFAULT_LANGUAGE
			},
			status: {
				privacyStatus: PRIVACY_STATUS,
				selfDeclaredMadeForKids: false
			}
		},
		media: { body: fs.createReadStream(tmpPath) }
	})
	return res.data
}

async function moveToPublished(drive, file) {
	await drive.files.update({
		fileId: file.id,
		addParents: DRIVE_PUBLISHED_FOLDER_ID,
		removeParents: DRIVE_SOURCE_FOLDER_ID,
		fields: 'id, parents',
		supportsAllDrives: true
	})
}

async function main() {
	requireEnv()

	if (!acquireLock()) {
		log('⏳ Une autre exécution est déjà en cours (verrou présent). Abandon.')
		return
	}

	log('========== DÉBUT exécution bot YouTube Shorts ==========')

	const auth = getAuth()
	const drive = google.drive({ version: 'v3', auth })
	const youtube = google.youtube({ version: 'v3', auth })

	let published = 0
	let errors = 0

	try {
		const videos = await listPendingVideos(drive)
		log(`${videos.length} vidéo(s) en attente dans le dossier surveillé.`)

		const batch = videos.slice(0, maxPerRun)
		if (videos.length > batch.length) {
			log(`Limite MAX_PER_RUN=${maxPerRun} : ${videos.length - batch.length} reportée(s) à la prochaine exécution.`)
		}

		for (const file of batch) {
			let tmpPath
			try {
				log(`▶️  Traitement : "${file.name}" (${file.id})`)
				tmpPath = await downloadToTemp(drive, file)
				const uploaded = await uploadToYouTube(youtube, file, tmpPath)
				log(`✅ Publié sur YouTube : https://youtu.be/${uploaded.id} (« ${uploaded.snippet?.title} »)`)
				await moveToPublished(drive, file)
				log(`📁 Déplacé vers le dossier « Publié ».`)
				published++
			} catch (err) {
				errors++
				const detail = err?.errors?.[0]?.reason || err.message
				fail(`Échec sur "${file.name}" : ${detail}. Le fichier reste dans le dossier surveillé (retry au prochain run).`)
				// Si le quota YouTube est épuisé, inutile de continuer ce run.
				if (detail === 'quotaExceeded' || detail === 'uploadLimitExceeded') {
					fail('Quota YouTube atteint — arrêt du run, reprise demain.')
					break
				}
			} finally {
				if (tmpPath) {
					try {
						fs.unlinkSync(tmpPath)
					} catch {
						/* ignore */
					}
				}
			}
		}
	} catch (err) {
		fail(`Erreur globale : ${err.message}`)
		errors++
	} finally {
		releaseLock()
	}

	log(`========== FIN : ${published} publiée(s), ${errors} erreur(s) ==========`)
	if (errors > 0) process.exitCode = 1
}

main()
