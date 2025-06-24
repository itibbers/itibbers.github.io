---
title: Composer安装时openssl missing
date: 2016-03-15 15:26:19
categories:
  - php
tags:
  - php
  - composer
  - error
---

问题描述：“The openssl extension is missing, which means that secure HTTPS transfers are impossible.”

确保 php.ini 中 extension=php_openssl.dll 打开。

php.ini 文件在 apache 和 php 目录下都有，建议都打开。
