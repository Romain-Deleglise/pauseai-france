# Bot YouTube Shorts — Pause IA

Publie automatiquement sur la chaîne YouTube de Pause IA les vidéos déposées
dans un dossier Google Drive.

## Comment ça marche

1. Vous déposez vos Shorts dans un dossier Drive dédié, **« À publier »**.
2. Un cron sur le serveur Hetzner exécute le bot régulièrement (ex. toutes les heures).
3. Le bot prend chaque nouvelle vidéo, l'**uploade sur YouTube** (le titre est le
   nom du fichier), puis **déplace** le fichier vers un dossier **« Publié »**.

> 💡 **Pour qu'une vidéo soit reconnue comme Short**, elle doit être **verticale
> (9:16)** et durer **≤ 3 minutes**. Le bot ajoute `#Shorts` dans la description
> pour aider YouTube à la classer, mais c'est le format de la vidéo qui décide.

### Garde-fous

- Le bot ne regarde **QUE** le dossier « À publier ». Rien ne part par accident :
  vous gardez le contrôle en décidant ce que vous y déposez.
- `MAX_PER_RUN` limite le nombre d'uploads par exécution (et reste sous le quota).
- En cas d'échec d'upload, la vidéo **n'est pas déplacée** → elle sera retentée.
- Un verrou empêche deux exécutions simultanées.

### Quota YouTube ⚠️

L'API YouTube autorise par défaut **~6 uploads/jour** (10 000 unités, ~1600 par
upload). Au-delà, demander une augmentation de quota à Google. Gardez
`MAX_PER_RUN` bas et une fréquence de cron raisonnable.

---

## Installation (une seule fois)

### 1. Créer les identifiants Google

Dans [Google Cloud Console](https://console.cloud.google.com/) :

1. Créez (ou réutilisez) un projet.
2. **API et services › Bibliothèque** : activez **YouTube Data API v3** et
   **Google Drive API**.
3. **API et services › Écran de consentement OAuth** : configurez l'écran
   (type « Externe » suffit ; ajoutez votre compte Google en « utilisateur de test »
   si l'app reste en mode test).
4. **API et services › Identifiants › Créer › ID client OAuth › Application de
   bureau**. Notez le **Client ID** et le **Client secret**.

### 2. Générer le refresh token (sur votre machine, navigateur dispo)

```bash
cd scripts/youtube-shorts-bot
npm install
cp .env.example .env
# Renseignez GOOGLE_CLIENT_ID et GOOGLE_CLIENT_SECRET dans .env
npm run auth
```

Ouvrez l'URL affichée, **connectez-vous avec le compte qui gère la chaîne
YouTube**, autorisez l'accès. Le script affiche un `GOOGLE_REFRESH_TOKEN` :
copiez-le.

> ⚠️ Le compte que vous utilisez pour autoriser doit avoir les droits de
> publication sur la chaîne YouTube Pause IA. Si la chaîne est une « marque »
> (Brand Account), choisissez-la lors de l'écran de sélection de compte Google.

### 3. Récupérer les IDs des dossiers Drive

Dans Drive, ouvrez le dossier « À publier ». L'ID est dans l'URL :
`https://drive.google.com/drive/folders/<ID>`. Faites de même pour « Publié ».
Le compte Google utilisé à l'étape 2 doit avoir accès à ces dossiers.

### 4. Déployer sur le serveur Hetzner

```bash
# Sur le serveur, dans /opt/scripts/
git clone ... # ou copiez le dossier scripts/youtube-shorts-bot/
cd /opt/scripts/youtube-shorts-bot
npm install --omit=dev
cp .env.example .env
# Remplissez .env avec : CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN,
# DRIVE_SOURCE_FOLDER_ID, DRIVE_PUBLISHED_FOLDER_ID
```

Testez une exécution manuelle :

```bash
node index.js
```

### 5. Programmer le cron

```bash
crontab -e
```

Ajoutez (toutes les heures, à la minute 0) :

```cron
0 * * * * cd /opt/scripts/youtube-shorts-bot && /usr/bin/node index.js >> /var/log/youtube-shorts-bot.log 2>&1
```

Vérifiez les logs :

```bash
tail -f /var/log/youtube-shorts-bot.log
```

---

## Configuration (`.env`)

| Variable                    | Rôle                                                      |
| --------------------------- | -------------------------------------------------------- |
| `GOOGLE_CLIENT_ID`          | ID client OAuth (application de bureau)                   |
| `GOOGLE_CLIENT_SECRET`      | Secret client OAuth                                       |
| `GOOGLE_REFRESH_TOKEN`      | Token obtenu via `npm run auth`                          |
| `DRIVE_SOURCE_FOLDER_ID`    | Dossier surveillé « À publier »                          |
| `DRIVE_PUBLISHED_FOLDER_ID` | Dossier « Publié » (destination après upload)            |
| `MAX_PER_RUN`               | Max d'uploads par exécution (défaut 5)                   |
| `PRIVACY_STATUS`            | `public` \| `unlisted` \| `private` (défaut `public`)    |
| `DEFAULT_DESCRIPTION`       | Description de chaque Short (défaut `#Shorts`)            |
| `YOUTUBE_CATEGORY_ID`       | Catégorie YouTube (défaut 25 = News & Politics)          |
| `DEFAULT_LANGUAGE`          | Langue des métadonnées (défaut `fr`)                     |

## Dépannage

- **`invalid_grant` au démarrage** : le refresh token a été révoqué ou l'app
  OAuth est repassée en mode test après expiration. Relancez `npm run auth`.
- **`quotaExceeded`** : quota d'upload journalier atteint. Le bot s'arrête et
  reprend automatiquement le lendemain.
- **Vidéo non reconnue comme Short** : vérifiez le format vertical 9:16 et la
  durée ≤ 3 min.
- **Le fichier n'est pas déplacé** : c'est qu'une erreur est survenue à l'upload.
  Consultez le log — la vidéo sera retentée au prochain run.
