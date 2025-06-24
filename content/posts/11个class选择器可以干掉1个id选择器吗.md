---
title: 11个class选择器可以干掉1个id选择器吗
categories:
  - css
tags:
  - css
date: 2020-05-27 16:29:48
---

今天遇到一个有趣的问题，class 选择器权重是 10，id 选择器权重是 100，那么 11 个 class 选择器可以干掉 1 个 id 选择器吗？😂

<!--more-->

先来一段简单的 html 测试下：

```html
<div id="k" class="a b c d e f g h i j k">xxxxx</div>
<div class="a">
  <div class="b">
    <div class="c">
      <div class="d">
        <div class="e">
          <div class="f">
            <div class="g">
              <div class="h">
                <div class="i">
                  <div class="j">
                    <div class="k" id="m">xxxx</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<style>
  .a.b.c.d.e.f.g.h.i.j.k {
    background: black;
  }

  .a .b .c .d .e .f .g .h .i .j .k {
    background: red;
  }

  #k {
    background: green;
  }

  #m {
    background: yellow;
  }
</style>
```

发现并不能，难道选择器的权重不是 10 和 100？

查了 MDN，同时通过 Google 搜索发现，张鑫旭大佬以前写过的一篇文章，总结如下：
以前浏览器通过 8 位字节存储选择器，于是同时出现 256 个选择器溢出到了 id 区域，但是现在这个问题早被 Chrome 修复了。
其它浏览器未验证，当然这只是一种有趣的极端情况，平常开发中应该不会遇到。

> [有趣：256 个 class 选择器可以干掉 1 个 id 选择器](https://www.zhangxinxu.com/wordpress/2012/08/256-class-selector-beat-id-selector/)
