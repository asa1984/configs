import type { OxfmtConfig } from "oxfmt";

import { defineConfig as defineOxfmtConfig } from "oxfmt";

export const defineConfig = (overrides: OxfmtConfig = {}): OxfmtConfig =>
  defineOxfmtConfig({
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
