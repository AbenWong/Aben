<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery"/>
        <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
          <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
        </el-select>
        <el-date-picker
          v-model="query.receivableTime"
          :default-time="['00:00:00','23:59:59']"
          type="daterange"
          range-separator=":"
          size="small"
          class="date-item"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="receivableTimeStart"
          end-placeholder="receivableTimeEnd"/>
        <el-date-picker
          v-model="query.billingStartsTime"
          :default-time="['00:00:00','23:59:59']"
          type="daterange"
          range-separator=":"
          size="small"
          class="date-item"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="billingStartsTimeStart"
          end-placeholder="billingStartsTimeEnd"/>
        <el-date-picker
          v-model="query.billingEndTime"
          :default-time="['00:00:00','23:59:59']"
          type="daterange"
          range-separator=":"
          size="small"
          class="date-item"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="billingEndTimeStart"
          end-placeholder="billingEndTimeEnd"/>
        <rrOperation :crud="crud"/>
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission"/>
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="供应商编码">
            未设置字典，请手动设置 Select
          </el-form-item>
          <el-form-item label="收费项目">
            <el-input v-model="form.temporaryFeeProjectName" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="收费类别">
            <el-input v-model="form.temporaryFeeTypeName" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="应收时间">
            <el-date-picker v-model="form.receivableTime" type="datetime" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="应收金额">
            <el-input v-model="form.receivableAmount" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="减免金额">
            <el-input v-model="form.reductionAmount" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="应缴金额">
            <el-input v-model="form.actualAmount" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="计费开始日期">
            <el-date-picker v-model="form.billingStartsTime" type="datetime" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="计费结束日期">
            <el-date-picker v-model="form.billingEndTime" type="datetime" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="收款方式">
            <el-select v-model="form.collectionType" filterable placeholder="请选择">
              <el-option v-for="item in dict.collection_type" :key="item.id" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="收款方式">
            <el-input v-model="form.collectionTypeName" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="抵进项发票">
            <el-select v-model="form.inputInvoice" filterable placeholder="请选择">
              <el-option v-for="item in dict.input_invoice" :key="item.id" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="税率">
            <el-select v-model="form.discountRate" filterable placeholder="请选择">
              <el-option v-for="item in dict.income_tax_rate" :key="item.id" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.remark" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="付款状态">
            <el-select v-model="form.collectionStatus" filterable placeholder="请选择">
              <el-option v-for="item in dict.collection_status" :key="item.id" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55"/>
        <el-table-column v-if="columns.visible('temporaryFeeNo')" prop="temporaryFeeNo" label="临时费用单号"/>
        <el-table-column v-if="columns.visible('temporaryFeeProjectName')" prop="temporaryFeeProjectName" label="收费项目"/>
        <el-table-column v-if="columns.visible('temporaryFeeTypeName')" prop="temporaryFeeTypeName" label="收费类别"/>
        <el-table-column v-if="columns.visible('receivableTime')" prop="receivableTime" label="应收时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.receivableTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('receivableAmount')" prop="receivableAmount" label="应收金额"/>
        <el-table-column v-if="columns.visible('reductionAmount')" prop="reductionAmount" label="减免金额"/>
        <el-table-column v-if="columns.visible('actualAmount')" prop="actualAmount" label="应缴金额"/>
        <el-table-column v-if="columns.visible('billingStartsTime')" prop="billingStartsTime" label="计费开始日期">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.billingStartsTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('billingEndTime')" prop="billingEndTime" label="计费结束日期">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.billingEndTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('collectionType')" prop="collectionType" label="收款方式">
          <template slot-scope="scope">
            {{ dict.label.collection_type[scope.row.collectionType] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('inputInvoice')" prop="inputInvoice" label="抵进项发票">
          <template slot-scope="scope">
            {{ dict.label.input_invoice[scope.row.inputInvoice] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('discountRate')" prop="discountRate" label="税率">
          <template slot-scope="scope">
            {{ dict.label.income_tax_rate[scope.row.discountRate] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('remark')" prop="remark" label="备注"/>
        <el-table-column v-if="columns.visible('collectionStatus')" prop="collectionStatus" label="付款状态">
          <template slot-scope="scope">
            {{ dict.label.collection_status[scope.row.collectionStatus] }}
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','temporaryFee:edit','temporaryFee:del']" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation :data="scope.row" :permission="permission"/>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination/>
    </div>
  </div>
</template>

<script>
  import crudTemporaryFee from "@/api/temporaryFee/temporaryFee.js";
  import CRUD, {crud, form, header, presenter} from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'
  import MaterialList from "@/components/material";

  // crud交由presenter持有
  const defaultCrud = CRUD({
    title: '临时收费',
    url: 'api/temporaryFee',
    sort: 'temporaryFeeId,desc',
    crudMethod: {...crudTemporaryFee}
  })
  const defaultForm = {
    temporaryFeeId:null,
    temporaryFeeListId:null,
    temporaryFeeNo:null,
    merchantId:null,
    merchantName:null,
    merchantNo:null,
    temporaryFeeTypeId:null,
    temporaryFeeProjectId:null,
    temporaryFeeProjectName:null,
    temporaryFeeTypeName:null,
    receivableTime:null,
    receivableAmount:null,
    reductionAmount:null,
    actualAmount:null,
    billingStartsTime:null,
    billingEndTime:null,
    collectionType:null,
    collectionTypeName:null,
    inputInvoice:null,
    discountRate:null,
    remark:null,
    createTime:null,
    updateTime:null,
    collectionStatus:null,
    status:null,
    isDel:null
  }
  export default {
    name: 'TemporaryFee',
    components: {pagination, crudOperation, rrOperation, udOperation , MaterialList, crudTemporaryFee},
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    dicts: ['collection_type', 'input_invoice', 'income_tax_rate', 'collection_status'],
    data() {
      return {

        permission: {
          add: ['admin', 'temporaryFee:add'],
          edit: ['admin', 'temporaryFee:edit'],
          del: ['admin', 'temporaryFee:del']
        },
        rules: {
          temporaryFeeId:
            [
              {required: true, message: '临时费用ID不能为空', trigger: 'blur'}
            ]    },
        queryTypeOptions: [
        ]
      }
    },
    watch: {
    },
    methods: {
      // 获取数据前设置好接口地址
      [CRUD.HOOK.beforeRefresh]() {
        const query = this.query
        if (query.type && query.value) {
          this.crud.params[query.type] = query.value
        } else {
        }
        return true
      }, // 新增与编辑前做的操作
      [CRUD.HOOK.afterToCU](crud, form) {
      },
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
