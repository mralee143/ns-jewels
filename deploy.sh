#!/usr/bin/env bash
set -euo pipefail

IMAGE="aleehaider045/ns-jewels:latest"

if [[ -z "${DOCKER_PASSWORD:-}" ]]; then
  echo "DOCKER_PASSWORD is not set" >&2
  exit 1
fi

echo "$DOCKER_PASSWORD" | docker login -u aleehaider045 --password-stdin

docker build -t "$IMAGE" .
docker push "$IMAGE"

curl -X GET "http://76.13.152.159/api/deploy/65be817fafcc937828789fb0d8a3f123bb2c2b13327b7c16"
