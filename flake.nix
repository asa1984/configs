{
  inputs = {
    flake-parts.url = "github:hercules-ci/flake-parts";
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
  };
  outputs =
    inputs:
    inputs.flake-parts.lib.mkFlake { inherit inputs; } {
      systems = [
        "aarch64-linux"
        "x86_64-linux"
        "aarch64-darwin"
      ];
      perSystem =
        { pkgs, ... }:
        let
          sharedPackages = with pkgs; [
            nodejs-slim
            corepack
            pinact
          ];
        in
        {
          devShells = {
            default = pkgs.mkShell {
              packages = sharedPackages;
            };
            ci = pkgs.mkShell {
              packages = sharedPackages;
            };
          };
          packages.ci = pkgs.buildEnv {
            name = "asa1984-configs-ci";
            paths = sharedPackages;
          };
        };
    };
}
