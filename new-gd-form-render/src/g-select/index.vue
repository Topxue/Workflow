<!--
 * @Author: caohao
 * @Date: 2020-09-28 14:30:38
 * @LastEditors: caohao
 * @LastEditTime: 2021-04-09 11:48:47
 * @Description:
-->
<template>
  <g-form-item :decorator="dataInfo.rules" prop="value" :label="dataInfo.name" :required="dataInfo.options.required">
    <!-- <el-input-number v-model="value" controls-position="right" :min="dataInfo.options.min" :max="dataInfo.options.max" :step="dataInfo.options.step"></el-input-number> -->
    <el-select
      v-model="value"
      :multiple="dataInfo.options.multiple"
      :disabled="dataInfo.options.disabled|| dataInfo.options.writeable===false"
      :placeholder="dataInfo.options.placeholder"
      :clearable="dataInfo.options.clearable"
    >
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
  </g-form-item>
</template>
<script>
import valueMixin from '../mixins/valueMixin'
import kitmixins from './kitmixins'
import observerMixins from '../mixins/observerMixins'
import flowchartMixin from '../mixins/flowchartMixin'
export default {
  name: 'GSelect',
  mixins: [observerMixins, valueMixin, kitmixins, flowchartMixin],
  data() {
    return {
      options: []
    }
  },
  mounted() {
    this.getOpts()
  },
  methods: {
    getOpts() {
      // 单选框组 静态数据
      if (!this.dataInfo.options.remote && !this.dataInfo.options.isKit) {
        this.options = this.dataInfo.options.options
      }
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
  }
}
</script>
