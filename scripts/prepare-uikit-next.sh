#!/usr/bin/env bash
set -euo pipefail

# Temporary development bootstrap until UIKit 8 is published. Remove this script
# and its prepare hook when replacing the devDependency with the released v8.
UIKIT_REF=c34f268e40bd5763dead8dfcad23eec2de1a878d
PROJECT_DIR=$(cd "$(dirname "$0")/.." && pwd)
BUILD_DIR=$(mktemp -d "${TMPDIR:-/tmp}/dynamic-forms-uikit-next.XXXXXX")
trap 'rm -rf "$BUILD_DIR"' EXIT

echo "Building @gravity-ui/uikit from next commit $UIKIT_REF"
git init --quiet "$BUILD_DIR/uikit"
git -C "$BUILD_DIR/uikit" fetch --quiet --depth=1 https://github.com/gravity-ui/uikit.git "$UIKIT_REF"
git -C "$BUILD_DIR/uikit" checkout --quiet --detach FETCH_HEAD
test "$(git -C "$BUILD_DIR/uikit" rev-parse HEAD)" = "$UIKIT_REF"

cd "$BUILD_DIR/uikit"
npm ci --ignore-scripts --no-audit --no-fund
npm run build
npm pack --quiet --ignore-scripts --pack-destination "$BUILD_DIR"

cd "$PROJECT_DIR"
# --no-save preserves the committed manifests/lockfile. Do not use
# --package-lock=false: it re-resolves unrelated dependencies as well.
npm install --no-save --ignore-scripts --no-audit --no-fund "$BUILD_DIR"/*.tgz
echo "Installed @gravity-ui/uikit from next commit $UIKIT_REF"
