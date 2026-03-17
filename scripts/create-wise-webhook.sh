#!/bin/bash
# Crée l'abonnement webhook Wise pour les notifications de virements bancaires.
# À exécuter UNE SEULE FOIS sur le serveur Hetzner.
#
# Usage: bash create-wise-webhook.sh <profile_id>
#
# Pour trouver le profile_id :
#   curl -s -H "Authorization: Bearer $(cat /opt/scripts/.wise-token)" \
#        https://api.wise.com/v2/profiles | jq '.[] | {id, type, name: .details.name}'

set -euo pipefail

PROFILE_ID="${1:-}"
if [[ -z "$PROFILE_ID" ]]; then
    echo "Usage: $0 <profile_id>"
    echo ""
    echo "Pour trouver votre profile_id Business:"
    echo "  curl -s -H \"Authorization: Bearer \$(cat /opt/scripts/.wise-token)\" \\"
    echo "       https://api.wise.com/v2/profiles | jq '.[] | {id, type}'"
    exit 1
fi

TOKEN=$(cat /opt/scripts/.wise-token | tr -d '[:space:]')
WEBHOOK_URL="https://pauseia.fr/api/wise-webhook"

echo "Création du webhook Wise pour le profil $PROFILE_ID..."
echo "URL cible: $WEBHOOK_URL"
echo ""

RESPONSE=$(curl -s -X POST "https://api.wise.com/v3/profiles/$PROFILE_ID/subscriptions" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
        \"name\": \"PauseIA - Dons virements bancaires\",
        \"trigger_on\": \"balances#update\",
        \"delivery\": {
            \"version\": \"2.0.0\",
            \"url\": \"$WEBHOOK_URL\"
        }
    }")

echo "Réponse Wise:"
echo "$RESPONSE" | jq . 2>/dev/null || echo "$RESPONSE"

SUBSCRIPTION_ID=$(echo "$RESPONSE" | jq -r '.id // empty' 2>/dev/null)
if [[ -n "$SUBSCRIPTION_ID" ]]; then
    echo ""
    echo "✓ Webhook créé avec succès!"
    echo "  Subscription ID: $SUBSCRIPTION_ID"
    echo ""
    echo "Pour envoyer une notification de test:"
    echo "  curl -s -X POST \"https://api.wise.com/v3/profiles/$PROFILE_ID/subscriptions/$SUBSCRIPTION_ID/test\" \\"
    echo "       -H \"Authorization: Bearer \$(cat /opt/scripts/.wise-token)\""
else
    echo ""
    echo "✗ Erreur lors de la création du webhook."
    exit 1
fi
