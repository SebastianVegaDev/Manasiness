# DevJudge Dev Log

## Initial database schema

Created the first database schema for DevJudge.

Added tables:

* users
* challenges
* test-cases
* submissions
* user-progress

Also added an initialization script with seed data for the first challenge.

## Backend authentication

Added the first authentication backend module for DevJudge.

Implemented:

* user registration
* user login
* user logout
* authenticated session check

Added password hashing with bcrypt.

Added JWT creation and verification.

Added httpOnly cookie authentication using `devjudge_token`.

Added protected route middleware with `requireAuth`.

Added auth input validators for register and login.

## Role based admin permissions

Added role based access control for DevJudge.

Implemented:

* user/admin role separation
* admin role middleware with `requireRole`
* protected admin challenge routes
* create challenge as admin
* update challenge as admin
* delete challenge as admin

Manual tests completed:

* normal user cannot create challenges
* admin can create challenges
* admin can update challenges
* admin can delete challenges

## Frontend Auth Flow and Scalable Structure

### Goal

Build the frontend authentication flow and organize the project with a scalable feature-based structure.

### Branch

`feat/auth-frontend`

### What I built

* Added a scalable frontend folder structure using `features`, `shared`, and `app/routes`.
* Moved auth files into `features/auth`.
* Moved route protection files into `app/routes`.
* Added `AuthContext`, `AuthProvider`, and `useAuth`.
* Fixed the React Fast Refresh warning by separating context, provider, and hook.
* Added frontend session loading using `/auth/me`.
* Added login and register pages.
* Added protected dashboard route.
* Added admin-only route.
* Added basic dashboard and admin home pages.
* Added shared API client functions: `apiGet`, `apiPost`, `apiPut`, and `apiDelete`.

### Important technical decision

I decided not to keep all pages inside `src/pages` because the admin section will grow a lot.

Instead, I moved the frontend to a feature-based structure:

```txt
src/
  app/
    routes/
  features/
    auth/
    admin/
    dashboard/
    home/
  shared/
    api/
```

## Base Layout and Shared UI

### Goal

Create a simple but scalable frontend layout and reusable UI base before adding more feature logic.

### Branch

`feat/base-layout`

### What I built

* Added `AppLayout` for authenticated pages.
* Added `Sidebar` navigation.
* Added `Topbar` with user role and logout action.
* Added shared UI components:

  * `Button`
  * `Input`
  * `Card`
  * `Badge`
  * `LoadingState`
  * `EmptyState`
  * `ErrorState`
* Reused shared UI inside login, register, home, dashboard, and admin pages.
* Added a basic `/challenges` page placeholder for the next challenge listing logic.
* Kept the UI minimal because the priority is still learning structure and behavior before final design.

### Important technical decision

The layout is only used inside protected routes.

Public pages like `/`, `/login`, and `/register` stay outside the dashboard layout.

Authenticated pages like `/dashboard`, `/challenges`, and `/admin` use `AppLayout`.

## Challenges Backend CRUD

### Goal

Build the backend CRUD foundation for DevJudge challenges.

### Branch

`feat/challenges-crud`

### What I built

* Added public challenge routes.
* Added `GET /api/challenges`.
* Added `GET /api/challenges/:slug`.
* Improved admin challenge create, update, and delete logic.
* Added challenge fields:

  * `topic`
  * `language`
  * `function_name`
  * `updated_at`

* Added reusable challenge types.
* Added challenge input validation.
* Added public challenge filters by search, difficulty, topic, and language.
* Updated database schema and seed data.

### Manual tests completed

* Public users can list published challenges.
* Public users can view a published challenge by slug.
* Admin can create a challenge.
* Admin can update a challenge.
* Admin can delete a challenge.
* Normal user cannot create admin challenges.

### Important technical decision

The public challenge module is separated from the admin challenge module.

Public routes only expose published challenges.

Admin routes stay protected with `requireAuth` and `requireRole("admin")`.

## Test cases backend

- Added admin test case backend module.
- Added JSONB fields for challenge inputs and expected outputs.
- Added comparator validation: exact, array_exact, array_unordered, number_tolerance.
- Added admin endpoints to list, create, update, and delete test cases.
- Kept legacy input and expected_output columns for compatibility.
- Manual tested admin CRUD with curl.

## Admin challenges panel

- Added admin pages to create, edit, publish and delete challenges.
- Added admin pages to create, edit and delete visible/hidden test cases.
- Moved the frontend admin challenge feature to `features/adminChallenges` to avoid nested folders.
- Moved backend admin challenge modules to flatter folders: `modules/adminChallenges` and `modules/adminTestCases`.
- Kept the CSS simple with px values and basic flex layouts.

## Public challenges list

### Goal

Build the public challenges page where authenticated users can see available published challenges.

### Branch

`feat/public-challenges-list`

### What I built

* Added public challenge frontend types.
* Added challenge service to fetch published challenges from the backend.
* Added query filters for search, difficulty, topic, and language.
* Added `ChallengeCard` component to display challenge information.
* Updated `ChallengesPage` to load real challenges from the backend.
* Added loading, error, empty, and list states.
* Displayed basic solved/unsolved status as a frontend placeholder for now.
* Kept the CSS simple with px values and basic flex layouts.

### Manual tests completed

* Logged in as a normal user.
* Opened `/challenges`.
* Confirmed published challenges are loaded from the backend.
* Tested search by challenge title.
* Tested filter by difficulty.
* Tested filter by topic.
* Tested filter by language.
* Confirmed empty state appears when no challenge matches the filters.
* Confirmed the page still works after refreshing.

### Important technical decision

The public challenge feature is separated from the admin challenge feature.

Admin pages are used to create and manage challenges.

The public `ChallengesPage` only reads published challenges and shows them to users.

The solved/unsolved state is currently a placeholder because real progress tracking will be added later with submissions and user progress.


## Challenge detail page

### Goal

Build the challenge detail page where a user can read a challenge and prepare a solution.

### Branch

`feat/challenge-detail-page`

### What I built

* Added `ChallengeDetailPage`.
* Added the protected route `/challenges/:slug`.
* Connected the page to the existing backend endpoint `GET /api/challenges/:slug`.
* Added frontend type `PublicChallengeDetail` with `starter_code`.
* Added `getChallengeBySlug` to the public challenge service.
* Updated `ChallengeCard` to link to the detail page.
* Displayed challenge title, slug, description, difficulty, topic, language, function name, and starter code.
* Added a simple textarea editor for the user's solution.
* Added a fake local `Run tests` action that creates a pending result.
* Added a local attempt history.
* Added a reset button to restore the original starter code.
* Kept the UI simple with basic cards, borders, flex, grid, and textarea.

### Manual tests completed

* Logged in as a normal user.
* Opened `/challenges`.
* Clicked `Open challenge`.
* Confirmed `/challenges/:slug` loads the correct challenge.
* Confirmed starter code appears in the page.
* Edited the solution textarea.
* Clicked `Run tests`.
* Confirmed the result panel shows a pending result.
* Confirmed attempt history shows the local attempt.
* Confirmed `Reset code` restores the original starter code.

### Important technical decision

I did not create backend submissions in this step.

Only prepares the solving screen.

The result and attempt history are local fake/pending data for now because real submissions, stored attempts, and backend judge logic start later.

## Challenge submissions

### Goal

Add real submission storage for challenge attempts.

### Branch

`feat/submissions-backend`

### What I built

* Added backend submissions module.
* Added submission types.
* Added submission input validation.
* Added repository functions to create and read submissions.
* Added service logic to validate challenge ids and user ownership.
* Added protected endpoint to create a submission:

  * `POST /api/challenges/:id/submissions`

* Added protected endpoint to list my submissions for one challenge:

  * `GET /api/challenges/:id/submissions/me`

* Added protected endpoint to read one submission:

  * `GET /api/submissions/:id`

* Updated the database schema with `runtime_ms`.
* Updated submission statuses to match the judge roadmap:

  * `pending`
  * `accepted`
  * `wrong_answer`
  * `runtime_error`
  * `timeout`

* Connected the challenge detail page to real submissions.
* Replaced the local fake attempt history with saved PostgreSQL submissions.
* Fixed the challenge detail CSS import.

### Manual tests completed

* Ran `npm run db:init`.
* Logged in with cookie authentication.
* Created a submission with curl.
* Confirmed the submission is saved with status `pending`.
* Confirmed `total_tests` is calculated from existing test cases.
* Listed my submissions for a challenge.
* Read one submission by id.
* Opened a challenge in the frontend.
* Clicked `Run tests`.
* Confirmed the pending submission appears in the result panel.
* Refreshed the page.
* Confirmed attempt history persists.

### Important technical decision

I did not implement the real judge yet.

Day 13 only stores submissions.

The submission starts with:

* `status = pending`
* `passed_tests = 0`
* `score = 0`
* `runtime_ms = null`

The real judge execution will be added later.

## Basic user progress tracking

### Goal

Add basic progress tracking when a user creates a submission.

### Branch

`feat/user-progress-basic`

### What I built

* Updated the `user_progress` table structure.
* Added `attempts_count`.
* Added `last_submission_id`.
* Added `last_attempt_at`.
* Added progress update logic after creating a submission.
* Used `ON CONFLICT (user_id, challenge_id)` to keep one progress row per user and challenge.
* Updated submission status types to stay consistent between backend and frontend.
* Removed the upper score limit because future scoring can be higher than 100 points.

### Manual tests completed

* Created a submission for a published challenge.
* Confirmed a `user_progress` row is created.
* Created another submission for the same challenge.
* Confirmed `attempts_count` increases.
* Confirmed `last_submission_id` changes to the latest submission.
* Confirmed `last_attempt_at` updates.

### Important technical decision

The controller does not update progress directly.

The submission service owns this rule because progress tracking is part of the submission business flow.