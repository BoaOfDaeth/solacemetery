# Solacemetery Web App Makefile

.PHONY: help build clean run submodules deploy

# GitHub Container Registry (GHCR) deploy settings
REGISTRY := ghcr.io
GHCR_OWNER := boaofdaeth
IMAGE_NAME := solacemetery
IMAGE_TAG ?= latest
PLATFORM := linux/amd64
IMAGE := $(REGISTRY)/$(GHCR_OWNER)/$(IMAGE_NAME):$(IMAGE_TAG)

# Default target
help:
	@echo "Available commands:"
	@echo "  build      - Build Docker image with tag 'solacemetery'"
	@echo "  run        - Build and run Docker container using docker compose (requires ../docker/.env)"
	@echo "  clean      - Remove Docker image"
	@echo "  submodules - Initialize and update git submodules"
	@echo "  deploy     - Build linux/amd64 image and push to GHCR (override IMAGE_TAG)"
	@echo "  help       - Show this help message"

# Build Docker image
build:
	@echo "Building Docker image with tag 'solacemetery'..."
	@docker build --build-arg BUILD_DATE="$$(date -u +"%Y-%m-%dT%H:%M:%SZ")" -t solacemetery .

# Run Docker container using docker compose
run:
	@echo "Building and running Docker container with docker compose..."
	@if [ ! -f ../docker/.env ]; then \
		echo "Error: .env file not found in docker directory!"; \
		exit 1; \
	fi
	@cd ../docker && \
		BUILD_DATE="$$(date -u +"%Y-%m-%dT%H:%M:%SZ")" \
		docker compose up -d --build web
	@echo "Container started! Access the app at http://localhost:$${WEB_PORT:-3000}"

# Clean up Docker image
clean:
	@echo "Removing Docker image..."
	docker rmi solacemetery 2>/dev/null || true

# Pull and update git submodules
submodules:
	@echo "Initializing and updating git submodules..."
	@git submodule update --init --recursive
	@echo "Submodules updated successfully!"

# Build for linux and push to GitHub Container Registry (requires: docker login ghcr.io)
deploy:
	@echo "Building and pushing $(IMAGE) for platform $(PLATFORM)..."
	@docker buildx build \
		--platform "$(PLATFORM)" \
		--build-arg BUILD_DATE="$$(date -u +"%Y-%m-%dT%H:%M:%SZ")" \
		-t "$(IMAGE)" \
		--push \
		.
