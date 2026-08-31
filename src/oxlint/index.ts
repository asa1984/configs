import type { Config, OxlintConfig } from "./types.js";

import { mergeConfigs } from "./merge.ts";

// Merge the fragments in `config.extends` (builders or raw configs), then let
// the config's own properties win, into a single oxlint config.
const defineConfig = (config: Config): OxlintConfig => {
  const { extends: extendsConfigs = [], ...rest } = config;
  return mergeConfigs([...extendsConfigs, rest]);
};

export type { Config, OxlintConfig, Rules } from "./types.js";
export { mergeConfigs } from "./merge.ts";
export type { ReactOptions } from "./units.ts";
export { browser, javascript, node, react, sorting, typescript, vitest, worker } from "./units.ts";
export { defineConfig };
