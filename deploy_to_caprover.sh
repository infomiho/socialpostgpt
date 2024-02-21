#!/bin/bash

set -e
set -u
set -o pipefail

[ ! -f .env.server ] || export $(grep -v '^#' .env.server | xargs)

IS_BUILDING=true
IS_DEPLOYING_SERVER=true
IS_DEPLOYING_CLIENT=true

if [ "$IS_BUILDING" = true ] ; then
  echo "Building server..."
  wasp build
fi
if [ ! -d ".wasp/build" ] ; then
  echo "Error: .wasp/build doesn't exist"
  exit 1
fi

cd .wasp
if [ "$IS_DEPLOYING_SERVER" = true ] ; then
  echo "Tar-ing server..."
  tar -czf server.tar.gz --exclude "node_modules" ./build/*
  echo "Deploying server..."
  caprover deploy -a $SERVER_APP -t ./server.tar.gz -u $CAPROVER_URL
  rm server.tar.gz
fi

if [ "$IS_DEPLOYING_CLIENT" = true ] ; then
  echo "Building client..."
  cd ./build/web-app
  REACT_APP_API_URL=https://$SERVER_APP.apps.twoducks.dev npm run build
  CLIENT_DOCKERFILE=$(cat <<EOF
FROM pierrezemb/gostatic
CMD [ "-fallback", "index.html", "-enable-logging"]
COPY ./build /srv/http
EOF
)
  echo "$CLIENT_DOCKERFILE" > ./Dockerfile
  echo "!build" > .dockerignore

  echo "Tar-ing client..."
  tar -czf ../../client.tar.gz --exclude "node_modules" ./*
  echo "Deploying client..."
  caprover deploy -a $CLIENT_APP -t ../../client.tar.gz -u $CAPROVER_URL
  rm ../../client.tar.gz
fi