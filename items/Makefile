# Solabase Items App Makefile

.PHONY: help build clean run stop

# Default target
help:
	@echo "Available commands:"
	@echo "  build      - Build Docker image with tag 'solabase'"
	@echo "  run        - Build and run Docker container on port 2888 (requires .env.prod with MONGODB_URI, REDIS_URL, etc.)"
	@echo "  stop       - Stop Docker container"
	@echo "  clean      - Remove Docker image and container"
	@echo "  help       - Show this help message"

# Build Docker image
build:
	@echo "Building Docker image with tag 'solabase'..."
	@docker build --build-arg BUILD_DATE="$$(date -u +"%Y-%m-%dT%H:%M:%SZ")" -t solabase .

# Run Docker container
run:
	@echo "Running Docker container..."
	@if [ ! -f .env.prod ]; then \
		echo "Error: .env.prod file not found!"; \
		echo "Please create .env.prod with required environment variables."; \
		echo "Example variables: MONGODB_URI, REDIS_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, etc."; \
		exit 1; \
	fi
	@echo "Loading environment variables from .env.prod for runtime..."
	@docker run -d \
		--name solabase-app \
		-p 2888:2888 \
		--env-file .env.prod \
		solabase
	@echo "Container started! Access the app at http://localhost:2888"

# Stop Docker container
stop:
	@echo "Stopping Docker container..."
	@docker stop solabase-app 2>/dev/null || true
	@docker rm solabase-app 2>/dev/null || true
	@echo "Container stopped and removed!"

# Clean up Docker image and container
clean:
	@echo "Removing Docker image and container..."
	@docker stop solabase-app 2>/dev/null || true
	@docker rm solabase-app 2>/dev/null || true
	@docker rmi solabase 2>/dev/null || true
	@echo "Cleanup complete!"

