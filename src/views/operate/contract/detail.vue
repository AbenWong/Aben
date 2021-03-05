<template>
  <!-- 详情 -->
  <el-drawer
    title="我是标题"
    :direction="'rtl'"
    :visible.sync="dialogVisible"
    :withHeader="false"
    :destroy-on-close="true"
    @opened="openDialog"
    v-loading="loading"
    :size="'50%'">
    <div id="wrap">
      <!-- 详情 -->
      <div id="d-header-id" class="d-header">
        <!-- 详情主体 -->
      <div id="d-content-id" class="content-wrap">
        <el-form id="content-pane" :loading="loading" class="content-pane">
          <div id="content">
            <div class="header-choose">
              <el-row>
                <el-col :span="6">
                  变更类型
                </el-col>
                <el-col :span="17">
                  <el-radio-group disabled v-model="form.signType">
                    <el-radio :label="1">原供应商</el-radio>
                    <el-radio :label="2">新供应商</el-radio>
                    <el-radio :label="3">内容更新</el-radio>
                  </el-radio-group>
                </el-col>
                <el-col :span="1" style="line-height: 40px; align-items: center">
                  <el-link :underline="false" @click="closeDialog">X</el-link>
                </el-col>
              </el-row>
            </div>
            <div id="header">
              <!--
              <el-row class="hwrap">
                <h3>隐藏未修改</h3>
              </el-row>
              -->
              <el-row>
                <el-col :span="6">属性</el-col>
                <el-col :span="9">原值</el-col>
                <el-col :span="9">新值</el-col>
              </el-row>
            </div>
            <div id="basic">
              <el-row class="hwrap">
                <h3>基本信息</h3>
              </el-row>
              <el-row>
                <el-col :span="6">签订机构</el-col>
                <el-col :span="9">
                  <span>{{ originalForm.signDepartmentName }}</span>
                </el-col>
                <el-col :span="9">
                  <span>{{ form.signDepartmentName }}</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">签订品类</el-col>
                <el-col :span="9">
                  <span>{{ originalForm.signCategoryName }}</span>
                </el-col>
                <el-col :span="9">
                  <span>{{ form.signCategoryName }}</span>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="6">品牌</el-col>
                <el-col :span="9">
                  <span>{{ originalForm.signBrandName }}</span>
                </el-col>
                <el-col :span="9">
                  <span>{{ form.signBrandName }}</span>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="6">合同状态</el-col>
                <el-col :span="9">
                  <span>{{dict.label.contract_status[originalForm.contractStatus]}}</span>
                </el-col>
                <el-col :span="9">
                  <span>{{dict.label.contract_status[form.contractStatus]}}</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">合同起始日期</el-col>
                <el-col :span="9">
                  <span>{{ parseTime(originalForm.contractStarttime,"{y}年{m}月{d}日") }}</span>
                </el-col>
                <el-col :span="9">
                  <span>{{ parseTime(form.contractStarttime,"{y}年{m}月{d}日") }}</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">合同结束日期</el-col>
                <el-col :span="9">
                  <span>{{ parseTime(originalForm.contractEndtime,"{y}年{m}月{d}日")}} </span>
                </el-col><el-col :span="9">
                  <span>{{ parseTime(form.contractEndtime,"{y}年{m}月{d}日")}} </span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">合同签订日期</el-col>
                <el-col :span="9">
                  <span>{{ parseTime(originalForm.contractSigntime,"{y}年{m}月{d}日") }}</span>
                </el-col>
                <el-col :span="9">
                  <span>{{ parseTime(form.contractSigntime,"{y}年{m}月{d}日") }}</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">采购负责人</el-col>
                <el-col :span="9">
                  <span>{{ originalForm.purchaseDirectorName }}</span>
                </el-col><el-col :span="9">
                  <span>{{ form.purchaseDirectorName }}</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">到期处理方法</el-col>
                <el-col :span="9">
                  <span>{{ dict.label.expire_handle_type[originalForm.expireHandleType] }}</span>
                </el-col>
                <el-col :span="9">
                  <span>{{ dict.label.expire_handle_type[form.expireHandleType] }}</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">合同类型</el-col>
                <el-col :span="9">
                  <span>{{dict.label.contract_type[originalForm.contractType]}}</span>
                </el-col>
                <el-col :span="9">
                  <span>{{dict.label.contract_type[form.contractType]}}</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">合同描述</el-col>
                <el-col :span="9">
                  <span>{{ originalForm.description }}</span>
                </el-col>
                <el-col :span="9">
                  <span>{{ form.description }}</span>
                </el-col>
              </el-row>
            </div>
            <div id="settlement">
              <el-row class="hwrap">
                <h3>结算相关</h3>
              </el-row>
              <el-row>
                <el-col :span="6">结算方式</el-col>
                <el-col :span="9">
                  <span>{{dict.label.settle_type[originalForm.settleType]}}</span><span v-if="originalForm.settleType==2">&#160;&#160;{{originalForm.settleRate}}</span>
                </el-col>
                <el-col :span="9">
                  <span>{{dict.label.settle_type[form.settleType]}}</span><span v-if="form.settleType==2">&#160;&#160;{{form.settleRate}}</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">结算状态</el-col>
                <el-col :span="9">
                  <span>{{dict.label.settle_status[originalForm.settleStatus]}}</span>
                </el-col>
                <el-col :span="9">
                  <span>{{dict.label.settle_status[form.settleStatus]}}</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">结算周期类型</el-col>
                <el-col :span="9">
                  <span>{{dict.label.settle_cycle_type[originalForm.settleCycleType]}}</span>
                </el-col>
                <el-col :span="9">
                  <span>{{dict.label.settle_cycle_type[form.settleCycleType]}}</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">结算周期</el-col>
                <el-col :span="9">
                  <span>{{ originalForm.settleInCycleTime }}</span>
                </el-col>
                <el-col :span="9">
                  <span>{{ form.settleInCycleTime }}</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">铺底金额</el-col>
                <el-col :span="9">
                  <span>{{ originalForm.shopAmount }}</span>
                </el-col>
                <el-col :span="9">
                  <span>{{ form.shopAmount }}</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">合同税率</el-col>
                <el-col :span="9">
                  <span>{{dict.label.income_tax_rate[originalForm.taxRate]}}%</span>
                </el-col>
                <el-col :span="9">
                  <span>{{dict.label.income_tax_rate[form.taxRate]}}%</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="6">备注</el-col>
                <el-col :span="9">
                  <span>{{ originalForm.remark }}</span>
                </el-col>
                <el-col :span="9">
                  <span>{{ form.remark }}</span>
                </el-col>
              </el-row>

            </div>
          </div>
        </el-form>

      </div></div></div>
  </el-drawer>
</template>

<script>
import {parseTime} from "@/utils";
import crudContract from '@/api/operate/contract'
import MySelect from '@/components/MySelect/index'
import Cascader from '@/components/Cascader'
const defaultForm = {
  contractId: null,
  merchantId: null,
  contractApprovalNo: null,
  originalContractApprovalNo: null,
  signType: null,
  signDepartmentId: null,
  signDepartmentName: null,
  signCategoryId: [],
  signCategoryName: null,
  signBrandId: null,
  signBrandName: null,
  contractStatus: null,
  contractStarttime: null,
  contractEndtime: null,
  contractSigntime: null,
  purchaseDirectorId: null,
  purchaseDirectorName: null,
  expireHandleType: null,
  contractType: null,
  description: null,
  settleStatus: null,
  settleCycleType: null,
  settleInCycleTime: null,
  shopAmount: null,
  taxRate: null,
  remark: null,
  approvalId: null,
  approvalUrl: null,
  approvalStatus: null,
  createTime: null,
  createBy: null,
  updateTime: null,
  updateBy: null,
  isDel: null,
  merchantName: null,
  contractNo: null,
  merchantCode: null,
  merchantType: null,
  settleType: null,
  settleRate: 0,
}
const originalDefaultForm = {
  contractId: null,
  merchantId: null,
  contractApprovalNo: null,
  originalContractApprovalNo: null,
  signType: null,
  signDepartmentId: null,
  signDepartmentName: null,
  signCategoryId: [],
  signCategoryName: null,
  signBrandId: null,
  signBrandName: null,
  contractStatus: null,
  contractStarttime: null,
  contractEndtime: null,
  contractSigntime: null,
  purchaseDirectorId: null,
  purchaseDirectorName: null,
  expireHandleType: null,
  contractType: null,
  description: null,
  settleStatus: null,
  settleCycleType: null,
  settleInCycleTime: null,
  shopAmount: null,
  taxRate: null,
  remark: null,
  approvalId: null,
  approvalUrl: null,
  approvalStatus: null,
  createTime: null,
  createBy: null,
  updateTime: null,
  updateBy: null,
  isDel: null,
  merchantName: null,
  contractNo: null,
  merchantCode: null,
  merchantType: null,
  settleType: null,
  settleRate: 0
}
export default {
    components: { Cascader, MySelect, crudContract },
  dicts: ['contract_type', 'expire_handle_type', 'settle_cycle_type', 'settle_status', 'contract_status', 'contract_change_type', 'income_tax_rate','settle_type'],
  props: {
      contractId: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        attractMerchantNo: '',
        dicts: ['branch_type'],
        permission: {
          add: ['admin', 'contract:add'],
          edit: ['admin', 'contract:edit'],
          del: ['admin', 'contract:del']
        },
        oldSupplier: null,
        newSupplier: null,
        updateContent: null,
        depts: [{
          label: '顺盈',
          value: 1
        }],
        options: [{
          label: '顺盈',
          value: 1
        }, {
          label: '顺盈2',
          value: 2
        }],
        form: defaultForm,
        originalForm: originalDefaultForm,
        approvalStatus: null,
        userList: [],
        syncLoading: true,
        disabled: true,
        dialogVisible: false,
        loading: false,
        approveLoading: false
      }
    },
    created() {

    },
    watch:{

    },
    computed: {
    },
    methods: {
      parseTime,
      getSignBrandName(val) {
        this.form.signBrandName = val
      },
      purchaseDirectorLabel(val) {
        this.form.purchaseDirectorName = val
      },
      signDepartmentDrug(id) {
        this.depts.find((item) => {
          if (item.value === id) {
            this.form.signDepartmentName = item.label
          }
        })
      },
      signCategoryDrug(id) {
        this.options.find((item) => {
          if (item.value === id) {
            this.form.signCategoryName = item.label
          }
        })
      },
      signBrandDrug(id) {
        this.options.find((item) => {
          if (item.value === id) {
            this.form.signBrandName = item.label
          }
        })
      },
      // 监听商品类别变化
      categoryChange(value) {
        console.log(value)
        this.form.signCategoryName = value
      },
      openDialog() {
        crudContract.getContractByContractId(this.contractId).then(res => {
          if(res.signCategoryId!=null && res.signCategoryId[0]!=null){res.signCategoryId= res.signCategoryId.split(',')}else {res.signCategoryId=[]}
          this.form = res
          this.loading = false
          crudContract.getByContractApprovalNo(this.form.originalContractApprovalNo).then(result => {
            if (result.signCategoryId != null && result.signCategoryId[0] != null) {
              result.signCategoryId = result.signCategoryId.split(',').map(Number)
            } else {
              result.signCategoryId = []
            }
            this.originalForm = result
          })
        }).catch(ex => {
            console.log(ex)
            this.loading = false
            this.dialogVisible = false
          })
          return true
      },
      //关闭dialog
      closeDialog(done) {
        this.dialogVisible = false
        this.form = defaultForm
        this.attractMerchantNo= ''
        this.approvalStatus=null
      }
    }
  }



</script>

<style lang="scss" >
  /* 注意：不能在scope中 */
  /*1.显示滚动条：当内容超出容器的时候，可以拖动：*/
  //抽屉从右往左开
  .el-drawer{
    overflow: scroll;
  }//使得drawer可以滚动
  .el-drawer__container ::-webkit-scrollbar{
    display: none;
  }//隐藏滚动条，在谷歌浏览器上是ok的
  /* 兼容火狐 */
  *{
    scrollbar-width: none;
  }
  @media print {
    #app {
      display: none;
    }
    .el-dialog,
    .el-dialog__wrapper,
    .el-message,
    .v-modal {
      display: none !important;
    }
  }
  @page{
    size: auto A4 landscape;
    margin: 8.5mm 6mm 6.5mm 6mm;
  }
  .line-black{
    width: 100%;
    height: 1px;
    border-top: solid #BBBBBB 3px;
  }

  .content-wrap{
    margin: 15px 15px 0px 10px;
  }

  .d-header{
    background-color: #F5F5F5;
  }
  /** 设置el-row */
  .d-content>.el-row{
    margin-left: 20px;
    margin-top: 15px
  }

  .el-row{
    line-height: 33px;
  }

  .base-wrap{
    line-height: 33px;
    margin: 10px 5px 0px 15px;
  }

  .invoice-wrap{
    border: solid #BBBBBB 3px;
    padding: 10px 30px 10px 30px;
    margin-top: 10px;
    .el-col{
      height: 28px;
      line-height: 28px;
    }
    .look-up{
      font-weight: bold;
    }
  }

  .record{
    margin: 15px 15px 3px 15px;
  }

  .nav{
    font-weight: bold;
  }
  .content-pane {
    padding: 10px 30px 80px 30px;
    .el-col {
      height: 40px;
      line-height: 40px;
      border: solid #1f2d3d 2px;
      text-align: center;
      /** 解决边框合并问题 */
      margin-right: -2px;
      margin-bottom: -2px;
    }
    .el-input, .el-date-picker, .el-select {
      width: 250px;
      float: left;
      margin-left: 20px;
    }
  }
</style>
