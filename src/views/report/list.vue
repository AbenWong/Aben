<template>
  <div class="content">
      <div >
        <el-row >
          <el-col class="top" :span="8">
            <el-button  size="medium"   style="width:85%;height:41px;">
              <span class="title">供应商满减活动交易及其满减商品明细</span> </el-button>
          </el-col>
         <el-col class="top" :span="7" :offset="9">
            <el-button  size="medium"   style="width:100%;height:41px" >
              <span class="title">供应商销售类型统计供应商销售汇总或明细</span> </el-button>
          </el-col>
        </el-row>
        <el-row >
          <el-col class="top" :span="8">
            <el-button  size="medium"   style="width:85%;height:41px" >
              <span class="title">供应商满减金额汇总</span> </el-button>
          </el-col>
          <el-col class="top"  :span="7" :offset="9">
            <el-button  size="medium"   style="width:100%;height:41px" >
              <span class="title">主供应商商品销售明细表（分折扣类型）</span> </el-button>
          </el-col>
        </el-row>
      </div>
        <el-row >
          <el-col class="top" :span="8">
            <el-button  size="medium"   style="width:85%;height:41px" >
              <span class="title">部门销售汇总表</span> </el-button>
          </el-col>
          <el-col class="top" :span="7" :offset="9">
            <el-button  size="medium"   style="width:100%;height:41px" >
              <span class="title">供应商商品销售汇总表</span> </el-button>
          </el-col>
        </el-row>
        <el-row >
          <el-col class="top"  :span="8">
            <el-button  size="medium"   style="width:85%;height:41px" >
              <span class="title">供应商按部门销售逐日汇总表</span> </el-button>
          </el-col>
          <el-col class="top" :span="7" :offset="9">
            <el-button  size="medium"   style="width:100%;height:41px" >
              <span class="title">供应商按部门销售逐日明细表</span> </el-button>
          </el-col>
        </el-row>
        <el-row >
          <el-col class="top"  :span="8">
            <el-button  size="medium"   style="width:85%;height:41px" >
              <span class="title">供应商按部门销售汇总</span> </el-button>
          </el-col>
          <el-col class="top" :span="7" :offset="9">
            <el-button  size="medium"   style="width:100%;height:41px" >
              <span class="title">供应商按部门销售明细</span> </el-button>
          </el-col>
        </el-row>
        <el-row >
          <el-col class="top"  :span="8">
            <el-button  size="medium"   style="width:85%;height:41px" >
              <span class="title">供分付款方式销售汇总表</span> </el-button>
          </el-col>
          <el-col class="top" :span="7" :offset="9">
            <el-button  size="medium"   style="width:100%;height:41px" >
              <span class="title"> </span> </el-button>
          </el-col>
        </el-row>
        <el-row >
          <el-col class="top"  :span="8" :offset="18">
              <span class="num">已加载报表</span>
              <div>
                <el-card shadow="always" class="card">11</el-card><span class="num">份</span>
              </div>
          </el-col>
        </el-row>
  </div>

</template>

<script>
  import {mapGetters} from "vuex";

  export default {
    name: 'Dashboard',
    computed: {
      ...mapGetters([
        'user',
      ]),
    },
    data(){
      return{
        conTop:require('@/assets/images/home.png'),
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
 .content{
  position: relative;
}
.info {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: -2;
    background-color: #f6f5f4;
  }
  .con-top-image{
    margin-top:2.5vw;
    margin-left: 7vw;
    width: auto;
    height: auto;
    max-width: 78%;
    max-height: 80%;
    z-index: -1;

  }

  .title{
    font-size: 1vw;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  }
  .top{
    margin-top:3vw ;
  }
  .card{
    margin:10px 15px 0px 100px  ;
    display:inline-block;
    font-size: 2vw;
    text-align: center;
    line-height: 15px;
    vertical-align: text-bottom;
  }
  .num{
    color: #fff;
    font-size: 1.8vw;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  }

  .el-button--medium:hover{
    background-color: rgba(232, 244, 255,0.8);
}
</style>

