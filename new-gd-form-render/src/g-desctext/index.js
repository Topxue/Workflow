/*
 * @Author: caohao
 * @Date: 2021-04-29 17:19:43
 * @LastEditors: caohao
 * @LastEditTime: 2021-04-29 17:20:11
 * @Description:说明文字
 */
import Index from './index.vue'

Index.install = Vue => {
  Vue.component(Index.name, Index)
}
export default Index
