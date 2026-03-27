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
      // "shift shift": "file_finder::Toggle"
    }
  },
  {
    "context": "Editor && vim_mode == insert",
    "bindings": {
      // "j k": "vim::NormalBefore"
    }
  },
  {
    "context": "Editor",
    "bindings": {
      "ctrl-\\ ctrl-right": "pane::SplitRight"
    }
  },
  {
    "context": "Editor",
    "bindings": {
      "ctrl-\\": null
    }
  },
  {
    "context": "Editor",
    "bindings": {
      "ctrl-\\ ctrl-d": "editor::DeleteLine"
    }
  },
  {
    "bindings": {
      "ctrl-alt-s": "zed::OpenSettings"
    }
  },
  {
    "context": "Editor",
    "bindings": {
      "ctrl-\\ ctrl-g": "git::Blame"
    }
  },
  {
    "context": "Editor",
    "bindings": {
      "ctrl-\\ ctrl-c": [
        "editor::ToggleComments",
        {
          "advance_downwards": true
        }
      ]
    }
  },
  {
    "context": "Editor",
    "bindings": {
      "ctrl-\\ ctrl-r": "editor::Rename"
    }
  },
  {
    "context": "Editor",
    "bindings": {
      "ctrl-\\ ctrl-f": "pane::RevealInProjectPanel"
    }
  },
  {
    "context": "Pane",
    "bindings": {
      "ctrl-\\ ctrl-s": "workspace::ToggleZoom"
    }
  },
  {
    "bindings": {
      "ctrl-\\ ctrl-[": "workspace::ActivateNextPane",
      "ctrl-\\ ctrl-]": "workspace::ActivatePreviousPane",
      "ctrl-\\ ctrl-=": "zed::ToggleFullScreen"
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
      "JETBRAINS_TERMINAL": "1",
      "IDE_TERMINAL": "1",
    },
  },
  "experimental.theme_overrides": {
    "syntax": {
      "emphasis.strong": {
        "color": "#ebcb8b",
        "font_weight": 500,
      },
      "emphasis": {
        "color": "#ebcb8b",
        "font_style": "italic",
      },
      "punctuation.list_marker": {
        "color": "#b48ead",
      },
    },
  },
}
```