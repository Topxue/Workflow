<!--
 * @Author: caohao
 * @Date: 2021-03-18 14:07:36
 * @LastEditors: caohao
 * @LastEditTime: 2021-04-13 09:09:16
 * @Description: 加班套件
-->
<template>
  <div class="g-kit-overtime">
    <!-- <g-form-render :showMore="false" :processDefinitionId="processDefinitionId" :kit-data="dataInfo" :form-list="dataInfo.columns[0].columns" ref="form"></g-form-render> -->
    <template v-for="li in dataInfo.columns[0].columns">
      <component v-bind="$attrs" :is="'g-' + li.type" :key="li.key" v-if="li.options.readable !== false" :kit-data="dataInfo" :dataInfo="li"></component>
    </template>
  </div>
</template>
<script>
import valueMixin from '../mixins/valueMixin'
export default {
  name: 'g-kit-overtime',
  mixins: [valueMixin],
  mounted() {}
}
</script>
