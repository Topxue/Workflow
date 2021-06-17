<!--
 * @Author: caohao
 * @Date: 2020-12-03 11:37:27
 * @LastEditors: caohao
 * @LastEditTime: 2021-06-07 18:22:22
 * @Description: 面包屑组件
-->
<template>
  <div class="g-breadcrumb" @click="handleClick">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'g-breadcrumb',
  props: {
    separator: {
      type: String,
      default: '>'
    }
  },
  methods: {
    handleClick() {
      console.log(1)
    }
  },
  provide() {
    return {
      gdBreadcrumb: this
    }
  }
}
</script>
<style lang="scss" scoped>
.g-breadcrumb {
  display: flex;
  flex-wrap: wrap;
}
</style>