<template>
  <!-- 对账 -->
  <el-dialog :title="'付款单付款确认'" :visible.sync="dialog" width="768px" :before-close="handleClose">
    <el-form ref="form" :model="form" size="small" label-width="140px">

      <el-row>
        <el-col :span="12">
          应付金额:{{cInfo.obj.payAmount}}
        </el-col>
        <el-col :span="12">
          余额: {{cInfo.obj.preInto}}
        </el-col>
      </el-row>
      <div>
        <span>当期付款金额：</span>
        <el-input v-model="form.payAmount" type="number" placeholder="请输入付款金额"></el-input>
      </div>
      <div style="height: 22px;display: block"></div>
      <el-input
        type="textarea"
        :rows="10"
        :placeholder="'付款备注'"
        v-model="form.remark"
        style="width: 662px; height: 185px"
      >
      </el-input>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancle">取消</el-button>
      <el-button type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>


</template>

<script>
  import {checkA, getDetail} from '@/api/cost/pay'

  const defaultform = {
    ids: [],
    remark: '',
    checkStatus: 1,
    payAmount: null
  }

  export default {
    components: {},
    //接收父组件值
    props: {
      payId: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        loading: false,
        dialog: false,
        placeholder: '',
        title: '',
        form: defaultform,
        data: {}
      }
    },
    methods: {
      getData() {
        getDetail(this.payId).then(res => {
          this.data = res
        })
      },
      cancle() {
        this.dialog = false
        this.resetForm()
      },
      doSubmit() {
        this.form.ids = this.cInfo.ids;
        this.form.status = this.cInfo.status
        //从父组件获取的值判断是否为新增
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.loading = true
            checkA(this.form).then(res => {
              this.$notify({title: '操作成功', type: 'success', duration: 2500})
              this.loading = false;
              //关闭dialog
              this.dialog = false;
              this.resetForm()
            }).catch(err => {
              this.loading = false
            })
          } else {
            return false
          }
        })
      },
      resetForm() {
        this.form = defaultform
      },
      handleClose() {
        this.dialog = false;
        this.resetForm();
      }
    }
  }


</script>

<style lang="scss" scoped>


</style>
