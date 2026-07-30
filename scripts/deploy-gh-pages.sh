#!/usr/bin/env bash
set -e

REPO="git@github.com:jiuxianzai/l-js-fn.git"
DIST_DIR="docs/.vitepress/dist"
BRANCH="gh-pages"

echo "==> 构建文档..."
npm run docs:build

echo "==> 准备部署 ${DIST_DIR} → ${REPO}#${BRANCH}"

cd "${DIST_DIR}"

touch .nojekyll

git init
git checkout -b "${BRANCH}"
git add -A
git commit -m "docs: deploy $(date '+%Y-%m-%d %H:%M:%S')"
git push -f "${REPO}" "${BRANCH}"

rm -rf .git

echo "==> 部署完成: https://jiuxianzai.github.io/l-js-fn/"
