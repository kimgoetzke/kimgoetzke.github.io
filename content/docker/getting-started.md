---
title: Getting started
draft: false
date: 2023-03-14
series: [ "Docker" ]
tags: [Docker, Linux, Windows]
toc: true
---
## Install Docker
{{< tabs "groupid-1" >}}
{{< tab "Windows" >}} 

### Windows

- Download `Docker for Windows` from www.docker.com
- Check the system requirements for Docker: [Install on Windows | Docker Documentation](https://docs.docker.com/desktop/install/windows-install/)
- Check that WSL is installed: [Install WSL | Microsoft Learn](https://learn.microsoft.com/en-gb/windows/wsl/install)
- Install a Linux distribution (distro), required only if WSL is already installed but no distro
	- Using Microsoft Store: [Set up a WSL development environment | Microsoft Learn](https://learn.microsoft.com/en-gb/windows/wsl/setup/environment#set-up-your-linux-username-and-password)
	- Using Ubuntu documentation: [Install Ubuntu on WSL2 and get started with graphical applications | Ubuntu](https://ubuntu.com/tutorials/install-ubuntu-on-wsl2-on-windows-11-with-gui-support#4-configure-ubuntu)
	- You may need to download and install the Linux kernel update package: [Manual installation steps for older versions of WSL | Microsoft Learn](https://learn.microsoft.com/en-gb/windows/wsl/install-manual#step-4---download-the-linux-kernel-update-package)
- Install Docker with `Use WSL 2 instead of Hyper-V` selected

_Optional:_
- Set up Docker with IntelliJ by downloading Docker plugin (which should configure everything automatically): [Docker in IntelliJ IDEA - YouTube](https://www.youtube.com/watch?v=ck6xQqSOlpw&t=49s)
- Install VS Code extension for Docker (VS Code will prompt you automatically as it detects the Docker installation)

{{< /tab >}}
{{< tab "Linux" >}}

### Linux

> The below is for Debian based distributions such as Ubuntu.

 - Simply follow the instructions on the Docker website: [Install Docker Desktop on Ubuntu | Docker Documentation](https://docs.docker.com/desktop/install/ubuntu/)

_Optional:_
- Set up Docker with IntelliJ by downloading Docker plugin (which should configure everything automatically): [Docker in IntelliJ IDEA - YouTube](https://www.youtube.com/watch?v=ck6xQqSOlpw&t=49s)
- Install VS Code extension for Docker (VS Code will prompt you automatically as it detects the Docker installation)

{{< /tab >}}
{{< /tabs >}}
