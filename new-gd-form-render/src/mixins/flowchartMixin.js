/*
 * @Author: caohao
 * @Date: 2021-04-09 10:53:57
 * @LastEditors: caohao
 * @LastEditTime: 2021-05-18 10:52:43
 * @Description:流程图的mixins ['radio', 'checkbox', 'money', 'inputNumber','daterange'] 必填时
 */
import { mutations } from '../observable/flowcharts'
export default {
  inject: ['formRender'],
  watch: {
    value(newVal) {
      // 组件可以作为流程条件 必填  （注：在流程发起和审批时 在业务组建立主动调用流程图渲染  并且流程图不可变）
      /**
       * 
       */
      // if (this.dataInfo.type === 'dept') {
      //   debugger
      // }
      if (this.dataInfo.options.isCondition && this.dataInfo.options.required && this.$attrs.formType === 'start') {
        // mutations.setFlowChartParams({ [this.dataInfo.model]: newVal })
        // this.formRender.renderFlowChart()
        this.formRender.contionChange()
      }
    }
  },
}