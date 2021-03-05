<template>
  <div id="wrap">
    <!-- 详情 -->
    <div class="d-header">
      <!-- 详情主体 -->
      <el-row  style="line-height: 40px">

          <el-col  :xs="12" :sm="14" :md="18" style="line-height: 40px; font-size: 18px; font-weight: bold; padding-left: 20px;color:blue">
            {{ detailForm.settlement.no }}
          </el-col>

        <el-col :xs="12" :sm="10" :md="5" style="line-height: 40px;font-size:14px;">
          <span>单据审批状态:</span>
          <span style="color: red">{{ getApprovalStatusDesc(detailForm.settlement.approvalStatus) }}</span>
        </el-col>
      </el-row>
    </div>
    <div class="content-wrap">
      <el-row   class="nav">
        <h2>基础信息</h2>
      </el-row>
       <div class="line-black"></div>
      <div class="base-wrap">
        <el-row   class="content-pane">
          <el-col :xs="24" :sm="24" :md="8">
            <div class="grid-content ">
              <span class="head">创建时间:&#160;</span><span class="content">{{detailForm.settlement.createTime}}</span>
            </div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8">
              <span class="head">制单员:&#160;</span><span class="content">{{detailForm.settlement.uname}}</span>
          </el-col>
          <el-col :xs="24" :sm="24" :md="8">
            <span class="head">单据状态:&#160;</span><span class="content">{{getStatusDesc(detailForm.settlement.status) }}</span>
          </el-col>
        </el-row>
      </div>

      <el-row  class="nav">
        <h2>结算信息</h2>
      </el-row>
       <div class="line-black"></div>
      <div class="base-wrap">
        <el-row  class="content-pane">
          <el-col :xs="24" :sm="12" :md="8">
              <span class="head">结算开始日期:&#160;</span><span class="content"> {{ detailForm.settlement.createTime }}</span>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
              <span class="head">结算结束日期:&#160;</span><span class="content">{{ detailForm.settlement.endTime }}</span>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
              <span class="head">计划付款日期:&#160;</span><span class="content">{{ detailForm.settlement.planPayTime }}</span>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
              <span class="head">销售数量:&#160;</span><span class="content">{{ detailForm.settlement.goodsNum }}</span>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
              <span class="head">销售金额:&#160;</span><span class="content">{{ detailForm.settlement.saleAmount }}</span>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
              <span class="head">销售实收金额:&#160;</span><span class="content">{{ detailForm.settlement.actualSaleAmount }}</span>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
              <span class="head">储蓄卡抵扣金额:&#160;</span><span class="content">{{ detailForm.settlement.cardPayAmount }}</span>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
              <span class="head">机构应收金额:&#160;</span><span class="content">{{ detailForm.settlement.departmentDueAmount }}</span>
          </el-col>
          <el-col :xs="24" :sm="12" :md="8">
              <span class="head">供应商应收金额:&#160;</span><span class="content">{{ detailForm.settlement.merchantDueAmount }}</span>
          </el-col>
          <!--<el-col :xs="24" :sm="12" :md="8">
              &lt;!&ndash;<span class="head">剩余未完成年度保底金额:&#160;</span><span class="content">{{ detailForm.settlement.merchantDueAmount }}</span>&ndash;&gt;
              <span class="head">剩余未完成年度保底金额:&#160;</span><span class="content">0</span>
          </el-col>-->
        </el-row>
      </div>

      <el-row  class="nav">
        <h2>供应商信息</h2>
      </el-row>
    <div class="line-black"></div>
      <div id="sj-content" class="base-wrap" style="text-align: center">
        <el-row class="content-pane">
          <el-col :xs="24" :sm="12" :md="6">
             <div class="left">
              <span class="head" >供应商:&#160;</span><span class="content"> {{ detailForm.merchant.merchantName }}</span>
             </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
            <div class="space">
              <span class="head">供应商编码:&#160;</span><span class="content">{{ detailForm.merchant.merchantCode }}</span>
            </div>
          </el-col>
        </el-row>
      </div>

      <el-row  class="nav">
        <h2>合同信息</h2>
      </el-row>
      <div class="line-black"></div>
      <div id="ht-content" class="base-wrap" style="text-align: center">
        <el-row  class="content-pane">
          <el-col :xs="24" :sm="12" :md="6">
            <div class="left">
              <span class="head">合同编码:&#160;{{ detailForm.contract.contractNo }}</span>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="6">
             <div class="space">
              <span class="head">合同状态:</span>
              <span class="content" v-if="detailForm.contract.contractStatus==1">生效合同</span>
              <span class="content" v-if="detailForm.contract.contractStatus==2">过期合同</span>
           </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="10">
            <div class="space">
              <span class="head">合同描述:&#160;</span><span class="content">{{ detailForm.contract.description }}</span>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="7">
           <div class="left">
              <span class="head">扣率:&#160;</span><span class="content">{{ detailForm.contract.settleRate }}%</span>
           </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="5">
            <div class="space-other">
              <span class="head"> 合同开始日期:&#160;</span><span class="content">{{ detailForm.contract.contractStarttime }}</span>
            </div>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12">
            <div class="space-other2">
              <span class="head">合同结束日期:&#160;</span><span class="content">{{ detailForm.contract.contractEndtime }}</span>
            </div>
          </el-col>
        </el-row>

      </div>

      <el-row  class="nav">
        <h2>跟进记录</h2>
      </el-row>
      <div class="line-black"></div>
      <div class="record">
        <!-- 跟进记录 -->
        <el-table :data="approveTableData" size="mini" border :header-cell-style="{background:'#ededed',color:'black'}">
          <el-table-column align="center" type="index" label="序号"></el-table-column>
          <el-table-column align="center" property="uname" label="跟进人"></el-table-column>
          <el-table-column align="center" property="createTime" label="跟进时间"></el-table-column>
          <el-table-column align="center" property="remark" label="跟进内容"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>

  var detailForm = {
    settlement: {
      id: null,
      no: '',
      contractInfo: '',
      contractNo: '',
      merchantNo: '',
      status: '',
      uid: '',
      username: '',
      saleCount: null,
      cardPayRate: null,
      cardPayAmount: null,
      saleAmount: null,
      actualSaleAmount: null,
      merchantDueAmount: null,
      departmentDueAmount: null,
      createTime: null,
      planPayTime: null,
      payTime: null,
      settleTime: null,
      endTime: null,
      goodsNum: null
    },
    merchant: {
      merchantCode: null,
      merchantName: null,
    },
    contract: {},
    approves: [
      {
        id: 0,
        approveNo: '',
        status: 0,
        createTime: null,
        handleUid: null,
        handleUser: '',
        remark: ''
      }
    ]
  }
  //引入settlement api
  import {getDetail} from '@/api/cost/settlement'

  export default {
    data() {
      return {
        loading: false,
        approveTableData: [],
        detailForm: detailForm
      }
    },
    computed: {
      getApprovalStatusDesc() {
        return function (status) {
          var statuObj = {0: "草稿", 1: "待审批", 2: "已审批", 3: "已驳回"};
          return statuObj[status];
        }
      },
      getStatusDesc() {
        return function (status) {
          var statuObj = {0: "待处理", 1: "待付款", 2: "已结算", 3: "作废"};
          return statuObj[status];
        }
      }
    },
    mounted() {
      var settleId = this.$route.query.settleId;
      this.getData(settleId);
    },
    methods: {
      getData(id) {
        getDetail(id).then(res => {
          this.detailForm = res
          this.detailForm.approves = res.approves
          this.approveTableData = res.approves
        }).catch(ex => {
          console.log(ex)
        })
      },
    }
  }


</script>

<style lang="scss" scoped>

  //隐藏滚动条，在谷歌浏览器上是ok的
  /* 兼容火狐 */
  * {
    scrollbar-width: none ;
  }

  .content-wrap {
    margin-left: 10px
  }

  .d-header {
    background-color: #F5F5F5;
  }
.head{
  justify-content:center;
  align-items:center;
}
  /** 设置el-row */
  /** 解决边框合并问题 */
 /*  .content-pane {
    .el-col {
      height: 35px;
      line-height: normal;
      border: solid #1f2d3d 1px;
      text-align: center;

      margin-right: -1px;
      margin-bottom: -1px;
    }
  } */
  .base-wrap {
    /*     font-size: 14px;
        font-weight:6; */

    line-height: 33px;
    margin: 10px 5px 0px 15px;
  }
  .line-black{
      width: 100%;
      height: 1px;
      border-top: solid #BBBBBB 3px;
    }
  h2 {
    margin-top: 15px;
  }

  .el-button {
    font-size: 14px;
  }

  .head {
    font-weight: bold;
    font-size: 17px;
    color: #606266;
  }

  .content {
    font-size: 15px;
    color: black;
  }
  .space{
    margin-left:1rem;
  }
  .left{
    float: left;
  }
   .space-other{
    margin-left:2.6rem;
  }
  .space-other2{
    margin-right:2.5rem;
  }
      @media only screen and (min-width: 768px) and (max-width: 1024px) {
    .space{
      margin-left:0px;
      float: left;
      }
    .space-other{
      margin:0px;
      float: left;
      }
     .space-other2{
      margin:0px;
      float: left;
      }


  }

  @media only screen and (min-width: 320px) and (max-width: 767px) {
      .space{
        margin:0px;
      }
      .space-other{
      margin:0px;
      float: left;
      }
      .space-other2{
      margin:0px;
      float: left;
      }
  }
</style>

</style>
