/*
 * @Author: caohao
 * @Date: 2020-12-03 11:37:31
 * @LastEditors: caohao
 * @LastEditTime: 2020-12-03 11:37:53
 * @Description:面包屑组件
 */
import Index from './index.vue'
Index.install = Vue => {
  Vue.component(Index.name, Index)
}
export default Index
