---
name: release
description: Cut a new release of @asa1984/configs to npm and JSR via release-please.
---

# Release `@asa1984/configs`

Releases are automated with [release-please](https://github.com/googleapis/release-please). Versioning, the `CHANGELOG.md`, the git tag, and the GitHub Release are all derived from [Conventional Commits](https://www.conventionalcommits.org/) merged into `main` — there is **no manual version bump**.

## How it works

1. Merge commits to `main` using Conventional Commit messages (`feat:`, `fix:`, `feat!:` / `BREAKING CHANGE:` …).
2. The `release` workflow (`.github/workflows/release.yaml`) runs release-please, which opens/updates a **Release PR** that:
   - bumps `package.json` **and** `jsr.json` versions in lockstep (via `extra-files` jsonpath),
   - regenerates `CHANGELOG.md`.
3. **Merge the Release PR** when you want to ship. release-please then creates the git tag `vX.Y.Z` and the GitHub Release.
4. The same workflow detects `release_created` and publishes:
   - to **npm** (`pnpm publish`, provenance via OIDC),
   - to **JSR** (`pnpm jsr publish`, OIDC).

So the only manual action per release is **merging the Release PR**. The version number is chosen automatically from commit history.

## Commit message → version bump

- `fix:` → patch (`0.1.1` → `0.1.2`)
- `feat:` → minor (`0.1.1` → `0.2.0`)
- `feat!:`, `fix!:`, or a `BREAKING CHANGE:` footer → major (`0.1.1` → `1.0.0`)
- `chore:`, `docs:`, `refactor:`, `test:`, `ci:` → no release entry (still appear in history)

## Config files

- `release-please-config.json` — release type (`node`) and the `jsr.json` version sync.
- `.release-please-manifest.json` — the current released version (release-please updates this; do not edit by hand).

## One-time setup

- **npm**: configure a [trusted publisher](https://docs.npmjs.com/trusted-publishers) for `@asa1984/configs` pointing at this repo's `release` workflow (publish uses OIDC, no `NPM_TOKEN` needed).
- **JSR**: create the `@asa1984/configs` package on https://jsr.io and link this GitHub repository so OIDC publish is authorized.
- **GitHub**: in repo Settings → Actions → General, enable **"Allow GitHub Actions to create and approve pull requests"** so release-please can open the Release PR.

## Verifying locally before release

```sh
pnpm build && pnpm typecheck && pnpm lint
pnpm pack --pack-destination /tmp             # inspect the npm tarball contents
pnpm dlx jsr publish --dry-run --allow-dirty  # JSR slow-types + manifest check
```
