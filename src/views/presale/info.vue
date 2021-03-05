<template>
  <div>
    <el-form ref="form" size="small"  class="info-box">
        <div class="wrap">
          <div id="d-header-id" class="d-header">
            <el-row style="line-height: 40px">
              <el-col :xs="12" :sm="12" :md="15"
                  style="line-height: 40px; font-size: 18px; font-weight: bold; padding-left: 20px;color:blue">
                <span>{{infoData.no}}</span>
              </el-col>
             <el-col :xs="20" :sm="10" :md="8" style="line-height: 40px;font-size:14px">
               <span>单据审批状态: </span>
                <span   v-if="infoData.approvalStatus==0">草稿</span>
                <span   v-if="infoData.approvalStatus==1">审批中</span>
                <span  v-if="infoData.approvalStatus==2">审批通过</span>
                <span  v-if="infoData.approvalStatus==3">审批驳回</span>
              </el-col>
             <!--  <el-col :xs="3" :sm="2" :md="1" :offset="1" style="line-height: 40px; align-items: center; margin-left:15px">
                <el-link :underline="false" @click="closeDialog">X</el-link>
              </el-col> -->
            </el-row>
          </div>
          <div id="d-content-id" class="content-wrap">
            <el-row class="nav">
              <h2>基础信息</h2>
            </el-row>
            <div class="line-black"></div>
            <div class="base-wrap">
              <el-row>
                <el-col :xs="24" :sm="8" :md="8">
                      <div class="grid-content ">
                        <span class="head" style="margin-right:5px">制单员:</span>
                        <span class="content">{{infoData.createBy}}</span>
                      </div>
                </el-col>
                <el-col :xs="24" :sm="8" :md="8">
                    <div class="grid-content ">
                      <span class="head" style="margin-right:5px">制单时间:</span>
                      <span class="content">{{infoData.createTime}}</span>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="8" :md="8">
                    <div class="grid-content ">
                      <span class="head" style="margin-right:5px">备注:</span>
                      <span>{{infoData.remark}}</span>
                    </div>
                </el-col>
              </el-row>
          </div>
          <div>
            <el-row class="nav" style="padding-right: 0px;">
              <h2>供应商信息</h2>
            </el-row>
            <div class="line-black"></div>
            <div class="base-wrap" style="text-align: center">
              <el-row class="m-row">
                <el-col :xs="24" :sm="6" :md="8">
                  <div class="grid-content " style="float: left;">
                    <span class="head">供应商:</span>
                    <span class="content">{{infoData.merchantName}}</span>
                  </div>
                </el-col>
                <el-col :xs="24" :sm="8" :md="6">
                      <div class="grid-content space">
                        <span class="head" style="margin-right:5px">供应商编码:</span>
                        <span class="content">{{infoData.merchantNo}}</span>
                      </div>
                </el-col>
              </el-row>
            </div>
          </div>
            <el-row class="nav" style="padding-right: 0px;">
              <h2>商品信息</h2>
            </el-row>
            <div class="line-black"></div>

            <div id="ht-content" class="base-wrap" style="text-align: center">
              <el-row class="ht-row">
                <el-col :xs="24" :sm="6" :md="7">
                  <div style="float: left;">
                    <span class="head" style="margin-right:5px">合同编码:</span>
                    <span class="content">{{infoData.contractNo}}</span>
                  </div>
                </el-col>
                <el-col :xs="24" :sm="8" :md="6">
                  <div class="space">
                    <span class="head" style="margin-right:5px">商品名称:</span>
                    <span class="content">{{infoData.goodsName}}</span>
                  </div>
                </el-col>
                <el-col :xs="24" :sm="8" :md="9">
                  <div class="space-other2">
                    <span class="head" style="margin-right:5px">商品编号:</span>
                    <span class="content">{{infoData.goodsNo}}</span>
                  </div>
                </el-col>
                <el-col :xs="24" :sm="8" :md="8">
                  <div  style="float: left;" >
                    <span class="head ">原扣率:</span>
                    <span class="content">{{infoData.oldDeductionRate}}%</span>
                  </div>
                </el-col>
                <el-col :xs="24" :sm="6" :md="6">
                  <div style="float: left;">
                    <span class="head space-other4">新扣率:</span>
                    <span class="content">{{infoData.newDeductionRate}}%</span>

                  </div>
                </el-col>
                <el-col :xs="24" :sm="8" :md="8">
                  <div >
                    <span class="head space-other4">开始日期:</span>
                    <span class="content">{{infoData.startTime}}</span>
                  </div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="9">
                  <div style="float: left;">
                    <span class="head">结束日期:</span>
                    <span class="content">{{infoData.endTime}}</span>
                  </div>
                </el-col>
            </el-row>
              </div>
          </div>
        </div>
      </el-form>
  </div>
</template>

<script>
  import crudPresaleChange from '@/api/presaleChange'

  export default {
    name: "presaleChangeInfo",
    data() {
      return {infoData: {}}
    },
    mounted() {
      var presaleChangeId = this.$route.query.presaleChangeId;
      if (typeof (presaleChangeId) != 'undefined') {
        crudPresaleChange.get(presaleChangeId).then(res => {
          this.infoData = res;
        })
      }
    }
  }
</script>

<style scoped>
  /* 兼容火狐 */
  * {
    scrollbar-width: none;
  }


  .line-black {
    width: 100%;
    height: 1px;
    border-top: solid #BBBBBB 3px;
  }
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

/*   .invoice-wrap {
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
  } */

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
    margin-right: 6rem;
  }

  .space-other {
    margin-right: 30px;
  }

  .space-other2 {
    margin-right: 35px;
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
  
</style>

