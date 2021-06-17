<template>
  <div class="check-condition">
    <el-dialog
      width="480px"
      title="选择条件"
      class="condition_list"
      append-to-body
      :before-close="closeDialog"
      :visible.sync="conditionVisible"
      @open="handleOpenDialog"
    >
      <p>请选择用来区分审批流程的条件字段</p>
      <el-checkbox-group v-model="checkConditionList">
        <el-checkbox label="applyUserId">
          发起人
        </el-checkbox>
        <el-checkbox v-for="item in conditions" :key="item.model" :label="item.model">
          {{ item.name }}
        </el-checkbox>
      </el-checkbox-group>

      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="sureCondition">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { isKit } from '../../utils'

// 请假类型 => model
const LEAVE_TYPE = 'vacationId'
// 发起人类型
const TRIGGER_PERSON = 'applyUserId'

export default {
  props: ['conditionVisible', 'isShowSponsor', 'checkedCondition'],
  data() {
    return {
      conditions: [],
      checkConditionList: []
    }
  },

  computed: {
    ...mapGetters(['formJsonData'])
  },

  methods: {
    handleOpenDialog() {
      this.getFormConditions()
    },

    // 获取条件表单
    getFormConditions() {
      const checkedCondition = this.getCheckedConditions()

      this.conditions = []
      this.checkConditionList = this.isShowSponsor
        ? [TRIGGER_PERSON, ...checkedCondition]
        : [...checkedCondition]

      const formData = JSON.parse(JSON.stringify(this.formJsonData.columns))

      formData.forEach(item => {
        if (isKit(item)) {
          this.queryKitFormData(item.columns)
        } else {
          this.isCondition(item) && this.conditions.push(item)
        }
      })
    },

    // 获取选择条件
    getCheckedConditions() {
      return this.checkedCondition.filter(item => item && item).map(item => item.model)
    },

    // 获取套件下的的条件表单
    queryKitFormData(columns) {
      columns.forEach(column => {
        if (column.columns) {
          this.queryKitFormData(column.columns)
          return
        }

        if (column.model === LEAVE_TYPE) {
          column.options.multiple = true
        }

        this.isCondition(column) && this.conditions.push(column)
      })
    },

    // 是否作可以为条件
    isCondition(formItem) {
      return formItem.options?.isCondition
    },

    sureCondition() {
      const { conditions, checkConditionList } = this
      const conditionForm = []

      const isApplyUser = checkConditionList.includes(TRIGGER_PERSON)

      conditions.forEach(item => {
        checkConditionList.includes(item.model) && conditionForm.push(item)
      })

      this.$emit('getConditionForm', conditionForm, isApplyUser)
      this.closeDialog()
    },

    closeDialog() {
      this.$emit('update:conditionVisible', false)
    }
  }
}
</script>

<style lang="scss" scoped></style>
