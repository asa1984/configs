import { defineConfig, javascript, node, sorting, typescript } from "./src/oxlint/index.ts";

export default defineConfig({
  extends: [javascript(), typescript(), sorting(), node()],
  ignorePatterns: ["src/oxlint/*.generated.ts"],
});
