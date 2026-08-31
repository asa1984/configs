// eslint-plugin-react-perf ships no type declarations.
declare module "eslint-plugin-react-perf" {
  const plugin: {
    configs: Record<string, { rules: Record<string, unknown> }>;
  };
  export default plugin;
}
