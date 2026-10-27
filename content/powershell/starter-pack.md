---
title: Starter pack
date: 2023-05-23
draft: false
series: [ "PowerShell" ]
tags: [ Windows, Terminal, PowerShell, Scripts, Starters ]
toc: true
---

## kim.ps1

```powershell
#! /usr/bin/pwsh

$f=$args[0]
$remainingArgs=@($args | Select-Object -Skip 1)

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
    Write-Host "Action: $function - stops and removes all Docker containers, and removes all unused Docker volumes."
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
        Set-Variable -Name cn -Value $null -Scope Global
    } else {
        $containerId = $sql_container_name.Line.Split(" ")[0]
        Set-Clipboard -Value $containerId
        Set-Variable -Name cn -Value $containerId -Scope Global
        Write-Host "MySQL container id ($containerId) copied to clipboard and set as `$cn."
    }
}

function ExecuteCommandInMySqlContainer {
    Write-Host "Action: $function - executes a MySQL command in a Docker container e.g. local_mysql SHOW DATABASES (or just SHOW DATABASES)."
    if ($args.Count -eq 0) {
        Write-Host "Error: Provide a command, optionally preceded by a container name e.g. 'mc local_mysql SHOW DATABASES'."
        return
    }
    $containerId = docker ps -q -f "name=$($args[0])"
    if ($containerId) {
        Write-Host "Found container with name $($args[0])."
        $command = ($args | Select-Object -Skip 1) -join ' '
    } else {
        Write-Host "No container with name '$($args[0])' found. Treating all arguments as the command and fetching MySQL container id for you..."
        GetMysqlDockerContainerId
        if ($null -eq $cn) {
            return
        }
        $containerId = $cn
        $command = $args -join ' '
    }
    if ($command -eq [string]::empty) {
        Write-Host "Error: No command provided."
        return
    }
    Write-Host "Executing command: $command."
    docker exec -it $containerId bash -c "mysql -u test -ptest -e `"$command;`"" # Change accordingly
}

function CopyInfraVariablesToClipboard {
    Write-Host "Action: $function - copies variables of running local infra with localstack and MySQL to clipboard."
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

function WhereIs {
    Write-Host "Action: $function - finds path of an executable."
    $executableName = $args[0]
    if ($executableName -eq [string]::empty -or $executableName -eq $null) {
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
    Write-Host "Attempting to find location of $executableName.exe..."
    $ErrorActionPreference = 'SilentlyContinue'
    $executablePath = (Get-Command "$executableName.exe").Path
    if ($null -eq $executablePath) {
        Write-Host "Error: Executable $executableName.exe cannot be found."
    } else {
        Write-Host $executablePath
    }
}

function SwitchToJava17 {
    Write-Host "Action: $function - switches to specified Java version."
    $Env:JAVA_HOME="C:\Program Files\Eclipse Adoptium\jdk-17.0.20.101-hotspot\"
    $Env:Path="$Env:JAVA_HOME\bin;$Env:Path"
    Write-Host "Java Adoptium Temurin 17 activated."
}

function SwitchToJava21 {
    Write-Host "Action: $function - switches to specified Java version."
    $Env:JAVA_HOME="C:\Program Files\Eclipse Adoptium\jdk-21.0.8.9-hotspot\"
    $Env:Path="$Env:JAVA_HOME\bin;$Env:Path"
    Write-Host "Java Adoptium Temurin 21 activated."
}

function SwitchToJava25 {
    Write-Host "Action: $function - switches to specified Java version."
    $Env:JAVA_HOME="C:\Program Files\Eclipse Adoptium\jdk-25.0.4.101-hotspot\"
    $Env:Path="$Env:JAVA_HOME\bin;$Env:Path"
    Write-Host "Java Adoptium Temurin 25 activated."
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

function DecodeBase64EncodedString {
    Write-Host "Action: $function - decodes, prints, and copies a base64 encoded string to your clipboard."
    $base64String = $args -join ' '
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
    $string = $args -join ' '
    if ($string -eq [string]::empty) {
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

function DecodeCertificateString {
    $certString = $args -join ' '
    if ($certString -eq [string]::empty) {
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

function DecodeCertificatePemFile {
    Write-Host "Action: $function - decodes and prints the content of a certificate PEM file."
    $pemFile = $args -join ' '
    if ($pemFile -eq [string]::empty) {
        Write-Host "No file provided."
    } else {
        $pemContent = Get-Content -Path $pemFile -Raw
        DecodeCertificateString $pemContent
        # $base64Cert = $pemContent -replace '-----BEGIN CERTIFICATE-----', '' -replace '-----END CERTIFICATE-----', '' -replace '\s+', ''
        # $decodedBytes = [System.Convert]::FromBase64String($base64Cert)
        # $certificate = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2 -ArgumentList @(,$decodedBytes)
        # Write-Host "Content of decoded PEM certificate:"
        # Write-Host $certificate
    }
}

function DecodePrivateKeyPemFile {
    Write-Host "Action: $function - decodes and prints the content of a PEM private key file."
    $pemFile = $args -join ' '
    if ($pemFile -eq [string]::empty) {
        Write-Host "No file provided."
    } else {
        $privKeyContent = Get-Content -Path $pemFile -Raw
        $base64PrivKey = $privKeyContent -replace '-----BEGIN PRIVATE KEY-----', '' -replace '-----END PRIVATE KEY-----', '' -replace '\s+', ''
        $decodedBytes = [System.Convert]::FromBase64String($base64PrivKey)
        $stringPrivKey = [System.Text.Encoding]::UTF8.GetString($decodedBytes)
        Write-Output "Content of the private key:"
        Write-Output $stringPrivKey
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

function FixPackageJsonPortsNames {
    Write-Host "Action: $function - recursively searches through a repo for package.json files and replaces all occurrences of '-p `${PORT:=3000}' with '-p 3000'."
    Write-Host "Fetching files..."
    $files = Get-ChildItem -Path "$HOME\projects\some-repository" -Filter 'package.json' -Recurse -File
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

function UpdateAllRepositories {
    Write-Host "Action: $function - checks out the default branch and pulls, for every repository."
    & "$env:ProgramFiles\Git\bin\bash.exe" "$HOME\Documents\PowerShell\Scripts\update-repos.sh" @args
}

function Help {
    Write-Host "Action: $function - lists available commands."
    Write-Host "[ Docker ]"
    Write-Host "drcv       : Remove unused containers and volumes"
    Write-Host "drv        : Remove unused volumes"
    Write-Host "dsrc       : Stop and remove all containers"
    Write-Host "dsrcv      : Stop and remove all containers and volumes"
    Write-Host "nmc        : Spin up new MySQL container and copy environment variables to clipboard"
    Write-Host "mp         : Copy MySQL container port number to clipboard"
    Write-Host "mid        : Set MySQL container id as variable"
    Write-Host "mc         : Execute a MySQL command in a container (use with container name and command as arguments e.g. 'local_mysql SHOW DATABASES', or just the command to use the running MySQL container)"
    Write-Host "infv       : Copy variables of running local infra with localstack and MySQL to clipboard"
    Write-Host "[ System ]"
    Write-Host "gp         : Get TCP connections (for port specified)"
    Write-Host "pr         : Get process information for a given PID"
    Write-Host "where      : Find path of an executable"
    Write-Host "[ Java ]"
    Write-Host "j17        : Switch to Java Temurin 17"
    Write-Host "j21        : Switch to Java Temurin 21"
    Write-Host "j25        : Switch to Java Temurin 25"
    Write-Host "ginit      : Set Gradle init file to active or inactive"
    Write-Host "[ Security ]"
    Write-Host "decb64     : Decode and prints a base64 encoded string (use with base64 string as argument)"
    Write-Host "encb64     : Encode and prints a string as base64 (use with string as argument)"
    Write-Host "deccertstr : Decode and prints the content certificate (use with certificate string as argument)"
    Write-Host "deccertpem : Decode and prints the content of a PEM certificate file (use with absolute file path as argument)"
    Write-Host "deckeypem  : Decode and prints the content of a PEM private key file (use with absolute file path as argument)"
    Write-Host "[ Utility ]"
    Write-Host "uuid       : Generate a random UUID"
    Write-Host "ulid       : Generate a random ULID"
    Write-Host "ulids      : Generate a random ULID silently i.e only copy to clipboard"
    Write-Host "fixfe      : Search for package.json files recursively in a repo and make ports Powershell syntax compatible"
    Write-Host "ur         : Update all repositories i.e. check out the default branch and pull (use with repository names as arguments to skip them)"
    Write-Host "?          : Show this list of parameters"
}

function ExecuteParameter($function, $remainingArgs) {
    if ($remainingArgs) {
        Write-Host "Arguments: '$remainingArgs' - will be ignored if function does not require them."
    }
    switch ($function) {
        {$_ -eq "drcv" -or $_ -eq "drmcv"} { RemoveUnusedDockerContainersAndVolumes }
        {$_ -eq "drv" -or $_ -eq "drmv"} { RemoveUnusedDockerVolumes }
        {$_ -eq "dsrc"} { StopAndRemoveAllDockerContainers }
        {$_ -eq "dsrcv"} { StopAndRemoveUnusedDockerContainersAndVolumes }
        {$_ -eq "nmc"} { SpinUpNewMysqlDockerContainer }
        {$_ -eq "mp"} { GetMysqlDockerContainerPortNumber }
        {$_ -eq "mid"} { GetMysqlDockerContainerId }
        {$_ -eq "mc"} { ExecuteCommandInMySqlContainer @remainingArgs }
        {$_ -eq "infv"} { CopyInfraVariablesToClipboard }
        {$_ -eq "gp"} { GetPortInfo }
        {$_ -eq "pr"} { GetProcessInfo }
        {$_ -eq "where"} { WhereIs @remainingArgs }
        {$_ -eq "j21"} { SwitchToJava21 }
        {$_ -eq "j25"} { SwitchToJava25 }
        {$_ -eq "ginit"} { ToggleGradleInitFile }
        {$_ -eq "decb64"} { DecodeBase64EncodedString @remainingArgs }
        {$_ -eq "encb64"} { EncodeStringAsBase64 @remainingArgs }
        {$_ -eq "deccertstr"} { DecodeCertificateString @remainingArgs }
        {$_ -eq "deccertpem"} { DecodeCertificatePemFile @remainingArgs }
        {$_ -eq "deckeypem"} { DecodePrivateKeyPemFile @remainingArgs }
        {$_ -eq "uuid"} { GenerateUuid }
        {$_ -eq "ulid"} { GenerateUlid }
        {$_ -eq "ulids"} { GenerateUlidSilently }
        {$_ -eq "fixfe"} { FixPackageJsonPortsNames }
        {$_ -eq "ur"} { UpdateAllRepositories @remainingArgs }
        {$_ -eq "?" -or $_ -eq "help"} { Help }
        default { Write-Host "Error: Invalid parameter. No action taken."; break }
    }
}

if ($null -eq $f) {
    Write-Host "Need to provide one parameter (and optionally arguments). No action taken."
} else {
    ExecuteParameter $f $remainingArgs
}

Write-Host ""
```

{{< hint info >}}
Save this script with any name (e.g. your name) and the `.ps1` extension. Add the script's location to `PATH` in your
environment variables. Remember to update any locations used in the script (e.g. for switching Java versions). Then run
the script with e.g. `kim ?` to display the available commands.
{{< /hint >}}

## Microsoft.PowerShell_profile.ps1

```powershell
# Initiate OMP styling
oh-my-posh init pwsh --config "$HOME\.config\oh-my-posh\kim-dark-island.omp.json" | Invoke-Expression

# Set general PowerShell settings
Set-PSReadLineKeyHandler -Chord Ctrl+u -Function RevertLine
Set-PSReadLineKeyHandler -Chord "Tab" -Function ForwardWord
Set-PSReadLineOption -Colors @{
    Command = "`e[38;2;86;168;245m"      # Dark Island blue/functions
    Parameter = "`e[38;2;199;125;187m"   # Dark Island purple/constants
    String = "`e[38;2;106;171;115m"      # Dark Island green/strings
    Variable = "`e[38;2;207;142;109m"    # Dark Island orange/keywords
}

# Disable PowerShell update warnings - may no longer work here; consider setting as an environment variable
$env:POWERSHELL_UPDATECHECK = 'Off'

# Set preferred editor for file-opening shortcuts (used by function fi below)
$PREFERRED_EDITOR = 'zed'

# Set preferred agent harness (used by function pr below)
$PREFERRED_AGENT = 'claude'

# Some IDEs set the working directory via -WorkingDirectory but PowerShell sometimes ignores it.
# This ensures we stay where the IDE puts us, assuming that you start the terminal in the IDE with:
# cmd /c "set IDE_TERMINAL=1 & pwsh"
# if ($env:IDE_TERMINAL) {
#     return
# }

# Refresh Chocolatey profile (so that .$profile will refresh Chocolatey profile after a choco install)
Import-Module $env:ChocolateyInstall\helpers\chocolateyProfile.psm1

# Import the Chocolatey Profile
# Be aware that if you are missing these lines from your profile, tab completion for `choco` will not function. See https://ch0.co/tab-completion for details.
$ChocolateyProfile = "$env:ChocolateyInstall\helpers\chocolateyProfile.psm1"
if (Test-Path($ChocolateyProfile)) {
    Import-Module "$ChocolateyProfile"
}

# Declare aliases for git
function Invoke-GitPull
{
    & git pull @args
}
Set-Alias -Name gp -Value Invoke-GitPull -Option AllScope -Force
function Invoke-GitCheckoutDefault
{
    & git show-ref --verify --quiet refs/heads/main
    if ($LASTEXITCODE -eq 0)
    {
        & git checkout main
    } else
    {
        & git checkout master
    }
}
Set-Alias -Name gcd -Value Invoke-GitCheckoutDefault -Option AllScope -Force
function Invoke-GitBranch
{
    & git branch -a
}
Set-Alias -Name gb -Value Invoke-GitBranch -Option AllScope -Force

# Set miscellaneous aliases
Set-Alias -Name c -Value clear
Set-Alias -Name vim -Value 'nvim'
Set-Alias -Name idea -Value "$HOME\AppData\Local\Programs\IntelliJ IDEA Ultimate\bin\idea64.exe"
Set-Alias -Name webstorm -Value "$HOME\AppData\Local\Programs\WebStorm\bin\webstorm64.exe"
Set-Alias -Name rider -Value "$HOME\AppData\Local\Programs\Rider\bin\rider64.exe"
Set-Alias -Name rustrover -Value "$HOME\AppData\Local\Programs\RustRover\bin\rustrover64.exe"
Set-Alias -Name '..' -Value cd..
function ... { Set-Location -Path ..\.. }
function .... { Set-Location -Path ..\..\.. }
function ..... { Set-Location -Path ..\..\..\.. }

# Enable folder shortcuts
function fo {
    switch ($args[0]) {
        { $_ -eq "user" -or $_ -eq "home" } { Set-Location -Path "$HOME" }
        { $_ -eq "downloads" -or $_ -eq "dl" } { Set-Location -Path "$HOME\Downloads" }
        { $_ -eq "pro" } { Set-Location -Path "$HOME\projects" }
        { $_ -eq "nvim" } { Set-Location -Path "$HOME\AppData\Local\nvim" }
        { $_ -eq "yazi" } { Set-Location -Path "$HOME\AppData\Roaming\yazi\config" }
        { $_ -eq "pi" } { Set-Location -Path "$HOME\.pi\agent" }
        { $_ -eq "claude" } { Set-Location -Path "$HOME\.claude" }
        { $_ -eq "help" -or $_ -eq "h" -or $_ -eq "?" }
            Write-Host "Recognised are: user/home, dl/downloads, pro, nvim, yazi, pi, claude." 
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


# Allow opening files in your $PREFERRED_EDITOR e.g. 'fi ssh'
function fi {
    switch ($args[0]) {
        { $_ -eq "ssh" } { & $PREFERRED_EDITOR "$HOME\.ssh\config" } 
        { $_ -eq "aws" } { & $PREFERRED_EDITOR "$HOME\.aws\config" } 
        { $_ -eq "profile" -or $_ -eq "p" } { & $PREFERRED_EDITOR "$HOME\Documents\PowerShell\Microsoft.PowerShell_profile.ps1" } 
        { $_ -eq "kim" } { & $PREFERRED_EDITOR "$HOME\Documents\PowerShell\Scripts\kim.ps1" }
        { $_ -eq "tridactyl" } { & $PREFERRED_EDITOR "$HOME\.config\tridactyl\tridactlyrc" } 
        { $_ -eq "wezterm" } { & $PREFERRED_EDITOR "$HOME\.wezterm.lua" } 
        { $_ -eq "yazi" } { & $PREFERRED_EDITOR "$HOME\AppData\Roaming\yazi\config\yazi.toml" } 
        default { 
            Write-Host "Error: File not recognised." 
            Write-Host "Recognised files are ssh, aws, p/profile, kim, tridactyl, wezterm, yazi."
        }
    }
}

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

# Review or explain a GitHub pull request from anywhere
function pr
{
    param([string]$Url, [string]$Mode)
    if (-not $Url -or -not $Mode)
    {
        Write-Host "Error: Usage is pr {pull request URL} {review|explain} [instructions]."
        return
    }
    if ($Mode -ne "review" -and $Mode -ne "explain")
    {
        Write-Host "Error: Mode must be 'review' or 'explain', not '$Mode'."
        return
    }
    if ($Url -notmatch "github\.com/([^/]+)/([^/]+)/pull/(\d+)")
    {
        Write-Host "Error: Not a GitHub pull request URL: $Url"
        return
    }
    $owner = $Matches[1]
    $repository = $Matches[2]
    $number = $Matches[3]
    $path = $null
    foreach ($root in @("$HOME\projects")) # Comma-separated list of folders to check
    {
        if (Test-Path -Path "$root\$repository")
        {
            $path = "$root\$repository"
            break
        }
    }
    if (-not $path)
    {
        $path = "$HOME\projects\$repository"
        Write-Host "Cloning $owner/$repository into $path..."
        & gh repo clone "$owner/$repository" $path
        if ($LASTEXITCODE -ne 0)
        {
            Write-Host "Error: Could not clone $owner/$repository."
            return
        }
    }
    Set-Location -Path $path
    & git fetch --quiet origin
    $skill = switch ($PREFERRED_AGENT)
    {
        'claude' { "/$Mode-pr" }
        'codex' { "`$$Mode-pr" }
        default { "/skill:$Mode-pr" } # Pi
    }
    & $PREFERRED_AGENT "$skill $number $args"
}
```

## update-repos.sh

```shell
#!/bin/sh
# Checks out the default branch and pulls, for every git repo in $REPOSITORY_BASE_FOLDER,
# or in ~/projects when that variable is unset or empty.
# Repo names given as arguments are skipped, e.g. ./update-repos.sh some-repo other-repo
set -u

base_folder="${REPOSITORY_BASE_FOLDER:-$HOME/projects}"

# Never updated, whatever the arguments say.
always_excluded="agent-storage"

failures=""
excluded=" $always_excluded $* "

for directory in "$base_folder"/*/
do
  [ -e "$directory/.git" ] || continue
  name=$(basename "$directory")

  case "$excluded" in
    *" $name "*)
      printf '%s: skipped\n' "$name"
      continue
      ;;
  esac

  branch=$(git -C "$directory" symbolic-ref --quiet --short refs/remotes/origin/HEAD 2>/dev/null | sed 's|^origin/||')
  if [ -z "$branch" ]
  then
    for candidate in main master
    do
      git -C "$directory" show-ref --verify --quiet "refs/heads/$candidate" 2>/dev/null && branch=$candidate && break
    done
  fi
  if [ -z "$branch" ]
  then
    failures="$failures$name: no default branch (main/master) found
"
    continue
  fi

  printf '%s (%s): ' "$name" "$branch"

  if ! error=$(git -C "$directory" checkout "$branch" 2>&1)
  then
    printf 'checkout failed\n'
    failures="$failures$name: checkout $branch failed - $(printf '%s' "$error" | head -n 1)
"
    continue
  fi

  if ! error=$(git -C "$directory" pull --ff-only 2>&1)
  then
    printf 'pull failed\n'
    failures="$failures$name: pull failed - $(printf '%s' "$error" | head -n 1)
"
    continue
  fi

  printf 'ok\n'
done

if [ -n "$failures" ]
then
  printf '\nNot updated:\n'
  printf '%s' "$failures" | sed 's/^/  /'
else
  printf '\nAll repositories updated.\n'
fi
```
