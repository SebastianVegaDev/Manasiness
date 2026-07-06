# Database

Manasiness uses PostgreSQL.

## Database folder

```txt
backend/src/database/
├── schema/
├── scripts/
└── seeds/
```

## Schema

Schema files live in:

```txt
backend/src/database/schema/
```

They are ordered with numeric prefixes.

Example:

```txt
01_extensions.sql
02_tables.sql
03_functions.sql
04_triggers.sql
05_indexes.sql
```

Schema files should define structure.

They should not contain development seed data.

## Seed

Development seed lives in:

```txt
backend/src/database/seeds/devSeed.js
```

Seed runner:

```txt
backend/src/database/scripts/runSeed.js
```

The seed creates a bcrypt hash using JavaScript.

This avoids hardcoding a fake or manually copied password hash in SQL.

## Scripts

Run schema:

```bash
npm run db:schema
```

Run seed:

```bash
npm run db:seed
```

Demo credentials after seed:

```txt
Email: demo@manasiness.dev
Password: 123456
```

## Important business rules in DB

The database protects important relations.

Examples:

```txt
stores own categories, products, users and movements
products belong to categories
sales belong to products and users
orders belong to products and users
staff belongs to users
```

## Stock behavior

Stock behavior is protected by database triggers.

Business meaning:

```txt
paid sale      -> reduces stock
pending sale   -> does not reduce stock yet
canceled sale  -> does not reduce stock

paid order     -> increases stock
pending order  -> does not increase stock yet
canceled order -> does not increase stock
```

## Why stock is in DB triggers

Stock is critical.

If stock updates only lived in frontend or services, a bug could corrupt inventory.

The database trigger keeps stock consistent when a valid movement is inserted or updated.

## When changing DB

Before changing schema:

1. Understand affected modules.
2. Update repositories.
3. Update backend mappers.
4. Update frontend mappers if response shape changes.
5. Update seed if needed.
6. Test main flows.