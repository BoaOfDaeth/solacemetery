# Solabase Items App Makefile

.PHONY: help build clean run stop deploy

# GitHub Container Registry (GHCR) deploy settings
REGISTRY := ghcr.io
GHCR_OWNER := boaofdaeth
IMAGE_NAME := solabase
IMAGE_TAG ?= latest
PLATFORM := linux/amd64
IMAGE := $(REGISTRY)/$(GHCR_OWNER)/$(IMAGE_NAME):$(IMAGE_TAG)

# Default target
help:
	@echo "Available commands:"
	@echo "  build      - Build Docker image with tag 'solabase'"
	@echo "  run        - Build and run Docker container using docker compose (requires ../docker/.env)"
	@echo "  stop       - Stop Docker container"
	@echo "  clean      - Remove Docker image and container"
	@echo "  deploy     - Build linux/amd64 image and push to GHCR (override IMAGE_TAG)"
	@echo "  help       - Show this help message"

# Build Docker image
build:
	@echo "Building Docker image with tag 'solabase'..."
	@docker build --build-arg BUILD_DATE="$$(date -u +"%Y-%m-%dT%H:%M:%SZ")" -t solabase .

# Run Docker container using docker compose
run:
	@echo "Building and running Docker container with docker compose..."
	@if [ ! -f ../docker/.env ]; then \
		echo "Error: .env file not found in docker directory!"; \
		exit 1; \
	fi
	@cd ../docker && docker compose up -d --build items
	@echo "Container started! Access the app at http://localhost:$${ITEMS_PORT:-2888}"

# Stop Docker container
stop:
	@echo "Stopping Docker container..."
	@cd ../docker && docker compose stop items
	@echo "Container stopped!"

# Clean up Docker image and container
clean:
	@echo "Removing Docker image and container..."
	@cd ../docker && docker compose down items 2>/dev/null || true
	@docker rmi solabase 2>/dev/null || true
	@echo "Cleanup complete!"

# Build for linux and push to GitHub Container Registry (requires: docker login ghcr.io)
deploy:
	@echo "Building and pushing $(IMAGE) for platform $(PLATFORM)..."
	@docker buildx build \
		--platform "$(PLATFORM)" \
		--build-arg BUILD_DATE="$$(date -u +"%Y-%m-%dT%H:%M:%SZ")" \
		-t "$(IMAGE)" \
		--push \
		.

