import {
  defineConfig,
  imports,
  javascript,
  jsdoc,
  node,
  oxc,
  promise,
  sorting,
  typescript,
  unicorn,
} from "./src/oxlint/index.ts";

export default defineConfig({
  extends: [
    javascript(),
    typescript(),
    imports(),
    unicorn(),
    jsdoc(),
    promise(),
    oxc(),
    sorting(),
    node(),
  ],
  ignorePatterns: ["src/oxlint/*.generated.ts"],
});
