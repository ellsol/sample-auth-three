
SERVER_PORT=8001   						# port of the resource service
AUDIENCE='localhost:${SERVER_PORT}'		# audience == url of resource service
ISSUER_BASE_URL='localhost:8080'		# the base_url of the identity provider

.PHONY: build_server

build_server:
	cd server; npm install; npm build

run_server: build_server
	cd server; SERVER_PORT=${SERVER_PORT} AUDIENCE=${AUDIENCE} ISSUER_BASE_URL=${ISSUER_BASE_URL} node index.js

build_client:
	cd client; yarn install; yarn build

run_client:
	cd client; API_URL=${AUDIENCE} yarn start