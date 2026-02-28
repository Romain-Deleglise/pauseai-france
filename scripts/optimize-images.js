/**
 * Script d'optimisation des images membres.
 *
 * Usage: pnpm optimize-images
 *
 * Redimensionne et convertit les images de /static/membres/ en WebP (288×288 px,
 * 2× pour retina) et les sauvegarde dans /static/membres/optimized/.
 * Les fichiers originaux ne sont pas modifiés.
 *
 * Après l'exécution, mettre à jour les chemins d'image dans les données de
 * l'équipe pour pointer vers /membres/optimized/<nom>.webp
 */

import sharp from 'sharp'
import { readdir, mkdir } from 'fs/promises'
import { join, extname, basename } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const INPUT_DIR = join(__dirname, '../static/membres')
const OUTPUT_DIR = join(__dirname, '../static/membres/optimized')
const MAX_SIZE = 288 // 2× for retina (displayed at 144×144)
const QUALITY = 82

const SUPPORTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.jfif']

async function optimizeImages() {
	await mkdir(OUTPUT_DIR, { recursive: true })

	const files = await readdir(INPUT_DIR)
	const imageFiles = files.filter((f) => SUPPORTED_EXTENSIONS.includes(extname(f).toLowerCase()))

	console.log(`Optimisation de ${imageFiles.length} images vers ${OUTPUT_DIR}`)

	let saved = 0
	let totalOriginal = 0
	let totalOptimized = 0

	for (const file of imageFiles) {
		const inputPath = join(INPUT_DIR, file)
		const outputName = basename(file, extname(file)) + '.webp'
		const outputPath = join(OUTPUT_DIR, outputName)

		try {
			const { size: originalSize } = await import('fs').then((fs) => fs.promises.stat(inputPath))
			totalOriginal += originalSize

			await sharp(inputPath)
				.resize(MAX_SIZE, MAX_SIZE, {
					fit: 'cover',
					position: 'centre'
				})
				.webp({ quality: QUALITY })
				.toFile(outputPath)

			const { size: optimizedSize } = await import('fs').then((fs) => fs.promises.stat(outputPath))
			totalOptimized += optimizedSize

			const reduction = (((originalSize - optimizedSize) / originalSize) * 100).toFixed(1)
			console.log(
				`  ✓ ${file} → ${outputName} (${(originalSize / 1024).toFixed(0)} KB → ${(optimizedSize / 1024).toFixed(0)} KB, −${reduction}%)`
			)
			saved++
		} catch (err) {
			console.error(`  ✗ Erreur pour ${file}:`, err.message)
		}
	}

	console.log(`\nTerminé : ${saved}/${imageFiles.length} images optimisées`)
	console.log(
		`Taille totale : ${(totalOriginal / 1024 / 1024).toFixed(1)} MB → ${(totalOptimized / 1024 / 1024).toFixed(1)} MB`
	)
	console.log(
		`Réduction : ${(((totalOriginal - totalOptimized) / totalOriginal) * 100).toFixed(1)}%`
	)
}

optimizeImages()
