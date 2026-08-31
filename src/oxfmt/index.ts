import type { OxfmtConfig } from "oxfmt";

export const defineConfig = (overrides: OxfmtConfig = {}): OxfmtConfig => ({
  sortImports: {
    groups: [
      "type-import",
      ["value-builtin", "value-external"],
      "type-internal",
      "value-internal",
      ["type-parent", "type-sibling", "type-index"],
      ["value-parent", "value-sibling", "value-index"],
      "unknown",
    ],
  },
  sortPackageJson: {
    sortScripts: true,
  },
  ...overrides,
});
