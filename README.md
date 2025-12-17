# Solacemetery

Solace MUD cemetery project.

## Deployment

### When Code Changes

1. **Build new images** using GitHub Actions:
   - Go to Actions → `build-web` or `build-items`
   - Run workflow on the branch with your changes
   - Images are automatically pushed to `ghcr.io/boaofdaeth/*`

2. **Deploy to production**:
   ```bash
   make deploy
   ```

This pulls the latest images and updates the running containers.

### Environment Setup

Create `docker/.env` with required variables:
- `DATABASE_URL` - MySQL connection string
- `MONGO_INITDB_ROOT_USERNAME`, `MONGO_INITDB_ROOT_PASSWORD` - MongoDB credentials
- `REDIS_PORT`, `MONGODB_PORT`, `WEB_PORT`, `ITEMS_PORT` - Service ports
- `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, `DISCORD_REDIRECT_URI` - Discord OAuth (for items service)
