<script lang="ts">
	import Button from '$lib/components/Button.svelte'
	import { goto } from '$app/navigation'
	import toast from 'svelte-french-toast'

	let formData = {
		// Section 1: Informations personnelles
		sexe: '',
		age: '',
		statutProfessionnel: '',
		niveauEtudes: '',
		secteurActivite: '',

		// Section 2: Impact de l'IA
		frequenceInformation: '',
		impactIA: '',
		rapportIA: '',
		autreRapport: '',

		// Section 3: Réflexions et témoignage
		interesseCellule: '',
		objectifsCellule: [] as string[],
		autreObjectif: '',
		temoignage: '',
		consentementPartage: false,
		prenom: '',
		email: '',
		veutPlusQuestions: '',

		// Section 4: Utilisation de l'IA (conditionnelle)
		utilisationIA: '',
		typeTaches: [] as string[],
		autreTache: '',
		raisonsUtilisation: [] as string[],
		autreRaison: '',
		satisfactionUtilisation: ''
	}

	let currentStep = 1
	let showSection4 = false
	let isSubmitting = false

	const secteurs = [
		'Activités juridiques et comptables',
		'Agriculture et élevage',
		'Architecture',
		'Artisanat',
		'Automobile',
		'BTP',
		'Commerce et distribution',
		'Communication et marketing',
		'Culture et patrimoine',
		'Edition',
		'Energie',
		'Finance, banque et assurance',
		'Gestion administrative et RH',
		'Hotellerie-restauration',
		'Immobilier',
		'Industrie alimentaire',
		'Industrie bois / chimie / textile / papier et imprimerie',
		'Informatique et télécommunication',
		'Maintenance, entretien et nettoyage',
		'Recherche',
		'Santé',
		'Service à la personne',
		'Service public, défense et sécurité',
		'Social',
		'Sport, animation et loisirs',
		'Tourisme',
		'Autres'
	]

	function validateStep(step: number): boolean {
		if (step === 1) {
			if (
				!formData.sexe ||
				!formData.age ||
				!formData.statutProfessionnel ||
				!formData.secteurActivite
			) {
				toast.error('Veuillez remplir tous les champs obligatoires')
				return false
			}
		} else if (step === 3) {
			if (!formData.email) {
				toast.error('Veuillez fournir votre adresse e-mail')
				return false
			}
			if (!formData.veutPlusQuestions) {
				toast.error('Veuillez indiquer si vous souhaitez répondre à davantage de questions')
				return false
			}
			if (formData.consentementPartage && !formData.prenom) {
				toast.error('Veuillez indiquer votre prénom si vous consentez à partager votre témoignage')
				return false
			}
		}
		return true
	}

	async function nextStep() {
		if (validateStep(currentStep)) {
			if (currentStep === 3) {
				if (formData.veutPlusQuestions === 'oui') {
					showSection4 = true
					currentStep = 4
				} else {
					await submitForm()
				}
			} else {
				currentStep++
			}
		}
	}

	function prevStep() {
		if (currentStep > 1) {
			currentStep--
		}
	}

	async function submitForm() {
		if (currentStep === 4 && !validateStep(4)) {
			return
		}

		isSubmitting = true

		try {
			// Ici, vous devrez implémenter l'envoi des données
			// Par exemple, vers un endpoint API
			const response = await fetch('/api/emploi-ia/submit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			})

			if (response.ok) {
				toast.success('Merci pour votre participation !')
				await goto('/emploi-ia/merci')
			} else {
				toast.error('Une erreur est survenue. Veuillez réessayer.')
			}
		} catch (error) {
			console.error('Erreur lors de la soumission:', error)
			toast.error('Une erreur est survenue. Veuillez réessayer.')
		} finally {
			isSubmitting = false
		}
	}
</script>

<svelte:head>
	<title>Enquête 2025 : IA et emploi | Pause IA</title>
	<meta
		name="description"
		content="L'association Pause IA réalise une enquête permanente sur l'IA et l'emploi pour évaluer et comprendre l'impact de l'IA sur le monde du travail."
	/>
</svelte:head>

<article class="questionnaire-container">
	<h1>Enquête 2025 : IA et emploi</h1>

	<p class="intro">
		L'association Pause IA réalise une enquête permanente sur l'IA et l'emploi pour évaluer et
		comprendre l'impact de l'IA sur le monde du travail.
	</p>

	<div class="progress-bar">
		<div class="progress-step" class:active={currentStep >= 1}>
			<div class="step-number">1</div>
			<div class="step-label">Informations</div>
		</div>
		<div class="progress-step" class:active={currentStep >= 2}>
			<div class="step-number">2</div>
			<div class="step-label">Impact</div>
		</div>
		<div class="progress-step" class:active={currentStep >= 3}>
			<div class="step-number">3</div>
			<div class="step-label">Témoignage</div>
		</div>
		{#if showSection4}
			<div class="progress-step" class:active={currentStep >= 4}>
				<div class="step-number">4</div>
				<div class="step-label">Utilisation</div>
			</div>
		{/if}
	</div>

	<form on:submit|preventDefault={nextStep}>
		<!-- Section 1: Informations personnelles -->
		{#if currentStep === 1}
			<section class="form-section">
				<h2>1. Quelques informations vous concernant...</h2>

				<div class="form-group">
					<label for="sexe">
						Sexe <span class="required">*</span>
					</label>
					<select id="sexe" bind:value={formData.sexe} required>
						<option value="">- Sélectionner -</option>
						<option value="femme">Femme</option>
						<option value="homme">Homme</option>
						<option value="autre">Autre</option>
					</select>
				</div>

				<div class="form-group">
					<label for="age">
						Votre âge <span class="required">*</span>
					</label>
					<input
						type="number"
						id="age"
						bind:value={formData.age}
						min="1"
						max="120"
						required
						placeholder="Ex: 35"
					/>
				</div>

				<div class="form-group">
					<label for="statutProfessionnel">
						Votre statut professionnel <span class="required">*</span>
					</label>
					<select id="statutProfessionnel" bind:value={formData.statutProfessionnel} required>
						<option value="">- Sélectionner -</option>
						<option value="actif_fonctionnaire">Actif fonctionnaire</option>
						<option value="actif_salarie">Actif salarié</option>
						<option value="actif_independant">Actif indépendant</option>
						<option value="actif_benevole">Actif bénévole</option>
						<option value="actif_interimaire">Actif intérimaire / intermittent</option>
						<option value="actif_sans_emploi">Actif sans emploi / au chômage</option>
						<option value="diplome_recherche">Diplômé à la recherche d'un premier emploi</option>
						<option value="etudiant">Elève / étudiant / apprenti</option>
						<option value="retraite">Retraité</option>
						<option value="autre">Autre</option>
					</select>
				</div>

				<div class="form-group">
					<label for="niveauEtudes">Votre niveau d'études</label>
					<select id="niveauEtudes" bind:value={formData.niveauEtudes}>
						<option value="">- Aucun(e) -</option>
						<option value="aucun">Aucun diplôme / Brevet des collèges</option>
						<option value="cap_bac_pro">CAP ou bac professionnel</option>
						<option value="bac_general">Bac général</option>
						<option value="bac_2_3">Bac +2 ou bac +3</option>
						<option value="bac_5">Bac +5</option>
						<option value="sup_bac_5">&gt; Bac +5</option>
					</select>
				</div>

				<div class="form-group">
					<label for="secteurActivite">
						Votre secteur d'activité <span class="required">*</span>
					</label>
					<select id="secteurActivite" bind:value={formData.secteurActivite} required>
						<option value="">- Sélectionner -</option>
						{#each secteurs as secteur}
							<option value={secteur}>{secteur}</option>
						{/each}
					</select>
				</div>
			</section>
		{/if}

		<!-- Section 2: Impact de l'IA -->
		{#if currentStep === 2}
			<section class="form-section">
				<h2>2. L'impact de l'IA sur votre vie professionnelle</h2>

				<div class="form-group">
					<label for="frequenceInformation">
						Q2.1 À quelle fréquence vous informez-vous sur les apports de l'IA ?
					</label>
					<select id="frequenceInformation" bind:value={formData.frequenceInformation}>
						<option value="">- Aucun(e) -</option>
						<option value="jamais">Jamais</option>
						<option value="ponctuel">Moins d'une fois par mois, ponctuellement</option>
						<option value="mensuel">Mensuelle et de façon active</option>
						<option value="hebdomadaire">Hebdomadaire ou équivalent</option>
						<option value="quotidien">Quotidienne ou quasi-quotidienne</option>
					</select>
				</div>

				<div class="form-group">
					<label for="impactIA">
						Q2.2 Dans quelle mesure pensez-vous être impacté par l'IA au travail ?
					</label>
					<select id="impactIA" bind:value={formData.impactIA}>
						<option value="">- Aucun(e) -</option>
						<option value="jamais">Jamais</option>
						<option value="peu">Peu d'impact / Pas tout de suite</option>
						<option value="moyen">
							Impact moyen : transformations auxquelles je m'adapte sans grandes difficultés
						</option>
						<option value="fort">
							Fort impact : menace de perte d'emploi, transformations difficiles
						</option>
						<option value="tres_fort">
							Très fort impact : emploi perdu, métier disparu, compétences inutiles...
						</option>
					</select>
				</div>

				<fieldset class="form-group">
					<legend id="rapportIA-legend"
						>Q2.3 Quel rapport(s) avez-vous avec l'IA au travail ?</legend
					>
					<div class="radio-group" role="radiogroup" aria-labelledby="rapportIA-legend">
						<label class="radio-label">
							<input type="radio" bind:group={formData.rapportIA} value="excitation" />
							L'excitation à l'idée de l'utiliser davantage
						</label>
						<label class="radio-label">
							<input type="radio" bind:group={formData.rapportIA} value="confiance" />
							La confiance dans ces nouveaux outils
						</label>
						<label class="radio-label">
							<input type="radio" bind:group={formData.rapportIA} value="neutre" />
							Pas de rapport particulier
						</label>
						<label class="radio-label">
							<input type="radio" bind:group={formData.rapportIA} value="prudence" />
							L'observation et la prudence
						</label>
						<label class="radio-label">
							<input type="radio" bind:group={formData.rapportIA} value="anxiete" />
							Le malaise voire l'anxiété
						</label>
						<label class="radio-label">
							<input type="radio" bind:group={formData.rapportIA} value="autre" />
							Un autre rapport
						</label>
					</div>
				</fieldset>

				{#if formData.rapportIA === 'autre'}
					<div class="form-group">
						<label for="autreRapport">Si autre rapport, indiquer lequel :</label>
						<input type="text" id="autreRapport" bind:value={formData.autreRapport} />
					</div>
				{/if}
			</section>
		{/if}

		<!-- Section 3: Réflexions et témoignage -->
		{#if currentStep === 3}
			<section class="form-section">
				<h2>3. Réflexions, témoignage et engagement</h2>

				<div class="form-group">
					<label for="interesseCellule">
						Q3.1 Seriez-vous intéressé à participer à une cellule de réflexion IA et emplois ?
					</label>
					<select id="interesseCellule" bind:value={formData.interesseCellule}>
						<option value="">- Aucun(e) -</option>
						<option value="oui">Oui</option>
						<option value="non">Non</option>
						<option value="ne_sais_pas">Ne sais pas</option>
					</select>
				</div>

				<fieldset class="form-group">
					<legend id="objectifsCellule-legend">Q3.2 Et si oui, qu'y chercheriez-vous ?</legend>
					<div class="checkbox-group">
						<label class="checkbox-label">
							<input type="checkbox" bind:group={formData.objectifsCellule} value="partager" />
							Partager mon expérience / témoigner
						</label>
						<label class="checkbox-label">
							<input type="checkbox" bind:group={formData.objectifsCellule} value="conseil" />
							Du conseil pour une reconversion / un choix avisé de formation
						</label>
						<label class="checkbox-label">
							<input type="checkbox" bind:group={formData.objectifsCellule} value="soutien" />
							Du soutien psychologique
						</label>
						<label class="checkbox-label">
							<input type="checkbox" bind:group={formData.objectifsCellule} value="droits" />
							De l'information sur mes droits de travailleur
						</label>
						<label class="checkbox-label">
							<input type="checkbox" bind:group={formData.objectifsCellule} value="avancees_ia" />
							De l'information / échanges sur les avancées de l'IA dans mon métier / secteur / mes compétences
						</label>
						<label class="checkbox-label">
							<input type="checkbox" bind:group={formData.objectifsCellule} value="agir_perso" />
							Des moyens d'agir sur ma situation personnelle au travail
						</label>
						<label class="checkbox-label">
							<input type="checkbox" bind:group={formData.objectifsCellule} value="agir_societe" />
							Des moyens d'agir sur la société et le monde du travail
						</label>
						<label class="checkbox-label">
							<input type="checkbox" bind:group={formData.objectifsCellule} value="autre" />
							Autre
						</label>
					</div>
				</fieldset>

				{#if formData.objectifsCellule.includes('autre')}
					<div class="form-group">
						<label for="autreObjectif">Préciser ce que vous y chercheriez d'autre :</label>
						<input type="text" id="autreObjectif" bind:value={formData.autreObjectif} />
					</div>
				{/if}

				<div class="form-group">
					<label for="temoignage">
						Q3.3 Vous pouvez nous partager ci-dessous votre témoignage, sous forme libre
					</label>
					<textarea
						id="temoignage"
						bind:value={formData.temoignage}
						rows="6"
						placeholder="Comment l'IA impacte-t-elle votre vie professionnelle ? Vous pouvez témoigner de votre vécu : aspects positifs ou négatifs ? Qu'avez-vous expérimenté, accepté, refusé ? Comment vos tâches se sont-elles modifiées ? Cela vous a-t-il demandé d'acquérir des compétences ou d'abandonner certaines parties de votre métier ? Avez-vous dû changer de poste, démissionner, vous reconvertir ? Quelles questions vous posez-vous ? Bref, tout nous intéresse ici."
					></textarea>
				</div>

				{#if formData.temoignage}
					<div class="form-group">
						<label class="checkbox-label consent-checkbox">
							<input type="checkbox" bind:checked={formData.consentementPartage} />
							J'accepte que mon témoignage soit partagé publiquement (de manière anonyme ou avec mon
							prénom)
						</label>
					</div>

					{#if formData.consentementPartage}
						<div class="form-group">
							<label for="prenom">
								Votre prénom (pour signer votre témoignage) <span class="required">*</span>
							</label>
							<input
								type="text"
								id="prenom"
								bind:value={formData.prenom}
								required
								placeholder="Ex: Marie"
							/>
							<p class="field-description">
								Votre prénom sera affiché avec votre témoignage si vous consentez à le partager.
							</p>
						</div>
					{/if}
				{/if}

				<div class="form-group">
					<label for="email">
						Votre adresse e-mail <span class="required">*</span>
					</label>
					<input
						type="email"
						id="email"
						bind:value={formData.email}
						required
						placeholder="exemple@email.com"
					/>
					<p class="field-description">
						Nous utiliserons cet email uniquement pour vous recontacter dans le cadre de cette
						enquête. Nous n'en ferons aucune utilisation commerciale.
					</p>
				</div>

				<div class="form-group">
					<label for="veutPlusQuestions">
						Avant de se quitter, souhaitez-vous répondre à davantage de questions ?
						<span class="required">*</span>
					</label>
					<select id="veutPlusQuestions" bind:value={formData.veutPlusQuestions} required>
						<option value="">- Sélectionner -</option>
						<option value="oui">Oui</option>
						<option value="non">Non</option>
					</select>
				</div>

				{#if formData.veutPlusQuestions === 'non'}
					<div class="thank-you-message">
						<p><strong>Merci d'avoir répondu à ce questionnaire !</strong></p>
						<p>
							Si vous n'y êtes pas déjà, vous pourrez trouver de l'information sur le site
							<a href="https://pauseia.fr" target="_blank">Pause IA.fr</a>
							et
							<a href="https://discord.com/invite/YkKvW9APP9" target="_blank">son serveur Discord</a
							>. Vous pourrez échanger avec d'autres personnes sur le sujet, vous informer et même
							agir !
						</p>
					</div>
				{/if}
			</section>
		{/if}

		<!-- Section 4: Utilisation de l'IA (conditionnelle) -->
		{#if currentStep === 4 && showSection4}
			<section class="form-section">
				<h2>4. Votre utilisation de l'IA au travail</h2>

				<div class="form-group">
					<label for="utilisationIA">
						Q4.1 Quelle est votre utilisation de l'IA dans votre activité professionnelle ?
					</label>
					<select id="utilisationIA" bind:value={formData.utilisationIA}>
						<option value="">- Aucun(e) -</option>
						<option value="jamais">Jamais</option>
						<option value="ponctuel">Très ponctuellement</option>
						<option value="hebdomadaire">Toutes les semaines</option>
						<option value="quotidien">Tous les jours</option>
						<option value="permanent">Toutes mes tâches ou presque</option>
						<option value="ne_sais_pas">Je ne sais pas</option>
					</select>
				</div>

				<fieldset class="form-group">
					<legend>Q4.2 Pour quel(s) type(s) de tâches utilisez-vous l'IA ?</legend>
					<div class="checkbox-group">
						<label class="checkbox-label">
							<input type="checkbox" bind:group={formData.typeTaches} value="generation_media" />
							Génération d'images, de sons, de vidéos
						</label>
						<label class="checkbox-label">
							<input type="checkbox" bind:group={formData.typeTaches} value="analyse_resume" />
							Analyse / Résumé de document (texte, vidéo...)
						</label>
						<label class="checkbox-label">
							<input type="checkbox" bind:group={formData.typeTaches} value="traduction" />
							Traduction
						</label>
						<label class="checkbox-label">
							<input
								type="checkbox"
								bind:group={formData.typeTaches}
								value="correction_redaction"
							/>
							Correction et rédaction de texte
						</label>
						<label class="checkbox-label">
							<input type="checkbox" bind:group={formData.typeTaches} value="automatisation" />
							Automatisation de tâches répétitives
						</label>
						<label class="checkbox-label">
							<input type="checkbox" bind:group={formData.typeTaches} value="codage" />
							Codage
						</label>
						<label class="checkbox-label">
							<input type="checkbox" bind:group={formData.typeTaches} value="gestion_planning" />
							Gestion de planning / projet
						</label>
						<label class="checkbox-label">
							<input type="checkbox" bind:group={formData.typeTaches} value="analyse_donnees" />
							Analyse de données
						</label>
						<label class="checkbox-label">
							<input
								type="checkbox"
								bind:group={formData.typeTaches}
								value="gestion_relationnelle"
							/>
							Gestion relationnelle (chatbot, mail..)
						</label>
						<label class="checkbox-label">
							<input
								type="checkbox"
								bind:group={formData.typeTaches}
								value="pilotage_dispositifs"
							/>
							Pilotage/contrôle de dispositifs connectés
						</label>
						<label class="checkbox-label">
							<input type="checkbox" bind:group={formData.typeTaches} value="aide_decision" />
							Prise de décision / aide à la décision
						</label>
						<label class="checkbox-label">
							<input type="checkbox" bind:group={formData.typeTaches} value="autre" />
							Autre
						</label>
					</div>
				</fieldset>

				{#if formData.typeTaches.includes('autre')}
					<div class="form-group">
						<label for="autreTache">Préciser quelles autres tâches :</label>
						<input type="text" id="autreTache" bind:value={formData.autreTache} />
					</div>
				{/if}

				<fieldset class="form-group">
					<legend>Q4.3 Pour quelle(s) raison(s) utilisez-vous l'IA au travail ?</legend>
					<div class="checkbox-group">
						<label class="checkbox-label">
							<input type="checkbox" bind:group={formData.raisonsUtilisation} value="curiosite" />
							Par pure curiosité
						</label>
						<label class="checkbox-label">
							<input type="checkbox" bind:group={formData.raisonsUtilisation} value="formation" />
							Suite à une formation / demande de ma direction
						</label>
						<label class="checkbox-label">
							<input type="checkbox" bind:group={formData.raisonsUtilisation} value="collegues" />
							Suite aux conseils de mes collègues
						</label>
						<label class="checkbox-label">
							<input
								type="checkbox"
								bind:group={formData.raisonsUtilisation}
								value="pression_concurrentielle"
							/>
							Suite à la pression concurrentielle
						</label>
						<label class="checkbox-label">
							<input
								type="checkbox"
								bind:group={formData.raisonsUtilisation}
								value="realiser_taches"
							/>
							Pour pouvoir réaliser toutes mes tâches
						</label>
						<label class="checkbox-label">
							<input
								type="checkbox"
								bind:group={formData.raisonsUtilisation}
								value="manque_competences"
							/>
							Par manque de compétences
						</label>
						<label class="checkbox-label">
							<input type="checkbox" bind:group={formData.raisonsUtilisation} value="efficacite" />
							Pour gagner du temps, être plus efficace
						</label>
						<label class="checkbox-label">
							<input type="checkbox" bind:group={formData.raisonsUtilisation} value="autre" />
							Autre
						</label>
					</div>
				</fieldset>

				{#if formData.raisonsUtilisation.includes('autre')}
					<div class="form-group">
						<label for="autreRaison">Préciser les autres raisons :</label>
						<input type="text" id="autreRaison" bind:value={formData.autreRaison} />
					</div>
				{/if}

				<div class="form-group">
					<label for="satisfactionUtilisation">
						Q4.4 Êtes-vous satisfait de cette utilisation ?
					</label>
					<select id="satisfactionUtilisation" bind:value={formData.satisfactionUtilisation}>
						<option value="">- Aucun(e) -</option>
						<option value="non_pas_utiliser">Non, je ne sais pas bien l'utiliser</option>
						<option value="non_resultats"
							>Non, les résultats obtenus ne sont pas satisfaisants</option
						>
						<option value="mitige">Oui et non, cela dépend des tâches</option>
						<option value="oui_precieux">Oui, c'est un outil de travail précieux</option>
						<option value="oui_decuple">Oui, cela décuple mes capacités</option>
					</select>
				</div>

				<div class="thank-you-message">
					<p><strong>Merci d'avoir répondu à ce questionnaire !</strong></p>
					<p>
						Merci d’avoir répondu à notre questionnaire 🙂. N’hésitez pas à parcourir le site de
						<a href="https://pauseia.fr" target="_blank" rel="noopener noreferrer">Pause IA.fr</a>
						l’association derrière le groupe de travail
						<a href="https://pauseia.fr/emploi-ia" target="_blank" rel="noopener noreferrer"
							>emploi IA</a
						>, pour découvrir nos revendications et nos actions. Et si vous souhaitez rester
						connectés avec nous, rejoignez
						<a
							href="https://discord.com/invite/YkKvW9APP9"
							target="_blank"
							rel="noopener noreferrer">notre groupe Discord</a
						>. vous pourrez y échanger directement avec les membres de l’association.
					</p>
				</div>
			</section>
		{/if}

		<!-- Navigation buttons -->
		<div class="form-navigation">
			{#if currentStep > 1}
				<Button type="button" alt on:click={prevStep}>Précédent</Button>
			{/if}
			{#if currentStep < 3 || (currentStep === 3 && formData.veutPlusQuestions === 'oui') || currentStep === 4}
				<Button type="submit" disabled={isSubmitting}>
					{#if currentStep === 4 || (currentStep === 3 && formData.veutPlusQuestions === 'non')}
						{isSubmitting ? 'Envoi en cours...' : 'Soumettre'}
					{:else}
						Suivant
					{/if}
				</Button>
			{:else if currentStep === 3 && formData.veutPlusQuestions === 'non'}
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? 'Envoi en cours...' : 'Soumettre'}
				</Button>
			{/if}
		</div>
	</form>
</article>

<style>
	.questionnaire-container {
		max-width: 800px;
		margin: 2rem auto;
		padding: 0 1rem;
	}

	.intro {
		font-size: 1.1rem;
		margin-bottom: 2rem;
		color: var(--text-secondary);
	}

	.progress-bar {
		display: flex;
		justify-content: space-between;
		margin-bottom: 3rem;
		position: relative;
	}

	.progress-bar::before {
		content: '';
		position: absolute;
		top: 1.25rem;
		left: 0;
		right: 0;
		height: 2px;
		background-color: var(--border);
		z-index: 0;
	}

	.progress-step {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		position: relative;
		z-index: 1;
		flex: 1;
	}

	.step-number {
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		background-color: var(--bg);
		border: 2px solid var(--border);
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		transition: all 0.3s ease;
	}

	.progress-step.active .step-number {
		background-color: var(--brand);
		border-color: var(--brand);
		color: white;
	}

	.step-label {
		font-size: 0.875rem;
		color: var(--text-secondary);
		text-align: center;
	}

	.progress-step.active .step-label {
		color: var(--brand);
		font-weight: 500;
	}

	.form-section {
		background-color: var(--bg);
		padding: 2rem;
		border-radius: 0.5rem;
		margin-bottom: 2rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
		color: var(--text);
	}

	.required {
		color: #dc2626;
	}

	input[type='text'],
	input[type='email'],
	input[type='number'],
	select,
	textarea {
		width: 100%;
		padding: 0.75rem;
		border: 1px solid var(--border);
		border-radius: 0.3125rem;
		font-family: var(--font-body);
		font-size: 1rem;
		transition: border-color 0.2s ease;
	}

	input[type='text']:focus,
	input[type='email']:focus,
	input[type='number']:focus,
	select:focus,
	textarea:focus {
		outline: none;
		border-color: var(--brand);
		box-shadow: 0 0 0 3px rgba(255, 148, 22, 0.1);
	}

	textarea {
		resize: vertical;
		min-height: 100px;
	}

	.radio-group,
	.checkbox-group {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin-top: 0.5rem;
	}

	.radio-label,
	.checkbox-label {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		font-weight: 400;
		cursor: pointer;
		padding: 0.5rem;
		border-radius: 0.25rem;
		transition: background-color 0.2s ease;
	}

	.radio-label:hover,
	.checkbox-label:hover {
		background-color: var(--bg-subtle);
	}

	input[type='radio'],
	input[type='checkbox'] {
		margin-top: 0.25rem;
		cursor: pointer;
		width: 1.25rem;
		height: 1.25rem;
		flex-shrink: 0;
	}

	.consent-checkbox {
		background-color: var(--brand-light);
		padding: 1rem;
		border-radius: 0.5rem;
		border: 2px solid var(--brand);
	}

	.field-description {
		font-size: 0.875rem;
		color: var(--text-secondary);
		margin-top: 0.5rem;
		margin-bottom: 0;
	}

	.thank-you-message {
		background-color: var(--brand-light);
		padding: 1.5rem;
		border-radius: 0.5rem;
		margin-top: 2rem;
		border-left: 4px solid var(--brand);
	}

	.thank-you-message p:last-child {
		margin-bottom: 0;
	}

	.form-navigation {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		margin-top: 2rem;
	}

	@media (max-width: 640px) {
		.form-section {
			padding: 1.5rem;
		}

		.step-label {
			font-size: 0.75rem;
		}

		.step-number {
			width: 2rem;
			height: 2rem;
			font-size: 0.875rem;
		}

		.form-navigation {
			flex-direction: column-reverse;
		}

		.form-navigation :global(button),
		.form-navigation :global(a) {
			width: 100%;
		}
	}
</style>
