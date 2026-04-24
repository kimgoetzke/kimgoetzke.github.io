---
title: Zed
draft: false
date: 2026-03-27
series: [ "Other" ]
tags: [ "Zed", "Starters" ]
toc: true
---

## Basic starter configuration

My basic starter configuration. Not useful for anyone else.

### keymap.json

```json5
// Zed keymap
//
// For information on binding keys, see the Zed
// documentation: https://zed.dev/docs/key-bindings
//
// To see the default key bindings run `zed: open default keymap`
// from the command palette.
[
  {
    "context": "Workspace",
    "bindings": {
      "shift shift": "file_finder::Toggle",
    },
  },
  {
    "context": "Editor && vim_mode == insert",
    "bindings": {
      // "j k": "vim::NormalBefore"
    },
  },
  {
    "context": "Editor",
    "bindings": {
      "ctrl-\\ ctrl-right": "pane::SplitRight",
    },
  },
  {
    "context": "Editor",
    "bindings": {
      "ctrl-\\": null,
    },
  },
  {
    "context": "Editor",
    "bindings": {
      "ctrl-\\ ctrl-d": "editor::DeleteLine",
    },
  },
  {
    "bindings": {
      "ctrl-alt-s": "zed::OpenSettings",
    },
  },
  {
    "context": "Editor",
    "bindings": {
      "ctrl-\\ ctrl-g": "git::Blame",
    },
  },
  {
    "context": "Editor",
    "bindings": {
      "ctrl-\\ ctrl-c": [
        "editor::ToggleComments",
        {
          "advance_downwards": true,
        },
      ],
    },
  },
  {
    "context": "Editor",
    "bindings": {
      "ctrl-\\ ctrl-f": "pane::RevealInProjectPanel",
    },
  },
  {
    "context": "Pane",
    "bindings": {
      "ctrl-\\ ctrl-s": "workspace::ToggleZoom",
    },
  },
  {
    "bindings": {
      "ctrl-\\ ctrl-[": "workspace::ActivateNextPane",
      "ctrl-\\ ctrl-]": "workspace::ActivatePreviousPane",
      "ctrl-\\ ctrl-=": "zed::ToggleFullScreen",
    },
  },
  {
    "context": "Workspace",
    "bindings": {
      "ctrl-alt-shift-r": "task::Spawn",
    },
  },
  {
    "context": "Workspace",
    "unbind": {
      "alt-shift-f10": "task::Spawn",
    },
  },
  {
    "bindings": {
      "ctrl-alt-}": "agent::Toggle",
    },
  },
  {
    "context": "Pane",
    "unbind": {
      "alt-2": ["pane::ActivateItem", 1],
    },
  },
  {
    "context": "ProjectPanel",
    "bindings": {
      "ctrl-\\ ctrl-r": "project_panel::Rename",
    },
  },
  {
    "context": "ProjectPanel",
    "unbind": {
      "shift-f6": "project_panel::Rename",
    },
  },
  {
    "context": "Editor",
    "bindings": {
      "ctrl-\\ ctrl-r": "editor::Rename",
    },
  },
  {
    "context": "Workspace",
    "unbind": {
      "ctrl-r": [
        "projects::OpenRecent",
        {
          "create_new_window": false,
        },
      ],
    },
  },
  {
    "bindings": {
      "ctrl-\\ ctrl-q": "editor::CopyPermalinkToLine"
    }
  }
]

```

### settings.json

```json5
// Zed settings
//
// For information on how to configure Zed, see the Zed
// documentation: https://zed.dev/docs/configuring-zed
//
// To see all of Zed's default settings without changing your
// custom settings, run `zed: open default settings` from the
// command palette (cmd-shift-p / ctrl-shift-p)
{
  "agent_servers": {
    "claude-acp": {
      "type": "registry"
    }
  },
  "languages": {
    "Java": {
      "tab_size": 2,
    },
  },
  "buffer_font_family": ".ZedMono",
  "telemetry": {
    "diagnostics": true,
    "metrics": false,
  },
  "icon_theme": "JetBrains Icons Dark",
  "base_keymap": "JetBrains",
  "ui_font_size": 16,
  "buffer_font_size": 15,
  "theme": {
    "mode": "dark",
    "light": "One Light",
    "dark": "Islands Dark",
  },
  "lsp": {
    "jdtls": {
      "settings": {
        "lombok_support": true,
        "import": {
          "gradle": {
            "enabled": true,
          },
          "maven": {
            "enabled": true,
          },
          "exclusions": [
            "**/node_modules/**",
            "**/.metadata/**",
            "**/archetype-resources/**",
            "**/META-INF/maven/**",
            "/**/test/**",
          ],
        },
      },
      "initialization_options": {
        "settings": {
          "lombok_support": true,
          "import": {
            "gradle": {
              "enabled": true,
            },
            "maven": {
              "enabled": true,
            },
            "exclusions": [
              "**/node_modules/**",
              "**/.metadata/**",
              "**/archetype-resources/**",
              "**/META-INF/maven/**",
              "/**/test/**",
            ],
          },
        },
      },
    },
  },
  "terminal": {
    "env": {
      "IDE_TERMINAL": "1",
    },
  },
  "experimental.theme_overrides": {
    "syntax": {
      "emphasis.strong": {
        "color": "#E0BB65",
        "font_weight": 500,
      },
      "emphasis": {
        "color": "#E0BB65",
        "font_style": "italic",
      },
      "punctuation.list_marker": {
        "color": "#C77DBB",
      },
    },
  },
}
```
