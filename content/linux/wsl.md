---
title: Windows Subsystem for Linux
draft: false
date: 2023-03-14
tags: [WSL, Linux, Windows]
---
## How to install
```powershell
wsl --install # This will install Ubuntu

wsl -l -v # List your installed Linux distributions and check the version of WSL each is set to
```

{{< hint info >}}
If you don't want to install Ubuntu visit https://learn.microsoft.com/en-us/windows/wsl/install to learn about other options.
{{< /hint >}}


## Useful resources
- Basic commands for WSL: [Basic commands for WSL | Microsoft Learn](https://learn.microsoft.com/en-us/windows/wsl/basic-commands#list-installed-linux-distributions)

## Useful commands
### List all available Linux distributions
```shell
wsl --list --online
```

### List of installed Linux distributions

```shell
wsl --list --verbose
```

### Update WSL
```shell
wsl --update
```
