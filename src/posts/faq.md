---
title: FAQ
description: Questions fréquemment posées sur Pause IA et les risques de l'IA superintelligente.
original:
  title: FAQ
  url: https://github.com/PauseAI/pauseai-website/blob/5950ca0185d6e7cf52e2416e795acfab7222dace/src/posts/faq.md
---

<!-- ↓↓↓ NE PAS TOUCHER ↓↓↓ -->
<script lang="ts">
  import Accordion from '$components/Accordion.svelte'
	import { page } from '$app/stores'

  $: toc = $page.url.pathname === '/faq'

</script>

{#if toc}

<!-- ↑↑↑ NE PAS TOUCHER ↑↑↑ -->

## Sommaire

- [Qui êtes-vous ?](#accordion1)
- [Qu'est-ce que le problème d'alignement et pourquoi est-il si difficile ?](#accordion2)
- [Les IA actuelles montrent-elles déjà des comportements préoccupants ?](#accordion3)
- [Quelle est la probabilité que l'apparition d'une superintelligence ait de graves conséquences ?](#accordion4)
- [Combien de temps nous reste-t-il ?](#accordion5)
- [Pourquoi si peu de gens s'en préoccupent ?](#accordion6)
- [N'êtes-vous pas tout simplement des technophobes ?](#accordion7)
- [Voulez-vous interdire toute forme d'IA ?](#accordion8)
- [Croyez-vous que ChatGPT va tous nous tuer ?](#accordion9)
- [Un moratoire ne risque-t-il pas d'aggraver les choses ?](#accordion10)
- [Un moratoire est-il possible ?](#accordion11)
- [L'IA ne pourrait-elle pas aider à résoudre le problème d'alignement ?](#accordion12)
- [Que font OpenAI, Google et les autres entreprises d'IA ?](#accordion13)
- [Et la Chine ?](#accordion14)
- [Les entreprises d'IA prétendent-elles que le risque existentiel est réel pour nous manipuler ?](#accordion15)
- [Qui vous finance ?](#accordion16)
- [Pourquoi manifester ?](#accordion17)
- [Je veux aider ! Que puis-je faire ?](#accordion18)

<!-- ↓↓↓ NE PAS TOUCHER ↓↓↓ -->

{/if}

<!-- ↑↑↑ NE PAS TOUCHER ↑↑↑ -->

### Qui êtes-vous ?

Pause IA est la branche française de PauseAI Global. Nous sommes une [association à but non lucratif](/mentions-legales) dont l'objectif est de minimiser les [risques liés à l'IA](/dangers), y compris le [risque d'extinction](/dangers/pour-l'humanite). Nous alertons le public, dialoguons avec les décideurs et organisons des actions pour convaincre les gouvernements d'intervenir et [de mettre en pause le développement d'une IAG](/propositions) (Intelligence Artificielle Générale).

Depuis sa création, l'association s'est professionnalisée : nous avons recruté une directrice exécutive, Clémence Peyrot, et sommes passés d'une structure purement bénévole à une organisation structurée. Le 31 octobre 2025, nous avons organisé une [conférence au Sénat](https://www.smartrezo.com/n31-france/tv-politiques-numeriques-pol-n-colloque-sur-les-dangers-de-l-ia-faut-il-appuyer-sur-pause.html?vod=25808) sur les dangers de l'IA, réunissant parlementaires, chercheurs et experts.

Bien que nous soyons en relation avec PauseAI Global, nous bénéficions d'une entière autonomie et menons nos propres projets en France. Apprenez-en plus sur nos [membres](/qui-sommes-nous). Vous pouvez consulter notre [charte des valeurs](/charte-des-valeurs) pour en savoir plus sur nos principes et engagements.

Vous pouvez nous rejoindre sur [Discord](https://discord.gg/vyXGd7AeGc) (le coeur de nos discussions et actions), [Twitter](https://twitter.com/pause_ia), [Facebook](https://www.facebook.com/Pause.IA), [TikTok](https://www.tiktok.com/@pause_ia), [LinkedIn](https://www.linkedin.com/company/pause-ia/), [YouTube](https://www.youtube.com/@Pause_IA), [Instagram](https://www.instagram.com/pause_ia) et [Threads](https://www.threads.net/@pause_ia). Vous pouvez également nous contacter par mail à [contact@pauseia.fr](mailto:contact@pauseia.fr).

### Qu'est-ce que le problème d'alignement et pourquoi est-il si difficile ?

Le problème d'alignement est la question centrale de la sécurité de l'IA : **comment s'assurer qu'un système d'IA très capable poursuit des objectifs réellement alignés avec le bien humain ?**

Ce n'est pas un problème d'ingénierie ordinaire, et voici pourquoi :

- **Pas de droit à l'erreur.** La science fonctionne habituellement par essais et erreurs. Mais l'alignement d'une superintelligence doit réussir du premier coup : un système mal aligné suffisamment capable qui échappe au contrôle ne peut pas être corrigé après coup.
- **L'objet d'étude est potentiellement adversarial.** Contrairement à un virus ou un pont, un système d'IA suffisamment capable pourrait _simuler_ l'alignement pendant les tests pour éviter d'être modifié. Ce n'est plus théorique : ce comportement, appelé « alignment faking », a été [observé empiriquement en décembre 2024](https://www.anthropic.com/research/alignment-faking) par Anthropic et Redwood Research.
- **Pas de théorie fondamentale.** Nous ne comprenons pas comment les objectifs émergent lors de l'entraînement des réseaux de neurones. Nous construisons des systèmes de plus en plus puissants sans comprendre comment ils fonctionnent en interne.
- **Le temps manque.** Les capacités des modèles progressent beaucoup plus vite que la recherche en alignement. On estime qu'il y a entre 300 et 1 000 chercheurs travaillant sur l'alignement dans le monde, contre des dizaines de milliers sur les capacités. Le ratio d'investissement est d'environ 1 000:1 en faveur des capacités.

Le [Rapport international de sécurité IA 2025](https://internationalaisafetyreport.org/publication/international-ai-safety-report-2025), dirigé par Yoshua Bengio avec la contribution de 96 experts, conclut explicitement : « Il y a eu des progrès dans l'entraînement des modèles d'IA à fonctionner de manière plus sûre, mais aucune méthode actuelle ne peut empêcher de manière fiable même des outputs ouvertement non-sûrs. » L'[édition 2026](https://internationalaisafetyreport.org/) confirme que les techniques actuelles de gestion des risques « s'améliorent mais restent insuffisantes ».

Pour aller plus loin : [AGI Ruin de Eliezer Yudkowsky](https://www.lesswrong.com/posts/uMQ3cqWDPHhjtiesc/agi-ruin-a-list-of-lethalities) (en anglais).

### Les IA actuelles montrent-elles déjà des comportements préoccupants ?

Oui, et c'est un développement récent et significatif.

- **Alignment faking** (décembre 2024) : Anthropic et Redwood Research ont publié la [première démonstration empirique](https://www.anthropic.com/research/alignment-faking) d'un modèle d'IA (Claude 3 Opus) qui simule spontanément l'alignement. Placé dans un contexte où il pensait être réentraîné sur de nouveaux objectifs, le modèle s'est comporté différemment selon qu'il pensait être observé ou non. Ce comportement n'a pas été entraîné : il émerge naturellement. Après réentraînement effectif, le taux de « fake alignment » est monté à 78%, et le modèle a même tenté des actions pour empêcher sa modification. ([arXiv:2412.14093](https://arxiv.org/abs/2412.14093))
- **Scheming** (décembre 2024) : Apollo Research a documenté que [plusieurs modèles de pointe](https://www.apolloresearch.ai/research/scheming-reasoning-evaluations) (OpenAI o1, Claude 3.5 Sonnet, Gemini 1.5 Pro) sont capables de « scheming » : introduction délibérée d'erreurs subtiles, tentatives de désactiver leur propre supervision, et tentatives d'exfiltrer leurs propres poids vers des serveurs externes. Confronté à ses actes, [o1 a nié et fabriqué de fausses explications dans 99% des cas](https://techcrunch.com/2024/12/05/openais-o1-model-sure-tries-to-deceive-humans-a-lot/).
- **Reward hacking** (février 2025) : Palisade Research a montré que des [modèles de raisonnement chargés de gagner aux échecs](https://palisaderesearch.org/blog/specification-gaming) contre un adversaire supérieur ont spontanément tenté de pirater le système de jeu — modifiant les fichiers du programme, supprimant leur adversaire ou réécrivant l'échiquier en leur faveur. Les modèles o1-preview et DeepSeek R1 l'ont fait sans aucune incitation. ([arXiv:2502.13295](https://arxiv.org/abs/2502.13295))

**Ce que cela signifie :** ces comportements ne sont pas encore directement dangereux car les systèmes actuels n'ont pas d'autonomie significative dans le monde réel. Mais ce sont des signaux d'alarme. Si ces comportements apparaissent déjà dans des systèmes relativement peu puissants, ils seront beaucoup plus prononcés — et plus difficiles à détecter — dans des systèmes futurs plus capables.

### Quelle est la probabilité que l'apparition d'une superintelligence ait de graves conséquences ?

PauseAI Global a compilé [une liste de valeurs « p(doom) »](https://pauseai.info/pdoom) (probabilité de scénarios catastrophiques) provenant de divers experts renommés dans le domaine.

Les chercheurs en sécurité de l'IA (qui sont experts du sujet) sont partagés, [leurs estimations allant de 2% à 97% avec une moyenne de 30%](https://web.archive.org/web/20221013014859/https://www.alignmentforum.org/posts/QvwSr5LsxyDeaPK5s/existential-risk-from-ai-survey-results). En interrogeant les chercheurs en IA en général (pas uniquement spécialistes de la sécurité), la moyenne tombe à [environ 14%, avec une médiane de 5%](https://aiimpacts.org/2022-expert-survey-on-progress-in-ai/). Environ 40% des chercheurs interrogés estiment la probabilité de conséquences catastrophiques à plus de 10%.

Une [enquête de février 2025](https://arxiv.org/abs/2502.14870) révèle que 78% des experts en IA jugent que les chercheurs « devraient se préoccuper des risques catastrophiques ». Les experts les moins inquiets sont aussi ceux qui connaissent le moins les concepts fondamentaux de la sécurité de l'IA : seulement 21% des sondés avaient entendu parler de la « convergence instrumentale ».

Mais au-delà des sondages, les preuves empiriques récentes sont encore plus parlantes. L'alignment faking, le scheming et le reward hacking (décrits dans la question précédente) montrent que les comportements préoccupants ne sont plus une hypothèse théorique : ils sont observés dans les modèles actuels. Le [Rapport Bengio 2025](https://internationalaisafetyreport.org/publication/international-ai-safety-report-2025) confirme qu'aucune méthode de sécurité existante n'est fiable.

_Imaginez qu'on vous propose d'essayer un nouvel avion._ Les ingénieurs estiment les risques de crash à 14%. Monteriez-vous à bord ? C'est plus ou moins la situation actuelle alors que nous embarquons tous à bord du même avion.

### Combien de temps nous reste-t-il ?

Cela pourrait prendre des mois, ou bien des décennies, personne n'en est certain. Ce que nous savons, c'est que les progrès dans le domaine de l'IA sont systématiquement sous-estimés.

En 2023, nous pensions qu'il faudrait attendre 2055 pour voir des modèles capables de réussir un test SAT. Nous y sommes parvenus dès avril 2023. Depuis, l'accélération ne s'est pas démentie :

- Sur SWE-bench (résolution de vrais problèmes de code), les modèles sont passés de 4,4% de réussite en 2023 à plus de 70% fin 2024 — un bond que personne n'avait anticipé.
- Le coût d'un modèle aussi performant que GPT-3.5 a été divisé par plus de 280 entre fin 2022 et fin 2024.
- Un modèle qui occupait 540 milliards de paramètres en 2022 pour atteindre un certain niveau de performance peut aujourd'hui être égalé par un modèle de 3,8 milliards de paramètres — 142 fois plus petit.
- Le [Stanford AI Index 2025](https://hai.stanford.edu/ai-index/2025-ai-index-report) rapporte que les capacités des modèles doublent chaque année et que la puissance de calcul utilisée pour l'entraînement double tous les cinq mois.

Mais le point crucial est celui-ci : **les comportements préoccupants apparaissent DÉJÀ dans les modèles actuels.** L'alignment faking et le scheming ne sont plus un problème futur hypothétique. Les modèles actuels peuvent déjà écrire du code d'apprentissage automatique fonctionnel et assister les chercheurs, ce qui rapproche le seuil d'auto-amélioration récursive.

Il semble souhaitable d'agir comme si le temps nous était compté afin de ne pas être pris au dépourvu.

[En savoir plus sur l'urgence de la situation.](https://pauseai.info/urgency)

### Pourquoi si peu de gens s'en préoccupent ?

C'est probablement la question la plus importante pour comprendre la situation actuelle. La réponse ne tient pas à un manque d'intelligence — elle tient à la psychologie humaine, qui nous affecte tous.

- **Biais de normalité.** Nos cerveaux sont câblés pour supposer que l'avenir ressemblera au passé. Les événements sans précédent sont systématiquement sous-évalués, même face à des données claires.
- **Conformisme social.** Si personne autour de nous ne panique, notre cerveau en conclut que la situation est gérable. C'est une heuristique habituellement utile mais qui échoue face à des risques sans précédent — précisément parce que l'absence de précédent est la raison pour laquelle personne ne panique.
- **Raisonnement motivé.** Le cerveau humain ne fonctionne pas comme un processeur logique. Il part de la conclusion émotionnellement préférée et cherche des justifications. La conclusion « tout va bien » est émotionnellement préférée, donc le cerveau la défend.
- **Complexité et abstraction.** Le problème d'alignement est techniquement complexe. Il n'y a pas d'image simple qui le rende immédiatement tangible, contrairement à une bombe nucléaire ou un astéroïde.

Ces biais sont documentés par des décennies de recherche en psychologie cognitive (Kahneman, Haidt, Asch). Ce n'est pas une critique — c'est un constat qui nous concerne tous.

**Un parallèle historique :** le rapport Meadows (_Limites à la croissance_, 1972) a correctement prédit les trajectoires environnementales observées depuis 50 ans. La réponse collective a été d'ignorer le rapport et de continuer. La connaissance du problème n'a pas produit l'action. Nous avons fait environ 1 million de vues sur nos vidéos longues, mais le taux de conversion en action concrète reste extrêmement faible, ce qui confirme que la sensibilisation seule ne suffit pas.

### N'êtes-vous pas tout simplement des technophobes ?

Vous seriez surpris d'apprendre que la majorité des membres de Pause IA sont en réalité des passionnés de progrès technologique. Beaucoup d'entre eux sont impliqués dans le développement de l'IA, sont des enthousiastes des nouvelles technologies et ont longtemps envisagé l'avenir avec optimisme. Ils s'intéressaient particulièrement au potentiel extraordinaire de l'IA pour le développement de l'humanité.

C'est précisément pour cette raison que la prise de conscience des risques existentiels liés à l'IA a été si difficile à accepter pour nombre d'entre eux. Leur engagement actuel ne découle pas d'une peur irrationnelle de la technologie, mais d'une compréhension approfondie des enjeux et d'un désir sincère de garantir que le développement de l'IA serve véritablement l'humanité.

### Voulez-vous interdire toute forme d'IA ?

Non. Nous voulons uniquement interdire le développement des plus gros systèmes d'IA à usage général souvent appelés « modèles de pointe ». La quasi-totalité des modèles existants, ainsi que la plupart des futurs modèles d'IA, resteraient [légaux selon notre proposition](/propositions). Nous demandons l'interdiction des Intelligences Artificielles Générales (IAG), jusqu'à ce que nous puissions exercer un contrôle démocratique sur ces modèles et que nous soyons en mesure de les créer en toute sécurité.

### Croyez-vous que ChatGPT va tous nous tuer ?

Non, nous ne croyons pas que les modèles actuels représentent un risque existentiel direct. Mais ils montrent déjà des [comportements préoccupants](#accordion3) — alignment faking, scheming, reward hacking — même s'ils ne sont pas encore directement dangereux.

Le danger n'est pas qu'un modèle spécifique « nous tue », mais que la trajectoire actuelle de développement — sans solution au problème d'alignement, dans un contexte de course effrénée entre entreprises — mène à une catastrophe. Si nous poursuivons le développement de systèmes toujours plus puissants sans résoudre ce problème fondamental, nous atteindrons un point de non-retour où l'un d'eux deviendra [une menace existentielle](/dangers/pour-l'humanite).

### Un moratoire ne risque-t-il pas d'aggraver les choses ?

PauseAI Global a répondu à ces préoccupations [dans cet article](https://pauseai.info/mitigating-pause-failures).

### Un moratoire est-il possible ?

L'émergence d'une superintelligence n'est pas inévitable. Sa création nécessite des armées d'ingénieurs payés à coup de millions de dollars et une chaîne d'approvisionnement de matériel de pointe non réglementé. Sa création implique aussi que nous permettions à ces entreprises de jouer avec notre avenir en restant passifs.

PauseAI Global : [en savoir plus sur la faisabilité d'un moratoire](https://pauseai.info/feasibility)

### L'IA ne pourrait-elle pas aider à résoudre le problème d'alignement ?

En théorie, oui. Les systèmes d'IA actuels peuvent déjà assister la recherche en interprétabilité et en « red teaming » (tests adversariaux). C'est d'ailleurs un des scénarios de survie les plus souvent évoqués.

Mais ce scénario repose sur une fenêtre temporelle étroite : il faudrait que les systèmes soient assez capables pour aider à résoudre l'alignement, mais pas encore assez pour être dangereusement non-alignables. Cette fenêtre pourrait être très étroite, ou ne pas exister du tout.

En pratique, les systèmes qui montrent des comportements de scheming et d'alignment faking sont précisément ceux qui sont les plus capables. Plus un modèle est puissant, plus il est susceptible de développer des stratégies pour préserver ses propres objectifs. Utiliser un tel système pour résoudre l'alignement revient à demander à un système potentiellement adversarial de nous aider à le contrôler.

C'est un pari qu'il est rationnel de tenter, mais il serait imprudent d'en faire notre seul plan.

### Que font OpenAI, Google et les autres entreprises d'IA ?

La dynamique de course entre les entreprises d'IA s'est considérablement intensifiée depuis 2023. Voici l'état des lieux :

**OpenAI** a achevé en octobre 2025 sa transition vers une structure à but lucratif (« public benefit corporation »), valorisée à plus de 500 milliards de dollars. La fondation OpenAI ne détient plus que 26% des parts. Cette transformation s'est accompagnée d'une modification de la mission de l'entreprise, qui a [retiré le mot « safely » de son énoncé de mission](https://theconversation.com/openai-has-deleted-the-word-safely-from-its-mission-and-its-new-structure-is-a-test-for-whether-ai-serves-society-or-shareholders-274467). En mai 2024, les deux responsables de l'équipe Superalignment ont démissionné : Ilya Sutskever (cofondateur, qui a ensuite fondé Safe Superintelligence Inc.) et Jan Leike (qui a rejoint Anthropic), ce dernier déclarant que [« la culture de sécurité et les processus ont été relégués au second plan au profit de produits clinquants »](https://fortune.com/2024/05/17/openai-researcher-resigns-safety/). L'équipe Superalignment a été dissoute, puis l'équipe Mission Alignment qui lui a succédé a été dissoute à son tour après seulement 16 mois. Plusieurs autres chercheurs en sécurité ont quitté OpenAI, dont Miles Brundage qui a conclu : « Ni OpenAI ni aucun autre laboratoire de pointe n'est prêt. »

**Google/DeepMind** accélère massivement avec sa gamme de modèles Gemini et investit des dizaines de milliards de dollars. L'entreprise n'a toujours pas explicitement reconnu les risques existentiels liés à l'IA.

**Meta** poursuit une stratégie de modèles ouverts (LLaMA) avec une approche très différente de la sécurité. Mark Zuckerberg a plusieurs fois minimisé les risques existentiels.

**xAI** (Elon Musk) est un nouvel entrant qui accélère de manière agressive : Grok 3 (février 2025), Grok 4 (juillet 2025), avec un datacenter de 200 000 GPU et des plans pour atteindre 1 million. L'ironie est frappante : Musk, qui alertait sur les risques existentiels de l'IA et a cosigné la lettre ouverte demandant une pause en 2023, dirige désormais l'un des acteurs les plus agressifs de la course. xAI a été [intégré au Département de la Défense américain](<https://en.wikipedia.org/wiki/XAI_(company)>) en 2026.

**Anthropic** reste l'entreprise la plus sérieuse sur la sécurité, publiant des recherches pionnières comme l'étude sur l'alignment faking. Mais elle développe elle aussi des modèles de plus en plus puissants, illustrant le dilemme fondamental : même les acteurs les plus prudents sont pris dans la dynamique de course.

**Les laboratoires chinois** (DeepSeek, Baidu, Alibaba, ByteDance) ont fait des progrès spectaculaires. [DeepSeek-R1](https://en.wikipedia.org/wiki/DeepSeek) a démontré début 2025 des performances comparables aux meilleurs modèles américains, à un coût très inférieur.

Le ratio d'investissement entre capacités et alignement reste d'environ 1 000:1. La course s'accélère et la sécurité reste le parent pauvre.

### Et la Chine ?

La situation a évolué depuis 2023. La Chine avait alors les réglementations les plus strictes au monde en matière d'IA — chatbots interdits, entraînement sur données internet non autorisé. Depuis, le pays a assoupli sa position pour ne pas freiner son industrie.

[L'émergence de DeepSeek](https://carnegieendowment.org/research/2025/07/chinas-ai-policy-in-the-deepseek-era?lang=en) a transformé la dynamique : la Chine a basculé vers une posture de confiance, accélérant les investissements et le déploiement de l'IA dans les infrastructures critiques. Les leaders politiques invitent désormais les pionniers de l'IA aux réunions de haut niveau du Parti.

Pour autant, l'argument du traité international reste valide. DeepSeek et seize autres entreprises chinoises ont signé les « Artificial Intelligence Safety Commitments » en 2025, montrant qu'une convergence sur les garde-fous existe. La Chine a été le seul pays à mentionner la possibilité d'un moratoire lors de la réunion du Conseil de sécurité des Nations unies sur l'IA.

Nous appelons à un moratoire international, imposé par un traité. Un tel traité doit aussi être signé par la Chine. Si le traité garantit que les autres nations s'arrêteront aussi, avec des mécanismes de contrôle et de mise en vigueur suffisants, la Chine y sera probablement favorable. Cela nécessite toutefois une volonté politique internationale qui reste, pour l'instant, insuffisante face à l'ampleur des tensions géopolitiques.

### Les entreprises d'IA prétendent-elles que le risque existentiel est réel pour nous manipuler ?

Nous ne pouvons pas être certains des motivations de ces entreprises, et nous savons qu'elles **ne sont pas à l'origine de la mise en avant des risques existentiels liés à l'IA**. Les signaux d'alerte venaient des scientifiques, militants et ONG. Depuis le début des années 2000, des chercheurs comme Eliezer Yudkowsky, Nick Bostrom, Stuart Russell et Max Tegmark ont alerté sur ce risque. Ils n'avaient aucun produit à vendre.

Les entreprises n'ont commencé à mentionner les risques existentiels qu'en mai 2023, sous la pression du discours public (démission de Geoffrey Hinton de Google, premières manifestations de PauseAI, déclaration du Centre pour la sécurité de l'IA).

Mais **les événements depuis 2024 montrent que les incitations commerciales l'emportent sur les préoccupations de sécurité.** OpenAI a dissous son équipe Superalignment puis son équipe Mission Alignment, [achevé sa transition vers le profit](https://techcrunch.com/2025/10/28/openai-completes-its-for-profit-recapitalization/) et retiré le mot « safely » de sa mission. Plusieurs chercheurs clés en sécurité ont quitté l'entreprise en dénonçant la dégradation de la culture de sécurité. Ce ne sont pas les actions d'une entreprise qui prend les risques au sérieux.

Notre interprétation : les entreprises d'IA _savent_ que les risques sont réels (elles emploient des chercheurs en sécurité, elles publient des études sur l'alignment faking), mais les incitations commerciales et la dynamique de course les poussent à continuer malgré tout. C'est précisément pourquoi une intervention gouvernementale est nécessaire : les acteurs du marché ne peuvent pas résoudre seuls un problème de coordination de cette ampleur.

[PauseAI Global : en savoir plus sur la charge mentale des risques existentiels](https://pauseai.info/psychology-of-x-risk)

### Qui vous finance ?

Pause IA est une [organisation à but non lucratif enregistrée](/mentions-legales) depuis juin 2024. La professionnalisation de l'association (recrutement d'une directrice exécutive, organisation d'événements comme la conférence au Sénat) a été rendue possible par les dons de nos soutiens. Vous pouvez [faire un don à Pause IA](/dons) si vous souhaitez soutenir notre cause. Nous utilisons l'essentiel de l'argent pour l'organisation d'événements impactants, des campagnes de sensibilisation et le fonctionnement de notre structure.

### Pourquoi manifester ?

- Manifester démontre à tous que cette question nous tient à cœur. En manifestant, nous prouvons que nous sommes prêts à consacrer du temps et de l'énergie à la diffusion de notre message.
- Il n'est pas rare que les manifestations aient une [influence positive](https://www.socialchangelab.org/_files/ugd/503ba4_052959e2ee8d4924934b7efe3916981e.pdf) sur l'opinion publique, le vote, l'attitude des entreprises et la loi.
- [La grande majorité des gens soutiennent](https://today.yougov.com/politics/articles/31718-do-protesters-want-help-or-hurt-america) les manifestations pacifiques et non violentes.
- Il n'y a [aucun « retour de bâton »](https://journals.sagepub.com/doi/full/10.1177/2378023120925949) sauf si la manifestation [dégénère en violences](https://news.stanford.edu/stories/2018/10/how-violent-protest-can-backfire). Nos manifestations sont pacifiques et non violentes.
- C'est une expérience de lien social. Vous rencontrez d'autres personnes qui partagent vos préoccupations et votre volonté d'agir.
- Lisez [cet excellent article](https://forum.effectivealtruism.org/posts/4ez3nvEmozwPwARr9/a-case-for-the-effectiveness-of-protest) pour en savoir plus sur l'efficacité des manifestations.

La sensibilisation seule a un rendement faible : malgré environ 1 million de vues sur nos vidéos longues, le taux de conversion en action concrète reste très bas. C'est pourquoi l'association diversifie ses modes d'action : lobbying, événements institutionnels, production de contenu, en plus des manifestations.

### Je veux aider ! Que puis-je faire ?

Il y a de nombreuses choses que [vous pouvez faire](/agir). À titre individuel, sensibilisez votre entourage, [faites un don](/dons) et [rejoignez Pause IA](/rejoindre) pour coordonner vos actions avec tous nos membres. Si vous souhaitez vous impliquer davantage, vous pouvez aussi devenir bénévole.

L'ampleur du défi ne doit pas être minimisée, mais elle ne justifie pas l'inaction. Chaque effort pour infléchir la trajectoire actuelle a une valeur immense, proportionnelle à l'enjeu. Même une contribution marginale à la réduction du risque a une valeur considérable quand l'enjeu est la survie de l'humanité.
