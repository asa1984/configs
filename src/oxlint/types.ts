import type { OxlintConfig as BaseOxlintConfig } from "oxlint";

import type { RuleOptions } from "./rules.generated.js";

export type OxlintConfig = Omit<BaseOxlintConfig, "rules"> & {
  rules?: Partial<RuleOptions> & BaseOxlintConfig["rules"];
};

export type Rules = NonNullable<OxlintConfig["rules"]>;

export type Plugin = NonNullable<BaseOxlintConfig["plugins"]>[number];

// Input for `defineConfig`: a raw oxlint config whose `extends` holds the
// config fragments (builder results and/or raw configs) to merge in first,
// instead of oxlint's native config-path strings.
export type Config = Omit<OxlintConfig, "extends"> & {
  extends?: OxlintConfig[];
};
