# Переменные
COMPOSE_FILE = docker-compose.yaml
PROJECT_NAME := booking_system_api_service

RUN := run --rm
DOCKER_COMPOSE := docker-compose -f $(COMPOSE_FILE) --project-name $(PROJECT_NAME)
DOCKER_COMPOSE_RUN := $(DOCKER_COMPOSE) $(RUN)

.PHONY: start stop restart build install provision env-setup test-unit test-e2e test
provision: env-setup build install start

env-setup:
	@if [ ! -f .env ]; then \
		echo "Creating .env file from env.example..."; \
		cp env.example .env; \
		echo ".env file created! Change variables if necessary."; \
	else \
		echo ".env file already exists."; \
	fi

start:
	$(DOCKER_COMPOSE) up -d
stop:
	$(DOCKER_COMPOSE) down
restart:
	$(DOCKER_COMPOSE) down
	$(DOCKER_COMPOSE) up -d --force-recreate
build:
	$(DOCKER_COMPOSE) build --no-cache --force-rm
clean:
	$(DOCKER_COMPOSE) down -v
install:
	$(DOCKER_COMPOSE_RUN) api-service npm install

test-unit:
	NODE_ENV=test $(DOCKER_COMPOSE_RUN) api-service npm run test -- --forceExit --detectOpenHandles

test-e2e:
	@if [ -z "$(file)" ]; then \
		NODE_ENV=test $(DOCKER_COMPOSE_RUN) api-service npm run test:e2e -- --forceExit --detectOpenHandles; \
	else \
		NODE_ENV=test $(DOCKER_COMPOSE_RUN) api-service npm run test:e2e -- $(file) --forceExit --detectOpenHandles; \
	fi

test: test-unit test-e2e
