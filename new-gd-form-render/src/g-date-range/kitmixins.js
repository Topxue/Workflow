
/*
 * @Author: caohao
 * @Date: 2021-03-23 10:51:29
 * @LastEditors: caohao
 * @LastEditTime: 2021-06-04 17:24:28
 * @Description: 该组件做为请假套件里的控件时 处理一些业务
 */
// import { vacationDuration } from '../api/kit-leave'
export default {
  props: ['kit-data'],
  data() {
    return {
      vacationId: ''
    }
  },
  methods: {
    // 覆盖observerMixins中更新数据的方法
    updatedServer() {
      let that = this
      return function () {
        this.update = function (context) {
          that.vacationId = context
          let cols = that.kitData.columns[0].columns
          // 请假类型的数据对象
          let vacationData = cols.find(item => item.model === 'vacationId')
          let getContext = vacationData.options.options.find(item => item.value === context)
          let dateType = getContext && getContext.leaveUnit
          let { type, format } = that.getDateType(dateType)
          that.dataInfo.options.type = type
          that.dataInfo.options.format = format
          that.dataInfo.options.durationUnit = dateType
          that.value = ''
          that.dateVal = ''
          that.dateTime = ''
          that.timeSolt = ['am', 'am']
        }
      }
    },
    getDateType(type) {
      switch (type) {
        case 'day':
          return { type: 'daterange', format: 'yyyy-MM-dd' } //日期
        case 'hour':
          return { type: 'datetimerange', format: 'yyyy-MM-dd HH:mm' } // 日期+时间
        case 'longTime':
          return { type: 'halftime', format: 'yyyy-MM-dd' } //日期+上午/下午
        default:
          return { type: 'daterange', format: 'yyyy-MM-dd' } //日期
      }
    },
    // 根据开始时间和结束时间 计算时长
    vacationDuration(dateObj) {
      if (dateObj.startTime && dateObj.endTime && this.vacationId) {
        vacationDuration({ vacationId: this.vacationId, startTime: dateObj.startTime, endTime: dateObj.endTime }).then(res => {
          if (res.code === 10000) {
            this.$refs.duration.duration = res.data
            this.value = { ...this.value, duration: res.data, ...dateObj }
            this.durationDisable = true
          }
        }).catch(err => {
          const errCode = [78219, 78220, 78223, 78226, 78350, 78351]
          /**
           * 78219 假期余额不组
           * 78220 休息时间不允许请假
           * 78223 当前时间已有请假信息
           * 78226 假期余额不足
           * 78350 未获取到假期信息
           * 78351 当前时间段内已有请假信息
           */
          if (errCode.includes(err.code)) { // 假期余额不组
            this.$refs.duration.duration = ''
            this.value = { ...this.value, duration: '' }
            this.durationDisable = false
          }
        })
      }
    }
  },

}
