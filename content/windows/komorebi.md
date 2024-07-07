---
title: Komorebi
date: 2024-07-07
draft: false
tags: [ "Komorebi", "Windows", "Scripts" ]
toc: false
---

## Get started

Komorebi is a window tiling manager for Windows.

1. Install it with `choco install komorebi`.
2. Create a `komorebi.ahk` file with your desired keybindings (see section below).
3. Make sure to set `AutoHotkey.exe` as the default program to open `.ahk` files.
4. Hit `Win + R` and type `shell:startup` to open the `Startup` folder.
5. Create a shortcut of your `.ahk` file in the `Startup` folder to run it on startup.
6. Create a `komorebi.json` file with your desired configuration (see section below).
7. Open your PowerShell profile.
8. Set `$Env:KOMOREBI_CONFIG_HOME` to a directory of your choice e.g. `C:\Users\kbgoe\Documents\Komorebi`.
9. Add `komorebic-no-console.exe start --config "C:\Users\kbgoe\Documents\Komorebi\komorebi.json"` to your PowerShell
   profile to start Komorebi on startup. This is a workaround
   because `komorebic enable-autostart --config "C:\Users\kbgoe\Documents\Komorebi\komorebi.json"` doesn't work.

## Example AHK keybindings

```ahk
#Requires AutoHotkey v2.0.2
#SingleInstance Force

Komorebic(cmd) {
    RunWait(format("komorebic.exe {}", cmd), , "Hide")
}

; General
#+e::Run "komorebic stop"
;#+q::Komorebic("close") ; only use it if you don't already have a global hotkey
^#+F5::Komorebic("retile")

; Focus windows
#Left::Komorebic("focus left")
#Down::Komorebic("focus down")
#Up::Komorebic("focus up")
#Right::Komorebic("focus right")

; Move windows
#+Left::Komorebic("move left")
#+Down::Komorebic("move down")
#+Up::Komorebic("move up")
#+Right::Komorebic("move right")

; Stack windows
^#+Left::Komorebic("stack left")
^#+Down::Komorebic("stack down")
^#+Up::Komorebic("stack up")
^#+Right::Komorebic("stack right")
#;::Komorebic("unstack")
#PgDn::Komorebic("cycle-stack previous")
#PgUp::Komorebic("cycle-stack next")

; Resize
!#Left::Komorebic("resize-axis horizontal increase")
!#Right::Komorebic("resize-axis horizontal decrease")
!#Up::Komorebic("resize-axis vertical increase")
!#Down::Komorebic("resize-axis vertical decrease")

; Manipulate windows
#q::Komorebic("toggle-float")
#F11::Komorebic("toggle-monocle")

; Layouts
#x::Komorebic("flip-layout horizontal")
#y::Komorebic("flip-layout vertical")

; Workspaces
#1::Komorebic("focus-workspace 0")
#2::Komorebic("focus-workspace 1")
#3::Komorebic("focus-workspace 2")
#4::Komorebic("focus-workspace 3")
#5::Komorebic("focus-workspace 4")
#6::Komorebic("focus-workspace 5")

; Move windows across workspaces
#+1::Komorebic("move-to-workspace 0")
#+2::Komorebic("move-to-workspace 1")
#+3::Komorebic("move-to-workspace 2")
#+4::Komorebic("move-to-workspace 3")
#+5::Komorebic("move-to-workspace 4")
#+6::Komorebic("move-to-workspace 5")
```

## Example Komorebi config

```json
{
  "$schema": "https://raw.githubusercontent.com/LGUG2Z/komorebi/v0.1.25/schema.json",
  "app_specific_configuration_path": "$Env:KOMOREBI_CONFIG_HOME/applications.yaml",
  "window_hiding_behaviour": "Cloak",
  "cross_monitor_move_behaviour": "Insert",
  "default_workspace_padding": 10,
  "default_container_padding": 10,
  "transparency": true,
  "border": true,
  "border_style": "System",
  "border_width": 5,
  "border_offset": -1,
  "border_colours": {
    "single": "#88c0d0",
    "stack": "#a3be8c",
    "monocle": "#b48ead",
    "unfocused": "#434c5e"
  },
  "stackbar": {
    "height": 30,
    "mode": "OnStack",
    "label": "Title",
    "tabs": {
      "width": 300,
      "focused_text": "#88c0d0",
      "unfocused_text": "#434c5e",
      "background": "#2e3440"
    }
  },
  "display_index_preferences": {
    "0": "BNQ78D6-5&928a9a5&0&UID41219",
    "1": "GBT3200-5&928a9a5&0&UID41221"
  },
  "monitors": [
    {
      "workspaces": [
        {
          "name": "I",
          "layout": "Rows"
        },
        {
          "name": "II",
          "layout": "Rows"
        }
      ]
    },
    {
      "workspaces": [
        {
          "name": "I",
          "layout": "VerticalStack"
        },
        {
          "name": "II",
          "layout": "VerticalStack"
        },
        {
          "name": "III",
          "layout": "VerticalStack"
        }
      ]
    }
  ],
  "float_rules": [
    {
      "kind": "Exe",
      "id": "qemu-system-x86_64.exe",
      "matching_strategy": "Equals"
    },
    {
      "kind": "Title",
      "id": "Commit: ",
      "matching_strategy": "StartsWith"
    }
  ]
}
```