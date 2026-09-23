import { env as privateEnv } from '$env/dynamic/private'

// Accès CiviCRM (API4) partagé par la signature et la confirmation de la
// déclaration PauseAI.

export const WEBSITE_SIGNUP_ACTIVITY_ID = 75

export interface Api4Result<T = Record<string, unknown>> {
	count?: number
	countMatched?: number
	values?: T[]
	error_message?: string
}

export async function callApi4<T = Record<string, unknown>>(
	entity: string,
	action: string,
	params: Record<string, unknown> = {}
): Promise<Api4Result<T>> {
	const base = (privateEnv.CIVICRM_BASE_URL || '').replace(/\/+$/, '')
	const apiKey = privateEnv.CIVICRM_API_KEY || ''
	const siteKey = (privateEnv.CIVICRM_SITE_KEY || '').trim()
	if (!base || !apiKey || !siteKey) throw new Error('Missing required CiviCRM configuration')

	const url = `${base}/civicrm/ajax/api4/${encodeURIComponent(entity)}/${encodeURIComponent(action)}`
	const headers: Record<string, string> = {
		'X-Requested-With': 'XMLHttpRequest',
		Accept: 'application/json',
		Authorization: `Bearer ${apiKey}`,
		'X-Civi-Auth': `Bearer ${apiKey}`,
		'X-Civi-Key': siteKey,
		'Content-Type': 'application/x-www-form-urlencoded'
	}
	const body = new URLSearchParams({ params: JSON.stringify(params) }).toString()

	const response = await fetch(url, { method: 'POST', headers, body })
	if (!response.ok) throw new Error(`HTTP ${response.status.toString()}: ${response.statusText}`)
	const data = (await response.json()) as Api4Result<T>
	if (data.error_message) throw new Error(data.error_message)
	return data
}

// Groupes CiviCRM (gid 73 et 74 sur civicrm.pauseia.fr), surchargeables par
// variable d'environnement.
const DEFAULT_GROUPS: Record<string, number> = {
	CIVICRM_DECLARATION_GROUP_ID: 73,
	CIVICRM_DECLARATION_PUBLIC_GROUP_ID: 74
}

function groupId(name: string): number {
	const id = Number(privateEnv[name] || DEFAULT_GROUPS[name])
	if (!Number.isFinite(id) || id <= 0) throw new Error(`Missing ${name}`)
	return id
}

/** Tous les signataires confirmés (statut Added) ; « Pending » en attente de l'e-mail. */
export const signatoriesGroup = () => groupId('CIVICRM_DECLARATION_GROUP_ID')
/** Signataires confirmés qui acceptent d'être affichés. */
export const publicGroup = () => groupId('CIVICRM_DECLARATION_PUBLIC_GROUP_ID')

/** Groupes ajoutés quand la case newsletter est cochée (Newsletter + Call to Action). */
export function newsletterGroups(): number[] {
	return [privateEnv.CIVICRM_NEWSLETTER_GROUP_ID, privateEnv.CIVICRM_CALL_TO_ACTION_GROUP_ID]
		.map(Number)
		.filter((id) => Number.isFinite(id) && id > 0)
}

/** Statut du contact dans un groupe (Added, Pending, Removed), ou null. */
export async function groupStatus(contactId: number, group: number): Promise<string | null> {
	const res = await callApi4<{ status: string }>('GroupContact', 'get', {
		checkPermissions: false,
		select: ['status'],
		where: [
			['contact_id', '=', contactId],
			['group_id', '=', group]
		],
		limit: 1
	})
	return res.values?.[0]?.status ?? null
}

export async function setGroups(contactId: number, groups: number[], status: 'Added' | 'Pending') {
	if (!groups.length) return
	await callApi4('GroupContact', 'save', {
		checkPermissions: false,
		match: ['contact_id', 'group_id'],
		records: groups.map((group_id) => ({ contact_id: contactId, group_id, status }))
	})
}

/** Journalise une activité sur le contact (non bloquant). */
export async function logActivity(contactId: number, subject: string): Promise<void> {
	try {
		await callApi4('Activity', 'create', {
			checkPermissions: false,
			values: {
				activity_type_id: WEBSITE_SIGNUP_ACTIVITY_ID,
				subject,
				source_contact_id: Number(privateEnv.CIVICRM_NEWSLETTER_API_CONTACT_ID || ''),
				target_contact_id: [contactId],
				'status_id:name': 'Completed'
			}
		})
	} catch (e) {
		console.warn('[declaration] journalisation de l’activité impossible (ignoré) :', e)
	}
}

/** Vrai si une activité de ce sujet a été créée pour le contact depuis `sinceMs`. */
export async function hasRecentActivity(
	contactId: number,
	subject: string,
	sinceMs: number
): Promise<boolean> {
	const since = new Date(Date.now() - sinceMs).toISOString().slice(0, 19).replace('T', ' ')
	const res = await callApi4('ActivityContact', 'get', {
		checkPermissions: false,
		select: ['id'],
		where: [
			['contact_id', '=', contactId],
			['record_type_id:name', '=', 'Activity Targets'],
			['activity_id.subject', '=', subject],
			['activity_id.activity_date_time', '>=', since]
		],
		limit: 1
	})
	return Boolean(res.values?.length)
}
