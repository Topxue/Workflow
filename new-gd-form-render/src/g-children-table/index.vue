<!--
 * @Author: caohao
 * @Date: 2021-06-10 11:46:03
 * @LastEditors: caohao
 * @LastEditTime: 2021-06-10 16:19:32
 * @Description: 子表
-->
<template>
  <div class="g-children-table">
    <div class="table-name">{{dataInfo.name}}</div>
    <el-table :data="dataInfo.tableList" border style="width: calc(100% - 100px);margin-left:auto">
      <el-table-column v-for="(col,key) in dataInfo.columns" align="center" header-align="center" :key="key" :label="col.name">
        <template slot-scope="scope">
          <!-- <component v-bind="$attrs" v-if="tel.options.readable!==false" :is="'g-'+tel.type" :key="index+telindex" :dataInfo="tel"></component> -->
          <component
            v-bind="$attrs"
            :is="'g-' + scope.row[key].type"
            :key="scope.row[key].key"
            hiddenLable
            v-if="scope.row[key].options.readable !== false"
            :dataInfo="scope.row[key]"
          ></component>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import valueMixin from '../mixins/valueMixin'
export default {
  name: 'g-children-table',
  mixins: [valueMixin]
}
</script>
<style lang="scss" >
.g-children-table {
  margin-bottom: 15px;
  .table-name {
    margin-bottom: 10px;
    width: 100px;
    text-align: center;
  }
  .el-table__row td {
    padding: 10px 0;
    .g-form-item {
      margin-bottom: 0;
    }
    .g-form-item {
      .content {
        display: flex;
        align-items: center;
        .el-input-number {
          flex: 1;
        }
      }
    }

    .cell {
      overflow: initial;
    }
  }
}
</style>