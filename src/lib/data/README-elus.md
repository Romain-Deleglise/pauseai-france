# Données des élus (`elus.json`)

Alimente la page **« Écrire à mes élus »** (`/ecrire-a-mes-elus`) : recherche des
députés et sénateurs par code postal, avec email pré-rempli.

## Mise à jour automatique

Le workflow **`.github/workflows/update-elus.yml`** régénère les données chaque
semaine (cron du lundi) et **ouvre une PR** quand elles ont changé. Plus rien à
faire à la main : il suffit de relire le diff et de merger. Déclenchable aussi
manuellement via l'onglet _Actions_ → _Mise à jour des élus_ → _Run workflow_.

## Régénérer manuellement

```bash
pnpm run generate-elus                    # régénère src/lib/data/elus.json
node scripts/generate-elus.js --report    # + rapport de qualité des emails
```

> ⚠️ Nécessite un accès réseau ouvert vers `nosdeputes.fr` / `nossenateurs.fr`.
> Certains environnements (CI sandboxée, proxy d'entreprise) bloquent ces hôtes.

## Géocodage code postal → circonscription (clic unique sur le bon député)

Avec la variable d'environnement `COMMUNE_CIRCO_URL` (URL d'un CSV open data
commune INSEE → circonscription), le script produit en plus
`code-postal-circo.json`, qui permet de cibler **le député exact** au lieu de
lister tous les députés du département.

```bash
COMMUNE_CIRCO_URL="https://www.data.gouv.fr/.../communes-circonscriptions.csv" \
  pnpm run generate-elus
```

Pour l'automatiser, définir cette URL dans
_Settings → Secrets and variables → Actions → Variables_ (`COMMUNE_CIRCO_URL`).
Sans elle, la recherche fonctionne au niveau département (repli sûr). Pour les
codes postaux couvrant plusieurs circonscriptions (grandes villes), la page
affiche les députés candidats correspondants.

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
