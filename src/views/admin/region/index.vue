<template>
  <basic-container>
    <div class="avue-crud">
      <el-form ref="queryForm" :model="queryParams" :inline="true">
        <el-form-item label="名称" prop="regionName">
          <el-input
              v-model="queryParams.regionName"
              placeholder="请输入名称"
              clearable
              size="small"
              @keyup.enter.native="getList"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="getList">搜索</el-button>
        </el-form-item>
      </el-form>

      <el-table
          v-loading="loading"
          border
          :data="regionList"
          row-key="code"
          :tree-props="{children: 'children'}">
        <el-table-column prop="label" label="名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="level" label="层级" align="center"></el-table-column>
        <el-table-column prop="code" label="编码" align="center"></el-table-column>
        <el-table-column prop="parent" label="上级编码" align="center"></el-table-column>
        <el-table-column :formatter="formatDate" prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template v-slot="scope">
            <el-button
                v-if="permissions.sys_region_del"
                size="small"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </basic-container>
</template>

<script>
import {delObj, fetchTree} from '@/service/sys.region.service.js'
import {mapGetters} from 'vuex'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

export default {
  name: 'SysRegion',
  components: {},
  data() {
    return {
      loading: true,
      regionList: [],
      queryParams: {
        regionName: ''
      }
    }
  },
  computed: {
    ...mapGetters(['permissions', 'website'])
  },
  created() {
    this.getList()
  },
  methods: {
    refreshChange() {
      this.getList(this.page)
    },
    getList() {
      this.loading = true
      fetchTree(this.queryParams).then(response => {
        const {data} = response
        this.regionList = data
        this.loading = false
      })
    },
    handleDelete(row) {
      this.$confirm('是否确认删除名称为"' + row.label + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function () {
        return delObj(row._id)
      }).then(() => {
        this.getList()
        this.$message.success('删除成功')
      })
    },
    formatDate(row, column, cellValue) {
      return dayjs(cellValue).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>
