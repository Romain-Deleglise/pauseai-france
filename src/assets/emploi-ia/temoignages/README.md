# Témoignages illustrés — diaporama

Les 19 visuels de témoignages (préparés sur Canva pour les réseaux sociaux)
vivent ici au format **WebP** (`01.webp` … `19.webp`), repris automatiquement
dans le diaporama de la page `/emploi-ia` (composant `TestimonialSlideshow.svelte`),
triés par **nom de fichier**.

## Ajouter ou remplacer un visuel

Déposez un fichier image dans ce dossier — c'est tout, il apparaît dans le
diaporama. Formats acceptés : **WebP** (recommandé), SVG, PNG, JPG, AVIF.

Nommez avec un numéro à deux chiffres pour contrôler l'ordre :

```
01.webp
02.webp
…
19.webp
```

> ⚠️ Utilisez bien `01`, `02`, … `09` (et non `1`, `2`, … `9`), sinon l'ordre
> serait 1, 10, 11, 2, 3… (tri alphabétique).

## Poids des fichiers

Les exports SVG de Canva étaient très lourds (~4,5 Mo pièce, image raster
embarquée). Ils ont été convertis en WebP ~1080 px (~70 Ko pièce, texte net) :
85 Mo → 1,3 Mo au total. Si vous ajoutez de nouveaux visuels, exportez-les
idéalement déjà en WebP/PNG raisonnable, ou signalez-le pour conversion.

Sur la page, chaque visuel s'affiche dans le diaporama et **un clic l'ouvre en
plein écran** (utile car les cartes contiennent beaucoup de texte, notamment
le paragraphe secondaire, plus petit sur mobile).
