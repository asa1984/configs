# @asa1984/configs

Shared configs for Oxlint, Oxfmt, and TypeScript — usable in the style of `antfu/eslint-config`.

## Usage

```ts
// oxlint.config.ts
import { asa1984 } from "@asa1984/configs/oxlint";

export default asa1984();
```

```ts
// oxfmt.config.ts
import { asa1984 } from "@asa1984/configs/oxfmt";

export default asa1984();
```

```jsonc
// tsconfig.json
{
  "extends": "@asa1984/configs/tsconfig",
}
```

Each factory accepts a single `overrides` argument that is shallow-merged on top of the defaults; the oxlint factory additionally merges `categories`, `options`, `plugins`, and `rules` field-by-field.

## Commands

```
pnpm build
pnpm format
pnpm lint
pnpm typecheck
```
