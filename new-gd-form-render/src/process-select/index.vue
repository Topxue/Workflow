<!--
 * @Author: caohao
 * @Date: 2020-09-28 14:30:38
 * @LastEditors: caohao
 * @LastEditTime: 2021-03-23 10:55:43
 * @Description:
-->
<template>
  <g-form-item prop="value" :label="dataInfo.name">
    <!-- <div slot="cond">
      <el-form inline class="couditon">
        <el-form-item>
          <el-select v-model="condition" @change="handleSelectCondition">
            <el-option
              v-for="(item, index) in conditions"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div> -->

    <el-select
      v-model="value"
      :multiple="dataInfo.options.multiple"
      :disabled="dataInfo.options.disabled || dataInfo.options.writeable === false"
      :placeholder="dataInfo.options.placeholder"
      :clearable="dataInfo.options.clearable"
      class="check-select"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
  </g-form-item>
</template>
<script>
import valueMixin from '../mixins/valueMixin'
import { conditionSelect } from '../process-from-render/config'

const ERROR_OK = 10000

export default {
  name: 'ProcessSelect',
  mixins: [valueMixin],
  data() {
    return {
      options: [],
      condition: 'ge',
      conditions: conditionSelect
    }
  },
  mounted() {
    if (this.dataInfo.options.isKit) {
      this.getKitLeaveType()
    } else {
      this.getOpts()
    }
  },
  methods: {
    getOpts() {
      // 单选框组 静态数据
      if (!this.dataInfo.options.remote && !this.dataInfo.options.isKit) {
        this.options = this.dataInfo.options.options
      }
    },

    // 获取套件请假类型
    async getKitLeaveType() {
      const { code, data } = await vacationBalance()
      if (code === ERROR_OK) {
        this.options = data.map(item => ({
          label: item.vacationName,
          value: item.vacationId,
          leaveUnit: item.leaveUnit
        }))

        this.dataInfo.options.options = this.options
      }
    },

    handleSelectCondition() {
      let option = this.conditions.filter(item => item.value === this.condition)[0]
      this.dataInfo.condition = option.value || this.condition
      return option
    }
  },
  created() {
    // 编辑数据回显
    if (this.dataInfo.value) {
      this.value = this.dataInfo.value
    } else {
      if (this.dataInfo.options.multiple) this.value = []
      if (this.dataInfo.options.defaultValue) this.value = this.dataInfo.options.defaultValue
    }

    // 设置默认条件范围
    this.dataInfo.condition = this.condition
  }
}
</script>
<style lang="scss" scoped>
.couditon {
  .el-form-item {
    width: 113px;
    margin-bottom: 0;
  }
}
.check-select {
  width: 100%;
  margin-left: 0;
}
</style>
