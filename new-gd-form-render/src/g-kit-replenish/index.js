/*
 * @Author: caohao
 * @Date: 2021-03-18 14:10:26
 * @LastEditors: caohao
 * @LastEditTime: 2021-03-18 14:10:36
 * @Description:补卡套件
 */
import Index from './index.vue'
Index.install = Vue => {
  Vue.component(Index.name, Index)
}
export default Index
