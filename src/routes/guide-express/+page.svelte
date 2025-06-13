<script lang="ts">
	import Callout from '$components/Callout.svelte'
	import { base } from '$app/paths'
	
	// Import the infographic
	/* eslint-disable @typescript-eslint/ban-ts-comment */
	//@ts-expect-error Enhanced image import
	import infographic from '$assets/infographic.png?enhanced'
	/* eslint-enable @typescript-eslint/ban-ts-comment */
</script>

<svelte:head>
	<title>Guide Express : Devenez un Moteur de Croissance pour Pause IA</title>
	<meta name="description" content="Guide express pour recruter de nouveaux bénévoles pour Pause IA et amplifier votre impact grâce au recrutement relationnel." />
</svelte:head>

<article class="guide-express">
	<header class="hero-title">
		<h1>
			<span class="title-main">Votre Guide Express :</span>
			<span class="title-sub">Devenez un Moteur de Croissance pour Pause IA !</span>
		</h1>
	</header>

	<Callout>
		<em>Et si…</em>
		
		<p>Et si un seul SMS pouvait, en quelques semaines, se transformer en :</p>
		<ul class="chain-list">
			<li>1 nouvelle recrue → 3 entrepreneurs mobilisés → 1 rencontre avec un député → 40 témoignages citoyens au Parlement ?</li>
		</ul>
		
		<p><strong>C'est exactement le type de cascade que produit le recrutement relationnel.</strong></p>
		
		<p>En recrutant pour Pause IA, vous ne faites pas qu'ajouter une personne : <strong>vous initiez une potentielle réaction en chaîne, amplifiant votre impact bien au-delà de votre action initiale.</strong></p>
		
		<p>Et ce n'est pas tout : cette démarche est aussi une formidable opportunité pour vous de <strong>développer des compétences précieuses</strong> (écoute active, communication persuasive, mobilisation) qui vous enrichiront personnellement et professionnellement.</p>
	</Callout>

	<section>
		<h2>Pourquoi votre rôle de recruteur est déterminant :</h2>

		<h3>1. L'Effet Exponentiel</h3>
		<p>Chaque personne que vous ralliez peut, à son tour, en rallier d'autres. Imaginez : 1 personne en recrute 1 autre chaque mois. Si ce schéma se répète, on passe de 2 à 4, puis 8, 16... et plus de 4000 en un an !</p>
		
		<div class="infographic-container">
			<enhanced:img 
				src={infographic} 
				alt="L'effet exponentiel du recrutement peer-to-peer : de 1 personne à plus de 4000 en un an"
				class="infographic"
			/>
		</div>
		
		<p class="reference"><em>(Lire l'analyse complète : <a href="{base}/recruitment_guide">Guide de Recrutement Pause IA</a> – Partie 1 : POURQUOI votre rôle est absolument déterminant)</em></p>

		<h3>2. Une Course Contre la Montre</h3>
		<p>Les capacités des IA avancées progressent à une vitesse fulgurante. Notre capacité à sensibiliser, mobiliser et influencer doit suivre ce rythme effréné pour façonner un avenir souhaitable. Votre rôle dans cette accélération est direct.</p>

		<h3>3. La Science du Changement</h3>
		<p>Des experts comme Damon Centola (<em>Change: How to Make Big Things Happen</em>) montrent que les changements de comportement "complexes" (comme s'engager activement) se propagent par la <strong>confiance</strong> et la <strong>validation sociale</strong> au sein de réseaux personnels. Un message entendu dans un podcast (contagion simple) informe. Mais ce sont VOS conversations avec VOS proches (contagion complexe) qui transforment la prise de conscience en action.</p>
		
		<p class="reference"><em>(Comprendre la dynamique : <a href="{base}/recruitment_guide">Guide de Recrutement Pause IA</a> – La Science du Changement, <a href="https://www.youtube.com/watch?v=Y-1qLR2w60M" target="_blank" rel="noopener noreferrer">Vidéo</a>)</em></p>
	</section>

	<section>
		<h2>Les 4 principes pour connecter et convaincre :</h2>
		<ul class="principles-list">
			<li><strong>1. La Relation Avant Tout :</strong> La confiance est la base de tout.</li>
			<li><strong>2. Écouter > Parler :</strong> Comprendre avant de vouloir convaincre.</li>
			<li><strong>3. Partir de LEUR Réalité :</strong> Ancrer l'IA dans leurs préoccupations concrètes.</li>
			<li><strong>4. Petites Demandes → Grandes Demandes :</strong> Progresser par étapes logiques.</li>
		</ul>
		<p class="reference"><em>(Découvrez chaque pilier en détail : <a href="{base}/recruitment_guide">Guide de Recrutement Pause IA</a> – 4 Principes pour Connecter et Convaincre)</em></p>
	</section>

	<section>
		<h2>Passez à l'Action : Votre Plan en 3 Étapes Simples</h2>

		<h3>ÉTAPE 1 : CARTOGRAPHIEZ VOTRE RÉSEAU (Identifiez vos "Étincelles")</h3>
		<ul>
			<li><strong>Pourquoi ?</strong> Cet exercice simple vous aide à identifier les personnes de votre entourage les plus susceptibles d'être réceptives ou influentes, pour commencer par les conversations les plus "faciles" et porteuses.</li>
			<li><strong>Comment (en simplifié) ?</strong>
				<ol>
					<li><strong>Listez sans filtre</strong> (10-20 min) : Amis, famille, collègues, anciens contacts, membres d'autres assos...</li>
					<li><strong>Évaluez rapidement</strong> (5 min) : Pour chacun, notez (1 à 3) la force de votre lien, son influence potentielle, et sa sensibilité supposée à nos sujets. Multipliez ces trois chiffres pour obtenir un score.</li>
					<li><strong>Priorisez</strong> (2 min) : Ciblez les 3-5 personnes avec le "score" le plus prometteur ou avec qui vous êtes le plus à l'aise pour une première discussion.</li>
				</ol>
			</li>
			<li><strong>Ne partagez pas cette liste avec Pause IA.</strong> Elle est pour vous seul(e).</li>
			<li><strong><em>Votre guide complet pour une cartographie efficace :</em></strong> <a href="{base}/recruitment_guide">Guide de Recrutement Pause IA</a> – Cartographie de Réseau 101</li>
		</ul>

		<h3>ÉTAPE 2 : ENGAGEZ LA CONVERSATION (L'Art d'Écouter pour Connecter)</h3>
		<ul>
			<li><strong>La Clé : L'ÉCOUTE AUTHENTIQUE.</strong> Votre objectif est de comprendre, pas de prêcher. Visez 80% d'écoute, 20% de parole.</li>
			<li><strong>Soyez transparent(e) sur votre démarche</strong> dès le début (voir exemples dans le guide complet).</li>
			<li><strong>Utilisez le cadre L.O.R. (Lancer, Observer, Relier) :</strong>
				<ul class="sub-list">
					<li><strong>Lancer :</strong> Introduisez le sujet de l'IA et de vos préoccupations.</li>
					<li><strong>Observer :</strong> Écoutez activement ce que votre interlocuteur exprime (ses craintes, espoirs, valeurs). Reformulez pour assurer votre compréhension.</li>
					<li><strong>Relier :</strong> Faites le lien entre <em>ses</em> préoccupations et les enjeux de l'IA, en utilisant notre cadre de la "Perte de Contrôle".</li>
				</ul>
			</li>
			<li><strong><em>Maîtrisez l'écoute et le dialogue :</em></strong> <a href="{base}/recruitment_guide">Guide de Recrutement Pause IA</a> – Dialogue Authentique</li>
			<li><strong><em>Pour créer des ponts pertinents :</em></strong> <a href="{base}/recruitment_guide">Guide de Recrutement Pause IA</a> – Créer des Ponts</li>
		</ul>

		<h3>ÉTAPE 3 : FAITES UNE DEMANDE CLAIRE (Le "Petit Pas Suivant")</h3>
		<ul>
			<li>Proposez une action <strong>simple, claire et immédiate</strong></li>
			<li><strong>Exemple de "Demande du Mois" :</strong> Inviter à notre prochaine session Q&A en ligne.</li>
			<li>Adaptez la demande à l'intérêt de votre contact (lire un article, rejoindre Discord, participer à un événement...).</li>
			<li><strong><em>Toutes les techniques et exemples de demandes :</em></strong> <a href="{base}/recruitment_guide">Guide de Recrutement Pause IA</a> – L'Art de la Demande</li>
		</ul>
	</section>

	<section>
		<h2>Et si on vous dit "Non" ou si on Hésite ?</h2>
		<p>C'est parfaitement normal ! L'important est de maintenir le dialogue ouvert et de respecter le choix de l'autre. Le guide complet vous offre des pistes pour répondre aux objections les plus courantes avec bienveillance. <strong>Apprenez à gérer les objections :</strong> <a href="{base}/recruitment_guide">Guide de Recrutement Pause IA</a> – Anticiper les Objections</p>
	</section>

	<section>
		<h2>Votre Boîte à Outils Complète (Le Guide de Recrutement Intégral)</h2>
		<p>Ce guide express est votre point de départ. Pour approfondir chaque aspect et devenir un recruteur encore plus efficace, plongez dans le <strong><a href="{base}/recruitment_guide">Guide de Recrutement Pause IA</a></strong>. Vous y trouverez :</p>
		<ul>
			<li>Des <strong>développements détaillés</strong> sur chaque principe et chaque étape.</li>
			<li>Des <strong>exemples concrets</strong> de phrases-ponts pour connecter les préoccupations de vos contacts à l'action de Pause IA.</li>
			<li>Des <strong>réponses argumentées</strong> aux objections les plus fréquentes.</li>
			<li>Des <strong>ressources complémentaires</strong> pour aller plus loin.</li>
		</ul>
	</section>

	<section>
		<h2>Besoin d'Aide ou d'Échanger ?</h2>
		<ul>
			<li><strong>Canal Discord dédié :</strong> <code>#recrutement-soutien</code></li>
			<li><strong>Réunions Hebdomadaires :</strong> Un point régulier pour échanger, partager son progrès, et bénéficier du soutien de l'équipe.</li>
		</ul>
	</section>

	<Callout title="Un dernier mot...">
		<p class="centered"><strong>Rappelez-vous : chaque conversation compte. Chaque personne sensibilisée est une victoire. Vous avez le pouvoir de faire grandir notre mouvement de manière significative. Merci pour votre engagement !</strong></p>
	</Callout>
</article>

<style>
	.guide-express {
		max-width: 50rem;
		margin: 0 auto;
		padding: 2rem 1rem;
		line-height: 1.6;
	}

	.hero-title {
		text-align: center;
		margin-bottom: 3rem;
	}

	.hero-title h1 {
		margin: 0;
		line-height: 1.2;
	}

	.title-main {
		display: block;
		font-size: 2.5rem;
		font-weight: 700;
		color: var(--brand);
		margin-bottom: 0.5rem;
	}

	.title-sub {
		display: block;
		font-size: 1.8rem;
		font-weight: 700;
		color: var(--text);
	}

	.infographic-container {
		text-align: center;
		margin: 2rem 0;
	}

	.infographic {
		max-width: 100%;
		height: auto;
		border-radius: 0.3125rem;
	}

	.reference {
		font-size: 0.95rem;
		color: #666;
		font-style: italic;
	}

	.principles-list {
		margin: 1.5rem 0;
	}

	.principles-list li {
		margin: 0.8rem 0;
		padding-left: 0.5rem;
	}

	.chain-list li {
		font-weight: 500;
		color: var(--text);
	}

	.sub-list {
		margin-top: 0.5rem;
		margin-bottom: 0.5rem;
	}

	.sub-list li {
		margin: 0.3rem 0;
		font-size: 0.95rem;
	}

	.centered {
		text-align: center;
	}

	section {
		margin: 3rem 0;
	}

	h2 {
		color: var(--brand);
		font-size: 1.5rem;
		margin-top: 3rem;
		margin-bottom: 1.5rem;
		border-bottom: 2px solid var(--brand);
		padding-bottom: 0.5rem;
	}

	h3 {
		color: var(--text);
		font-size: 1.2rem;
		margin-top: 2rem;
		margin-bottom: 1rem;
		font-weight: 600;
	}

	/* Responsive adjustments */
	@media (min-width: 640px) {
		.guide-express {
			padding: 3rem 2rem;
		}

		.title-main {
			font-size: 3rem;
		}

		.title-sub {
			font-size: 2.2rem;
		}

		.infographic-container {
			margin: 3rem 0;
		}
	}

	@media (min-width: 1024px) {
		.title-main {
			font-size: 3.5rem;
		}

		.title-sub {
			font-size: 2.5rem;
		}
	}

	/* Override global list styles for better visual hierarchy */
	:global(.guide-express ol) {
		counter-reset: item;
		padding-left: 0;
	}

	:global(.guide-express ol > li) {
		display: block;
		margin: 0.5rem 0;
		padding-left: 2rem;
		position: relative;
	}

	:global(.guide-express ol > li::before) {
		content: counter(item) ".";
		counter-increment: item;
		font-weight: bold;
		color: var(--brand);
		position: absolute;
		left: 0;
	}

	:global(.guide-express code) {
		background-color: var(--bg-subtle);
		padding: 0.2rem 0.4rem;
		border-radius: 0.2rem;
		font-family: 'Courier New', monospace;
		font-size: 0.9rem;
	}
</style> 