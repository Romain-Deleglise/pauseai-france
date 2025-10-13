<script>
	import { enhance } from '$app/forms'
	import toast from 'svelte-french-toast'
</script>

<form
	method="post"
	id="avis-form"
	use:enhance={() => {
		toast.success('Merci pour votre retour !', {
			duration: 4000,
			position: 'top-center'
		})
	}}
>
	<label for="avis"> Faites-nous un retour sur ce que vous aimeriez que l’on améliore ? </label>
	<textarea
		id="avis"
		name="avis"
		rows="4"
		placeholder="ex: J’aimerais avoir des graphiques pour savoir quels sont les métiers les plus impactés par l’IA.
"
		required
	></textarea>

	<button type="submit">Envoyer</button>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin: 2rem 0;
		width: 100%;
	}

	label {
		font-weight: bold;
	}

	textarea {
		padding: 0.5rem;
		font-size: 1rem;
		border: 1px solid #ccc;
		border-radius: 8px;
		resize: vertical;
		width: 100%;
		background: white;
	}

	button {
		align-self: flex-start;
		background-color: #ff9416;
		color: white;
		border: none;
		padding: 0.75rem 1.5rem;
		font-size: 1rem;
		border-radius: 4px;
		cursor: pointer;
		width: 100%;
		font-size: large;
		font-weight: bold;
	}

	button:hover {
		background-color: #e68314;
	}
</style>
