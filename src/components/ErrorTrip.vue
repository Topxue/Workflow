<template>
  <el-dialog title="提示" :visible.sync="tipVisible" :before-close="closeDialog" width="500px">
    <div class="ant-confirm-body">
      <i class="anticon anticon-close-circle" style="color: #f00;"></i>
      <span class="ant-confirm-title">当前无法发布</span>
      <div class="ant-confirm-content">
        <div>
          <p class="error-modal-desc">以下内容不完善，需进行修改</p>
          <div class="error-modal-list">
            <div class="error-modal-item" v-for="(item, index) in tipList" :key="index">
              <div class="error-modal-item-label" v-if="item.setp === 1">基础设置</div>
              <div class="error-modal-item-label" v-if="item.setp === 2">表单设计</div>
              <div class="error-modal-item-label" v-if="item.setp === 3">流程设计</div>

              <div class="error-modal-item-content" v-if="item.setp === 3">
                {{ item.name }} 未选择{{ item.type }}
              </div>
              <div class="error-modal-item-content" v-else>
                {{ item.type }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">我知道了</el-button>
      <el-button type="primary" @click="changeTabEdit">前往修改</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'ErrorTrip',
  props: {
    tipVisible: {
      type: Boolean,
      default: false
    },
    tipList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {}
  },
  methods: {
    changeTabEdit() {
      for (let i = 0; i < this.tipList.length; i++) {
        this.$emit('checkTab', this.tipList[i].setp - 1)
        break
      }

      this.closeDialog()
    },

    closeDialog() {
      this.$emit('update:tipVisible', false)
    }
  }
}
</script>

<style lang="scss" scoped></style>
