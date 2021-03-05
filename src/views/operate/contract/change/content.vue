<template>
  <el-form id="content-pane" :rules="rules" :loading="loading" class="content-pane">
    <div id="content">
      <div class="header-choose">
        <el-row>
          <el-col :span="6">
            变更类型
          </el-col>
          <el-col :span="18">
            <el-radio-group disabled v-model="form.signType">
              <el-radio :label="'1'">原供应商</el-radio>
              <el-radio :label="'2'">新供应商</el-radio>
              <el-radio :label="'3'">内容更新</el-radio>
            </el-radio-group>
          </el-col>
        </el-row>
      </div>
      <div id="header">
        <!--
        <el-row class="hwrap">
          <el-checkbox>隐藏未修改</el-checkbox>
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
          <el-checkbox>基本信息</el-checkbox>
        </el-row>
        <el-row>
          <el-col :span="6">签订机构</el-col>
          <el-col :span="9">
            <span>{{ originalForm.signDepartmentName }}</span>
          </el-col>
          <el-col :span="9">
            <dept-select :value="form.signDepartmentId" @valueChange="signDepartmentDrug($event)" @handleChange="signDepartmentDrugValue($event)"/>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">签订品类</el-col>
          <el-col :span="9">
            <span>{{ originalForm.signCategoryName }}</span>
          </el-col>
          <el-col :span="9">
            <cascader :value="form.signCategoryId" @valueChange="categoryChange($event)" @handleChange="categoryChangeValue($event)"></cascader>
<!--            <cascader :value="form.signCategoryId" @handleChange="categoryChange($event)"></cascader>-->
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">品牌</el-col>
          <el-col :span="9">
            <!-- v-for -->
            <span>{{ originalForm.signBrandName }}</span>
          </el-col>
          <el-col :span="9">
            <my-select v-model="form.signBrandId" :defaultValue="defaultValue" :placeholder="'请选择品牌'"
                       :downdropType="'goodsBrand/brand-downdrop'" @selectLabel="getSignBrandName"/>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">合同状态</el-col>
          <el-col :span="9">
            <span>{{dict.label.contract_status[originalForm.contractStatus]}}</span>
          </el-col>
          <el-col :span="9">
            <el-select v-model="form.contractStatus" placeholder="请选择">
              <el-option
                v-for="item in dict.contract_status"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">合同起始日期</el-col>
          <el-col :span="9">
            <span>{{ parseTime(originalForm.contractStarttime,"{y}年{m}月{d}日") }}</span>
          </el-col>
          <el-col :span="9">
            <el-date-picker
              v-model="form.contractStarttime"
              type="date" format="yyyy 年 MM 月 dd 日"
              placeholder="选择日期">
            </el-date-picker>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">合同结束日期</el-col>
          <el-col :span="9">
            <span>{{ parseTime(originalForm.contractEndtime,"{y}年{m}月{d}日")}} </span>
          </el-col>
          <el-col :span="9">
            <el-date-picker
              v-model="form.contractEndtime"
              type="date" format="yyyy 年 MM 月 dd 日"
              placeholder="选择日期">
            </el-date-picker>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">合同签订日期</el-col>
          <el-col :span="9">
            <span>{{ parseTime(originalForm.contractSigntime,"{y}年{m}月{d}日") }}</span>
          </el-col>
          <el-col :span="9">
            <el-date-picker
              v-model="form.contractSigntime"
              type="date" format="yyyy 年 MM 月 dd 日"
              placeholder="选择日期">
            </el-date-picker>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">采购负责人</el-col>
          <el-col :span="9">
            <span>{{ originalForm.purchaseDirectorName }}</span>
          </el-col>
          <el-col :span="9">
            <my-select v-model="form.purchaseDirectorId" :defaultValue="defaultValue" :placeholder="'请选择采购负责人'"
                       :downdropType="'users/user-downdrop'"
                       @selectLabel="purchaseDirectorLabel"></my-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">到期处理方法</el-col>
          <el-col :span="9">
            <span>{{ dict.label.expire_handle_type[originalForm.expireHandleType] }}</span>
          </el-col>
          <el-col :span="9">
            <el-select v-model="form.expireHandleType" placeholder="请选择">
              <el-option
                v-for="item in dict.expire_handle_type"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">合同类型</el-col>
          <el-col :span="9">
            <span>{{dict.label.contract_type[originalForm.contractType]}}</span>
          </el-col>
          <el-col :span="9">
            <el-select v-model="form.contractType" placeholder="请选择">
              <el-option
                v-for="item in dict.contract_type"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">合同描述</el-col>
          <el-col :span="9">
            <span>{{ originalForm.description }}</span>
          </el-col>
          <el-col :span="9">
            <el-input v-model="form.description" placeholder="请输入内容"></el-input>
          </el-col>
        </el-row>
      </div>
      <div id="settlement">
        <el-row class="hwrap">
          <el-checkbox>结算相关</el-checkbox>
        </el-row>
        <el-row>
          <el-col :span="6">结算方式</el-col>
          <el-col :span="9">
            <span>{{dict.label.settle_type[originalForm.settleType]}}</span><span v-if="originalForm.settleType==2">&#160;&#160;{{originalForm.settleRate}} %</span>
          </el-col>
          <el-col :span="form.settleType == 2?5:9">
            <el-select v-model="form.settleType" style="width: 50%" placeholder="请选择">
              <el-option
                v-for="item in dict.settle_type"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col v-if="form.settleType == 2" :span="4">
            <el-input style="width: 70%;" type="number" v-model="form.settleRate" placeholder="请输入扣率"
                      :change="check_price()">
              <template slot="append"> %</template>
            </el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">结算状态</el-col>
          <el-col :span="9">
            <span>{{dict.label.settle_status[originalForm.settleStatus]}}</span>
          </el-col>
          <el-col :span="9">
            <el-select v-model="form.settleStatus" placeholder="请选择">
              <el-option
                v-for="item in dict.settle_status"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">结算周期类型</el-col>
          <el-col :span="9">
            <span>{{dict.label.settle_cycle_type[originalForm.settleCycleType]}}</span>
          </el-col>
          <el-col :span="9">
            <el-select v-model="form.settleCycleType" placeholder="请选择">
              <el-option
                v-for="item in dict.settle_cycle_type"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">结算周期</el-col>
          <el-col :span="9">
            <span>{{ originalForm.settleInCycleTime }}</span>
          </el-col>
          <el-col :span="9">
            <el-input type="number" :min="1" v-model="form.settleInCycleTime" placeholder="请输入内容"></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">铺底金额</el-col>
          <el-col :span="9">
            <span>{{ originalForm.shopAmount }}</span>
          </el-col>
          <el-col :span="9">
            <el-input type="number" :min="0" v-model="form.shopAmount" placeholder="请输入内容"></el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">合同税率</el-col>
          <el-col :span="9">
            <span>{{dict.label.income_tax_rate[originalForm.taxRate]}}%</span>
          </el-col>
          <el-col :span="9">
            <el-select v-model="form.taxRate" placeholder="请选择">
              <el-option
                v-for="item in dict.income_tax_rate"
                :key="item.value"
                :label="item.label+'%'"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">备注</el-col>
          <el-col :span="9">
            <span>{{ originalForm.remark }}</span>
          </el-col>
          <el-col :span="9">
            <el-input v-model="form.remark" placeholder="请输入内容"></el-input>
          </el-col>
        </el-row>

      </div>
      <div class="footer-wrap" style="margin-top:20px;">
        <el-button style="float: right; margin-right: 2px" type="primary" @click="submitChC">提交</el-button>
      </div>
    </div>
  </el-form>
</template>

<script>
  import crudContract from '@/api/operate/contract'
  import CRUD from '@crud/crud'
  import MaterialList from "@/components/material";
  import MySelect from '@/components/MySelect/index'
  import Cascader from '@/components/Cascader'
  import {parseTime} from '@/utils/index'
  import DeptSelect from '@/components/Cascader/DeptSelect'
  // crud交由presenter持有
  const defaultCrud = CRUD({
    title: '合同变更',
    url: 'api/contract',
    sort: 'contract_id,desc',
    crudMethod: {...crudContract}
  })
  const defaultForm = {
    contractId: null,
    merchantId: null,
    contractApprovalNo: null,
    originalContractApprovalNo: null,
    signType: null,
    signDepartmentId: null,
    signDepartmentName: null,
    signCategoryId: null,
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
    signCategoryId: null,
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
    name: 'ContractChange',
    components: {Cascader, MySelect, crudContract, MaterialList, DeptSelect},
    dicts: ['contract_type', 'expire_handle_type', 'settle_cycle_type', 'settle_status', 'contract_status', 'contract_change_type', 'income_tax_rate', 'settle_type'],
    data() {
      return {
        dicts: ['branch_type'],
        permission: {
          add: ['admin', 'contract:add'],
          edit: ['admin', 'contract:edit'],
          del: ['admin', 'contract:del']
        },
        loading: false,
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
        rules: {
          signDepartmentName: [{required: true, message: '请选择签订机构', trigger: 'blur'}],
          signCategoryName: [{required: true, message: '请选择签订品类', trigger: 'blur'}],
          signCategoryId: [{required: true, message: '请至少选择一个品牌厅', trigger: 'blur'}],
          contractStatus: [{required: true, message: '请选择合同状态', trigger: 'blur'}],
          contractStarttime: [{required: true, message: '请选择合同起始日期', trigger: 'blur'}],
          contractEndtime: [{required: true, message: '请选择合同结束日期', trigger: 'blur'}],
          contractSigntime: [{required: true, message: '请选择合同签订日期', trigger: 'blur'}],
          expireHandleType: [{required: true, message: '请选择签订机构', trigger: 'blur'}],
          contractType: [{required: true, message: '请选择签订机构', trigger: 'blur'}],
          description: [{required: true, message: '请选择签订机构', trigger: 'blur'}],
          settleStatus: [{required: true, message: '请选择签订机构', trigger: 'blur'}],
          settleCycleType: [{required: true, message: '请选择签订机构', trigger: 'blur'}],
          settleInCycleTime: [{required: true, message: '请选择签订机构', trigger: 'blur'}],
          shopAmount: [{required: true, message: '请选择签订机构', trigger: 'blur'}],
          taxRate: [{required: true, message: '请选择签订机构', trigger: 'blur'}],
          remark: [{required: true, message: '请选择签订机构', trigger: 'blur'}]
        },
        approvalStatus: null,
        userList: [],
        defaultValue: ''
      }
    },
    mounted() {
      var merchantId = this.$route.query.merchantId
      var signType = this.$route.query.signType
      var operation = this.$route.query.operation
      this.operation = operation
      this.form.signType = signType
      if (typeof (merchantId) != 'undefined') {
        this.getContractByMerchantId(merchantId)
      } else {
        this.$message.error("供应商信息不存在")
        this.$back();
      }
    },
    methods: {
      parseTime,
      check_price: function () {
        var price = '' + this.form.settleRate;
        price = price
          .replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
          .replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的
          .replace(/^\./g, '')    //保证第一个为数字而不是.
          .replace('.', '$#$')
          .replace(/\./g, '')
          .replace('$#$', '.')
          .replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); // 只能输入两个小数
        if (price.indexOf('.') < 0 && price != '') {
          // 以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
          price = parseFloat(price);
        }
        this.form.settleRate = price;
      },
      getSignBrandName(val) {
        this.form.signBrandName = val
      },
      purchaseDirectorLabel(val) {
        this.form.purchaseDirectorName = val
      },
      signDepartmentDrug(value) {
        this.form.signDepartmentId = value
      },
      signDepartmentDrugValue(value) {
        this.form.signDepartmentName = value
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
        this.form.signCategoryId = value
      },
      categoryChangeValue(value) {
        this.form.signCategoryName = value
      },
      getContractByMerchantId(merchantId) {
        crudContract.getEditByMerchantId(merchantId).then(res => {
          res.signCategoryId = res.signCategoryId - 0
          res.signDepartmentId = res.signDepartmentId - 0
          this.form = res
          var signType = this.$route.query.signType
          this.form.signType = signType
          this.defaultValue = '1' // 设置自定义组件默认值标记
          if(this.operation == 'add'){
              crudContract.getByContractApprovalNo(this.form.contractApprovalNo).then(result => {
                this.originalForm = result
              })
          }else {
            if(this.form.approvalStatus == 3){
              crudContract.getByContractApprovalNo(this.form.contractApprovalNo).then(result => {
                this.originalForm = result
              })
            }else {
              crudContract.getByContractApprovalNo(this.form.originalContractApprovalNo).then(result => {
                this.originalForm = result
              })
            }
          }

        })
      },
      tabClick(name) {
        if (this.activeName === 'first') {
          this.$refs.local.crud.toQuery()
        } else {
          this.$refs.qiNiu.crud.toQuery()
        }
      },
      submitChC() {
        var obj = this.form
        obj.approvalStatus = 0
        // if(obj.signDepartmentId.length>0){
        //   obj.signDepartmentId=obj.signDepartmentId[obj.signDepartmentId.length-1]
        // }else {obj.signDepartmentId=10}
        console.log(this.operation)
        if (this.operation == 'add') {
          obj.originalContractApprovalNo = this.originalForm.contractApprovalNo
          crudContract.add(obj).then(res => {
            this.$back();
          })
        } else {
          crudContract.edit(obj).then(res => {
            this.$back();
          })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
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


  .ewrap {
    border: solid #1f2d3d 1px;
  }

  .header-choose {
    margin-bottom: 45px;

    .el-col {
      border: 0;
    }
  }

  .hwrap {
    height: 45px;
    line-height: 45px;
  }

</style>
