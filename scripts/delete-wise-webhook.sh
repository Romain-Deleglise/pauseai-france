#!/bin/bash
# Supprime un abonnement webhook Wise (ex: webhook de test preview).
#
# Usage: bash delete-wise-webhook.sh <profile_id> <subscription_id>

set -euo pipefail

PROFILE_ID="${1:-}"
SUBSCRIPTION_ID="${2:-}"
if [[ -z "$PROFILE_ID" || -z "$SUBSCRIPTION_ID" ]]; then
    echo "Usage: $0 <profile_id> <subscription_id>"
    echo ""
    echo "Pour lister les webhooks existants:"
    echo "  curl -s -H \"Authorization: Bearer \$(cat /opt/scripts/.wise-token)\" \\"
    echo "       https://api.wise.com/v3/profiles/$PROFILE_ID/subscriptions | jq ."
    exit 1
fi

TOKEN=$(cat /opt/scripts/.wise-token | tr -d '[:space:]')

echo "Suppression du webhook $SUBSCRIPTION_ID..."

RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE \
    "https://api.wise.com/v3/profiles/$PROFILE_ID/subscriptions/$SUBSCRIPTION_ID" \
    -H "Authorization: Bearer $TOKEN")

if [[ "$RESPONSE" == "200" || "$RESPONSE" == "204" ]]; then
    echo "✓ Webhook supprimé (HTTP $RESPONSE)"
else
    echo "✗ Erreur HTTP $RESPONSE"
    exit 1
fi
