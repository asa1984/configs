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
  extends: [
    javascript(),
    typescript(),
    imports(),
    unicorn(),
    sorting(),
    node(),
  ],

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
import { asa1984 } from "@asa1984/configs/oxfmt";

export default asa1984();
```

### TypeScript

```json
// tsconfig.json
{
  "extends": "./src/tsconfig/base.json"
}
```
