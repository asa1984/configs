---
targets: ["*"]
description: "Write GitHub Actions workflows normally, then pin action SHAs with pinact."
globs: [".github/workflows/**/*"]
---

# GitHub Actions workflows are pinned with pinact

This repo uses [`pinact`](https://github.com/suzuki-shunsuke/pinact) to pin action versions to commit SHAs. Workflow files under `.github/workflows/*.yaml` are **hand-written and edited directly** — pinact only rewrites the `uses:` lines in place to swap floating tags for SHAs with a trailing `# <tag>` comment.

## File layout

- `.github/workflows/*.yaml` — workflow files. Edit these directly.
- `.github/actions/*/action.yaml` — composite actions. Edit these directly.

There is no separate `src/` directory and no generated output — the files you read are the files that run.

## How to change a workflow

1. Edit the workflow (or composite action) file directly. When adding a new `uses:`, you can write it with a floating tag (`actions/checkout@v6`) — pinact will resolve it.
2. Pin the SHAs:
   ```sh
   pinact run
   ```
   `pinact` is provided by the dev shell (see `flake.nix`).
3. Commit the workflow change and the pinact-rewritten lines together.

## Other pinact commands

- `pinact run --check` — fail-fast verification that every `uses:` is pinned to a SHA (suitable for CI).
- `pinact run --update` — bump pinned SHAs to the latest matching tags.

If you spot a `uses:` line that still references a floating tag without a trailing SHA comment, run `pinact run` to fix it rather than editing the SHA by hand.
