<template>
  <div class="app-container">
    <div class="head-container">
      <el-col :span="1">&#160;</el-col>
      <el-row  style="line-height: 40px">
        <el-col :span="14" style="line-height: 40px; font-size: 18px; font-weight: bold; padding-left: 20px">
          招商编号: {{ attractMerchantNo }}
        </el-col>
        <el-col :span="8" style="line-height: 40px;text-align: right;font-size: 18px;">
          单据状态: <span style="color: red">
            <span v-if="approvalStatus ==0">草稿</span>
            <span v-if="approvalStatus ==1">待审批</span>
            <span v-if="approvalStatus ==2">审批通过</span>
            <span v-if="approvalStatus ==3">审批驳回</span>
          </span>
        </el-col>
        <el-col :span="1">&#160;</el-col>
      </el-row>
      <attarct-merchant-print v-model="form"></attarct-merchant-print>
    </div>

    <div slot="footer" class="dialog-footer detail-bottom">
      <el-button type="primary" @click="back" class="back">返回</el-button>
    </div>
  </div>
</template>
<script>
import crudAttractMerchant from '@/api/merchant/attractMerchant'
import AttarctMerchantPrint from '@/components/AttarctMerchantPrint/index'

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
    name: 'GoodsBatchInfo',
    components: { AttarctMerchantPrint,crudAttractMerchant },
    data() {
      return {
        form: defaultForm,
        attractMerchantNo: '',
        approvalStatus:null
      }
    },
    watch: {},
    mounted() {
      var attractMerchantId = this.$route.query.attractMerchantId;
      this.getAttractMerchantInfo(attractMerchantId);
    },
    methods: {
      getAttractMerchantInfo(attractMerchantId) {
        crudAttractMerchant.getAttractMerchantsInfo(attractMerchantId).then(res => {
          if(res.brandAwarenessType!=null && res.brandAwarenessType[0]!=null){res.brandAwarenessType= res.brandAwarenessType.split(',')}else {res.brandAwarenessType=[]}
          if(res.supplierType!=null && res.supplierType[0]!=null){res.supplierType= res.supplierType.split(',')}else {res.supplierType=[]}
          if(res.cooperationType!=null && res.cooperationType[0]!=null){res.cooperationType= res.cooperationType.split(',')}else {res.cooperationType=[]}
          if(res.zhglType!=null && res.zhglType[0]!=null){res.zhglType= res.zhglType.split(',')}else {res.zhglType=[]}
          if(res.advertisingPayType!=null && res.advertisingPayType[0]!=null){res.advertisingPayType= res.advertisingPayType.split(',')}else {res.advertisingPayType=[]}
          if(res.jszjType!=null && res.jszjType[0]!= null){res.jszjType= res.jszjType.split(',')}else{res.jszjType=[]}
          this.form = res
          this.attractMerchantNo=res.attractMerchantNo
          this.approvalStatus=res.approvalStatus
        })
      },
      // 返回上一页
      back() {
        this.$back();
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
    width: 2rem;
    height: 2rem;
    line-height: 2rem;
  }

  .detail-head {
    font-weight: bold;
    color: #9c9899;
    text-align: center;
    line-height: .75rem;
    border-bottom: 1px solid #efefef;
    height: 1.5625rem;
  }

  .detail {
    height: 2.8125rem;
    text-align: center;
    border-bottom: 1px solid #efefef;
    display: flex;
    align-items: center;
  }

  .detail-item {
    margin-top: .625rem;
  }

  .detail-bottom {
    margin-top: .9375rem;
    margin-left: .9375rem;
  }

</style>
