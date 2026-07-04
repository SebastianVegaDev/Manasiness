# QA Checklist

Use this checklist before final push.

## Auth

```txt
[ ] Register store
[ ] Send verification code
[ ] Verify code
[ ] Login
[ ] Auth session persists by cookie
[ ] Logout
[ ] Forgot password sends code
[ ] Reset password works
[ ] Protected routes reject unauthenticated user
```

## Bootstrap

```txt
[ ] /bootstrap returns data after login
[ ] Bootstrap cache appears in localStorage
[ ] Cache key uses store id
[ ] Logout clears bootstrap cache
[ ] Dashboard loads after refresh
[ ] Public pages do not load bootstrap
```

## Categories

```txt
[ ] List categories
[ ] Search categories
[ ] Filter active/inactive
[ ] Create category
[ ] Edit category
[ ] Activate category
[ ] Deactivate category
[ ] Product forms receive category options
```

## Products

```txt
[ ] List products
[ ] Search products
[ ] Filter by status
[ ] Filter by category
[ ] Create product
[ ] Edit product
[ ] Activate product
[ ] Deactivate product
[ ] Product options update after changes
```

## Users

```txt
[ ] List users
[ ] Search users
[ ] Filter by status
[ ] Filter by role
[ ] Create customer
[ ] Create supplier
[ ] Create worker
[ ] Edit user
[ ] Activate user
[ ] Deactivate user
[ ] Default users cannot be modified incorrectly
```

## Sales

```txt
[ ] Sales page loads initial window from bootstrap
[ ] Register paid sale
[ ] Paid sale reduces stock
[ ] Register pending sale
[ ] Pending sale does not reduce stock
[ ] Default customer cannot create pending sale
[ ] Pagination works
[ ] Older/newer day navigation works
```

## Orders

```txt
[ ] Orders page loads initial window from bootstrap
[ ] Register paid order
[ ] Paid order increases stock
[ ] Register pending order
[ ] Pending order does not increase stock
[ ] Default supplier cannot create pending order
[ ] Pagination works
[ ] Older/newer day navigation works
```

## Staff

```txt
[ ] Staff page loads initial window from bootstrap
[ ] Register paid staff payment
[ ] Register pending staff payment
[ ] Default worker cannot create pending payment
[ ] Pagination works
[ ] Older/newer day navigation works
```

## Pending

```txt
[ ] Pending summary loads from bootstrap
[ ] Customer pending rows load
[ ] Supplier pending rows load
[ ] Worker pending rows load
[ ] Resolve customer pending as paid
[ ] Resolve supplier pending as paid
[ ] Resolve worker pending as paid
[ ] Resolve pending as canceled
[ ] Pending summary updates
```

## Financial pages

```txt
[ ] Income page loads current week from bootstrap
[ ] Income card loads today from bootstrap
[ ] Income period change works
[ ] Income date selection works
[ ] Expenses page loads current week from bootstrap
[ ] Expenses card loads today from bootstrap
[ ] Expenses period change works
[ ] Expenses date selection works
```

## Activity

```txt
[ ] Activity week top sold loads from bootstrap
[ ] Activity week least sold loads from bootstrap
[ ] Period change works
[ ] Offset navigation works
```

## Store settings

```txt
[ ] Information page loads
[ ] Store info can be edited
[ ] Store image can be edited
[ ] Currency can be changed
[ ] Password can be changed
```

## Database

```txt
[ ] Schema runs on empty DB
[ ] Seed runs
[ ] Demo user can login
[ ] Stock triggers work
[ ] Foreign keys protect invalid relations
```

## Build

```txt
[ ] Backend starts
[ ] Frontend builds
[ ] Frontend runs
[ ] No console crashes in main flows
```