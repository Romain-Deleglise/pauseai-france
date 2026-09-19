module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/strict-type-checked',
		'plugin:@typescript-eslint/stylistic-type-checked',
		'plugin:svelte/recommended',
		'plugin:svelte/prettier',
		'prettier'
	],
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint'],
	ignorePatterns: ['*.cjs'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte'],
		project: true,
		tsconfigRootDir: __dirname
	},
	rules: {
		// Le code traite volontairement la chaîne vide comme une absence de
		// valeur (champs de formulaire, propriétés Notion) : `||` est alors le
		// bon opérateur, `??` laisserait passer des chaînes vides.
		'@typescript-eslint/prefer-nullish-coalescing': [
			'error',
			{ ignorePrimitives: { string: true } }
		],
		// Interpoler un nombre ou un booléen dans un gabarit est sans danger.
		'@typescript-eslint/restrict-template-expressions': [
			'error',
			{ allowNumber: true, allowBoolean: true }
		]
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	},
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser'
			}
		},
		{
			extends: ['plugin:@typescript-eslint/disable-type-checked'],
			files: ['./svelte.config.js']
		},
		{
			extends: ['plugin:@typescript-eslint/disable-type-checked'],
			files: ['netlify/functions/**/*.ts']
		},
		{
			// Plugins de build en JavaScript simple (remark/rehype/Vite) : sans
			// annotations de type, les règles « type-checked » ne voient que du
			// `any` et produisent du bruit, pas des bugs.
			extends: ['plugin:@typescript-eslint/disable-type-checked'],
			files: ['src/lib/*.js', 'scripts/**/*.js', 'tests/**/*.js']
		}
	]
}
