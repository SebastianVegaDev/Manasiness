# Manasiness Docs

This folder contains the long-form documentation for Manasiness.

The root `README.md` is the project presentation. Detailed technical explanations live here.

## Documents

```txt
ARCHITECTURE.md   Overall mental model and module boundaries
BACKEND.md        Backend request flow, modules, auth, services, repositories
FRONTEND.md       Frontend folders, routing, cache, UI rules
DATABASE.md       PostgreSQL schema, seed data, triggers, stock rules
BOOTSTRAP.md      Dashboard bootstrap loading and frontend cache behavior
DOCKER.md         Docker Compose workflow and services
DEVELOPMENT.md    Local development commands and manual workflows
SECURITY.md       Current security model and sensitive routes
QA_CHECKLIST.md   Manual validation checklist
screenshots/      Real application screenshots used by the root README
```

## Reading order

For a new developer:

```txt
1. ARCHITECTURE.md
2. BACKEND.md
3. FRONTEND.md
4. DATABASE.md
5. BOOTSTRAP.md
6. DEVELOPMENT.md
```

For running the project:

```txt
1. DOCKER.md
2. DEVELOPMENT.md
3. QA_CHECKLIST.md
```

## Main idea

Manasiness is divided into:

```txt
frontend/
backend/
docs/
```

The backend owns the business rules and database access.

The frontend owns UI state, routing, forms, pages and local cache.

The database owns persistence, relational integrity and stock triggers.

## Mental model

When adding or changing a feature, follow this rule:

Backend:

```txt
route -> controller -> validator -> service -> repository -> mapper
```

Frontend:

```txt
page -> hook/context/service -> api -> mapper -> ui
```

## What not to do

Do not put everything inside one file.

Do not duplicate SQL in controllers.

Do not validate request data inside repositories.

Do not expose database rows directly when a mapper is needed.

Do not store JWT tokens in localStorage.

Do not disable strict TypeScript options later to make errors disappear.
