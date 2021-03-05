<template>
  <div class="app-container">
    <div class="head-container">
      <h1 style="text-align: center">商品变更单</h1>
      <el-form ref="form" :model="form" size="small" label-width="6rem;">
        <!--<el-form-item label="供应商">
          <span>{{form.merchantName}}</span>
        </el-form-item>-->
        <el-form-item label="供应商名称">
          <span>{{form.merchantName}}</span>
        </el-form-item>
        <el-form-item label="供应商编码">
          <span>{{form.merchantNo}}</span>
        </el-form-item>
        <el-form-item label="合同编码">
          <span>{{form.contractNo}}</span>
        </el-form-item>
      </el-form>

      <el-table ref="table" :data="goodsData" size="small" style="width: 100%;">
        <el-table-column type="index" label="序号"/>
        <el-table-column prop="goodsName" label="名称"/>
        <el-table-column prop="goodsNo" label="货号"/>
        <el-table-column prop="brandName" label="品牌"/>
        <el-table-column prop="unitName" label="单位"/>
        <el-table-column prop="categoryName" label="类型"/>
        <el-table-column prop="price" label="单价"/>
        <el-table-column prop="discountPrice" label="优惠价"/>
        <el-table-column prop="discountRate" label="扣率"/>
      </el-table>
    </div>

    <div slot="footer" class="dialog-footer detail-bottom">
      <el-button type="primary" @click="back" class="back">返回</el-button>
    </div>
  </div>
</template>
<script>
  import crudGoodsBatch from '@/api/goodsBatch'

  const defaultForm = {
    batchId: null,
    batchNo: null,
    merchantId: null,
    status: null,
    remark: null,
    approvalId: null,
    approvalStatus: null,
    createTime: null,
    updateTime: null,
    createBy: null,
    updateBy: null,
    isDel: null,
    merchantName: null,
    merchantNo: null,
    contractNo: null
  }
  export default {
    name: 'GoodsBatchInfo',
    data() {
      return {
        form: defaultForm,
        goodsData: []
      }
    },
    watch: {},
    mounted() {
      var batchId = this.$route.query.batchId;
      this.getBatchInfo(batchId);
    },
    methods: {
      getBatchInfo(batchId) {
        crudGoodsBatch.getInfo(batchId).then(res => {
          this.form = res;
          this.goodsData = res.goods;
        })
      },
      // 返回上一页
      back() {
        this.$router.push({path: '/goods/batch'})
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
