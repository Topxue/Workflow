<!--
 * @Author: caohao
 * @Date: 2020-12-03 11:56:55
 * @LastEditors: caohao
 * @LastEditTime: 2021-06-07 18:33:12
 * @Description: 面包屑组件
-->
<template>
  <div class="g-breadcrumb-item" :class="{ last: isLast }">
    <div class="label">
      <slot></slot>
    </div>
    <i v-if="!isLast" class="el-icon-arrow-right"></i>
  </div>
</template>
<script>
export default {
  name: 'g-breadcrumb-item',
  data() {
    return {
      separator: ''
    }
  },
  inject: ['gdBreadcrumb'],
  props: ['isLast'],
  mounted() {
    this.separator = this.gdBreadcrumb.separator
    console.log(this)
  },
  inheritAttrs: false
}
</script>
<style lang="scss" scoped>
.g-breadcrumb-item {
  display: flex;
  align-items: center;
  color: #3296fa;
  .then-icon {
    margin: 0 5px;
  }
}
.g-breadcrumb-item:hover {
  cursor: pointer;
}
.last {
  .label {
    color: #c0c4cc;
  }
  .separator {
    display: none;
  }
}
.last:hover {
  cursor: default;
}
</style>
