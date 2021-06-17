<!--
 * @Author: caohao
 * @Date: 2021-03-14 14:08:50
 * @LastEditors: caohao
 * @LastEditTime: 2021-05-14 15:49:05
 * @Description:
-->
<template>
  <g-form-item :decorator="rules" label="时长" prop="duration" :required="dataInfo.options.required"
               v-if="dataInfo.options.duration"
  >
    <el-input v-model="duration" placeholder="请输入时长" @input="handleInput"
              :disabled="disabled === false||dataInfo.options.disabled"
    >
      <template slot="append" v-if="dataInfo.options.durationUnit">
        {{ dataInfo.options.durationUnit === 'hour' ? '小时' : '天' }}
      </template>
    </el-input>
  </g-form-item>
</template>

<script>
export default {
  /**disabled 从时长区间控件传过来的  默认为时长区间控件的dataInfo.options.writeable*/
  props: ['dataInfo', 'dateTime', 'disabled'],
  data() {
    return {
      duration: '',
      rules: [{ required: true, message: '请填写时长' }]
    }
  },

  mounted() {
    this.durationBackValue()
  },

  methods: {
    // 时长数据回显
    durationBackValue() {
      const value = this.dataInfo.value
      if (value) {
        this.duration = value.duration
      }
    },

    handleInput(val) {
      this.$emit('update:dateTime', { ...this.dateTime, duration: val })
    }
  }
}
</script>

<style lang="scss" scoped></style>
