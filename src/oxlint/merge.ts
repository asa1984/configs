import type { OxlintConfig, Plugin } from "./types.js";

const mergeTwo = (a: OxlintConfig, b: OxlintConfig): OxlintConfig => {
  // Scalar / unknown fields: later wins.
  const out: Record<string, unknown> = { ...a, ...b };

  // plugins / ignorePatterns / overrides / extends / jsPlugins accumulate.
  const plugins = [...(a.plugins ?? []), ...(b.plugins ?? [])];
  if (plugins.length > 0) {
    out["plugins"] = [...new Set<Plugin>(plugins)];
  }
  const ignorePatterns = [...(a.ignorePatterns ?? []), ...(b.ignorePatterns ?? [])];
  if (ignorePatterns.length > 0) {
    out["ignorePatterns"] = [...new Set(ignorePatterns)];
  }
  const overrides = [...(a.overrides ?? []), ...(b.overrides ?? [])];
  if (overrides.length > 0) {
    out["overrides"] = overrides;
  }
  const extendsList = [...(a.extends ?? []), ...(b.extends ?? [])];
  if (extendsList.length > 0) {
    out["extends"] = extendsList;
  }
  const jsPlugins = [...(a.jsPlugins ?? []), ...(b.jsPlugins ?? [])];
  if (jsPlugins.length > 0) {
    out["jsPlugins"] = jsPlugins;
  }

  // env / globals / categories / options / settings / rules: shallow-merged.
  if (a.env || b.env) {
    out["env"] = { ...a.env, ...b.env };
  }
  if (a.globals || b.globals) {
    out["globals"] = { ...a.globals, ...b.globals };
  }
  if (a.categories || b.categories) {
    out["categories"] = { ...a.categories, ...b.categories };
  }
  if (a.options || b.options) {
    out["options"] = { ...a.options, ...b.options };
  }
  if (a.settings || b.settings) {
    out["settings"] = { ...a.settings, ...b.settings };
  }
  if (a.rules || b.rules) {
    out["rules"] = { ...a.rules, ...b.rules };
  }

  return out;
};

// Merge oxlint config fragments left-to-right. Scalar fields and rules let the
// later fragment win; plugins, ignorePatterns, overrides, extends and jsPlugins
// accumulate.
export const mergeConfigs = (configs: OxlintConfig[]): OxlintConfig => {
  let result: OxlintConfig = {};
  for (const config of configs) {
    result = mergeTwo(result, config);
  }
  return result;
};
