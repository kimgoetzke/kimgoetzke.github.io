---
title: Useful scripts
date: 2023-05-23
draft: false
series: [ "Powershell" ]
tags: [ Windows, Terminal, PowerShell, Scripts ]
toc: false
---

## Little helper script

```powershell
#! /usr/bin/pwsh

# TODO: Consider using named parameters which require '-':
# param ($f1, $f2)
$f=$args[0]
$arg=$args[1]

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

function StopAndRemoveUnusedDockerContainersAndVolumes {
    Write-Host "Action: "$function" - stops and removes all Docker containers and removes all unused Docker volumes."
    docker stop $(docker ps -a -q) && docker container prune -f && docker volume prune -f
}

function SpinUpNewMysqlDockerContainer {
    Write-Host "Action: "$function" - spins up new MySQL Docker container and copies env vars to clipboard."
    $currentContainer = docker ps -f "name=local_mysql" --format "{{.ID}}"
    if ($null -eq $currentContainer) {
        Write-Host "No MySQL container found. Spinning up new container..."
    } else {
        Write-Host "MySQL container found. Stopping and removing container..."
        docker stop $currentContainer && docker container prune -f
        Start-Sleep -Seconds 2
    }
    docker run --name=local_mysql --env=MYSQL_DATABASE=test --env=MYSQL_PASSWORD=test --env=MYSQL_USER=test --env=MYSQL_ROOT_PASSWORD=test -p 3306 -d mysql:8.0 --character-set-server=latin1 --collation_server=latin1_swedish_ci --log-bin-trust-function-creators=1
    Start-Sleep -Seconds 1
    $mysqlPortOutput = docker port local_mysql
    $mysqlPort = $mysqlPortOutput.Split(":")[-1]
    Write-Host "MySQL container accessible on port: "$mysqlPort
    $testEnvVars = "MYSQL_URL=jdbc:mysql://localhost:$($mysqlPort)/test;MYSQL_USERNAME=root;MYSQL_PASSWORD=test" # Change accordingly
    Set-Clipboard -Value $testEnvVars
    Write-Host "Copied to clipboard: $($testEnvVars)."
    Write-Host "Open the run configuration for any test and paste as environment vars."
    Write-Host "In case of errors above, clean up with: 'docker stop `$(docker ps -f `"name=local_mysql`" --format `"{{.ID}}`") && docker container prune -f'."
}

function GetMysqlDockerContainerPortNumber {
    Write-Host "Action: "$function" - copies MySQL Docker container port number to clipboard."
    $sql_docker_container=$(docker ps | Select-String -Pattern "mysql:")
    if ($null -eq $sql_docker_container) {
        Write-Host "Port number not found. Check if MySQL container is running."
    } else {
        $port_number=$sql_docker_container -replace '.*:(\d+).*', '$1' | ForEach-Object { $_.Trim() }
        Set-Clipboard -Value $port_number
        Write-Host "MySQL port number ($port_number) copied to clipboard."
    }
}

function GetMysqlDockerContainerId {
    Write-Host "Action: "$function" - Sets the MySQL Docker container id as a variable."
    $sql_container_name=$(docker ps | Select-String -Pattern "mysql:")
    if ($null -eq $sql_container_name) {
        Write-Host "Container not found. Check if MySQL container is running."
    } else {
        $containerId = $sql_container_name.Line.Split(" ")[0]
        Set-Clipboard -Value $containerId
        Set-Variable -Name cn -Value $containerId
        Write-Host "MySQL container id ($containerId) copied to clipboard and set as `$cn."
    }
}

function ExecuteCommandInMySqlContainer {
    Write-Host "Action: "$function" - Executes a MySQL command in a Docker container e.g. container_name::SHOW DATABASES."
    $parts = $arg -split "::"
    if ($parts.Count -gt 2) {
        Write-Host "Warning: More than two parts (separated by '::') detected. Only part 1 (as container name) and 2 (as command) will be used."
    }
    if ($parts.Count -lt 2) {
        Write-Host "Warning: You've not provided enough query parts (separated by '::'). Trying to fetch container name for you..."
        GetMysqlDockerContainerId
        Write-Host "Looking for container with name '$containerName' to execute command: '$arg;'."
        docker exec -it $(docker ps -f "name=$containerName" --format "{{.ID}}") bash -c "mysql -u test -ptest -e `"$arg;`""
        return
    }
    $containerName = $parts[0]
    $command = $parts[1]
    Write-Host "Looking for container with name $containerName to execute command: $command."
    docker exec -it $(docker ps -f "name=$containerName" --format "{{.ID}}") bash -c "mysql -u test -ptest -e `"$command;`""
}

function CopyInfraVariablesToClipboard {
    Write-Host "Action: "$function" - Copies variables for running local infra with localstack and MySQL to clipboard."
    $mysqlPortOutput = docker port local_mysql
    $mysqlPort = 'ERROR'
    if ($null -eq $mysqlPortOutput) {
        Write-Host "Error: MySQL container not found. Check if MySQL container is running."
    } else {
        $mysqlPort = $mysqlPortOutput.Split(":")[-1]
        Write-Host "MySQL is accessible on port: "$mysqlPort
    }
    $localstackPortOutput = docker port local-localstack-1
    $localstackPort = 'ERROR'
    if ($null -eq $localstackPortOutput) {
        Write-Host "Error: Localstack container not found. Check if Localstack container is running."
    } else {
        $localstackPort = $localstackPortOutput.Split(":")[-1] 
        Write-Host "Localstack is accessible on port: "$localstackPort
    }
    $testEnvVars = "LOCALSTACK=http://127.0.0.1:$($localstackPort);MYSQL_URL=jdbc:mysql://localhost:$($mysqlPort)/test;MYSQL_USERNAME=root;MYSQL_PASSWORD=test" # Change accordingly
    Set-Clipboard -Value $testEnvVars
    Write-Host "Copied to clipboard: $($testEnvVars)"
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

        if ($foundProcesses | Select-String -Pattern $activePortPattern -Quiet) {
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

function GenerateUlidSilently {
    $ulid_encoding = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"
    $ulid_encoding_length = $ulid_encoding.Length
    $time_now = [UInt64]((([datetime]::UtcNow).Ticks - 621355968000000000) / 10000)
    $created_string = ''
    for ($i = 10; $i -gt 0; $i--) {
        $Mod = [int]($time_now % $ulid_encoding_length)
        $created_string = $ulid_encoding[$Mod] + $created_string
        $time_now = ($time_now - $Mod) / $ulid_encoding_length
    }
    $timestamp_component = $created_string
    $created_string = ''
    $random = [random]::new()
    for ($i = 16; $i -gt 0; $i--) {
        $random_index = [int]([math]::Floor($ulid_encoding_length * $random.NextDouble()))
        $created_string = $ulid_encoding[$random_index] + $created_string
        Start-Sleep -Milliseconds 1
    }
    $random_component = $created_string
    $ulid = $timestamp_component + $random_component
    Set-Clipboard -Value $ulid
}

function SwitchTo-Java17 {
    Write-Host "Action: "$function" - switches to specified Java version."
    $Env:JAVA_HOME="C:\Program Files (x86)\Eclipse Adoptium\jdk-17.0.11.9-hotspot" # Change accordingly
    $Env:Path="$Env:JAVA_HOME\bin;$Env:Path"
    Write-Host "Java Adoptium Temurin 17 activated."
}

function SwitchTo-Java19 {
    Write-Host "Action: "$function" - switches to specified Java version."
    $Env:JAVA_HOME="C:\Program Files (x86)\Eclipse Adoptium\jdk-19.0.2.7-hotspot\" # Change accordingly
    $Env:Path="$Env:JAVA_HOME\bin;$Env:Path" 
    Write-Host "Java Adoptium Temurin 19 activated."
}

function ToggleGradleInitFile {
    Write-Host "Action: "$function" - renames init.gradle file to activate/deactivate it."
    $gradleFolder = Join-Path -Path $env:USERPROFILE -ChildPath ".gradle"
    $initFile = Join-Path -Path $gradleFolder -ChildPath "init.gradle"
    $inactiveInitFile = Join-Path -Path $gradleFolder -ChildPath "INACTIVE_init.gradle_INACTIVE"

    if (Test-Path -Path $initFile -PathType Leaf) {
        Rename-Item -Path $initFile -NewName "INACTIVE_init.gradle_INACTIVE" -Force
        Write-Host "Outcome: Deactivated i.e. renamed init.gradle to INACTIVE_init.gradle_INACTIVE"
    }
    # Check if the INACTIVE_init.gradle_INACTIVE file exists
    elseif (Test-Path -Path $inactiveInitFile -PathType Leaf) {
        Rename-Item -Path $inactiveInitFile -NewName "init.gradle" -Force
        Write-Host "Outcome: Activated i.e. renamed INACTIVE_init.gradle_INACTIVE to init.gradle"
    }
    else {
        Write-Host "Error: No init.gradle or INACTIVE_init.gradle_INACTIVE file found."
    }
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
    for ($i = 10; $i -gt 0; $i--) {
        $Mod = [int]($time_now % $ulid_encoding_length)
        $created_string = $ulid_encoding[$Mod] + $created_string
        $time_now = ($time_now - $Mod) / $ulid_encoding_length
    }
    $timestamp_component = $created_string
    $created_string = ''
    $random = [random]::new()
    for ($i = 16; $i -gt 0; $i--) {
        $random_index = [int]([math]::Floor($ulid_encoding_length * $random.NextDouble()))
        $created_string = $ulid_encoding[$random_index] + $created_string
        Start-Sleep -Milliseconds 1
    }
    $random_component = $created_string
    $ulid = $timestamp_component + $random_component
    Set-Clipboard -Value $ulid
    Write-Host "ULID ($ulid) copied to clipboard."
}

function FixPackageJsonPortsNames {
    Write-Host "Action: "$function" - Recursively searches through a repo for package.json files and replaces all occurrences of '-p `${PORT:=3000}' with '-p 3000'."
    Write-Host "Fetching files..."
    $files = Get-ChildItem -Path "C:\path\to\repo" -Filter 'package.json' -Recurse -File
    foreach ($file in $files) {
        if ($file.DirectoryName -notmatch '\\node_modules\\' -and $file.DirectoryName -notmatch '\\prisma\\' -and $file.DirectoryName -notmatch '\\db\\' -and $file.DirectoryName -notmatch '\\jest\\' -and $file.DirectoryName -notmatch '\\.next\\') {
            Write-Host "Processing file: $file..."
            $content = [System.IO.File]::ReadAllText($file)
            $newContent = $content.Replace("-p `${PORT:=3000}","-p 3000")
            if ($content -ne $newContent) {
                [System.IO.File]::WriteAllText($file, $newContent)
                Write-Host "Modified: $file."
            }
        }
    }
    Write-Host "Done!"
}

function Help {
    Write-Host "Action: "$function" - lists available commands."
    Write-Host "[ Docker ]"
    Write-Host "drcv   : Remove unused containers and volumes"
    Write-Host "drv    : Remove unused volumes"
    Write-Host "dsrc   : Stop and remove all containers"
    Write-Host "dsrcv  : Stop and remove all containers and volumes"
    Write-Host "nmc    : Spin up new MySQL container and copies environment variables to clipboard"
    Write-Host "mp     : Copy MySQL container port number to clipboard"
    Write-Host "mid    : Set MySQL container id as variable"
    Write-Host "mc     : Execute a MySQL command in a container (use with argument 'container_name::command' or just 'command')"
    Write-Host "infv   : Copies variables of running local infra with localstack and MySQL to clipboard"
    Write-Host "[ System ]"
    Write-Host "gp     : Get TCP connections (for port specified)"
    Write-Host "pr     : Get process information for a given PID"
    Write-Host "[ Java ]"
    Write-Host "j17    : Switch to Java Temurin 17"
    Write-Host "j19    : Switch to Java Temurin 19"
    Write-Host "ginit  : Set Gradle init file to active or inactive"
    Write-Host "[ Utility ]"
    Write-Host "uuid   : Generate a random UUID"
    Write-Host "ulid   : Generate a random ULID"
    Write-Host "ulids  : Generate a random ULID silently i.e only copy to clipboard"
    Write-Host "fixfe  : Recursively searches for package.json files in a repo and makes ports Powershell syntax compatible"
    Write-Host "?      : Show this list of parameters"
}

function ExecuteParameter($function, $arg) {
    if ($null -ne $arg) {
        Write-Host "Argument: '"$arg"' - will be ignored if function does not require it."
    }
    switch ($function) {
        {$_ -eq "nmc"} { SpinUpNewMysqlDockerContainer }
        {$_ -eq "mp"} { GetMysqlDockerContainerPortNumber }
        {$_ -eq "mid"} { GetMysqlDockerContainerId }
        {$_ -eq "mc"} { ExecuteCommandInMySqlContainer($arg) }
        {$_ -eq "j17"} { SwitchTo-Java17 }
        {$_ -eq "j19"} { SwitchTo-Java19 }
        {$_ -eq "gp"} { GetPortInfo }
        {$_ -eq "pr"} { GetProcessInfo }
        {$_ -eq "drcv" -or $_ -eq "drmcv"} { RemoveUnusedDockerContainersAndVolumes }
        {$_ -eq "drv" -or $_ -eq "drmv"} { RemoveUnusedDockerVolumes }
        {$_ -eq "dsrc"} { StopAndRemoveAllDockerContainers }
        {$_ -eq "dsrcv"} { StopAndRemoveUnusedDockerContainersAndVolumes }
        {$_ -eq "uuid"} { GenerateUuid }
        {$_ -eq "ulid"} { GenerateUlid }
        {$_ -eq "ulids"} { GenerateUlidSilently }
        {$_ -eq "ginit"} { ToggleGradleInitFile }
        {$_ -eq "fixfe"} { FixPackageJsonPortsNames }
        {$_ -eq "infv"} { CopyInfraVariablesToClipboard }
        {$_ -eq "?" -or $_ -eq "help"} { Help }
        default { Write-Host "Error: Invalid parameter. No action taken."; break }
    }
}

if ($null -eq $f) {
    Write-Host "Need to provide one parameter (and optionally arguments). No action taken."
} else {
    if ($null -ne $arg) {
        ExecuteParameter $f $arg
    } else {
        ExecuteParameter $f
    }
}

Write-Host ""
```

{{< hint info >}}
Save this script with any name (e.g. your name) and the `.ps1` extension. Add the script's location to `PATH` in your
environment variables. Remember to update any locations used in the script (e.g. for switching Java versions). Then run
the script with e.g. `kim ?` to display the available commands.
{{< /hint >}}

## Profile

```powershell
# Initiates OMP styling
oh-my-posh init pwsh --config 'C:\Users\{...}\oh-my-posh\emodipt-kim.omp.json' | Invoke-Expression

# Shows navigable menu of all options when hitting Tab
Set-PSReadlineKeyHandler -Key Tab -Function MenuComplete

# App sortcuts
Set-Alias -Name idea -Value 'C:\Users\{...}\AppData\Local\Programs\IntelliJ IDEA Ultimate\bin\idea64.exe'
Set-Alias -Name webstorm -Value 'C:\Users\{...}\AppData\Local\Programs\WebStorm\bin\webstorm64.exe'
Set-Alias -Name rider -Value 'C:\Users\{...}\AppData\Local\Programs\Rider\bin\rider64.exe'

# Folder shortcuts
function fo {
    switch ($args[0]) {
        {$_ -eq "user" -or $_ -eq "home"} { Set-Location -Path 'C:\Users\{...}' }
        {$_ -eq "downloads" -or $_ -eq "dl"} { Set-Location -Path 'C:\Users\{...}\Downloads' }
        {$_ -eq "proper"} { Set-Location -Path 'C:\Users\{...}\projects' }
        default { 
            Write-Host "Error: Folder not recognised." 
            Write-Host "Recognised are: user/home, proper, dl/downloads." 
        }
    }
}


# Allows opening files in VS Code e.g. 'fi ssh'
function fi {
    switch ($args[0]) {
        {$_ -eq "ssh"} { code 'C:\Users\{...}\.ssh\config' } 
        {$_ -eq "aws"} { code 'C:\Users\{...}\.aws\config' } 
        {$_ -eq "profile"} { code 'C:\Users\{...}\Documents\PowerShell\Microsoft.PowerShell_profile.ps1' } 
        {$_ -eq "kim"} { code 'C:\Users\{...}\Documents\PowerShell\Scripts\kim.ps1' } 
        default { 
            Write-Host "Error: File not recognised." 
            Write-Host "Recognised files are ssh, aws, kim, profile."
        }
    }
}
```