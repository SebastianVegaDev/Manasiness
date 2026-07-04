# Development

## Requirements

```txt
Node.js
npm
PostgreSQL
```

## Backend setup

```bash
cd backend
npm install
```

Create env:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Run backend:

```bash
npm run dev
```

## Frontend setup

```bash
cd frontend
npm install
```

Create env:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Run frontend:

```bash
npm run dev
```

## Database setup

Run schema on an empty database:

```bash
cd backend
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
refactor(database): add schema and seed runners
docs: add project documentation
```

## Refactor rule

Do not change business behavior unless the tramo explicitly says so.

Separate responsibilities first.

Then improve architecture.

Then migrate to TypeScript strictly.