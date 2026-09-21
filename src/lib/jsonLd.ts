/**
 * Construit une balise de données structurées (JSON-LD) à insérer avec
 * `{@html}` dans un `<svelte:head>`.
 *
 * La balise fermante est concaténée au lieu d'être écrite telle quelle : dans
 * un bloc `<script>` de composant Svelte, une balise fermante littérale
 * terminerait le bloc. L'échapper (`<\/script>`) fonctionne aussi, mais les
 * outils d'analyse ne le comprennent pas.
 */
export function jsonLdTag(data: unknown): string {
	// Les chevrons de la charge utile sont échappés : une chaîne contenant une
	// balise fermante suffirait sinon à sortir du script.
	const payload = JSON.stringify(data).replace(/</g, '\\u003c')
	return `<script type="application/ld+json">${payload}</` + `script>`
}
