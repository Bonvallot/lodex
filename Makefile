.PHONY: build test help
.DEFAULT_GOAL := help

export NODE_ENV ?= development

ifneq "$(CI)" "true"
	USER_ID = $(shell id -u)
	GROUP_ID = $(shell id -g)

	export UID = $(USER_ID)
	export GID = $(GROUP_ID)
endif

help:
	@grep -P '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

# If the first argument is one of the supported commands...
SUPPORTED_COMMANDS := npm restore-db-dev _restore_db_dev restore-db-prod _restore_db_prod build import_units import_users import_sections import_unit_sections
SUPPORTS_MAKE_ARGS := $(findstring $(firstword $(MAKECMDGOALS)), $(SUPPORTED_COMMANDS))
ifneq "$(SUPPORTS_MAKE_ARGS)" ""
    # use the rest as arguments for the command
    COMMAND_ARGS := $(wordlist 2,$(words $(MAKECMDGOALS)),$(MAKECMDGOALS))
    # ...and turn them into do-nothing targets
    $(eval $(COMMAND_ARGS):;@:)
endif

## Initialization ==============================================================

copy-conf: ## Initialize the configuration files by copying the *''-dist" versions (does not override existing config)
	-cp -n ./config/${NODE_ENV}-dist.js ./config/${NODE_ENV}.js
ifeq ($(NODE_ENV), development)
	-cp -n ./config/test-dist.js ./config/test.js
endif

install-npm-dependencies:
	echo "Installing Node dependencies"
ifeq "$(CI)" "true"
	docker compose -f docker-compose.dev.yml run --no-deps --rm node npm ci
else
	docker compose -f docker-compose.dev.yml run --no-deps --rm node npm install
endif

install: copy-conf install-npm-dependencies ## Install npm dependencies for the node, admin, and frontend apps

## Production =================================================================

run: ## Run the project in production mode
	docker compose up --force-recreate
start: run ## Start the project (alias of make run)

## Development =================================================================

run-dev: ## Run the project in dev mode
	NODE_ENV=development docker compose -f docker-compose.dev.yml up --force-recreate
start-dev: run-dev ## Start the project (alias of make run-dev)

build-app:
	docker compose -f docker-compose.dev.yml run --no-deps --rm node npm run build

build: ## Build the docker image localy
	docker build -t inistcnrs/lodex:14.0.10-alpha-alpha --build-arg http_proxy --build-arg https_proxy .
publish: build  ## publish version to docker hub
	docker push inistcnrs/lodex:14.0.10-alpha-alpha

analyze-code: ## Generate statistics about the bundle. Usage: make analyze-code.
	docker compose -f docker-compose.dev.yml run --no-deps --rm node npm run analyze

npm: ## allow to run dockerized npm command eg make npm 'install koa --save'
	docker compose -f docker-compose.dev.yml run --no-deps --rm node npm $(COMMAND_ARGS)

## Tests =======================================================================

test-api-e2e: ## Run the API E2E tests
	NODE_ENV=test \
	EZMASTER_PUBLIC_URL="http://localhost:3010" \
	docker compose -f docker-compose.dev.yml run --rm -p "3010:3010" node \
		npm run test:api:e2e

test-api-e2e-watch: ## Run the API E2E tests in watch mode
	NODE_ENV=test \
	EZMASTER_PUBLIC_URL="http://localhost:3010" \
	docker compose -f docker-compose.dev.yml run --rm -p "3010:3010" node \
		npm run test:api:e2e:watch

test-unit: ## Run the unit tests, usage : JEST_OPTIONS=myfile.to.test.spec.js make test-unit
## You can use other Jest options (https://jestjs.io/fr/docs/cli)
	NODE_ENV=test docker compose -f docker-compose.dev.yml run --no-deps --rm node npm run test:unit -- $(JEST_OPTIONS)

test-unit-watch: ## Run the unit tests, usage : JEST_OPTIONS=myfile.to.test.spec.js make test-unit-watch
## You can use other Jest options (https://jestjs.io/fr/docs/cli)
	NODE_ENV=test docker compose -f docker-compose.dev.yml run --no-deps --rm node npm run test:unit:watch -- $(JEST_OPTIONS)

test-e2e-start-dockers:
ifeq "$(CI)" "true"
	docker compose -f docker-compose.spec.yml up -d --build
else
	docker compose -f docker-compose.spec.yml up --build
endif

test-e2e-logs:
	docker compose -f docker-compose.spec.yml logs

test-e2e-logs-watch:
	docker compose -f docker-compose.spec.yml logs -f

test-e2e-stop-dockers:
	docker compose -f docker-compose.spec.yml down

test-e2e-open-cypress:
	NODE_ENV=e2e npx cypress open

test-e2e:
ifeq "$(DISABLE_E2E_TESTS)" "true"
	echo "E2E tests were disable because of the flag 'DISABLE_E2E_TESTS=true'"
else
	$(MAKE) test-e2e-start-dockers
	npx cypress install
	./bin/wait-for -t 30 localhost:3000 -- npx cypress run --browser chrome || (\
		$(MAKE) test-e2e-stop-dockers && \
		exit 1)
endif

test: ## Run all tests
	$(MAKE) test-unit
	$(MAKE) test-api-e2e
	CI=true $(MAKE) test-e2e

## Data ========================================================================

mongo: ## Start the mongo database
	docker compose up -d mongo

mongo-shell: ## Start the mongo shell
	docker compose exec mongo mongo lodex

mongo-shell-test: ## Start the mongo shell for the test database
	docker compose exec mongo mongo lodex_test

clear-database: ## Clear the whole database
	docker compose exec mongo mongo lodex --eval " \
		db.publishedDataset.remove({}); \
		db.publishedCharacteristic.remove({}); \
		db.field.remove({}); \
		db.dataset.remove({}); \
		db.publishedFacet.remove({}); \
		db.subresource.remove({}); \
		db.enrichment.remove({}); \
	"
clear-publication: ## Clear the published data, keep uploaded dataset and model
	docker compose exec mongo mongo lodex --eval " \
		db.publishedDataset.remove({}); \
		db.publishedCharacteristic.remove({}); \
		db.publishedFacet.remove({}); \
	"

clear-docker: 
	docker stop lodex-lodex-1 || true
	docker rm lodex-lodex-1 || true
	docker image rm lodex-lodex
