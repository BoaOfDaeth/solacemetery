# Solacemetery Web Application

A Next.js web application for the Solace MUD cemetery project.

### Running in production

To start the web application container:

1. **Navigate to the web directory:**
   ```bash
   cd web
   ```

2. **Create environment file (pass production database credentials):**
   ```bash
   echo 'DATABASE_URL=mysql://solacemetery_user:solacemetery_password@host.docker.internal:3306/solace_db' > .env.prod
   ```

3. **Start the container:**
   ```bash
   make run
   ```

Once the container is running, it is available on port 3000 by default.

## Local Development

### Database Setup

To develop locally, you'll need to set up the MySQL database:

1. **Navigate to the mysql directory:**
   ```bash
   cd mysql
   ```

2. **Add your database schema:**
   - Place your `02-create-tables.sql` dump file in the `init/` directory
   - This will automatically run when the database container starts

3. **Start the database container:**
   ```bash
   docker-compose up -d
   ```

### Running the Application Locally

1. **Navigate back to the web directory:**
   ```bash
   cd web
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file for local development:**
   ```bash
   echo 'DATABASE_URL=mysql://solacemetery_user:solacemetery_password@localhost:3306/solace_db' > .env.local
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000` with hot reloading enabled.
