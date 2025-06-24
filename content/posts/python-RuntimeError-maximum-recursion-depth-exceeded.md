---
title: 'python - RuntimeError: maximum recursion depth exceeded'
date: 2015-09-27 21:55:42
categories:
  - python
tags:
  - runtime
  - error
---

用 Python 写了一个爬虫脚本，在抓取页面采用广度优先遍历抓取。但是当遍历到 900 多时就会出现莫名其妙的错误，通过 pdb 调试发现是：

`RuntimeError: maximum recursion depth exceeded`

在网上查了，发现 python 默认的递归深度是很有限的，大概是 900 多的样子，当递归深度超过这个值的时候，就会引发这样的一个异常。

解决的方式是手工设置递归调用深度，方式为

```python
import sys
sys.setrecursionlimit(1000000) # 例如这里设置为一百万
```
