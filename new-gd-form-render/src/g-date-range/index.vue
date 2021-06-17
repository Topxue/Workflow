<template>
  <div>
    <g-form-item :decorator="dataInfo.rules" prop="dateVal" :label="dataInfo.name" :required="dataInfo.options.required">
      <el-date-picker
        class="date-change-warper"
        v-model="dateVal"
        range-separator="至"
        :type="dataInfo.options.type === 'halftime' ? 'daterange' : dataInfo.options.type"
        :format="dataInfo.options.format"
        :value-format="dataInfo.options.format"
        :start-placeholder="dataInfo.options.startPlaceholder"
        :end-placeholder="dataInfo.options.endPlaceholder"
        :placeholder="dataInfo.options.placeholder"
        :readonly="dataInfo.options.readonly"
        :disabled="dataInfo.options.disabled || dataInfo.options.writeable === false"
        :editable="dataInfo.options.editable"
        @change="changeDate"
        @click.native="handleFocus"
      ></el-date-picker>
      <!-- 暂时想不到的好的解决方法 硬写😃 -->
      <span class="am-slot" :style="disabledStyle" v-if="timeSoltState">{{ timeSolt[0] === 'am' ? '上午' : '下午' }}</span>
      <span class="pm-slot" :style="disabledStyle" v-if="timeSoltState">{{ timeSolt[1] === 'am' ? '上午' : '下午' }}</span>
    </g-form-item>

    <!-- 时长 -->
    <g-duration v-if="dataInfo.options.duration" ref="duration" :dataInfo="dataInfo" :disabled="durationDisable" :dateTime.sync="value"></g-duration>
    <!-- 日期明细 -->
    <template v-if="dataInfo.options.isDetail">
      <g-children-table v-bind="$attrs" :dataInfo="dateDetails"></g-children-table>
    </template>
  </div>
</template>

<script>
import { getTimeStamp, formatDuration } from '../../utils'
import valueMixin from '../mixins/valueMixin'
import kitmixins from './kitmixins'
import GDuration from '../g-duration'
import observerMixins from '../mixins/observerMixins'
import flowchartMixin from '../mixins/flowchartMixin'

const ACTIVE_CLASS_NAME = 'active'
const JOKER_WARPER = 'joker_warper'
const JOKER_WARPER_TWO = 'joker_warper_two'

const AM = 'am'
const PM = 'pm'

export default {
  name: 'g-daterange',
  mixins: [valueMixin, observerMixins, kitmixins, flowchartMixin],
  components: {
    GDuration
  },
  data() {
    return {
      dateVal: [], // element 时间选择数据 格式为数组！
      timeSoltState: false,
      timeSolt: ['am', 'am'],
      durationDisable: true, // 时长组件的可写状态  请假套件假期不足时，日期可写 时长不可写  就单独用了一个属性
      dateDetails: {
        name: '加班明细',
        options: {},
        columns: [
          {
            value: '',
            type: 'readonly-text',
            icon: 'form-input',
            options: {
              width: '100%',
              defaultValue: '',
              required: true
            },
            name: '加班时间',
            key: '1623208877000_80421',
            model: 'input_1623208877000_80421',
            rules: [
              {
                message: '加班时间必须填写',
                required: true
              }
            ]
          },
          {
            value: 0,
            type: 'inputNumber',
            icon: 'form-inputNumber',
            options: {
              width: '100%',
              defaultValue: '',
              required: true,
              dataType: '',
              pattern: '/^[0-9]+(.[0-9]{1,20})?$/',
              placeholder: '',
              disabled: false,
              unit: '',
              isCondition: false,
              condition: '',
              remoteFunc: 'func_1623219636000_87560'
            },
            name: '加班时长',
            key: '1623219636000_87560',
            model: 'inputNumber_1623219636000_87560',
            rules: [
              {
                message: '加班时长必须填写',
                required: true
              }
            ]
          }
        ],
        tableList: [
          [
            {
              value: '2021-06-10',
              type: 'readonly-text',
              icon: 'form-input',
              options: {
                width: '100%',
                defaultValue: '',
                required: true
              },
              name: '加班时间',
              key: '1623208877000_80421',
              model: 'input_1623208877000_80421',
              rules: [
                {
                  message: '加班时间必须填写',
                  required: true
                }
              ]
            },
            {
              value: 0,
              type: 'inputNumber',
              icon: 'form-inputNumber',
              options: {
                width: '100%',
                defaultValue: '',
                required: true,
                dataType: '',
                pattern: '/^[0-9]+(.[0-9]{1,20})?$/',
                placeholder: '',
                disabled: false,
                unit: '小时',
                isCondition: false,
                condition: '',
                remoteFunc: 'func_1623219636000_87560'
              },
              name: '加班时长',
              key: '1623219636000_87560',
              model: 'inputNumber_1623219636000_87560',
              rules: [
                {
                  message: '加班时长必须填写',
                  required: true
                },
                {
                  min: 0,
                  max: 4,
                  type: 'number',
                  message: '加班时长为0-5小时'
                }
              ]
            }
          ]
        ]
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.setDateVal()
    })
  },

  computed: {
    disabledStyle() {
      if (this.dataInfo.options.disabled || this.dataInfo.options.writeable === false) {
        return {
          color: '#C0C4CC'
        }
      }
    }
  },

  watch: {
    timeSolt() {
      if (this.dateVal.length) {
        this.changeDate(this.dateVal)
      }
    }
  },

  methods: {
    //日期数据回显
    setDateVal() {
      const dataInfo = this.dataInfo
      if (dataInfo.value) {
        const { startTime, endTime } = this.formatDate(dataInfo)

        this.dateVal = [startTime || '', endTime || '']

        const halftime = dataInfo.options.type === 'halftime'
        if (halftime) {
          const soltTimeOne = startTime.split(' ')[1]
          const soltTimeTwo = endTime.split(' ')[1]

          this.timeSolt = [soltTimeOne, soltTimeTwo]
        }

        this.timeSoltState = halftime
        this.durationDisable = this.dataInfo.options.writeable
      }
    },

    // 格式化 兼容日期格式
    formatDate(dataInfo) {
      const value = dataInfo.value

      if (value.startTime.includes('/')) {
        value.startTime = value.startTime.replace(/\/+/g, '-')
        value.endTime = value.endTime.replace(/\/+/g, '-')
      }

      return value
    },

    changeDate(date) {
      let dateObj = {}
      if (date && date.length) {
        const [startTime, endTime] = date
        const [startTimeSolt, endTimeSolt] = this.timeSolt

        const isTimeSolt = this.dataInfo.options.type !== 'halftime'

        dateObj = {
          startTime: isTimeSolt ? startTime : this.setNewDate(startTime, startTimeSolt),
          endTime: isTimeSolt ? endTime : this.setNewDate(endTime, endTimeSolt)
        }

        this.timeSoltState = !isTimeSolt

        // !this.dataInfo.options.isKit && (this.value = { ...this.value, ...dateObj })
        this.value = { ...this.value, ...dateObj }

        // 作为套件时 调用接口获取时长
        if (this.dataInfo.options.isKit) {
          this.vacationDuration(dateObj)
        } else {
          // 非套件 -> 日期区间计算时长
          this.calculationDuration(date)
        }
      } else {
        this.value = ''
        this.timeSoltState = false
        this.$refs.duration.duration = ''
      }
    },

    setNewDate(dateTime, timeSolt) {
      dateTime = dateTime.split(' ')[0]

      return `${dateTime} ${timeSolt}`
    },

    calculationDuration(date) {
      const [startDate, endDate] = date
      const [start, end] = this.timeSolt

      let timeStamp = getTimeStamp(endDate) - getTimeStamp(startDate)

      if (this.dataInfo.options.type === 'halftime') {
        timeStamp =
          getTimeStamp(`${endDate.split(' ')[0]} ${end === AM ? '12:00:00' : '24:00:00'}`) -
          getTimeStamp(`${startDate.split(' ')[0]} ${start === AM ? '00:00:00' : '12:00:00'}`)
      } else if (this.dataInfo.options.type === 'daterange') {
        timeStamp = getTimeStamp(`${endDate} 24:00:00`) - getTimeStamp(`${startDate} 00:00:00`)
      }

      if (this.dataInfo.options.type === 'datetimerange') {
        const hourCount = formatDuration(timeStamp, 'hour')

        this.value.duration = hourCount
        this.$refs.duration.duration = hourCount
        this.dataInfo.options.durationUnit = 'hour'
      } else {
        const dayCount = formatDuration(timeStamp, 'day')

        this.value.duration = dayCount
        this.$refs.duration.duration = dayCount
        this.dataInfo.options.durationUnit = 'day'
      }
    },

    handleFocus() {
      if (this.dataInfo.options.type !== 'halftime') {
        return false
      }

      this.$nextTick(() => {
        const reverseSelectDoms = [...document.querySelectorAll('.el-date-range-picker__header')].reverse()
        const querySelectDoms = [...reverseSelectDoms.slice(0, 2)].reverse()

        if (querySelectDoms.length) {
          querySelectDoms.forEach((element, index) => {
            const isHaveWarper = element.children[element.children.length - 1]
            if (isHaveWarper.classList.contains(JOKER_WARPER) || isHaveWarper.classList.contains(JOKER_WARPER_TWO)) {
              return false
            }

            const jokerName = index === 0 ? JOKER_WARPER : JOKER_WARPER_TWO
            const addClassName = index === 0 ? 'picker__header_one' : 'picker__header_two'

            querySelectDoms[index].classList.add(addClassName)
            querySelectDoms[index].appendChild(this.createElementDom(jokerName, index))
          })
        }
      })
    },

    removeSoltTimeDom() {
      const parent_one = document.querySelector('.picker__header_one')
      const parent_two = document.querySelector('.picker__header_two')

      const children_one = document.querySelector('.joker_warper')
      const children_two = document.querySelector('.joker_warper_two')

      if (children_one || children_two) {
        parent_one.removeChild(children_one)
        parent_two.removeChild(children_two)
      }
    },

    createElementDom(className, index) {
      const div = document.createElement('div')
      div.className = className

      const morning = document.createElement('span')
      const afternoon = document.createElement('span')

      morning.innerHTML = '上午'
      afternoon.innerHTML = '下午'

      morning.setAttribute('type', AM)
      afternoon.setAttribute('type', PM)

      // 时间段回显
      const isAm = this.timeSolt[index] === 'am'
      if (isAm) {
        morning.classList.add(ACTIVE_CLASS_NAME)
      } else {
        afternoon.classList.add(ACTIVE_CLASS_NAME)
      }

      div.append(morning)
      div.append(afternoon)

      div.addEventListener('click', this.checkTimeSlot)

      return div
    },

    checkTimeSlot({ target }) {
      const isCurrentType = target.getAttribute('type')

      if (isCurrentType === AM) {
        this.handleClassName(target.nextSibling, 'remove', ACTIVE_CLASS_NAME)
      } else {
        this.handleClassName(target.previousSibling, 'remove', ACTIVE_CLASS_NAME)
      }

      this.handleClassName(target, 'add', ACTIVE_CLASS_NAME)

      this.setTimeSlotDate(target, isCurrentType)
    },

    setTimeSlotDate(target, type) {
      const startDateCheck = target.parentNode.className === JOKER_WARPER

      if (startDateCheck) {
        this.timeSolt.shift()
        this.timeSolt.unshift(type)
      } else {
        this.timeSolt.pop()
        this.timeSolt.push(type)
      }
    },

    handleClassName(target, type, className) {
      return target.classList[type](className)
    }
  }
}
</script>
<style lang="scss">
.common-style {
  width: 70px;
  height: 22px;
  line-height: 22px;
  border: 1px solid #409eff;
  border-radius: 3px;
  display: flex;
  justify-content: space-between;
  position: absolute;
  top: 3px;
  font-size: 12px;

  span {
    display: inline-block;
    width: 50%;
    cursor: pointer;
  }

  .active {
    background: #409eff;
    color: #fff;
  }

  -webkit-user-select: none;
  -moz-user-select: none;
  -khtml-user-select: none;
  -ms-user-select: none;
  /* 以下两个属性目前并未支持，写在这里为了减少风险 */
  -o-user-select: none;
  user-select: none;
}

.picker__header_one {
  .joker_warper {
    @extend .common-style;
    right: -50px;
  }
}

.picker__header_two {
  .joker_warper_two {
    @extend .common-style;
    left: -50px;
  }
}

.date-change-warper {
  position: relative;
}

.am-slot {
  position: absolute;
  top: 11px;
  font-size: 12px;
  left: 136px;
}

.pm-slot {
  font-size: 12px;
  position: relative;
  top: 0;
  left: -63px;
}
</style>
