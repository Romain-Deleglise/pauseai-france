# Témoignages illustrés — diaporama

Déposez ici les visuels de témoignages préparés pour les réseaux sociaux.
Formats acceptés : **SVG** (recommandé, vectoriel donc net à toute taille),
PNG, JPG, WEBP, AVIF.

Ils sont repris **automatiquement** dans le diaporama de la page
`/emploi-ia` (composant `TestimonialSlideshow.svelte`), triés par **nom de
fichier**. Préfixez donc les fichiers par un numéro à deux chiffres pour
contrôler l'ordre :

```
01-temoignage.svg
02-temoignage.svg
…
19-temoignage.svg
```

> ⚠️ Utilisez bien `01`, `02`, … `09` (et non `1`, `2`, … `9`), sinon l'ordre
> serait 1, 10, 11, 2, 3… (tri alphabétique).

Aucun autre changement de code n'est nécessaire : ajouter un fichier ici
suffit à l'ajouter au diaporama.

## À propos des SVG exportés depuis Canva

- Sur la page, chaque visuel s'affiche dans le diaporama et un **clic dessus
  l'ouvre en plein écran** (utile car les cartes contiennent beaucoup de texte).
- Le SVG étant vectoriel, il reste net à toute taille — la lisibilité dépend
  donc de la taille du texte dans la carte, pas de la résolution.
- Si un visuel apparaît avec une police différente de l'originale, c'est que
  Canva a exporté le texte en tant que texte (et non vectorisé). Dans ce cas,
  ré-exportez en cochant l'option qui aplatit / vectorise le texte, ou
  exportez en PNG haute résolution.
