# Backend

The backend is built with Node.js, Express and PostgreSQL.

## Main structure

```txt
backend/
├── server.js
├── src/
│   ├── app.js
│   ├── routes.js
│   ├── config/
│   ├── database/
│   ├── errors/
│   ├── middlewares/
│   ├── modules/
│   └── shared/
└── package.json
```

## Request flow

```txt
request
  ↓
route
  ↓
controller
  ↓
validator
  ↓
service
  ↓
repository
  ↓
database
  ↓
mapper
  ↓
response
```

## Config

Config lives in:

```txt
backend/src/config/
```

Main files:

```txt
env.js
db.js
cors.js
```

## Routes

Root routes live in:

```txt
backend/src/routes.js
```

Auth routes are public.

Everything after `verifyToken` is protected.

```txt
/auth       -> public
/bootstrap  -> protected
/categories -> protected
/products   -> protected
...
```

## Auth

Auth uses:

```txt
JWT
httpOnly cookie
bcrypt
```

The frontend does not store the JWT.

The cookie is managed by the browser.

## Shared backend code

Shared backend code lives in:

```txt
backend/src/shared/
```

Current shared areas:

```txt
constants/
db/
email/
mappers/
validators/
```

## Modules

Current modules:

```txt
activity
auth
bootstrap
categories
customers
expenses
income
information
orders
password
pending
products
sales
staff
stats
suppliers
users
workers
```

## Module rules

### controller

Allowed:

```txt
read req
call validator
call service
send response
catch next(error)
```

Not allowed:

```txt
SQL
business rules
manual data transformation
```

### validator

Allowed:

```txt
validate params
validate query
validate body
return clean payload
```

Not allowed:

```txt
database calls
business rules
response formatting
```

### service

Allowed:

```txt
business rules
calling repositories
calling mappers
orchestrating several modules
```

Not allowed:

```txt
res.json
req.body
raw SQL
```

### repository

Allowed:

```txt
SQL
transactions
database row return
```

Not allowed:

```txt
HTTP responses
frontend formatting
request validation
```

### mapper

Allowed:

```txt
shape response
convert null/default values
hide unnecessary database details
```

Not allowed:

```txt
SQL
business rules
database writes
```

## Large repositories

Some big modules use a repository folder.

Example:

```txt
pending/repository/
activity/repository/
stats/repository/
```

This is only used when one repository file becomes too large.

Do not create folders just to look professional.

Create folders when they make the module easier to understand.