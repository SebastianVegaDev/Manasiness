# Frontend

The frontend is built with React and Vite.

## Main structure

```txt
frontend/src/
├── app/
├── features/
└── shared/
```

## App folder

```txt
app/
├── layouts/
├── providers/
└── routes/
```

App owns routing and global providers.

## Routes

Routes are split into:

```txt
app/routes/public.routes.jsx
app/routes/dashboard.routes.jsx
app/routes/AppRouter.jsx
```

`App.jsx` should stay small.

## Features

Features are business areas.

Examples:

```txt
features/products/
features/categories/
features/sales/
features/orders/
features/bootstrap/
features/auth/
```

A feature can contain:

```txt
api/
components/
config/
hooks/
layout/
mappers/
pages/
service/
storage/
updaters/
```

Use only what the feature needs.

## Shared folder

Reusable code lives in:

```txt
shared/
```

Examples:

```txt
shared/api/
shared/config/
shared/hooks/
shared/routes/
shared/storage/
shared/ui/
shared/utils/
```

## API client

The API client lives in:

```txt
shared/api/client.js
shared/api/config.js
```

The API base URL comes from:

```txt
shared/config/env.js
```

## Local storage

Local storage helpers live in:

```txt
shared/storage/localStorage.js
```

Rules:

```txt
Do not store JWT tokens.
Do not store sensitive auth secrets.
Use localStorage only for safe cache/state.
```

## Bootstrap cache

Bootstrap cache lives in localStorage by store id.

Example key:

```txt
manasiness_bootstrap_cache_<storeId>
```

This prevents unnecessary requests while moving through dashboard pages.

## Page rule

A page should not become a huge file.

A page can:

```txt
compose UI
call feature hooks
open modals
handle simple events
```

A page should avoid:

```txt
duplicated fetch logic
complex mapping
large business rules
raw localStorage access
```

## Mapper rule

Frontend mappers adapt backend data to UI components.

Example:

```txt
backend response -> frontend mapper -> card/table/form UI
```

Do not make UI components depend directly on backend row details when the shape is complex.