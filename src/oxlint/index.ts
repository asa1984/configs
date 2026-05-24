import type { OxlintConfig } from "oxlint";

import { defineConfig } from "oxlint";

const stripMerged = (overrides: OxlintConfig): OxlintConfig => {
  const { categories: _c, options: _o, plugins: _p, rules: _r, ...rest } = overrides;
  return rest;
};

export const asa1984 = (overrides: OxlintConfig = {}): OxlintConfig =>
  defineConfig({
    categories: {
      correctness: "error",
      ...overrides.categories,
    },
    options: {
      typeAware: true,
      ...overrides.options,
    },
    plugins: Array.from(
      new Set([
        "eslint",
        "import",
        "jsdoc",
        "oxc",
        "promise",
        "typescript",
        "unicorn",
        "vitest",
        ...(overrides.plugins ?? []),
      ]),
    ),
    rules: {
      curly: "error",
      eqeqeq: ["error", "smart"],
      "func-style": ["error", "expression"],
      "prefer-const": ["error", { destructuring: "all" }],
      "prefer-destructuring": [
        "error",
        {
          VariableDeclarator: { array: false, object: true },
        },
      ],
      "sort-imports": [
        "error",
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
        },
      ],
      "sort-keys": [
        "error",
        "asc",
        {
          allowLineSeparatedGroups: true,
          caseSensitive: false,
          natural: true,
        },
      ],

      "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
      "import/exports-last": "error",
      "import/first": "error",

      ...overrides.rules,
    },
    ...stripMerged(overrides),
  });
