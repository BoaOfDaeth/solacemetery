.PHONY: deploy cleanup

COMPOSE_DIR := docker
SERVICES ?= web items

deploy:
	@cd $(COMPOSE_DIR) && docker compose pull $(SERVICES) && docker compose up -d --force-recreate $(SERVICES)
	@echo "Cleaning up unused Docker resources..."
	@docker system prune -af
	@echo "Docker cleanup complete!"

cleanup:
	@echo "Cleaning up unused Docker resources..."
	@docker system prune -af
	@echo "Docker cleanup complete!"

