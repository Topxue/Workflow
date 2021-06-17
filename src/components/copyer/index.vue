<template>
  <div class="copyer-drawer">
    <el-drawer
        size="550px"
        direction="rtl"
        class="set_copyer"
        :title="curNodeName"
        @open="handleDrawerOpend"
        :append-to-body="true"
        :visible.sync="copyerDrawer"
        :before-close="coloseDrawer"
    >
      <div class="demo-drawer__content">
        <div class="copyer_content drawer_content">
          <div>抄送人</div>
<!--          <user-help-->
<!--              class="check-copeyer"-->
<!--              v-model="copyerUsers"-->
<!--              placeholder="请选择指定成员"-->
<!--              multiple-->
<!--          />-->

          <!-- 第一版 暂无此功能 -->
          <!-- <el-checkbox-group v-model="ccSelfSelectFlag" class="clear">
            <el-checkbox :label="1">允许发起人添加抄送人</el-checkbox>
          </el-checkbox-group> -->
        </div>
        <div class="demo-drawer__footer clear">
          <el-button type="primary" @click="saveCopyer">确 定</el-button>
          <el-button @click="coloseDrawer">取 消</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { copyerStr } from '@/utils'
import helper from '@/utils/Helper'

// import UserHelp from '@/components/gd-component/org-user-help'

export default {
  props: ['copyerDrawer', 'copyerConfig'],
  components: {
    // UserHelp
  },
  data() {
    return {
      copyerUsers: [],
      ccSelfSelectFlag: [1]
    }
  },

  computed: {
    curNodeName({ copyerConfig }) {
      return copyerConfig.nodeName || '抄送人'
    }
  },

  methods: {
    handleDrawerOpend() {
      // 数据回显
      const actionerRules = helper.getActionerRules(this.copyerConfig)

      /**
       * 第一版 暂无此功能
       */
      // this.ccSelfSelectFlag = actionerRules.type === 'target_approval' ? [1] : [0]

      this.copyerUsers = actionerRules.approvals.map(user => {
        return {
          id: user.workNo,
          label: user.userName
        }
      })
    },

    saveCopyer() {
      const copyerUsers = this.copyerUsers.map(user => {
        return {
          workNo: user.id,
          userName: user.label
        }
      })

      helper.updateActionerRules(this.copyerConfig, {
        approvals: copyerUsers,
        type: this.ccSelfSelectFlag.length ? 'target_approval' : ''
      })

      this.copyerConfig.error = !copyerStr(this.copyerConfig)

      this.$emit('saveCopyer', this.copyerConfig)

      this.coloseDrawer()
    },

    coloseDrawer() {
      this.$emit('update:copyerDrawer', false)
    }
  }
}
</script>

<style lang="scss" scoped>
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
  div:first-child {
    margin-bottom: 10px;
  }

  .check-copeyer {
    margin-bottom: 10px;
    margin-right: 20px;
  }

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
