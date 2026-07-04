# Manasiness Docs

This folder explains how Manasiness is organized.

Read in this order:

```txt
1. ARCHITECTURE.md
2. BACKEND.md
3. FRONTEND.md
4. DATABASE.md
5. BOOTSTRAP.md
6. DEVELOPMENT.md
7. QA_CHECKLIST.md
8. DECISIONS.md
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