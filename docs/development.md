# Development

How to set up, run and change Ordbank locally. Each section is added by the change that introduces the
process it describes.

## Prerequisites

| Tool                                                                                                          | Why                                                                                                   |
| ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Node 24                                                                                                       | Pinned in `.nvmrc`, which fnm, nvm and pnpm's `node` shim can all read                                |
| [pnpm](https://pnpm.io/installation)                                                                          | Package manager. Any recent install works: it switches itself to the version pinned in `package.json` |
| [just](https://just.systems/man/en/)                                                                          | Task runner — the commands below                                                                      |
| [Git for Windows](https://gitforwindows.org)                                                                  | Windows only: provides the `sh` that `just` runs recipes with                                         |
| A [Neon](https://console.neon.tech/app/) database and a [Clerk](https://dashboard.clerk.com/apps) application | Data and authentication                                                                               |

On Windows, `sh` lives in Git's `usr\bin`, which only Git Bash puts on PATH. To run recipes from PowerShell
too, append it to your user PATH once and open a new terminal:

```powershell
[Environment]::SetEnvironmentVariable('Path', [Environment]::GetEnvironmentVariable('Path', 'User') + ';C:\Program Files\Git\usr\bin', 'User')
```

Appending to the user PATH is safe: Windows searches the system PATH first, so its own `find`, `sort` and
`curl` still take precedence over Git's.

## First-time setup

```bash
git clone https://github.com/jplimmer/ordbank.git
cd ordbank
node -v          # should print v24.x
just setup
```

Copy [`.env.example`](../.env.example) to `.env.local` and fill it in: the `development` branch's connection
string (see [Environments](#environments)) and the Clerk development-instance keys. Use `.env.local`, not
`.env.development.local`: `next dev`, `next build`, `next start` and drizzle-kit all read `.env.local`, but a
build skips `.env.development*` files.

To use the `db-seed` and `db-reset-dev` recipes, sign the Neon CLI in and point it at the project once:

```bash
pnpm exec neonctl auth
pnpm exec neonctl set-context --project-id <project id>   # from the Neon console; writes .neon (gitignored)
```

Then `just dev` and open <http://localhost:3000>.

## Commands

Run `just` to list the recipes. Each one runs a `package.json` script, so the scripts stay the single
definition of how a tool is invoked.

| Recipe              | Does                                                                  |
| ------------------- | --------------------------------------------------------------------- |
| `just setup`        | Set up a fresh clone or worktree (installs dependencies)              |
| `just install`      | Install dependencies exactly as locked                                |
| `just dev`          | Dev server (Turbopack)                                                |
| `just lint`         | ESLint                                                                |
| `just typecheck`    | `tsc --noEmit`                                                        |
| `just format`       | Prettier, writing changes                                             |
| `just format-check` | Prettier, check only                                                  |
| `just test`         | Unit tests, once (see [Tests](#tests))                                |
| `just test-watch`   | Unit tests, re-run on every change                                    |
| `just build`        | Production build                                                      |
| `just ci`           | Everything CI checks: format-check, lint, typecheck, test and build   |
| `just db-generate`  | Generate a migration from `schema.ts` (see [Migrations](#migrations)) |
| `just db-migrate`   | Apply pending migrations to the `DATABASE_URL` database               |
| `just db-seed`      | Seed the `template` Neon branch (see [Environments](#environments))   |
| `just db-reset-dev` | Reset the `development` Neon branch to `template`                     |

A pre-commit hook (Husky + lint-staged) runs ESLint and Prettier on staged files.

## Tests

Unit tests use [Vitest](https://vitest.dev) and sit next to the code they test as `*.test.ts` under `src/` or
`scripts/`.
To run one file, pass its path: `pnpm exec vitest run src/lib/utils.test.ts`. Imports can use the `@/` alias,
which Vitest reads from `tsconfig.json`.

Tests check behaviour through a module's exports, not how it works inside. Don't export something only to
test it, and don't mock the module's own collaborators. When code is random or time-dependent, make the random
source or clock a parameter and pass a seeded or fixed one in tests, rather than patching `Math.random` or
`Date`. If a module can't be tested without mocks, move the boundary so the logic sits apart from its I/O.

| Belongs in unit tests                                                  | Belongs in E2E tests                                  |
| ---------------------------------------------------------------------- | ----------------------------------------------------- |
| Pure logic: validation schemas, formatting, rules computed from data   | Async Server Components, which Vitest can't render    |
| Modules whose imports don't reach the database, Clerk or `server-only` | Server actions and services, which need auth and Neon |
|                                                                        | Anything whose result depends on how Next compiles it |

Importing `server-only`, `@/lib/env` or the database client (`@/lib/db`; the table definitions in
`@/lib/db/schema` are fine) from a test fails or needs real secrets, so it's a sign the test belongs in E2E or
the logic should move into a pure module. E2E tests arrive with Playwright in #115.

## Environments

Production data never leaves production. Every other database is copied from `template`, which has
production's schema and migration history but only seeded sample data. No app is deployed to or connects to
`template`: it exists to be seeded, migrated after production and copied.

```
production       root    real data                                 Vercel Production
template         root    production's schema + seed data            copied by every branch below, no app
├─ development   child   local dev (.env.local) and every Vercel preview
└─ pr-<number>   child   one per open PR, where CI tests its migrations
```

| Environment           | Database                | Clerk instance | Configured in                             |
| --------------------- | ----------------------- | -------------- | ----------------------------------------- |
| Production            | `production`            | production     | Vercel, Production variables              |
| Preview               | `development`           | development    | Vercel, Preview variables                 |
| Local                 | `development`           | development    | `.env.local`                              |
| CI build              | none (placeholders)     | none           | [`ci.yaml`](../.github/workflows/ci.yaml) |
| CI `migration-replay` | empty Postgres 17 in CI | none           | [`ci.yaml`](../.github/workflows/ci.yaml) |
| CI `pr-branch`        | `pr-<number>` (Neon)    | none           | [`ci.yaml`](../.github/workflows/ci.yaml) |

The Neon free plan allows 3 root branches and 10 branches in total, so this uses 2 root branches and 3 plus
one per open PR. Branches are copy-on-write: a child shares its parent's storage until either changes.

**Environment variables** are validated by [`src/lib/env/schema.ts`](../src/lib/env/schema.ts), at build
(`next.config.ts` imports it) and at runtime (the database client imports it). A missing or malformed value
stops with an error naming the variable. When adding a variable, add it to the schema, `.env.example`, the CI
placeholders and each Vercel environment. Server code reads it from `env` in `src/lib/env`, not `process.env`.

**Branch lifecycles**

- **`template`** is a schema-only branch of `production`, so it has no parent to reset from. It stays in step
  because every production deploy applies the same migrations to it, straight after `production`. If it drifts
  anyway, delete it, recreate it as a schema-only branch of `production` in the Neon console, copy the
  migration history across (a schema-only branch has the `drizzle.__drizzle_migrations` table but not its
  rows), re-seed and run `just db-reset-dev`:

  ```bash
  pg_dump --data-only --table=drizzle.__drizzle_migrations "$(pnpm exec neonctl connection-string production)" \
    | psql "$(pnpm exec neonctl connection-string template)"
  ```

- **`pr-<number>`** is created from `template` by CI on a PR's first push, reset to `template` on every later
  push and deleted when the PR closes. Neon also deletes it after two weeks, in case the close event is
  missed; the next push creates it again.
- **`just db-seed`** writes sample data to `template`. It asks `neonctl` for `template` by name rather than
  reading `DATABASE_URL`, so it can't reach production. Each run replaces the seed users' data and nothing
  else. Re-run it after changing [`scripts/seed.ts`](../scripts/seed.ts).
- **`development`** is a child of `template`. `just db-reset-dev` discards everything in it and copies
  `template` again: run it after re-seeding, or whenever local data gets into a mess. Its connection string
  survives a reset.

**Seed data** is what every migration is tested against (#113), so it covers the awkward states the app can
produce, and nothing it can't. Languages and words go through the app's own validation, so they're stored
lowercased, as the app stores them.

| Seed user                      | Data                                                                                                                                                                       |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SEED_CLERK_USER_ID`           | A Swedish–English pair with words at every stage of learning, the longest word allowed, a multi-word phrase and synonyms sharing a target; an empty Norwegian–English pair |
| `seed_no_limits_dangling_pair` | Test settings with no question or time limit; an active pair that was deleted (#138); a French–English pair with a few words                                               |
| `seed_new_user`                | Nothing: no pairs, no test settings, no active pair                                                                                                                        |

`SEED_CLERK_USER_ID` is your user in the Clerk development instance, so you can sign in as it. The others
have made-up Clerk IDs (real ones start with `user_`): nobody signs in as them, they exist to be migrated.

**Revisit this model** if previews need their own databases: for example, two open PRs whose schema changes
conflict, since every preview shares `development`. The Neon–Vercel integration was ruled out because it
branches previews from the default branch, copying production data into each one (#112). Deploying previews
against their PR's branch is #139.

## Migrations

Schema changes reach every database as committed, reviewed [Drizzle](https://orm.drizzle.team/docs/migrations)
migrations in [`drizzle/`](../drizzle). Nothing pushes `schema.ts` to a shared database directly.

1. Edit [`src/lib/db/schema.ts`](../src/lib/db/schema.ts).
2. `just db-generate` writes the SQL to `drizzle/NNNN_<name>.sql`. Pass a name to make it readable:
   `pnpm db:generate --name=add_word_notes`.
3. Read the SQL. It's what production will run, so check it does what you meant, especially anything that
   drops, renames or adds a constraint (see below).
4. `just db-migrate` applies it to `development` (the `DATABASE_URL` in `.env.local`), so you can try it in the
   app.
5. Commit the SQL file and the `drizzle/meta/` changes with the code that needs them.

`just test` fails if `schema.ts` has changes that no migration covers, and shows the missing SQL. Until a PR
merges, its migrations can still change: `pnpm exec drizzle-kit drop` removes the latest one cleanly, then
`just db-reset-dev` and generate again. Once merged, a migration is history: never edit it, write a new one.
If another PR's migration merges first, the `drizzle/meta/_journal.json` conflict is the signal to drop yours,
rebase and regenerate.

**What runs where**

- **Every PR:** `migration-replay` runs the whole history on an empty Postgres 17, proving it builds the schema
  from nothing. `pr-branch` applies the PR's migrations to its own copy of `template` (see
  [Environments](#environments)): the step production will take on merge, against seed data built to catch
  constraints that existing rows break. PRs from forks skip `pr-branch`, since they get no secrets.
- **Merge to `main`:** the production build runs [`scripts/migrate-deploy.ts`](../scripts/migrate-deploy.ts)
  before `next build`, migrating `production` and then `template`. Drizzle applies the pending migrations in
  one transaction, so one that fails on production data rolls back and fails the build, and the previous
  deployment stays live. New code only goes live once its schema is in place.
- **Preview, local and CI builds** never migrate. The script only acts when Vercel sets
  `VERCEL_ENV=production`.

`drizzle/0000_baseline.sql` is the schema production had before migrations existed, when `db:push` managed it.
It was recorded as applied in `production` and `template` without being run there, so it only ever runs on
empty databases.

**Changes that existing rows or running code can break.** Migrations run while the old deployment is still
serving, and a Vercel rollback runs old code against the new schema. So:

- **Drop, rename or retype a column with expand–contract**, over separate PRs: add the new column and write
  to both; backfill and switch reads to the new one; then, once nothing uses the old one, drop it. #138 is a
  worked example.
- **Before adding a constraint over existing data** (`NOT NULL`, `CHECK`, a foreign key, a unique index), count
  the rows that would break it in production, from the Neon console's SQL editor, for example
  `SELECT count(*) FROM test_settings WHERE question_limit IS NULL;`. If any would, the migration must fix
  them first. `pr-branch` only tests against seed data, which can't know every state production has reached.

**Your local database** keeps whatever you applied to it. After closing a PR whose migration you applied with
`just db-migrate`, run `just db-reset-dev`, or `development` keeps a schema `main` doesn't have.

**`pnpm db:push`** writes `schema.ts` straight to a database without a migration, for quick experiments. It
looks up `development` by name with `neonctl`, ignoring `DATABASE_URL`, so it can't reach any other branch.
Run `just db-reset-dev` before generating the real migration, or it will fail on objects the push already
created.

**Configuration**

| Where                       | Name                    | Value                                                     |
| --------------------------- | ----------------------- | --------------------------------------------------------- |
| Vercel, Production (Secret) | `TEMPLATE_DATABASE_URL` | `template`'s connection string, for `migrate-deploy.ts`   |
| GitHub, Actions secret      | `NEON_API_KEY`          | A Neon API key, for creating and deleting `pr-*` branches |
| GitHub, Actions variable    | `NEON_PROJECT_ID`       | The Neon project ID                                       |

## Dependencies

pnpm's settings live in [`pnpm-workspace.yaml`](../pnpm-workspace.yaml).

- **Declare every package you import.** pnpm only exposes a project's declared dependencies, so an import that
  resolved by accident under npm's flat `node_modules` fails here. Add it with `pnpm add`.
- **Install scripts are blocked by default.** When a new dependency has one, `pnpm install` fails with
  `ERR_PNPM_IGNORED_BUILDS` and adds a placeholder under `allowBuilds`. Read the script, then set it to `true`
  only if the package doesn't work without it. Most native tools ship prebuilt binaries as optional
  dependencies and work with the script denied.
- **New versions wait 3 days.** `minimumReleaseAge` stops pnpm installing anything published in the last
  three days, as a buffer against compromised releases. For an urgent fix, list the package under
  `minimumReleaseAgeExclude` and remove it again once the version is old enough.

Line endings are LF on every OS (`.gitattributes`), matching Prettier.

## Pull requests

`main` only changes through pull requests, which are squash-merged: the PR title and description become the
commit.

1. Branch from `main`, run `just ci` to catch failures before CI does, then push.
2. Open a PR. The [CI workflow](../.github/workflows/ci.yaml) runs `just ci` on the same pinned Node and pnpm
   versions and tests the PR's migrations (see [Migrations](#migrations)), and Vercel builds a preview
   deployment.
3. Merge once the `ci`, `migration-replay` and `pr-branch` checks pass. The "Require CI" ruleset blocks the
   merge button until they do. For a failure that isn't the PR's fault, such as an outage, a repository admin
   can tick "bypass rules" on the PR. That records the override on the PR rather than skipping the check
   silently.
4. Delete the local branch with `git branch -D`: squashed commits aren't ancestors of `main`, so `-d` refuses.
   If you applied its migration locally, run `just db-reset-dev`.

CI builds without secrets, using well-formed placeholders for every validated variable (the workflow explains
why that's enough). If the build starts needing a real value, look for something that now runs at build time,
such as a page that became static.

## Deployment

Vercel builds every push: pull requests get a preview deployment, and `main` deploys to production. The
production build migrates `production` and `template` before building, so a deploy log starts with
`Migrating production…`, or `Skipping migrations` in a preview (see [Migrations](#migrations)).

- **Node** comes from `engines.node` in `package.json`, which overrides the Vercel project setting.
- **pnpm** comes from `packageManager`. Vercel only detects pnpm 10 and older by itself, so the project sets
  `ENABLE_EXPERIMENTAL_COREPACK=1` so that Corepack installs the pinned version. Remove it once
  [vercel/vercel#17434](https://github.com/vercel/vercel/issues/17434) is fixed. Node 24 is the last Node line
  that bundles Corepack, so revisit this before moving to a newer Node.
