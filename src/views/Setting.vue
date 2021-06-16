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
        <el-button class="button-publish" type="primary">Publish</el-button>
      </div>
    </header>

    <div class="fd-nav-content">
      <base-setting ref="baseform" v-show="currentTab === 1" :formBaseInfo.sync="formBaseInfo"></base-setting>
<!--      <node-warp v-show="currentTab === 3"-->
<!--                 :isTried.sync="isTried"-->
<!--                 :nodeConfig.sync="nodeConfig"-->
<!--                 :directorMaxLevel="directorMaxLevel">-->
<!--      </node-warp>-->
    </div>

  </div>
</template>

<script>
import {Tabs, DEFAULT_GOT_X, getDefaultWorkflowConfig} from '@/config'

// import NodeWarp from '@/components/nodeWrap'
import BaseSetting from '@/components/baseSetting'


export default {
  components: {
    // NodeWarp,
    BaseSetting
  },
  data() {
    return {
      Tabs,
      icons: [],
      iconUrl: '',
      ghostX: '0',
      currentTab: 1,
      formBaseInfo: {
        iconUrl: '',
        appName: ''
      },
      nodeConfig: {},
      isTried: false,
      directorMaxLevel: 6
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
  }
}
</script>
<style scoped src="@/assets/style/workflow.css"></style>
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
