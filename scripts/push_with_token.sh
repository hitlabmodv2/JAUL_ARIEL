#!/usr/bin/env bash
set -euo pipefail

# Usage:
# export GITHUB_TOKEN="<your_token_here>"
# bash scripts/push_with_token.sh

REPO_OWNER="hitlabmodv2"
REPO_NAME="JAUL_ARIEL"
REMOTE_URL="https://github.com/${REPO_OWNER}/${REPO_NAME}.git"

if [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "Error: GITHUB_TOKEN environment variable is not set."
  echo "Set it with: export GITHUB_TOKEN=ghp_xxx (do NOT paste token in chat)"
  exit 1
fi

echo "Temporarily setting origin URL with token (only in this local repo)..."
git remote set-url origin "https://${REPO_OWNER}:${GITHUB_TOKEN}@github.com/${REPO_OWNER}/${REPO_NAME}.git"

echo "Pushing current branch to origin/main..."
git push origin HEAD:main

echo "Restore origin URL to public HTTPS (remove embedded token)"
git remote set-url origin "${REMOTE_URL}"

echo "Push selesai. Jangan lupa revoke token jika kamu sudah memasukkannya di tempat lain atau bagikan token di chat sebelumnya." 
