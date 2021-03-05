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
      <el-form-item label="供应商" prop="merchantId" style=" width: 350px;">
        <my-select v-model="form.merchantId" :placeholder="'请选择供应商'" :downdropType="'merchant/merchant-downdrop'"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancle">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>

</template>

<script>
  var form = {
    merchantNo: null,
    merchantId: null,
    endTime: null
  }

  import {add} from '@/api/cost/pay'
  import MySelect from '@/components/MySelect'
  export default {
    components: {MySelect,},
    //接收父组件值
    data() {
      return {
        loading: false,
        dialog: false,
        merchantLoading: false,
        submitLoading: false,
        form: form,
        //规则校验
        rules: {
          endTime: [
            {required: true, message: '请输入截止日期', trigger: 'blur'}
          ],
          merchantId: [
            {required: true, message: '请选择供应商', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      cancle() {
        this.dialog = false
        this.$refs['form'].resetFields()
        this.resetForm();
      },
      doSubmit() {
        //从父组件获取的值判断是否为新增
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.submitLoading = true;
            add(this.form).then(res => {
              this.$notify({
                title: '制单成功',
                type: 'success',
                duration: 2500
              })
              this.loading = false;
              //关闭dialog
              this.dialog = false;
              this.submitLoading = false;
              this.resetForm()
              this.$parent.init()
            }).catch(err => {
              this.loading = false
              this.submitLoading = false;
            })
          } else {
            return false
          }
        })
      },
      resetForm() {
        this.form = form
        this.$emit("refresh")
      },
      handleClose() {
        this.dialog = false;
        this.resetForm();
      },
    }
  }


</script>

<style lang="scss" scoped>


</style>
