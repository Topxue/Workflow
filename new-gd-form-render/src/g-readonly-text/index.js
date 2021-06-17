/*
 * @Author: caohao
 * @Date: 2021-06-10 14:50:13
 * @LastEditors: caohao
 * @LastEditTime: 2021-06-10 14:50:27
 * @Description:只读文字的组件
 */
import Index from './index.vue'

Index.install = Vue => {
  Vue.component(Index.name, Index)
}
export default Index
