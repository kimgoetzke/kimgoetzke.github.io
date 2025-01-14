# About this project

Visit https://kimgoetzke.github.io/ to launch this page.

The purpose of this project was to refresh my CSS skills, practice Hugo and Bulma, and create a simple and accessible
way to host a few reminders.

## Demo

![Screenshots 1](./assets/screenshot-1.png)
![Screenshots 2](./assets/screenshot-2.png)
![Screenshots 3](./assets/screenshot-3.png)

## How to develop locally

- Run development server with `hugo server`
- Create a new page with `hugo new folder_name/page_name.md`

#### Using NixOS?

If you have `direnv` installed, `hugo` will be made available in your shell. If not, you can start a nix-shell with:

```nix
nix-shell -p hugo
```