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
```powershell
wsl --list --online
```

### List of installed Linux distributions

```powershell
wsl --list --verbose
```

### Update WSL
```powershell
wsl --update
```

## Troubleshooting

## Slow network or unable to fetch updates

If you 1) get errors such as `Failed to fetch http://archive.ubuntu.com/ubuntu/dists/jammy/InRelease  Temporary failure resolving 'archive.ubuntu.com'` and/or 2) the network speed when installing updates seems incredibly slow, and/or 3) you cannot install basic apps such as `ranger` because of an `Unable to locate package` error, then it's likely a DNS issue. You can resolve it by:

1. Opening /etc/resolv.conf
```shell
sudo nano /etc/resolv.conf   
```

2. Changing the nameserver
```shell
nameserver 1.1.1.1 # Cloudflare
```
