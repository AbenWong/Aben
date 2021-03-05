<template>
  <!-- 流程发起 -->
  <el-dialog :title="pInfo.title" :visible.sync="dialog" width="768px" :before-close="handleClose">
    <el-form ref="form" :model="form" size="small" label-width="140px">
      <el-input
        type="textarea"
        :rows="10"
        :placeholder="pInfo.placeholder"
        v-model="form.remark"
        style="width: 662px; height: 185px"
      >
      </el-input>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancle">取消</el-button>
      <el-button type="primary" :loading="submitLoading" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit, del, applyApprove, invalidApprove } from '@/api/cost/settlement'

/**
 * 结算列表 sort依据create_time
 * 将settlement定义的请求方法，交由crud这个对象管理
 */

export default {
  components: { },
  //接收父组件值
  props: {
    pInfo: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data() {
    return {
      loading: false,
      dialog: false,
      submitLoading: false,
      placeholder: '',
      title: '',
      form: {
        remark: '',
      },
      approvesForm: {
        items: [],
        remark: ''
      },
      invalidsForm: {
        items: [],
        remark: ''
      }
    }
  },
  created() {

  },
  watch:{

  },
  computed:{

  },
  methods: {
    cancle() {
      console.log("取消制做结算单")
      this.dialog = false
      this.loading = false
      this.resetForm()
    },
    doSubmit(){
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
    resetForm(){
      this.approvesForm = {
        items: [],
        remark: ''
      };
      this.invalidsForm = {
        items: [],
        remark: ''
      };
      this.pInfo.nos = []
      this.form.remark = ''
    },
    handleClose(){
      this.dialog = false;
      this.resetForm();
    },
    applyApprove(){
      console.log("批量发起审批")
      console.log(this.pInfo)
      for (let i = 0; i < this.pInfo.nos.length; i++) {
        let no = this.pInfo.nos[i];
        console.log("审批结算单号：", no)
        this.approvesForm.items[i] = {
          no: no,
          attachBase64: "base^4编码"
        }
      }
      this.approvesForm.remark= this.form.remark
      console.log("请求参数：\n", this.approvesForm)
      //从父组件获取的值判断是否为新增
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.submitLoading = true
          applyApprove(this.approvesForm).then(res => {
            this.$notify({
              title: '操作成功',
              type: 'success',
              duration: 2500
            })
            this.loading = false;
            //关闭dialog
            this.dialog = false;
            this.submitLoading = false
            this.resetForm()
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
    invalidApprove(){
        console.log("批量作废单号")
        for (let i = 0; i < this.pInfo.nos.length; i++) {
          let no = this.pInfo.nos[i];
          console.log("作废结算单号：", no)
          this.invalidsForm.items[i] = no;
        }

      console.log("请求参数：\n", this.invalidsForm)
      //从父组件获取的值判断是否为新增
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          this.submitLoading = true
          invalidApprove(this.invalidsForm).then(res => {
            this.$notify({
              title: '操作成功',
              type: 'success',
              duration: 2500
            })
            this.loading = false;
            //关闭dialog
            this.dialog = false;
            this.submitLoading = false
            this.resetForm()
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
  }
}



</script>

<style lang="scss"  scoped>


</style>
