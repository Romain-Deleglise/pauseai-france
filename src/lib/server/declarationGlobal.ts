// Signataires de la déclaration PauseAI recueillis par PauseAI Global
// (pauseai.info/statement). Leur API est publique mais n'accepte pas les
// appels depuis un navigateur d'un autre domaine : on la lit côté serveur.

import { countryKey } from '$lib/countries'

export const GLOBAL_SIGNATORIES_URL = 'https://pauseai.info/api/signatories'

export interface GlobalSignatory {
	name: string
	country?: string
	bio?: string
}

export interface GlobalSignatories {
	totalCount: number
	/** Signatures en France, anonymes comprises (absent des anciennes copies). */
	franceCount?: number
	/** Signataires nommés (les anonymes sont comptés mais pas listés), plus récents d'abord. */
	signatories: GlobalSignatory[]
	/** Date de récupération (ISO). */
	fetchedAt: string
}

interface RawSignatory {
	name?: unknown
	country?: unknown
	bio?: unknown
	date?: unknown
	private?: unknown
}

const str = (v: unknown, max: number) =>
	typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, max) : ''

/** Lit et normalise la liste de Global. Lève une erreur si elle est inexploitable. */
export async function fetchGlobalSignatories(
	fetchFn: typeof fetch,
	timeoutMs = 5000
): Promise<GlobalSignatories> {
	const controller = new AbortController()
	const timer = setTimeout(() => {
		controller.abort()
	}, timeoutMs)
	try {
		const res = await fetchFn(GLOBAL_SIGNATORIES_URL, { signal: controller.signal })
		if (!res.ok) throw new Error(`HTTP ${res.status}`)
		const data = (await res.json()) as { totalCount?: unknown; signatories?: unknown }
		// Leur API renvoie un total à 0 quand leur Airtable est injoignable.
		if (typeof data.totalCount !== 'number' || data.totalCount <= 0) {
			throw new Error('Empty or invalid response')
		}
		const raw = Array.isArray(data.signatories) ? (data.signatories as RawSignatory[]) : []
		// Compté avant d'écarter les anonymes : leur pays reste connu.
		const franceCount = raw.filter((s) => countryKey(str(s.country, 60)) === 'FR').length
		const signatories = raw
			.filter((s) => s.private !== true)
			.map((s) => ({
				date: typeof s.date === 'string' ? Date.parse(s.date) || 0 : 0,
				name: str(s.name, 80),
				country: str(s.country, 60) || undefined,
				bio: str(s.bio, 1500) || undefined
			}))
			.filter((s) => s.name && s.name.toLowerCase() !== 'anonymous')
			.sort((a, b) => b.date - a.date)
			.map(({ name, country, bio }) => ({ name, country, bio }))
		return {
			totalCount: data.totalCount,
			franceCount,
			signatories,
			fetchedAt: new Date().toISOString()
		}
	} finally {
		clearTimeout(timer)
	}
}
