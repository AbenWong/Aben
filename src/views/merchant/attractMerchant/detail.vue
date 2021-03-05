<template>
  <!-- 详情 -->
  <el-drawer
    title="我是标题"
    :direction="'rtl'"
    :visible.sync="dialogVisible"
    :withHeader="false"
    :destroy-on-close="true"
    @opened="openDialog"
    v-loading="loading"
    :size="'50%'">
    <div id="wrap">
      <!-- 详情 -->
      <div id="d-header-id" class="d-header">
        <!-- 详情主体 -->
        <el-row  style="line-height: 40px">
          <el-col :span="15" style="line-height: 40px; font-size: 18px; font-weight: bold; padding-left: 20px">
            招商编号: {{ attractMerchantNo }}
          </el-col>
          <el-col :span="4" style="line-height: 40px">
            单据状态: <span style="color: red">
            <span v-if="approvalStatus ==0">草稿</span>
            <span v-if="approvalStatus ==1">待审批</span>
            <span v-if="approvalStatus ==2">审批通过</span>
            <span v-if="approvalStatus ==3">审批驳回</span>
          </span>
          </el-col>
          <el-col :span="3" style="line-height: 40px">
            <el-button @click="clickPrint">打印</el-button>
          </el-col>
          <el-col :span="1" style="line-height: 40px; align-items: center">
            <el-link :underline="false" @click="closeDialog">X</el-link>
          </el-col>
        </el-row>
      </div>
      <div id="d-content-id" class="content-wrap">
        <vue-easy-print tableShow ref="easyPrint">
          <attarct-merchant-print v-model="form"></attarct-merchant-print>
        </vue-easy-print>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import vueEasyPrint from "vue-easy-print";
import crudAttractMerchant from '@/api/merchant/attractMerchant'
import AttarctMerchantPrint from '../../../components/AttarctMerchantPrint/index'
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
    components: { AttarctMerchantPrint, vueEasyPrint,crudAttractMerchant },
  dicts: ['merchant_type', 'brand_awareness_type', 'supplier_type', 'payment_type', 'cooperation_type', 'business_certificate_type','approval_status','jszj_type', 'zhgl_type', 'advertising_pay_type'],
  props: {
      attractMerchantId: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        form: defaultForm,
        attractMerchantNo: '',
        approvalStatus:null,
        syncLoading: true,
        disabled: true,
        dialogVisible: false,
        loading: false,
        approveLoading: false,
      }
    },
    created() {
    },
    watch:{

    },
    computed: {
    },
    methods: {
      openDialog() {
          crudAttractMerchant.getAttractMerchantsInfo(this.attractMerchantId).then(res => {
            if(res.brandAwarenessType!=null && res.brandAwarenessType[0]!=null){res.brandAwarenessType= res.brandAwarenessType.split(',')}else {res.brandAwarenessType=[]}
            if(res.supplierType!=null && res.supplierType[0]!=null){res.supplierType= res.supplierType.split(',')}else {res.supplierType=[]}
            if(res.cooperationType!=null && res.cooperationType[0]!=null){res.cooperationType= res.cooperationType.split(',')}else {res.cooperationType=[]}
            if(res.zhglType!=null && res.zhglType[0]!=null){res.zhglType= res.zhglType.split(',')}else {res.zhglType=[]}
            if(res.advertisingPayType!=null && res.advertisingPayType[0]!=null){res.advertisingPayType= res.advertisingPayType.split(',')}else {res.advertisingPayType=[]}
            if(res.jszjType!=null && res.jszjType[0]!= null){res.jszjType= res.jszjType.split(',')}else{res.jszjType=[]}
            this.form = res
            this.attractMerchantNo=res.attractMerchantNo
            this.approvalStatus=res.approvalStatus
            this.loading = false
          }).catch(ex => {
            console.log(ex)
            this.loading = false
            this.dialogVisible = false
          })
          return true
      },
      //关闭dialog
      closeDialog(done) {
        this.dialogVisible = false
        this.form = defaultForm
        this.attractMerchantNo= ''
        this.approvalStatus=null
      },
      /**
       * 打印详情
       */
      clickPrint(){
          this.$refs.easyPrint.print();
      },
    }
  }



</script>

<style lang="scss" >
  /* 注意：不能在scope中 */
  /*1.显示滚动条：当内容超出容器的时候，可以拖动：*/
  //抽屉从右往左开
  .el-drawer{
    overflow: scroll;
  }//使得drawer可以滚动
  .el-drawer__container ::-webkit-scrollbar{
    display: none;
  }//隐藏滚动条，在谷歌浏览器上是ok的
  /* 兼容火狐 */
  *{
    scrollbar-width: none;
  }
  @media print {
    #app {
      display: none;
    }
    .el-dialog,
    .el-dialog__wrapper,
    .el-message,
    .v-modal {
      display: none !important;
    }
  }
  @page{
    size: auto A4 landscape;
    margin: 8.5mm 6mm 6.5mm 6mm;
  }
  .line-black{
    width: 100%;
    height: 1px;
    border-top: solid #BBBBBB 3px;
  }

  .content-wrap{
    margin: 15px 15px 0px 10px;
  }

  .d-header{
    background-color: #F5F5F5;
  }
  /** 设置el-row */
  .d-content>.el-row{
    margin-left: 20px;
    margin-top: 15px
  }

  .el-row{
    line-height: 33px;
  }

  .base-wrap{
    line-height: 33px;
    margin: 10px 5px 0px 15px;
  }

  .invoice-wrap{
    border: solid #BBBBBB 3px;
    padding: 10px 30px 10px 30px;
    margin-top: 10px;
    .el-col{
      height: 28px;
      line-height: 28px;
    }
    .look-up{
      font-weight: bold;
    }
  }

  .record{
    margin: 15px 15px 3px 15px;
  }

  .nav{
    font-weight: bold;
  }
</style>
