<script lang="ts">
	import Button from '$components/Button.svelte'
	// Après une signature de la déclaration PauseAI : partager et aller plus loin.
	export let lang: 'fr' | 'en'
	$: isEn = lang === 'en'
	$: prefix = `/${lang}`
	let copied = false

	async function share() {
		const url = `https://pauseia.fr${prefix}/declaration`
		const text = isEn
			? 'I signed the PauseAI statement for an international treaty on AI. Sign it too:'
			: 'J’ai signé la déclaration PauseAI pour un traité international sur l’IA. Signez-la vous aussi :'
		try {
			if (typeof navigator.share === 'function') {
				await navigator.share({ text, url })
				return
			}
			await navigator.clipboard.writeText(`${text} ${url}`)
			copied = true
		} catch {
			/* partage annulé ou presse-papiers indisponible */
		}
	}
</script>

<p>
	<Button on:click={share}>
		{isEn ? 'Share the statement' : 'Partager la déclaration'}
	</Button>
	{#if copied}
		<span class="copied" role="status">{isEn ? 'Link copied!' : 'Lien copié !'}</span>
	{/if}
</p>
<p>
	{#if isEn}
		Want to go further? <a href="{prefix}/ecrire-a-mes-elus">Write to your representatives</a>
		or <a href="{prefix}/rejoindre">join us</a>.
	{:else}
		Envie d’aller plus loin ? <a href="{prefix}/ecrire-a-mes-elus">Écrivez à vos élus</a>
		ou <a href="{prefix}/rejoindre">rejoignez-nous</a>.
	{/if}
</p>

<style>
	.copied {
		margin-left: 0.8rem;
		color: var(--text-2);
	}
</style>
