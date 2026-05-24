---
name: release
description: Cut a new release of @asa1984/configs to npm and JSR via a GitHub Release.
---

# Release `@asa1984/configs`

Publishing to npm and JSR is triggered by a GitHub Release. The repo is wired up via `.github/workflows/release.yml`, which validates versions and publishes to both registries (npm with provenance, JSR via GitHub OIDC).

## Steps

1. Decide the next version `X.Y.Z` (semver).
2. Bump the version in **both** files so they match:
   - `package.json` — `"version"`
   - `jsr.json` — `"version"`
3. Commit and push to `main`:
   ```sh
   git commit -am "release: vX.Y.Z"
   git push
   ```
4. Create a GitHub Release with tag `vX.Y.Z` (must match the bumped versions).
   ```sh
   gh release create vX.Y.Z --generate-notes
   ```
5. The `Release` workflow runs automatically and:
   - verifies tag ↔ `package.json` ↔ `jsr.json` versions all match,
   - runs `pnpm build`, `pnpm typecheck`, `pnpm lint`,
   - publishes to npm,
   - publishes to JSR.

If the workflow fails on the version check, fix the mismatched file, push, delete the release + tag, and recreate the release.

## One-time setup

- **npm**: create an automation token at https://www.npmjs.com/settings/<user>/tokens and add it to the GitHub repo as the `NPM_TOKEN` secret.
- **JSR**: create the `@asa1984/configs` package on https://jsr.io and link this GitHub repository so OIDC publish is authorized.

## Verifying locally before release

```sh
pnpm build && pnpm typecheck && pnpm lint
pnpm pack --pack-destination /tmp        # inspect the npm tarball contents
pnpm dlx jsr publish --dry-run --allow-dirty  # JSR slow-types + manifest check
```
