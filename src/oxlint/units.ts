import type { OxlintConfig, Rules } from "./types.js";

import { mergeConfigs } from "./merge.ts";
import { recommended } from "./recommended.generated.ts";

// Slice the generated recommended set down to a single plugin namespace.
const pickByPlugin = (plugin: string): Rules => {
  const out: Record<string, unknown> = {};
  for (const [name, value] of Object.entries(recommended)) {
    const matched = plugin === "eslint" ? !name.includes("/") : name.startsWith(`${plugin}/`);
    if (matched) {
      out[name] = value;
    }
  }
  return out as Rules;
};

// ESLint core rules + the project-wide baseline (correctness category, es2024).
export const javascript = (overrides: OxlintConfig = {}): OxlintConfig =>
  mergeConfigs([
    {
      categories: { correctness: "error" },
      env: { es2024: true },
      plugins: ["eslint"],
      rules: {
        ...pickByPlugin("eslint"),
        curly: "error",
        eqeqeq: ["error", "smart"],
        "func-style": ["error", "expression"],
        "prefer-const": ["error", { destructuring: "all" }],
        "prefer-destructuring": ["error", { VariableDeclarator: { array: false, object: true } }],
      },
    },
    overrides,
  ]);

// TypeScript plugin + type-aware rules.
export const typescript = (overrides: OxlintConfig = {}): OxlintConfig =>
  mergeConfigs([
    {
      options: { typeAware: true },
      plugins: ["typescript"],
      rules: {
        ...pickByPlugin("typescript"),
        "typescript/consistent-type-imports": [
          "error",
          { fixStyle: "separate-type-imports", prefer: "type-imports" },
        ],
        "typescript/strict-boolean-expressions": "error",
      },
    },
    overrides,
  ]);

// import plugin (`import` is a reserved word, hence `imports`).
export const imports = (overrides: OxlintConfig = {}): OxlintConfig =>
  mergeConfigs([
    {
      plugins: ["import"],
      rules: {
        ...pickByPlugin("import"),
        "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
        "import/exports-last": "error",
        "import/first": "error",
        "import/no-cycle": "error",
        "import/no-self-import": "error",
      },
    },
    overrides,
  ]);

// unicorn plugin.
export const unicorn = (overrides: OxlintConfig = {}): OxlintConfig =>
  mergeConfigs([{ plugins: ["unicorn"], rules: pickByPlugin("unicorn") }, overrides]);

// jsdoc plugin.
export const jsdoc = (overrides: OxlintConfig = {}): OxlintConfig =>
  mergeConfigs([{ plugins: ["jsdoc"], rules: pickByPlugin("jsdoc") }, overrides]);

// promise plugin.
export const promise = (overrides: OxlintConfig = {}): OxlintConfig =>
  mergeConfigs([{ plugins: ["promise"], rules: pickByPlugin("promise") }, overrides]);

// oxc plugin (no recommended rules; relies on the `correctness` category).
export const oxc = (overrides: OxlintConfig = {}): OxlintConfig =>
  mergeConfigs([{ plugins: ["oxc"], rules: pickByPlugin("oxc") }, overrides]);

// vitest plugin.
export const vitest = (overrides: OxlintConfig = {}): OxlintConfig =>
  mergeConfigs([{ plugins: ["vitest"], rules: pickByPlugin("vitest") }, overrides]);

// Opinionated sorting / consistency rules.
export const sorting = (overrides: OxlintConfig = {}): OxlintConfig =>
  mergeConfigs([
    {
      plugins: ["eslint"],
      rules: {
        "sort-imports": ["error", { ignoreCase: true, ignoreDeclarationSort: true }],
        "sort-keys": [
          "error",
          "asc",
          { allowLineSeparatedGroups: true, caseSensitive: false, natural: true },
        ],
      },
    },
    overrides,
  ]);

// Node.js globals.
export const node = (overrides: OxlintConfig = {}): OxlintConfig =>
  mergeConfigs([{ env: { node: true } }, overrides]);

// Browser globals.
export const browser = (overrides: OxlintConfig = {}): OxlintConfig =>
  mergeConfigs([{ env: { browser: true } }, overrides]);

// Web Worker globals.
export const worker = (overrides: OxlintConfig = {}): OxlintConfig =>
  mergeConfigs([{ env: { worker: true } }, overrides]);
