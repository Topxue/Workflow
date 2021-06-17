<template>
  <g-form-item :inline="true" :label="getLabelName()" prop="value">
    <template slot="cond">
      <el-select v-model="condition" class="couditon" @change="handleSelectCondition">
        <el-option
            v-for="(item, index) in conditions"
            :key="index"
            :label="item.label"
            :value="item.value"
        ></el-option>
      </el-select>
    </template>
    <el-input-number
        v-model.number="value"
        controls-position="right"
        :disabled="dataInfo.options.disabled || dataInfo.options.writeable === false"
        :min="dataInfo.options.min || -Infinity"
        :max="dataInfo.options.max || Infinity"
        :step="dataInfo.options.step || 1"
    ></el-input-number>
  </g-form-item>
</template>

<script>
import {condition} from '../process-from-render/config'

// 请假类型
const VACATION_SECTION = 'vacationSection'
// 加班类型
const OVERTIME_SECTION = 'overtimeSection'


export default {
  name: 'ProcessNumber',
  props: ['dataInfo'],
  data() {
    return {
      value: '1',
      condition: 'ge',
      auther: {
        see: true,
        write: false,
        must: false
      },
      conditions: condition
    }
  },
  watch: {
    value(newVal) {
      this.dataInfo.value = newVal
    }
  },

  created() {
    this.getDefaultValue()
  },
  methods: {
    getDefaultValue() {
      let dataInfo = this.dataInfo
      if (dataInfo.value) {
        this.value = dataInfo.value
      }
      if (dataInfo.condition) {
        this.condition = dataInfo.condition
      }
      if (dataInfo.options.defaultValue && !dataInfo.value) {
        this.value = dataInfo.options.defaultValue
      }

      // 设置默认条件范围
      dataInfo.condition = this.condition
    },


    handleSelectCondition() {
      let option = this.conditions.filter(item => item.value === this.condition)[0]
      this.dataInfo.condition = option.value || this.condition
      this.value = option.value === 'lt' ? 2 : 1

      return option
    }
  }
}
</script>

<style lang="scss" scoped>
.couditon {
  width: 24% !important;
  margin: 0 10px 2px 0;
}
</style>
