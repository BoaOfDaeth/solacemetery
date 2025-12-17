.PHONY: deploy

COMPOSE_DIR := docker
SERVICES ?= web items

deploy:
	@cd $(COMPOSE_DIR) && docker compose pull $(SERVICES) && docker compose up -d --force-recreate $(SERVICES)


