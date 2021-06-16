/**
 * Tabs active 样式计算默认值
 */
export const DEFAULT_GOT_X = 150

/**
 * 图片下载地址
 */

export const BASE_URL = 'http://test.oaexpert.com/gateway/fdfs/token/download/'
export const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb21wYW55SWQiOiIyMDIxMDIwMzE4MTgzODI5NDAwNTc5MyIsImNsaWVudFR5cGUiOiJ3ZWIiLCJpZCI6IjIwMjAxMjA4MTEwMTQyOTUyMTIxODYyIiwidXNlck5hbWUiOiLnjovlhokiLCJleHAiOjE2MjE5NTg1MjJ9.t5rRpao9UXcuOzySgz_eSvk6HkyisZRz9m1ao8W1HyU'

/**
 * Tabs
 */
export const Tabs = [
  {
    tab: '基础设置',
    num: 1,
    isActive: true
  },
  {
    tab: '表单设计',
    num: 2,
    isActive: false
  },
  {
    tab: '流程设计',
    num: 3,
    isActive: false
  }
  /**
   * 配置注释: 第一期暂无此功能😂
   */
  // {
  //   tab: '高级设置',
  //   num: 4,
  //   isActive: false
  // }
]

/**
 * 人员类型type
 * type:TARGET_SELECT
 */

// 职位\角色
export const TARGET_LABEL = 'target_label'
// 发起人自选
export const TARGET_SELECT = 'target_select'
// 指定成员
export const TARGET_APPROVAL = 'target_approval'
// 发起人自己
export const TARGET_ORIGINATOR = 'target_originator'
// 部门主管
export const TARGET_MANAGEMENT = 'target_management'

/***
 * 会签类型 activateType
 */
export const OR_ONE = 'or_one'        //  或签（一名审批人同意或拒绝即可）
export const AND_ALL = 'and_all'      //  会签（须所有审批人同意）
export const ONE_BY_ONE = 'one_by_one'//  依次审批

/**
 * 选择范围 selectRange
 */
export const SELECT_RANGE_ALL = 'all'
export const SELECT_RANGE_DEPT = 'dept'

/**
 * 节点类型->nodeType
 * nodeType: START_NODE
 */

// 开始节点
export const START_NODE = 'startNode'
// 办理人节点
export const WORKER_NODE = 'workerNode'
// 审签节点
export const APPROVE_NODE = 'approveNode'
// 抄送人节点
export const NOTIFIER_NODE = 'notifierNode'
// 条件节点
export const CONDITION_NODE = 'conditionNode'
// 条件路由节点
export const CONDITION_ROUTE_NODE = 'conditionRouteNode'

/**
 * NodeType -> 映射RAG
 */
export const nodeTypeEnum = {
  [START_NODE]: 0,              // 发起人节点
  [APPROVE_NODE]: 1,           // 审签节点
  [CONDITION_NODE]: 2,        // 条件节点
  [NOTIFIER_NODE]: 2,        // 抄送人节点
  [WORKER_NODE]: 3,         // 办理人节点
  [CONDITION_ROUTE_NODE]: 4// 条件路由节点
}

/**
 * 审批人类型
 */
export const actionerRulesType = [
  {
    type: TARGET_APPROVAL,
    label: '指定成员'
  },
  /**
   * 配置注释： 第一期暂无此功能🤦‍♂️
   */
  // {
  //   type: TARGET_MANAGEMENT,
  //   label: '主管'
  // }, {
  //   type: TARGET_SELECT,
  //   label: '发起人自选'
  // },
  {
    type: TARGET_ORIGINATOR,
    label: '发起人自己'
  },
  {
    type: TARGET_LABEL,
    label: '角色'
  }
]

/**
 * placeholder
 */

export const placeholderEnum = {
  startNode: '发起人',
  approveNode: '审批人',
  workerNode: '办理人',
  notifierNode: '抄送人'
}

/**
 * 条件表达式
 */
export const rangeType = {
  lt: '<',
  gt: '>',
  le: '<=',
  eq: '=',
  ge: '>='
}

/**
 * @desc 生成随机ID
 * @returns {String}
 */
export const generateMathRandomNodeId = () => {
  return Math.random()
    .toString(36)
    .slice(-7)
}

/**
 * Mock: 流程设计默认参数
 */

export const getDefaultWorkflowConfig = () => {
  const nodeId = generateMathRandomNodeId()
  const startNodeId = `startNode_${nodeId}`
  return {
    'nodeId': startNodeId,
    'nodeName': '发起人',
    'nodeType': 'startNode',
    'properties': {
      'formPropertyList': [],
      'actionerRules': [
        {
          'approvals': []
        }
      ],
      'noneActionerAction': null,
      'activateType': null,
      'conditions': null
    },
    'childNode': {
      'nodeId': `approveNode_${nodeId}`,
      'nodeName': '审批人',
      'nodeType': 'approveNode',
      'properties': {
        'formPropertyList': [],
        'actionerRules': [
          {
            'multi': 1,
            'selectRange': 'all',
            'actType': '',
            'type': 'target_originator',
            'approvals': []
          }
        ],
        'noneActionerAction': 'forwardAdmin',
        'activateType': '',
        'conditions': null
      },
      'preNodeId': startNodeId,
      'childNode': {
        'preNodeId': `approveNode_${nodeId}`,
        'nodeName': '抄送人',
        'nodeType': 'notifierNode',
        'nodeId': `NotifierNode_${nodeId}`,
        'properties': {
          'actionerRules': [
            {
              'type': '',
              // "type": "target_select",
              'approvals': []
            }
          ]
        },
        'childNode': null,
        'error': false
      }
    }
  }
}
