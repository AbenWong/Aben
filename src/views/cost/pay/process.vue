<template>
  <!-- 流程发起 -->
  <el-dialog :title="pInfo.title" :visible.sync="dialog" width="768px" :before-close="handleClose">
    <el-form ref="form" :model="form" size="small" label-width="140px">
      <el-form-item label="备注信息:" style=" width: 350px;">
      <el-input type="textarea" :rows="10" :placeholder="pInfo.placeholder" v-model="form.remark"
                style="width: 400px; height: 185px"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancle">取消</el-button>
      <el-button type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>


</template>

<script>
  import {batchApproval, batchinvalid} from '@/api/cost/pay'

  var form = {
    items: [],
    remark: '',
    status: null
  };
  export default {
    //接收父组件值
    props: {
      pInfo: {
        type: Object,
        default() {
          return {}
        }
      }
    },
    data() {
      return {
        loading: false,
        dialog: false,
        placeholder: '',
        title: '',
        form: form
      }
    },
    methods: {
      cancle() {
        this.dialog = false
        this.resetForm()
      },
      doSubmit() {
        this.form.ids = this.pInfo.ids;
        this.form.status = this.pInfo.status
        let status = this.pInfo.status;
        switch (status) {
          case 3:
            this.applyApprove();
            break
          case 7:
            this.invalidApprove();
            break
          default:
            break;
        }
      },
      // 批量审批
      applyApprove() {
        for (var i = 0; i < this.pInfo.nos.length; i++) {
          this.form.items[i] = this.pInfo.nos[i];
        }
        console.log("请求参数：\n", this.form)
        //从父组件获取的值判断是否为新增
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.submitLoading = true
            batchApproval(this.form).then(res => {
              this.$notify({title: '操作成功', type: 'success', duration: 2500})
              this.loading = false;
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
      // 作废支付单
      invalidApprove() {
        for (var i = 0; i < this.pInfo.nos.length; i++) {
          this.form.items[i] = this.pInfo.nos[i];
        }
        console.log("请求参数：\n", this.form)
        //从父组件获取的值判断是否为新增
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.loading = true
            this.submitLoading = true
            batchinvalid(this.form).then(res => {
              this.$notify({title: '操作成功', type: 'success', duration: 2500})
              this.loading = false;
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
      resetForm() {
        this.form = form;
        this.$emit("refresh")
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
