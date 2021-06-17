<template>
  <div>
    <div class="node-wrap" v-if="nodeConfig.nodeType !== 'conditionRouteNode'">
      <!-- 发起人-审批人容器 -->
      <div class="node-wrap-box" :class="getStartClassName()">
        <div>
          <div
              class="title"
              :class="{ 'work-node': nodeConfig.nodeType === 'workerNode' }"
              :style="
              'background: rgb(' +
                ['87, 106, 149', '255, 148, 62', '50, 150, 250'][
                  nodeTypeEnum[nodeConfig.nodeType]
                ] +
                ');'
            "
          >
            <span class="iconfont" v-show="nodeConfig.nodeType === 'approveNode'"></span>
            <span class="iconfont" v-show="nodeConfig.nodeType === 'notifierNode'"></span>
            <svg-icon
                v-show="nodeConfig.nodeType === 'workerNode'"
                icon-class="workno-h"
                class-name="work-node-h"
            ></svg-icon>
            <span v-if="nodeConfig.nodeType === 'startNode'">{{ nodeConfig.nodeName }}</span>
            <input
                type="text"
                maxlength="10"
                class="ant-input editable-title-input"
                v-if="nodeConfig.nodeType !== 'startNode' && isInput"
                @blur="blurEvent()"
                @focus="$event.currentTarget.select()"
                v-focus
                v-model="nodeConfig.nodeName"
                :placeholder="placeholderEnum[nodeConfig.nodeType]"
            />
            <span
                class="editable-title"
                @click="clickEvent()"
                v-if="nodeConfig.nodeType !== 'startNode' && !isInput"
            >
              {{ nodeConfig.nodeName }}
            </span>
            <i
                class="anticon anticon-close close"
                v-if="nodeConfig.nodeType !== 'startNode'"
                @click="delNode()"
            ></i>
          </div>
          <div class="content" @click="setPerson">
            <div class="text" v-if="nodeConfig.nodeType === 'startNode'">
              {{ getSponsor() || '所有人' }}
            </div>
            <div class="text" v-if="nodeConfig.nodeType === 'approveNode'">
              <span class="placeholder" v-if="!setApproverStr(nodeConfig)">
                请选择{{ placeholderEnum[nodeConfig.nodeType] }}
              </span>
              {{ setApproverStr(nodeConfig) }}
            </div>
            <div class="text" v-if="nodeConfig.nodeType === 'workerNode'">
              <span class="placeholder" v-if="!setApproverStr(nodeConfig)">
                请选择{{ placeholderEnum[nodeConfig.nodeType] }}
              </span>
              {{ setApproverStr(nodeConfig) }}
            </div>
            <div class="text" v-if="nodeConfig.nodeType === 'notifierNode'">
              <span class="placeholder" v-if="!copyerStr(nodeConfig)">
                请选择{{ placeholderEnum[nodeConfig.nodeType] }}
              </span>
              {{ copyerStr(nodeConfig) }}
            </div>
            <i class="anticon anticon-right arrow"></i>
          </div>
          <div class="error_tip" v-if="isTried && nodeConfig.error">
            <i class="anticon anticon-exclamation-circle" style="color: rgb(242, 86, 67);"></i>
          </div>
        </div>
      </div>
      <addNode :childNodeP.sync="nodeConfig.childNode" :nodeConfig.sync="nodeConfig"></addNode>
    </div>

    <div class="branch-wrap" v-if="nodeConfig.nodeType === 'conditionRouteNode'">
      <div class="branch-box-wrap">
        <div class="branch-box">
          <button class="add-branch" @click="addTerm">添加条件</button>
          <div class="col-box" v-for="(item, index) in nodeConfig.conditionNodes" :key="index">
            <div class="condition-node">
              <div class="condition-node-box">
                <div class="auto-judge" :class="isTried && item.error ? 'error active' : ''">
                  <div class="sort-left" v-if="index != 0" @click="arrTransfer(index, -1)">
                    <i class="el-icon-arrow-left"></i>
                  </div>
                  <div class="title-wrapper">
                    <input
                        type="text"
                        class="ant-input editable-title-input"
                        v-if="isInputList[index]"
                        @blur="blurEvent(index)"
                        @focus="$event.currentTarget.select()"
                        v-focus
                        v-model="item.nodeName"
                    />
                    <span
                        class="editable-title"
                        @click="clickEvent(index)"
                        v-if="!isInputList[index]"
                    >
                      {{ item.nodeName || `条件${Number(index + 1)}` }}
                    </span>
                    <span class="priority-title" @click="setPerson(index + 1)">
                      优先级{{ index + 1 }}
                    </span>
                    <svg-icon
                        icon-class="copy-cond"
                        class-name="anticon anticon-copy copy"
                        @click="copyCondition(index)"
                    ></svg-icon>
                    <i class="anticon anticon-close close" @click="delTerm(index)"></i>
                  </div>
                  <div
                      class="sort-right"
                      v-if="index != nodeConfig.conditionNodes.length - 1"
                      @click="arrTransfer(index)"
                  >
                    <i class="el-icon-arrow-right"></i>
                  </div>
                  <div class="content" @click="setPerson(index + 1)">
                    {{ conditionStr(item, index) }}
                  </div>
                  <div class="error_tip" v-if="isTried && item.error">
                    <i
                        class="anticon anticon-exclamation-circle"
                        style="color: rgb(242, 86, 67);"
                    ></i>
                  </div>
                </div>
                <addNode :childNodeP.sync="item.childNode" :nodeConfig="item"></addNode>
              </div>
            </div>
            <nodeWrap
                v-if="item.childNode && item.childNode"
                :nodeConfig.sync="item.childNode"
                :isTried.sync="isTried"
                :directorMaxLevel="directorMaxLevel"
            ></nodeWrap>
            <div class="top-left-cover-line" v-if="index == 0"></div>
            <div class="bottom-left-cover-line" v-if="index == 0"></div>
            <div
                class="top-right-cover-line"
                v-if="index == nodeConfig.conditionNodes.length - 1"
            ></div>
            <div
                class="bottom-right-cover-line"
                v-if="index == nodeConfig.conditionNodes.length - 1"
            ></div>
          </div>
        </div>
        <addNode :childNodeP.sync="nodeConfig.childNode" :nodeConfig.sync="nodeConfig"></addNode>
      </div>
    </div>
    <!-- 发起人 -->
    <Sponsor
        @saveSponsor="saveSponsor"
        :promoterDrawer.sync="promoterDrawer"
        :startNodeConfig.sync="startNodeConfig"
        :flowPermissionList="getActionerRules()"
    />
    <!-- 审批人 -->
    <Approved
        @saveApprover="saveApprover"
        :directorMaxLevel="directorMaxLevel"
        :approverConfig.sync="approverConfig"
        :approverDrawer.sync="approverDrawer"
    />
    <!-- 办理人 -->
    <!--    <Worker-->
    <!--        :workerConfig.sync="workerConfig"-->
    <!--        :workerDrawer.sync="workerDrawer"-->
    <!--        :directorMaxLevel="directorMaxLevel"-->
    <!--        @saveWorker="saveWorker"-->
    <!--    />-->
    <!-- 抄送人 -->
    <Copyer
        @saveCopyer="saveCopyer"
        :copyerDrawer.sync="copyerDrawer"
        :copyerConfig.sync="copyerConfig"
    />
    <!-- 条件 -->
    <Condition
        :priorityLevel="priorityLevel"
        :conditionDrawer.sync="conditionDrawer"
        :conditionsConfig.sync="conditionsConfig"
        @saveCondition="saveCondition"
    />

    <nodeWrap
        v-if="nodeConfig.childNode && nodeConfig.childNode"
        :nodeConfig.sync="nodeConfig.childNode"
        :isTried.sync="isTried"
        :directorMaxLevel="directorMaxLevel"
    ></nodeWrap>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'

import helper from '@/utils/Helper'
import {arrToStr, copyerStr} from '@/utils'
import {
  AND_ALL,
  ONE_BY_ONE,
  START_NODE,
  WORKER_NODE,
  APPROVE_NODE,
  NOTIFIER_NODE,
  CONDITION_NODE,
  rangeType,
  nodeTypeEnum,
  placeholderEnum,
  generateMathRandomNodeId
} from '@/config'

import Copyer from './copyer'
import Sponsor from './sponsor'
// import Worker from './worker'
import Approved from './approved'
import Condition from './conditional'

// 请假类型 => model
// const LEAVE_TYPE = 'vacationId'

// 条件类型
const NUMBER_RANGE_CONDITION = 'number_range_condition'

export default {
  props: ['nodeConfig', 'flowPermission', 'directorMaxLevel', 'isTried'],
  components: {
    Copyer,
    Sponsor,
    // Worker,
    Approved,
    Condition
  },
  data() {
    return {
      copyerStr,
      nodeTypeEnum,
      placeholderEnum,
      priorityLevel: 1, // 优先级
      placeholderList: ['发起人', '审批人', '抄送人'],
      isInputList: [],
      isInput: false,
      promoterDrawer: false,
      approverDrawer: false,
      startNodeConfig: {},
      approverConfig: {},
      workerConfig: {},
      workerDrawer: false,
      copyerDrawer: false,
      copyerConfig: {},
      ccSelfSelectFlag: [],
      conditionDrawer: false,
      conditionsConfig: {
        conditionNodes: []
      }
    }
  },

  computed: {
    ...mapGetters(['userIds', 'formJsonData'])
  },

  mounted() {
    this.initNodeConfig()
  },

  methods: {
    initNodeConfig() {
      const nodeType = nodeTypeEnum[this.nodeConfig.nodeType]
      if (nodeType === 1) {
        this.nodeConfig.error = !this.setApproverStr(this.nodeConfig)
      } else if (nodeType == 2) {
        this.nodeConfig.error = !copyerStr(this.nodeConfig)
      } else if (nodeType == 4) {
        for (var i = 0; i < this.nodeConfig.conditionNodes.length; i++) {
          const curConditionNodes = this.nodeConfig.conditionNodes[i]
          curConditionNodes.error =
              this.conditionStr(curConditionNodes, i) == '请设置条件' &&
              i != this.nodeConfig.conditionNodes.length - 1

          const conditions = curConditionNodes?.properties?.conditions.flat(2)
          this.filterAlreadyConditions(this.nodeConfig.conditionNodes[i], conditions)
        }
      }
    },

    getActionerRules() {
      const nodeConfig = this.nodeConfig
      if (nodeConfig.nodeType === START_NODE) {
        return nodeConfig.properties.actionerRules
      }
    },

    // 获取开始节点Class-Name
    getStartClassName() {
      return this.nodeTypeEnum[this.nodeConfig.nodeType] == 0
          ? 'start-node'
          : '' + this.isTried && this.nodeConfig.error
              ? 'active error'
              : ''
    },

    getSponsor() {
      if (this.userIds?.length) {
        return arrToStr(this.userIds)
      }
    },

    clickEvent(index) {
      if (index || index === 0) {
        this.$set(this.isInputList, index, true)
      } else {
        this.isInput = true
      }
    },

    blurEvent(index) {
      if (index || index === 0) {
        this.$set(this.isInputList, index, false)
        this.nodeConfig.conditionNodes[index].nodeName = this.nodeConfig.conditionNodes[index]
            .nodeName
            ? this.nodeConfig.conditionNodes[index].nodeName
            : `条件${Number(index) + 1}`
      } else {
        this.isInput = false
        this.nodeConfig.nodeName = this.nodeConfig.nodeName
            ? this.nodeConfig.nodeName
            : placeholderEnum[this.nodeConfig.nodeType]
      }
    },

    applyUserConditionStr(conds) {
      return '发起人属于：' + conds.map(cond => cond.label).join('或') + ' 并且 '
    },

    numberConitions(item) {
      return `${item.paramLabel}${rangeType[item.rangeType]}${item.value}` + ' 并且 '
    },

    selectCondition(item) {
      if (item.conds.length) {
        // const isVacation = item.paramKey === LEAVE_TYPE
        // const content = item.conds.map(cond => cond[isVacation ? 'name' : 'id'])
        const content = item.conds.map(cond => cond.name)

        return `${item.paramLabel}属于：${content.join('或')}` + ' 并且 '
      } else {
        return ''
      }
    },

    conditionStr(item, index) {
      const conditions = item?.properties?.conditions.flat(2).reverse()
      if (conditions && conditions.length) {
        let str = ''
        conditions.forEach(item => {
          if (item.paramKey === 'applyUserId') {
            if (item.conds.length) {
              str += this.applyUserConditionStr(item.conds)
            }
          } else {
            const isNumberCondition = item.type === NUMBER_RANGE_CONDITION
            if (isNumberCondition) {
              str += this.numberConitions(item)
            } else {
              str += this.selectCondition(item)
            }
          }
        })

        return str ? str.substring(0, str.length - 4) : '请设置条件'
      } else {
        return index == this.nodeConfig.conditionNodes.length - 1 &&
        this.nodeConfig.conditionNodes[0]?.properties?.conditions?.length != 0
            ? '其他条件进入此流程'
            : '请设置条件'
      }
    },

    // 过滤已经设置为条件的表单数据(paramkey)
    filterAlreadyConditions(curNodeConfig, conditions) {
      const key = curNodeConfig.nodeId
      if (conditions && conditions.length) {
        const paramKeys = conditions.map(cond => cond.paramKey)

        this.$cacheMap.set(key, paramKeys)
      }
    },

    saveCondition(conditionsConfig) {
      this.conditionDrawer = false

      for (var i = 0; i < conditionsConfig.conditionNodes.length; i++) {
        conditionsConfig.conditionNodes[i].error =
            this.conditionStr(conditionsConfig.conditionNodes[i], i) == '请设置条件' &&
            i != conditionsConfig.conditionNodes.length - 1
      }

      this.$emit('update:nodeConfig', conditionsConfig)
    },

    saveCopyer(copyerConfig) {
      this.$emit('update:nodeConfig', copyerConfig)
    },
    setApproverStr(nodeConfig) {
      const actionerType = helper.getActionerPropertie(nodeConfig, 'type')
      return this[actionerType] && this[actionerType](nodeConfig)
    },

    // 指定成员
    target_approval(nodeConfig) {
      const actionerType = helper.getProperties(nodeConfig, 'activateType')
      const nodeUserList = helper.getActionerPropertie(nodeConfig, 'approvals')

      if (nodeUserList.length == 1) {
        return nodeUserList[0].userName
      } else if (nodeUserList.length > 1) {
        if (actionerType === ONE_BY_ONE) {
          return arrToStr(nodeUserList)
        } else if (actionerType === AND_ALL) {
          return nodeUserList.length + '人会签'
        } else {
          return nodeUserList.length + '人或签'
        }
      }
    },

    // 角色
    target_label(nodeConfig) {
      const getActioner = helper.getActionerRules(nodeConfig)
      const actType =
          getActioner.actType === AND_ALL ? '会签' : getActioner.actType === 'or_one' ? '或签' : ''

      if (getActioner.labelNames) {
        return getActioner.labelNames + actType
      } else {
        return ''
      }
    },

    // 部门主管
    target_management(nodeConfig) {
      const actType = helper.getActionerPropertie(nodeConfig, 'actType')
      const level = helper.getActionerPropertie(nodeConfig, 'level')

      const levelText = level == 1 ? '直接主管' : '第' + level + '级主管'

      if (actType === ONE_BY_ONE) {
        return levelText
      } else if (actType === AND_ALL) {
        return levelText + '会签'
      }
    },

    // 发起人自选
    target_select(nodeConfig) {
      const actionerRules = helper.getActionerRules(nodeConfig)

      return actionerRules.selectRange === 'all' ? '发起人从全公司中自选' : '发起人从整个部门中自选'
    },

    // 发起人自己
    target_originator() {
      return '发起人自己'
    },

    saveApprover(approverConfig) {
      approverConfig.error = !this.setApproverStr(approverConfig)

      this.updateNodeConfig(approverConfig)
    },

    saveWorker(workerConfig) {
      this.workerConfig.error = !this.setApproverStr(workerConfig)

      this.$emit('update:nodeConfig', workerConfig)
    },

    saveSponsor(startNodeConfig) {
      this.nodeConfig.properties = startNodeConfig

      this.updateNodeConfig(this.nodeConfig)
    },

    updateNodeConfig(nodeConfig) {
      this.$emit('update:nodeConfig', nodeConfig)
    },

    delNode() {
      // 更新preNodeId指向
      if (this.nodeConfig.childNode) {
        this.nodeConfig.childNode.preNodeId = this.nodeConfig.preNodeId
      }

      this.$emit('update:nodeConfig', this.nodeConfig.childNode)
    },

    addTerm() {
      const len = this.nodeConfig.conditionNodes.length + 1

      this.nodeConfig.conditionNodes.push({
        nodeName: '条件' + len,
        nodeType: CONDITION_NODE,
        childNode: null,
        properties: {
          formPropertyList: null,
          actionerRules: null,
          noneActionerAction: null,
          activateType: null,
          conditions: []
        },
        preNodeId: this.nodeConfig.nodeId,
        nodeId: `${CONDITION_NODE}_${generateMathRandomNodeId()}`
      })

      for (var i = 0; i < this.nodeConfig.conditionNodes.length; i++) {
        this.nodeConfig.conditionNodes[i].error =
            this.conditionStr(this.nodeConfig.conditionNodes[i], i) == '请设置条件' &&
            i != this.nodeConfig.conditionNodes.length - 1
      }
      this.$emit('update:nodeConfig', this.nodeConfig)
    },

    // 复制条件
    copyCondition(index) {
      const currentCondition = this.nodeConfig.conditionNodes[index]
      const copyCondition = JSON.parse(JSON.stringify(currentCondition))

      copyCondition.nodeName = currentCondition.nodeName + '（复制）'

      // 更新preNodeId指向
      this.updatePreNodeId(copyCondition)

      this.nodeConfig.conditionNodes.splice(index + 1, 0, copyCondition)
    },

    // 更新缓存条件数据
    updateCacheConditions(nodeConfig) {
      const conditionList = helper.getProperties(nodeConfig, 'conditions').flat(2)
      const paramKeys = conditionList.map(cond => cond.paramKey)

      this.$cacheMap.set(nodeConfig.nodeId, paramKeys)
    },

    updatePreNodeId(nodeConfig) {
      // 重新分配 nodeId 确保nodeId的唯一性
      nodeConfig.nodeId = `${nodeConfig.nodeType}_${generateMathRandomNodeId()}`

      if (nodeConfig.nodeType === CONDITION_NODE) {
        const conditionNodes = nodeConfig?.childNode?.conditionNodes
        if (conditionNodes && conditionNodes.length) {
          conditionNodes.forEach(condItem => {
            this.updateCacheConditions(condItem)
          })
        } else {
          this.updateCacheConditions(nodeConfig)
        }
      }

      if (nodeConfig.childNode) {
        nodeConfig.childNode.preNodeId = nodeConfig.nodeId

        this.updatePreNodeId(nodeConfig.childNode)
      }
    },

    // 刪除条件分支
    delTerm(index) {
      const conditionNodes = this.nodeConfig.conditionNodes
      const curRemoveCondition = conditionNodes.splice(index, 1)[0]
      this.deleteAlreadyConditions(curRemoveCondition, conditionNodes)

      for (var i = 0; i < conditionNodes.length; i++) {
        conditionNodes[i].error =
            this.conditionStr(conditionNodes[i], i) == '请设置条件' && i != conditionNodes.length - 1

        // 更新preNodeId指向
        const childNode = conditionNodes[i].childNode
        if (childNode) {
          // childNode.preNodeId = this.nodeConfig.preNodeId
          childNode.preNodeId = conditionNodes[i].nodeId
        }
      }

      this.$emit('update:nodeConfig', this.nodeConfig)

      if (conditionNodes.length === 1) {
        if (this.nodeConfig.childNode) {
          if (conditionNodes[0].childNode) {
            this.updateChildNodeData(conditionNodes[0].childNode, this.nodeConfig.childNode)
          } else {
            conditionNodes[0].childNode = this.nodeConfig.childNode
          }
        }

        // 更新preNodeId指向
        const childNode = conditionNodes[0].childNode
        if (childNode) {
          childNode.preNodeId = this.nodeConfig.preNodeId

          // 处理结束节点 -> preNodeId
          if (childNode.childNode) {
            childNode.childNode.preNodeId = childNode.nodeId
          }
          // childNode.preNodeId = conditionNodes[0].nodeId
        }

        this.$emit('update:nodeConfig', childNode)

        this.$cacheMap.delete(conditionNodes[0].nodeId)
      }
    },

    // 删除条件节点的同时删除更新store里已经作为条件的数据
    deleteAlreadyConditions(curNodeConfig, conditionNodes = []) {
      this.$cacheMap.delete(curNodeConfig.nodeId)

      if (curNodeConfig.childNode) {
        // 多分支-分支嵌套处理
        const conditionNodes = curNodeConfig?.childNode?.conditionNodes
        if (conditionNodes && conditionNodes.length) {
          conditionNodes.forEach(condItem => {
            this.deleteAlreadyConditions(condItem)
          })
        } else {
          this.deleteAlreadyConditions(curNodeConfig.childNode)
        }
      } else {
        // 从右往左删除
        if (conditionNodes?.length === 1) {
          this.deleteAlreadyConditions(conditionNodes[0])
        }
      }
    },

    updateChildNodeData(data, addData) {
      if (!data.childNode) {
        data.childNode = addData
      } else {
        this.updateChildNodeData(data.childNode, addData)
      }
    },

    setPerson(priorityLevel) {
      let {nodeType} = this.nodeConfig
      if (nodeType === START_NODE) {
        // 第一版:V1->暂时取消发起权限
        if (this.formJsonData?.columns?.length) {
          this.promoterDrawer = true
        }
        this.startNodeConfig = this.nodeConfig.properties
      } else if (nodeType === APPROVE_NODE) {
        this.approverDrawer = true
        this.approverConfig = JSON.parse(JSON.stringify(this.nodeConfig))
      } else if (nodeType === WORKER_NODE) {
        this.workerDrawer = true
        this.workerConfig = JSON.parse(JSON.stringify(this.nodeConfig))
      } else if (nodeType === NOTIFIER_NODE) {
        this.copyerDrawer = true
        this.copyerConfig = JSON.parse(JSON.stringify(this.nodeConfig))
        this.ccSelfSelectFlag =
            this.copyerConfig.ccSelfSelectFlag == 0 ? [] : [this.copyerConfig.ccSelfSelectFlag]
      } else {
        this.conditionDrawer = true
        this.priorityLevel = priorityLevel
        this.conditionsConfig = JSON.parse(JSON.stringify(this.nodeConfig))
      }
    },

    arrTransfer(index, type = 1) {
      const conditionNodes = this.nodeConfig.conditionNodes
      //向左-1,向右1
      conditionNodes[index] = conditionNodes.splice(index + type, 1, conditionNodes[index])[0]

      for (var i = 0; i < conditionNodes.length; i++) {
        conditionNodes[i].error =
            this.conditionStr(conditionNodes[i], i) == '请设置条件' && i != conditionNodes.length - 1
      }

      this.$emit('update:nodeConfig', this.nodeConfig)
    }
  }
}
</script>
<style lang="scss" scoped>
.work-node {
  background: rgb(251, 96, 45) !important;
}

.work-node-h {
  font-size: 13px;
  margin: 0 5px 2px 0;
}

.conditon-trip {
  margin-bottom: 10px;
}

.auto-judge:hover {
  .anticon-copy {
    display: block;
  }

  .priority-title {
    display: none !important;
  }
}

.el-drawer__header {
  margin-bottom: 0 !important;
  /* padding: 14px 0 14px 20px; */
  /* border-bottom: 1px solid #f2f2f2; */
  color: #323232;
  font-size: 16px;
}

.demo-drawer__content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.drawer_content {
  flex: 1;
}

.demo-drawer__content > div {
  border-top: 1px solid #f2f2f2;
  padding-right: 15px;
}

.el-button {
  min-width: 79px;
  padding: 8px 12px;
  font-size: 12px;
  border-radius: 2px;
}

.demo-drawer__footer {
  padding: 10px 10px;
  border-top: 1px solid #f2f2f2;
}

.demo-drawer__footer .el-button {
  float: right;
  margin-right: 10px;
}

.el-dialog__footer {
  border-top: 1px solid #f2f2f2;
  padding-bottom: 10px;
}

.el-checkbox,
.el-checkbox__input.is-checked + .el-checkbox__label,
.el-radio,
.el-radio__input.is-checked + .el-radio__label,
.el-dialog__body,
.el-tree {
  color: #333;
}

.el-radio__label {
  font-size: 12px;
}
</style>
