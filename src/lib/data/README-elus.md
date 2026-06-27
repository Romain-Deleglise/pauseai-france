# Données des élus (`elus.json`)

Alimente la page **« Écrire à mes élus »** (`/ecrire-a-mes-elus`) : recherche des
députés et sénateurs par code postal, avec email pré-rempli.

## Régénérer les données

```bash
pnpm run generate-elus           # régénère src/lib/data/elus.json
node scripts/generate-elus.js --report   # + rapport de qualité des emails
```

> ⚠️ Nécessite un accès réseau ouvert vers `nosdeputes.fr` / `nossenateurs.fr`.
> Certains environnements (CI sandboxée, proxy d'entreprise) bloquent ces hôtes.

À relancer **après chaque échéance électorale** et idéalement une fois par
trimestre (le Répertoire National des Élus est mis à jour trimestriellement).

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
