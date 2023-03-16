---
title: Regex
draft: false
date: 2023-03-15
series: [ "Other" ]
tags: [ "Regex", "Java" ]
toc: true
---

## Key resources

- Compose and testing expressions: https://regex101.com/
- Regex number range generator: [Regex Numeric Range Generator — Regex Tools — 3Widgets](https://3widgets.com/)


## Shorthands for regex

There are several pre-defined shorthands for the commonly used character sets:
- `\d` is any digit, short for `[0-9]`
- `\s` is a whitespace character (including tab and newline), short for `[ \t\n\x0B\f\r]`
- `\w` is an alphanumeric character (word), short for `[a-zA-Z_0-9]`
- `\b` is a word boundary
    - A word boundary doesn't match any specific character, it rather matches a boundary between an alphanumeric character and a non-alphanumeric character - for example, a whitespace character - or a boundary of the string (the end or the start of it) - examples:
        - `\ba` matches any sequence of alphanumeric characters that starts with "a",
        - `a\b` matches any sequence of alphanumeric characters that ends with "a"
        - `\ba\b` matches a separate "a" preceded and followed by non-alphanumeric characters

There are also counterparts of these shorthands that are equivalent to the restrictive sets, and match everything except for the characters mentioned above:
- `\D` is a non-digit, short for `[^0-9]`
- `\S` is a non-whitespace character, short for `[^ \t\n\x0B\f\r]`
- `\W` is a non-alphanumeric character, short for `[^a-zA-Z_0-9]`
- `\B` is a non-word boundary
    - A non-word boundary matches the situation opposite to that one of the `\b` shorthand: it finds its match every time whenever there is no "gap" between alphanumeric characters - examples:
        - `a\B` matches a part of a string that starts with "a" followed by any alphanumeric character which, in its turn, is not followed by a word or a string boundary


## Any char

- `.` - any single character

## Any preceeding char

- `?`  - the preceding character or nothing
- `colou?r`  - colour or color but not colur or coloor
- `..?` - there can be any single character or no character at all


## Sets

- `[]` - groups of characters (to be placed inside the square brackets)
    - For example: `[ab]x[12]`  matches "a" or "b" followed by "x" followed by either "1" or "2".


## Ranges

Use `-` inside a set to create a range. Java example:
```java
String anyLetterPattern = "[a-z!?.A-Z]"; 
// matches any letter from a to z, A to Z, and any of the following: "!", "?", "."
```


## Alternations

Use `|` to indicate an "or". Java example:s 
```java
// Example 1:
String pattern = "yes|no|maybe"; 
// matches "yes", "no", or "maybe", but not "y" or "e"

// Example 2:
String pattern = "(b|r|go)at"; // matches "bat", "rat" or "goat"
String answer = "The answer is definitely (yes|no|maybe)";
```

## Quantifiers

Here is a list of quantifiers to be remembered:
- `+`  matches one or more repetitions of the preceding character;
- `*`  matches zero or more repetitions of the preceding character;
- `{n}`  matches exactly  n repetitions of the preceding character;
- `{n,m}` matches at least n but not more than  m repetitions of the preceding character;
- `{n,}`  matches at least n repetitions of the preceding character;
- `{0,m}`  matches no more than m repetitions of the preceding character.

Java examples:
```java
// Example 1:
String johnRegex = ".*John.*"; 
// it matches all strings containing the substring "John"

// Example 2:
String regex = "1{2,3}"; 
// Note that the range specified in curly braces both starts and ends inclusively 
"1".matches(regex);    // false 
"11".matches(regex);   // true 
"111".matches(regex);  // true 
"1111".matches(regex); // false
```

> An important clarification: Don't use spaces inside the curly braces. For example, `a{1, 2}` will match only the exact string "a{1, 2}", not "a" or "aa".


## Case insensitivity

You just need to add `(?i)` at the beginning of your regex. To make the dot character match the newline character, add `(?s)`. You can enable both modes by writing `(?is).`


## Backreference to match the same text again

`\1` matches the exact same text that was matched by the first capturing group. For example, in `(\b[a-z]+) /1` the `\1` will match whatever `(\b[a-z]+)` had matched i.e. a repetition. This is useful to replace duplicate words.


## Beginning or end of line

- `^` - the beginning of a line - example: `^[0-9]\s`
- `$` - the end of a line - example: `^[0-9]$`

## Negation / excluding characters

It is easy to define which characters are not wanted by writing the hat character `^` as the first one in the set.

- `^` - Any character, except the following
> Important: Must be inside the brackets e.g. `[^0-9]` - see [Beginning or end of line](#beginning-or-end-of-line) otherwise. 

### Capturing vs non-capturing groups

- `(\w+)` - group that captures any sequence of at least one alphanumeric character 
- `(?:\w)`


## Useful patterns

### Email

```re
^[a-zA-Z0-9_%+-.]+@[a-zA-Z]+\\.[a-zA-Z]+$
```
1. The e-mail username can consist of lowercase and uppercase Latin letters, digits and symbols `_%+-`.
2. The domain name (the part that comes after the `@` symbol in an e-mail address) can consist only of lowercase and uppercase Latin letters
3. The e-mail domain should include a subdomain and a top-level domain

### IP address

```re
^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$
```
- Does not allow for leading zeros

### UUID 

```re
^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$
```
- Case insensitive

## Regex in Java

### Escape characters

- Use escape characters to protect a regex special symbol by putting the backslash `\`
- Note that when you want to use the backslash (`\`) itself in its literal meaning, you need to escape it as well - This way, a double backslash (`\\`) in your regex means a single backslash in the matching string

> It gets more complicated when you implement such patterns in Java. The backslash works as an escape character not only for regular expressions but for String literals as well. So, in fact, we have to use an additional backslash to escape the one we need in the regular expression, just like this:
```java
String pattern = ".....\\.";

"a1b2c.".matches(pattern); // true
"Wrong.".matches(pattern); // true
"Hello!".matches(pattern); // false
```


### Pattern & Matcher in Java

```java
Scanner scanner = new Scanner(System.in);
String stringWithNumbers = scanner.nextLine();
Pattern pattern = Pattern.compile("\\d{10,}");
Matcher matcher = pattern.matcher(stringWithNumbers);
while (matcher.find()) {
    System.out.println(matcher.group() + ":" + (matcher.end() - matcher.start()));
}
```