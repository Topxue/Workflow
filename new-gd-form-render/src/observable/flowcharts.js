/*
 * @Author: caohao
 * @Date: 2021-04-09 13:47:30
 * @LastEditors: caohao
 * @LastEditTime: 2021-04-29 10:32:54
 * @Description: 流程时间轴相关得响应式数据  (暂时没用)
 */
import Vue from 'vue'
// import { renderFlowChart } from '../api/flow.js'
export const store = Vue.observable({
  flowChartParams: {},
  flowChartList: []
})

export const mutations = {
  setFlowChartParams(val) {
    store.flowChartParams = {
      ...store.flowChartParams,
      ...val
    }
  },
  renderFlowChart(processDefinitionId, nodeType, userInfo) {
    renderFlowChart({ conditionMap: store.flowChartParams, processDefinitionId }).then(res => {
      store.flowChartList = res.data.map(item => {
        let rules = []
        item.properties.actionerRules.forEach(rule => {
          rule.approvals.forEach(val => {
            rules.push(val)
          })
        })
        return {
          ...item,
          rules: rules.map(item => item.userName),
          nodeTypeName: nodeType[item.nodeType]
        }
      })
      store.flowChartList.unshift({
        rules: [userInfo.userName],
        nodeTypeName: '发起人',
        nodeType: 'start',
        nodeStatus: 'finish'
      })
    })
  },
  clearFlowChart() {
    store.flowChartList = []
    store.flowChartParams = {}
  }
}
