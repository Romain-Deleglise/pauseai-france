---
title: Take Action
description: The most useful actions to help keep AI under control, from 5 minutes to a lasting commitment.
---

<script lang="ts">
  import Accordion from '$components/Accordion.svelte'
  import { page } from '$app/stores'
  $: lang = $page.params.lang ?? 'en'
</script>

The number of people aware of AI risks is still small. You are now one of them, and **your actions carry more weight than you imagine.**

You don't need to devote your life to it: here are the most useful actions, from five minutes to a deeper commitment.

## The most useful action, in 5 minutes

<a class="lead-action" href="/{lang}/ecrire-a-mes-elus">
  <span class="lead-emoji">✉️</span>
  <span class="lead-text">
    <strong>Write to your representatives and the press</strong>
    <small>A ready-to-personalise email for your MP, your senator or a major newsroom. It's short, and far more effective than a petition: a message from a real citizen gets read and counted.</small>
  </span>
  <span class="lead-arrow" aria-hidden="true">→</span>
</a>

## The actions that matter most

<div class="action-grid">
  <a class="action-card" href="/{lang}/rejoindre">
    <span class="ac-emoji">✊</span>
    <strong>Join Pause AI</strong>
    <small>Join the movement and help us grow.</small>
  </a>
  <a class="action-card" href="/{lang}/groupes-locaux">
    <span class="ac-emoji">📍</span>
    <strong>Act near you</strong>
    <small>Join or start a local group.</small>
  </a>
  <a class="action-card" href="https://pauseai.info/protests" target="_blank" rel="noopener noreferrer">
    <span class="ac-emoji">📢</span>
    <strong>Protest</strong>
    <small>Join a protest in France or around the world.</small>
  </a>
  <a class="action-card" href="/{lang}/dons">
    <span class="ac-emoji">💶</span>
    <strong>Donate</strong>
    <small>Every euro helps us act more and faster.</small>
  </a>
  <a class="action-card" href="/recrutement">
    <span class="ac-emoji">🗣️</span>
    <strong>Convince those around you</strong>
    <small>Our guides to mobilise people effectively.</small>
  </a>
  <a class="action-card" href="/{lang}/dangers">
    <span class="ac-emoji">📚</span>
    <strong>Inform yourself</strong>
    <small>Understand the risks and solutions so you can speak accurately.</small>
  </a>
</div>

## Going further

<div class="acc-list">

<Accordion id="act-spread">
<span slot="head">Spread the word</span>
<div slot="details">

- **Follow and share Pause IA** on social media: [Discord](https://discord.gg/vyXGd7AeGc), [Twitter/X](https://twitter.com/pause_ia), [Facebook](https://www.facebook.com/Pause.IA), [TikTok](https://www.tiktok.com/@pause_ia), [LinkedIn](https://www.linkedin.com/company/pause-ia/), [Instagram](https://www.instagram.com/pause_ia), [Threads](https://www.threads.net/@pause_ia), [YouTube](https://www.youtube.com/@Pause_IA).
- **On LinkedIn**, add Pause IA and turn on "share profile updates with your network": a simple way to reach many people.
- **Talk** about AI risks around you and online: a sincere conversation beats a long speech.
- **Create and share content** (articles, videos, images) explaining the issue.

</div>
</Accordion>

<Accordion id="act-sign">
<span slot="head">Sign the key statements</span>
<div slot="details">

A few major texts whose weight comes from their number of signatures:

- [Pause AI public statement](https://pauseai.info/statement)
- [Statement on AI Risk](https://www.safe.ai/work/statement-on-ai-risk) (leaders and researchers from the major labs)
- [For an international AI treaty](https://aitreaty.org/)
- [Ban Superintelligence](https://www.change.org/p/ban-superintelligence-stop-ai-driven-human-extinction-risk)

</div>
</Accordion>

<Accordion id="act-profile">
<span slot="head">Act according to your profile</span>
<div slot="details">

**You are comfortable speaking**

- Try to convince a government member to work on an international moratorium: one of the most useful things you can do.
- Encourage journalists and influencers to cover AI safety.
- Ask the organisation you belong to take a stand.

**You are an elected official or work in the public sector**

- Learn about the [problem](/{lang}/dangers) and its [solutions](/{lang}/propositions).
- Build coalitions with other countries.
- Invite AI lab leaders to parliamentary hearings.
- Set up a committee to study the [risks of AI](/{lang}/dangers).

**You know the law**

- Help draft texts: see [example proposals](https://futureoflife.org/wp-content/uploads/2023/04/FLI_Policymaking_In_The_Pause.pdf).
- Take part in public consultations on AI policy.

**You can build for the web**

- [Improve this site](https://github.com/moiri-gamboni/pauseai-france).

**You work in AI**

- Do not work to accelerate the capabilities of frontier systems.
- Raise the risks with your management and colleagues; push for a stance.
- Organise an AI safety seminar at your workplace ([useful videos](https://pauseai.info/learn#videos)).
- Sign the [Statement on AI Risk](https://www.safe.ai/work/statement-on-ai-risk).

**You work in AI safety**

If you are new to alignment, seriously consider advocating for a pause instead: without a moratorium, there may not be enough time for your work to pay off. If you are already recognised in the field, [speak up publicly](https://twitter.com/TrustlessState/status/1651538022360285187) and add your name to calls for a moratorium.

**You care about jobs**

<a href="/{lang}/emploi-ia">Discover Emploi IA</a>, Pause IA's working group on the impact of AI on jobs and skills.

</div>
</Accordion>

<Accordion id="act-tips">
<span slot="head">Tips for being effective</span>
<div slot="details">

- **Be direct and brave** when you speak up. Avoid watered-down language: if you are worried, say so clearly. You can add caveats if asked.
- **Don't aim for perfection.** Apply the [Pareto principle](https://en.wikipedia.org/wiki/Pareto_principle): launch your action publicly and adjust afterwards. There is no time to waste.

Keep this in mind: any other action would be like arranging the deck chairs on the Titanic. Better to run for the wheel and steer away from the iceberg. We may not have much time, but we can try, and we can succeed.

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

  /* Accordions presented as white cards, detached from the background */
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

  .acc-list :global(.accordion .details) {
    background: transparent;
    border: none;
    box-shadow: none;
    border-radius: 0;
    margin: 0;
    padding: 0 0 0.75rem;
    text-align: left;
  }

  .acc-list :global(div.inView:not(:last-child) > .accordion) {
    border-bottom: 1px solid var(--border);
  }
</style>
