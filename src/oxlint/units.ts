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

// Type-info-free baseline for all JavaScript/TypeScript code: ESLint core plus
// the import / jsdoc / oxc / promise / unicorn plugins, tuned toward
// clippy-level coverage (correctness denied, suspicious / perf warned).
// Opinion-splitting style rules (sorting etc.) live in `sorting` instead.
export const javascript = (overrides: OxlintConfig = {}): OxlintConfig =>
  mergeConfigs([
    {
      categories: { correctness: "error", perf: "warn", suspicious: "warn" },
      env: { es2024: true },
      plugins: ["eslint", "import", "jsdoc", "oxc", "promise", "unicorn"],
      rules: {
        ...pickByPlugin("eslint"),
        ...pickByPlugin("import"),
        ...pickByPlugin("jsdoc"),
        ...pickByPlugin("promise"),
        ...pickByPlugin("unicorn"),

        curly: "error",
        "default-case-last": "error",
        eqeqeq: ["error", "smart"],
        "func-style": ["error", "expression"],
        "import/consistent-type-specifier-style": ["error", "prefer-top-level"],
        "import/exports-last": "error",
        "import/first": "error",
        "import/no-cycle": "error",
        "import/no-mutable-exports": "error",
        "import/no-named-default": "error",
        "import/no-self-import": "error",

        // jsdoc: sanity checks only. The recommended `require-*` rules
        // (presence of params/returns and their types/descriptions) duplicate
        // what TypeScript already expresses and mostly produce noise.
        "jsdoc/require-param": "off",
        "jsdoc/require-param-description": "off",
        "jsdoc/require-param-type": "off",
        "jsdoc/require-property": "off",
        "jsdoc/require-property-description": "off",
        "jsdoc/require-property-type": "off",
        "jsdoc/require-returns": "off",
        "jsdoc/require-returns-description": "off",
        "jsdoc/require-returns-type": "off",
        "jsdoc/require-throws-type": "off",
        "jsdoc/require-yields": "off",
        "jsdoc/require-yields-type": "off",

        "no-else-return": ["error", { allowElseIf: false }],
        "no-multi-assign": "error",
        "no-new": "error",
        "no-new-wrappers": "error",
        "no-object-constructor": "error",
        "no-param-reassign": "error",
        "no-return-assign": ["error", "always"],
        "no-self-compare": "error",
        "no-sequences": ["error", { allowInParentheses: false }],
        // From the suspicious category, but flags legitimate identifiers like
        // a recreated `__dirname`.
        "no-underscore-dangle": "off",
        "no-unmodified-loop-condition": "error",
        "no-unneeded-ternary": "error",
        "no-unused-vars": [
          "error",
          {
            argsIgnorePattern: "^_",
            caughtErrorsIgnorePattern: "^_",
            destructuredArrayIgnorePattern: "^_",
            varsIgnorePattern: "^_",
          },
        ],
        "no-useless-concat": "error",
        "no-useless-return": "error",
        "object-shorthand": "error",
        "prefer-const": ["error", { destructuring: "all" }],
        "prefer-destructuring": ["error", { VariableDeclarator: { array: false, object: true } }],
        "prefer-object-spread": "error",
        yoda: ["error", "never", { exceptRange: true }],

        // unicorn: recommended minus the rules whose noise outweighs their
        // benefit (blanket bans and forced rewrites of perfectly fine code).
        // Negated conditions are covered by unicorn/no-negated-condition (an
        // auto-fixable superset of the core rule, which stays off).
        "unicorn/no-array-callback-reference": "off",
        "unicorn/no-array-for-each": "off",
        "unicorn/no-array-reduce": "off",
        "unicorn/no-null": "off",
        "unicorn/no-useless-undefined": "off",
        "unicorn/prefer-string-raw": "off",
        "unicorn/prefer-ternary": "off",
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
        // From the suspicious category, but flags every narrowing `as`
        // assertion; far too noisy for its benefit.
        "typescript/no-unsafe-type-assertion": "off",
        "typescript/prefer-nullish-coalescing": "error",
        "typescript/strict-boolean-expressions": "error",
        // Rust-match-like semantics: switches over unions must list every
        // member (a default never counts as exhaustive), and switches over
        // non-unions must have a default. A default on an exhaustive switch
        // stays allowed so the `default: x satisfies never` runtime-guard
        // pattern (Rust's `unreachable!()` arm) keeps working.
        "typescript/switch-exhaustiveness-check": [
          "error",
          {
            allowDefaultCaseForExhaustiveSwitch: true,
            considerDefaultExhaustiveForUnions: false,
            requireDefaultForNonUnion: true,
          },
        ],
      },
    },
    overrides,
  ]);

export type ReactOptions = {
  // Set true when the project is built with React Compiler: the compiler
  // memoizes automatically, so the manual-memoization hygiene rules
  // (react-perf) become redundant and are dropped.
  compiler?: boolean;
};

// react plugin (includes the react-hooks rules and, via eslint-plugin-react-
// hooks v7 recommended, the React Compiler powered rules). Without React
// Compiler, the react-perf rules are enabled on top.
export const react = (options: ReactOptions = {}, overrides: OxlintConfig = {}): OxlintConfig => {
  const { compiler = false } = options;
  return mergeConfigs([
    {
      plugins: compiler ? ["react"] : ["react", "react-perf"],
      rules: {
        ...pickByPlugin("react"),
        ...(compiler ? {} : pickByPlugin("react-perf")),

        "react/button-has-type": "error",
        "react/jsx-curly-brace-presence": "error",
        // Every modern browser implies rel="noopener" on target="_blank", so
        // the recommended-set error is dropped.
        "react/jsx-no-target-blank": "off",
        "react/jsx-no-useless-fragment": "error",
      },
    },
    overrides,
  ]);
};

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
