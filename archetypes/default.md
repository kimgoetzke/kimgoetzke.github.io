---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date | time.Format "2 Jan 2006" }}
draft: false
tags: ["{{ replace .Name "-" " " | title }}"]
toc: false
---
