---
title: AHK
date: 2024-07-07
draft: false
tags: ["AHK", "Windows", "AutoHotkey"]
toc: false
---

# Get started

1. Install with `choco install autohotkey.portable`.
2. Create your `.ahk` file.
3. Make sure to set `AutoHotkey.exe` as the default program to open `.ahk` files.
4. Hit `Win + R` and type `shell:startup` to open the `Startup` folder.
5. Create a shortcut of your `.ahk` file in the `Startup` folder to run it on startup.

# Example

```ahk
; Win + Shift + Q => Close active window
#+q:: PostMessage 0x112, 0xF060, , , "A"

; Win + O => Obsidian
#o::WinExist("ahk_exe Obsidian.exe") ? WinActivate() : Run("C:\Users\{...}\AppData\Local\Obsidian\Obsidian.exe")

; Win + M => Explorer
#m::WinExist('ahk_class CabinetWClass') ? WinActivate() : Run('explorer')

; Win + T = Terminal
#t::WinExist("ahk_exe WindowsTerminal.exe") ? WinActivate() : Run("wt")

; Win + F => Firefox
#f::WinExist("ahk_class MozillaWindowClass") ? WinActivate() : Run("C:\Program Files\Mozilla Firefox\firefox.exe")

; Win + J => JetBrains Toolbox
#j::WinExist("ahk_exe jetbrains-toolbox.exe") ? WinActivate() : MsgBox("JetBrains Toolbox isn't visible but may be running. Opening the minimised window has not been implemented yet.", "Cannot open JetBrains Toolbox")

; Win + C => VS Code
#c:: WinExist("ahk_exe Code.exe") ? WinActivate() : Run("C:\Users\{...}\AppData\Local\Programs\Microsoft VS Code\Code.exe")

; Win + A => Aseprite
#a:: WinExist("ahk_exe Aseprite.exe") ? WinActivate() : Run("C:\Program Files\Aseprite\Aseprite.exe")

; Win + P => Postman
#p:: WinExist("ahk_exe Postman.exe") ? WinActivate() : Run("C:\Users\{...}\AppData\Local\Postman\Postman.exe")

; Win + W = Window Spy
#w::Run("C:\ProgramData\chocolatey\lib\autohotkey.portable\tools\AutoHotkey.exe C:\ProgramData\chocolatey\lib\autohotkey.portable\tools\UX\WindowSpy.ahk")

; Win + Shift + F5 => Toggle Taskbar
#+F5::!WinExist("ahk_class Shell_TrayWnd") ? WinShow("ahk_class Shell_TrayWnd") : WinHide("ahk_class Shell_TrayWnd")

; |------------- HOTSTRINGS -------------|

; Today's date
::]today::
{
    CurrentDate := FormatTime(,"yyyy-MM-dd")
    SendInput CurrentDate
}

; Time now
::]now::
{
    CurrentDate := FormatTime(,"hh:mm:ss")
    SendInput CurrentDate
}
```