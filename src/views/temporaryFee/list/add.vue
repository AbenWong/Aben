<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--表单组件-->
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
        <h1 style="text-align: center">临时费用单</h1>
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
          <el-table ref="table" :data="temporaryFeeData" size="small" style="width: 100%;">
            <el-table-column label="序号" type="index"></el-table-column>>
            <el-table-column label="收费项目" align="center">
              <template slot-scope="scope">
                <el-select v-model="scope.row.temporaryFeeProjectId" placeholder="收费项目" class="filter-item detail-item">
                  <el-option v-for="i in temporaryFeeProjectList" :key="i.value" :label="i.label" :value="i.value"/>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="收费类别" align="center">
              <template slot-scope="scope">
                <el-select v-model="scope.row.temporaryFeeTypeId" placeholder="收费类别" class="filter-item detail-item">
                  <el-option v-for="i in temporaryFeeTypeList" :key="i.value" :label="i.label" :value="i.value"/>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="应征收日期" align="center">
              <template slot-scope="scope">
                <el-date-picker v-model="scope.row.receivableTime" type="date"/>
              </template>
            </el-table-column>
            <el-table-column label="应收金额" align="center">
              <template slot-scope="scope">
                <el-input type="number" :min="0" v-model="scope.row.receivableAmount"/>
              </template>
            </el-table-column>
            <el-form-item label="减免金额">
              <template slot-scope="scope">
                <el-input type="number" :min="0" v-model="scope.row.reductionAmount"/>
              </template>
            </el-form-item>
            <el-form-item label="应缴金额">
              <template slot-scope="scope">
              <el-input type="number" :min="0" v-model="scope.row.actualAmount"/>
              </template>
            </el-form-item>
            <el-form-item label="计费开始日期">
              <template slot-scope="scope">
              <el-date-picker v-model="scope.row.billingStartsTime" type="date"/>
              </template>
            </el-form-item>
            <el-form-item label="计费结束日期">
              <template slot-scope="scope">
              <el-date-picker v-model="scope.row.billingEndTime" type="date"/>
              </template>
            </el-form-item>
            <el-table-column label="收款方式" align="center">
              <template slot-scope="scope">
                <el-select v-model="scope.row.collectionType" filterable placeholder="请选择">
                  <el-option v-for="item in dict.collection_type" :key="item.id" :label="item.label" :value="item.value"/>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="抵进项发票" align="center">
              <template slot-scope="scope">
                <el-select v-model="scope.row.inputInvoice" filterable placeholder="请选择">
                  <el-option v-for="item in dict.input_invoice" :key="item.id" :label="item.label" :value="item.value"/>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="税率" align="center">
              <template slot-scope="scope">
                <el-select v-model="scope.row.discountRate" filterable placeholder="请选择">
                  <el-option v-for="item in dict.income_tax_rate" :key="item.id" :label="item.label" :value="item.value"/>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="付款状态" align="center">
              <template slot-scope="scope">
                <el-select v-model="scope.row.collectionStatus" filterable placeholder="请选择">
                  <el-option v-for="item in dict.collection_status" :key="item.id" :label="item.label" :value="item.value"/>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="备注" align="center">
              <template slot-scope="scope">
                <el-form-item label="备注">
                  <el-input v-model="scope.row.remark"/>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="primary" @click="removeGoods(scope.$index)" class="remove">移除</el-button>
              </template>
            </el-table-column>
          </el-table>
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
  import crudTemporaryFee from "@/api/temporaryFee/temporaryFee";
  import crudTemporaryFeeList, {addList} from "@/api/temporaryFee/temporaryFeeList";
  import merchant from "@/api/merchant"
  import crudTemporaryFeeProject from '@/api/temporaryFee/temporaryFeeProject'
  import crudTemporaryFeeType from '@/api/temporaryFee/temporaryFeeType'


  const defaultForm = {
    temporaryFeeListId:null,
    temporaryFeeNo:null,
    contractNo:null,
    merchantId:null,
    merchantName:null,
    merchantNo:null,
    expropriationStatus:null,
    remark:null,
    approvalId:null,
    approvalStatus:null,
    approvalUrl:null,
    createTime:null,
    updateTime:null,
    createBy:null,
    updateBy:null,
    isDel:null
  }
  const defaultTemporaryFeeForm = {
    index: 1,
    temporaryFeeId:null,
    temporaryFeeListId:null,
    temporaryFeeNo:null,
    merchantId:null,
    merchantName:null,
    merchantNo:null,
    temporaryFeeTypeId:null,
    temporaryFeeProjectId:null,
    temporaryFeeProjectName:null,
    temporaryFeeTypeName:null,
    receivableTime:null,
    receivableAmount:null,
    reductionAmount:null,
    actualAmount:null,
    billingStartsTime:null,
    billingEndTime:null,
    collectionType:null,
    collectionTypeName:null,
    inputInvoice:null,
    discountRate:null,
    remark:null,
    createTime:null,
    updateTime:null,
    collectionStatus:null,
    status:null,
    isDel:null
  }
  export default {
    components: {
      merchant,crudTemporaryFee,crudTemporaryFeeProject,crudTemporaryFeeType,crudTemporaryFeeList
    },
    dicts: ['collection_type', 'input_invoice', 'income_tax_rate', 'collection_status'],
    name: 'TemporaryFeeListAdd',
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
        temporaryFeeData: [],
        temporaryFeeTypeList: [],
        temporaryFeeProjectList: [],
        index: 0
      }
    },
    watch: {},
    mounted() {
      var temporaryFeeListId = this.$route.query.temporaryFeeListId;
      if (typeof (temporaryFeeListId) != 'undefined') {
        this.getListInfo(temporaryFeeListId);
      }
      this.getMerchantList();
      this.getTemporaryFeeProjectList();
      this.getTemporaryFeeTypeList();
    },
    methods: {
      back() {
        this.$back()
      },
      getListInfo(temporaryFeeListId) {
        crudTemporaryFeeList.getInfo(temporaryFeeListId).then(res => {
          console.log("res")
          console.log(res)
          this.form = res;
          this.temporaryFeeData = res.temporaryFeeDtos;
        })
      },
      // 获取商户下拉列表
      getMerchantList() {
        merchant.getMerchantDowndrop().then(res => {
          this.merchantList = res;
        })
      },
      // 获取临时费用项目下拉列表
      getTemporaryFeeProjectList() {
        crudTemporaryFeeProject.getProjectDowndrop().then(res => {
          this.temporaryFeeProjectList = res
        })
      },
      // 获取临时费用类别下拉列表
      getTemporaryFeeTypeList() {
        crudTemporaryFeeType.getTypeDowndrop().then(res => {
          this.temporaryFeeTypeList = res
        })
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
        this.temporaryFeeData.push(Object.assign({}, defaultTemporaryFeeForm))
      },
      // 移除商品
      removeGoods(index) {
        this.temporaryFeeData.splice(index, 1);
      },
      // 到商品详情页面
      goodsDetails(temporaryFeeListId) {
        this.$router.push({path: '/goods/index?temporaryFeeListId=' + temporaryFeeListId})
      },
      submitData() {
        var obj = this.form;
        obj.temporaryFees = this.temporaryFeeData;
        this.$confirm('确认提交数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          crudTemporaryFeeList.addList(obj).then(res => {
            this.$message.success("数据提交成功")
            this.$back();
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
