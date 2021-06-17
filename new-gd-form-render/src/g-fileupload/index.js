import Index from './index.vue'

Index.install = Vue => {
  Vue.component(Index.name, Index)
}

export default Index