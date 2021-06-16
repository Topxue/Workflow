export default {
  /**
   * @desc 获取流程属性
   * @param {*} nodeConfig
   * @param {*} key
   * @returns {String}
   */
  getProperties(nodeConfig, key) {
    if (!nodeConfig || JSON.stringify(nodeConfig) === '{}') return false

    return nodeConfig?.properties[key] || ''
  },

  /**
   * @desc 获取审签设置属性
   * @param {*} nodeConfig
   * @returns {String}
   */
  getActionerRules(nodeConfig) {
    if (!nodeConfig || JSON.stringify(nodeConfig) === '{}') return false

    return this.getProperties(nodeConfig, 'actionerRules')[0] || []
  },

  /**
   * @desc 获取审签设置下单个属性
   * @param {*} nodeConfig
   * @param {*} key
   * @returns {String}
   */
  getActionerPropertie(nodeConfig, key) {
    if (!nodeConfig || JSON.stringify(nodeConfig) === '{}') return false

    return this.getActionerRules(nodeConfig)[key]
  },


  /**
   * @desc 设置properties多个属性
   * @param {*} nodeConfig
   * @param {*} params
   * @returns {nodeConfig object}
   */
  updateProperties(nodeConfig, params) {
    if (!nodeConfig) return {}
    nodeConfig.properties = { ...nodeConfig.properties, ...params }

    return nodeConfig
  },

  /**
   * @desc  update ActionerRules
   * @param {*} nodeConfig
   * @param {*} params
   * @returns {nodeConfig object}
   */
  updateActionerRules(nodeConfig, params) {
    const actionerRules = this.getActionerRules(nodeConfig)

    nodeConfig.properties.actionerRules[0] = { ...actionerRules, ...params }

    return nodeConfig
  }
}
