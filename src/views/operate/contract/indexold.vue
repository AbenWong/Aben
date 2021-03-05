<template>
  <div class="app-container"><!--工具栏-->
    <div class="head-container">
      <!-- 搜索栏 -->
      <div v-if="!crud.props.searchToggle">
        <!-- 结算单号 -->
        <el-input v-model="query.no" clearable placeholder="请输入变更单号" style="width: 200px;" class="filter-item"/>
        <!--计划付款日期 -->
        <el-date-picker
          v-model="query.createTime"
          :default-time="['00:00:00','23:59:59']"
          type="daterange"
          range-separator=":"
          size="small"
          class="date-item"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          start-placeholder="创建开始日期"
          end-placeholder="创建结束日期"
        />
        <!-- 供应商  支持下拉模糊搜索-->
        <el-input v-model="query.merchantName" clearable filterable placeholder="请输入供应商名称" style="width: 200px;" class="filter-item"/>
        <!-- 单据状态 -->
        <el-select v-model="query.status" clearable placeholder="单据状态" class="filter-item" style="width: 130px">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
        <!-- 付款状态 -->
        <el-select v-model="query.payStatus" clearable placeholder="付款状态" class="filter-item" style="width: 130px">
          <el-option v-for="item in payStatusOptions" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
        <rrOperation :crud="crud"/>
      </div>

      <!-- 制单 -->
      <addForm ref="makeBillForm"/>
      <!-- 流程修改 -->
      <processForm ref="formP" :pInfo="pInfo"/>
      <!--
      <d-drawer ref="dialogD" :settleId="settleId" />
      -->
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;"
                @selection-change="crud.selectionChangeHandler">
        <el-table-column :selectable="checkboxT" type="selection" width="55"/>
        <el-table-column prop="no" label="变更合同单号"/>
        <el-table-column prop="status" label="单据状态">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <div>
              <el-tag v-if="scope.row.status === 1" style="cursor: pointer" :type="''">草稿</el-tag>
              <el-tag v-else-if='scope.row.status === 2' style="cursor: pointer" :type=" 'primary' ">待审批</el-tag>
              <el-tag v-else-if='scope.row.status === 3' style="cursor: pointer" :type=" 'success' ">已审批</el-tag>
              <el-tag v-else-if='scope.row.status === 4' style="cursor: pointer" :type=" 'warning' ">反审核</el-tag>
              <el-tag v-else-if='scope.row.status === 5' style="cursor: pointer" :type=" 'danger' ">已驳回</el-tag>
              <el-tag v-else-if='scope.row.status === 6' style="cursor: pointer" :type=" 'primary' ">待付款</el-tag>
              <el-tag v-else-if='scope.row.status === 7' style="cursor: pointer" :type=" 'success' ">已结算</el-tag>
              <el-tag v-else-if='scope.row.status === 8' style="cursor: pointer" :type=" 'danger' ">已作废</el-tag>
              <el-tag v-else style="cursor: pointer" :type=" 'info' ">未知</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="merchantName" label="供应商"/>
        <el-table-column prop="createTime" label="结算期开始日"/>
        <el-table-column prop="endTime" label="结算期截止日"/>
        <el-table-column prop="planPayTime" label="计划付款日"/>
        <el-table-column prop="saleAmount" label="销售额"/>
        <el-table-column prop="merchantDueAmount" label="供应商应得金额"/>
        <el-table-column prop="departmentDueAmount" label="百货应得金额"/>
        <el-table-column prop="operation" label="操作" align="center">
          <template slot-scope="scope">
            <el-link type="primary" :underline="false" @click="detail(scope.row)">详情</el-link>
            <!-- 功能规划到下一版本 -->
            <!--
            <el-link type="primary" :underline="false" @click="saleAdjustment(scope.row)">销售调整</el-link>
            -->
          </template>
        </el-table-column>
      </el-table>

      <!-- 底部栏 -->
      <div style="height: 40px;margin-top: 20px">
        <el-row>
          <el-col :span="12">
            <el-button type="primary" @click="add">变更</el-button>
            <el-button type="success" @click="crud.doExport">导出</el-button>
            <el-button type="primary" @click="approves">批量审批</el-button>
            <el-button type="danger" @click="invalidBill">作废</el-button>
          </el-col>
          <el-col :span="12" style="text-align: right">
            <!--分页组件-->
            <pagination/>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  //引入settlement api
  //import {  add, edit, del, mProcess } from '@/api/cost/settlement'
  import crudSettlement from '@/api/cost/settlement'
  import checkPermission from '@/utils/permission'
  import CRUD, {crud, form, header, presenter} from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'
  //导入详情组件
  //import dDrawer from './detail'
  import addForm from './bill/makeBill'
  import processForm from './bill/approve'

  /**
   * 结算列表 sort依据create_time
   * 将settlement定义的请求方法，交由crud这个对象管理
   */
    // crud交由presenter持有
  const defaultCrud = CRUD({
      title: '结算管理',
      url: 'api/settlement',
      sort: 'create_time,desc',
      crudMethod: {...crudSettlement}
    })
  const defaultForm = {}

  export default {
    components: {addForm, processForm, pagination, crudOperation, rrOperation, udOperation},
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    data() {
      return {
        syncLoading: true,
        disabled: true,
        drawer: false,
        permission: {
          add: ['admin', 'settlement:add'],
          edit: ['admin', 'settlement:edit'],
          del: ['admin', 'settlement:del']
        },
        pInfo: {},
        settleId: 0,
        //状态
        statusOptions: [
          {value: 1, label: "草稿"},
          {value: 2, label: "待审批"},
          {value: 3, label: "已审批"},
          {value: 4, label: "反审核"},
          {value: 5, label: "已驳回"},
          {value: 6, label: "待付款"},
          {value: 7, label: "已结算"}
        ],
        //付款状态
        payStatusOptions: [
          {value: 0, label: "待付款"},
          {value: 1, label: "部分付款"},
          {value: 2, label: "已付款"}
        ],
      }
    },
    created() {
    },
    watch: {},
    amounted: {},
    computed: {
      //获取商品编号
      getMNo: function (name) {
        return this.merchants.filter((item) => {
          let _no = item.no
          let _name = item.name
          if (_name === name) {
            return _no;
          }
        })
      }
    },
    mounted() {

    },
    methods: {
      checkPermission,
      // 获取数据前设置好接口地址
      [CRUD.HOOK.beforeRefresh]() {
        const query = this.query
        if (query.no && query.value) {
          this.crud.params['no'] = query.no
        }
        if (query.payTime && query.value) {
          this.crud.params['payTime'] = query.payTime
        }
        if (query.merchantName && query.value) {
          this.crud.params['merchantName'] = query.merchantName
        }

        if (query.status && query.value) {
          this.crud.params['status'] = query.status
        }

        if (query.payStatus && query.value) {
          this.crud.params['payStatus'] = query.payStatus
        }

        return true
      }, // 新增与编辑前做的操作
      [CRUD.HOOK.afterToCU](crud, form) {
      },
      add() {
        //this.isAdd = true
        this.$refs.makeBillForm.dialog = true
      },
      saleAdjustment() {
        console.log("销售调整")
      },
      approves() {
        console.log("批量审批")
        //需要判断ids集合。如果为空，就不允许发起审批
        this.pInfo.status = 3
        this.pInfo.title = '批量审批'
        this.pInfo.placeholder = '审批留言'
        console.log(this.pInfo)
        this.$refs.formP.dialog = true
      },
      exportExcell() {
        console.log("导出excell")
      },
      antiApproves() {
        console.log("批量反审批")
        //需要判断ids集合。如果为空，就不允许发起审批
        this.pInfo.status = 4
        this.pInfo.title = '批量反审批'
        this.pInfo.placeholder = '反审批留言'
        console.log(this.pInfo)
        this.$refs.formP.dialog = true
      },
      invalidBill() {
        console.log("批量作废单号")
        //需要判断ids集合。如果为空，就不允许发起审批
        this.pInfo.status = 7
        this.pInfo.title = '结算单作废'
        this.pInfo.placeholder = '作废留言'
        console.log(this.pInfo)
        this.$refs.formP.dialog = true
      },
      detail(data) {
        let id = data.id;
        console.log("详情查询id：", id)
        this.settleId = id
        //this.$refs.dialogD.loading = true
        this.$refs.dialogD.loading = true
        this.$refs.dialogD.dialogVisible = true
        console.log(this.settleId)
      },
      selectionChangeHandler(val) {
        let _length = val.length
        if (_length == 0) { //没有选择任何记录
          this.pInfo.nos = [];
        } else {
          this.pInfo.nos = [];
          val.filter((item => {
            this.pInfo.nos.push(item.no)
          }))
        }
        console.log("选中的nos==>", this.pInfo.nos)
      },
      checkboxT(row, rowIndex) {
        return row.no
      }
    }
  }


</script>

<style scoped>

</style>
