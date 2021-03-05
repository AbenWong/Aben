<template>
  <!-- 制单 -->
  <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="dialog" width="768px"
             :before-close="handleClose">
    <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="100px">
      <el-form-item label="截止日期" prop="endTime" style=" width: 350px;">
        <el-date-picker style=" width: 220px;" v-model="form.endTime" type="date" value-format="yyyy-MM-dd"
                        placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="供应商" prop="merchantNo" style=" width: 350px;">
       <!--  <my-select v-model="form.merchantId" :placeholder="'请选择供应商'" @change="getMerchantInfo"
                   :downdropType="'merchant/merchant-downdrop'"/> -->
        <my-select v-model="form.merchantId" :placeholder="'请选择供应商'" @change="getMerchantInfo" :downdropType="'merchant/merchant-downdrop'"/>
      </el-form-item>
      <el-form-item label="合同" prop="contractNo" style=" width: 350px;" v-if="form.contractNo">
        <el-input v-model="form.contractNo" clearable placeholder="合同编号" style="width: 200px;" class="filter-item"/>
      </el-form-item>
      <el-form-item label="计划付款日" prop="planPayTime" style=" width: 350px;">
        <el-date-picker style=" width: 220px;" v-model="form.planPayTime" type="date" value-format="yyyy-MM-dd"
                        placeholder="计划付款日期">
        </el-date-picker>
      </el-form-item>
      <!--
      <el-form-item label="租赁" style=" width: 350px;">
        <el-switch v-model="form.lease" active-value="1" inactive-value="0" @change="switchLeaseMethod"></el-switch>
      </el-form-item>
      <el-form-item label="集中收银" style=" width: 350px;">
        <el-radio-group v-model="form.centralizedCashier" size="mini" @change="chooseCashierMethod">
          <el-radio label="1">真</el-radio>
          <el-radio label="0">假</el-radio>
        </el-radio-group>
      </el-form-item>
      -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancle">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>

</template>

<script>
  var defaultForm = {
    merchantId: null,
    merchantNo: null,
    contractNo: null,
    endTime: null,
    planPayTime: null
  };
  //引入settlement api
  import {add} from '@/api/cost/settlement'
  import merchant from "@/api/merchant";
  import MySelect from '@/components/MySelect'
  export default {
    components: {MySelect},
    //接收父组件值
    data() {
      return {
        loading: false,
        dialog: false,
        ctLoading: false,
        submitLoading: false,
        form: defaultForm,
        //合同列表
        cts: [],
        merchantInfo: {},
        //规则校验
        rules: {
          planPayTime: [
            {required: true, message: '请输入计划付款日期', trigger: 'blur'}
          ],
          endTime: [
            {required: true, message: '请输入截止日期', trigger: 'blur'}
          ],
          merchantId: [
            {required: true, message: '请选择供应商', trigger: 'blur'}
          ],
          contractNo: [
            {required: true, message: '请选择合同', trigger: 'blur'}
          ]
        }
      }
    },
    mounted() {
      //this.getMcCtInit()
    },
    methods: {
      // 获取商户ID
      getMerchantInfo(merchantId) {
        if(merchantId != null){
          merchant.getMerchantInfo(merchantId).then(res => {
            this.merchantInfo = res;
            this.form.contractNo = res.contractApprovalNo
          })
        }
      },
      cancle() {
        console.log("取消制做结算单")
        this.dialog = false
        this.$refs['form'].resetFields()
        this.resetForm();
      },
      doSubmit() {
        //从父组件获取的值判断是否为新增
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.submitLoading = true
            add(this.form).then(res => {
              this.$notify({title: '制单成功', type: 'success', duration: 2500})
              this.loading = false;
              //关闭dialog
              this.dialog = false;
              this.submitLoading = false
              this.resetForm()
            }).catch(err => {
              this.loading = false
              this.submitLoading = false
            })
          } else {
            return false
          }
        })
      },
      //选择合同
      contractSelect(value) {
        this.form.contractNo = value
      },
      resetForm() {
        this.form = defaultForm
        this.$emit("refresh")
      },
      handleClose() {
        this.dialog = false;
        this.resetForm();
      }
      /*
      chooseCashierMethod(val){
        console.log("选择收银方式", val, "~~~")
        let lease = this.form.lease
        let index = 0;
        let contracts = [];
        this.contracts.filter(item => {
          if (item.lease === lease && item.centralizedCashier === val){
            console.log("两种方式都相等~~~")
            contracts[index] = item;
            index ++;
          }
        })
        this.contracts = contracts;
      },
      switchLeaseMethod(val){
        console.log("选择是否租赁方式", val, "~~~")
        let centralizedCashier = this.form.centralizedCashier
        let index = 0;
        let contracts = [];
        this.contracts.filter(item => {
          if (item.lease === val && item.centralizedCashier === centralizedCashier){
            console.log("两种方式都相等~~~")
            contracts[index] = item;
            index ++;
          }
        })
        this.contracts = contracts;
      },
       */


    }
  }


</script>

<style lang="scss" scoped>


</style>
