#!/bin/bash
# Crée temporairement un webhook Wise pointant vers le deploy preview Netlify.
# À utiliser UNIQUEMENT pour les tests. Supprimer après avec delete-wise-webhook.sh.
#
# Usage: bash create-wise-webhook-preview.sh <profile_id>

set -euo pipefail

PROFILE_ID="${1:-}"
if [[ -z "$PROFILE_ID" ]]; then
    echo "Usage: $0 <profile_id>"
    exit 1
fi

TOKEN=$(cat /opt/scripts/.wise-token | tr -d '[:space:]')
WEBHOOK_URL="https://deploy-preview-142--pause-ia.netlify.app/api/wise-webhook"

echo "Création du webhook Wise (PREVIEW) pour le profil $PROFILE_ID..."
echo "URL cible: $WEBHOOK_URL"
echo ""

RESPONSE=$(curl -s -X POST "https://api.wise.com/v3/profiles/$PROFILE_ID/subscriptions" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
        \"name\": \"PauseIA - TEST deploy preview 142\",
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
    echo "✓ Webhook preview créé!"
    echo "  Subscription ID: $SUBSCRIPTION_ID"
    echo ""
    echo "Pour envoyer une notification de test:"
    echo "  curl -s -X POST \"https://api.wise.com/v3/profiles/$PROFILE_ID/subscriptions/$SUBSCRIPTION_ID/test\" \\"
    echo "       -H \"Authorization: Bearer \$(cat /opt/scripts/.wise-token)\""
    echo ""
    echo "Pour supprimer ce webhook après les tests:"
    echo "  bash delete-wise-webhook.sh $PROFILE_ID $SUBSCRIPTION_ID"
else
    echo ""
    echo "✗ Erreur lors de la création du webhook."
    exit 1
fi
