---
title: Emploi et IA - Informez vous et agissez
description: Découvrez Emploi IA, un groupe de Pause IA dédié à comprendre l’impact de l’intelligence artificielle sur le travail et à préparer l’avenir.
date: '2025-09-29'
---

<script>
    import EmploiForm from '$components/EmploiForm.svelte'
    import TestimonialCarousel from '$components/TestimonialCarousel.svelte'
    import ArticleShowcase from '$components/ArticleShowcase.svelte'
    import EmploiAvisForm from '$components/EmploiAvisForm.svelte'

    
        let testimonials = [
    {
     //   name: 'Pascaline',
     //   age: 35, // 30-39 ans
        job: 'graphiste freelance',
        date: '2025-06-26',
        testimony:
            "Graphiste freelance, j'ai moins de clients depuis quelques mois. Certains projets sont annulés ou reportés. Mes compétences purement techniques (graphisme d'exécution) sont moins sollicitées et c'est davantage un travail de direction artistique et de réflexion holistique en UI/UX, du print au web qui est demandé par mes clients. La dimension globale, l'analyse des enjeux et des besoins de mes clients pour réaliser ou décliner une identité visuelle n'est pas encore maîtrisée par l'IA."
    },
    {
      //  name: 'Fanny',
      //  age: 35, // 30-39 ans
        job: 'ingénieure pédagogique multimédia',
        date: '2025-07-10',
        testimony:
            "Je scénarise et réalise des formations en ligne (elearning, serious games etc.). Aujourd'hui l'IA prend une grosse place dans le travail de rédaction, même si elle ne fait QUE me faire gagner du temps. Pour l'instant, personne ne semble vouloir déléguer cette tâche entièrement à l'IA, mais dès qu'elle sera plus performante, je crains que les entreprises construisent des formations automatiquement, sans intervention de pédagogues. Le résultat est assez terrible et pauvre en termes de contenus, de pédagogie et d'intérêt. Je crains pour l'avenir de la formation."
    },
    {
      //  name: 'Maïread',
      //  age: 55, // 50-59 ans
        job: 'traductrice indépendante',
        date: '2025-07-16',
        testimony:
            "Traductrice depuis 2017, mon CA a baissé depuis l'arrivée de ChatGPT, d'abord modérément pendant plus d'une année, mais depuis mi-2024, la situation n'est plus tenable, au point que je me suis décidée à rechercher du travail et à revenir à mon ancien métier. Entre les agences qui tirent les tarifs vers le bas et recourent majoritairement à la post-édition (activité peu lucrative et similaire au travail à la chaîne) et les clients directs qui pensent que l'IA est capable de faire aussi bien que les traducteurs pros, le métier a perdu tout son intérêt."
    },
    {
     //   name: 'Mandelle',
     //   age: 45, // 40-49 ans
        job: 'enseignante',
        date: '2025-07-17',
        testimony:
            "Je suis l'IA de façon plus serrée avec les élèves depuis 2022. L'impact sur les étudiants est que leur recherche n'est plus/moins personnelle et qu'ils font moins d'efforts. La formation que je dispense prépare à des métiers dont la plupart n'existeront plus dans 6 mois, 1 an et je m'interroge sur ce à quoi il faut former les jeunes aujourd'hui. On nous exhorte à utiliser l'IA afin de personnaliser notre enseignement pour suivre toujours plus d'élèves. Mais je n'ai pas envie de déléguer cela à une IA, c'est ce qui me plaît dans mon métier le rapport serré aux élèves. Je me sentirai dépossédée de mon travail et vivrai une perte de sens."
    },
    {
     //   name: 'Emmanuelle',
     //   age: 35, // 30-39 ans
        job: 'conceptrice-rédactrice',
        date: '2025-07-18',
        testimony:
            "Lors de la sortie de ChatGPT à large échelle en France, courant 2023, j'ai perdu mon job de conceptrice-rédactrice (plus aucun client direct ni agence de com' n'a fait appel à mes services, alors que j'étais relativement connue avec des clients fidèles dans mon périmètre d'action). Comme j'avais déjà une activité liée à la formation de formateurs, j'ai pu tuiler. Je trouve ces outils peut-être efficaces mais ça me laisse perplexe par rapport aux nombreux enjeux (cognitifs, environnementaux, sociaux, de data / cybersécurité, dépendance aux nouvelles techno) et j'avoue avoir peur de devenir les poulets de batterie."
    },
    {
     //   name: 'Adeline',
      //  age: 35, // 30-39 ans
        job: 'artisan couture et assistante de bureau',
        date: '2025-09-18',
        testimony:
            "Je travaille à la fois dans l'artisanat (couture) et à la fois avec des outils informatiques (assistanat de bureau). Jusqu'à présent je n'utilise pas ChatGPT car l'outil ne m'inspire pas confiance en termes de sécurité de l'humain et de son éco-système personnel. L'IA fait de grandes promesses d'un côté (innovation, gagner du temps) mais menace d'un autre (perte d'emplois, humains qui perdent leur savoir-faire). Comment trouver cet équilibre qui prend en compte tous les éco-systèmes et non pas uniquement ceux qui vont vite ?"
    }
];

    let articleShowcaseItems = [
        {
            category: 'Jeune',
            image: 'https://img.lemde.fr/2025/05/06/0/0/6000/4000/960/0/75/0/9858359_sirius-fs-upload-1-kwwx9kapl26a-1746525011926-000-33wp2uw.jpg',
            date: '2025-05-07',
            title: "Les premiers pas en entreprise entravés par l'IA",
            summary: "Il devient plus difficile d'entrer sur le marché du travail car les tâches d'habitude confiées aux débutants sont plus facilement confiées aux IA.",
            url: 'https://www.lemonde.fr/emploi/article/2025/05/07/les-premiers-pas-en-entreprise-entraves-par-l-ia_6603738_1698637.html'
        },
        {
            category: 'Jeune',
            image: 'https://www.developpez.net/forums/attachments/p666742d1/a/a/a',
            date: '2025-04-23',
            title: "Diplômés et désabusés à l'ère de l'IA",
            summary: "La génération Z estime que les diplômes universitaires ont été une perte de temps et d'argent tandis que l'IA s'infiltre de plus en plus en entreprise.",
            url: 'https://intelligence-artificielle.developpez.com/actu/371285/Diplomes-et-desabuses-a-l-ere-de-l-IA-la-generation-Z-estime-que-les-diplomes-universitaires-ont-ete-une-perte-de-temps-et-d-argent-tandis-que-l-IA-s-infiltre-de-plus-en-plus-en-entreprise/'
        },
        {
            category: 'Impact',
            image: 'https://www.viceversamag.com/wp-content/uploads/2024/07/Temoignage-Une-traductrice-freelance-perd-60-de-son-chiffre.jpg',
            date: '2024-07-20',
            title: "Une traductrice freelance perd 60% de son chiffre d'affaires",
            summary: "Virginie Maisonobe, traductrice indépendante, voit ses revenus chuter drastiquement alors que ses clients automatisent la traduction via l'IA.",
            url: 'https://www.viceversamag.com/temoignage-une-traductrice-freelance-perd-60-de-son-chiffre-daffaires-a-cause-de-lintelligence-artificielle/'
        },
        {
            category: 'Licenciement',
            image: 'https://www.lebigdata.fr/wp-content/uploads/2023/07/Emily-Hanley-1050x525.jpg.webp',
            date: '2023-07-21',
            title: "Une rédactrice publicitaire remplacée par ChatGPT",
            summary: "Emily Hanley, copywriter, raconte comment ses clients l'ont remplacée par ChatGPT et comment elle a dû se réorienter.",
            url: 'https://www.lebigdata.fr/emily-a-perdu-travail-a-cause-chatgpt'
        },
        {
            category: 'Licenciement',
            image: 'https://img.20mn.fr/Tm4fb8R2Sqejl4HFIlVpbyk/1444x920_cyberattaque-cybercriminalite-ordinateur-pirate-hacker',
            date: '2023-07-17',
            title: "Un patron licencie 90% de ses équipes pour une IA",
            summary: "Suumit Shah, dirigeant d'une entreprise tech en Inde, a licencié 90% de ses équipes pour un chatbot, créant la polémique.",
            url: 'https://www.20minutes.fr/economie/emploi/4045848-20230717-intelligence-artificielle-patron-licencie-presque-tous-salaries-remplacer-chatbot'
        },
        {
            category: 'Licenciement',
            image: 'https://image.jeuxvideo.com/medias/170185/1701854628-1392-photo-intelligence-artificielle-et-robot.jpg',
            date: '2023-12-07',
            title: "Des rédacteurs remplacés par ChatGPT témoignent",
            summary: "Plusieurs rédacteurs témoignent de leur remplacement par ChatGPT et de leur reconversion forcée.",
            url: 'https://www.jeuxvideo.com/news/1829824/j-ai-perdu-mon-emploi-a-cause-de-l-ia-ca-a-deja-commence-l-homme-commence-deja-a-etre-remplace-par-l-intelligence-artificielle-et-ces-licenciements-en-sont-la-preuve.htm'
        },
        {
            category: 'Impact',
            image: '/emploi-ia/article-placeholder.svg',
            date: '2024-06-12',
            title: "L'IA générative s'attaque aux métiers des cols blancs",
            summary: "Analyse des secteurs menacés comme le juridique, la communication, ou la relation client, avec des exemples concrets.",
            url: 'https://www.lemonde.fr/emploi/article/2024/06/12/l-ia-generative-s-attaque-aux-metiers-des-cols-blancs_6239046_1698637.html'
        },
        {
            category: 'Impact',
            image: '/emploi-ia/article-placeholder.svg',
            date: '2024-06-18',
            title: "Le FMI met en garde contre les effets de l'IA sur l'emploi",
            summary: "Le FMI estime que 60% des emplois dans les pays développés pourraient être impactés par l'IA, menaçant les classes moyennes.",
            url: 'https://www.lemonde.fr/economie/article/2024/06/18/intelligence-artificielle-des-chercheurs-du-fmi-mettent-en-garde-contre-les-effets-secondaires-de-l-innovation-popularisee-par-chatgpt-sur-l-emploi_6241051_3234.html'
        },
        {
            category: 'Impact',
            image: '/emploi-ia/article-placeholder.svg',
            date: '2023-11-08',
            title: "Une graphiste se sent dépossédée par l'IA",
            summary: "Catherine, graphiste freelance, partage sa crainte de voir son expertise remplacée par des IA génératives visuelles.",
            url: 'https://www.lemonde.fr/emploi/article/2023/11/08/l-intelligence-artificielle-cet-ogre-numerique-qui-angoisse-les-travailleurs_6198924_1698637.html'
        },
        {
            category: 'Impact',
            image: '/emploi-ia/article-placeholder.svg',
            date: '2024-08-28',
            title: "L'IA entraîne une perte d'autonomie chez les salariés",
            summary: "Témoignages de salariés qui décrivent une perte de sens, d'autonomie et de contrôle sur leur métier avec l'arrivée de l'IA.",
            url: 'https://www.lemonde.fr/emploi/article/2024/08/28/intelligence-artificielle-la-perte-d-autonomie-des-salaries-en-question_6297347_1698637.html'
        },
        {
            category: 'Licenciement',
            image: 'https://www.lejdd.fr/lmnr/f/webp/rcrop/1440,960,FFFFFF,forcey,center-middle/img/var/jdd/public/styles/paysage/public/media/image/2023/05/13/18/2023-05-02t204117z_1759658100_rc2y40akk5tj_rtrmadp_3_usa-artifical-intelligence-biden.jpg?VersionId=mnSJIPBqi05W3GWV8i.QDxT5dzH8eevi',
            date: '2023-05-15',
            title: "Un salarié sur deux redoute de perdre son emploi",
            summary: "Une étude révèle que près de 50% des actifs craignent un remplacement par l'intelligence artificielle.",
            url: 'https://www.lejdd.fr/economie/un-salarie-sur-deux-redoute-de-perdre-son-emploi-cause-de-lintelligence-artificielle-135738'
        },
        {
            category: 'Impact',
            image: 'https://assets-decodeurs.lemonde.fr/redacweb/INFOGRAPHIE_1324_ECO_CENTRES_APPEL/teleperformance@3x.png',
            date: '2024-03-29',
            title: "Teleperformance face au vertige de l'IA",
            summary: "Le leader mondial des centres d'appel perd 2/3 de sa valeur en Bourse et se réorganise face à la menace de l'IA.",
            url: 'https://www.lemonde.fr/economie/article/2024/03/29/teleperformance-geant-des-centres-d-appels-face-au-vertige-de-l-intelligence-artificielle_6224792_3234.html'
        },
        {
            category: 'Abus',
            image: 'https://danslesalgorithmes.net/wp-content/uploads/2024/12/Amelia-Wattenberger-6.png',
            date: '2024-12-10',
            title: "L'IA générative, nouvelle couche d'exploitation du travail",
            summary: "Sous prétexte de réduction des coûts et des délais, l'IA générative impacte l'organisation du travail, renforçant l'exploitation des travailleurs.",
            url: 'https://danslesalgorithmes.net/2024/12/10/lia-generative-nouvelle-couche-dexploitation-du-travail/'
        },
        {
            category: 'Abus',
            image: 'https://www.franceinfo.fr/pictures/3YpBpc7AwuVkerXrN7ttgLVUkYA/0x0:2656x1494/2656x1494/filters:format(avif):quality(50)/2024/04/08/ia-workers-light-66142553cd2f3768039156.jpg',
            date: '2024-04-09',
            title: "Le travail caché des petites mains de l'IA",
            summary: "Le travail des petites mains dans les pays pauvres alimente les quantités colossales de données nécessaires à l'intelligence artificielle.",
            url: 'https://www.franceinfo.fr/internet/intelligence-artificielle/ils-profitent-de-notre-pauvrete-derriere-le-boom-des-intelligences-artificielles-generatives-le-travail-cache-des-petites-mains-de-l-ia_6466742.html'
        },
        {
            category: 'Licenciement',
            image: '/emploi-ia/article-placeholder.svg',
            date: '2024-05-02',
            title: "La crise de l'emploi liée à l'IA est là, maintenant",
            summary: "Cette crise se manifeste par une érosion progressive des emplois créatifs et des services publics, orchestrée par des dirigeants qui utilisent le discours de l'efficacité.",
            url: 'https://www.bloodinthemachine.com/p/the-ai-jobs-crisis-is-here-now'
        },
        {
            category: 'Jeune',
            image: 'https://cdn.theatlantic.com/thumbor/cZs_VrZBf7AovnyKZe7mo2zQlow=/0x0:2160x2700/960x1200/media/img/2025/04/29/25_4_28_thompson_young_grads_final_vertical/original.jpg',
            date: '2025-04-15',
            title: "L'IA en compétition contre les jeunes diplômés",
            summary: "Quelque chose d'alarmant est en train de se produire sur le marché du travail : l'IA entre en compétition directe avec les nouveaux arrivants.",
            url: 'https://www.theatlantic.com/economy/archive/2025/04/job-market-youth/682641/'
        },
        {
            category: 'Évolution',
            image: '/emploi-ia/article-placeholder.svg',
            date: '2024-10-01',
            title: "Adaptation sociétale à l'automatisation par l'IA",
            summary: "Un cadre académique pour analyser les stratégies d'adaptation face à l'automatisation massive du travail par l'IA.",
            url: 'https://drive.google.com/file/d/1uDd5NlrSHTIrxlkq0VeIXmVGMOlPfrK3/view?usp=sharing'
        },
        {
            category: 'Licenciement',
            image: 'https://qz.com/cdn-cgi/image/width=1920,quality=85,format=auto/https://assets.qz.com/media/837322b9991c5dfedcadaec14b14d5ab.jpg',
            date: '2025-05-27',
            title: "L'ère des licenciements liés à l'IA a commencé",
            summary: "L'automatisation affecte de plus en plus d'emplois : SecOps, développeurs, rédacteurs, communicants, webdesigners. Des personnes touchées témoignent.",
            url: 'https://qz.com/ai-layoffs-jobs-microsoft-walmart-tech-workers-1851782194'
        },
        {
            category: 'Licenciement',
            image: 'https://letemps-17455.kxcdn.com/photos/3bd2ad24-daee-4b1c-a4a7-26b5eab38644/small',
            date: '2025-06-01',
            title: "L'IA va-t-elle massacrer nos emplois par millions ?",
            summary: "Une analyse approfondie des prévisions sur l'impact de l'intelligence artificielle sur le marché du travail mondial.",
            url: 'https://www.letemps.ch/opinions/chroniques/l-intelligence-artificielle-va-t-elle-massacrer-nos-emplois-par-millions'
        },
        {
            category: 'Licenciement',
            image: 'https://images.radio-canada.ca/q_auto,w_1200/v1/ici-info/16x9/bureau-fonctionnaire-federal-generique-2.jpg',
            date: '2025-03-20',
            title: "Plus de 300 postes abolis au Bureau de la traduction",
            summary: "Le Bureau de la traduction du Canada supprime plus de 300 postes dans un contexte d'automatisation croissante.",
            url: 'https://ici.radio-canada.ca/nouvelle/2149145/suppression-emplois-bureau-traduction-canada'
        },
        {
            category: 'Licenciement',
            image: 'https://images.axios.com/lLWkC4EQA_CSL3FKHRyQXqEyE74=/0x0:1920x1080/1920x1080/2025/05/27/1748366430737.jpg?w=1920',
            date: '2025-05-28',
            title: "Derrière le rideau : un bain de sang en col blanc",
            summary: "Une enquête révèle l'ampleur des suppressions d'emplois qualifiés liées à l'adoption de l'IA dans les entreprises.",
            url: 'https://www.axios.com/2025/05/28/ai-jobs-white-collar-unemployment-anthropic'
        },
        {
            category: 'Impact',
            image: 'https://www.radiofrance.fr/pikapi/images/f9243c93-b270-4eeb-b479-01f043702a38/1200x680',
            date: '2025-06-11',
            title: "L'IA promet-elle un cataclysme pour l'emploi ?",
            summary: "Un débat approfondi sur les promesses et menaces de l'intelligence artificielle pour l'avenir du travail.",
            url: 'https://www.radiofrance.fr/franceculture/podcasts/questions-du-soir-le-debat/l-ia-promet-elle-un-cataclysme-pour-l-emploi-6597497'
        }
    ];
    
    // Sort testimonials by date descending (most recent first)
    testimonials.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Sort articleShowcaseItems by date descending
    articleShowcaseItems.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Set default image for articleShowcaseItems if undefined
    articleShowcaseItems = articleShowcaseItems.map(item => ({
        ...item,
        image: item.image || '/emploi-ia/article-placeholder.svg'
    }));
    
</script>

## Qui sommes-nous ?

Nous sommes un groupe de contributeurs de Pause IA qui réfléchit spécifiquement à l'impact de l'IA sur les emplois, aujourd'hui, dans 1 mois, dans 1 an, dans 2 ans... Comment le travail humain va-t-il évoluer ? Quand et comment chacun de nous sera impacté ? Quel risque avons-nous de perdre notre emploi ? Quelle reconversion envisager ? Quelles sont les nouvelles compétences demandées ? Vers quelle nouvelle organisation du travail allons-nous ? Comment subsisterons-nous?

## Nous sommes au début de nos réflexions, et nous vous proposons déjà :

- [Un questionnaire pour savoir quel impact a l’IA sur votre travail](#enquete)
- [Des témoignages illustrant l’impact de l’IA sur des parcours professionnels](#temoignage)
- [Une revue de presse sur l’impact de l’IA sur le monde du travail](#revue)
- [Un formulaire pour que vous puissiez nous donner un feedback](#avis-form)

## L’IA : une menace croissante pour de nombreux emplois

Avec les progrès rapides de l’intelligence artificielle, de nombreux métiers risquent d’être automatisés, partiellement ou totalement. L’essor des IA génératives a déjà commencé à affecter des professions comme journaliste, traducteur ou illustrateur. Et cette tendance pourrait s’étendre à d’autres secteurs à mesure que [l’IA devient plus générale](https://fr.wikipedia.org/wiki/Intelligence_artificielle_g%C3%A9n%C3%A9rale).

<h2 id="enquete"> Je participe à la grande enquête sur l'IA au travail ! </h2>

Comment l’IA impacte-t-elle votre vie professionnelle ? L’association Pause IA réalise une enquête sur l’IA et l’emploi pour évaluer et comprendre l’impact de l’IA sur le monde du travail.

<EmploiForm/>

<h2 id="temoignage"> L'IA et mon travail : je témoigne ! </h2>

Nous recueillons régulièrement des témoignages de personnes dont la vie professionnelle a été impactée par l’IA.
Si vous aussi avez été concerné, ou pensez que cela pourrait arriver, vous pouvez partager votre expérience [grâce à notre questionnaire](https://framaforms.org/enquete-2025-ia-et-emploi-1750943896).

<TestimonialCarousel testimonials={testimonials} />

<h2 id="revue"> Revue de presse: je reste informé ! </h2>

De nombreux médias abordent l’impact de l’IA sur le marché du travail.
Nous collectons régulièrement des articles de presse traitant de ce sujet.

<ArticleShowcase articles={articleShowcaseItems} />

<EmploiAvisForm />
