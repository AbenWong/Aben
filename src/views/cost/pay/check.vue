<template>
  <!-- 对账 -->
  <el-dialog :title="cInfo.title" :visible.sync="dialog" width="768px" :before-close="handleClose">
    <el-form ref="form" :model="form" size="small" label-width="140px">
      <el-form-item label="对账结果:" prop="checkStatus" style=" width: 350px;">
        <!-- 付款状态 -->
        <el-radio-group v-model="form.status">
          <el-radio :label="1">成功</el-radio>
          <el-radio :label="2">异常</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="对账备注:" style=" width: 350px;">
        <el-input type="textarea" :rows="10" :placeholder="cInfo.placeholder" v-model="form.remark"
                  style="width: 400px; height: 185px">
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancle">取消</el-button>
      <el-button type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>


</template>

<script>
  var form = {
    items: [],
    remark: '',
    status: 1
  };
  import {checkA} from '@/api/cost/pay'

  export default {
    components: {},
    //接收父组件值
    props: {
      cInfo: {
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
        form: form,
      }
    },
    methods: {
      cancle() {
        this.resetForm()
      },
      doSubmit() {
        for (var i = 0; i < this.cInfo.nos.length; i++) {
          this.form.items[i] = this.cInfo.nos[i];
        }
        console.log("请求参数：\n", this.form)
        //从父组件获取的值判断是否为新增
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.loading = true
            checkA(this.form).then(res => {
              this.$notify({title: '操作成功', type: 'success', duration: 2500})
              this.resetForm()
            }).catch(err => {
              this.resetForm()
            })
          } else {
            return false
          }
        })
      },
      resetForm() {
        this.loading = false;
        this.dialog = false;
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
