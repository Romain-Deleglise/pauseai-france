# Données des élus (`elus.json`)

Alimente la page **« Écrire à mes élus »** (`/ecrire-a-mes-elus`) : recherche des
députés et sénateurs par code postal, avec email pré-rempli.

## Mise à jour automatique

Deux mécanismes possibles (en choisir un) :

### a) GitHub Actions (sans serveur)

Le workflow **`.github/workflows/update-elus.yml`** régénère les données chaque
semaine (cron du lundi) et **ouvre une PR** quand elles ont changé. Plus rien à
faire à la main : il suffit de relire le diff et de merger. Déclenchable aussi
manuellement via l'onglet _Actions_ → _Mise à jour des élus_ → _Run workflow_.

### b) Serveur (timer systemd)

Pour faire tourner la mise à jour sur le serveur Hetzner (comme les autres
bots), `scripts/update-elus-server.sh` régénère les données et **pousse
directement sur `main`** : Netlify redéploie automatiquement le site.

```bash
# 1. Cloner le repo sur le serveur (une fois)
sudo git clone https://github.com/Pause-IA/pauseai-france.git /opt/bots/pauseai-france
sudo chown -R romain:romain /opt/bots/pauseai-france

# 2. Donner au serveur le droit de POUSSER sur le repo (write). Au choix :
#    - PAT GitHub « fine-grained » avec permission Contents: Read and write,
#      stocké via git credential store :
git -C /opt/bots/pauseai-france config credential.helper store
#      (le 1er push demandera identifiant = nom GitHub, mot de passe = le PAT)
#    - OU une clé SSH de déploiement avec write access (remote en git@github.com:...)

# 3. Test manuel
cd /opt/bots/pauseai-france
chmod +x scripts/update-elus-server.sh
./scripts/update-elus-server.sh        # doit générer, committer et pousser

# 4. Installer le timer hebdomadaire
sudo cp scripts/systemd/update-elus.service /etc/systemd/system/
sudo cp scripts/systemd/update-elus.timer   /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now update-elus.timer
systemctl list-timers update-elus.timer     # vérifier la prochaine exécution
```

> Adapter `User=`, `WorkingDirectory=` et `REPO_DIR=` dans
> `update-elus.service` si le clone n'est pas dans `/opt/bots/pauseai-france`.
> Le script ne requiert que **Node 18+** et **git** (aucune dépendance npm).

## Régénérer manuellement

```bash
pnpm run generate-elus                    # régénère src/lib/data/elus.json
node scripts/generate-elus.js --report    # + rapport de qualité des emails
```

> ⚠️ Nécessite un accès réseau ouvert vers `nosdeputes.fr` / `nossenateurs.fr`.
> Certains environnements (CI sandboxée, proxy d'entreprise) bloquent ces hôtes.

## Géocodage code postal → circonscription (clic unique sur le bon député)

Avec la variable d'environnement `COMMUNE_CIRCO_URL`, le script produit en plus
`code-postal-circo.json`, qui permet de cibler **le député exact** au lieu de
lister tous les députés du département.

### Où trouver le fichier (≈ 2 clics)

Source recommandée : le dataset **« Contours des circonscriptions législatives »**
du Ministère de l'Intérieur sur data.gouv.fr :
<https://www.data.gouv.fr/datasets/contours-geographiques-des-circonscriptions-legislatives>

1. Ouvrir la page, section **Fichiers / Ressources**.
2. Sur la ressource **GeoJSON**, copier le lien de téléchargement (clic droit →
   « Copier l'adresse du lien »).

C'est cette URL qu'on met dans `COMMUNE_CIRCO_URL`. Le script détecte
automatiquement le format (GeoJSON de contours **ou** CSV `insee;circo`).

```bash
COMMUNE_CIRCO_URL="https://www.data.gouv.fr/fr/datasets/r/<id-de-la-ressource>" \
  pnpm run generate-elus
```

Pour l'automatiser, coller la même URL dans
_Settings → Secrets and variables → Actions → Variables_ (`COMMUNE_CIRCO_URL`) :
le workflow hebdomadaire l'utilisera. Sans elle, la recherche fonctionne au
niveau département (repli sûr). Pour les codes postaux couvrant plusieurs
circonscriptions (grandes villes), la page affiche les députés candidats
correspondants.

## Fiabilité des emails (redondance multi-sources)

Le script croise, pour chaque élu, l'email fourni par la source ouverte et
l'email déduit du **motif institutionnel** (`prenom.nom@assemblee-nationale.fr`
ou `@senat.fr`), puis attribue un niveau de confiance :

| `emailConfidence` | Signification                                           |
| ----------------- | ------------------------------------------------------- |
| `high`            | email confirmé par ≥ 2 sources concordantes             |
| `medium`          | une seule source, cohérente                             |
| `low`             | sources divergentes, ou email seulement déduit du motif |
| `none`            | aucun email → la page propose le formulaire de contact  |

La page affiche un avertissement « vérifiez l'adresse » pour `low`/`none`.

## Données d'exemple

Le `elus.json` versionné est un **échantillon** (`"sample": true`, emails en
`@example.invalid`) pour que le site build sans accès réseau. La page affiche
alors une bannière d'avertissement. Lancer le script ci-dessus le remplace par
les vraies données.

## Sources

- [NosDéputés.fr](https://www.nosdeputes.fr) / [NosSénateurs.fr](https://www.nossenateurs.fr) — Regards Citoyens, licence CC-BY-SA
- Répertoire National des Élus (data.gouv.fr, ministère de l'Intérieur)
