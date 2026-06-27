#!/usr/bin/env bash
#
# Met à jour les données des élus (elus.json + code-postal-circo.json) et les
# pousse sur le repo. Le site étant déployé sur Netlify, le push déclenche
# automatiquement un rebuild → données à jour en ligne.
#
# Conçu pour tourner périodiquement via un timer systemd (voir
# scripts/systemd/). Ne dépend que de Node 18+ et git (aucune dépendance npm :
# generate-elus.js n'utilise que des modules natifs et le fetch global).
#
# Variables d'environnement (optionnelles) :
#   REPO_DIR   chemin du clone du repo        (défaut : dossier du script)
#   BRANCH     branche à mettre à jour         (défaut : main)
#   GIT_NAME   nom d'auteur des commits        (défaut : Pause IA Bot)
#   GIT_EMAIL  email d'auteur des commits      (défaut : bot@pauseia.fr)
#   COMMUNE_CIRCO_URL  surcharge la source des circonscriptions (sinon défaut intégré)
#
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="${REPO_DIR:-$(cd "$SCRIPT_DIR/.." && pwd)}"
BRANCH="${BRANCH:-main}"
GIT_NAME="${GIT_NAME:-Pause IA Bot}"
GIT_EMAIL="${GIT_EMAIL:-bot@pauseia.fr}"

cd "$REPO_DIR"

echo "→ Mise à jour du dépôt ($BRANCH)…"
git fetch --quiet origin "$BRANCH"
git checkout --quiet "$BRANCH"
git pull --quiet --ff-only origin "$BRANCH"

echo "→ Génération des données des élus…"
node scripts/generate-elus.js --report

# Rien à faire si les fichiers n'ont pas changé.
if git diff --quiet -- src/lib/data/elus.json src/lib/data/code-postal-circo.json; then
	echo "✓ Aucun changement, rien à pousser."
	exit 0
fi

echo "→ Changements détectés, commit et push…"
git -c user.name="$GIT_NAME" -c user.email="$GIT_EMAIL" \
	add src/lib/data/elus.json src/lib/data/code-postal-circo.json
git -c user.name="$GIT_NAME" -c user.email="$GIT_EMAIL" \
	commit -m "chore: mise a jour automatique des elus ($(date +%F))"
git push origin "$BRANCH"
echo "✓ Données mises à jour et poussées (Netlify va redéployer)."
