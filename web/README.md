# Solacemetery Web App

## Docker Build

### Manual Docker Build

Build the Docker image with DATABASE_URL manually:

```bash
docker build --build-arg DATABASE_URL="mysql://username:password@host:port/database" -t solacemetery .
```

### Using Makefile

The Makefile automatically reads DATABASE_URL from `.env.local`:

1. Create `.env.local` file:
```bash
echo "DATABASE_URL=mysql://username:password@host:port/database" > .env.local
```

2. Build using make:
```bash
make build
```

### Example DATABASE_URL formats

```bash
# Local development (database on host machine)
DATABASE_URL=mysql://solacemetry_user:rootpassword@host.docker.internal:3306/solace_db

# Container-to-host connection alternatives:
# Option 1: host.docker.internal (macOS/Windows)
DATABASE_URL=mysql://solacemetry_user:rootpassword@host.docker.internal:3306/solace_db

# Option 2: Host IP address (Linux)
DATABASE_URL=mysql://solacemetry_user:rootpassword@172.17.0.1:3306/solace_db

# Option 3: Host network mode
docker run --network host solacemetery
```

### Running the Container

```bash
# Standard run (use host.docker.internal in DATABASE_URL)
docker run -p 3000:3000 solacemetery

# With host network (use localhost in DATABASE_URL)
docker run --network host solacemetery
```

### Available Make Commands

```bash
make help    # Show available commands
make build   # Build Docker image (requires .env.local)
make clean   # Remove Docker image
```
