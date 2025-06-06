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
    Write-Host "Action: $function - removes all unused Docker containers & volumes."
    docker container prune -f && docker volume prune -f
}

function RemoveUnusedDockerVolumes {
    Write-Host "Action: $function - removes all unused Docker volumes."
    docker volume prune -f
}

function StopAndRemoveAllDockerContainers {
    Write-Host "Action: $function - stops and removes all Docker containers."
    docker stop $(docker ps -a -q) && docker container prune -f
}

function StopAndRemoveUnusedDockerContainersAndVolumes {
    Write-Host "Action: $function - stops and removes all Docker containers and removes all unused Docker volumes."
    docker stop $(docker ps -a -q) && docker container prune -f && docker volume prune -f
}

function SpinUpNewMysqlDockerContainer {
    Write-Host "Action: $function - spins up new MySQL Docker container and copies env vars to clipboard."
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
    Write-Host "Action: $function - copies MySQL Docker container port number to clipboard."
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
    Write-Host "Action: $function - sets the MySQL Docker container id as a variable."
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
    Write-Host "Action: $function - executes a MySQL command in a Docker container e.g. container_name::SHOW DATABASES."
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
    Write-Host "Action: $function - copies variables for running local infra with localstack and MySQL to clipboard."
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

function WhereIs {
    Write-Host "Action: $function - finds path of an executable."
    if ($arg -eq [string]::empty -or $arg -eq $null) {
        Write-Host "No executable name provided."
        $executableName = Read-Host -Prompt "Enter name of executable (excluding .exe)"
        $ErrorActionPreference = 'SilentlyContinue'
        $executablePath = (Get-Command "$executableName.exe").Path
        if ($null -eq $executablePath) {
            Write-Host "Error: Executable $executableName.exe cannot be found."
        } else {
            Write-Host $executablePath
        }
        return
    }
    Write-Host "Attempting to find location of $arg.exe..."
    $ErrorActionPreference = 'SilentlyContinue'
    $executablePath = (Get-Command "$arg.exe").Path
    if ($null -eq $executablePath) {
        Write-Host "Error: Executable $executableName.exe cannot be found."
    } else {
        Write-Host $executablePath
    }
}

function GetPortInfo {
    Write-Host "Action: $function - lists TCP connections (optional: using port number specified)."
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
    Write-Host "Action: $function - returns information about process for a given PID."
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

# TODO: Change path/version accordingly and keep up-to-date
function SwitchTo-Java17 {
    Write-Host "Action: $function - switches to specified Java version."
    $Env:JAVA_HOME="C:\Program Files (x86)\Eclipse Adoptium\jdk-17.0.14.7-hotspot"
    $Env:Path="$Env:JAVA_HOME\bin;$Env:Path"
    Write-Host "Java Adoptium Temurin 17 activated."
}

# TODO: Change path/version accordingly and keep up-to-date
function SwitchTo-Java21 {
    Write-Host "Action: "$function" - switches to specified Java version."
    $Env:JAVA_HOME="C:\Program Files\Eclipse Adoptium\jdk-21.0.6.7-hotspot\"
    $Env:Path="$Env:JAVA_HOME\bin;$Env:Path" 
    Write-Host "Java Adoptium Temurin 21 activated."
}

function ToggleGradleInitFile {
    Write-Host "Action: $function - renames init.gradle file to activate/deactivate it."
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
    Write-Host "Action: $function - generates random UUID."
    $uuid=[guid]::NewGuid().ToString()
    Set-Clipboard -Value $uuid
    Write-Host "UUID ($uuid) copied to clipboard."
}

function GenerateUlid {
    Write-Host "Action: $function - generates random ULID."
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

# TODO: Change path accordingly
function FixPackageJsonPortsNames {
    Write-Host "Action: $function - recursively searches through a repo for package.json files and replaces all occurrences of '-p `${PORT:=3000}' with '-p 3000'."
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

function DecodeBase64EncodedString {
    Write-Host "Action: $function - decodes, prints, and copies a base64 encoded string to your clipboard."
    $base64String = $arg
    if ($base64String -eq [string]::empty) {
        Write-Host "No string provided."
    } else {
        $decodedBytes = [System.Convert]::FromBase64String($base64String)
        $decodedString = [System.Text.Encoding]::UTF8.GetString($decodedBytes)
        Set-Clipboard -Value $decodedString
        Write-Host "The result, shown below, has been copied to your clipboard:"
        Write-Host ""
        Write-Host $decodedString
    }
}

function EncodeStringAsBase64 {
    Write-Host "Action: $function - encodes, prints, and copies a string as base64 to your clipboard."
    $string = $arg
    if ($string -eq [string]::empty -or $string -eq $null) {
        Write-Host "No string provided."
    } else {
        $bytes = [System.Text.Encoding]::UTF8.GetBytes($string)
        $base64String = [System.Convert]::ToBase64String($bytes)
        Set-Clipboard -Value $base64String
        Write-Host "The result, shown below, has been copied to your clipboard:"
        Write-Host ""
        Write-Host $base64String
    }
}

function DecodeCertificatePemFile {
    Write-Host "Action: $function - decodes and prints the content of a certificate PEM file."
    $pemFile = $arg
    if ($pemFile -eq [string]::empty -or $pemFile -eq $null) {
        Write-Host "No file provided."
    } else {
        $pemContent = Get-Content -Path $pemFile
        DecodeCertificateString($pemContent)
    }
}

function DecodeCertificateString($certString) {
    if ($certString -eq [string]::empty -or $certString -eq $null) {
        $certString = $arg
    }
    if ($certString -eq [string]::empty -or $certString -eq $null) {
        Write-Host "No string provided."
    } else {
        $base64Cert = $certString -replace '-----BEGIN CERTIFICATE-----', '' -replace '-----END CERTIFICATE-----', '' -replace '\s+', ''
        $decodedBytes = [System.Convert]::FromBase64String($base64Cert)
        $certificate = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2 -ArgumentList @(,$decodedBytes)
        Write-Host "Content of decoded certificate:"
        Write-Host $certificate
        $certString = ""
    }
}

function DecodePrivateKeyPemFile {
    Write-Host "Action: $function - decodes and prints the content of a PEM private key file."
    $pemFile = $arg
    if ($pemFile -eq [string]::empty) {
        Write-Host "No file provided."
    } else {
        $base64PrivKey = $privKeyContent -replace '-----BEGIN PRIVATE KEY-----', '' -replace '-----END PRIVATE KEY-----', '' -replace '\s+', ''
        $decodedBytes = [System.Convert]::FromBase64String($base64PrivKey)
        $stringPrivKey = [System.Text.Encoding]::UTF8.GetString($decodedBytes)
        Write-Output "Content of the private key:"
        Write-Output $stringPrivKey
    }
}

function Help {
    Write-Host "Action: $function - lists available commands."
    Write-Host "[ Docker ]"
    Write-Host "drcv       : Remove unused containers and volumes"
    Write-Host "drv        : Remove unused volumes"
    Write-Host "dsrc       : Stop and remove all containers"
    Write-Host "dsrcv      : Stop and remove all containers and volumes"
    Write-Host "nmc        : Spin up new MySQL container and copies environment variables to clipboard"
    Write-Host "mp         : Copy MySQL container port number to clipboard"
    Write-Host "mid        : Set MySQL container id as variable"
    Write-Host "mc         : Execute a MySQL command in a container (use with argument 'container_name::command' or just 'command')"
    Write-Host "infv       : Copies variables of running local infra with localstack and MySQL to clipboard"
    Write-Host "[ System ]"
    Write-Host "where      : Find path of an executable"
    Write-Host "gp         : Get TCP connections (for port specified)"
    Write-Host "pr         : Get process information for a given PID"
    Write-Host "[ Java ]"
    Write-Host "j17        : Switch to Java Temurin 17"
    Write-Host "j21        : Switch to Java Temurin 21"
    Write-Host "ginit      : Set Gradle init file to active or inactive"
    Write-Host "[ Security ]"
    Write-Host "decb64     : Decodes and prints a base64 encoded string (use with base64 string as argument)"
    Write-Host "encb64     : Encodes and prints a string as base64 (use with string as argument)"
    Write-Host "deccertstr : Decodes and prints the content certificate (use with certificate string as argument)"
    Write-Host "deccertpem : Decodes and prints the content of a PEM certificate file (use with absolute file path as argument)"
    Write-Host "deckeypem  : Decodes and prints the content of a PEM private key file (use with absolute file path as argument)"
    Write-Host "[ Utility ]"
    Write-Host "uuid       : Generate a random UUID"
    Write-Host "ulid       : Generate a random ULID"
    Write-Host "ulids      : Generate a random ULID silently i.e only copy to clipboard"
    Write-Host "fixfe      : Recursively searches for package.json files in a repo and makes ports Powershell syntax compatible"
    Write-Host "?          : Show this list of parameters"
}

function ExecuteParameter($function, $arg) {
    if ($null -ne $arg) {
        Write-Host "Argument: '$arg' - will be ignored if function does not require it."
    }
    switch ($function) {
        {$_ -eq "nmc"} { SpinUpNewMysqlDockerContainer }
        {$_ -eq "mp"} { GetMysqlDockerContainerPortNumber }
        {$_ -eq "mid"} { GetMysqlDockerContainerId }
        {$_ -eq "mc"} { ExecuteCommandInMySqlContainer($arg) }
        {$_ -eq "j17"} { SwitchTo-Java17 }
        {$_ -eq "j21"} { SwitchTo-Java21 }
        {$_ -eq "gp"} { GetPortInfo }
        {$_ -eq "pr"} { GetProcessInfo }
        {$_ -eq "where"} { WhereIs($arg) }
        {$_ -eq "drcv" -or $_ -eq "drmcv"} { RemoveUnusedDockerContainersAndVolumes }
        {$_ -eq "drv" -or $_ -eq "drmv"} { RemoveUnusedDockerVolumes }
        {$_ -eq "dsrc"} { StopAndRemoveAllDockerContainers }
        {$_ -eq "dsrcv"} { StopAndRemoveUnusedDockerContainersAndVolumes }
        {$_ -eq "uuid"} { GenerateUuid }
        {$_ -eq "ulid"} { GenerateUlid }
        {$_ -eq "ulids"} { GenerateUlidSilently }
        {$_ -eq "ginit"} { ToggleGradleInitFile }
        {$_ -eq "fixfe"} { FixPackageJsonPortsNames }
        {$_ -eq "encb64"} { EncodeStringAsBase64($arg) }
        {$_ -eq "decb64"} { DecodeBase64EncodedString($arg) }
        {$_ -eq "deccertpem"} { DecodeCertificatePemFile($arg) }
        {$_ -eq "deccertstr"} { DecodeCertificateString($arg) }
        {$_ -eq "deckeypem"} { DecodePrivateKeyPemFile($arg) }
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
# Initiate OMP styling
oh-my-posh init pwsh --config "$HOME\oh-my-posh\emodipt-kim.omp.json" | Invoke-Expression

# Set general PowerShell settings
Set-PSReadLineKeyHandler -Chord Ctrl+u -Function RevertLine
Set-PSReadLineKeyHandler -Chord "Tab" -Function ForwardWord
# Set-Location -Path "$HOME"
$env:POWERSHELL_UPDATECHECK = 'Off'

# Refresh Chocolatey profile (so that .$profile will refresh Chocolatey profile after a choco install)
Import-Module $env:ChocolateyInstall\helpers\chocolateyProfile.psm1

# Import the Chocolatey Profile
# Be aware that if you are missing these lines from your profile, tab completion for `choco` will not function.
# See https://ch0.co/tab-completion for details.
$ChocolateyProfile = "$env:ChocolateyInstall\helpers\chocolateyProfile.psm1"
if (Test-Path($ChocolateyProfile)) {
    Import-Module "$ChocolateyProfile"
}

# Initialise aliases
Set-Alias -Name idea -Value "$HOME\AppData\Local\Programs\IntelliJ IDEA Ultimate\bin\idea64.exe"
Set-Alias -Name webstorm -Value "$HOME\AppData\Local\Programs\WebStorm\bin\webstorm64.exe"
Set-Alias -Name rider -Value "$HOME\AppData\Local\Programs\Rider\bin\rider64.exe"
Set-Alias -Name rustrover -Value "$HOME\AppData\Local\Programs\RustRover\bin\rustrover64.exe"
Set-Alias -Name vim -Value 'nvim'
Set-Alias -Name c -Value clear
Set-Alias -Name '..' -Value cd..
Set-Alias -Name '...' -Value cd.. ; cd..
Set-Alias -Name '....' -Value cd.. ; cd.. ; cd..
Set-Alias -Name '.....' -Value cd.. ; cd.. ; cd.. ; cd..

# Enable folder shortcuts
function fo {
    switch ($args[0]) {
        { $_ -eq "user" -or $_ -eq "home" } { Set-Location -Path "$HOME" }
        { $_ -eq "downloads" -or $_ -eq "dl" } { Set-Location -Path "$HOME\Downloads" }
        { $_ -eq "proper" } { Set-Location -Path "$HOME\projects" }
        { $_ -eq "nvim" } { Set-Location -Path "$HOME\AppData\Local\nvim" } 
        { $_ -eq "help" -or $_ -eq "h" -or $_ -eq "?" }
            Write-Host "Recognised are: user/home, proper, dl/downloads, nvim." 
        }
        default { 
            Write-Host "Error: Folder not recognised. Run 'fo help' for a list of recognised folders."
            Write-Host "Attempting to run 'cd $args' instead..."
            $ErrorActionPreference = 'SilentlyContinue'
            Set-Location -Path $args[0] 
            $ErrorActionPreference = 'Continue'
        }
    }
}


# Allow opening files in VS Code e.g. 'fi ssh'
function fi {
    switch ($args[0]) {
        { $_ -eq "ssh" } { code "$HOME\.ssh\config" } 
        { $_ -eq "aws" } { code "$HOME\.aws\config" } 
        { $_ -eq "profile" -or $_ -eq "p" } { code "$HOME\Documents\PowerShell\Microsoft.PowerShell_profile.ps1" } 
        { $_ -eq "kim" } { code "$HOME\Documents\PowerShell\Scripts\kim.ps1" }
        { $_ -eq "tridactyl" } { code "$HOME\.config\tridactyl\tridactlyrc" } 
        { $_ -eq "wezterm" } { code "$HOME\.wezterm.lua" } 
        { $_ -eq "yazi" } { code "$HOME\AppData\Roaming\yazi\config\yazi.toml" } 
        default { 
            Write-Host "Error: File not recognised." 
            Write-Host "Recognised files are ssh, aws, p/profile, kim, tridactyl, wezterm, yazi."
        }
    }
}

# Set y as yazi shortcut and return to yazi directory in the terminal
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
