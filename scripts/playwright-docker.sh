#!/usr/bin/env bash

set -euo pipefail

IMAGE_NAME="mcr.microsoft.com/playwright"
IMAGE_TAG="v1.40.0-jammy" # This version have to be synchronized with playwright version from package.json

NODE_MODULES_CACHE_DIR="$HOME/.cache/dynamic-forms-playwright-docker-node-modules-linux-amd64"
CACHE_LOCK_FILE="$NODE_MODULES_CACHE_DIR/.dynamic-forms-package-lock.json"

command_exists() {
  command -v "$1" >/dev/null 2>&1
}

run_command() {
    $CONTAINER_TOOL run --rm --platform linux/amd64 --network host -it -w /work \
        -v "$(pwd):/work" \
        -v "$NODE_MODULES_CACHE_DIR:/work/node_modules" \
        -e IS_DOCKER=1 \
        "$IMAGE_NAME:$IMAGE_TAG" \
        /bin/bash -c "$1"
}

if command_exists docker; then
  CONTAINER_TOOL="docker"
elif command_exists podman; then
  CONTAINER_TOOL="podman"
else
  echo "Neither Docker nor Podman is installed on the system."
  exit 1
fi

if [[ "$1" = "clear-cache" ]]; then
    rm -rf "$NODE_MODULES_CACHE_DIR"
    rm -rf "./playwright/.cache-docker"
    exit 0
fi

if ! "$CONTAINER_TOOL" info >/dev/null 2>&1; then
    echo "$CONTAINER_TOOL is not running. Start Docker Desktop or run 'podman machine start'." >&2
    exit 1
fi

if [[ ! -x "$NODE_MODULES_CACHE_DIR/.bin/playwright" ]] || ! cmp -s package-lock.json "$CACHE_LOCK_FILE"; then
    mkdir -p "$NODE_MODULES_CACHE_DIR"
    rm -f "$CACHE_LOCK_FILE"
    run_command 'npm ci'
    cp package-lock.json "$CACHE_LOCK_FILE"
fi

run_command "$1"
