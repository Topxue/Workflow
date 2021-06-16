import * as types from '../types/index'

const state = {
  // 发起人
  userIds: [],
  nodeConfig: {},
  // 流程权限发起人
  flowPermission: [],
  // 发起人表单权限
  formPropertyList: [],
  // 已经作为条件的数据
  alreadyConditions: [{name: 'Testing...'}],
  formJsonData: {
    columns: []
  }
}

const mutations = {
  [types.NODE_CONFIG]: (state, nodeConfig) => {
    state.nodeConfig = nodeConfig
  },

  [types.FLOW_PERMISSION]: (state, flowPermission) => {
    state.flowPermission = flowPermission
  },

  [types.FORM_PROPERTY_LIST]: (state, formPropertyList) => {
    state.formPropertyList = formPropertyList
  },

  [types.USER_IDS]: (state, userIds) => {
    state.userIds = userIds
  },

  [types.ALREADY_CONDITION]: (state, alreadyConditions) => {
    state.alreadyConditions = alreadyConditions
  }
}

const actions = {
  [types.FLOW_PERMISSION]: ({commit}, flowPermission) => {
    commit(types.FLOW_PERMISSION, flowPermission)
  }
}


export default {
  namespaced: true,
  state,
  actions,
  mutations,
}
