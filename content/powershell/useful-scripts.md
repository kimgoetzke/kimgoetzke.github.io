---
title: Useful scripts
date: 2023-05-23
draft: false
series: [ "Powershell" ]
tags: [Windows, Terminal, PowerShell, Scripts]
toc: false
---

## Useful little helper script
```powershell
#! /usr/bin/pwsh

# Note: Named parameters require '-' but...
# param ($f1, $f2)
# ...unnamed parameters do not require '-'
$f1=$args[0]
$f2=$args[1]

function GetMysqlDockerContainerPortNumber {
    Write-Host "Action: "$function" - copies Mysql Docker container port number to clipboard."
    $sql_docker_container=$(docker ps | Select-String -Pattern "mysql:")
    if ($null -eq $sql_docker_container) {
        Write-Host "Port number not found. Check if Mysql container is running."
    } else {
        $port_number=$sql_docker_container -replace '.*:(\d+).*', '$1' | ForEach-Object { $_.Trim() }
        Set-Clipboard -Value $port_number
        Write-Host "Mysql port number ($port_number) copied to clipboard."
    }
}

function SwitchTo-Java17 {
    Write-Host "Action: "$function" - switches to specified Java version."
    $Env:JAVA_HOME="C:\Program Files\Zulu\zulu-17\" 
    $Env:Path="$Env:JAVA_HOME\bin;$Env:Path" 
    Write-Host "Java Zulu 17 activated."
}

function GetPortInfo {
    Write-Host "Action: "$function" - lists TCP connections (optional: using port number specified)."
    $port = Read-Host -Prompt "Enter port number"
    Write-Host ""
    if ($port -eq [string]::empty) {
        netstat -nao
    } else {
        netstat -nao | findstr "PID :$port"
        $foundProcesses = netstat -nao | findstr "PID :$port"
        $activePortPattern = ":$port\s.+LISTENING\s+\d+$"
        $pidNumberPattern = "\d+$"

        if ($foundProcesses | Select-String -Pattern $activePortPattern -Quiet) 
        {
            $matched = $foundProcesses | Select-String -Pattern $activePortPattern
            $firstMatch = $matched.Matches.Get(0).Value
            $pidNumber = [regex]::match($firstMatch, $pidNumberPattern).Value
            Get-Process -id $pidNumber
            $action = Read-Host -Prompt "`nAction ([k] kill, [ENTER] none)"
            switch ($action) {
                {$_ -eq "k" -or $_ -eq "kill"} { taskkill /pid $pidNumber /f }
                default { Write-Host "No action taken."; break }
            }
        } else {
            Write-Host "No matching process found."
        }
    }
}

function GetProcessInfo {
    Write-Host "Action: "$function" - returns information about process for a given PID."
    $process_id = Read-Host -Prompt "Enter PID"
    if ($process_id -eq [string]::empty) {
        Write-Host "No PID provided."
    } else {
        $ErrorActionPreference = 'SilentlyContinue'
        Get-Process -id $process_id | Select-Object *
    }
}

function RemoveUnusedDockerContainersAndVolumes {
    Write-Host "Action: "$function" - removes all unused Docker containers & volumes."
    docker container prune -f && docker volume prune -f
}

function RemoveUnusedDockerVolumes {
    Write-Host "Action: "$function" - removes all unused Docker volumes."
    docker volume prune -f
}

function StopAndRemoveAllDockerContainers {
    Write-Host "Action: "$function" - stops and removes all Docker containers."
    docker stop $(docker ps -a -q) && docker container prune -f
}

function GenerateUuid {
    Write-Host "Action: "$function" - generates random UUID."
    $uuid=[guid]::NewGuid().ToString()
    Set-Clipboard -Value $uuid
    Write-Host "UUID ($uuid) copied to clipboard."
}

function GenerateUlid {
    Write-Host "Action: "$function" - generates random ULID."
    $ulid_encoding = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"
    $ulid_encoding_length = $ulid_encoding.Length
    $time_now = [UInt64]((([datetime]::UtcNow).Ticks - 621355968000000000) / 10000)
    $created_string = ''
    for ($i = 10; $i -gt 0; $i--)
    {
        $Mod = [int]($time_now % $ulid_encoding_length)
        $created_string = $ulid_encoding[$Mod] + $created_string
        $time_now = ($time_now - $Mod) / $ulid_encoding_length
    }
    $timestamp_component = $created_string
    $created_string = ''
    $random = [random]::new()
    for ($i = 16; $i -gt 0; $i--)
    {
        $random_index = [int]([math]::Floor($ulid_encoding_length * $random.NextDouble()))
        $created_string = $ulid_encoding[$random_index] + $created_string
        Start-Sleep -Milliseconds 1
    }
    $random_component = $created_string
    $ulid = $timestamp_component + $random_component
    Set-Clipboard -Value $ulid
    Write-Host "ULID ($ulid) copied to clipboard."
}

function Help {
    Write-Host "Action: "$function" - lists available commands."
    Write-Host "mp     : Copy Mysql Docker container port number to clipboard"
    Write-Host "j17    : Switch to Java Zulu 17"
    Write-Host "gp     : Get TCP connections (for port specified)"
    Write-Host "pr     : Get process information for a given PID"
    Write-Host "drcv   : Remove unused Docker containers and volumes"
    Write-Host "drv    : Remove unused Docker volumes"
    Write-Host "dsrc   : Stop and remove all Docker containers"
    Write-Host "uuid   : Generate a random UUID"
    Write-Host "ulid   : Generate a random ULID"
    Write-Host "?      : Show this list of parameters"
}

function ExecuteParameter($function) {
    Write-Host ""
    switch ($function) {
        {$_ -eq "mp" -or $_ -eq "mysql" -or $_ -eq "mysql-port"} { GetMysqlDockerContainerPortNumber }
        {$_ -eq "j17" -or $_ -eq "java17"} { SwitchTo-Java17 }
        {$_ -eq "gp"} { GetPortInfo }
        {$_ -eq "pr"} { GetProcessInfo }
        {$_ -eq "drcv" -or $_ -eq "drmcv"} { RemoveUnusedDockerContainersAndVolumes }
        {$_ -eq "drv" -or $_ -eq "drmv"} { RemoveUnusedDockerVolumes }
        {$_ -eq "dsrc"} { StopAndRemoveAllDockerContainers }
        {$_ -eq "uuid"} { GenerateUuid }
        {$_ -eq "ulid"} { GenerateUlid }
        {$_ -eq "?" -or $_ -eq "help"} { Help }
        default { Write-Host "Error: Invalid parameter. No action taken."; break }
    }
}

if ($null -eq $f1) {
    Write-Host "Need to provide one or two parameter(s). No action taken."
} else {
    ExecuteParameter $f1
    if ($null -ne $f2) {
        ExecuteParameter $f2
    }
}

Write-Host ""
```

{{< hint info >}}
Remember to add the script's location to Path.
{{< /hint >}}
