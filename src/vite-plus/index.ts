import type { OxfmtConfig } from "oxfmt";
import type { UserConfig } from "vite-plus";

import { defineConfig as defineVitePlusConfig } from "vite-plus";

import type { Config as LintConfig } from "../oxlint/types.js";

import { defineConfig as defineFmtConfig } from "../oxfmt/index.ts";
import { defineConfig as defineLintConfig } from "../oxlint/index.ts";

// Input for `defineConfig`: a vite-plus config whose `lint` block takes config
// fragments (builder results and/or raw configs) in `extends` to merge in
// first, and whose `fmt` block takes overrides on top of the shared oxfmt
// defaults. All other blocks pass through to vite-plus untouched.
export type Config = Omit<UserConfig, "fmt" | "lint"> & {
  fmt?: OxfmtConfig;
  lint?: LintConfig;
};

// Merge the `lint` / `fmt` blocks into plain oxlint / oxfmt configs, then hand
// everything off to vite-plus's own `defineConfig` (which injects its plugins).
export const defineConfig = (config: Config): UserConfig => {
  const { fmt: fmtConfig, lint: lintConfig, ...rest } = config;
  return defineVitePlusConfig({
    ...rest,
    ...(fmtConfig === undefined ? {} : { fmt: defineFmtConfig(fmtConfig) }),
    ...(lintConfig === undefined ? {} : { lint: defineLintConfig(lintConfig) }),
  });
};

export { defineConfig as fmt } from "../oxfmt/index.ts";
export { defineConfig as lint } from "../oxlint/index.ts";
export { mergeConfigs } from "../oxlint/merge.ts";
export type { ReactOptions } from "../oxlint/units.ts";
export {
  browser,
  javascript,
  node,
  react,
  sorting,
  typescript,
  vitest,
  worker,
} from "../oxlint/units.ts";
export type { OxlintConfig, Rules } from "../oxlint/types.js";
