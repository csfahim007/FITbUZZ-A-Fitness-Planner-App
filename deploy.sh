#!/usr/bin/env bash

set -Eeuo pipefail

APP_DIR="/home/administrator/projects/FITbUZZ-A-Fitness-Planner-App"
BRANCH="main"

BACKEND_PORT="5001"
FRONTEND_PORT="5175"

BACKEND_HEALTH_URL="http://127.0.0.1:${BACKEND_PORT}/api/health"
FRONTEND_URL="http://127.0.0.1:${FRONTEND_PORT}/"

log() {
    echo
    echo "========================================"
    echo "$1"
    echo "========================================"
}

fail() {
    echo
    echo "❌ DEPLOYMENT FAILED"
    echo "Reason: $1"
    exit 1
}

cd "$APP_DIR"

log "FITbUZZ DEPLOYMENT START"

echo "App directory: $APP_DIR"
echo "Branch: $BRANCH"

log "VERIFY GIT STATE"

CURRENT_BRANCH="$(git branch --show-current)"

if [ "$CURRENT_BRANCH" != "$BRANCH" ]; then
    fail "Expected branch '$BRANCH' but found '$CURRENT_BRANCH'"
fi

if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "Uncommitted changes detected:"
    git status --short
    fail "Working tree is not clean. Refusing to deploy."
fi

log "FETCH LATEST CODE"

git fetch origin "$BRANCH"

LOCAL_COMMIT="$(git rev-parse HEAD)"
REMOTE_COMMIT="$(git rev-parse "origin/$BRANCH")"

echo "Current commit: $LOCAL_COMMIT"
echo "Remote commit:  $REMOTE_COMMIT"

if [ "$LOCAL_COMMIT" != "$REMOTE_COMMIT" ]; then
    git pull --ff-only origin "$BRANCH"
else
    echo "Already up to date."
fi

DEPLOY_COMMIT="$(git rev-parse HEAD)"

echo
echo "Deploying commit:"
git log -1 --oneline

log "INSTALL BACKEND DEPENDENCIES"

cd "$APP_DIR/server"

npm ci --omit=dev

log "BUILD FRONTEND"

cd "$APP_DIR/client"

npm ci
npm run build

log "RESTART FITbUZZ SERVICES"

sudo -n supervisorctl restart fitbuzz-backend
sudo -n supervisorctl restart fitbuzz-frontend

sleep 3

log "SUPERVISOR STATUS"

sudo -n supervisorctl status fitbuzz-backend fitbuzz-frontend

log "BACKEND HEALTH CHECK"

BACKEND_RESPONSE="$(curl -fsS --max-time 15 "$BACKEND_HEALTH_URL")" \
    || fail "Backend health check failed: $BACKEND_HEALTH_URL"

echo "$BACKEND_RESPONSE"

echo "$BACKEND_RESPONSE" | grep -q '"status":"healthy"' \
    || fail "Backend returned an unexpected health response."

log "FRONTEND HEALTH CHECK"

curl -fsSI --max-time 15 "$FRONTEND_URL" \
    || fail "Frontend health check failed: $FRONTEND_URL"

log "DEPLOYMENT COMPLETE"

echo "Commit deployed: $DEPLOY_COMMIT"
echo
echo "✅ Backend:  http://127.0.0.1:${BACKEND_PORT}"
echo "✅ Frontend: http://127.0.0.1:${FRONTEND_PORT}"
echo "✅ FITbUZZ deployment successful."
