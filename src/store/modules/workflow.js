import * as types from '../types/workflow-types'

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
    "columns": [{
      "value": "",
      "type": "money",
      "icon": "form-money",
      "options": {
        "width": "100%",
        "defaultValue": "",
        "required": true,
        "disabled": false,
        "pattern": "/(^[1-9]([0-9]+)?(.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9].[0-9]([0-9])?$)/",
        "placeholder": "请输入金额",
        "remoteFunc": "func_1623897092000_18073",
        "isCondition": true,
        "iscapital": true,
        "condition": ""
      },
      "name": "金额",
      "key": "1623897092000_18073",
      "model": "money_1623897092000_18073",
      "rules": [{
        "required": true,
        "message": "金额必须填写"
      }, {"pattern": "/(^[1-9]([0-9]+)?(.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9].[0-9]([0-9])?$)/", "message": "金额格式不匹配"}]
    }, {
      "value": "",
      "type": "inputNumber",
      "icon": "form-inputNumber",
      "options": {
        "width": "100%",
        "defaultValue": "",
        "required": true,
        "dataType": "",
        "pattern": "/^[0-9]+(.[0-9]{1,20})?$/",
        "placeholder": "",
        "disabled": false,
        "unit": "",
        "isCondition": true,
        "condition": "",
        "remoteFunc": "func_1623897096000_85810"
      },
      "name": "数字输入框",
      "key": "1623897096000_85810",
      "model": "inputNumber_1623897096000_85810",
      "rules": [{"required": true, "message": "数字输入框必须填写"}, {
        "pattern": "/^[0-9]+(.[0-9]{1,20})?$/",
        "message": "数字输入框格式不匹配"
      }]
    }], "config": {"labelWidth": 100, "labelPosition": "top", "size": "small"}
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
