<template>
  <div class="approved-seting-warper">
    <el-drawer
        class="set_promoter"
        size="550px"
        :title="curNodeName"
        direction="rtl"
        :append-to-body="true"
        :before-close="closeDrawer"
        :visible.sync="approverDrawer"
        @opened="handleDrawerOpend"
    >
      <div class="demo-drawer__content">
        <el-tabs v-model="active">
          <el-tab-pane label="设置审批人" name="approver">
            <div class="drawer_content">
              <div class="approver_content">
                <el-radio-group v-model="type" @change="changeType">
                  <el-radio
                      v-for="(item, index) in actionerRulesType"
                      :key="index"
                      :label="item.type"
                  >
                    {{ item.label }}
                  </el-radio>
                </el-radio-group>
                <!-- 指定人员组件 -->
                <!--                <user-help-->
                <!--                    v-if="getCurrentApproverType(approverConfig, 'target_approval')"-->
                <!--                    class="select-user"-->
                <!--                    v-model="approvalUsers"-->
                <!--                    placeholder="请选择候成员"-->
                <!--                    multiple-->
                <!--                />-->
                <!-- 角色 -->
                <!--                <gd-helper-one-->
                <!--                    v-if="getCurrentApproverType(approverConfig, 'target_label')"-->
                <!--                    title="角色选择"-->
                <!--                    type="role"-->
                <!--                    class="select-user select-role"-->
                <!--                    v-model="roles"-->
                <!--                    :multiple="false"-->
                <!--                ></gd-helper-one>-->
              </div>
              <div
                  class="approver_manager"
                  v-if="getCurrentApproverType(approverConfig, 'target_management')"
              >
                <p>
                  <span>发起人的：</span>
                  <el-select
                      v-model="level"
                      class="management-select"
                      @change="changeDirectorMaxLevel"
                  >
                    <el-option
                        v-for="item in directorMaxLevel"
                        :value="item"
                        :key="item"
                        :label="getManagementLevel(item)"
                    ></el-option>
                  </el-select>
                </p>
                <el-checkbox v-model="autoUp" class="check-autoUp">
                  找不到主管时，由上级主管代审批
                </el-checkbox>
              </div>
              <div class="approver_self" v-if="isShowOriginator">
                <p>该审批节点设置“发起人自己”后，审批人默认为发起人</p>
              </div>
              <div class="approver_self_select" v-show="isShowSelectRange">
                <el-select
                    v-model="multi"
                    placeholder="请选择"
                    @change="changeMulti"
                    class="select-multi"
                >
                  <el-option label="自选一个人" :value="0"></el-option>
                  <el-option label="自选多个人" :value="1"></el-option>
                </el-select>
                <h3>选择范围</h3>
                <el-select v-model="selectRange" placeholder="请选择" @change="changeRange">
                  <el-option label="全公司" value="all"></el-option>
                  <el-option label="整个部门" value="dept"></el-option>
                </el-select>
              </div>

              <!-- 当前角色选择范围: 马上要上线了 还加需求 擦 烦的一批😒 -->
              <div class="approver_some" v-if="roleSelectRange">
                <p>当前角色选择范围</p>
                <el-radio-group v-model="selectRange" class="clear" @change="changeRange">
                  <el-radio label="all">
                    默认全部
                  </el-radio>
                  <br/>
                  <el-radio label="dept">
                    仅发起人所在部门
                  </el-radio>
                </el-radio-group>
              </div>

              <div class="approver_some" v-if="isShowSignatureType() || isMoreApprovalUsers">
                <p>多人审批时采用的审批方式</p>
                <el-radio-group v-model="actType" class="clear" @change="changeActType">
                  <el-radio label="one_by_one" v-if="type !== 'target_label'">依次审批</el-radio>
                  <br/>
                  <el-radio label="and_all">
                    会签（须所有审批人同意）
                  </el-radio>
                  <br/>
                  <el-radio label="or_one">
                    或签（一名审批人同意或拒绝即可）
                  </el-radio>
                </el-radio-group>
              </div>

              <div class="approver_some" v-if="autoSkip">
                <p>审批人为空时</p>
                <el-radio-group
                    v-model="noneActionerAction"
                    class="clear"
                    @change="changeNoneActionerAction"
                >
                  <el-radio label="autoSkip">自动通过</el-radio>
                  <br/>
                  <el-radio label="forwardAdmin">自动转交管理员</el-radio>
                </el-radio-group>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="表单操作权限" name="formseting" v-if="isShowFormTab">
            <form-seting
                ref="formSeting"
                :formData="formPropertyList"
                currentNode="approveNode"
            ></form-seting>
          </el-tab-pane>
        </el-tabs>

        <div class="demo-drawer__footer clear footer-btn-content">
          <el-button type="primary" @click="saveApprovers">确 定</el-button>
          <el-button @click="closeDrawer">取 消</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import FormSeting from '@/components/form-seting'
import helper from '@/utils/Helper'
//
// import UserHelp from '@/components/gd-component/org-user-help'
// import GdHelperOne from '@/components/gd-component/gd-helper-any/gd-helper-one'

import {
  AND_ALL,
  ONE_BY_ONE,
  SELECT_RANGE_ALL,
  TARGET_LABEL,
  TARGET_SELECT,
  TARGET_APPROVAL,
  TARGET_ORIGINATOR,
  TARGET_MANAGEMENT,
  actionerRulesType
} from '../../config'

export default {
  props: ['approverDrawer', 'approverConfig', 'directorMaxLevel'],
  components: {
    // UserHelp,
    FormSeting
    // GdHelperOne
  },
  data() {
    return {
      roles: [],
      users: [],
      level: 1, // 主管级别
      multi: 0, // 支持选择的人数
      autoUp: true, // 是否自动寻找上级主管
      approvalUsers: [], // 指定成员ls
      selectRange: 'all', // 可选范围
      actType: 'and_all', // 会签方式
      active: 'approver',
      formPropertyList: [],
      noneActionerAction: 'autoSkip', // 自动流转
      type: TARGET_MANAGEMENT, // 人员类型
      actionerRulesType
    }
  },

  computed: {
    ...mapGetters(['formJsonData']),
    isShowFormTab({formJsonData}) {
      const formJsonDataLen = formJsonData.columns?.length
      if (!formJsonDataLen) this.active = 'approver'

      return formJsonData
    },
    // 发起人自己
    isShowOriginator({type}) {
      return type === TARGET_ORIGINATOR
    },
    // 指定成员
    isMoreApprovalUsers({approvalUsers}) {
      return approvalUsers.length > 1
    },
    // 选择范围
    isShowSelectRange({type}) {
      return type === TARGET_SELECT
    },
    // 角色选择范围
    roleSelectRange({type}) {
      return type === TARGET_LABEL
    },
    // 自动流转
    autoSkip({type}) {
      return type === TARGET_MANAGEMENT || type === TARGET_LABEL
    },

    curNodeName({approverConfig}) {
      return approverConfig.nodeName || '审批人'
    }
  },

  methods: {
    handleDrawerOpend() {
      const formPropertyList = helper.getProperties(this.approverConfig, 'formPropertyList')
      this.formPropertyList = formPropertyList

      this.approverDataBack()
    },

    // 人员数据回显
    approverDataBack() {
      const actionerRules = helper.getActionerRules(this.approverConfig)
      // 当前人员类型
      const type = actionerRules.type
      this.type = type || TARGET_MANAGEMENT
      this.actType = actionerRules.actType
      this.multi = actionerRules.multi
      this.selectRange = actionerRules.selectRange || 'all'

      if (type === TARGET_APPROVAL) {
        const approvalUsers = actionerRules.approvals
        if (approvalUsers && approvalUsers.length) {
          this.approvalUsers = approvalUsers.map(user => {
            return {
              id: user.workNo,
              label: user.userName
            }
          })
        } else {
          this.approvalUsers = []
        }
      } else if (type === TARGET_LABEL) {
        this.roles = [
          {
            id: actionerRules.labels,
            label: actionerRules.labelNames
          }
        ]

        this.noneActionerAction = this.approverConfig.properties?.noneActionerAction || 'autoSkip'
      }
    },

    // 判断当前审签人类型
    getCurrentApproverType(approverConfig, type) {
      return helper.getActionerPropertie(approverConfig, 'type') === type
    },

    // 获取主管显示层级
    getManagementLevel(item) {
      return item == 1 ? '直接' : '第' + item + '级' + '主管'
    },

    // 更新指定成员
    approvalSelectUsers() {
      helper.updateActionerRules(this.approverConfig, {
        approvals: []
      })

      const type = helper.getActionerPropertie(this.approverConfig, 'type')
      if (
          type === TARGET_APPROVAL ||
          (type == TARGET_SELECT && this.approverConfig.selectRange == 3)
      ) {
        const approvalUsers = this.approvalUsers.map(item => {
          return {
            workNo: item.id,
            userName: item.label
          }
        })

        return approvalUsers
      } else {
        return []
      }
    },

    // 更新审签设置数据
    updateApproverConfigData() {
      const roles = this.roles[0]
      const formPropertyList = this.$refs?.formSeting?.formPropertyList || []
      helper.updateActionerRules(this.approverConfig, {
        type: this.type,
        autoUp: this.autoUp,
        labels: roles ? roles.id : '',
        labelNames: roles ? roles.label : '',
        approvals: this.approvalSelectUsers()
      })

      helper.updateProperties(this.approverConfig, {
        formPropertyList
      })
    },

    // 回显方式显示状态
    isShowSignatureType() {
      const approverConfig = this.approverConfig
      const actionerRules = helper.getActionerRules(approverConfig)

      return (
          (actionerRules.type === TARGET_SELECT && actionerRules?.approvals?.length > 1) ||
          actionerRules.type === TARGET_LABEL ||
          actionerRules.type === TARGET_MANAGEMENT ||
          (actionerRules.type === TARGET_SELECT && actionerRules.multi == 1)
      )
    },

    saveApprovers() {
      this.updateApproverConfigData()

      this.$emit('saveApprover', this.approverConfig)

      console.log(this.approverConfig, 'save approverConfig...')

      this.closeDrawer()
    },

    // 人员人数选择
    changeMulti(multi) {
      helper.updateActionerRules(this.approverConfig, {multi})
    },

    // 发起人层级
    changeDirectorMaxLevel(level) {
      helper.updateActionerRules(this.approverConfig, {
        level
      })
    },

    // 选择会签类型
    changeActType(actType) {
      const approverConfig = this.approverConfig

      helper.updateActionerRules(approverConfig, {
        actType
      })

      helper.updateProperties(approverConfig, {
        activateType: actType
      })
    },

    // 流转说明
    changeNoneActionerAction(noneActionerAction) {
      helper.updateProperties(this.approverConfig, {
        noneActionerAction
      })
    },

    // 选择可选范围
    changeRange(selectRange) {
      helper.updateActionerRules(this.approverConfig, {
        selectRange,
        approvals: []
      })
    },

    changeType(type) {
      this.actType = ONE_BY_ONE
      this.roles = []
      this.approvalUsers = []

      const approverConfig = this.approverConfig

      helper.updateActionerRules(approverConfig, {
        type: type,
        approvals: [],
        actType: ONE_BY_ONE
      })

      helper.updateProperties(approverConfig, {
        activateType: ONE_BY_ONE,
        noneActionerAction: 'forwardAdmin'
      })

      // 角色
      if (type === TARGET_LABEL) {
        this.actType = AND_ALL
        this.selectRange = SELECT_RANGE_ALL
        helper.updateActionerRules(approverConfig, {
          actType: AND_ALL,
          selectRange: SELECT_RANGE_ALL
        })
        helper.updateProperties(approverConfig, {
          activateType: AND_ALL
        })
        // 主管
      } else if (type == TARGET_MANAGEMENT) {
        this.level = 1
        helper.updateActionerRules(approverConfig, {
          level: 1
        })
        // 发起人自选
      } else if (type == TARGET_SELECT) {
        this.selectRange = SELECT_RANGE_ALL
        helper.updateActionerRules(approverConfig, {
          multi: 0,
          selectRange: SELECT_RANGE_ALL
        })
      }
      /**
       * 注释功能: 这一期暂时没有指定成员选择😒
       */
      // else if (type === TARGET_APPROVAL) {
      //   console.log('指定成员')
      //   this.actType = AND_ALL
      //   helper.updateActionerRules(approverConfig, {
      //     actType: AND_ALL
      //   })
      //   helper.updateProperties(approverConfig, {
      //     activateType: AND_ALL
      //   })
      // }
    },

    closeDrawer() {
      this.$emit('update:approverDrawer', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.conditon-trip {
  margin-bottom: 10px;
}

.select-multi {
  margin-bottom: 15px;
}

.management-select {
  width: 80%;
}

.check-autoUp {
  /deep/ .el-checkbox__label {
    color: #444;
  }
}

.footer-btn-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

/deep/ .el-drawer__header {
  margin-bottom: 0 !important;
  padding: 14px 0 14px 20px;
  color: #000000d9;
  font-size: 16px;
}

/deep/ .el-tabs__nav-wrap::after {
  height: 0;
}

.demo-drawer__content {
  display: flex;
  flex-direction: column;
  height: 100%;
  margin-left: 10px;
}

.select-user {
  margin: 0 25px 10px 0;
}

.drawer_content {
  flex: 1;
}

.demo-drawer__content > div {
  border-top: 1px solid #f2f2f2;
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
