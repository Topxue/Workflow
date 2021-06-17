<template>
  <div class="gd-oa-form">
    <g-form ref="ValidateForm">
      <template v-for="(item, index) in formList">
        <template v-if="item">
          <div :key="item.key" ref="condition">
            <div class="component-warper">
              <component
                  v-bind="$attrs"
                  :is="setCurrentComponentType(item.type)"
                  v-if="item.options.readable !== false"
                  :dataInfo="item"
                  formType="condition"
              ></component>
              <i class="el-icon-delete" @click="handleDeleteComponent(index)"></i>
            </div>
            <div class="and" v-if="index < isShowAnd">且</div>
          </div>
        </template>
      </template>
    </g-form>
  </div>
</template>

<script>
import {NUMBER_COMPONENT_TYPE} from './config'

export default {
  name: 'ProcessFormRender',
  data() {
    return {
      device: 'pc',
      formList: [],
      defaultOption: {
        label: '大于等于',
        value: 'ge'
      }
    }
  },

  computed: {
    isShowAnd() {
      const isUndefined = this.formList.filter((item) => typeof item === 'undefined')
      const isMinusCount = isUndefined.length ? 2 : 1

      return this.formList.length - isMinusCount
    }
  },

  methods: {
    setCurrentComponentType(type) {
      const CURRENT_TYPE = NUMBER_COMPONENT_TYPE

      if (type === 'select') return 'process-select'

      return CURRENT_TYPE.includes(type) ? 'process-number' : `g-${type}`
    },
    handleDeleteComponent(index) {
      this.formList.splice(index, 1)
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .component-warper {
  display: flex;
  align-items: center;
  position: relative;

  .el-icon-delete {
    position: absolute;
    top: 10px;
    right: 0;
    cursor: pointer;
  }

  /deep/ .content {
    width: 322px;
    margin-bottom: 2px;
  }
}

.and {
  margin: -15px 0 10px 35px;
  color: rgba(17, 31, 44, 0.56);
}

/deep/ .el-input-number--small {
  width: 85%;
}

/deep/ .el-select {
  width: 374px !important;
  /* margin-right: 0; */
}

/deep/ .g-form-item .lable {
  width: 105px !important;
  line-height: 22px !important;
}
</style>
