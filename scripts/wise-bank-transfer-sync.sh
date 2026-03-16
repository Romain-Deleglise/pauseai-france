#!/bin/bash
# Script Wise → CiviCRM pour Pause IA
# Réconciliation automatique des virements bancaires
#
# Vérifie les virements reçus sur Wise (dernières 25h),
# matche les références DON-XXXXXX dans les communications,
# et met à jour les contributions CiviCRM de "Pending" à "Completed".
#
# À déployer sur le serveur Hetzner (138.199.201.21) dans /opt/scripts/
# CRON: */15 * * * * root /opt/scripts/wise-bank-transfer-sync.sh >> /var/log/wise-bank-transfer-sync.log 2>&1

set -euo pipefail

DATE=$(date '+%Y-%m-%d %H:%M:%S')
LOG_FILE="/var/log/wise-bank-transfer-sync.log"
ERROR_LOG="/var/log/wise-bank-transfer-sync-errors.log"

# ─── Configuration Wise ───────────────────────────────────────────────
# Token API read-only (à remplacer par la vraie valeur sur le serveur)
WISE_API_TOKEN="${WISE_API_TOKEN:-}"
WISE_API_BASE="https://api.wise.com"
# Balance ID EUR du compte Pause IA (visible dans l'URL https://wise.com/balances/93596206)
WISE_BALANCE_ID="93596206"

# ─── Compteurs ────────────────────────────────────────────────────────
CREDITS_TOTAL=0
MATCHED=0
UPDATED=0
SKIPPED_NO_REF=0
SKIPPED_NO_PENDING=0
SKIPPED_AMOUNT_MISMATCH=0
ERRORS=0

log() { echo "[$DATE] $1" >> "$LOG_FILE"; }
log_error() { echo "[$DATE] $1" >> "$ERROR_LOG"; log "ERREUR: $1"; }

log "========== DÉBUT SYNC WISE =========="

# ─── Vérification config ─────────────────────────────────────────────
if [[ -z "$WISE_API_TOKEN" ]]; then
    # Essayer de lire depuis un fichier de config (même pattern que les autres scripts)
    if [[ -f /opt/scripts/.wise-token ]]; then
        WISE_API_TOKEN=$(cat /opt/scripts/.wise-token | tr -d '[:space:]')
    fi
fi

if [[ -z "$WISE_API_TOKEN" ]]; then
    log_error "WISE_API_TOKEN non configuré. Définir la variable d'env ou créer /opt/scripts/.wise-token"
    exit 1
fi

# ─── Fonctions API Wise ──────────────────────────────────────────────

# Récupérer le profile ID business
get_profile_id() {
    local response
    response=$(curl -s --max-time 30 --connect-timeout 10 \
        -H "Authorization: Bearer $WISE_API_TOKEN" \
        "$WISE_API_BASE/v2/profiles" 2>/dev/null)

    if [[ $? -ne 0 ]] || [[ -z "$response" ]]; then
        log_error "Impossible de contacter l'API Wise /v2/profiles"
        return 1
    fi

    # Sélectionner le profil Business
    local profile_id
    profile_id=$(echo "$response" | jq -r '[.[] | select(.type == "BUSINESS")] | .[0].id // empty' 2>/dev/null)

    if [[ -z "$profile_id" || "$profile_id" == "null" ]]; then
        log_error "Aucun profil Business trouvé dans la réponse Wise"
        return 1
    fi

    echo "$profile_id"
}

# Récupérer le relevé des dernières 25h pour la balance EUR
get_recent_statement() {
    local profile_id="$1"
    local from_date to_date

    from_date=$(date -u -d '25 hours ago' '+%Y-%m-%dT%H:%M:%S.000Z')
    to_date=$(date -u '+%Y-%m-%dT%H:%M:%S.000Z')

    log "Période: $from_date → $to_date"

    local response
    response=$(curl -s --max-time 60 --connect-timeout 10 \
        -H "Authorization: Bearer $WISE_API_TOKEN" \
        "$WISE_API_BASE/v1/profiles/$profile_id/balance-statements/$WISE_BALANCE_ID/statement.json?currency=EUR&intervalStart=$from_date&intervalEnd=$to_date&type=COMPACT" 2>/dev/null)

    if [[ $? -ne 0 ]] || [[ -z "$response" ]]; then
        log_error "Impossible de récupérer le relevé Wise"
        return 1
    fi

    # Vérifier si c'est une erreur API
    if echo "$response" | jq -e '.error // .errors' >/dev/null 2>&1; then
        local error_msg
        error_msg=$(echo "$response" | jq -r '.error // (.errors | tostring)' 2>/dev/null)
        log_error "Erreur API Wise: $error_msg"
        return 1
    fi

    echo "$response"
}

# ─── Fonctions CiviCRM ───────────────────────────────────────────────

# Trouver une contribution Pending par référence DON-XXXXXX
find_pending_contribution() {
    local reference="$1"

    local result
    result=$(docker exec civicrm-web cv api3 Contribution.get \
        trxn_id="$reference" \
        contribution_status_id="Pending" \
        return="id,contact_id,total_amount,source" \
        options.limit=1 \
        --cwd=/var/www/html 2>/dev/null)

    if echo "$result" | jq -e '.count > 0' >/dev/null 2>&1; then
        echo "$result" | jq -r '.values | to_entries | .[0].value | "\(.id)|\(.contact_id)|\(.total_amount)"'
    fi
}

# Passer une contribution en Completed
complete_contribution() {
    local contrib_id="$1"
    local receive_date="$2"

    local result
    result=$(docker exec civicrm-web cv api3 Contribution.create \
        id="$contrib_id" \
        contribution_status_id="Completed" \
        receive_date="$receive_date" \
        --cwd=/var/www/html 2>/dev/null)

    if echo "$result" | jq -e '.is_error == 0' >/dev/null 2>&1; then
        return 0
    fi
    return 1
}

# ─── Script principal ────────────────────────────────────────────────

# 1. Obtenir le profil Business
PROFILE_ID=$(get_profile_id)
if [[ -z "$PROFILE_ID" ]]; then
    exit 1
fi
log "Profil Wise Business: $PROFILE_ID"

# 2. Récupérer le relevé récent
STATEMENT=$(get_recent_statement "$PROFILE_ID")
if [[ -z "$STATEMENT" ]]; then
    exit 1
fi

# 3. Extraire les transactions CREDIT (virements entrants)
TRANSACTIONS=$(echo "$STATEMENT" | jq -c '.transactions[]? | select(.type == "CREDIT")' 2>/dev/null)

if [[ -z "$TRANSACTIONS" ]]; then
    log "Aucun virement entrant dans les dernières 25h"
    log "========== FIN SYNC WISE =========="
    exit 0
fi

# 4. Traiter chaque virement entrant
while IFS= read -r tx; do
    [[ -z "$tx" ]] && continue
    ((CREDITS_TOTAL++))

    # Extraire les champs pertinents
    description=$(echo "$tx" | jq -r '.details.description // empty')
    payment_ref=$(echo "$tx" | jq -r '.details.paymentReference // empty')
    sender=$(echo "$tx" | jq -r '.details.senderName // "inconnu"')
    amount=$(echo "$tx" | jq -r '.amount.value // 0')
    tx_date=$(echo "$tx" | jq -r '.date // empty' | cut -d'T' -f1)
    ref_number=$(echo "$tx" | jq -r '.referenceNumber // empty')

    # Chercher la référence DON-XXXXXX dans tous les champs possibles
    # Le donateur peut la mettre dans la communication/référence du virement
    combined_text="$description $payment_ref $ref_number"
    reference=$(echo "$combined_text" | grep -oE 'DON-[A-Z0-9]{6}' | head -1)

    if [[ -z "$reference" ]]; then
        log "⚠ Virement sans référence DON: ${amount}€ de $sender - description='$description' ref='$payment_ref'"
        ((SKIPPED_NO_REF++))
        continue
    fi

    log "Référence trouvée: $reference (${amount}€ de $sender)"
    ((MATCHED++))

    # Chercher la contribution Pending correspondante dans CiviCRM
    contrib_info=$(find_pending_contribution "$reference")

    if [[ -z "$contrib_info" ]]; then
        log "⚠ Aucune contribution Pending trouvée pour $reference (peut-être déjà complétée)"
        ((SKIPPED_NO_PENDING++))
        continue
    fi

    contrib_id=$(echo "$contrib_info" | cut -d'|' -f1)
    contact_id=$(echo "$contrib_info" | cut -d'|' -f2)
    expected_amount=$(echo "$contrib_info" | cut -d'|' -f3)

    # Vérifier la cohérence du montant (warning si différent, mais on complète quand même)
    if [[ "$amount" != "$expected_amount" ]]; then
        log "⚠ Montant différent pour $reference: reçu=${amount}€ attendu=${expected_amount}€ (frais bancaires ?)"
        ((SKIPPED_AMOUNT_MISMATCH++))
        # On complète quand même — les frais peuvent expliquer la différence
    fi

    # Mettre à jour la contribution en Completed
    if complete_contribution "$contrib_id" "$tx_date"; then
        log "✓ Contribution $contrib_id ($reference) → Completed (${amount}€, contact $contact_id)"
        ((UPDATED++))
    else
        log_error "Impossible de compléter la contribution $contrib_id ($reference)"
        ((ERRORS++))
    fi

done <<< "$TRANSACTIONS"

# 5. Résumé
log "========== RÉSUMÉ =========="
log "Virements entrants: $CREDITS_TOTAL | Avec référence DON: $MATCHED | Complétés: $UPDATED"
log "Sans référence: $SKIPPED_NO_REF | Pas de Pending: $SKIPPED_NO_PENDING | Montant différent: $SKIPPED_AMOUNT_MISMATCH | Erreurs: $ERRORS"
log "========== FIN SYNC WISE =========="

exit 0
