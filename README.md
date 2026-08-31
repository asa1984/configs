# @asa1984/configs

## Install

```
pnpm add -D @asa1984/configs
```

## Usage

### Oxlint

Each builder returns a plain oxlint config fragment carrying this project's recommended settings for one concern. List them in `extends` and `defineConfig` merges everything — together with any other config properties you set — into a single config.

```ts
// oxlint.config.ts
import {
  defineConfig,
  imports,
  javascript,
  node,
  sorting,
  typescript,
  unicorn,
} from "@asa1984/configs/oxlint";

export default defineConfig({
  extends: [javascript(), typescript(), imports(), unicorn(), sorting(), node()],

  // any other oxlint config property is merged on top of `extends`
  ignorePatterns: ["dist/**"],
  overrides: [
    {
      files: ["**/*.{test,spec}.ts"],
      rules: { "typescript/no-explicit-any": "off" },
    },
  ],
});
```

Because every builder takes and returns a raw `OxlintConfig`, you override its defaults by passing a fragment, which is merged on top:

```ts
typescript({ rules: { "typescript/strict-boolean-expressions": "off" } });
```

Available builders:

- **Plugins / rules**: `javascript`, `typescript`, `imports`, `unicorn`, `jsdoc`, `promise`, `oxc`, `vitest`, `sorting`
- **Environments**: `node`, `browser`, `worker`

Merge semantics: `defineConfig` merges the `extends` fragments via `mergeConfigs` (also exported), then lets the config's own properties win. Scalar fields and `rules` let the later fragment win; `plugins`, `ignorePatterns`, `overrides`, `extends`, and `jsPlugins` accumulate.

### Oxfmt

```ts
// oxfmt.config.ts
import { defineConfig } from "@asa1984/configs/oxfmt";

export default defineConfig();
```

### Vite+

[Vite+](https://viteplus.dev) projects keep lint/format configuration in the `lint` and `fmt` blocks of `vite.config.ts`. The dedicated entry point wraps vite-plus's `defineConfig` and applies the same fragment model to those blocks; every other block passes through untouched.

```ts
// vite.config.ts
import {
  browser,
  defineConfig,
  imports,
  javascript,
  sorting,
  typescript,
  unicorn,
} from "@asa1984/configs/vite-plus";

export default defineConfig({
  lint: {
    extends: [javascript(), typescript(), imports(), unicorn(), sorting(), browser()],

    // any other oxlint config property is merged on top of `extends`;
    // `typeCheck` enables the type-aware path for `vp lint` / `vp check`
    options: { typeCheck: true },
  },
  fmt: {}, // shared oxfmt defaults; pass overrides here, or omit the block entirely

  // any other vite-plus config property passes through
  test: {},
});
```

Only the object form of vite-plus's `defineConfig` is supported (not the function forms). The block factories `lint` and `fmt` are also exported, for use with vite-plus's own `defineConfig`:

```ts
// vite.config.ts
import { defineConfig } from "vite-plus";
import { fmt, javascript, lint, typescript } from "@asa1984/configs/vite-plus";

export default defineConfig({
  lint: lint({ extends: [javascript(), typescript()] }),
  fmt: fmt(),
});
```

### TypeScript

```json
// tsconfig.json
{
  "extends": "@asa1984/configs/tsconfig"
}
```
