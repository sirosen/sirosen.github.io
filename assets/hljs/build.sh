#!/bin/bash
set -euo pipefail

VERSION="11.2.0"
THEMES_URL="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@${VERSION}/build/styles"
wget "${THEMES_URL}/base16/gruvbox-dark-medium.min.css" \
  -O theme-dark.min.css
wget "${THEMES_URL}/base16/gruvbox-light-medium.min.css" \
  -O theme-light.min.css

if [ -d "_build" ]; then
  echo "Old build dir present. Remove with 'rm -r _build' and try again"
  exit 1
fi

mkdir _build
cd _build

wget https://github.com/highlightjs/highlight.js/archive/refs/tags/${VERSION}.tar.gz
tar -xzf ${VERSION}.tar.gz
cd highlight.js-${VERSION}
npm install
node tools/build.js :common awk
cp build/highlight.min.js ../../min.js
