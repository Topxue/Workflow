<template>
  <div class="condition-drawer">
    <el-drawer
        size="550px"
        direction="rtl"
        class="condition_copyer"
        :title="curNodeName"
        :show-close="false"
        :append-to-body="true"
        :before-close="closeDrawer"
        :visible.sync="conditionDrawer"
        @open="handleOpenDrawer"
        @closed="handleCloseDrawer"
    >
      <el-select v-model="curPriorityLevel" class="priority_level" @change="handlePriorityLevel">
        <el-option
            v-for="item in conditionsConfig.conditionNodes.length"
            :label="'优先级' + item"
            :value="item"
            :key="item"
        ></el-option>
      </el-select>
      <div class="demo-drawer__content">
        <div class="condition_content drawer_content">
          <p class="conditon-trip">
            <el-alert
                title="当审批单同时满足以下条件时进入此流程"
                type="warning"
                close-text="我知道了"
                show-icon
            ></el-alert>
          </p>
          <div class="change-helper-warper" v-if="isShowSponsor">
            <span>发起人</span>
<!--            <gd-helper-->
<!--                class="input-helper"-->
<!--                :checkUsers.sync="user"-->
<!--                :checkRoles.sync="role"-->
<!--                :checkDepts.sync="dept"-->
<!--                :showTabs="showTabs"-->
<!--            ></gd-helper>-->
          </div>

          <process-form-render
              v-if="conditonFormData.length"
              :form-list="conditonFormData"
          ></process-form-render>

          <el-button type="primary" icon="el-icon-plus" @click="addCondition">添加条件</el-button>
        </div>

        <div class="demo-drawer__footer clear">
          <el-button type="primary" @click="saveCondition">确 定</el-button>
          <el-button @click="closeDrawer">取 消</el-button>
        </div>
      </div>
      <!-- 条件选择组件 -->
      <CheckCondition
          :checkedCondition="conditonFormData"
          :isShowSponsor.sync="isShowSponsor"
          :conditionVisible.sync="conditionVisible"
          @getConditionForm="getConditionForm"
      />
    </el-drawer>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

import { isKit } from '../../utils'
import helper from '../../utils/Helper'

import CheckCondition from './checkCondition'
// import GdHelper from '@/components/gd-component/gd-helper-any/index.vue'

const USER_TYPE = 'user'
const ROLE_TYPE = 'role'
const DEPT_TYPE = 'dept'

const TRIGGER_PERSON = 'applyUserId'
const USER_SELECT_CONDITION = 'user_select_condition'
const NUMBER_RANGE_CONDITION = 'number_range_condition'
const NUMBER_COMPONENT_TYPE = ['number', 'money', 'inputNumber', 'daterange']

export default {
  name: 'Condition',
  props: ['conditionDrawer', 'formConfig', 'conditionsConfig', 'priorityLevel'],
  components: {
    // GdHelper,
    CheckCondition
  },
  data() {
    return {
      user: [],
      role: [],
      dept: [],
      conditions: [],
      conditionType: [],
      // showTabs: [1,2,3],
      curPriorityLevel: 1,
      isShowSponsor: true,
      conditonFormData: [],
      conditionVisible: false
    }
  },

  computed: {
    ...mapGetters(['formJsonData']),
    curNodeName({ conditionsConfig, priorityLevel }) {
      const nodeName = conditionsConfig?.conditionNodes[priorityLevel - 1]?.nodeName

      return nodeName || `条件${priorityLevel}`
    },

    // 又改需求了 😫
    showTabs() {
      const { user, role, dept } = this
      if (user.length) {
        return [1]
      } else if (role.length) {
        return [2]
      } else if (dept.length) {
        return [3]
      } else {
        return [1, 2, 3]
      }
    }
  },

  methods: {
    handleOpenDrawer() {
      this.curPriorityLevel = this.priorityLevel
      this.conditionsDataEcho()
    },

    handleCloseDrawer() {
      this.conditions = []
      this.conditonFormData = []
    },

    // 条件数据回显
    conditionsDataEcho() {
      const { conditionsConfig, priorityLevel } = this
      const conditionNode = conditionsConfig.conditionNodes[priorityLevel - 1]
      const conditions = conditionNode.properties?.conditions.flat(2)

      if (conditions && conditions.length) {
        this.conditions = conditions

        this.getConditonFormData()
      } else {
        this.conditions = []
        this.conditonFormData = []
      }

      const isApplyUser = conditions?.length && conditions.find(item => item.paramKey === TRIGGER_PERSON)
      if (!isApplyUser) {
        this.user = []
        this.role = []
        this.dept = []
      }
    },

    getConditonFormData() {
      const conditions = this.conditions
      this.conditionType = conditions.map(item => item.paramKey)

      // 获取发起人
      const queryApplyUser = conditions.find(condItem => condItem.paramKey === TRIGGER_PERSON)
      if (queryApplyUser) {
        this.getApplyUserData(queryApplyUser)
        this.isShowSponsor = true
      } else {
        this.isShowSponsor = false
      }

      this.getRenderFormJsonData()
    },

    getRenderFormJsonData() {
      const formJsonData = this.formJsonData.columns

      const conditonFormData = formJsonData
          .map(formItem => {
            if (isKit(formItem)) {
              this.getKitConditionFormData(formItem.columns)
            } else {
              if (this.isExistenceCondition(formItem.model)) {
                return this.updateConditionItem(formItem)
              }
            }
          })
          .filter(item => item)

      this.conditonFormData.push(...conditonFormData)
    },

    // 更新条件表单数据
    updateConditionItem(formItem) {
      const copyFormItem = JSON.parse(JSON.stringify(formItem))
      const queryCondition = this.conditions.find(condItem => condItem.paramKey === formItem.model)

      if (queryCondition) {
        const conds = queryCondition?.conds
        if (conds && conds.length) {
          if (this.isKitLeaveSelect(copyFormItem, conds)) {
            copyFormItem.value = conds[0].id
          } else {
            if (copyFormItem.type === 'radio') {
              copyFormItem.value = conds[0].id
            } else if (copyFormItem.type === 'checkbox') {
              copyFormItem.value = queryCondition.conds.map(item => item.id)
              // 单选下拉框
            } else if (copyFormItem.model.includes('select') && !copyFormItem.options.multiple) {
              copyFormItem.value = conds[0].id
            } else {
              copyFormItem.value = queryCondition.conds.map(item => item.id)
            }
          }
        } else {
          copyFormItem.value = queryCondition.value
        }
      }

      copyFormItem.condition = queryCondition?.rangeType || ''

      return copyFormItem
    },

    // 套件下条件表单数据
    getKitConditionFormData(columns) {
      const copyColumns = JSON.parse(JSON.stringify(columns))
      copyColumns.forEach(column => {
        if (column.columns) {
          this.getKitConditionFormData(column.columns)
          return
        }
        if (this.isExistenceCondition(column.model)) {
          if (column.model === 'vacationId') {
            column.options.multiple = true
          }
          this.conditonFormData.push(this.updateConditionItem(column))
        }
      })
    },

    // ?表单是否存在条件
    isExistenceCondition(type) {
      return this.conditionType.includes(type)
    },

    // ?是否是请假套件kit-leave(select)
    isKitLeaveSelect(formItem, conds) {
      return formItem.model === 'vacationId' && !formItem.options.multiple && conds.length < 2
    },

    // 发起人数据回显
    getApplyUserData(formItem) {
      const conds = formItem.conds

      if (conds.length) {
        this.user = conds.filter(user => user.type === USER_TYPE)
        this.role = conds.filter(role => role.type === ROLE_TYPE)
        this.dept = conds.filter(dept => dept.type === DEPT_TYPE)
      } else {
        this.user = []
        this.role = []
        this.dept = []
      }
    },

    addCondition() {
      this.conditionVisible = true
    },

    getConditionForm(conditonFormData, isShowSponsor) {
      this.isShowSponsor = isShowSponsor
      this.conditonFormData = conditonFormData.map(formItem => {
        return this.updateConditionItem(formItem)
      })

      console.log(this.conditonFormData, 'this.conditonFormData ...')
    },

    saveCondition() {
      const conditonFormData = this.conditonFormData
      const conditions = []
      conditonFormData.forEach(item => {
        if (!item || !item.value) return

        if (NUMBER_COMPONENT_TYPE.includes(item.type)) {
          conditions.push(this.getNumberConditionParams(item))
        } else {
          conditions.push(this.getSelectConditionParams(item))
        }
      })

      // 发起人
      this.getSponsorParams(conditions)
      this.alreadyAsConditions(conditions)
      this.updateConditionsConfig(conditions)
    },

    // 已作为条件的表单数据(表单删除权限控制)
    alreadyAsConditions(conditions) {
      const { $cacheMap, conditionsConfig, priorityLevel } = this

      const key = conditionsConfig.conditionNodes[priorityLevel - 1]?.nodeId
      const paramKeys = conditions.map(item => item.paramKey)

      $cacheMap.set(key, paramKeys)
    },

    updateConditionsConfig(conditions) {
      const { curPriorityLevel, conditionsConfig } = this

      const curConditionsConfig = conditionsConfig.conditionNodes[curPriorityLevel - 1]
      helper.updateProperties(curConditionsConfig, { conditions: [conditions] })

      this.$emit('saveCondition', this.conditionsConfig)
    },

    handlePriorityLevel(curPriorityLevel) {
      const conditionNodes = this.conditionsConfig.conditionNodes
      const changeConditionLevel = conditionNodes.splice(this.priorityLevel - 1, 1)

      conditionNodes.splice(curPriorityLevel - 1, 0, changeConditionLevel[0])
    },

    getSponsorParams(conditions) {
      const isShowSponsor = this.isShowSponsor
      if (isShowSponsor) {
        const params = {
          paramKey: TRIGGER_PERSON,
          type: USER_SELECT_CONDITION,
          paramLabel: '发起人',
          isEmpty: false,
          conds: []
        }
        conditions.push(this.getSponsorUsers(params))
      }
    },

    getSponsorUsers(params) {
      const user = this.user,
          dept = this.dept,
          role = this.role

      const checkeUsers = [
        ...user.map(item => {
          item.type = USER_TYPE
          return item
        }),
        ...dept.map(item => {
          item.type = DEPT_TYPE
          return item
        }),
        ...role.map(item => {
          item.type = ROLE_TYPE
          return item
        })
      ]

      checkeUsers.forEach(item => {
        params.conds.push(item)
      })

      return params
    },

    getNumberConditionParams(item) {
      return {
        paramKey: item.model,
        type: NUMBER_RANGE_CONDITION,
        paramLabel: item.name,
        isEmpty: !item.value,
        rangeType: item.condition,
        value: item.value || ''
      }
    },

    getSelectConditionParams(item) {
      // const isCheckbox = item.type === 'checkbox'

      let params = {
        paramKey: item.model,
        type: USER_SELECT_CONDITION,
        paramLabel: item.name,
        isEmpty: !(item.value && item.value?.length),
        conds: []
      }

      if (item.value instanceof Array) {
        item.value.forEach(val => {
          params.conds.push({ id: val, name: this.getOptionsLabel(item, val) })
          /**
           * 兼容处理: 目前不需要做数据兼容处理了 我先给它注释掉😃
           */
          // if (isCheckbox) {
          //   params.conds.push({ id: this.getOptionsValue(item, val), name: val })
          // } else {
          //   params.conds.push({ id: val, name: this.getOptionsLabel(item, val) })
          // }
        })
      } else {
        params.conds.push({ id: item.value, name: this.getOptionsLabel(item, item.value) })
      }

      return params
    },

    // getOptionsValue(item, val) {
    //   const options = item.options?.options
    //   if (options && options.length) {
    //     return options.find(option => option.label === val).value
    //   } else {
    //     return ''
    //   }
    // },

    getOptionsLabel(item, val) {
      const options = item.options?.options
      if (options && options.length) {
        return options.find(option => option.value === val).label
      } else {
        return ''
      }
    },

    closeDrawer() {
      this.$emit('update:conditionDrawer', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.change-helper-warper {
  color: #606266;
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  .input-helper {
    width: 72%;
  }

  span {
    width: 105px;
    display: inline-block;
    text-align: center;
  }
}

/deep/ .el-drawer__header {
  margin-bottom: 0 !important;
  padding: 14px 0 14px 20px;
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
</style>
