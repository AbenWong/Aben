<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.no" clearable placeholder="请输入销售调整单号" style="width: 200px;" class="filter-item"/>
        <el-input v-model="query.settlementNo" clearable placeholder="请输入结算单号" style="width: 200px;"
                  class="filter-item"/>
        <el-input v-model="query.merchantName" clearable placeholder="请输入供应商名称" style="width: 200px;"
                  class="filter-item"/>
        <el-input v-model="query.merchantNo" clearable placeholder="请输入供应商编号" style="width: 200px;"
                  class="filter-item"/>
        <el-input v-model="query.contractNo" clearable placeholder="请输入合同编号" style="width: 200px;" class="filter-item"/>
        <el-input v-model="query.createBy" clearable placeholder="请输入制单人" style="width: 200px;" class="filter-item"/>
        <rrOperation :crud="crud"/>
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission"/>

      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;"
                @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55"/>
        <el-table-column v-if="columns.visible('no')" prop="no" label="销售调整单号"/>
        <el-table-column v-if="columns.visible('settlementNo')" prop="settlementNo" label="结算单号"/>
        <el-table-column v-if="columns.visible('merchantNo')" prop="merchantNo" label="供应商编号"/>
        <el-table-column v-if="columns.visible('contractNo')" prop="contractNo" label="合同编号"/>
        <el-table-column v-if="columns.visible('oldDeductionRate')" prop="oldDeductionRate" label="原扣率"/>
        <el-table-column v-if="columns.visible('oldSaleAmount')" prop="oldSaleAmount" label="原销售额"/>
        <el-table-column v-if="columns.visible('oldSaleNums')" prop="oldSaleNums" label="原销售数量"/>
        <el-table-column v-if="columns.visible('newDeductionAmount')" prop="newDeductionAmount" label="新销售扣额"/>
        <el-table-column v-if="columns.visible('createBy')" prop="createBy" label="制单人"/>
        <el-table-column v-if="columns.visible('createTime')" prop="createTime" label="制单时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('updateBy')" prop="updateBy" label="更新人"/>
        <el-table-column v-if="columns.visible('updateTime')" prop="updateTime" label="更新时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('approvalStatus')" prop="approvalStatus" label="审批状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.approvalStatus === 0" style="cursor: pointer" :type="''">草稿</el-tag>
            <el-tag v-if='scope.row.approvalStatus === 1' style="cursor: pointer" :type=" 'primary' ">待审批</el-tag>
            <el-tag v-if='scope.row.approvalStatus === 2' style="cursor: pointer" :type=" 'success' ">已审批</el-tag>
            <el-tag v-if='scope.row.approvalStatus === 3' style="cursor: pointer" :type=" 'danger' ">已驳回</el-tag>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('approvalUrl')" prop="approvalUrl" label="审批详情">
          <template slot-scope="scope">
            <div v-if="scope.row.approvalUrl" @click="showQrCode(scope.row.approvalUrl)">
              <qriously :value="scope.row.approvalUrl" :size="60"/>
            </div>
            <span v-else>暂无</span>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','saleAdjust:edit','saleAdjust:del']" label="操作" width="150px"
                         align="center">
          <template slot-scope="scope">
            <udOperation :data="scope.row" :permission="permission"/>
          </template>
        </el-table-column>
      </el-table>

      <!--分页组件-->
      <div style="height: 40px;margin-top: 20px">
        <el-row>
          <el-col :span="12">
            <el-button type="primary" @click="toAdd">制单</el-button>
            <el-button type="success" @click="">导出</el-button>
          </el-col>
          <el-col :span="12" style="text-align: right">
            <!--分页组件-->
            <pagination/>
          </el-col>
        </el-row>
      </div>
    </div>

    <!--显示二维码-->
    <el-dialog title="请使用钉钉扫描二维码" :visible.sync="qrcodeobj.show" width="20%">
      <div style="text-align: center;">
        <qriously :value="qrcodeobj.value" :size="200"/>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="qrcodeobj.show = false">取 消</el-button>
        <el-button type="primary" @click="qrcodeobj.show = false">确 定</el-button>
      </span>
    </el-dialog>

    <!--制单-->
    <add-saleadjust ref="add" />
  </div>
</template>

<script>
  import CRUD, {crud, form, header, presenter} from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'
  import MaterialList from "@/components/material"
  import crudSaleAdjust from '@/api/saleAdjust'
  import MySelect from '@/components/MySelect'
  import addSaleadjust from './add'

  // crud交由presenter持有
  const defaultCrud = CRUD({
    title: '销售调整单',
    url: 'api/saleAdjust',
    sort: 'saleAdjustId,desc',
    crudMethod: {...crudSaleAdjust},
    optShow: {
      add: false,
      edit: false,
      del: false,
      download: false
    },
  })

  export default {
    name: 'SaleAdjust',
    components: {addSaleadjust, MySelect, pagination, crudOperation, rrOperation, udOperation, MaterialList},
    mixins: [presenter(defaultCrud), header(), crud()],
    data() {
      return {
        permission: {
          add: ['admin', 'saleAdjust:add'],
          edit: ['admin', 'saleAdjust:edit'],
          del: ['admin', 'saleAdjust:del']
        },
        qrcodeobj: {show: false, value: ''},
      }
    },
    methods: {
      // 获取数据前设置好接口地址
      [CRUD.HOOK.beforeRefresh]() {
        const query = this.query
        if (query.type && query.value) {
          this.crud.params[query.type] = query.value
        } else {
          delete this.crud.params.no
          delete this.crud.params.settlementNo
          delete this.crud.params.merchantName
          delete this.crud.params.merchantNo
          delete this.crud.params.contractNo
          delete this.crud.params.createBy
        }
        return true
      }, // 新增与编辑前做的操作
      [CRUD.HOOK.afterToCU](crud, form) {
      },
      // 显示二维码
      showQrCode(url) {
        this.qrcodeobj.show = true
        this.qrcodeobj.value = url
      },
      // 显示制单
      toAdd() {
        this.$refs.add.addShow = true
      }
    }
  }


</script>

<style scoped>
  .table-img {
    display: inline-block;
    text-align: center;
    background: #ccc;
    color: #fff;
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    vertical-align: middle;
    width: 32px;
    height: 32px;
    line-height: 32px;
  }

</style>
