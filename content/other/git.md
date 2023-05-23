---
title: Git
date: 23 May 2023
draft: false
tags: ["Git", "GitHub"]
toc: false
---
## Useful Git workflows
### Temporarily undoing changes
Regular one-off stash:
```powershell
# Moves all local changes to the stash
git stash

# Moves last stashed changes back to local (i.e. re-applies them)
git stash pop
```

Named stash:
```powershell 
git stash push -m "name_of_stash"

git stash list

# Replace 0 in the below by any number in the list
git stash apply "stash@{0}"

# Alternatively, apply using saved name/message
git stash apply "name_of_stash"
```
### Initial setup
```powershell
# Get username (and more)
git config --list

# Set username and email
git config --global user.name "My Name"
git config --global user.email myEmail@example.com
```

### Switch to repo that exists on remote origin but not locally
```powershell
# Fetch latest remote changes or simply overwrite with 'git pull'
git fetch

# Show branches available to checkout
git branch -v -a

# Switch to branch that doesn't exist locally
git switch [name_of_branch]
```



