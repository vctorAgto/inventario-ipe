#!/bin/bash
set -e

# ============================================================
# Setup do repositório "Balcão de Literatura" no GitHub.
#
# COMO USAR (no terminal integrado do VS Code, dentro desta pasta):
#   1. Crie o repositório vazio em github.com/new (mesmo nome, público,
#      SEM adicionar README/gitignore pelo site) — se ainda não existir.
#   2. Rode:  bash setup.sh
# ============================================================

GITHUB_USER="vctorAgto"
REPO_NAME="inventario-ipe"

if [ ! -d ".git" ]; then
  git init
  git branch -M main
fi

git add .
git commit -m "Inventário de publicações — configuração inicial" || echo "Nada novo para commitar."

if ! git remote get-url origin >/dev/null 2>&1; then
  git remote add origin "https://github.com/${GITHUB_USER}/${REPO_NAME}.git"
fi

git push -u origin main

echo ""
echo "Pronto. Agora vá em:"
echo "  https://github.com/${GITHUB_USER}/${REPO_NAME}/settings/pages"
echo "e ative o GitHub Pages (branch main, pasta /root)."
echo ""
echo "Depois de alguns minutos o site estará em:"
echo "  https://${GITHUB_USER}.github.io/${REPO_NAME}/"
