#!/usr/bin/env bash
set -euo pipefail

IMAGE="aleehaider045/ns-jewels:latest"

echo "$DOCKER_PASSWORD" | docker login -u aleehaider045 --password-stdin

docker build -t "$IMAGE" .
docker push "$IMAGE"

curl -X GET "http://76.13.152.159:3000/api/deploy/4de8e6caa4d7e99d1d505733a4abbc14e0377df510c99654"
