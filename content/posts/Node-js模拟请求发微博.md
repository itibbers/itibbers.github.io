---
title: Node.js模拟请求发微博
categories:
  - Node.js
tags:
  - node
  - npm
  - 发微博
date: 2018-02-16 13:42:07
---

新浪微博 SDK 需要申请 App key，极其不方便，通过 Node.js 模拟请求发送微博。

<!--more-->

# [weibo-post](https://github.com/itibbers/weibo-post)

Post weibo text from https based on node.

## Usage

Using npm:

```shell
$ npm i --save-dev weibo-post
```

In Node.js:

```js
var weiboPost = require('weibo-post')

weiboPost.setCookie('your weibo login cookie')
weiboPost.post('your post content')
```
