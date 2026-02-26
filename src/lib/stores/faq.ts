import { writable } from 'svelte/store'

/** Signal store for expand/collapse all FAQ accordions.
 *  Accordion components subscribe and react when `ts` changes. */
export const faqBulkAction = writable<{ action: 'expand' | 'collapse'; ts: number }>({
	action: 'collapse',
	ts: 0
})
