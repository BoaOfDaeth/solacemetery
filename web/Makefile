# Solacemetery Web App Makefile

.PHONY: help build clean run submodules

# Default target
help:
	@echo "Available commands:"
	@echo "  build      - Build Docker image with tag 'solacemetery'"
	@echo "  run        - Build and run Docker container on port 3000 (requires .env.local with DATABASE_URL)"
	@echo "  clean      - Remove Docker image"
	@echo "  submodules - Initialize and update git submodules"
	@echo "  help       - Show this help message"

# Build Docker image
build:
	@echo "Building Docker image with tag 'solacemetery'..."
	@docker build --build-arg BUILD_DATE="$$(date -u +"%Y-%m-%dT%H:%M:%SZ")" -t solacemetery .

# Run Docker container
run:
	@echo "Running Docker container..."
	@if [ ! -f .env.prod ]; then \
		echo "Error: .env.prod file not found!"; \
		echo "Please create .env.prod with DATABASE_URL variable."; \
		echo "Example: echo 'DATABASE_URL=mysql://user:pass@host:port/db' > .env.prod"; \
		exit 1; \
	fi
	@echo "Loading DATABASE_URL from .env.prod for runtime..."
	@docker run -d \
		--name solacemetery-app \
		-p 3000:3000 \
		--env-file .env.prod \
		solacemetery
	@echo "Container started! Access the app at http://localhost:3000"

# Clean up Docker image
clean:
	@echo "Removing Docker image..."
	docker rmi solacemetery 2>/dev/null || true

# Pull and update git submodules
submodules:
	@echo "Initializing and updating git submodules..."
	@git submodule update --init --recursive
	@echo "Submodules updated successfully!"
