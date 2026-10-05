# Ordbank

Next.js (App Router) vocabulary-learning PWA: Neon Postgres via Drizzle, Clerk auth, shadcn/ui.

## Commands

Use the `just` recipes, which wrap the `package.json` scripts:

- `just ci` — the full check (format-check, lint, typecheck, build). Run it before calling work done.
- `just lint`, `just typecheck`, `just format`, `just build` — individual steps.

Use **pnpm** for every package operation (`pnpm add`, `pnpm exec`). The lockfile is `pnpm-lock.yaml`.

## Environment

- Node 24, pinned in `.nvmrc`. `node -v` should report v24 in this repo; if it doesn't, stop and ask rather
  than changing the pin.
- Local secrets live in `.env.local`.

## Further reading

[`docs/development.md`](docs/development.md) covers setup, the pull request flow, adding dependencies
(build-script approval, release-age delay) and deployment.
