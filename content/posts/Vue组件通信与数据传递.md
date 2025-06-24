---
title: Vue组件通信与数据传递
categories:
  - vue
tags:
  - vue
  - components
date: 2019-08-19 15:01:54
---

Vue 组件通信整理：

<!--more-->

```html
<div id="app">
  <h2># parent & child</h2>
  <ol>
    <li>props[$attrs & $listeners] $emit[.sync]</li>
    <li>$parent $children/ref</li>
    <li>eventBus</li>
    <li>Vuex $root</li>
    <li>slot</li>
    <li>provide inject</li>
  </ol>
  <parent-child :name.sync="name" ref="parentChild" @say="receive"></parent-child>
  <button @click="childFn">What's your name, parent-child?</button>
  Change Name: <input type="text" v-model="name" />
  <hr />

  <h2># child & child</h2>
  <ol>
    <li>子->父->子</li>
    <li>eventBus</li>
    <li>Vuex $root</li>
  </ol>
  <child-brother></child-brother>
  <child-sister></child-sister>
</div>
```

```js
Vue.component('parent-child', {
  // 数据：父->子
  props: ['name'],
  methods: {
    alertName() {
      alert('I am ' + this.name)
    },
    say() {
      this.$emit('say', 'I am fine')
    },
    parentFn() {
      this.$parent.receive()
    },
  },
  template: `
    <div>
      <p>Name: {{name}}</p>
      <button @click="say">Say something</button>
      <button @click="parentFn">Hello Parent?</button>
      <button @click="$emit('update:name', 'Awesome Jack')">Change name self</button>
    </div>
  `,
})

Vue.component('child-brother', {
  methods: {
    sayHello() {
      eventBus.$emit('talking', 'Hello')
    },
  },
  template: `
    <div>
      <p>brother</p>
      <button @click="sayHello">hello my sister</button>
    </div>
  `,
})

Vue.component('child-sister', {
  mounted() {
    eventBus.$on('talking', (words) => {
      alert('Received from brother: ' + words)
    })
  },
  template: `
    <div>
      <p>sister waiting brother takling...</p>
    </div>
  `,
})

let eventBus = new Vue()
new Vue({
  el: '#app',
  data() {
    return {
      name: 'Jack',
    }
  },
  methods: {
    // 事件：父->子
    childFn() {
      // $refs or $children
      this.$refs.parentChild.alertName()
    },
    receive(msg) {
      if (msg) {
        alert(`${this.name} said: ${msg}`)
      } else {
        alert('Received: Nothing')
      }
    },
  },
})
```

运行 Demo 见：https://codepen.io/itibbers/pen/yLBJddd
