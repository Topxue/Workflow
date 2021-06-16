<template>
  <div class="base-seting-content">
    <el-popover placement="bottom-start" width="400" trigger="click" v-model="popover">
      <div class="icon-list">
        <div
            class="icon-item"
            v-for="(icon, index) in icons"
            :key="index"
            @click="handleSelectIcon(icon)"
        >
          <img :src="icon.logoUri"/>
        </div>
      </div>

      <div class="icon-warper" slot="reference">
        <img v-if="iconUrl" :src="iconUrl" alt=""/>
        <div class="edit-icon-warper">
          <svg-icon icon-class="icon-edit" class-name="icon-edit"></svg-icon>
        </div>
      </div>
    </el-popover>

    <el-form
        :model="formBaseSeting"
        :rules="rules"
        ref="formBaseSeting"
        label-position="top"
        label-width="80px"
    >
      <el-form-item label="应用名称" prop="appName" class="form-name-item">
        <el-input maxlength="7" v-model="formBaseSeting.appName" @input="handleAppName"></el-input>
      </el-form-item>
      <el-form-item label="所在分组" prop="groupId">
        <el-select v-model="formBaseSeting.groupId" placeholder="请选择所在分组">
          <el-option
              v-for="list in groupData"
              :key="list.id"
              :label="list.groupName"
              :value="list.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="表单说明">
        <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="formBaseSeting.remark"
            maxlength="100"
            show-word-limit
            :autosize="{ minRows: 4, maxRows: 8 }"
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {BASE_URL, AUTH_TOKEN} from '@/config'

const ERROR_OK = 10000

export default {
  name: 'formBaseSeting',
  props: ['formBaseInfo'],
  components: {},
  data() {
    return {
      baseUrl: BASE_URL,
      groupData: [],
      popover: false,
      formBaseSeting: {
        appId: '',
        remark: '',
        appName: '',
        groupId: '',
        iconUrl: '',
        userIds: []
      },
      rules: {
        appName: [
          {required: true, message: '请输入应用名称', trigger: 'blur'},
          {min: 1, max: 7, message: '长度最多7字', trigger: 'blur'}
        ],
        groupId: [{required: true, message: '请选择所在分组', trigger: 'blur'}]
      },
      iconUrl: '',
      icons: []
    }
  },

  mounted() {
    this.getGroupData()
    this.getApplicationIcons()
  },

  methods: {
    /**
     * 获取应用所有icons
     */
    async getApplicationIcons() {
      const {data} = await this.$axios('/mock/applications')
      this.icons = data.map(item => {
        item.logoUri = `${BASE_URL}${item.logoUri}/?token=${AUTH_TOKEN}`
        return item
      })

      const defaultIcon = this.icons[0].logoUri
      this.iconUrl = defaultIcon
      this.formBaseSeting.iconUrl = defaultIcon

      this.updateFormBaseInfo({
        iconUrl: defaultIcon
      })
    },

    // 修改App应用名称
    handleAppName(appName) {
      this.updateFormBaseInfo({
        appName,
        iconUrl: this.formBaseInfo.iconUrl
      })
    },

    async getGroupData() {
      const {data} = await this.$axios('/mock/group')

      this.groupData = data
    },

    // 选择图标
    handleSelectIcon(icon) {
      this.iconUrl = icon.logoUri
      this.popover = false

      this.updateFormBaseInfo({
        iconUrl: icon.logoUri,
        appName: this.formBaseSeting.appName
      })

    },

    updateFormBaseInfo(params) {
      this.$emit('update:formBaseInfo', params)
    }
  }
}
</script>

<style lang="scss" scoped>
.base-seting-content {
  width: 665px;
  padding: 24px;
  border-radius: 8px;
  background: #fff;
  transform: translateX(-3%);
  overflow: auto;
  margin-top: 15px;

  .form-name-item {
    margin-left: 75px;
  }

  .icon-warper {
    position: absolute;
    top: 30px;
    min-width: 50px;
    min-height: 50px;
    width: 50px;
    height: 50px;
    line-height: 45px;
    cursor: pointer;
    text-align: center;
    border-radius: 18px;

    .edit-icon-warper {
      position: absolute;
      bottom: 0;
      right: 0;
      background-color: #f6f6f6;
      border: 2px solid #fff;
      border-radius: 16px;
      width: 16px;
      height: 16px;
      line-height: 16px;
      color: rgba(17, 31, 44, 0.4);
      font-size: 12px;
      text-align: center;
      cursor: pointer;

      .icon-edit {
        font-size: 10px;
        margin-bottom: 3px;
      }
    }

    img {
      width: 100%;
      height: 100%;
    }
  }

  .el-select {
    width: 100%;
  }
}

.icon-list {
  display: flex;
  flex-wrap: wrap;
  margin-top: 15px;
}

.icon-item {
  width: 49px;
  height: 49px;
  border-radius: 10px;
  overflow: hidden;
  margin: 0 1px 10px 10px;
  cursor: pointer;

  img {
    width: 100%;
  }
}
</style>
