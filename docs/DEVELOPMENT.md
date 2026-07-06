# Development

## Requirements

```txt
Node.js
npm
PostgreSQL
```

## Install dependencies

From the project root:

```bash
npm run install:all
```

Equivalent split commands:

```bash
npm run install:backend
npm run install:frontend
```

## Environment files

Backend local env:

```bash
cp backend/.env.example backend/.env
```

Frontend local env:

```bash
cp frontend/.env.example frontend/.env
```

On Windows PowerShell:

```powershell
Copy-Item .\backend\.env.example .\backend\.env
Copy-Item .\frontend\.env.example .\frontend\.env
```

## Database setup

Run schema on an empty database:

```bash
npm run db:schema
```

Run dev seed:

```bash
npm run db:seed
```

Demo account:

```txt
Email: demo@manasiness.dev
Password: 123456
```

## Run locally

Start the backend:

```bash
npm run dev:backend
```

Start the frontend in another terminal:

```bash
npm run dev:frontend
```

Default frontend URL:

```txt
http://localhost:5173
```

## Validation

Before merging a branch, run:

```bash
npm run validate
```

The expanded validation is:

```bash
npm run typecheck
npm run build:backend
npm run lint:frontend
npm run build:frontend
```

## Normal development flow

Create branch:

```bash
git checkout main
git status
git checkout -b type/scope-name
```

Work on the files.

Validate.

Commit once per meaningful tramo:

```bash
git add .
git commit -m "type(scope): message"
```

Merge local:

```bash
git checkout main
git merge type/scope-name
git branch -d type/scope-name
```

Push is done only at the end of the full refactor.

## Commit style

Examples:

```txt
refactor(backend): add bootstrap module
refactor(frontend): extract app routing foundation
docs: document Docker workflow
```
