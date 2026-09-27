# Ordbank

Next.js (App Router) vocabulary-learning PWA: Neon Postgres via Drizzle, Clerk auth, shadcn/ui.

## Commands

Use the `just` recipes, which wrap the `package.json` scripts:

- `just ci` — the full check (format-check, lint, typecheck, build). Run it before calling work done.
- `just lint`, `just typecheck`, `just format`, `just build` — individual steps.

Use **pnpm** for every package operation (`pnpm add`, `pnpm exec`). The lockfile is `pnpm-lock.yaml`.

## Environment

- Node 24, pinned in `.nvmrc` and managed by fnm. If `node -v` isn't v24, run
  `eval "$(fnm env --shell bash)" && fnm use` in that shell first.
- Local secrets live in `.env.local`.

## Further reading

[`docs/development.md`](docs/development.md) covers setup, adding dependencies (build-script approval,
release-age delay) and deployment.
