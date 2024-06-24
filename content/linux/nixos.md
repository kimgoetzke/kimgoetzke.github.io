---
title: NixOS
draft: false
date: 2024-06-24
tags: [ Linux, NixOS, Nix ]
---

## How to fetch files without Flakes

```nix
let
    source = pkgs.fetchurl {
      url = "https://somewebsite/somefile.png";
      sha256 = "{hash}";
    };
in
{
    home.file."somefile.png".source = source;
}
```

```nix
let
    source = pkgs.fetchurl {
      url = "https://somewebsite/somescript.sh";
      sha256 = "{hash}";
    };
in
pkgs.writeShellScriptBin "scriptname" ''
    cat ${source}
''
```

{{< hint info >}}
How do you get the hash? Use `pkgs.lib.fakeHash`, then build, then copy the hash from the build error message or
prefetch with `nix shell nixpkgs#nix-prefetch-scripts` and then `nix-prefetch-url https://somewebsite/somefile.png`.
{{< /hint >}}

## How to fetch Git repositories without Flakes

```nix
source = pkgs.fetchgit {
  url = "https://github.com/kimgoetzke/nixos-config";
  sha256 = "{hash}";
};
```

```nix
source = pkgs.fetchFromGitHub {
  owner = "kimgoetzke";
  repo = "nixos-config";
  rev = "main";
  hash = "{hash}";
};
```

You can use `pkgs.fetchFromGitLab` for GitLab repositories.

{{< hint info >}}
For convenience use `nix shell nixpkgs#nurl` with `nurl "https://your-repo-url"`. Then copy the output which is the
complete fetch expression with all attributes.
{{< /hint >}}

## How to fetch anything with Flakes

```nix
{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";

    somefile = {
      url = "https://somewebsite/somefile.png";
      flake = false; # Turns it into regular fetch but manages the SHA, etc. for you in the flake.lock file
    };
    
    somerepo = {
      url = "github:kimgoetzke/nixos-config/main"; # Branch or commit is optional
      flake = false; # Turns it into regular fetch but manages the SHA, etc. for you in the flake.lock file
    };
  };

  outputs = { ... }@inputs:
    let
      system = "x86_64-linux";
      pkgs = inputs.nixpkgs.legacyPackages.${system};
    in
    {
      packages.${system}.default = pkgs.writeShellScriptBin "scriptname" ''
        echo "${inputs.somefile}"
      '';
    };
}
```

{{< hint info >}}
When fetching archives, they may be unpacked automatically. You can avoid this by adding `file+` in front of the URL.
{{< /hint >}}