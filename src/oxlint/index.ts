import { defineConfig as defineOxlintConfig } from "oxlint";

import type { Config, OxlintConfig, Rules } from "./types.js";

import { mergeConfigs } from "./merge.ts";
import {
  browser,
  imports,
  javascript,
  jsdoc,
  node,
  oxc,
  promise,
  sorting,
  typescript,
  unicorn,
  vitest,
  worker,
} from "./units.ts";

// Merge the fragments in `config.extends` (builders or raw configs), then let
// the config's own properties win, into one validated oxlint config.
const defineConfig = (config: Config): OxlintConfig => {
  const { extends: extendsConfigs = [], ...rest } = config;
  return defineOxlintConfig(mergeConfigs([...extendsConfigs, rest]));
};

export type { Config, OxlintConfig, Rules };
export {
  browser,
  defineConfig,
  imports,
  javascript,
  jsdoc,
  mergeConfigs,
  node,
  oxc,
  promise,
  sorting,
  typescript,
  unicorn,
  vitest,
  worker,
};
