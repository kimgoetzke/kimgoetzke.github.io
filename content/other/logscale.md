---
title: Falcon LogScale
draft: false
date: 2023-12-07
series: [ "Other" ]
tags: [ "LogScale", "Logs" ]
toc: true
---

## Truncating fields

```regexp
replace("^(.{25}).*", with="$1", field=field_to_truncate, as="new_name_of_field") 
| groupBy([truncated_message])
```
- `^(.{25}).*` matches the first 25 characters of the field as a capturing group
- `with="$1"` replaces entire content with the capturing group only i.e. the first 25 characters

## Using capturing groups

Assume a field called `natural_message` with the following values:
```
UserDetails(id=123, name=Jill, age=30)
Some other message
UserDetails(id=456, name=Jill, age=30)
```

```regexp
natural_message=/(UserDetails.*(?<user_id>id=[0-9]+).*|.*name=(?<user_name>[A-z]+).*)/
| groupBy([user_name], function=count(as="user_count"))
```
- `UserDetails.*(?<user_id>id=[0-9]+).*` will return two capture both UserDetail logs and return `id={...}`
- `.*name=(?<user_name>[A-z]+).*` will return all logs and return 2 x`Jill` i.e. without the `name=`
- `groupBy([user_name])` will return the result as two columns `user_name` and `user_count` with a count of 2 for `Jill`

## Filtering fields by value

```regexp
in(level, values=["ERROR", "WARN"])
```
- Filters the `level` field to only `ERROR` and `WARN` values

## Combining fields

```regexp
format("%s@%s", field=[application, applicationVersion], as=Application)
```
- Combines the `application` and `applicationVersion` fields separated by `@` into a new field called `Application`

## Ordering by value

```regexp
sort("price", order=desc) 
```