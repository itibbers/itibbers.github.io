---
title: An invalid form control with name='xxx' is not focusable.
date: 2016-11-22 13:43:18
categories:
  - frontend
tags:
  - form
  - js
  - css
---

在表单提交时，如果某个控件被设置为 `display: none` 且该字段可以为空，则必须移除 `required` 属性，否则在 Chrome 浏览器中会出现错误。

Chrome 浏览器要求必填字段不能为空，因此会弹出"请在此输入"的提示消息。但是，如果该控件被隐藏，Chrome 浏览器在表单提交时无法聚焦到该控件，因为它是不可见的，从而导致表单提交失败。

要解决这个问题，当通过 JavaScript 隐藏控件时，我们也必须同时移除该控件的 `required` 属性。
