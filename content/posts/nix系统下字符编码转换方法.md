---
title: '类 unix 系统下字符编码转换方法'
date: 2016-06-22 09:09:40
categories:
  - daily
tags:
  - linux
---

用 windows 的时候，如果把 gbk 转换为 utf8，有几个方法，一是记事本另存为，但是存在 BOM 的问题，另一种方法是通过不产生 BOM 的软件，如 vim，sublime 来 code 或保存，太过麻烦。

今天无意中发现了 Mac 系统下，有个 iconv 的命令，可以非常方便的转换字符编码。

```bash
iconv -f gbk -t utf-8 gbk.cpp > utf8.cpp
```

配合管道输出，简直不能更方便。

不光 Mac 系统有，所有类 unix 系统都有这个命令。

```bash
NAME
       iconv - character set conversion

SYNOPSIS
       iconv [OPTION...] [-f encoding] [-t encoding] [inputfile ...]
       iconv -l

```
