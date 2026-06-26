/**
 * Mini chargeur de fichier .env — sans dépendance externe.
 * Lit le fichier .env situé à côté du bot et peuple process.env
 * (sans écraser les variables déjà présentes dans l'environnement).
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ENV_PATH = path.resolve(__dirname, '..', '.env')

export function loadEnv() {
	if (!fs.existsSync(ENV_PATH)) return

	const content = fs.readFileSync(ENV_PATH, 'utf8')
	for (const rawLine of content.split('\n')) {
		const line = rawLine.trim()
		if (!line || line.startsWith('#')) continue

		const eq = line.indexOf('=')
		if (eq === -1) continue

		const key = line.slice(0, eq).trim()
		let value = line.slice(eq + 1).trim()

		// Retire les guillemets entourants éventuels.
		if (
			(value.startsWith('"') && value.endsWith('"')) ||
			(value.startsWith("'") && value.endsWith("'"))
		) {
			value = value.slice(1, -1)
		}

		if (!(key in process.env)) {
			process.env[key] = value
		}
	}
}
