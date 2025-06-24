---
title: vue-programmatic-navigation-issue
categories:
  - vue
tags:
  - vue
  - vue-router
date: 2019-04-02 12:15:02
---

Question: $router.push({query})/replace not updating the URL.

<!--more-->

Example:

```js
handleSort({ column, prop, order }) {
    let query = this.$route.query

    query['_order_by'] = prop
    query['_order_desc'] = order === 'descending' ? 'asc' : 'desc'

    this.$router.push({
        query
    })
}
```

Perhaps you are reusing the reference to the same array in multiple route objects. Object.assign doesn't do a deep copy. Mutating an array doesn't trigger a route transition and in the subsequent route navigation triggered by `router.push` / `router.replace` the check in transitionTo recognizes no change since it compares the array to itself.

The solution is to work with an array like described here: [Pure javascript immutable array](https://vincent.billey.me/pure-javascript-immutable-array/)

But doing a deep copy is a very weird but also reliable way to not have to write your code overly complicated:

```js
let query = JSON.parse(JSON.stringify(this.$route.query))
```
