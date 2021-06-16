<template>
  <div class="add-node-btn-box">
    <div class="add-node-btn">
      <el-popover placement="right-start" v-model="visible" :width="336">
        <div class="add-node-popover-body">
          <a class="add-node-popover-item approver" @click="addType('approveNode')">
            <div class="item-wrapper">
              <span class="iconfont"></span>
            </div>
            <p>审批人</p>
          </a>
          <a class="add-node-popover-item notifier" @click="addType('notifierNode')">
            <div class="item-wrapper">
              <span class="iconfont"></span>
            </div>
            <p>抄送人</p>
          </a>
          <!-- 第一版：暂无此功能 -->
          <!-- <a class="add-node-popover-item condition" @click="addType('workerNode')">
            <div class="item-wrapper">
              <svg-icon icon-class="workNo" class-name="work-no"></svg-icon>
            </div>
            <p>办理</p>
          </a> -->
          <a class="add-node-popover-item condition" @click="addType('conditionRouteNode')">
            <div class="item-wrapper">
              <span class="iconfont"></span>
            </div>
            <p>条件分支</p>
          </a>
        </div>
        <button class="btn" type="button" slot="reference">
          <span class="iconfont"></span>
        </button>
      </el-popover>
    </div>
  </div>
</template>
<script>
import {
  WORKER_NODE,
  APPROVE_NODE,
  NOTIFIER_NODE,
  CONDITION_NODE,
  CONDITION_ROUTE_NODE
} from '@/config'

export default {
  props: ['childNodeP', 'nodeConfig'],
  data() {
    return {
      visible: false
    }
  },
  methods: {
    addType(nodeType) {
      this.visible = false

      if (nodeType !== CONDITION_ROUTE_NODE) {
        this[nodeType] && this[nodeType]()
      } else {
        this.conditionRouteNode()
      }
    },

    getCurrentNodeId(type) {
      const random = Math.random()
        .toString(36)
        .slice(-7)

      return `${type}_${random}`
    },

    changeChildNode(params) {
      if (params.childNode) {
        params.childNode.preNodeId = params.nodeId
      }

      return params
    },

    changeConditionChildNode(params) {
      const conditionNodes = params.conditionNodes
      if (conditionNodes.length) {
        conditionNodes.forEach(item => {
          if (item.childNode) {
            item.childNode.preNodeId = item.nodeId
          }
        })
      }

      return params
    },

    // 审签节点
    approveNode() {
      const params = {
        nodeName: '审批人',
        error: true,
        nodeType: APPROVE_NODE,
        childNode: this.childNodeP,
        nodeId: this.getCurrentNodeId(APPROVE_NODE),
        preNodeId: this.nodeConfig.nodeId,
        properties: {
          formPropertyList: [],
          actionerRules: [
            {
              type: 'target_approval',
              actType: 'one_by_one',
              level: 1,
              autoUp: true,
              multi: 0,
              selectRange: 'all',
              approvals: []
            }
          ],
          noneActionerAction: 'forwardAdmin',
          activateType: 'and_all'
        }
      }

      this.$emit('update:childNodeP', this.changeChildNode(params))
    },
    // 办理节点
    workerNode() {
      const params = {
        nodeName: '办理人',
        error: true,
        nodeType: WORKER_NODE,
        childNode: this.childNodeP,
        nodeId: this.getCurrentNodeId(WORKER_NODE),
        preNodeId: this.nodeConfig.nodeId,
        properties: {
          formPropertyList: [],
          actionerRules: [
            {
              type: 'target_approval',
              actType: 'one_by_one',
              level: 1,
              autoUp: true,
              multi: 0,
              selectRange: 'all',
              approvals: []
            }
          ],
          noneActionerAction: 'forwardAdmin',
          activateType: 'and_all'
        }
      }

      this.$emit('update:childNodeP', this.changeChildNode(params))
    },

    // 抄送节点
    notifierNode() {
      const params = {
        nodeName: '抄送人',
        error: true,
        nodeType: NOTIFIER_NODE,
        ccSelfSelectFlag: 1,
        childNode: this.childNodeP,
        nodeId: this.getCurrentNodeId(NOTIFIER_NODE),
        preNodeId: this.nodeConfig.nodeId,
        properties: {
          actionerRules: [
            {
              type: 'target_approval',
              approvals: []
            }
          ]
        }
      }

      this.$emit('update:childNodeP', this.changeChildNode(params))
    },

    // 条件路由节点
    conditionRouteNode() {
      const nodeId = this.getCurrentNodeId(CONDITION_ROUTE_NODE)
      const params = {
        nodeName: '路由',
        nodeType: CONDITION_ROUTE_NODE,
        childNode: null,
        nodeId,
        preNodeId: this.nodeConfig.nodeId,
        conditionNodes: [
          {
            nodeName: '条件1',
            error: true,
            nodeType: CONDITION_NODE,
            properties: {
              formPropertyList: null,
              actionerRules: null,
              noneActionerAction: null,
              activateType: null,
              conditions: []
            },
            childNode: this.childNodeP,
            nodeId: this.getCurrentNodeId(CONDITION_NODE),
            preNodeId: nodeId
          },
          {
            nodeName: '条件2',
            nodeType: CONDITION_NODE,
            childNode: null,
            nodeId: this.getCurrentNodeId(CONDITION_NODE),
            preNodeId: nodeId,
            properties: {
              formPropertyList: null,
              actionerRules: null,
              noneActionerAction: null,
              activateType: null,
              conditions: []
            }
          }
        ]
      }

      this.$emit('update:childNodeP', this.changeConditionChildNode(params))
    }
  }
}
</script>
<style lang="scss" scoped>
.work-no {
  font-size: 23px;
}
</style>
