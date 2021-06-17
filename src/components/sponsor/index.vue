<template>
  <el-drawer
      title="发起人"
      size="550px"
      :before-close="closeDrawer"
      :visible.sync="promoterDrawer"
      :append-to-body="true"
      @opened="handleOpenDrawer"
  >
    <div class="demo-drawer__content">
      <div class="promoter_content drawer_content">
        <el-tabs v-model="activeName">
          <el-tab-pane label="表单操作权限" name="second" v-if="isShowFormTab">
            <form-seting
                ref="formSeting"
                :formData="formPropertyList"
                currentNode="startNode"
            ></form-seting>
          </el-tab-pane>
        </el-tabs>
      </div>

      <div class="demo-drawer__footer footer-btn-content">
        <el-button type="primary" @click="savePromoter">确 定</el-button>
        <el-button @click="closeDrawer">取 消</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import {mapGetters} from 'vuex'

import * as types from '@/store/types/workflow-types'

import FormSeting from '../form-seting'

export default {
  props: ['promoterDrawer', 'startNodeConfig'],
  components: {
    FormSeting
  },
  data() {
    return {
      users: [],
      roles: [],
      depts: [],
      formPropertyList: [],
      activeName: 'second'
    }
  },

  computed: {
    ...mapGetters(['formJsonData', 'userIds']),
    isShowFormTab({formJsonData}) {
      return formJsonData.columns.length
    }
  },

  methods: {
    handleOpenDrawer() {
      this.formPropertyList = this.startNodeConfig.formPropertyList

      console.log(this.startNodeConfig, 'this.startNodeConfig...')

      this.getFlowPermissionList()
    },

    // 获取发起人
    getFlowPermissionList() {
      this.users = this.userIds
      // const flowPermissionList =
      //   this.startNodeConfig?.actionerRules && this.startNodeConfig?.actionerRules[0]?.approvals

      // if (flowPermissionList && flowPermissionList.length) {
      //   this.roles = flowPermissionList
      //     .filter(item => item.type === TARGET_LABEL)
      //     .map(item => this.getUserItem(item))

      //   this.users = flowPermissionList
      //     .filter(item => item.type === TARGET_APPROVAL)
      //     .map(item => this.getUserItem(item))

      //   this.depts = flowPermissionList
      //     .filter(item => item.type === TARGET_MANAGEMENT)
      //     .map(item => this.getUserItem(item))
      // }
    },

    // getUserItem(item) {
    //   return {
    //     id: item.workNo || item.id,
    //     label: item.userName || item.label
    //   }
    // },

    savePromoter() {
      this.$store.commit(types.COMMIT_USER_IDS, this.users)

      // return false
      // const checkedDepartmentList = this.users.map(item => {
      //   return {
      //     workNo: item.id,
      //     userName: item.label
      //   }
      // })
      // const checkedDepartmentList = [
      //   ...this.users.map(item => {
      //     return {
      //       workNo: item.id,
      //       userName: item.label,
      //       type: TARGET_APPROVAL
      //     }
      //   }),
      //   ...this.depts.map(item => {
      //     return {
      //       workNo: item.id,
      //       userName: item.label,
      //       type: TARGET_MANAGEMENT
      //     }
      //   }),
      //   ...this.roles.map(item => {
      //     return {
      //       workNo: item.id,
      //       userName: item.label,
      //       type: TARGET_LABEL
      //     }
      //   })
      // ]

      this.startNodeConfig.formPropertyList = this.$refs?.formSeting?.formPropertyList || []

      // if (!this.startNodeConfig.actionerRules) {
      //   this.startNodeConfig.actionerRules = [{ approvals: [] }]
      // }
      // this.startNodeConfig.actionerRules[0].approvals = checkedDepartmentList

      this.$emit('saveSponsor', this.startNodeConfig)

      console.log(this.startNodeConfig, 'save startNodeConfig...')

      this.closeDrawer()
    },

    closeDrawer() {
      this.$emit('update:promoterDrawer', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.label-trip {
  font-size: 14px;
  padding: 0 0 8px;
}

.demo-drawer__content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.drawer_content {
  flex: 1;
}

/deep/ .el-drawer__header {
  margin-bottom: 0 !important;
  padding: 14px 0 14px 20px;
  color: #323232;
  font-size: 16px;
}

/deep/ .el-tabs__nav-wrap::after {
  height: 0;
}

.footer-btn-content {
  button {
    min-width: 79px;
    padding: 8px 12px;
    font-size: 12px;
    border-radius: 2px;
  }
}

.demo-drawer__footer {
  padding: 10px 10px;
  border-top: 1px solid #f2f2f2;
}

.demo-drawer__footer .el-button {
  float: right;
  margin-right: 10px;
}
</style>
