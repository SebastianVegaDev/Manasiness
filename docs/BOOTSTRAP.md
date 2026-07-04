# Bootstrap

Bootstrap is the initial dashboard data loader.

It reduces repeated requests when the user moves through dashboard pages.

## Backend endpoint

```txt
GET /bootstrap
```

This route is protected.

The user must be authenticated.

## Backend files

```txt
backend/src/modules/bootstrap/
├── bootstrap.constants.js
├── bootstrap.controller.js
├── bootstrap.mapper.js
├── bootstrap.routes.js
└── bootstrap.service.js
```

## Backend responsibility

Bootstrap does not replace other modules.

Bootstrap orchestrates existing services.

Example:

```txt
bootstrap.service.js calls:
- auth service
- categories service
- products service
- users service
- sales service
- orders service
- staff service
- stats service
- pending service
- income service
- expenses service
- activity service
```

## Bootstrap payload

Main sections:

```txt
meta
session
options
catalog
people
dashboard
pending
charts
initialWindows
activity
```

## Frontend files

```txt
frontend/src/features/bootstrap/
├── api/
├── cache/
├── context/
├── hooks/
├── providers/
├── service/
└── updaters/
```

## BootstrapProvider

The dashboard is wrapped with:

```txt
BootstrapProvider
```

Only protected dashboard pages use bootstrap.

Public pages do not load bootstrap.

## Cache

Bootstrap is cached in localStorage by store id.

Example:

```txt
manasiness_bootstrap_cache_1
```

Cache contains:

```txt
data
savedAt
version
```

## Cache rule

Cache is useful for navigation speed.

Cache is not the source of truth forever.

When the user creates or updates something, the app can:

1. update bootstrap locally with an updater
2. refresh a specific window
3. refresh full bootstrap when needed

## Updaters

Bootstrap updaters live in:

```txt
frontend/src/features/bootstrap/updaters/
```

They update local bootstrap data after mutations.

Examples:

```txt
upsertBootstrapCategory
upsertBootstrapProduct
upsertBootstrapUser
resolveBootstrapPendingItem
updateBootstrapInitialWindow
```

## What bootstrap should include

Bootstrap can include useful initial data:

```txt
session store
options
catalog lists
people lists
dashboard stats
pending summary
pending rows
income/expenses week
sales/orders/staff initial window
activity week
```

## What bootstrap should not include

Bootstrap should not load unlimited history.

Avoid loading all:

```txt
sales history
orders history
staff history
customer details
supplier details
worker details
activity history
```

Those can grow too much.

Use normal endpoints when filters, offsets or details are needed.