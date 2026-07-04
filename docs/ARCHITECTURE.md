# Architecture

Manasiness follows a modular architecture.

The goal is that a junior developer can open one module and understand where each responsibility lives.

## Root structure

```txt
Manasiness/
├── backend/
├── frontend/
└── docs/
```

## Backend architecture

Backend modules follow this structure:

```txt
module/
├── module.routes.js
├── module.controller.js
├── module.validator.js
├── module.service.js
├── module.repository.js
├── module.mapper.js
└── module.constants.js
```

Not every module needs every file.

Use files only when they add clarity.

## Backend responsibility split

```txt
routes       -> define HTTP endpoints
controller   -> read req, call service, send response
validator    -> validate params, query and body
service      -> business rules
repository   -> SQL and database access
mapper       -> response shape
constants    -> module constants
```

## Frontend architecture

Frontend is organized by app, features and shared code.

```txt
frontend/src/
├── app/
├── features/
└── shared/
```

## Frontend responsibility split

```txt
app        -> providers, layouts and routing
features   -> business screens and feature logic
shared     -> reusable UI, API client, hooks, config and storage
```

## Bootstrap architecture

The dashboard is wrapped by `BootstrapProvider`.

```txt
ProtectedRoute
└── BootstrapProvider
    └── DashboardLayout
```

Bootstrap loads the initial dashboard data and stores a cache in localStorage by store id.

The auth token is not stored in localStorage.

Authentication uses httpOnly cookies.

## Database architecture

The database is initialized by ordered SQL schema files.

```txt
backend/src/database/schema/
```

Development seed is handled by JS scripts.

```txt
backend/src/database/seeds/
backend/src/database/scripts/
```

The seed uses bcrypt to generate a real password hash.

## Main rule

The project should be easy to modify without guessing.

Examples:

```txt
Change validation       -> validator
Change business rule    -> service
Change SQL              -> repository
Change response shape   -> mapper
Change UI               -> page/component
Change cache behavior   -> bootstrap provider/updaters
```