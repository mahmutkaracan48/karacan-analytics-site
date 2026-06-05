#!/bin/bash
# Vercel Ignored Build Step — skip Production deploy when only previews/ or reports/ changed.
# Exit 0 = cancel build | Exit 1 = proceed (Vercel convention).
set -euo pipefail

if [ -z "${VERCEL_GIT_COMMIT_SHA:-}" ]; then
  echo "no VERCEL_GIT_COMMIT_SHA — build"
  exit 1
fi

PREV="${VERCEL_GIT_PREVIOUS_SHA:-}"
if [ -z "$PREV" ]; then
  echo "no previous SHA — build"
  exit 1
fi

CHANGED="$(git diff --name-only "$PREV" "$VERCEL_GIT_COMMIT_SHA" 2>/dev/null || true)"
if [ -z "$CHANGED" ]; then
  echo "empty diff — build"
  exit 1
fi

while IFS= read -r f; do
  [ -z "$f" ] && continue
  case "$f" in
    previews/*|reports/*)
      echo "skip-candidate: $f"
      ;;
    *)
      echo "deploy-trigger: $f"
      exit 1
      ;;
  esac
done <<< "$CHANGED"

echo "skip: only previews/reports changed"
exit 0
