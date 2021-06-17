/*
 * @Author: caohao
 * @Date: 2021-03-22 14:51:25
 * @LastEditors: caohao
 * @LastEditTime: 2021-04-13 08:56:37
 * @Description:该组件作为套件里的控件时 处理一些业务
 */
// import { vacationBalance } from '../api/kit-leave'
export default {
  props: ['kit-data'],
  mounted() {
    if (this.dataInfo.options.isKit) {
      this.vacationBalance()
    }
  },
  methods: {
    /**
     * 作为请假套件时 根据开始时间和结束时间计算时长
     */
    vacationBalance() {
      vacationBalance().then(res => {
        if (res.code === 10000) {
          this.options = res.data.map(item => ({
            label: item.vacationName,
            value: item.vacationId,
            leaveUnit: item.leaveUnit
          }))
          this.dataInfo.options.options = this.options
        }
      })
    },
  },

}
