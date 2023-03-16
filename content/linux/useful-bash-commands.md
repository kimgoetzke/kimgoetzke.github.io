---
title: "Basic Bash commands"
date: 16 Mar 2023
draft: false
tags: [Bash, Linux]
toc: true
---
## Basic Bash commands

### Selected basics
```bash
ls # List contents of directory
```

{{< hint info >}}
Add `-1` to display results in a single column. Add `-l` to see more details. Use `ls "/[dir_name]"` to set absolute path and navigate there. 
{{< /hint >}}


```bash
pwd # Print working directory 
mv # Move directory or rename 
touch file.txt # Create file.txt in current folder
rm # Remove file/directory (add -r to delete everything inside it i.e. recursively)
```

{{< hint info >}}
Get `ranger` (console file manager) to improve the entire navigation experience. When using `ranger`, you can use `Shift` + `S` to navigate to the current directory. Type `exit` after that to close the instance and return to ranger. Use `Shift` + `Q` to quit ranger.
{{< /hint >}}

### Refresh/reload profile
```bash
. ~/.bashrc
```

### Set a variable
```bash
echo "Please enter a bucket name: "; read bucket; export MYBUCKET=$bucket
```

### Save variable to .bashrc
```bash
echo "export MYBUCKET=$MYBUCKET" >> ~/.bashrc
```

### Download file
```bash
wget https://www.somewhere.com/file.zip
```

### Unzip file
```bash
unzip file.zip -d ~/webapp1
```

### Set & remove alias
```bash
alias # Show all
alias rm="rm -i" # Add alias
unalias rm # Remove alias
```
{{< hint info >}}
To set it permanently for all future bash sessions add such line to your `.bashrc` file in your $HOME directory.

To set it permanently, and system wide (all users, all processes) add set variable in `/etc/environment`.
{{< /hint >}}


### Convert DOS file format to ISO, ASCI or 7bit

{{< hint warning >}}
This should only be required when you do something silly such as creating text files in your WSL in Windows Explorer and then hope you can use them in the same way in Linux. Reference: https://linux.die.net/man/1/dos2unix (DOS/MAC to UNIX text file format converter).
{{< /hint >}}

```bash
sudo apt install dos2unix # Install dos2unix
dos2unix -c iso test.sh newtest.sh # Converts by creating new file
```

### Viewing files
```bash
cat -n [file_name] [file_name] # Concatenate files with row numbers
less [file_name] # Scroll through file
head -5 [file_name] # Display first 5 rows of file
head -c 5 [file_name] # Display first 5 characters of file
tail -5 [file_name] # Display last 5 rows of file
```

## Bash scripts

### Full update, upgrade and clean-up

```bash
#!/bin/bash
rm -rf /var/lib/dpkg/lock-frontend
rm -rf /var/lib/dpkg/lock
apt-get update
apt-get upgrade -y
apt-get dist-upgrade -y
apt-get autoremove -y
apt-get autoclean -y
echo 'Update, upgrade, and clean-up executed.'
```

## Useful resources

### General

1. [Online Bash Shell](https://www.onlinegdb.com/online_bash_shell)
2. [ShellCheck – shell script analysis tool](https://www.shellcheck.net/)
3. [TLDR pages/help for commands](https://tldr.sh/)
4. [Awesome List of CLI/TUI programs](https://github.com/toolleeo/cli-apps)


### Specific topics

1. [How to use grep command in Linux/Unix with examples](https://www.cyberciti.biz/faq/howto-use-grep-command-in-linux-unix/)
2. [Bash Test Operators Cheat Sheet - Kapeli](https://kapeli.com/cheat_sheets/Bash_Test_Operators.docset/Contents/Resources/Documents/index)
3. [Oh My Posh - Prompt theme engine for any shell](https://ohmyposh.dev/docs/)
    {{< hint info >}}
Add `eval "$(oh-my-posh init bash --config ~/.poshthemes/catppuccin_macchiato.omp.json)"` to `.bashrc`
    {{< /hint >}}
4. [Ranger - Console file manager](https://github.com/ranger/ranger)
