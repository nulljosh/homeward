#!/usr/bin/env bash
# Sets the Resend API key for the notify-found Supabase Edge Function.
# Validates against Resend before storing (see sparkjar's script — a stored
# invalid key failed silently for months).
set -euo pipefail

printf 'Paste the Resend API key (input hidden), then Enter: '
read -rs KEY
printf '\n'

if [[ ! $KEY =~ ^re_[A-Za-z0-9]+_[A-Za-z0-9]{20,}$ ]]; then
  echo "REJECTED: not a Resend key shape. Got ${#KEY} chars." >&2
  exit 1
fi

code=$(curl -s -o /tmp/resend_check.$$ -w '%{http_code}' \
  -H "Authorization: Bearer $KEY" https://api.resend.com/domains)
if [[ $code != 200 ]]; then
  echo "REJECTED: Resend says HTTP $code -- $(cat /tmp/resend_check.$$)" >&2
  rm -f /tmp/resend_check.$$
  exit 1
fi
rm -f /tmp/resend_check.$$

supabase secrets set RESEND_API_KEY="$KEY" --project-ref tjsxsqlxjmanwvmywwvw
echo "Stored."
