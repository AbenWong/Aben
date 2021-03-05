<template>
  <!-- 制单 -->
  <el-dialog append-to-body
             :close-on-click-modal="false"
             :visible.sync="dialog"
             width="768px"
             :before-close="handleClose">
    <el-form ref="form"  :inline="true"  :model="form" :rules="rules" size="small" label-width="100px">
      <el-form-item label="截止日期"   prop="endTime" style=" width: 350px;">
        <el-date-picker
          style=" width: 220px;"
          v-model="form.endTime"
          type="date"
          value-format="yyyy-MM-dd 00:00:00"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="供应商" prop="merchantNo" style=" width: 350px;" >
        <el-select  :value="form.merchantNo" filterable clearable  style=" width: 220px;" placeholder="请先选择供应商" @change="merchantSelect" :loading="merchantLoading">
          <el-option
            v-for="(item, index) in merchants"
            :key="index"
            :label="item.name"
            :value="item.no">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="合同" prop="contractNo" style=" width: 350px;">
        <el-select  :value="form.contractNo" style=" width: 220px;" placeholder="请选择合同" @change="contractSelect">
          <el-option
            v-for="(item, index) in contracts"
            :key="index"
            :label="item.name"
            :value="item.no">
          </el-option>
        </el-select>
      </el-form-item>
      <br />
      <el-form-item label="租赁" style=" width: 350px;">
        <!-- active-value:switch打开的值  inactive-value:switch 关闭时的值 -->
        <el-switch v-model="form.lease" active-value="1" inactive-value="0" @change="switchLeaseMethod"></el-switch>
      </el-form-item>
      <el-form-item label="集中收银" style=" width: 350px;">
        <el-radio-group v-model="form.centralizedCashier" size="mini" @change="chooseCashierMethod">
          <el-radio label="1">真</el-radio>
          <el-radio label="0">假</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancle">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>

</template>

<script>
//引入settlement api
import {add, selectList} from '@/api/cost/settlement'
import checkPermission from '@/utils/permission'

/**
 * 结算列表 sort依据create_time
 * 将settlement定义的请求方法，交由crud这个对象管理
 */
const mcCt = [{}]
export default {
  components: { },
  //接收父组件值
  data() {
    return {
      loading: false,
      dialog: false,
      merchantLoading: false,
      submitLoading: false,
      form: {
        merchantNo: '',
        contractNo: '',
        endTime: '',
        lease: '0',
        centralizedCashier: '1'
      },
      mcCt: [],
      merchants: [{
        no: 'A13829382323',
        name: '供应商一'
      },{
        no: 'A13829382ds3',
        name: '供应商二'
      },{
        no: 'A138293823fsd3',
        name: '供应商三'
      },{
        no: 'A13875643423',
        name: '供应商四'
      }],
      contracts: [{
        lease: '1',
        centralizedCashier: '0'
      },{
        lease: '0',
        centralizedCashier: '1'
      }],
      //规则校验
      rules: {
        endTime: [
          { required: true, message: '请输入截止日期', trigger: 'blur' }
        ],
        merchantNo: [
          { required: true, message: '请选择供应商', trigger: 'blur' }
        ],
        contractNo: [
          { required: true, message: '请选择合同', trigger: 'blur' }
        ]
      }

    }
  },
  created() {

  },
  mounted: {

  },
  watch:{
    // 'form.lease'(newVal, oldVal){
    //   console.log('lease由', oldVal, '变为', newVal)
    // },
    // 'form.centralizedCashier'(newVal, oldVal){
    //   console.log('centralizedCashier由', oldVal, '变为', newVal)
    // },
    'form.contractNo'(newVal, oldVal){
      console.log('contractNo由', oldVal, '变为', newVal)
      //无论是从供应商还好还是合同获取lease和centerCashier
      this.contracts.filter(item => {
          this.form.lease = item.lease
          this.form.centralizedCashier = item.centralizedCashier
      })
    },
  },
  computed:{

  },
  methods: {
    getMcCt(){
      selectList().then(res => {
        console.log(res)
      }).catch(ex => {
        console.log(ex)
      })
    },
    cancle() {
      console.log("取消制做结算单")
      this.dialog = false
      this.$refs['form'].resetFields()
      this.resetForm();
    },
    doSubmit(){
      //从父组件获取的值判断是否为新增
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.submitLoading = true
          add(this.form).then(res => {
            this.$notify({
              title: '制单成功',
              type: 'success',
              duration: 2500
            })
            this.loading = false;
            //关闭dialog
            this.dialog = false;
            this.submitLoading = false
            this.resetForm()
            console.log(this.$parent)
            this.$parent.init()
          }).catch(err => {
            this.loading = false
            this.submitLoading = false
            console.log(err.response.data.message)
          })
        } else {
          return false
        }
      })
    },
    //选择合同
    contractSelect(value){
      this.form.contractNo = value
      console.log("选择了合同:", this.form.contractNo)
      let index = 0
      let merchants = []
      this.merchants.filter(item => {
        let attractMerchantNo = item.attractMerchantNo
        if (attractMerchantNo === value){
          merchants[index] = item
        }
      })

      this.merchants = merchants
    },
    merchantSelect(value){
      this.form.merchantNo = value
      console.log("选择了供应商：",  this.form.merchantNo)
      this.contractLoading = true
      for (let i = 0; i < 4; i++) {
        let contract = {
          no: `编号2020493403${i}`,
          name: `名称${value}合同${i}`,
          lease: '0',
          centralizedCashier: '1'
        }
        this.contracts[i] = contract
      }
      this.contractLoading = false;
      this.form.contractNo = '';
    },
    resetForm(){
      this.form = {
        merchantNo: '',
        contractNo: '',
        endTime: '',
        lease: '1',
        centralizedCashier: '1'
      }
    },
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
    handleClose(){
      this.dialog = false;
      this.resetForm();
    }


  }
}



</script>

<style lang="scss"  scoped>


</style>
