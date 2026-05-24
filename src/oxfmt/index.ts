import type { OxfmtConfig } from "oxfmt";

import { defineConfig } from "oxfmt";

export const asa1984 = (overrides: OxfmtConfig = {}): OxfmtConfig =>
  defineConfig({
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
