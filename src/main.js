import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

import './assets/icons'
import './assets/style/workflow.css'
import './assets/style/nodewarper.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

const ProcessFormRender = require('../new-gd-form-render/main').default

import nodeWrap from './components/nodeWrap'
import addNode from './components/addNode'

Vue.use(addNode)
Vue.use(nodeWrap)
Vue.use(ProcessFormRender)

Vue.component('addNode', addNode) //初始化组件
Vue.component('nodeWrap', nodeWrap) //初始化组件

Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    el.focus()
  }
})

Vue.use(ElementUI, {
  size: 'small'
})

Vue.config.productionTip = false

Vue.prototype.$axios = axios
Vue.prototype.$cacheMap = new Map()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
