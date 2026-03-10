---
title: Yazi
draft: false
date: 2026-03-10
series: [ "Other" ]
tags: [ "Yazi", "Windows", "Starters" ]
toc: true
---

## Basic starter configuration

Useful links:

- [Yazi documentation](https://yazi-rs.github.io/docs/installation)
- [Available Yazi plugins on GitHub](https://github.com/yazi-rs/plugins)

### Install required packages

I suggest using Glow for Markdown: [github.com/charmbracelet/glow](https://github.com/charmbracelet/glow).

```powershell
choco install glow
```

### Install required plugins

```shell
ya pkg add yazi-rs/plugins:piper
ya pkg add yazi-rs/plugins:zoom
ya pkg add yazi-rs/plugins:full-border
ya pkg add yazi-rs/plugins:toggle-pane
```

### Prerequisites on Windows

For the starter config to work on Windows, you need to modify your environment variables:

```powershell
# Add C:\Program Files\Git\usr\bin to your PATH environment variable.

# Set the YAZI_FILE_ONE environment variable:
[System.Environment]::SetEnvironmentVariable("YAZI_FILE_ONE", "C:\Program Files\Git\usr\bin\file.exe", "User")
```

Add the below to your PowerShell profile (e.g. `Microsoft.PowerShell_profile.ps1`) to set `y` as a shortcut for `yazi`
and return to the Yazi directory in the terminal after opening Yazi.

```powershell
# Set y as Yazi shortcut and return to Yazi directory in the terminal
function y {
    $tmp = [System.IO.Path]::GetTempFileName()
    yazi $args --cwd-file="$tmp"
    $cwd = Get-Content -Path $tmp -Encoding UTF8
    if (-not [String]::IsNullOrEmpty($cwd) -and $cwd -ne $PWD.Path) {
        Set-Location -LiteralPath ([System.IO.Path]::GetFullPath($cwd))
    }
    Remove-Item -Path $tmp
}
```

### init.lua

```lua
require("full-border"):setup()
```

### keymap.toml

```toml
[[mgr.prepend_keymap]]
on   = "T"
run  = "plugin toggle-pane max-preview"
desc = "Maximize or restore the preview pane"

[[mgr.prepend_keymap]]
on   = "<S-Up>"
run  = "seek -5"
desc = "Seek up 5 units in the preview"

[[mgr.prepend_keymap]]
on   = "<S-Down>"
run  = "seek 5"
desc = "Seek down 5 units in the preview"

[[mgr.prepend_keymap]]
on   = "+"
run  = "plugin zoom 1"
desc = "Zoom in hovered file"

[[mgr.prepend_keymap]]
on   = "-"
run  = "plugin zoom -1"
desc = "Zoom out hovered file"
```

### yazi.toml

```toml
[mgr]
ratio = [2, 4, 3]
show_hidden = false
sort_by = "natural"
sort_dir_first = true

[preview]
max_width  = 1000
max_height = 1000

[[plugin.prepend_previewers]]
mime = "image/{jpeg,png,webp}"
run  = "zoom 5"

[opener]
edit = [
	{ run = "${EDITOR:-vi} %s", desc = "$EDITOR", for = "unix", block = true },
	{ run = "zed %s", desc = "zed", for = "windows", orphan = true },
	{ run = "zed -w %s", desc = "zed (block)", for = "windows", block = true },
	{ run = 'glow -p %s1', desc = "glow markdown (block)", block = true },
]
play = [
	{ run = "xdg-open %s1", desc = "Play", for = "linux", orphan = true },
	{ run = "open %s", desc = "Play", for = "macos" },
	{ run = 'start "" %s1', desc = "Play", for = "windows", orphan = true },
	{ run = "termux-open %s1", desc = "Play", for = "android" },
	{ run = "mediainfo %s1; echo 'Press enter to exit'; read _", block = true, desc = "Show media info", for = "unix" },
	{ run = "mediainfo %s1 & pause", block = true, desc = "Show media info", for = "windows" },
]
open = [
	{ run = "xdg-open %s1", desc = "Open", for = "linux" },
	{ run = "open %s", desc = "Open", for = "macos" },
	{ run = 'start "" %s1', desc = "Open", for = "windows", orphan = true },
	{ run = "termux-open %s1", desc = "Open", for = "android" },
]
reveal = [
	{ run = "xdg-open %d1", desc = "Reveal", for = "linux" },
	{ run = "open -R %s1", desc = "Reveal", for = "macos" },
	{ run = "explorer /select,%s1", desc = "Reveal", for = "windows", orphan = true },
	{ run = "termux-open %d1", desc = "Reveal", for = "android" },
	{ run = "clear; exiftool %s1; echo 'Press enter to exit'; read _", desc = "Show EXIF", for = "unix", block = true },
]
extract = [{ run = "ya pub extract --list %s", desc = "Extract here" }]
download = [
	{ run = "ya emit download --open %S", desc = "Download and open" },
	{ run = "ya emit download %S", desc = "Download" },
]

[[open.prepend_rules]]
url = "*.md"
use = ["edit", "open"]
```