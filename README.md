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
import { defineConfig, javascript, node, sorting, typescript } from "@asa1984/configs/oxlint";

export default defineConfig({
  extends: [javascript(), typescript(), sorting(), node()],

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

- **Plugins / rules**: `javascript`, `typescript`, `react`, `vitest`, `sorting`
- **Environments**: `node`, `browser`, `worker`

`javascript` is the type-info-free baseline for all JavaScript/TypeScript code: ESLint core plus the `import` / `jsdoc` / `oxc` / `promise` / `unicorn` plugins in one clippy-strength set (`correctness` denied, `suspicious` / `perf` warned). Opinion-splitting style rules such as sorting are kept out of it — opt in via `sorting`.

`react` takes an options object before the overrides fragment. With React Compiler, pass `compiler: true` to drop the manual-memoization hygiene rules (`react-perf`), which the compiler makes redundant:

```ts
react(); // react + react-hooks + react-perf
react({ compiler: true }); // react + react-hooks, no react-perf
react({ compiler: true }, { rules: { "react/exhaustive-deps": "off" } });
```

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
import { browser, defineConfig, javascript, sorting, typescript } from "@asa1984/configs/vite-plus";

export default defineConfig({
  lint: {
    extends: [javascript(), typescript(), sorting(), browser()],

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
