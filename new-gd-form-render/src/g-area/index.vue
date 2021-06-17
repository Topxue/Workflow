<!--
 * @Author: caohao
 * @Date: 2020-11-09 17:44:13
 * @LastEditors: caohao
 * @LastEditTime: 2021-05-26 17:00:55
 * @Description: 省市区组件
-->
<template>
  <div class="g-area">
    <div class="g-area-lable">
      <span v-if="dataInfo.options.required" class="require_icon">*</span>
      <span style="color:#606266">{{dataInfo.name ||''}}</span>
    </div>
    <div class="g-area-content">
      <!-- 省的选择 -->
      <g-form-item :decorator="provincerules" prop="provinceData" hiddenLable :label="dataInfo.name" class="g-area-item" :required="dataInfo.options.required">
        <el-select
          :disabled="dataInfo.options.disabled|| dataInfo.options.writeable===false"
          v-model="provinceData"
          placeholder="请选择省份"
          clearable
          @change="proChange"
          value-key="code"
        >
          <el-option v-for="item in province_list" :key="item.code" :label="item.name" :value="item">{{item.name}}</el-option>
        </el-select>
      </g-form-item>
      <!-- 市的选择   columnsnum2，3时 显示市的选择-->
      <g-form-item
        :decorator="cityrules"
        prop="cityData"
        v-if="dataInfo.options.columnsnum>1"
        hiddenLable
        :label="dataInfo.name"
        class="g-area-item"
        :required="dataInfo.options.required"
      >
        <el-select
          :disabled="dataInfo.options.disabled|| dataInfo.options.writeable===false"
          v-model="cityData"
          placeholder="请选择城市"
          clearable
          @change="cityChange"
          value-key="code"
        >
          <el-option v-for="item in city_list" :key="item.code" :label="item.name" :value="item">{{item.name}}</el-option>
        </el-select>
      </g-form-item>
      <!-- 区的选择  columnsnum3时 显示区的选择-->
      <g-form-item
        :decorator="arearules"
        prop="countyData"
        hiddenLable
        v-if="dataInfo.options.columnsnum>2"
        :label="dataInfo.name"
        class="g-area-item"
        :required="dataInfo.options.required"
      >
        <el-select
          :disabled="dataInfo.options.disabled|| dataInfo.options.writeable===false"
          v-model="countyData"
          placeholder="请选择区域"
          clearable
          @change="countyChange"
          value-key="code"
        >
          <el-option v-for="item in county_list" :key="item.code" :label="item.name" :value="item">{{item.name}}</el-option>
        </el-select>
      </g-form-item>
      <!-- 详细地址 -->
      <g-form-item
        :decorator="detailRuls"
        prop="areaDetail"
        hiddenLable
        class="g-area-item"
        :label="dataInfo.name"
        v-if="dataInfo.options.isdetails"
        :required="dataInfo.options.required"
      >
        <el-input v-model="areaDetail" @input="detailChange" :disabled="dataInfo.options.disabled|| dataInfo.options.writeable===false" placeholder="请填写详细地址"></el-input>
      </g-form-item>
    </div>
  </div>
</template>
<script>
import valueMixin from '../mixins/valueMixin'
import areaData from './area'
export default {
  name: 'GArea',
  mixins: [valueMixin],
  data() {
    return {
      // cityData: '',
      // countyData: '',
      // areaDetail: '',
      provincerules: [], // 省份验证规则
      cityrules: [], // 城市验证规则
      arearules: [], // 区域验证规则
      detailRuls: [], //  详情验证规则
      province_list: [], // 基础及显示的 省份数据
      city_list: [], // 基础的城市数据
      county_list: [] // 基础的区域数据
    }
  },
  computed: {
    provinceData: {
      get() {
        let value
        if (!!this.value) {
          value = JSON.parse(this.value)
        }
        return this.value && value.areaCode ? value.areaCode[0] : ''
      },
      set() {}
    },
    cityData: {
      get() {
        let value
        if (!!this.value) {
          value = JSON.parse(this.value)
        }
        return this.value && value.areaCode ? value.areaCode[1] : ''
      },
      set() {}
    },
    countyData: {
      get() {
        let value
        if (!!this.value) {
          value = JSON.parse(this.value)
        }
        return this.value && value.areaCode ? value.areaCode[2] : ''
      },
      set() {}
    },
    areaDetail: {
      get() {
        let value
        if (!!this.value) {
          value = JSON.parse(this.value)
        }
        return this.value ? value.areaDetail : ''
      },
      set() {}
    }
  },
  created() {
    if (this.dataInfo.options.required) {
      this.provincerules = [{ required: true, message: '省份必选' }]
      this.cityrules = [{ required: true, message: '城市必选' }]
      this.arearules = [{ required: true, message: '区域必选' }]
      this.detailRuls = [{ required: true, message: '详细地址必写' }]
    }
    // this.value = JSON.stringify({
    //   areaCode: [
    //     { code: '370000', name: '山东省' },
    //     { code: '370100', name: '济南市' },
    //     { code: '370102', name: '历下区' }
    //   ],
    //   areaDetail: '111'
    // })
    this.province_list = this.formatArea(1)
    // this.city_list = this.formatArea(2, '370000')
    // this.county_list = this.formatArea(2, '370100')
    // 编辑的时候 回显省市区
    if (this.dataInfo.value) {
      let editValue = JSON.parse(this.dataInfo.value)
      let { areaCode } = editValue
      areaCode[0] && (this.city_list = this.getCityData(areaCode[0].code))
      areaCode[1] && (this.county_list = this.getShowCountylist(areaCode[1].code))
    }
  },
  methods: {
    formatArea(type, id) {
      //省
      if (type === 1) {
        return areaData.map(item => ({ name: item.name, code: item.code }))
      } else if (type === 2) {
        // 市
        return this.deepTree(areaData, id)
      }
    },
    deepTree(arr, id, init = []) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].code === id) {
          init.push(...arr[i].children)
          break
        }
        if (arr[i].children) this.deepTree(arr[i].children, id, init)
      }
      return init.map(item => ({ name: item.name, code: item.code }))
    },
    // 省的change事件
    proChange(e) {
      if (!!e) {
        let { name, code } = e
        this.city_list = this.getCityData(code)
      } else {
        this.city_list = []
      }
      this.county_list = []
      this.value = JSON.stringify({ areaCode: [e] })
    },
    // 获取对应的城市下俩数据
    getCityData(provinceCode) {
      return this.formatArea(2, provinceCode)
    },
    // 城市的change事件
    cityChange(e) {
      if (!!e) {
        let { name, code } = e
        this.county_list = this.getShowCountylist(code)
      } else {
        this.county_list = []
      }
      let value = JSON.parse(this.value)
      this.value = JSON.stringify({
        ...value,
        areaCode: [value.areaCode[0], e]
      })
    },
    // 获取对应的区域 下拉数据
    getShowCountylist(cityCode) {
      return this.formatArea(2, cityCode)
    },
    // 区的change事件
    countyChange(e) {
      let { name, code } = e
      let value = JSON.parse(this.value)
      this.value = JSON.stringify({
        ...value,
        areaCode: [value.areaCode[0], value.areaCode[1], e]
      })
    },
    //  详细地址的change事件
    detailChange(e) {
      let value = JSON.parse(this.value)
      this.value = JSON.stringify({
        ...value,
        areaDetail: e
      })
    }
  }
}
</script>
<style lang="scss">
.g-area {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  position: relative;
  .g-area-lable {
    line-height: 36px;
    margin-right: 10px;
    .require_icon {
      position: absolute;
      left: -10px;
      color: #f73e3e;
    }
  }
  .g-area-content {
    display: flex;
    .g-area-item {
      margin-right: 10px;
    }
  }
}
</style>