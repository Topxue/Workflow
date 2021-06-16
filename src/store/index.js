import Vue from 'vue'
import Vuex from 'vuex'

import getters from './getter'

import workflow from './modules/workflow'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    workflow
  },
  getters
})
