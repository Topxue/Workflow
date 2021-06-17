/*
 * @Author: caohao
 * @Date: 2021-03-15 17:15:52
 * @LastEditors: caohao
 * @LastEditTime: 2021-03-15 17:17:00
 * @Description:请假套件
 */
import Index from './index.vue'
Index.install = Vue => {
  Vue.component(Index.name, Index)
}
export default Index
