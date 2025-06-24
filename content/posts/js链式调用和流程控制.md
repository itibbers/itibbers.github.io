---
title: js链式调用和流程控制
categories:
  - js
tags:
  - js
date: 2020-05-11 21:51:02
---

实现`new Person('xiaoming').say('hello').sleep(2).play('js').sleep(1).say('hhh')`

<!--more-->

链式调用没什么可说的 return this 就好了，此处的 sleep 乍一看确实会引发一些思考，关键是异步之后 this 在哪里，那这个时候可以创建一个异步队列。(js event loop)
整个实现可以分为三个核心部分：

1. 串接所有 this （通过 return this 的方式）
2. 把所有任务放到任务队列里面
3. 通过一个 next 方法有序执行队列里面的任务

具体实现如下：

```js
function Person(name) {
  this.tasks = []
  console.log(name + ': ')
  setTimeout(() => {
    this.next()
  })
  return this
}

Person.prototype = {
  next() {
    const fn = this.tasks.pop()
    fn && fn()
  },
  play(thing) {
    const fn = () => {
      console.log(`Playing ${thing}`)
      this.next()
    }
    this.tasks.unshift(fn)
    return this
  },
  say(thing) {
    const fn = () => {
      console.log(`Saying ${thing}`)
      this.next()
    }
    this.tasks.unshift(fn)
    return this
  },
  sleep(seconds) {
    const fn = () => {
      setTimeout(() => {
        // console.log(`Sleeping`)
        this.next()
      }, seconds * 1000)
    }
    this.tasks.unshift(fn)
    return this
  },
}

new Person('xiaoming').say('hello').sleep(2).play('js').sleep(1).say('hhh')
```
