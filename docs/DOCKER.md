# Docker

Manasiness includes a root Docker Compose workflow for local full-stack review.

## Environment file

Create the Docker environment file from the committed example:

```bash
cp .env.docker.example .env.docker
```

On Windows PowerShell:

```powershell
Copy-Item .\.env.docker.example .\.env.docker
```

Edit `.env.docker` if you need different local ports, database credentials, or Resend values.

Never commit `.env.docker`.

## Services

```txt
db        PostgreSQL 16 with a persistent Docker volume
seed      one-time backend seed runner
backend   compiled Node.js / Express API
frontend  nginx image serving the Vite production build
```

## Start the full app

```bash
npm run docker:up
```

Open:

```txt
http://localhost:8080
```

The Docker flow starts PostgreSQL, runs the seed service, starts the backend, and serves the frontend through nginx.

## Stop containers

```bash
npm run docker:down
```

## Reset local Docker data

```bash
npm run docker:reset
```

This removes the local PostgreSQL volume and starts the stack again.

## Logs and status

```bash
npm run docker:logs
npm run docker:ps
```

## Validation inside Docker

After the stack is running, you can inspect Compose config with:

```bash
docker compose --env-file .env.docker config
```

The normal code validation still runs from the host:

```bash
npm run validate
```
