{pkgs ? import <nixpkgs> {}}:
  pkgs.mkShell {
    name = "hugodev-env";
    nativeBuildInputs = with pkgs; [
      hugo
      git
    ];
    shellHook = ''
      echo "Welcome to your development environment for kimgoetzke.github.io!"
    '';
  }
