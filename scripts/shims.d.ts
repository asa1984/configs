declare module "eslint-plugin-promise" {
  const plugin: {
    configs: Record<string, { rules?: Record<string, unknown> }>;
    rules: Record<string, unknown>;
  };
  export default plugin;
}
