<template>

  <div id="wrap">
    <el-button @click="getPdf(htmlTitle)">下载pdf</el-button>
    <!-- 详情 -->
    <div id="pdfDom" class="container"  style="width: 700px; margin-top: -999999999px">
      <!-- 详情主体 -->
      <el-row style="line-height: 40px">
        <el-col :span="16" style="line-height: 40px; font-size: 18px; font-weight: bold; padding-left: 20px">
          A012020305060742
        </el-col>
        <el-col :span="4" style="line-height: 40px">
          单据状态: 待审核
        </el-col>
        <el-col :span="4" style="line-height: 40px">
          <el-button @click="printDetail">打印</el-button>
        </el-col>
      </el-row>

      <el-row class="common-margin">
        <span class="row-title">基础信息</span>
      </el-row>
      <hr class="common-margin" />

      <el-row class="common-margin">
        <el-col :span="6">
          <div class="grid-content ">
            创建时间:{{detail.settlement.createTime}}
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content ">
            制单员:{{detail.settlement.maker}}
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content ">
            对账状态:{{detail.settlement.checkStatus}}
          </div>
        </el-col>
      </el-row>
      <br />
      <br />

      <el-row class="common-margin">
        <span class="row-title">结算信息</span>
      </el-row>
      <hr class="common-margin"/>
      <el-row class="common-margin">
        <el-col :span="6">
          <div class="grid-content ">
            结算开始日期:{{ detail.settlement.checkStatus }}
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content ">
            结算结束日期:{{ detail.settlement.checkStatus }}
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content ">
            计划付款日期:{{ detail.settlement.checkStatus }}
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content ">
            销售数量:{{ detail.settlement.checkStatus }}
          </div>
        </el-col>
      </el-row>

      <el-row  class="common-margin">
        <el-col :span="6">
          <div class="grid-content ">
            销售金额:{{ detail.settlement.checkStatus }}
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content ">
            销售实收金额:{{ detail.settlement.checkStatus }}
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content ">
            储蓄卡抵扣占比:{{ detail.settlement.checkStatus }}
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content ">
            储蓄卡抵扣金额:{{ detail.settlement.checkStatus }}
          </div>
        </el-col>
      </el-row>

      <el-row class="common-margin">
        <el-col :span="6">
          <div class="grid-content ">
            机构应收金额:{{ detail.settlement.checkStatus }}
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content ">
            供应商应收金额:{{ detail.settlement.checkStatus }}
          </div>
        </el-col>
      </el-row>
      <br />
      <br />

      <el-row class="common-margin">
        <span class="row-title">供应商信息</span>
      </el-row>
      <hr class="common-margin"/>
      <el-row class="common-margin">
        <el-col :span="12">
          <div class="grid-content ">
            供应商:{{ detail.settlement.checkStatus }}
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content ">
            供应商编码:{{ detail.settlement.checkStatus }}
          </div>
        </el-col>
      </el-row>
      <br />
      <br />

      <el-row class="common-margin">
        <span class="row-title">合同信息</span>
      </el-row>
      <hr class="common-margin"/>
      <el-row class="common-margin">
        <el-col :span="12">
          <div class="grid-content  contract-row">
            合同编码:{{ detail.settlement.checkStatus }}
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content  contract-row">
            合同状态:{{ detail.settlement.checkStatus }}
          </div>
        </el-col>
      </el-row>
      <el-row class="common-margin">
        <el-col :span="12">
          <div class="grid-content  contract-row">
            合同描述:{{ detail.settlement.checkStatus }}
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content  contract-row">
            扣率:{{ detail.settlement.checkStatus }}%
          </div>
        </el-col>
      </el-row>
      <el-row class="common-margin ">
        <el-col :span="12">
          <div class="grid-content  contract-row">
            是否集中收银:{{ detail.settlement.checkStatus }}
          </div>
        </el-col>
      </el-row>
      <el-row class="common-margin">
        <el-col :span="12">
          <div class="grid-content  contract-row">
            合同开始日期:{{ detail.settlement.checkStatus }}
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content  contract-row">
            合同结束日期:{{ detail.settlement.checkStatus }}
          </div>
        </el-col>
      </el-row>

      <br />
      <br />

      <el-row class="common-margin">
        <span class="row-title">跟进记录</span>
      </el-row>
      <div class="common-margin follow-record">
        <!-- 跟进记录 -->
        <el-table
          :data="gridData"
          border
          v-loading="loading"
          class="common-margin"
          :header-cell-style="{background:'#ededed'}"
        >
          <el-table-column property="date" label="序号" width="150"></el-table-column>
          <el-table-column property="name" label="跟进人" width="200"></el-table-column>
          <el-table-column property="address" label="跟进时间"></el-table-column>
          <el-table-column label="跟进内容"></el-table-column>
        </el-table>
        <!--分页组件-->
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="2"
          :total="129">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    components: { },
    data() {
      return {
        id: 1,
        syncLoading: true,
        disabled: true,
        drawer: true,
        loading: false,
        htmlTitle: "测试pdf",
        nowTime: '202030',
        detail: {
          settlement: {
            createTime: '2020-12-11 00:20:20',
            maker: '何金瑜',
            checkStatus: 0
          },
          merchant: {

          },

          contract: {

          }
        },
        gridData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }]
      }
    },
    created() {
      this.beforeInit()
    },
    watch:{

    },
    computed:{

    },
    methods: {
      beforeInit() {
        getDetail(this.id).then(()=> {
          console.log(this)
        }).catch(() => {
          console.log(this)
        })
        return true
      },
      //弹出层关闭
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      /**
       * 打印详情
       */
      printDetail(){
        this.beforeInit();
      }
    }
  }

</script>


<style lang="scss"  scoped>
  .detail-title{
    border: 2px;
    background-color: #00a2d4;
    margin: 30px 50px 30px 50px;
  }
  .el-row {
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }

  .grid-content {
    /** 文本居中 */
    display: flex;
    align-items: center;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

  .row-title{
    font-weight: bold;
    margin: 0px 0px 10px 10px;
    color: #101010;
    font-size: 14px;
  }

  hr{
    background-color: rgba(187, 187, 187, 100);
    height: 2px;
    border-radius: 0px 0px 2px 2px;
    /* border: 1px solid rgba(187, 187, 187, 100); */
  }

  .common-margin{
    margin: 0px 16px 4px 3px;
  }

  .container{
    .contract-row{
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .header{
    height: 40px;
    padding: 0px 0px 0px 0px;
    line-height: 40px;
  }

</style>
