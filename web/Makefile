# Solacemetery Web App Makefile

.PHONY: help build clean run

# Default target
help:
	@echo "Available commands:"
	@echo "  build  - Build Docker image with tag 'solacemetery'"
	@echo "  run    - Build and run Docker container on port 3000 (requires .env.local with DATABASE_URL)"
	@echo "  clean  - Remove Docker image"
	@echo "  help   - Show this help message"

# Build Docker image
build:
	@echo "Building Docker image with tag 'solacemetery'..."
	@docker build --build-arg BUILD_DATE="$$(date -u +"%Y-%m-%dT%H:%M:%SZ")" -t solacemetery .

# Run Docker container
run:
	@echo "Running Docker container..."
	@if [ ! -f .env.local ]; then \
		echo "Error: .env.local file not found!"; \
		echo "Please create .env.local with DATABASE_URL variable."; \
		echo "Example: echo 'DATABASE_URL=mysql://user:pass@host:port/db' > .env.local"; \
		exit 1; \
	fi
	@echo "Loading DATABASE_URL from .env.local for runtime..."
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

deploy:
	git fetch -q
	@if [ "$$(git rev-parse @)" != "$$(git rev-parse @{u})" ]; then \
		git pull --ff-only -q; \
		./deploy.sh; \
	fi