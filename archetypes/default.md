---
title: {{ replace .Name "-" " " | title }}
date: {{ .Date | time.Format "2006-01-02" }}
draft: false
tags: ["{{ replace .Name "-" " " | title }}"]
toc: false
---
