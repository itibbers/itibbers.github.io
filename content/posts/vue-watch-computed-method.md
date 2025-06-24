---
title: Vue methods vs watchers vs computed properties
categories:
  - vue
tags:
  - vue
  - watch
  - computed
  - methods
date: 2019-08-22 11:09:26
---

Vue.js provides us `watch`, `computed` and `methods` properties. When to use one vs the other?

<!--more-->

> When to use methods

1. To react on some event happening in the DOM
2. To call a function when something happens in your component. You can call a methods from computed properties or watchers.

> When to use computed properties

1. You need to compose new data from existing data sources
2. You have a variable you use in your template that’s built from one or more data properties
3. You want to reduce a complicated, nested property name to a more readable and easy to use one, yet update it when the original property changes
4. You need to reference a value from the template. In this case, creating a computed property is the best thing because it’s cached.
5. You need to listen to changes of more than one data property

> When to use watchers

1. You want to listen when a data property changes, and perform some action
2. You want to listen to a prop value change
3. You only need to listen to one specific property (you can’t watch multiple properties at the same time)
4. You want to watch a data property until it reaches some specific value and then do something
