<template>
  <div class="g-kit-leave">
    <!-- <g-form-render :showMore="false" :processDefinitionId="processDefinitionId" :kit-data="dataInfo" :form-list="dataInfo.columns[0].columns" ref="form"></g-form-render> -->
    <template v-for="li in dataInfo.columns[0].columns">
      <component v-bind="$attrs" :is="'g-' + li.type" :key="li.key" v-if="li.options.readable !== false" :kit-data="dataInfo" :dataInfo="li"></component>
    </template>
  </div>
</template>
<script>
import valueMixin from '../mixins/valueMixin'
export default {
  name: 'g-kit-leave',
  mixins: [valueMixin],
  mounted() {}
}
</script>
