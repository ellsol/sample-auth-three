
SERVER_PORT=8001   						# port of the resource service
AUDIENCE=http://localhost:${SERVER_PORT}		# audience == url of resource service
ISSUER_BASE_URL=https://dev.auth-three.com		# the base_url of the identity provider

.PHONY: build_server

build_server:
	cd server;

run_server: build_server
	cd server; SERVER_PORT=${SERVER_PORT} AUDIENCE=${AUDIENCE} ISSUER_BASE_URL=${ISSUER_BASE_URL} DEBUG=jwks node index.js

build_client:
	cd client; npm install; npm run build

run_client:
	cd client; API_URL=${AUDIENCE} ISSUER_BASE_URL=${ISSUER_BASE_URL} npm run start