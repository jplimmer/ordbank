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
just install
```

Copy [`.env.example`](../.env.example) to `.env.local` and fill in the Neon connection string and Clerk keys.
`next dev` and `next build` read `.env.local`. drizzle-kit (the `db:*` scripts) currently reads only `.env`.

Then `just dev` and open <http://localhost:3000>.

## Commands

Run `just` to list the recipes. Each one runs a `package.json` script, so the scripts stay the single
definition of how a tool is invoked.

| Recipe              | Does                                                          |
| ------------------- | ------------------------------------------------------------- |
| `just install`      | Install dependencies exactly as locked                        |
| `just dev`          | Dev server (Turbopack)                                        |
| `just lint`         | ESLint                                                        |
| `just typecheck`    | `tsc --noEmit`                                                |
| `just format`       | Prettier, writing changes                                     |
| `just format-check` | Prettier, check only                                          |
| `just build`        | Production build                                              |
| `just ci`           | Everything CI checks: format-check, lint, typecheck and build |

A pre-commit hook (Husky + lint-staged) runs ESLint and Prettier on staged files.

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
2. Open a PR. The [CI workflow](../.github/workflows/ci.yml) runs `just ci` on the same pinned Node and pnpm
   versions, and Vercel builds a preview deployment.
3. Merge once the `ci` check passes. The "Require CI" ruleset blocks the merge button until it does. For a
   failure that isn't the PR's fault, such as an outage, a repository admin can tick "bypass rules" on the PR.
   That records the override on the PR rather than skipping the check silently.
4. Delete the local branch with `git branch -D`: squashed commits aren't ancestors of `main`, so `-d` refuses.

CI builds without production secrets, using a placeholder `DATABASE_URL` (the workflow explains why that's
enough). If the build starts needing a real value, look for something that now runs at build time, such as a
page that became static.

## Deployment

Vercel builds every push: pull requests get a preview deployment, and `main` deploys to production.

- **Node** comes from `engines.node` in `package.json`, which overrides the Vercel project setting.
- **pnpm** comes from `packageManager`. Vercel only detects pnpm 10 and older by itself, so the project sets
  `ENABLE_EXPERIMENTAL_COREPACK=1` so that Corepack installs the pinned version. Remove it once
  [vercel/vercel#17434](https://github.com/vercel/vercel/issues/17434) is fixed. Node 24 is the last Node line
  that bundles Corepack, so revisit this before moving to a newer Node.
