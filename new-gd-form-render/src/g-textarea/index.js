/*
 * @Author: caohao
 * @Date: 2020-09-27 16:50:40
 * @LastEditors: caohao
 * @LastEditTime: 2020-09-28 09:56:45
 * @Description:
 */
import Index from './index.vue'

Index.install = Vue => {
  Vue.component(Index.name, Index)
}
export default Index
