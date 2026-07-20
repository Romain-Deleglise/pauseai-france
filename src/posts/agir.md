---
title: Passez à l’action
description: Les actions les plus utiles pour aider à garder l'IA sous contrôle, de 5 minutes à un engagement durable.
original:
  title: Take action
  url: https://github.com/PauseAI/pauseai-website/blob/95be1d5327015a2c41f5c518d92812d7f6c79bda/src/posts/action.md
---

<script lang="ts">
  import Accordion from '$components/Accordion.svelte'
  import { page } from '$app/stores'
  $: lang = $page.params.lang ?? 'fr'
</script>

Le nombre de personnes conscientes des risques liés à l'IA est encore restreint. Vous en faites désormais partie, et **vos actions ont plus de poids que vous ne l'imaginez.**

Pas besoin d'y consacrer votre vie : voici les actions les plus utiles, de cinq minutes à un engagement plus durable.

## L'action la plus utile, en 5 minutes

<a class="lead-action" href="/{lang}/ecrire-a-mes-elus">
  <span class="lead-emoji">✉️</span>
  <span class="lead-text">
    <strong>Écrire à mes élus et à la presse</strong>
    <small>Un email prêt à personnaliser pour votre député, votre sénateur ou une grande rédaction. C'est court, et bien plus efficace qu'une pétition : un message d'un vrai citoyen est lu et compté.</small>
  </span>
  <span class="lead-arrow" aria-hidden="true">→</span>
</a>

## Les actions qui comptent le plus

<div class="action-grid">
  <a class="action-card" href="/{lang}/rejoindre">
    <span class="ac-emoji">✊</span>
    <strong>Rejoindre Pause IA</strong>
    <small>Rejoignez le mouvement et aidez-nous à prendre de l'ampleur.</small>
  </a>
  <a class="action-card" href="/{lang}/groupes-locaux">
    <span class="ac-emoji">📍</span>
    <strong>Agir près de chez vous</strong>
    <small>Rejoignez ou lancez un groupe local.</small>
  </a>
  <a class="action-card" href="https://pauseai.info/protests" target="_blank" rel="noopener noreferrer">
    <span class="ac-emoji">📢</span>
    <strong>Manifester</strong>
    <small>Participez à une manifestation en France ou dans le monde.</small>
  </a>
  <a class="action-card" href="/{lang}/dons">
    <span class="ac-emoji">💶</span>
    <strong>Faire un don</strong>
    <small>Chaque euro nous aide à agir plus et plus vite.</small>
  </a>
  <a class="action-card" href="/recrutement">
    <span class="ac-emoji">🗣️</span>
    <strong>Convaincre votre entourage</strong>
    <small>Nos guides pour mobiliser efficacement autour de vous.</small>
  </a>
  <a class="action-card" href="/{lang}/ressources">
    <span class="ac-emoji">📚</span>
    <strong>Vous informer</strong>
    <small>Articles, vidéos et liens pour comprendre les risques et en parler juste.</small>
  </a>
</div>

## Aller plus loin

<div class="acc-list">

<Accordion id="agir-faire-connaitre">
<span slot="head">Faire connaître le sujet</span>
<div slot="details">

- **Suivez et relayez Pause IA** sur les réseaux : [Discord](https://discord.gg/vyXGd7AeGc), [Twitter/X](https://twitter.com/pause_ia), [Facebook](https://www.facebook.com/Pause.IA), [TikTok](https://www.tiktok.com/@pause_ia), [LinkedIn](https://www.linkedin.com/company/pause-ia/), [Instagram](https://www.instagram.com/pause_ia), [Threads](https://www.threads.net/@pause_ia), [YouTube](https://www.youtube.com/@Pause_IA).
- **Sur LinkedIn**, ajoutez Pause IA et activez « partager ces mises à jour du profil avec votre réseau » : un moyen simple de toucher beaucoup de monde.
- **Échangez** sur les risques de l'IA autour de vous et sur les réseaux : une conversation sincère vaut mieux qu'un long discours.
- **Créez et partagez du contenu** (articles, vidéos, images) pour expliquer le sujet.
- **Participez à notre enquête emploi & IA** : <a href="/{lang}/emploi-ia/questionnaire">l'impact de l'IA sur votre profession</a>.

</div>
</Accordion>

<Accordion id="agir-signer">
<span slot="head">Signer les textes de référence</span>
<div slot="details">

Quelques textes majeurs qui pèsent par le nombre de signatures :

- [Déclaration publique de Pause IA](https://pauseai.info/statement)
- [Déclaration sur les risques de l'IA](https://www.safe.ai/work/statement-on-ai-risk) (dirigeants et chercheurs des grands laboratoires)
- [Pour un traité international sur l'IA](https://aitreaty.org/)
- [Interdire la superintelligence](https://www.change.org/p/ban-superintelligence-stop-ai-driven-human-extinction-risk)

</div>
</Accordion>

<Accordion id="agir-profil">
<span slot="head">Agir selon votre profil</span>
<div slot="details">

**Vous êtes à l'aise à l'oral**

- Tentez de convaincre un membre du gouvernement de travailler sur un moratoire international : c'est l'une des choses les plus utiles que vous puissiez faire.
- Incitez des journalistes et des influenceurs à traiter la sécurité de l'IA.
- Demandez à l'organisation à laquelle vous appartenez de prendre position.

**Vous êtes élu·e ou travaillez pour le secteur public**

- Renseignez-vous sur le [problème](/{lang}/dangers) et ses [solutions](/{lang}/propositions).
- Formez des coalitions avec d'autres pays.
- Invitez les dirigeants des laboratoires d'IA à des auditions parlementaires.
- Mettez en place une commission pour étudier les [risques de l'IA](/{lang}/dangers).

**Vous connaissez le droit**

- Aidez à rédiger des textes : voir des [exemples de propositions](https://futureoflife.org/wp-content/uploads/2023/04/FLI_Policymaking_In_The_Pause.pdf).
- Participez aux consultations publiques sur les politiques touchant à l'IA.

**Vous savez produire du contenu web**

- [Améliorez ce site](https://github.com/moiri-gamboni/pauseai-france).

**Vous travaillez dans l'IA**

- Ne travaillez pas à accélérer les capacités des systèmes de pointe.
- Parlez des risques à votre direction et à vos collègues, poussez à une prise de position.
- Organisez un séminaire sur la sécurité de l'IA sur votre lieu de travail ([vidéos utiles](https://pauseai.info/learn#videos)).
- Signez la [Déclaration sur les risques de l'IA](https://www.safe.ai/work/statement-on-ai-risk).

**Vous travaillez dans la sécurité de l'IA**

Si vous débutez en alignement, envisagez sérieusement de militer plutôt pour une pause : sans moratoire, le temps risque de manquer pour que votre travail porte ses fruits. Si vous êtes déjà reconnu·e dans le domaine, faites [entendre votre voix publiquement](https://twitter.com/TrustlessState/status/1651538022360285187) et associez votre nom aux appels au moratoire.

**La question de l'emploi vous tient à cœur**

<a href="/{lang}/emploi-ia">Découvrez Emploi IA</a>, le groupe de travail de Pause IA dédié à l'impact de l'intelligence artificielle sur les métiers et les compétences.

</div>
</Accordion>

<Accordion id="agir-conseils">
<span slot="head">Conseils pour être efficace</span>
<div slot="details">

- **Soyez direct et courageux** dans vos prises de parole. Évitez le langage édulcoré : si vous êtes inquiet, dites-le clairement. Vous formulerez vos réserves si on vous les demande.
- **Ne visez pas la perfection.** Appliquez [le principe de Pareto](https://fr.wikipedia.org/wiki/Principe_de_Pareto) : lancez votre action publiquement et ajustez ensuite. Il n'y a pas de temps à perdre.

Gardez ceci à l'esprit : toute autre action reviendrait à aligner les transats sur le pont du Titanic. Mieux vaut courir vers la barre et s'éloigner de l'iceberg. Nous n'avons peut-être pas beaucoup de temps, mais nous pouvons essayer, et nous pouvons y arriver.

</div>
</Accordion>

</div>

<style>
  .lead-action {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem 1.5rem;
    border: 2px solid var(--brand);
    border-radius: 16px;
    background: var(--brand-light);
    text-decoration: none;
    color: var(--text);
    transition:
      transform 0.15s ease,
      box-shadow 0.15s ease;
  }

  .lead-action:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  }

  .lead-emoji {
    font-size: 2rem;
    flex-shrink: 0;
  }

  .lead-text {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .lead-text strong {
    font-size: 1.15rem;
  }

  .lead-text small {
    font-size: 0.92rem;
    line-height: 1.5;
    color: var(--text-2);
  }

  .lead-arrow {
    margin-left: auto;
    font-size: 1.5rem;
    color: var(--brand-subtle);
    flex-shrink: 0;
  }

  .action-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
    gap: 1rem;
  }

  .action-card {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    padding: 1.1rem 1.25rem;
    border: 1px solid var(--border);
    border-radius: 14px;
    background: var(--bg-card);
    text-decoration: none;
    color: var(--text);
    transition:
      transform 0.15s ease,
      border-color 0.15s ease,
      box-shadow 0.15s ease;
  }

  .action-card:hover {
    transform: translateY(-2px);
    border-color: var(--brand);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
  }

  .ac-emoji {
    font-size: 1.6rem;
  }

  .action-card strong {
    font-size: 1.02rem;
  }

  .action-card small {
    font-size: 0.88rem;
    line-height: 1.5;
    color: var(--text-2);
  }

  /* Accordéons « Aller plus loin » présentés en cartes blanches détachées du fond */
  .acc-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .acc-list :global(.accordion) {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 0 1.25rem 0.25rem;
  }

  .acc-list :global(.accordion .header) {
    padding: 1.1rem 0;
  }

  /* Le contenu ouvert n'a plus son propre encadré (évite la carte dans la carte) */
  .acc-list :global(.accordion .details) {
    background: transparent;
    border: none;
    box-shadow: none;
    border-radius: 0;
    margin: 0;
    padding: 0 0 0.75rem;
    text-align: left;
  }

  /* Neutralise le séparateur inter-accordéons du composant (chaque carte a son bord) */
  .acc-list :global(div.inView:not(:last-child) > .accordion) {
    border-bottom: 1px solid var(--border);
  }
</style>
