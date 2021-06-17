/*
 * @Author: caohao
 * @Date: 2021-03-18 14:07:11
 * @LastEditors: caohao
 * @LastEditTime: 2021-03-18 14:07:30
 * @Description:加班套件
 */
import Index from './index.vue'
Index.install = Vue => {
  Vue.component(Index.name, Index)
}
export default Index
