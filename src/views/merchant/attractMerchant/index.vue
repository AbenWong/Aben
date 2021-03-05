<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div  v-if="crud.props.searchToggle">
          <!-- 搜索 -->
          <el-input v-model="query.merchantName" clearable placeholder="输入供应商名搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
          <el-input v-model="query.attractMerchantNo" clearable placeholder="输入招商单号搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
          <el-select v-model="query.merchantType" placeholder="供应商类型">
            <el-option
              v-for="item in dict.merchant_type"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <rrOperation :crud="crud"/>
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission"/>
      <!-- 详情 -->
      <el-drawer
        :visible.sync="drawer"
        :direction="'rtl'"
        :withHeader="false"
        :destroy-on-close="true"
        :size="'50%'">
        <dDrawer :id="dId"/>
      </el-drawer>
      <d-drawer ref="dialogD" :attractMerchantId="attractMerchantId" />
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55"/>
        <el-table-column v-if="columns.visible('attractMerchantNo')" prop="attractMerchantNo" label="招商单号"/>

        <el-table-column v-if="columns.visible('merchantName')" prop="merchantName" label="供应商"/>
        <el-table-column v-if="columns.visible('merchantType')" prop="merchantType" label="供应商类型">
          <template slot-scope="scope">
            {{ dict.label.merchant_type[scope.row.merchantType] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('createTime')" prop="createTime" label="制单时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('createBy')" prop="createBy" label="制单人"/>
        <el-table-column v-if="columns.visible('updateTime')" prop="updateTime" label="更新时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('updateBy')" prop="updateBy" label="更新人"/>
        <el-table-column v-if="columns.visible('approvalStatus')" prop="approvalStatus" label="审批状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.approvalStatus ==0" style="cursor: pointer" :type="''">草稿</el-tag>
            <el-tag v-if="scope.row.approvalStatus ==1" style="cursor: pointer" :type=" 'primary' ">待审批</el-tag>
            <el-tag v-if="scope.row.approvalStatus ==2" style="cursor: pointer" :type=" 'success' ">审批通过</el-tag>
            <el-tag v-if="scope.row.approvalStatus ==3" style="cursor: pointer" :type=" 'danger' ">审批驳回</el-tag>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('approvalUrl')" prop="approvalUrl" label="审批二维码">
          <template slot-scope="scope">
            <div v-if="scope.row.approvalUrl" @click="showQrCode(scope.row.approvalUrl)">
              <qriously :value="scope.row.approvalUrl" :size="60"/>
            </div>
            <span v-else>暂无</span>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','attractMerchant:edit','attractMerchant:del']" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <el-link type="primary" :underline="false" v-if="scope.row.approvalStatus==0"  @click="addAndEditAttractMerchant(scope.row.attractMerchantId)">编辑</el-link>
            <el-link type="primary" :underline="false" v-if="scope.row.approvalStatus!=0"  @click="detail(scope.row.attractMerchantId)">详情</el-link>
            <el-link type="primary" :underline="false" v-if="scope.row.approvalStatus==0" v-permission="permission.edit" @click="approval(scope.row.attractMerchantId)">发起审批
            </el-link>
            <br />
          </template>
        </el-table-column>
      </el-table>
      <div style="height: 40px;margin-top: 20px">
        <el-row>
          <el-col :span="12">
            <el-button type="primary" @click="addAndEditAttractMerchant()">制单</el-button>
            <el-button type="primary" @click="approvalList">批量审批</el-button>
            <el-button type="success" @click="crud.doExport">导出</el-button>
            <!--<el-button type="danger" @click="addAndEditAttractMerchant">作废</el-button>-->
          </el-col>
          <el-col :span="12" style="text-align: right">
            <!--分页组件-->
            <pagination />
          </el-col>
        </el-row>
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
    </div>
  </div>
</template>

<script>
  import crudAttractMerchant from '@/api/merchant/attractMerchant'
  import CRUD, {crud, form, header, presenter} from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'
  import MaterialList from "@/components/material";
  import dDrawer from './detail'
  // crud交由presenter持有
  const defaultCrud = CRUD({
    title: '招商管理',
    url: 'api/attractMerchant',
    sort: 'attract_merchant_id,desc',
    crudMethod: {...crudAttractMerchant},
    optShow: {
      add: false,
      edit: false,
      del: false,
      download: false
    }
  })
  const defaultForm = {
    attractMerchantId:null,
    merchantId:null,
    attractMerchantNo:null,
    merchantName:null,
    merchantType:null,
    updateTime:null,
    updateBy:null,
    status:null,
    floor:null,
    number:null,
    buildingArea:null,
    brandNameCn:null,
    brandNameEn:null,
    openingTime:null,
    contractPeriodYear:null,
    contractPeriodMonth:null,
    contractPeriodStarttime:null,
    contractPeriodEndtime:null,
    jszj1ZjTnM2:null,
    jszj1ZjTnYue:null,
    jszj1ZjJzM2:null,
    jszj1GlfTnM2:null,
    jszj1GlfTnYue:null,
    jszj1GlfJzM2:null,
    jszj1XseP:null,
    jszj2ZjTnM2:null,
    jszj2ZjTnYue:null,
    jszj2ZjJzM2:null,
    jszj2XseP:null,
    jszj3ZjTnM2:null,
    jszj3ZjTnYue:null,
    jszj3ZjJzM2:null,
    jszj4TcXseP:null,
    facilityManagementFee:null,
    contractDeposit:null,
    wyglfTnYue:null,
    equipmentRentalFee:null,
    distributionQuantity:null,
    promoterM:null,
    promoterUniformFeeR:null,
    promoterUniformFeeT:null,
    promoterUniformFeeY:null,
    guaranteedSalesTaskWy:null,
    facilityManagementCooperationSupportY:null,
    advertisingSpaceH:null,
    advertisingArea:null,
    advertisingRentFee:null,
    advertisingMaintenanceFeeMonth:null,
    advertisingMaintenanceFeeOne:null,
    advertisingRentStarttime:null,
    advertisingRentEndtime:null,
    siteFeeYdn:null,
    siteFeeY:null,
    equipmentMangeFee:null,
    equipmentDepreciationFee:null,
    promotionOneP:null,
    promotionXcFeeP:null,
    promotionXcFeeY:null,
    promotionJqFeeY:null,
    ageGroup:null,
    priceRange:null,
    businessName:null,
    businessTel:null,
    businessAddress:null,
    approvalId: null,
    approvalStatus: null,
    approvalUrl:null,
    createTime:null,
    createBy:null,
    isDel:null,
    businessScope:null,
    warehouseusefee:null,
    equipmentName:null,
    cooperationOther:null,
    decorationTime:null,
    remark:null,
    businessOperatorId:null,
    departmentHeadId:null,
    departmentGeneralManagerId:null,
    generalManagerId:null,
    businessOperatorName:null,
    departmentHeadName:null,
    departmentGeneralManagerName:null,
    generalManagerName:null,
    zhglType:[],
    cooperationType:[],
    brandAwarenessType:[],
    supplierType:[],
    advertisingPayType:[],
    jszjType:[]
  }
  export default {
    name: 'AttractMerchant',
    components: {pagination, crudOperation, rrOperation, udOperation , MaterialList,dDrawer},
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    dicts: ['merchant_type', 'brand_awareness_type', 'supplier_type', 'payment_type', 'cooperation_type', 'business_certificate_type','approval_status','jszj_type', 'zhgl_type', 'advertising_pay_type'],
    data() {
      return {
        syncLoading: true,
        disabled: true,
        drawer: false,
        dId: null,
        direction: 'rtl',
        qrcodeobj: {show: false, value: ''},
        permission: {
          add: ['admin', 'attractMerchant:add'],
          edit: ['admin', 'attractMerchant:edit'],
          del: ['admin', 'attractMerchant:del']
        },
        rules: {
      attractMerchantId:[{required: false, message: '招商id不能为空', trigger: 'blur'}]    },
      queryTypeOptions: [
        {
          key: 'attractMerchantNo',
          display_name: '招商单号'
        },
        {
          key: 'merchantName',
          display_name: '供应商名'
        },
        {
          key: 'merchantType',
          display_name: '供应商类型'
        }
      ],
        attractMerchantId:0
    }
    },
    watch: {},
    methods: {
      // 获取数据前设置好接口地址
      [CRUD.HOOK.beforeRefresh]() {
        const query = this.query
        if (query.attractMerchantNo && query.value) {
          this.crud.params['attractMerchantNo'] = query.attractMerchantNo
        }
        if (query.merchantName && query.value) {
          this.crud.params['merchantName'] = query.merchantName
        }
        if (query.merchantType && query.value) {
          this.crud.params['merchantType'] = query.merchantType
        }
        return true
      }, // 新增与编辑前做的操作
      [CRUD.HOOK.afterToCU](crud, form) {
      },
      addAndEditAttractMerchant(id) {
        this.$router.push({name:"AttractMerchantAdd",params:{id:id}})
      },
      detail(attractMerchantId){
        console.log("详情查询id：", attractMerchantId)
        this.attractMerchantId = attractMerchantId
        this.$refs.dialogD.loading = true
        this.$refs.dialogD.dialogVisible = true
      },
      // 发起审批
      approval(attractMerchantId) {
        this.$confirm('确认提交审批吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          crudAttractMerchant.approval(attractMerchantId).then(res => {
            this.$message.success("发起审批成功")
            var that = this
            setTimeout(function () {
              that.crud.refresh();
            },500);
          })
        })
      },
      // 批量审批
      approvalList() {
        var val = this.crud.selections;
        if (val.length < 1) {
          this.$message.error("请选择需要审批的数据")
          return false;
        }
        // 这里的做法是除去已经发起审核过的数据
        var arr = [], tipstr = '', hasapproval = false;
        for (var i in val) {
          if (val[i].approvalStatus != 0) {
            this.$refs.table.toggleRowSelection(val[i], false);
            tipstr += ' ' + val[i].attractMerchantNo
            hasapproval = true
          } else {
            arr.push(val[i]);
          }
        }
        // 判断是否含已经发起审批的数据
        if (hasapproval) {
          tipstr = tipstr + '单已发起审批,无法被选中！确认提交批量审批吗?'
        } else {
          tipstr = '确认提交批量审批吗?'
        }
        this.crud.selections = arr;
        var data = [];
        for (var i in arr) {
          data.push(arr[i].attractMerchantId);
        }
        this.$confirm(tipstr, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          crudAttractMerchant.batchApproval(data).then(res => {
            this.$message.success("发起批量审批成功")
            var that = this
            setTimeout(function () {
              that.crud.refresh();
            },500);
          })
        })
      },
      // 显示二维码
      showQrCode(url) {
        this.qrcodeobj.show = true
        this.qrcodeobj.value = url
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
/deep/.head-container .filter-item input {
  height: 36px;
  line-height: 36px;
}

  /deep/.head-container .filter-item {
    display: inline-block;
    vertical-align: middle;
    margin: 0 2px 0px 0;
  }
</style>
