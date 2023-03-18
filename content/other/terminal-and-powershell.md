---
title: Terminal & PowerShell
draft: false
date: 2023-03-17
series: [ "Other" ]
tags: [Windows, Terminal, PowerShell]
toc: true
---
## Key resources

- [Windows Terminal documentation](https://learn.microsoft.com/en-us/windows/terminal/install)

## Remember

- Use `CTRL` + `Space` to show "MenuComplete" i.e. available options based on the input provided so far
- Use `Arrow key (right)` for basic auto-complete
- Set up advanced auto-complete - see [this article](https://techcommunity.microsoft.com/t5/itops-talk-blog/autocomplete-in-powershell/ba-p/2604524)


## Basic Terminal commands

### Check version of PowerShell
```powershell
$PSVersionTable
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

### Print environment variables in PowerShell
```powershell
echo $env:JAVA_HOME
```

### Find directory of a process
```powershell
Get-Process -Id $PID # Name of current shell you are running
(Get-Process [outcome_of_above] | select -First 1).Path # Returns absolute directory
```

### Get and set variables
```powershell
Get-Variable -Name "desc"
```

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

### Open profile
```powershell
notepad $profile
```

### Add variable to profile
```powershell
# Step 1: Open your profile
notepad $profile

# Step 2: Add the variable
Set-Variable -Name "LOCAL_POSTGRES_PASSWORD" -Value "password" -Scope global 

# Step 3: Reload the profile
.$profile
```

### Reload/refresh profile
```powershell
.$profile
```


## Useful scripts

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