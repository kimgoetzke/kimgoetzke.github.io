---
title: Terminal & PowerShell
draft: false
date: 2023-03-17
series: [ "Powershell" ]
tags: [Windows, Terminal, PowerShell]
toc: true
---

## Remember

- [Windows Terminal documentation](https://learn.microsoft.com/en-us/windows/terminal/install)
- Use `CTRL` + `Space` to show "MenuComplete" i.e. available options based on the input provided so far
- Use `Arrow key (right)` for basic auto-complete
- Set up advanced auto-complete - see [this article](https://techcommunity.microsoft.com/t5/itops-talk-blog/autocomplete-in-powershell/ba-p/2604524)
- Toggle command history with `F2`

## Customise Terminal default layout

1. Create a desktop shortcut
2. Set the target as `C:\Users\[Username]\AppData\Local\Microsoft\WindowsApps\wt.exe` 
3. Append any customisations to the above target, e.g. ` -p "PowerShell 7 (x86)" ; split-pane -H -p "Ubuntu"` to open with two horizontal panes with Powershell and Bash
4. Add a keyboard shortcut and/or select `Open as Administrator` if you want

## Basic commands

### Check version of PowerShell
```powershell
(Get-PSReadlineOption).HistorySavePath
```

### Find your PowerShell command history
```powershell
$PSVersionTable
```

### `cat`/get/display content of file
```powershell
gc [file_name]
```

### Use WSL
List all distros:
```powershell 
wsl --list --verbose
```

Shutdown one distro:
```powershell
wsl -t [distro_name]
```

Shutdown all distros:
```powershell
wsl --shutdown
```

Restart a distro:
```powershell
wsl --distribution [distro_name]
```

### Get and unzip an archive file
```powershell
wget [URL + file_name]
Expand-Archive ./filetounzip.zip ./folder-to-extract-to
```

### Copying files
```powershell
xcopy "some_folder\subfolder\" "another_folder\subfolder\" /E /K /D /H /Y
```

{{< hint link >}}
`/E` copies all subdirectories, even if they are empty. `/K` retains the read-only attribute on destination files if present on the source files. `/D` without `[:MM-DD-YYYY]` copies all _source_ files that are newer than existing _destination_ files. `/H` copies files with hidden and system file attributes. And `/Y` suppresses the prompt to confirm overwriting.
Checkout the [xcopy documentation on learn.microsoft.com](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/xcopy) for more info.
{{< /hint >}}

### Find directory of a process
```powershell
Get-Process -Id $PID # Name of current shell you are running
(Get-Process [outcome_of_above] | select -First 1).Path # Returns absolute directory
```

### Using variables
Get environment variable:
```powershell
echo $env:JAVA_HOME
```

Get variable:
```powershell
Get-Variable -Name "VARIABLE_NAME"
```

Set variable:
{{< hint warning >}}
The below won't set the variable permanently. If you want to retain the variable beyond the current session, consider adding it to your profile.
{{< /hint >}}

```powershell
Set-Variable -Name "desc" -Value "A description" 

# Syntax
Set-Variable 
   [-Name] <String[]> 
   [[-Value] <Object>] 
   [-Include <String[]>] 
   [-Exclude <String[]>] 
   [-Description <String>] 
   [-Option <ScopedItemOptions>] 
   [-Force] 
   [-Visibility <SessionStateEntryVisibility>] 
   [-PassThru] 
   [-Scope <String>] 
   [-WhatIf] 
   [-Confirm] 
   [<CommonParameters>]
```

### Working with your Powershell profile
Open the profile:
```powershell
code $profile
```

Add variable to profile:
```powershell
# Paste variable you want to set into your profile like this:
Set-Variable -Name "LOCAL_POSTGRES_PASSWORD" -Value "password" -Scope global 
```

Add simple alias for an application:
```powershell
Set-Alias -Name idea -Value 'C:\{...}\IntelliJ IDEA Ultimate\bin\idea64.exe'
Set-Alias -Name webstorm -Value 'C:\{...}\WebStorm\bin\webstorm64.exe'
```

Add alias with args for an application:
```powershell
# Example with Visual VM and Zulu 17 JDK, allowing for additional args
function Start-VisualVM {
    & 'C:\Program Files\visualvm_217\bin\visualvm.exe' --jdkhome "C:\Program Files\Zulu\zulu-17" --userdir "C:\Users\{...}\visualvm_userdir" $args
}
Set-Alias -Name visualvm -Value Start-VisualVM
```

Set "aliases" for folders:
```powershell
# Allows changing folder e.g. 'fo user'
function fo {
    switch ($args[0]) {
        {$_ -eq "user" -or $_ -eq "home"} { Set-Location -Path 'C:\Users\{...}' }
        {$_ -eq "ssh"} { Set-Location -Path 'C:\Users\{...}\.ssh' } 
        {$_ -eq "aws"} { Set-Location -Path 'C:\Users\{...}\.aws' } 
        {$_ -eq "pro"} { Set-Location -Path 'C:\Users\{...}\projects' }
        default {
            Write-Host "Error: Folder not recognised."
            Write-Host "Recognised folders are user/home, ssh, aws, pro."
      }
    }
}
```

Set "aliases" for files:
```powershell
# Allows opening files in VS Code e.g. 'fi ssh'
function fi {
    switch ($args[0]) {
        {$_ -eq "ssh"} { code 'C:\Users\{...}\.ssh\config' } 
        {$_ -eq "aws"} { code 'C:\Users\{...}\.aws\config' } 
        default { 
            Write-Host "Error: File not recognised." 
            Write-Host "Recognised files are ssh, aws."
        }
    }
}
```

Other, random things:
```powershell
.$profile
```

Reload/refresh profile:
```powershell
Set-PSReadlineKeyHandler -Key Tab -Function MenuComplete # Enables auto-complete
$env:POWERSHELL_UPDATECHECK = 'Off' # Disables update banner in Terminal startup
```

## Useful scripts/snippets

### The grep equivalent / Select-String

Example for processing a single file and storing output in new file
```powershell
Get-Content -Path SomeFile.log | Select-String -Pattern "`"500`"" | Out-File -FilePath 500.log
```

Example for processsing multiple files and storing output in new file
```powershell
Get-ChildItem -Filter *.log | ForEach-Object { Select-String -Path $_.FullName -Pattern "`"500`"" } | Out-File -FilePath 500.log
```

### Split command output and print line by line
```powershell
# Maven dependencies classpath example
& ./mvnw dependency:build-classpath | ForEach-Object { $_ -split ';' }
```

{{< hint link >}}
`&` sends the output of the first command as input to the next part of the one-liner.
{{< /hint >}}


### Switch between different Java versions
1. Create the folder `C:\Program Files\Java\scripts`
2. Paste the following scripts (and/or new scripts for other Java versions)

```powershell
# File name: switchto-java11.ps1
$Env:JAVA_HOME="C:\Program Files\Java\jdk-11" 
$Env:Path="$Env:JAVA_HOME\bin;$Env:Path" 
Write-Host Java 11 activated.
```

```powershell
# File name: switchto-java17.ps1
$Env:JAVA_HOME="C:\Program Files\Java\jdk-17" 
$Env:Path="$Env:JAVA_HOME\bin;$Env:Path" 
Write-Host Java 17 activated.
```

3. Add `C:\Program Files\Java\scripts` to `Path` so you can access the scripts from anywhere
4. Modify/set up other Java-related environment variables like so:
   1. The user variables (top section of the environmental variables window) should not contain any Java-related entries
   2. The lower list ("System variables") should contain an entry `JAVA_HOME = C:\Program Files\Java\jdk-19` (or similar, depending you the Java version and installation directory).
   3. Delete the following entries under "Path" (if they exist): `C:\ProgramData\Oracle\Java\javapath` and `C:\Program Files (x86)\Common Files\Oracle\Java\javapath`
   4. Insert the following `Path` variable `%JAVA_HOME%\bin`

{{< hint link >}}
The above is inspired by: [How to Change Java Versions in Windows (happycoders.eu)](https://www.happycoders.eu/java/how-to-switch-multiple-java-versions-windows/).
{{< /hint >}}

### Show list of options for incomplete prompt

1. Update your profile

```powershell
Set-PSReadlineKeyHandler -Key Tab -Function MenuComplete
```

2. When typing a prompt, press the `Tab` key to display available options to choose from


### Copy port number for Docker container to clipboard

This is useful when working with Docker containers with random ports that you need to access frequently.
Example for Mysql container:

```powershell
$sql_docker_container=$(docker ps | Select-String -Pattern "mysql:")
if ($null -eq $sql_docker_container) {
  Write-Host "Port number not found. Check if Mysql container is running."
} else {
  $port_number=$sql_docker_container -replace '.*:(\d+).*', '$1' | ForEach-Object { $_.Trim() }
  Set-Clipboard -Value $port_number
  Write-Host "Mysql port number ($port_number) copied to clipboard."
}
```
