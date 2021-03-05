<template>
  <div>
    <!--表单组件-->
    <el-dialog :close-on-click-modal="false" :visible.sync="addShow"
               title="制单" width="800px">
      <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px" class="info-box">
        <el-form-item label="结算单ID" prop="settlementId">
          <my-select v-model="form.settlementId" :placeholder="'请选择结算单'" @change="settlementChange"
                     :downdropType="'settlement/initdata-downdrop'" style="width: 200px;"/>
        </el-form-item>
        <el-form-item label="供应商" class="info-item">
          <el-input v-model="form.merchantName" readonly style="width: 200px;"/>
        </el-form-item>
        <el-form-item label="商家编号">
          <el-input v-model="form.merchantNo" readonly style="width: 200px;"/>
        </el-form-item>
        <el-form-item label="销售额">
          <el-input v-model="form.oldSaleAmount" readonly style="width: 200px;"/>
        </el-form-item>
        <el-form-item label="销售数量">
          <el-input v-model="form.oldSaleNums" readonly style="width: 200px;"/>
        </el-form-item>
        <el-form-item label="参考扣率">
          <el-input v-model="form.oldDeductionRate" readonly style="width: 200px;">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" style="width: 200px;"/>
        </el-form-item>
      </el-form>
      <el-link type="primary" :underline="false" @click="addItem">新增</el-link>
      <el-table ref="table" :data="items" size="small" style="width: 100%;">
        <el-table-column align="center" label="序号">
          <template slot-scope="scope">
            <span v-if="scope.row.iscount">合计</span>
            <span v-else>{{scope.$index+1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="saleNums" label="销售数量" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.iscount">{{scope.row.saleNums}}</span>
            <el-input v-else type="number" v-model="scope.row.saleNums"/>
          </template>
        </el-table-column>
        <el-table-column prop="saleAmount" label="销售金额" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.iscount">{{scope.row.saleAmount}}</span>
            <el-input v-else type="number" v-model="scope.row.saleAmount"/>
          </template>
        </el-table-column>
        <el-table-column prop="deductionRate" label="扣率" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.iscount">{{scope.row.deductionRate}}</span>
            <el-input v-else type="number" v-model="scope.row.deductionRate"/>
          </template>
        </el-table-column>
        <el-table-column prop="deductionAmount" label="扣额" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.deductionAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="saleCost" label="销售成本" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.saleCost}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-link v-if="scope.row.iscount" type="primary" :underline="false"></el-link>
            <el-link v-else type="primary" :underline="false" @click="removeItem(scope.$index)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="addShow =false">取消</el-button>
        <el-button :loading="saveLoading" type="primary" @click="addShow =false">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import MySelect from '@/components/MySelect'
  import settlement from "@/api/cost/settlement";

  const defaultForm = {
    saleAdjustId: null,
    no: null,
    settlementNo: null,
    settlementId: null,
    merchantId: null,
    merchantName: null,
    merchantNo: null,
    contractNo: null,
    oldSaleAmount: null,
    oldSaleNums: null,
    oldDeductionAmount: null,
    newSaleAmount: null,
    newSaleNums: null,
    newDeductionAmount: null,
    status: null,
    remark: null,
    approvalId: null,
    approvalStatus: null,
    approvalUrl: null,
    createTime: null,
    updateTime: null,
    createBy: null,
    updateBy: null,
    isDel: null,
    oldDeductionRate: null
  }

  const defaulttem = {
    saleNums: 0,
    saleAmount: 0,
    deductionRate: 0,
    deductionAmount: 0,
    saleCost: 0,
    iscount: false,
  }

  export default {
    components: {MySelect},
    name: "add",
    data() {
      return {
        form: defaultForm,
        rules: {
          saleAdjustId:
            [
              {required: true, message: '销售调整单ID不能为空', trigger: 'blur'}
            ],
          no:
            [
              {required: true, message: '销售调整单号不能为空', trigger: 'blur'}
            ],
          settlementNo:
            [
              {required: true, message: '结算单号不能为空', trigger: 'blur'}
            ],
          settlementId:
            [
              {required: true, message: '结算单ID不能为空', trigger: 'blur'}
            ],
          merchantId:
            [
              {required: true, message: '供应商ID不能为空', trigger: 'blur'}
            ],
          merchantNo:
            [
              {required: true, message: '供应商编号不能为空', trigger: 'blur'}
            ]
        },
        addShow: false,// 显示销售调整单制单
        saveLoading: false,// 数据提交等待
        items: [defaulttem]
      }
    },
    mounted() {
      this.addCountItem();
    },
    methods: {
      // 结算单变化
      settlementChange(settlementId) {
        if (!settlementId) {
          this.form.merchantName = null;
          this.form.merchantNo = null;
          this.form.oldSaleAmount = null;
          this.form.oldSaleNums = null;
          this.form.oldDeductionRate = null;
          return false;
        }
        // 获取结算单详情
        settlement.getDetail(settlementId).then(res => {
          this.form.merchantName = res.merchant.merchantName;
          this.form.merchantNo = res.merchant.merchantCode;
          this.form.oldSaleAmount = res.settlement.saleAmount;
          this.form.oldSaleNums = res.settlement.saleCount;
          this.form.oldDeductionRate = res.contract.settleRate;
        })
      },
      // 新增一条记录
      addItem() {
        this.items.splice(this.items.length-1, 1);
        this.items.push(Object.assign({}, defaulttem))
        this.addCountItem();
      },
      // 添加汇总记录
      addCountItem() {

        var sum = Object.assign({}, defaulttem)
        sum.iscount = true;
        this.items.push(sum)
      },
      // 移除一条记录
      removeItem(index) {
        if (this.items.length == 2) {
          this.$message.warning("至少需要有一条数据")
          return false;
        }
        this.items.splice(this.items.length-1, 1);
        this.items.splice(index, 1);
        this.addCountItem();

      },
    }
  }
</script>

<style scoped>
  .info-box {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }

</style>
