---
title: Useful Docker commands
draft: false
date: 2023-03-14
series: [ "Docker" ]
tags: [Docker]
toc: true
---

## Basic Docker commands
### List all local images
```shell
docker images
```
```shell
docker image ls
```
{{< hint info >}}
The parameter `-q` will ensure only Ids are listed.
{{< /hint >}}
```shell
docker image ls -q
```

### List all containers
```shell
docker ps
```

{{< hint info >}}
The parameter `-a` will include stopped containers.
{{< /hint >}}
```shell
docker ps -a
```

> List all *and* don't truncate columns (for example, to see entrypoints)
```shell
docker ps --no-trunc
```

### Remove a single image
```shell
docker image rm [image_id]
```

### Remove all image
> This command will result in an error if an image currently used in a container.
```shell
docker image rm $(docker image ls -q)
```

### Remove all containers
```shell
docker container rm -f $(docker container ls -a -q)
```

### Create/run container
```shell
docker run --name [name_of_container] [image_name_to_use]
```

### Go into container
> Execute bash inside container with an abbreviated or full id (e.g. `5a432b61b585`).

{{< hint info >}}
The parameter `-it` stands for interactive mode.
{{< /hint >}}
```shell
docker exec -it [container_id] bash
```

## Basic Docker Compose commands
{{< hint info >}}
Using the parameter `-d` starts the containers in the background and leaves them running. Without it, you'll see the logs but need to open another shell/terminal.
{{< /hint >}}
```shell
docker compose up -d
```

```shell
docker compose down
```

## Docker & Postgres
### Create Postgres database container
```shell
docker run -d --name db -p 5432:5432 -e POSTGRES_PASSWORD=password / 
    -e POSTGRES_USER=postgres -e POSTGRES_DB=postgres_db postgres
```
> Creates and runs container with... 
> - name=`db`
> - mapping port `5432` to the same local port
> - setting password=`password` and username=`username`
> - creates a db with the name `postgres`
> - and uses image `postgres` to create the container.
