# Page « Écrire à mes élus »

Documentation technique et fonctionnelle de l'outil qui permet à un citoyen
d'écrire à ses députés et sénateurs sur les risques de l'IA, avec un minimum de
friction. Inspiré de ControlAI, adapté à la France et au périmètre de Pause IA.

URL : `/[lang]/ecrire-a-mes-elus` (FR et EN).

---

## 1. Parcours utilisateur

1. **Étape 1 : trouver ses élus.**
   L'utilisateur saisit son **code postal**, son **nom** et sa **ville**
   (saisis une seule fois, ils remplissent ensuite chaque mail). Il obtient la
   liste de ses sénateurs (par département) et de son/ses députés (par
   circonscription exacte quand le géocodage le permet), avec photo et fiche
   officielle.
2. **Étape 2 : rédiger le mail.**
   Pour chaque élu, un email est pré-rédigé. L'utilisateur peut choisir un
   **sujet principal** (3 angles), une **longueur** (courte / détaillée) et
   ajouter une **phrase personnelle** (recommandée). Il ouvre ensuite son
   client mail (`mailto:`) ou copie le texte.

La progression (« Écrit ✓ ») et les infos personnelles sont mémorisées
**localement** (voir § 4).

---

## 2. Données des élus

- Générées par `node scripts/generate-elus.js` à partir de sources ouvertes
  (data.gouv « deputes-active.csv », Sénat « ODSEN_GENERAL.csv ») et figées dans
  `src/lib/data/elus.json`. **Aucun appel réseau au runtime** : le site survit
  aux pannes des sources.
- Géocodage code postal → circonscription via `code-postal-circo.json`
  (construit à partir de `commune-circo.json`, lui-même issu de la table
  officielle commune ↔ circonscription, cf. `scripts/build-commune-circo.py`).
- Résolution (`src/lib/data/elus.ts`) :
  - **Sénateurs** : par département (toujours fiable).
  - **Députés** : par circonscription exacte si le code postal est connu,
    sinon repli sur tous les députés du département.

### Ciblage fin de la circonscription (cas ambigu)

Dans les grandes villes, **un code postal recouvre plusieurs circonscriptions**
(ex. 31500 à Toulouse en couvre 5). On ne peut donc pas déduire la
circonscription exacte du seul code postal, et l'outil affiche alors « Vos
députés (votre ville) ».

En **amélioration progressive**, l'utilisateur peut préciser son adresse pour
identifier **son** député (celui dont il est réellement l'administré) :

- **Géocodage** de l'adresse via la **Base Adresse Nationale** (BAN,
  `api-adresse.data.gouv.fr`, service public sans clé) → coordonnées.
- **Point-in-polygon** contre les **contours de circonscriptions** du seul
  département concerné, chargés à la demande depuis `static/circo-geo/<dept>.json`
  (`src/lib/data/circo-geo.ts`).
- Le député trouvé est **remonté en tête**, marqué d'une **pastille prioritaire**,
  et son mail passe en « je réside dans **votre circonscription** » (signal
  « administré » plein) ; les autres restent en « votre ville ».
- **Non bloquant** : tout échec (adresse introuvable, BAN indisponible) retombe
  silencieusement sur le comportement par défaut.
- **Vie privée** : l'adresse n'est envoyée qu'à la BAN (service public de l'État),
  uniquement pour trouver la circonscription, jamais conservée par le site.
- **Poids** : rien n'est chargé par défaut ; seulement le fichier d'**un**
  département (~20 à 230 Ko) est récupéré, et uniquement dans le cas ambigu.

Les fichiers `static/circo-geo/*.json` sont générés par
`node scripts/build-circo-geo.js` à partir du GeoJSON source
`scripts/data/circonscriptions-legislatives-p20.geojson` (jeu de données
data.gouv « Contours géographiques des circonscriptions législatives », version
p20). À **régénérer au prochain redécoupage** législatif.

- **Génération idempotente** (`writeStableJson` : clés triées, `generatedAt`
  préservé) → une PR ne s'ouvre que si le contenu change réellement.
- **Garde-fous** : seuils sur le nombre d'élus / d'emails ; en cas d'anomalie,
  le script jette une erreur, n'écrit rien, et sort en code 1 (déclenche une
  alerte).
- **Photos** : par défaut, le portrait officiel (Assemblée / Sénat) est construit
  par motif d'URL ; si une photo est cassée, la page bascule proprement sur les
  initiales (`on:error`). Pour en récupérer davantage, lancer
  `node scripts/generate-elus.js --check-photos` (ou `CHECK_PHOTOS=1` avec le
  runner serveur) : chaque portrait est vérifié et, **uniquement s'il est cassé**,
  remplacé par une photo Wikimedia Commons via Wikidata (appariement strict :
  humain + nationalité française + politique + libellé exact + résultat unique,
  pour éviter les homonymes). Les valeurs ainsi validées sont **préservées** par
  les exécutions suivantes (pas de réécrasement).

### Mise à jour automatique

- **Filet principal** : timer systemd sur le serveur
  (`scripts/update-elus-server.sh`, `scripts/systemd/update-elus.{service,timer}`).
  Il régénère les données et **ouvre une PR** (jamais de push direct sur `main`).
  Un humain relit et merge ; Netlify déploie au merge.
- **Filet de secours manuel** : workflow GitHub `update-elus.yml`
  (déclenchement manuel uniquement, pour régénérer si le serveur est indispo).
- **Alerte** : en cas d'échec, notification via `ALERT_WEBHOOK` (Discord/Slack)
  avec repli mail (`ALERT_EMAIL`).

---

## 3. Contenu des mails

Le contenu et la cible de chaque campagne vivent dans **`src/lib/data/elu-actions.ts`**
(« moteur d'actions »). La page sélectionne une action via `?action=<id>` ; sans
paramètre, c'est l'action `default` (message générique vers les élus de
l'utilisateur). Une action peut cibler **les élus de l'utilisateur** (par code
postal) **ou une liste de destinataires précis** (un ministre, une commission).
Voir `docs/ecrire-a-mes-elus-actions.md` pour créer une action ciblée.

Le corps est **modulaire** et assemblé côté client (`buildParagraphs`). Voir le
document séparé `docs/ecrire-a-mes-elus-textes.md` pour le texte complet destiné
à la validation par l'équipe communication.

Structure d'un mail :

1. **Salutation** genrée selon la civilité **du destinataire** et son rôle
   (« Madame la Députée », « Monsieur le Sénateur », repli neutre).
2. **Phrase d'introduction** : « Je m'appelle X et je vous écris car je réside
   dans votre circonscription/ville/département. » Formulation **neutre (non
   genrée)** côté expéditeur : on emploie des verbes plutôt que des adjectifs
   accordés (« je réside », « me préoccupe »), pour ne pas présumer le genre de
   l'expéditeur et éviter d'avoir à demander sa civilité.
   La **localité affirmée pour un député dépend de la fiabilité du géocodage** :
   « votre circonscription » seulement quand le code postal désigne une seule
   circonscription ; « votre ville » quand il en couvre plusieurs (grandes villes
   comme Toulouse) ; « votre département » en repli. Cela évite d'affirmer à tort
   « votre circonscription » à des députés dont l'utilisateur n'est pas
   nécessairement un administré.
3. **Accroche** (`HOOKS`) : tirée au hasard parmi 3 par visiteur.
4. **Focus** (`FOCUS`) : selon l'angle choisi (3 angles).
5. _(version détaillée)_ **Complément** (`COMPLEMENT`) + **Sondage** (`POLL`).
6. _(si renseignée)_ **Phrase personnelle** de l'utilisateur.
7. **Reconnaissance des bénéfices** (`BALANCE`) : présente dans toutes les
   versions, juste avant l'appel, pour désamorcer le ton alarmiste.
8. **Appel** (`ASK`) : demande de soutenir une gouvernance internationale de
   pause sur les modèles les plus avancés, aux niveaux français et européen.
9. **Signature** : nom + ville (ou localité de l'élu en repli).

**Objet** : tiré au hasard parmi 4 (`SUBJECTS`), pour éviter qu'un objet
identique se répète dans toutes les boites parlementaires.

**Accroches et objets tournants** : la rotation diversifie les envois et limite
le repérage « copier-coller » par les équipes parlementaires.

**Règle de style** : aucun tiret long (—) dans le texte destiné aux
utilisateurs.

---

## 4. Persistance locale (cache)

Stockage **`localStorage`**, donc **par navigateur et par appareil**, persistant
au rafraîchissement et à la fermeture. Aucune synchronisation serveur.

| Clé              | Contenu                                     |
| ---------------- | ------------------------------------------- |
| `elus-contactes` | IDs des élus cochés « Écrit ✓ »             |
| `elus-user`      | `{ userName, userVille, personalSentence }` |

- Un bouton **« Réinitialiser ma progression »** efface `elus-contactes`
  (sans toucher au nom / à la ville).
- La coche « Écrit ✓ » = « a cliqué pour ouvrir le mail sur cet appareil »,
  **pas** une preuve d'envoi.

---

## 5. Mesure des envois

`mailto:` ne permet aucune confirmation d'envoi réelle. Deux signaux distincts :

- **Intention** (`/api/log-intent`) : le clic sur « Ouvrir mon email » est
  envoyé via `navigator.sendBeacon` (qui survit à la navigation) et journalisé
  comme **Activité CiviCRM** (type `76` par défaut, surchargé par
  `CIVICRM_ELU_INTENT_ACTIVITY_ID`). **Aucune donnée personnelle** : seulement
  l'élu visé et les réglages (angle, longueur). Best-effort, jamais bloquant.
- **Envois réels** : la **copie cachée (BCC)** reçue à `campagne@pauseia.fr`.
  C'est le seul compteur fiable. La FAQ informe que ce BCC peut être retiré
  avant l'envoi.

### Capture newsletter (opt-in)

À l'étape 2, une case **non cochée par défaut** propose « Tenez-moi informé des
prochaines actions ». Si l'utilisateur la coche et saisit son email, on l'inscrit
à la newsletter via `/api/subscribe` (groupe Newsletter + Call to Action), avec
`source: ecrire-a-mes-elus[:<action>]`. C'est le **seul** cas où un email quitte
l'appareil, et toujours sur **consentement explicite**.

---

## 6. Accessibilité / mobile

- Puces de sujet et toggle de longueur : `<button>` avec `aria-pressed` et
  `role="group"` + `aria-label`.
- Avatars décoratifs : `alt=""` ; photo en erreur masquée via `on:error`
  (les initiales restent).
- Mise en page responsive (cartes, liste d'élus en colonne sur petit écran).

---

## 7. Cas « pas d'adresse email »

Si l'élu ne publie pas d'email :

- une note explique de copier le texte et d'utiliser le **formulaire de
  contact** (ou la fiche officielle si aucun formulaire) ;
- la note BCC est masquée (un formulaire web n'a pas de copie cachée).

---

## 8. Fichiers principaux

| Fichier                                                 | Rôle                                 |
| ------------------------------------------------------- | ------------------------------------ |
| `src/routes/[lang=lang]/ecrire-a-mes-elus/+page.svelte` | Page (UI + contenu des mails)        |
| `src/lib/data/elu-actions.ts`                           | Moteur d'actions (contenu + ciblage) |
| `src/routes/api/log-intent/+server.ts`                  | Journalisation des intentions        |
| `src/lib/data/elus.ts`                                  | Résolution code postal → élus        |
| `src/lib/data/elus.json`                                | Données générées (élus + emails)     |
| `src/lib/data/code-postal-circo.json`                   | Géocodage code postal → circo        |
| `src/lib/data/commune-circo.json`                       | Table commune → circonscription      |
| `scripts/generate-elus.js`                              | Génération des données               |
| `scripts/build-commune-circo.py`                        | Construction de la table communes    |
| `scripts/update-elus-server.sh`                         | Runner serveur (PR + alerte)         |
| `scripts/systemd/update-elus.{service,timer}`           | Planification serveur                |
| `.github/workflows/update-elus.yml`                     | Filet de secours manuel (GitHub)     |
| `docs/ecrire-a-mes-elus-textes.md`                      | Textes des mails (validation comm')  |
| `docs/ecrire-a-mes-elus-actions.md`                     | Guide : créer une action ciblée      |

---

## 9. Variables d'environnement

Réutilise les identifiants CiviCRM existants (`CIVICRM_BASE_URL`,
`CIVICRM_API_KEY`, `CIVICRM_SITE_KEY`, `CIVICRM_NEWSLETTER_API_CONTACT_ID`).
Optionnel :

- `CIVICRM_ELU_INTENT_ACTIVITY_ID` : type d'activité pour la journalisation des
  intentions (défaut `76`).

Côté serveur (hors `.env` applicatif) : `GITHUB_TOKEN`, `ALERT_WEBHOOK`,
`ALERT_EMAIL`, `COMMUNE_CIRCO_URL` (cf. scripts).

---

## 10. Pistes d'amélioration (non faites)

- **Preuve sociale** : « déjà X mails envoyés » (à activer quand le volume BCC
  le permet).
- Mécanisme actif de **relance** (aujourd'hui seulement expliqué en FAQ).
- Partage natif mobile (`navigator.share`) si l'on veut de la diffusion.
- Rendre la statistique du sondage **intemporelle** (éviter l'ancrage « 2026 »).
