---
title: Terminal
draft: false
date: 2023-03-17
series: [ "Powershell" ]
tags: [ "Windows", "Terminal", "PowerShell", "Starters" ]
toc: true
---

## Remember

- [Windows Terminal documentation](https://learn.microsoft.com/en-us/windows/terminal/install)
- Use `CTRL` + `Space` to show "MenuComplete" i.e. available options based on the input provided so far
- Use `Arrow key (right)` for basic auto-complete
- Set up advanced auto-complete -
  see [this article](https://techcommunity.microsoft.com/t5/itops-talk-blog/autocomplete-in-powershell/ba-p/2604524)
- Toggle command history with `F2`

## Customise Windows Terminal default layout

1. Create a desktop shortcut
2. Set the target as `C:\Users\[Username]\AppData\Local\Microsoft\WindowsApps\wt.exe`
3. Append any customisations to the above target, e.g. ` -p "PowerShell 7 (x86)" ; split-pane -H -p "Ubuntu"` to open
   with two horizontal panes with Powershell and Bash
4. Add a keyboard shortcut and/or select `Open as Administrator` if you want

## Autostart Windows Terminal with Powershell in quake mode

1. Hit `Win` + `R` and type `shell:startup` to open the `Startup` folder
2. Create a shortcut with the target
   `"C:\Program Files\PowerShell\7\pwsh.exe" -WorkingDirectory ~ -Command wt -w _quake pwsh -window minimized`

## Starter settings

```json
{
  "$help": "https://aka.ms/terminal-documentation",
  "$schema": "https://aka.ms/terminal-profiles-schema",
  "actions": [
    {
      "command": {
        "action": "newTab",
        "index": 0
      },
      "id": "User.newTab.7975BEED"
    },
    {
      "command": {
        "action": "newTab",
        "index": 1
      },
      "id": "User.newTab.1FA5EB5"
    },
    {
      "command": {
        "action": "newTab",
        "index": 2
      },
      "id": "User.newTab.CCE909E3"
    }
  ],
  "copyFormatting": "none",
  "copyOnSelect": false,
  "defaultProfile": "{574e775e-4f2a-5b96-ac1e-a2962a402336}",
  "keybindings": [
    {
      "id": "Terminal.CopyToClipboard",
      "keys": "ctrl+c"
    },
    {
      "id": "Terminal.SwitchToTab0",
      "keys": "ctrl+shift+1"
    },
    {
      "id": "Terminal.FindText",
      "keys": "ctrl+shift+f"
    },
    {
      "id": "Terminal.PasteFromClipboard",
      "keys": "ctrl+v"
    },
    {
      "id": "Terminal.DuplicatePaneAuto",
      "keys": "alt+shift+d"
    },
    {
      "id": "Terminal.SwitchToTab2",
      "keys": "ctrl+shift+3"
    },
    {
      "id": "Terminal.SwitchToTab4",
      "keys": "ctrl+shift+5"
    },
    {
      "id": "Terminal.SwitchToTab1",
      "keys": "ctrl+shift+2"
    },
    {
      "id": "User.newTab.7975BEED",
      "keys": "ctrl+alt+1"
    },
    {
      "id": "User.newTab.1FA5EB5",
      "keys": "ctrl+alt+2"
    },
    {
      "id": "User.newTab.CCE909E3",
      "keys": "ctrl+alt+3"
    },
    {
      "id": null,
      "keys": "ctrl+alt+4"
    },
    {
      "id": null,
      "keys": "ctrl+alt+5"
    },
    {
      "id": null,
      "keys": "ctrl+alt+6"
    },
    {
      "id": null,
      "keys": "ctrl+alt+7"
    },
    {
      "id": null,
      "keys": "ctrl+alt+8"
    },
    {
      "id": null,
      "keys": "ctrl+alt+9"
    },
    {
      "id": "User.newTab.89E6CA61",
      "keys": "ctrl+alt+shift+n"
    },
    {
      "id": "Terminal.SwitchToTab3",
      "keys": "ctrl+shift+4"
    },
    {
      "id": "Terminal.SwitchToTab5",
      "keys": "ctrl+shift+6"
    },
    {
      "id": "Terminal.SwitchToTab6",
      "keys": "ctrl+shift+7"
    },
    {
      "id": "Terminal.SwitchToTab7",
      "keys": "ctrl+shift+8"
    },
    {
      "id": "Terminal.SwitchToLastTab",
      "keys": "ctrl+shift+9"
    }
  ],
  "newTabMenu": [
    {
      "type": "remainingProfiles"
    }
  ],
  "profiles": {
    "defaults": {
      "background": "#242933",
      "colorScheme": "Nord",
      "font": {
        "face": "JetBrainsMono Nerd Font"
      },
      "opacity": 95
    },
    "list": [
      {
        "commandline": "%SystemRoot%\\System32\\cmd.exe",
        "guid": "{0caa0dad-35be-5f56-a8ff-afceeeaa6101}",
        "hidden": false,
        "name": "Command Prompt"
      },
      {
        "guid": "{574e775e-4f2a-5b96-ac1e-a2962a402336}",
        "hidden": false,
        "name": "PowerShell",
        "source": "Windows.Terminal.PowershellCore"
      },
      {
        "colorScheme": "Campbell",
        "commandline": "\"C:\\Program Files\\PowerShell\\7\\pwsh.exe\"",
        "elevate": true,
        "guid": "{1ebf8aa5-8caa-4263-b752-b3fb715e60c2}",
        "hidden": false,
        "icon": "ms-appx:///ProfileIcons/pwsh.png",
        "name": "PowerShell Administrator",
        "startingDirectory": "%USERPROFILE%"
      }
    ]
  },
  "schemes": [
    {
      "background": "#242933",
      "black": "#3B4252",
      "blue": "#81A1C1",
      "brightBlack": "#4C566A",
      "brightBlue": "#81A1C1",
      "brightCyan": "#8FBCBB",
      "brightGreen": "#A3BE8C",
      "brightPurple": "#B48EAD",
      "brightRed": "#BF616A",
      "brightWhite": "#ECEFF4",
      "brightYellow": "#EBCB8B",
      "cursorColor": "#81A1C1",
      "cyan": "#88C0D0",
      "foreground": "#D8DEE9",
      "green": "#A3BE8C",
      "name": "Nord",
      "purple": "#B48EAD",
      "red": "#BF616A",
      "selectionBackground": "#434C5E",
      "white": "#E5E9F0",
      "yellow": "#EBCB8B"
    }
  ],
  "themes": []
}

```