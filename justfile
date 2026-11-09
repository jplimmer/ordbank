# Task runner: every recipe delegates to a package.json script, so Vercel, editors and CI all run the
# same commands. Recipes use just's default `sh` shell so they behave the same on Windows and Linux. On
# Windows, `sh` comes from Git for Windows, whose `usr\bin` must be on PATH (see docs/development.md).

set default-list

[doc("Install dependencies exactly as locked")]
install:
    pnpm install --frozen-lockfile

# Separate from install so later setup steps can join without changing the docs; the install also
# generates the husky hooks
[doc("Set up a fresh clone or worktree")]
setup: install

[doc("Start the dev server (Turbopack)")]
dev:
    pnpm dev

[doc("Run ESLint")]
lint:
    pnpm lint

[doc("Type-check without emitting")]
typecheck:
    pnpm typecheck

[doc("Format all files with Prettier")]
format:
    pnpm format

[doc("Check formatting without writing")]
format-check:
    pnpm format:check

[doc("Run the unit tests")]
test:
    pnpm test

[doc("Re-run the unit tests on every change")]
test-watch:
    pnpm test:watch

[doc("Production build")]
build:
    pnpm build

[doc("Everything CI checks, cheapest first")]
ci: format-check lint typecheck test build

[doc("Generate a migration from changes to schema.ts (e.g. --name=add_word_notes)")]
db-generate *args:
    pnpm db:generate {{ args }}

[doc("Delete the latest migration, before it merges")]
db-drop:
    pnpm db:drop

[doc("Apply pending migrations to the DATABASE_URL database (development, locally)")]
db-migrate:
    pnpm db:migrate

[doc("Seed the template Neon branch (never production)")]
db-seed:
    pnpm db:seed

[doc("Reset the development Neon branch to template, discarding its changes")]
db-reset-dev:
    pnpm db:reset-dev
