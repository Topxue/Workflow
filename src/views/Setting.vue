<template>
  <div class="workflow-setting">
    <header class="header-warper">
      <div class="header-nav-left">
        <div class="header-nav-back">
          <i class="el-icon el-icon-arrow-left"></i>
        </div>
        <div class="header-app-icon">
          <img :src="formBaseInfo.iconUrl" alt="">
        </div>
        <div class="application-name fd-nav-title">{{ formBaseInfo.appName }}</div>
      </div>
      <div class="fd-nav-center">
        <div class="fd-nav-container">
          <div class="ghost-bar" :style="{ transform: `translateX(${ghostX})` }"></div>
          <div v-for="(item, index) in Tabs"
               :class="['fd-nav-item', item.isActive ? 'active' : '']"
               :key="index"
               @click="checkTab(index)"
          >
            {{ item.tab }}
          </div>
        </div>
      </div>
      <div class="header-nav-Right">
        <el-button class="button-publish" type="primary" @click="saveWorkFlow">Publish</el-button>
      </div>
    </header>

    <div class="fd-nav-content">
      <!--基础设置-->
      <base-setting ref="baseform" v-show="currentTab === 1" :formBaseInfo.sync="formBaseInfo"></base-setting>
      <!--流程设计-->
      <section class="dingflow-design" v-show="currentTab === 3">
        <div class="zoom">
          <div :class="'zoom-out' + (nowVal == 50 ? ' disabled' : '')" @click="zoomSize(1)"></div>
          <span>{{ nowVal }}%</span>
          <div :class="'zoom-in' + (nowVal == 300 ? ' disabled' : '')" @click="zoomSize(2)"></div>
        </div>
        <div class="box-scale" id="box-scale" :style="getScaleStyle">
          <nodeWrap :isTried.sync="isTried" :nodeConfig.sync="nodeConfig" :directorMaxLevel="directorMaxLevel"
          ></nodeWrap>

          <div class="end-node">
            <div class="end-node-circle"></div>
            <div class="end-node-text">流程结束</div>
          </div>
        </div>
      </section>
    </div>

    <ErrorTrip :tipVisible.sync="tipVisible" :tipList="tipList" @checkTab="checkTab"/>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

import {
  Tabs,
  START_NODE,
  WORKER_NODE,
  APPROVE_NODE,
  NOTIFIER_NODE,
  DEFAULT_GOT_X,
  CONDITION_ROUTE_NODE,
  getDefaultWorkflowConfig
} from '@/config'

import NodeWarp from '@/components/nodeWrap'
import ErrorTrip from '@/components/ErrorTrip'
import BaseSetting from '@/components/baseSetting'

// 发起人-审批人 节点类型
const NODE_TYPE = [START_NODE, APPROVE_NODE]

export default {
  components: {
    NodeWarp,
    ErrorTrip,
    BaseSetting
  },
  data() {
    return {
      Tabs,
      icons: [],
      iconUrl: '',
      ghostX: '0',
      nowVal: 100,
      currentTab: 1,
      tipList: [],
      formBaseInfo: {
        iconUrl: '',
        appName: ''
      },
      nodeConfig: {},
      isTried: false,
      tipVisible: false,
      directorMaxLevel: 6
    }
  },
  computed: {
    ...mapGetters(['formJsonData', 'userIds']),
    getScaleStyle({nowVal}) {
      return 'transform: scale(' + nowVal / 100 + '); transform-origin: 50% 0px 0px;'
    }
  },

  mounted() {
    this.nodeConfig = getDefaultWorkflowConfig()
  },

  methods: {
    checkTab(currentIndex) {
      this.Tabs.forEach((item, index) => {
        item.isActive = currentIndex === index
      })
      this.currentTab = currentIndex + 1

      this.setGhostX(currentIndex)
    },

    // setting current tab active
    setGhostX(currentIndex) {
      this.ghostX = DEFAULT_GOT_X * currentIndex + 'px'
    },

    errorData(data) {
      if (data && data.childNode) {
        if (data.childNode.nodeType === APPROVE_NODE) {
          //审批人
          if (data.childNode.error) {
            this.tipList.push({name: data.childNode.nodeName, setp: 3, type: '审批人'})
          }
          this.errorData(data.childNode)
        } else if (data.childNode.nodeType === NOTIFIER_NODE) {
          if (data.childNode.error) {
            this.tipList.push({name: data.childNode.nodeName, setp: 3, type: '抄送人'})
          }
          this.errorData(data.childNode)
        } else if (data.childNode.nodeType === WORKER_NODE) {
          if (data.childNode.error) {
            this.tipList.push({name: data.childNode.nodeName, setp: 3, type: '办理人'})
          }
          this.errorData(data.childNode.childNode)
        } else if (data.childNode.nodeType === CONDITION_ROUTE_NODE) {
          this.errorData(data.childNode)
          for (var i = 0; i < data.childNode.conditionNodes.length; i++) {
            if (data.childNode.conditionNodes[i].error) {
              this.tipList.push({
                name: data.childNode.conditionNodes[i].nodeName,
                setp: 3,
                type: '条件'
              })
            }
            this.errorData(data.childNode.conditionNodes[i])
          }
        }
      } else {
        if (data) {
          data.childNode = null
        } else {
          return ''
        }
      }
    },

    catchErrorData(baseInfo) {
      if (!baseInfo.appName) {
        this.tipList.push({name: '基础设置', setp: 1, type: '应用名称不能为空'})
      }
      if (!baseInfo.groupId) {
        this.tipList.push({name: '基础设置', setp: 1, type: '未选择分组'})
      }

      if (!this.formJsonData.columns.length) {
        this.tipList.push({name: '表单设计', setp: 2, type: '空表单不能保存'})
      }
    },


    getPropertyFormList(formData, nodeType, formPropertyList = []) {
      const startNode = nodeType === START_NODE

      return formData.map(form => {
        const formEacho = formPropertyList.find(item => item.id === form.model)
        /**
         * 处理兼容老数据
         */
        if (form && 'required' in form) delete form.required
        if (formEacho && 'required' in formEacho) delete formEacho.required

        if (formEacho) {
          return formEacho
        } else {
          return {
            id: form.model,
            name: form.name,
            type: form.type,
            writeable: startNode,
            readable: startNode ? startNode : !startNode
          }
        }
      })
    },
    // 表单数据扁平处理
    faltFormJsonData(column, mapFormData) {
      column.forEach(item => {
        if (item.columns) {
          this.faltFormJsonData(item.columns, mapFormData)
          return
        }
        mapFormData.push(item)
      })
    },

    /**
     * 递归更新表单权限列表(初始化)
     */
    updatePropertyFormList(nodeConfig) {
      const nodeType = nodeConfig.nodeType

      const formJsonData = []
      this.faltFormJsonData(this.formJsonData.columns, formJsonData)

      if (NODE_TYPE.includes(nodeType)) {
        if (!nodeConfig.properties?.formPropertyList?.length) {
          nodeConfig.properties.formPropertyList = this.getPropertyFormList(formJsonData, nodeType)
        } else {
          const formPropertyList = nodeConfig.properties.formPropertyList

          nodeConfig.properties.formPropertyList = this.getPropertyFormList(formJsonData, nodeType, formPropertyList)
        }
      }

      if (nodeConfig.childNode) {
        this.updatePropertyFormList(nodeConfig.childNode)
      } else {
        if (nodeType === CONDITION_ROUTE_NODE) {
          nodeConfig.conditionNodes.forEach(item => {
            item.childNode && this.updatePropertyFormList(item.childNode)
          })
        }
      }

      return nodeConfig
    },

    saveWorkFlow() {
      this.isTried = true
      this.tipList = []

      const formBaseSetting = this.$refs.baseform.formBaseSeting
      this.catchErrorData(formBaseSetting)
      this.errorData(this.nodeConfig)

      if (this.tipList.length) {
        this.tipVisible = true
        return
      }

      const params = {
        formBaseSetting,
        formConfig: JSON.stringify(this.formJsonData),
        processConfig: this.updatePropertyFormList(this.nodeConfig),
        processDefKey: this.processDefKey
      }

      const userIds = this.userIds
      if (userIds && userIds.length) {
        params.formBaseSetting.userIds = userIds.map(user => user.id)
      } else {
        params.formBaseSetting.userIds = []
      }


      console.log(params, 'params...')

      // if (delayTime) clearTimeout(delayTime)
      //
      // delayTime = setTimeout(async () => {
      //   const {code} = await saveFormAndProcess(params)
      //   if (code === ERROR_OK) {
      //     this.$message.success('发布成功')
      //     this.resetFormJson()
      //     this.toReturn()
      //   }
      // }, 500)
    },
    zoomSize(type) {
      if (type == 1) {
        if (this.nowVal == 50) {
          return
        }
        this.nowVal -= 10
      } else {
        if (this.nowVal == 300) {
          return
        }
        this.nowVal += 10
      }
    }
  }
}
</script>
<style lang="scss" scoped>

$baseBgColor: #ffffff;
$baseWarperColor: #f3f3f3;

.workflow-setting {
  width: 100%;
  height: 100vh;
  background: $baseWarperColor;

  .header-warper {
    height: 54px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px 0 0;
    background: $baseBgColor;
    box-shadow: 0 1px 4px 0 #e6ebf5;

    .header-nav-left {
      width: 180px;
      display: flex;
      align-items: center;

      .header-nav-back {
        width: 54px;
        height: 54px;
        line-height: 54px;
        text-align: center;
        display: inline-block;
        font-size: 22px;
        cursor: pointer;
      }

      .header-app-icon {
        min-width: 40px;
        min-height: 40px;
        width: 40px;
        height: 40px;

        img {
          width: 100%;
        }
      }

      .application-name {
        margin-left: 10px;
      }
    }

    .fd-nav-center {
      flex: none;
      width: 600px;
      text-align: center;
      font-size: 15px;
      margin-left: -120px;

      .fd-nav-container {
        display: inline-block;
        position: relative;

        .ghost-bar {
          position: absolute;
          width: 150px;
          height: 100%;
          left: 0;
          -webkit-transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
          transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        }

        .ghost-bar:after {
          content: '';
          position: absolute;
          margin-left: -12px;
          border: 1px solid #0089ff;
          width: 24px;
          top: 52px;
          left: 75px;
        }

        .fd-nav-item {
          position: relative;
          cursor: pointer;
          display: inline-block;
          line-height: 54px;
          width: 150px;
          text-align: center;
          white-space: nowrap;
        }

        .fd-nav-item.active .order-num {
          color: #1583f2;
          background: #fff;
        }
      }
    }
  }


}
</style>
