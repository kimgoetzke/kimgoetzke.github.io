---
title: AutoHotkey
date: 2024-07-07
draft: false
tags: ["AHK", "Windows", "AutoHotkey", "Scripts"]
toc: false
---

## Get started

1. Install with `choco install autohotkey.portable`.
2. Create your `.ahk` file.
3. Make sure to set `AutoHotkey.exe` as the default program to open `.ahk` files.
4. Hit `Win + R` and type `shell:startup` to open the `Startup` folder.
5. Create a shortcut of your `.ahk` file in the `Startup` folder to run it on startup.

## Example

```ahk
#Requires AutoHotkey v2.0.2
#SingleInstance Force

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

; Win + W => JetBrains Webstorm
#w::WinExist("ahk_exe webstorm64.exe") ? WinActivate() : Run("C:\Users\{...}\AppData\Local\Programs\WebStorm\bin\webstorm64.exe")

; Win + I => JetBrains IntelliJ
#i::WinExist("ahk_exe idea64.exe") ? WinActivate() : Run("C:\Users\{...}\AppData\Local\Programs\IntelliJ IDEA Ultimate\bin\idea64.exe")

; Win + C => VS Code
#c:: WinExist("ahk_exe Code.exe") ? WinActivate() : Run("C:\Users\{...}\AppData\Local\Programs\Microsoft VS Code\Code.exe")

; Win + A => Aseprite
#a:: WinExist("ahk_exe Aseprite.exe") ? WinActivate() : Run("C:\Program Files\Aseprite\Aseprite.exe")

; Win + P => Postman
#p:: WinExist("ahk_exe Postman.exe") ? WinActivate() : Run("C:\Users\{...}\AppData\Local\Postman\Postman.exe")

; Win + S = Window Spy
#w::Run("C:\ProgramData\chocolatey\lib\autohotkey.portable\tools\AutoHotkey.exe C:\ProgramData\chocolatey\lib\autohotkey.portable\tools\UX\WindowSpy.ahk")

; Win + Shift + F5 => Toggle Taskbar
#+F5::!WinExist("ahk_class Shell_TrayWnd") ? WinShow("ahk_class Shell_TrayWnd") : WinHide("ahk_class Shell_TrayWnd")

; Win + Right Mouse Button => Resize window
#RButton:: {
    CoordMode("Mouse", "Screen")            ; Mouse coordinates are relative to the screen
    MouseGetPos(&startX, &startY, &WinID)   ; Get the initial mouse position and the window ID

    While GetKeyState("RButton", "P") {
        MouseGetPos(&currentX, &currentY)
        WinGetPos(&winX, &winY, &winW, &winH, "ahk_id " WinID)
        newWidth := winW + (currentX - startX)
        newHeight := winH + (currentY - startY)
        startX := currentX
        startY := currentY

        if (newWidth > 50 && newHeight > 50)
            WinMove(winX, winY, newWidth, newHeight, WinID)
    }
    Run("komorebic.exe retile",, "Hide")    ; Retile the windows after resizing
}

; Win + Left Mouse Button => Move window
#LButton:: {
    CoordMode("Mouse", "Screen")            ; Set mouse coordinates relative to the screen
    MouseGetPos(&startX, &startY, &WinID)   ; Get initial mouse position and the window handle (ID)
    WinGetPos(&winX, &winY, , , WinID)      ; Get the window's current position

    While GetKeyState("LButton", "P") {
        MouseGetPos(&currentX, &currentY)   ; Get the current mouse position

        ; Calculate the offset for window movement
        offsetX := currentX - startX
        offsetY := currentY - startY

        ; Move the window to the new position
        WinMove(winX + offsetX, winY + offsetY, , , WinID)

        ; Update starting positions for "smooth" dragging
        startX := currentX
        startY := currentY
        winX := winX + offsetX
        winY := winY + offsetY
    }
    Run("komorebic.exe retile",, "Hide")    ; Retile the windows after resizing
}

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