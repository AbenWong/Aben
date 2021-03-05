<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--表单组件-->
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
        <h1 style="text-align: center">商品变更单</h1>
        <el-row :gutter="20" style="display:flex;justify-content:center; ">
          <el-col :span="6">
            <el-form-item label="商户">
              <el-select v-model="form.merchantId" clearable placeholder="选择商户"
                         @change="merchantChange" class="filter-item" style="width: 260px">
                <el-option v-for="item in merchantList" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商户名称">
              <el-input v-model="form.merchantName" readonly/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="商户编码">
              <el-input v-model="form.merchantNo" readonly/>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="合同编码">
              <el-input v-model="form.contractNo" readonly/>
            </el-form-item>
          </el-col>
        </el-row>
        <template>
          <el-table ref="table" :data="goodsData" size="small" style="width: 100%;">
            <el-table-column label="序号" type="index"></el-table-column>>
            <el-table-column label="名称" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.goodsName"/>
              </template>
            </el-table-column>
            <el-table-column label="品牌" align="center">
              <template slot-scope="scope">
                <el-select v-model="scope.row.brandId" placeholder="品牌" class="filter-item detail-item">
                  <el-option v-for="i in brandList" :key="i.value" :label="i.label" :value="i.value"/>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="单位" align="center">
              <template slot-scope="scope">
                <el-select v-model="scope.row.unitId" placeholder="单位" class="filter-item detail-item">
                  <el-option v-for="i in unitList" :key="i.value" :label="i.label" :value="i.value"/>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="类型" align="center">
              <template slot-scope="scope">
                <cascader :value="scope.row.categoryId" @valueChange="categoryChange($event,scope.$index)"></cascader>
              </template>
            </el-table-column>
            <el-table-column label="单价" align="center">
              <template slot-scope="scope">
                <el-input type="number" :min="0" v-model="scope.row.price"/>
              </template>
            </el-table-column>
            <el-table-column label="优惠价" align="center">
              <template slot-scope="scope">
                <el-input type="number" :min="0" v-model="scope.row.discountPrice"/>
              </template>
            </el-table-column>
            <el-table-column label="扣率" align="center">
              <template slot-scope="scope">
                <el-input type="number" :min="0" v-model="scope.row.discountRate">
                  <template slot="append"> %</template>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="primary" @click="removeGoods(scope.$index)" class="remove">移除</el-button>
              </template>
            </el-table-column>
          </el-table>


          <!--<el-row class="detail-head">
            <el-col :span="2">序号</el-col>
            <el-col :span="4">名称</el-col>
            <el-col :span="3">品牌</el-col>
            <el-col :span="3">单位</el-col>
            <el-col :span="3">类型</el-col>
            <el-col :span="2">单价</el-col>
            <el-col :span="3">优惠价</el-col>
            <el-col :span="2">扣率</el-col>
            <el-col :span="2">操作</el-col>
          </el-row>
          <div v-for="(item, index) in goodsData" :key="index" class="cont-right-info">
            <el-row :gutter="10" class="detail">
              <el-col :span="2" style="color:blue;">
                <span>{{index+1}}</span>
              </el-col>
              <el-col :span="4">
                <el-input v-model="item.goodsName"/>
              </el-col>
              <el-col :span="3">
                <el-select v-model="item.brandId" placeholder="品牌" class="filter-item detail-item">
                  <el-option v-for="i in brandList" :key="i.value" :label="i.label" :value="i.value"/>
                </el-select>
              </el-col>
              <el-col :span="3">
                <el-select v-model="item.unitId" placeholder="单位" class="filter-item detail-item">
                  <el-option v-for="i in unitList" :key="i.value" :label="i.label" :value="i.value"/>
                </el-select>
              </el-col>
              <el-col :span="3">
                <cascader :value="item.categoryId" @valueChange="categoryChange($event,index)"></cascader>
              </el-col>
              <el-col :span="2">
                <el-input type="number" :min="0" v-model="item.price"/>
              </el-col>
              <el-col :span="3">
                <el-input type="number" :min="0" v-model="item.discountPrice"/>
              </el-col>
              <el-col :span="2">
                <el-input type="number" :min="0" v-model="item.discountRate">
                  <template slot="append"> %</template>
                </el-input>
              </el-col>
              <el-col :span="2">
                <el-button type="primary" @click="removeGoods(index)" class="remove">移除</el-button>
              </el-col>
            </el-row>
          </div>-->
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer detail-bottom">
        <el-button type="primary" @click="addGoods" class="add">添加商品</el-button>
        <el-button type="primary" @click="back" class="back">取消</el-button>
        <el-button type="primary" @click="submitData" class="submit">确认</el-button>
      </div>

    </div>
  </div>
</template>

<script>
  import crudGoodsBatch from '@/api/goodsBatch'
  import merchant from "@/api/merchant"
  import goodsBrand from "@/api/goodsBrand";
  import goodsUnit from "@/api/goodsUnit";
  import Cascader from '@/components/Cascader'


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
  const defaultGoodsForm = {
    index: 1,
    goodsId: null,
    batchId: null,
    merchantId: null,
    brandId: null,
    categoryId: null,
    unitId: null,
    goodsNo: null,
    goodsName: null,
    brandName: null,
    categoryName: null,
    unitName: null,
    discountRate: null,
    price: null,
    discountPrice: null,
    status: null,
    remark: null,
    picture: null
  }
  export default {
    components: {
      Cascader,
    },
    name: 'GoodsBatch',
    data() {
      return {
        permission: {
          add: ['admin', 'goodsBatch:add'],
          edit: ['admin', 'goodsBatch:edit'],
          del: ['admin', 'goodsBatch:del']
        },
        rules: {},
        form: defaultForm,
        merchantList: [],
        goodsData: [],
        unitList: [],
        brandList: [],
        typeList: [],
        index: 0
      }
    },
    watch: {},
    mounted() {
      var batchId = this.$route.query.batchId;
      if (typeof (batchId) != 'undefined') {
        this.getBatchInfo(batchId);
      }
      this.getMerchantList();
      this.goodsBrandList();
      this.goodsUnitList();
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
      },
      // 获取商户下拉列表
      getMerchantList() {
        merchant.getMerchantDowndrop().then(res => {
          this.merchantList = res;
        })
      },
      // 获取商品品牌下拉列表
      goodsBrandList() {
        goodsBrand.getBrandDowndrop().then(res => {
          this.brandList = res
        })
      },
      // 获取商品单位下拉列表
      goodsUnitList() {
        goodsUnit.getUnitDowndrop().then(res => {
          this.unitList = res
        })
      },
      // 监听商品类别变化
      categoryChange(value, index) {
        this.goodsData[index].categoryId = value
      },
      // 获取商户信息
      merchantChange(merchantId) {
        if (merchantId != null) {
          merchant.getMerchantInfo(merchantId).then(res => {
            this.form.contractNo = res.contractApprovalNo;
            this.form.merchantName = res.merchantName;
            this.form.merchantNo = res.merchantCode;
          })
        }
      },
      // 添加商品
      addGoods() {
        this.goodsData.push(Object.assign({}, defaultGoodsForm))
      },
      // 移除商品
      removeGoods(index) {
        this.goodsData.splice(index, 1);
      },
      // 到商品详情页面
      goodsDetails(batchId) {
        this.$router.push({path: '/goods/index?batchId=' + batchId})
      },
      submitData() {
        var obj = this.form;
        obj.goodsList = this.goodsData;
        this.$confirm('确认提交数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          crudGoodsBatch.addBatch(obj).then(res => {
            this.$message.success("数据提交成功")
            this.back();
          })
        })

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

  .detail-head {
    font-weight: bold;
    color: #9c9899;
    text-align: center;
    line-height: 12px;
    border-bottom: 1px solid #efefef;
    height: 25px;
  }

  .detail {
    height: 45px;
    text-align: center;
    border-bottom: 1px solid #efefef;
    display: flex;
    align-items: center;
  }

  .detail-item {
    margin-top: 10px;
  }

  .detail-bottom {
    margin-top: 15px;
    margin-left: 15px;
  }

  .back {
    background: #fbbc05;
    border-color: #fbbc05;
    color: #FFF;
  }

  .back:hover {
    background: #fcc624;
    border-color: #fcc624;
    color: #FFF;
  }

  .remove {
    background: #ff4d4d;
    border-color: #ff4d4d;
    color: #FFF;
  }

  .remove:hover {
    background: #fa5858;
    border-color: #fa5858;
    color: #FFF;
  }

  .submit {
    background: #13ce66;
    border-color: #13ce66;
    color: #FFF;
  }

  .submit:hover {
    background: #42d885;
    border-color: #42d885;
    color: #FFF;
  }
</style>
