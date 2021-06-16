<template>
  <el-table :data="formPropertyList">
    <el-table-column label="表单字段" prop="name"></el-table-column>
    <el-table-column label="可写" prop="writeable">
      <template slot="header" slot-scope="scope">
        <el-checkbox v-model="readable" @change="handleFormState('readable')">
          可见
        </el-checkbox>
      </template>

      <template slot-scope="scope">
        <el-checkbox
            v-model="scope.row.readable"
            :checked="scope.row.readable"
            @change="changeCheckboxStatus(scope.row, 'readable')"
        ></el-checkbox>
      </template>
    </el-table-column>
    <el-table-column label="只读" prop="writeable">
      <template slot="header" slot-scope="scope">
        <el-checkbox
            v-model="writeable"
            :disabled="checkAllState()"
            @change="handleFormState('writeable')"
        >
          可写
        </el-checkbox>
      </template>

      <template slot-scope="scope">
        <el-tooltip
            :disabled="!isDisabled(scope.row)"
            :content="tooltipContent(scope.row)"
            placement="top"
        >
          <el-checkbox
              v-model="scope.row.writeable"
              :checked="scope.row.writeable"
              :disabled="isDisabled(scope.row)"
              @change="changeCheckboxStatus(scope.row, 'writeable')"
          ></el-checkbox>
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { mapGetters } from 'vuex'
import { sleep } from '../../utils'
import { START_NODE, APPROVE_NODE } from '../../config'

// 说明文字类型: type
const DESC_TEXT = 'desctext'

export default {
  name: 'FormSeting',
  props: ['formData', 'currentNode'],
  data() {
    return {
      writeable: false,
      readable: false,
      mapFormData: [],
      formPropertyList: []
    }
  },

  computed: {
    ...mapGetters(['formJsonData'])
  },

  watch: {
    formJsonData: {
      deep: true,
      immediate: true,
      handler: 'watcherFormData'
    }
  },

  methods: {
    watcherFormData(formData) {
      const mapFormData = []
      sleep(480).then(() => {
        if (formData && formData.columns) {
          this.faltFormJsonData(formData.columns, mapFormData)
          this.getFormData(mapFormData)
          this.mapFormData = mapFormData
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

    getFormData(formData) {
      const formState = {
        readable: [],
        writeable: []
      }

      //? 是否 -> 发起人表单
      const startNode = this.currentNode === START_NODE
      if (formData && formData.length) {
        this.formPropertyList = formData.map(form => {
          const formEcho = this.formData && this.formData.find(item => item.id === form.model)
          /**
           * 处理兼容老数据
           */
          if (formEcho && 'required' in formEcho) delete formEcho.required

          if (formEcho) {
            if (startNode) {
              formEcho.writeable = startNode && form.type !== DESC_TEXT
            } else {
              formEcho.writeable = !this.isCondition(formEcho) ? formEcho.writeable : false
              formEcho.readable = startNode ? startNode : !startNode
            }
            this.defaultCheckAll(formState, formEcho)
            return formEcho
          } else {
            this.defaultCheckAll(formState, formEcho)

            if (startNode) {
              this.readable = true
              this.writeable = true
            } else {
              this.readable = true
            }

            return {
              id: form.model,
              name: form.name,
              type: form.type,
              writeable: startNode && form.type !== DESC_TEXT,
              readable: startNode ? startNode : !startNode
            }
          }
        })
      }
    },

    handleFormState(curenState) {
      const formPropertyList = this.formPropertyList
      this.formPropertyList = formPropertyList.map(item => {
        if (curenState === 'writeable' && this[curenState]) {
          item.readable = true
          this.readable = true
        } else {
          item.writeable = false
          this.writeable = false
        }

        const isCondition = this.isCondition(item)
        const isDescText = curenState === 'writeable' && item.type === DESC_TEXT

        return {
          ...item,
          [curenState]: isDescText || isCondition ? false : this[curenState]
        }
      })
    },

    // 是否可以选择全部可写🤦‍♂️
    checkAllState() {
      if (this.currentNode === APPROVE_NODE) {
        if (this.mapFormData.length) {
          const iskit = this.mapFormData.some(form => {
            const isHaveKit = form.options.isKit

            return isHaveKit ? isHaveKit : false
          })

          return iskit
        }
      }
    },

    // 套件下的 不可以进行可写操作(改来改去的 烦的一批😒)
    isDisabled(row) {
      // 控制开始节点 可写状态
      if (this.currentNode === START_NODE) {
        return row.type === DESC_TEXT
      }

      // 控制审批节点 可写状态
      if (this.currentNode === APPROVE_NODE) {
        const isCondition = this.isCondition(row)
        const curFormItem = this.mapFormData.find(form => form.model === row.id)

        const isKit =
            (curFormItem && curFormItem.options?.isKit?.includes('kit')) ||
            curFormItem.type === DESC_TEXT ||
            isCondition

        return isKit
      }
    },
    // tooltip content
    tooltipContent(row) {
      const isCondition = this.isCondition(row)
      const curFormItem = this.mapFormData.find(form => form.model === row.id)

      if (isCondition) {
        return '设置为条件后审批人不可对该字段编辑'
      } else if (curFormItem && curFormItem.options?.isKit?.includes('kit')) {
        return '当前为套件审批人不可对该字段编辑'
      } else if (curFormItem.type === DESC_TEXT) {
        return '说明字段不能编辑'
      } else {
        return
      }
    },

    // 是否存在已经作为条件的表单
    isCondition(item) {
      // const alerlyCondtions = [...new Set(...this.$cacheMap.values())].flat(2)
      const alerlyCondtions = [...this.$cacheMap.values()].flat(2)

      return alerlyCondtions.includes(item.id)
    },

    changeCheckboxStatus(row, event) {
      if (event === 'writeable') {
        if (row.writeable) row.readable = true
      } else {
        if (!row.readable) row.writeable = false
      }

      this.isCheckAll('readable')
      this.isCheckAll('writeable')
    },

    defaultCheckAll(formState, formItem) {
      for (let key in formItem) {
        if (formState[key]) {
          formState[key].push(formItem[key])

          const len = formState[key].filter(item => item === true).length
          if (this.formData.length === len) this[key] = true
        }
      }
    },

    isCheckAll(event) {
      const len = this.formPropertyList.length
      const isCheckLen = this.formPropertyList.filter(item => item[event]).length
      this[event] = isCheckLen === len
    }
  }
}
</script>

<style lang="scss" scoped>
.radio-self {
  cursor: pointer;
  font-size: 13px;
}

.radio-self—check {
  font-size: 14px;
}
</style>
