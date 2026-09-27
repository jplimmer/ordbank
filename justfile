# Task runner: every recipe delegates to a package.json script, so Vercel, editors and CI all run the
# same commands. Recipes use just's default `sh` shell so they behave the same on Windows and Linux. On
# Windows, `sh` comes from Git for Windows, whose `usr\bin` must be on PATH (see docs/development.md).

set default-list

[doc("Install dependencies exactly as locked")]
install:
    pnpm install --frozen-lockfile

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

[doc("Production build")]
build:
    pnpm build

[doc("Everything CI checks, cheapest first")]
ci: format-check lint typecheck build
