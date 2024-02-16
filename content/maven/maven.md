---
title: Maven
date: 2024-02-16
draft: false
series: [ "Build tool & automation" ]
tags: [ "Maven", "Java", "Build tool & automation" ]
toc: false
---

## Auto-configure client-side Git hooks running a formatter

You can use [Git Build Hook Maven Plugin](https://github.com/rudikershaw/git-build-hook) to configure a goal that
automatically installs Git hooks from any folder in the project.

Why? This allows having version controlled Git hooks that are set locally when running the project, ensuring your client
side Git configuration is consistent across the team. For example, you can make sure that formatters are always run as
pre-commit checks.

Assuming you have a file called `pre-commit` in the folder `.githooks`:

```xml

<plugin>
    <groupId>com.rudikershaw.gitbuildhook</groupId>
    <artifactId>git-build-hook-maven-plugin</artifactId>
    <version>3.4.1</version>
    <configuration>
        <installHooks>
            <pre-commit>.githooks/pre-commit</pre-commit>
        </installHooks>
    </configuration>
    <executions>
        <execution>
            <goals>
                <goal>install</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

Then, in `pre-commit` you can add your formatter (or anything else):

```bash
#!/bin/bash

./mvnw fmt:format
./mvnw xml-format:xml-format
git add $(git --no-pager diff --diff-filter=d --name-only --staged -- "**/*.java" "**/*.xml")
```

This will run the `fmt:format` and `xml-format:xml-format` goals before committing and add the changes to the staging
area.

Finally, you must enable `Run Git hooks` as part of your Commit checks in your IDE.