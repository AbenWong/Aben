<template>
  <!-- 详情 -->
  <el-drawer title="结算详情" :visible.sync="dialogVisible"
             :withHeader="false" :destroy-on-close="true" @opened="openDialog" v-loading="loading" :size="'50%'">
    <div id="wrap">
      <!-- 详情 -->
      <div id="d-header-id" class="d-header">
        <!-- 详情主体 -->
        <el-row style="line-height: 40px">
          <el-col :xs="12" :sm="6" :md="13"
                  style="line-height: 40px; font-size: 18px; font-weight: bold; padding-left: 20px;color:blue">
            {{ detailForm.settlement.no }}
          </el-col>
          <el-col :xs="24" :sm="10" :md="5" style="line-height: 40px;font-size:14px">
            <span>单据审批状态: </span>
            <span style="color: red">{{ getApprovalStatusDesc(detailForm.settlement.approvalStatus) }}</span>
          </el-col>
          <el-col :xs="18" :sm="5" :md="3" style="line-height: 40px">
            <el-button @click="clickPrint">打印</el-button>
          </el-col>
          <el-col :xs="3" :sm="2" :md="1" :offset="1" style="line-height: 40px; align-items: center; margin-left:15px">
            <el-link :underline="false" @click="closeDialog">X</el-link>
          </el-col>
        </el-row>
      </div>
      <!-- 打印页面 -->

        <div id="d-content-id" class="content-wrap">
          <el-row class="nav">
            <h2>基础信息</h2>
          </el-row>
          <div class="line-black"></div>
          <div class="base-wrap">
            <el-row>
              <el-col :xs="24" :sm="24" :md="8">
                <div class="grid-content ">
                  <span class="head" style="margin-right:5px">创建时间:</span>
                  <span class="content">{{detailForm.settlement.createTime}}</span>
                </div>
              </el-col>
              <el-col :xs="24" :sm="24" :md="8">
                <div class="grid-content ">
                  <span class="head" style="margin-right:5px">制单员:</span>
                  <span class="content"> {{detailForm.settlement.uname}}</span>
                </div>
              </el-col>
              <el-col :xs="24" :sm="24" :md="6">
                <div class="grid-content ">
                  <span class="head" style="margin-right:5px">单据状态:</span>
                  <span class="content"> {{getStatusDesc(detailForm.settlement.status) }}</span>

                </div>
              </el-col>
            </el-row>
          </div>

          <el-row class="nav" style="padding-right: 0px;">
            <h2>结算信息</h2>
          </el-row>
          <div class="line-black"></div>
          <div class="base-wrap">
            <el-row>
              <el-col :xs="24" :sm="24" :md="8">
                <div class="grid-content ">
                  <span class="head">  结算开始日期:</span>
                  <span class="content"> {{ detailForm.settlement.startTime }}</span>

                </div>
              </el-col>
              <el-col :xs="24" :sm="24" :md="8">
                <div class="grid-content ">
                  <span class="head" style="margin-right:5px">结算结束日期:</span>
                  <span class="content">{{ detailForm.settlement.endTime }}</span>

                </div>
              </el-col>
              <el-col :xs="24" :sm="24" :md="8">
                <div class="grid-content ">
                  <span class="head">计划付款日期:</span>
                  <span class="content">{{ detailForm.settlement.planPayTime }}</span>

                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <div class="grid-content ">
                  <span class="head">销售数量:</span>
                  <span class="content"> {{ detailForm.settlement.goodsNum }}</span>

                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <div class="grid-content ">
                  <span class="head">销售金额:</span>
                  <span class="content"> {{ detailForm.settlement.saleAmount }}</span>

                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <div class="grid-content ">
                  <span class="head" style="margin-right:5px">销售实收金额:</span>
                  <span class="content">{{ detailForm.settlement.actualSaleAmount }}</span>

                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <div class="grid-content ">
                  <span class="head" style="margin-right:5px">储蓄卡抵扣金额:</span>
                  <span class="content">{{ detailForm.settlement.cardPayAmount }}</span>

                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <div class="grid-content ">
                  <span class="head" style="margin-right:5px">机构应收金额:</span>
                  <span class="content">{{ detailForm.settlement.departmentDueAmount }}</span>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <div class="grid-content ">
                  <span class="head" style="margin-right:5px">供应商应收金额:</span>
                  <span class="content">{{ detailForm.settlement.merchantDueAmount }}</span>

                </div>
              </el-col>
              <!--<el-col :xs="24" :sm="24" :md="8">
                <div class="grid-content ">
                  <span class="head">剩余未完成年度保底金额:</span>
                  <span class="content"> {{ detailForm.settlement.merchantDueAmount }}</span>

                </div>
              </el-col>-->
            </el-row>


          </div>

          <el-row class="nav" style="padding-right: 0px;">
            <h2>供应商信息</h2>
          </el-row>
          <div class="line-black"></div>
          <div id="sj-content" class="base-wrap" style="text-align: center">
            <el-row class="m-row">
              <el-col :xs="24" :sm="12" :md="7">

                <div class="grid-content " style="float: left;">
                  <span class="head">供应商:</span>
                  <span class="content"> {{ detailForm.merchant.merchantName }}</span>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="10">
                <div class="grid-content space">
                  <span class="head" style="margin-right:5px">供应商编码:</span>
                  <span class="content">{{ detailForm.merchant.merchantCode }}</span>
                </div>
              </el-col>
            </el-row>
          </div>

          <el-row class="nav" style="padding-right: 0px;">
            <h2>合同信息</h2>
          </el-row>
          <div class="line-black"></div>

          <div id="ht-content" class="base-wrap" style="text-align: center">
            <el-row class="ht-row">
              <el-col :xs="24" :sm="12" :md="6">
                <div style="float: left;">
                  <span class="head" style="margin-right:5px">合同编码:</span>
                  <span class="content">{{ detailForm.contract.contractNo }}</span>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <div>
                  <span class="head" style="margin-right:5px">合同状态:</span>
                  <span class="content" v-if="detailForm.contract.contractStatus==1">生效合同</span>
                  <span class="content" v-if="detailForm.contract.contractStatus==2">过期合同</span>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <div class="space-other">
                  <span class="head space-other4 ">合同描述:</span>
                  <span class="content">{{ detailForm.contract.description }}</span>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="6">
                <div style="float: left;">
                  <span class="head space-other4">扣率:</span>
                  <span class="content">{{ detailForm.contract.settleRate }}%</span>

                </div>
              </el-col>
              <el-col :xs="24" :sm="24" :md="9">
                <div class="space-other2">
                  <span class="head space-other4"> 合同开始日期:</span>
                  <span class="content">{{ detailForm.contract.contractStarttime }}</span>
                </div>
              </el-col>
              <el-col :xs="24" :sm="24" :md="9">
                <div class="space-other3">
                  <span class="head space-other4">合同结束日期:</span>
                  <span class="content">{{ detailForm.contract.contractEndtime }}</span>
                </div>
              </el-col>
            </el-row>

          </div>

          <el-row class="nav" style="padding-right: 0px;">
            <h2>跟进记录</h2>
          </el-row>
          <div class="line-black"></div>
          <div class="record" id="record">
            <!-- 跟进记录 -->
            <el-table :data="approveTableData" size="mini" :row-class-name="rowClassName"
                      style="width: 100%; color:black"
                      border :header-cell-style="{background:'#ededed',color:'black'}">
              <el-table-column align="center" type="index" label="序号"/>
              <el-table-column align="center" property="uname" label="跟进人" class="uname-column"/>
              <el-table-column align="center" property="createTime" label="跟进时间"/>
              <el-table-column align="center" property="remark" label="跟进内容"/>
            </el-table>
          </div>

        </div>
        <!-- 打印功能 -->
        <vue-easy-print tableShow ref="easyPrint">
        <div class="print" style="display:none">
          <div class="print-title">
            <span style="font-size:30px">结算单</span>
          </div>
          <div class="grid-content">
              <div style="display:inline-block;margin:5px;width:31%">
                  <span class="head" style="margin-right:5px">创建时间:</span>
                  <span class="content">{{detailForm.settlement.createTime}}</span>
              </div>
              <div style="display:inline-block;margin:5px;width:31%">
                  <span class="head" style="margin-right:5px">制单员:</span>
                  <span class="content"> {{detailForm.settlement.uname}}</span>
              </div>
              <div style="display:inline-block;margin:5px;width:31%">
                  <span class="head" style="margin-right:5px">单据状态:</span>
                                    <span class="content"> {{getStatusDesc(detailForm.settlement.status) }}</span>
              </div>
          </div>
          <div class="grid-content">
            <div style="display:inline-block;margin:5px;width:33%">
                  <span class="head">  结算开始日期:</span>
                                    <span class="content"> {{ detailForm.settlement.startTime }}</span>
            </div>
            <div style="display:inline-block;margin:5px;width:30%">
                  <span class="head">销售数量:</span>
                                    <span class="content"> {{ detailForm.settlement.goodsNum }}</span>
            </div>
            <div style="display:inline-block;margin:5px;width:30%">
                  <span class="head">销售金额:</span>
                                    <span class="content"> {{ detailForm.settlement.saleAmount }}</span>
            </div>
            <div style="display:inline-block;margin:5px;width:33%">
                  <span class="head" style="margin-right:5px">结算结束日期:</span>
                                    <span class="content">{{ detailForm.settlement.endTime }}</span>
            </div>
            <div style="display:inline-block;margin:5px;width:30%">
                  <span class="head" style="margin-right:5px">销售实收金额:</span>
                                    <span class="content">{{ detailForm.settlement.actualSaleAmount }}</span>
            </div>
            <div style="display:inline-block;margin:5px;width:30%">
                  <span class="head" style="margin-right:5px">储蓄卡抵扣金额:</span>
                                    <span class="content">{{ detailForm.settlement.cardPayAmount }}</span>
            </div>
           
            <div style="display:inline-block;margin:5px;width:33%">
                  <span class="head">计划付款日期:</span>
                                    <span class="content">{{ detailForm.settlement.planPayTime }}</span>
            </div>
            <div style="display:inline-block;margin:5px;width:30%">
                  <span class="head" style="margin-right:5px">机构应收金额:</span>
                                    <span class="content">{{ detailForm.settlement.departmentDueAmount }}</span>
            </div>
            <div style="display:inline-block;margin:5px;width:30%">
                  <span class="head" style="margin-right:5px">供应商应收金额:</span>
                                    <span class="content">{{ detailForm.settlement.merchantDueAmount }}</span>
            </div>
<!--             <div style="display:inline-block;margin:5px;width:31%">
                  <span class="head">剩余未完成年度保底金额:</span>
                                    <span class="content"> {{ detailForm.settlement.merchantDueAmount }}</span>
            </div> -->
            <div style="display:inline-block;margin:5px;width:31%">
                  <span class="head">供应商:</span>
                                    <span class="content"> {{ detailForm.merchant.merchantName }}</span>
            </div>
            <div style="display:inline-block;margin:5px;width:31%">
                  <span class="head" style="margin-right:5px">供应商编码:</span>
                                    <span class="content">{{ detailForm.merchant.merchantCode }}</span>
            </div>
            <div style="display:inline-block;margin:5px;width:31%">
                  <span class="head" style="margin-right:5px">合同编码:</span>
                  <span class="content">{{ detailForm.contract.contractNo }}</span>
            </div>
            <div style="display:inline-block;margin:5px;width:31%">
                  <span class="head" style="margin-right:5px">合同状态:</span>
                                    <span class="content" v-if="detailForm.contract.contractStatus==1">生效合同</span>
                                    <span class="content" v-if="detailForm.contract.contractStatus==2">过期合同</span>
            </div>
            <div style="display:inline-block;margin:5px;width:31%">
                  <span class="head space-other4 ">合同描述:</span>
                                    <span class="content">{{ detailForm.contract.description }}</span>
            </div>
            <div style="display:inline-block;margin:5px;width:31%">
                  <span class="head space-other4">扣率:</span>
                                    <span class="content" style="width:40px">{{ detailForm.contract.settleRate }}%</span>
            </div>
            <div style="display:inline-block;margin:5px;width:31%">
                  <span class="head space-other4"> 合同开始日期:</span>
                                    <span class="content">{{ detailForm.contract.contractStarttime }}</span>
            </div>
            <div style="display:inline-block;margin:5px;width:31%">
                  <span class="head space-other4">合同结束日期:</span>
                                    <span class="content">{{ detailForm.contract.contractEndtime }}</span>
            </div>
            <div style="margin-top:15px;border: solid #BBBBBB 1px;">
              <el-table :data="approveTableData" size="mini" :row-class-name="rowClassName"
                      :header-cell-style="{height:'20px',width:'50px',color:'black'}"
                        border='true' >
                <el-table-column align="center" type="index" label="序号" class="item" width="80"/>
                <el-table-column align="center" property="uname" label="跟进人" class="item" width="180"/>
                <el-table-column align="center" property="createTime" label="跟进时间" class="item" width="220"/>
                <el-table-column align="center" property="remark" label="跟进内容" class="item" width="274"/>
              </el-table>
            </div>
          </div>
        </div>
      </vue-easy-print>
    </div>
  </el-drawer>
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

  import {getDetail} from '@/api/cost/settlement'
  import vueEasyPrint from "vue-easy-print";

  export default {
    components: {vueEasyPrint},
    props: {
      settleId: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        syncLoading: true,
        disabled: true,
        dialogVisible: false,
        loading: false,
        approveTableData: [],
        detailForm: detailForm
      }
    },
    watch: {},
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
    methods: {
      openDialog() {
        getDetail(this.settleId).then(res => {
          this.detailForm = res
          this.detailForm.approves = res.approves
          this.loading = false
          this.approveTableData = res.approves
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
        this.approveTableData = []
        this.detailForm = detailForm
      },
      rowClassName({row, rowIndex}) {
        row.xh = rowIndex + 1;
      },
      /**
       * 打印详情
       */
      clickPrint() {
        this.$refs.easyPrint.print();
      },
    }
  }


</script>

<style lang="scss">
  /* 注意：不能在scope中 */
  /*1.显示滚动条：当内容超出容器的时候，可以拖动：*/
  //抽屉从右往左开
  .el-drawer {
    overflow: scroll;
  }

  //使得drawer可以滚动
  .el-drawer__container ::-webkit-scrollbar {
    display: none;
  }

  //隐藏滚动条，在谷歌浏览器上是ok的
  /* 兼容火狐 */
  * {
    scrollbar-width: none;
  }


  .line-black {
    width: 100%;
    height: 1px;
    border-top: solid #BBBBBB 3px;
  }

 /*  @media print {
    #app {
      display: none;
    }
    .el-dialog,
    .el-dialog__wrapper,
    .el-message,
    .v-modal {
      display: none !important;
    }
  } */



  .content-wrap {
    margin-left: 10px
  }

  .d-header {
    background-color: #F5F5F5;
  }

  /** 设置el-row */
  .d-content > .el-row {
    margin-left: 20px;
    margin-top: 15px
  }

  .el-row {
    line-height: 33px;
  }

  .base-wrap {
    /*     font-size: 14px;
        font-weight:6; */

    line-height: 33px;
    margin: 10px 5px 0px 15px;
  }

  .invoice-wrap {
    border: solid #BBBBBB 3px;
    padding: 10px 30px 10px 30px;
    margin-top: 10px;

    .el-col {
      height: 28px;
      line-height: 28px;
    }

    .look-up {
      font-weight: bold;
    }
  }

  .record {
    margin: 15px 15px 3px 15px;
  }

  .nav {
    font-weight: bold;
    /*    padding-right: 535px; */
    /*     border-bottom: 1px solid #BBBBBB;  */
    color: black;
    height: 50px;
    line-height: 25px;


  }

  h2 {
    margin-top: 15px;
  }

  .el-button {
    font-size: 14px;
  }

  .head {
    font-weight: bold;
    font-size: 14px;
    color: #606266;
  }

  .content {
    font-size: 13px;
  }

  .space {
    margin-right: 5rem;
  }

  .space-other {
    margin-right: 30px;
  }

  .space-other2 {
    margin-left: 35px;
  }

  .space-other3 {
    margin-right: 29px;
  }

  .space-other4 {
    margin-right: 5px;
  }

  @media only screen and (min-width: 768px) and (max-width: 1024px) {
    .space {
      margin-right: 0rem;
    }
    .space-other {
      margin-right: 0px;

    }
    .space-other2 {
      margin-left: 0px;

    }
    .space-other3 {
      margin-right: 0px;
    }
    .space-other4 {
      margin-right: 0px;
    }

  }

  @media only screen and (min-width: 320px) and (max-width: 767px) {
    .space {
      margin-right: 0rem;
    }
    .space-other {
      margin-right: 0px;
      float: left;
    }
    .space-other2 {
      margin-left: 0px;
      float: left;
    }
    .space-other3 {
      margin-right: 0px;
      float: left;
    }
    .space-other4 {
      margin-right: 0px;
    }
  }
  /* 打印样式 */
@media print {
  /* 清除样式 */
  #app {
    display: none;
  }
  .el-dialog,
  .el-dialog__wrapper,
  .el-message,
  .v-modal {
    display: none !important;
  }
  /* 规定打印样式 */
  @page {
    size: auto A5 landscape;
    margin: 3mm;
  }

  html {
  background-color: #ffffff;
  margin: 0px; /* this affects the margin on the html before sending to printer */
  }
  body {
  border: solid 1px rgba(255,255,255,0);
/* margin: 10mm 15mm 10mm 15mm; margin you want for the content */
  }
  /* 启用样式 */
  .print{
    display: block !important;
    font-family: SimSun;
  }
  /* 打印样式 */
  .print-title{
    display: flex;
    justify-content: center;
  }
  .head{
    font-size: 16px;
    color: black;
    font-weight:normal
  }
  .content {
    font-size: 14px;
    padding-bottom:1px ;
    border-bottom:1px solid black ;
  }
  .grid-content{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: flex-start;
  }


}
</style>
