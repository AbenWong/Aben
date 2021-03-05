<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.merchantName" clearable placeholder="输入供应商名搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="query.contractNo" clearable placeholder="输入合同单号搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
         <!--  <dept-select v-model="query.signDepartmentId"/> -->
<!--        <el-date-picker-->
<!--          v-model="query.contractStarttime"-->
<!--          :default-time="['00:00:00','23:59:59']"-->
<!--          type="daterange"-->
<!--          range-separator=":"-->
<!--          size="small"-->
<!--          class="date-item"-->
<!--          value-format="yyyy-MM-dd HH:mm:ss"-->
<!--          start-placeholder="contractStarttimeStart"-->
<!--          end-placeholder="contractStarttimeEnd"/>-->
        <rrOperation :crud="crud"/>
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission"/>
      <!-- 详情 -->
      <d-drawer ref="dialogD" :contractId="contractId" />
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;"
                @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55"/>
        <el-table-column v-if="columns.visible('contractApprovalNo')" prop="contractApprovalNo" label="合同变更单号"/>
        <el-table-column v-if="columns.visible('contractNo')" prop="contractNo" label="合同编码"/>
        <el-table-column v-if="columns.visible('merchantName')" prop="merchantName" label="供应商名称"/>
        <el-table-column v-if="columns.visible('merchantType')" prop="merchantType" label="供应商类型">
        <template slot-scope="scope">
          {{ dict.label.merchant_type[scope.row.merchantType] }}
        </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('signType')" prop="signType" label="操作类型">
          <template slot-scope="scope">
            <span v-if="scope.row.signType ==1">增加</span>
            <span v-if="scope.row.signType ==2">修改</span>
            <span v-if="scope.row.signType ==3">修改</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('createTime')" prop="createTime" label="制单时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('createBy')" prop="createBy" label="制单人"/>
        <el-table-column v-if="columns.visible('updateTime')" prop="updateTime" label="更新时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('updateBy')" prop="updateBy" label="更新人"/>
        <el-table-column v-if="columns.visible('approvalStatus')" prop="approvalStatus" label="审批状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.approvalStatus ==0" style="cursor: pointer" :type="''">草稿</el-tag>
            <el-tag v-if="scope.row.approvalStatus ==1" style="cursor: pointer" :type=" 'primary' ">待审批</el-tag>
            <el-tag v-if="scope.row.approvalStatus ==2" style="cursor: pointer" :type=" 'success' ">审批通过</el-tag>
            <el-tag v-if="scope.row.approvalStatus ==3" style="cursor: pointer" :type=" 'danger' ">审批驳回</el-tag>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('approvalUrl')" prop="approvalUrl" label="审批二维码">
          <template slot-scope="scope">
            <div v-if="scope.row.approvalUrl" @click="showQrCode(scope.row.approvalUrl)">
              <qriously :value="scope.row.approvalUrl" :size="60"/>
            </div>
            <span v-else>暂无</span>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','contract:edit','contract:del']" label="操作" align="center">
          <template slot-scope="scope">
            <el-link type="primary" :underline="false" v-if="scope.row.approvalStatus==0"
                     @click="editContract(scope.row)">编辑
            </el-link>
            <el-link type="primary" :underline="false" v-if="scope.row.approvalStatus!=0"
                     @click="detail(scope.row.contractId)">详情
            </el-link>
            <el-link type="primary" :underline="false" v-if="scope.row.approvalStatus==0" v-permission="permission.edit" @click="approval(scope.row.contractId)">发起审批
            </el-link>
          </template>
        </el-table-column>
      </el-table>
      <div style="height: 40px;margin-top: 20px">
        <el-row>
          <el-col :span="12">
            <el-button type="primary" @click="openAddAndEditContractDialog">制单</el-button>
            <el-button type="success" @click="crud.doExport">导出</el-button>
            <el-button type="primary" @click="approvalList">批量审批</el-button>
            <!--            <el-button type="danger" @click="addAndEditAttractMerchant">作废</el-button>-->
          </el-col>
          <el-col :span="12" style="text-align: right">
            <!--分页组件-->
            <pagination/>
          </el-col>
        </el-row>
      </div>

      <!--显示二维码-->
      <el-dialog title="请使用钉钉扫描二维码" :visible.sync="qrcodeobj.show" width="20%">
        <div style="text-align: center;">
          <qriously :value="qrcodeobj.value" :size="200"/>
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="qrcodeobj.show = false">取 消</el-button>
        <el-button type="primary" @click="qrcodeobj.show = false">确 定</el-button>
      </span>
      </el-dialog>


      <!--变更-->
      <el-dialog title="合同变更" :visible.sync="addAndEditContractShow" :close="addAndEditContractClose" width="500px">
        <el-form ref="changeForm" :inline="true" :model="changeForm" :rules="rules" size="small"
                 style="display: flex;flex-direction: column;">
          <el-form-item label="变更类型" prop="signType">
            <el-radio v-model="changeForm.signType" v-for="item in dict.contract_change_type" :key="item.id"
                      :label="item.value">
              {{ item.label }}
            </el-radio>
          </el-form-item>
          <el-form-item label="供应商" prop="merchantId">
            <my-select v-model="changeForm.merchantId" :placeholder="'请选择供应商'" @change="getEditByMerchantId"
                        :downdropType="'merchant/merchant-downdrop'"/>
            <!-- <my-select v-model="changeForm.merchantId" :placeholder="'请选择供应商'" @change="getEditByMerchantId"
                       :downdropType="'merchant/merchant-downdrop'"/> -->
          </el-form-item>
          <el-form-item label="合同编号" v-if="changeForm.contractNo">
            {{changeForm.contractNo}}
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addAndEditContractShow = false">取 消</el-button>
          <el-button type="primary" @click="addAndEditContract">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import crudContract from '@/api/operate/contract'
  import CRUD, {crud, form, header, presenter} from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'
  import MaterialList from "@/components/material";
  import MySelect from '@/components/MySelect/index'
  import DeptSelect from '@/components/Cascader/DeptSelect'
  import {parseTime} from "@/utils";
  import dDrawer from '@/views/operate/contract/detail'
  // crud交由presenter持有
  const defaultCrud = CRUD({
    title: '合同管理',
    url: 'api/contract',
    sort: 'create_time,desc',
    crudMethod: {...crudContract},
    optShow: {
      add: false,
      edit: false,
      del: false,
      download: false
    }
  })
  const defaultForm = {
    contractId: null,
    merchantId: null,
    contractApprovalNo: null,
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
    settleRate:null
  }
  const defaultChangeForm = {
    signType: null,
    merchantId: null,
    contractId: null,
    contractNo: null,
    merchantCode: null,
    approvalStatus: null,
  };
  export default {
    name: 'Contract',
    components: {DeptSelect, MySelect, pagination, crudOperation, rrOperation, udOperation, MaterialList,dDrawer},
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    dicts: ['contract_type', 'expire_handle_type', 'settle_cycle_type', 'settle_status', 'contract_status', 'contract_change_type', 'income_tax_rate','settle_type','merchant_type'],
    data() {
      return {
        contractId:0,
        merchantId:null,
        qrcodeobj: {show: false, value: ''},
        addAndEditContractShow: false,
        changeForm: defaultChangeForm,
        permission: {
          add: ['admin', 'contract:add'],
          edit: ['admin', 'contract:edit'],
          del: ['admin', 'contract:del']
        },
        rules: {
          contractApprovalNo: [{required: true, message: '变更单号不能为空', trigger: 'blur'}],
          signType: [{required: true, message: '请选择变更类型', trigger: 'blur'}],
          merchantId: [{required: true, message: '请选择供应商', trigger: 'blur'}],
        },
        queryTypeOptions: [
          {
            key: 'signDepartmentId',
            display_name: '签订部门名称'
          },
          {
            key: 'approvalStatus',
            display_name: '审批状态'
          },
          {
            key: 'merchantName',
            display_name: '供应商名称'
          },
          {
            key: 'contractNo',
            display_name: '合同编号'
          },
          {
            key: 'merchantCode',
            display_name: '供应商编号'
          }
        ],

      }
    },
    watch: {
      merchantId(val) {
        this.getEditByMerchantId(val)
      }
    },
    methods: {
      parseTime,
      // 获取数据前设置好接口地址
      [CRUD.HOOK.beforeRefresh]() {
        const query = this.query
        if (query.contractNo && query.value) {
          this.crud.params['contractNo'] = query.contractNo
        }
        if (query.merchantName && query.value) {
          this.crud.params['merchantName'] = query.merchantName
        }
        if (query.signDepartmentId && query.value) {
          this.crud.params['signDepartmentId'] = query.signDepartmentId[query.signDepartmentId.length-1]
        }
        return true
      }, // 新增与编辑前做的操作
      [CRUD.HOOK.afterToCU](crud, form) {
      },
      getEditByMerchantId(merchantId) {
        if(merchantId !=null){
          crudContract.getEditByMerchantId(merchantId).then(res => {
            this.changeForm.contractNo = res.contractNo
            this.changeForm.approvalStatus = res.approvalStatus
          })
        }
      },
      openAddAndEditContractDialog() {
        this.addAndEditContractShow = true;
        this.changeForm = defaultChangeForm;
      },
      addAndEditContractClose(){
        this.changeForm ={
          signType: null,
          merchantId: null,
          contractId: null,
          contractNo: null,
          merchantCode: null,
          approvalStatus: null,
        };
      },
      // 添加合同变更单
      editContract(row) {
        var operation = 'edit'
        if (this.changeForm.approvalStatus == 1) {
          this.$message({message: '该供应商已存在处理中的变更单,请不要重复制单！', type: 'warning'});
        }else {
          this.$router.push('/operate/contract/change?merchantId=' + row.merchantId + '&signType=' + row.signType+ '&operation=' + operation);
          this.changeForm = {
            signType: null,
            merchantId: null,
            contractId: null,
            contractNo: null,
            merchantCode: null,
            approvalStatus: null
          }
        }
      },
      // 添加合同变更单
      addAndEditContract() {
        var operation = 'add'
        var that = this;
        that.$refs.changeForm.validate((valid) => {
          console.log(valid);
          if (valid) {
            if (this.changeForm.approvalStatus == 1) {
              that.$message({message: '该供应商已存在处理中的变更单,请不要重复制单！', type: 'warning'});
            }else if (this.changeForm.approvalStatus == 0) {
              that.$message({message: '该供应商已存在处理中的变更单,请不要重复制单！', type: 'warning'});
            }else{
              console.log(this.changeForm.signType)
              that.addAndEditContractShow = false;
              that.$router.push('/operate/contract/change?merchantId=' + this.changeForm.merchantId + '&signType=' + this.changeForm.signType + '&operation=' +operation);
              this.changeForm = {
                signType: null,
                merchantId: null,
                contractId: null,
                contractNo: null,
                merchantCode: null,
                approvalStatus: null
              }
            }
          }
        })
      },
      detail(contractId) {
        this.contractId = contractId
        console.log(contractId)
        this.$refs.dialogD.loading = true
        this.$refs.dialogD.dialogVisible = true
      },
      // 发起审批
      approval(contractId) {
        var that= this;
        this.$confirm('确认提交审批吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          crudContract.approval(contractId).then(res => {
            that.$message.success("发起审批成功")
            setTimeout(function () {
              that.crud.refresh();
            },500);
          })
        })
      },
      // 批量审批
      approvalList() {
        var val = this.crud.selections;
        if (val.length < 1) {
          this.$message.error("请选择需要审批的数据")
          return false;
        }
        // 这里的做法是除去已经发起审核过的数据
        var arr = [], tipstr = '', hasapproval = false;
        for (var i in val) {
          if (val[i].approvalStatus != 0) {
            this.$refs.table.toggleRowSelection(val[i], false);
            tipstr += ' ' + val[i].contractNo
            hasapproval = true
          } else {
            arr.push(val[i]);
          }
        }
        // 判断是否含已经发起审批的数据
        if (hasapproval) {
          tipstr = tipstr + '单已发起审批,无法被选中！确认提交批量审批吗?'
        } else {
          tipstr = '确认提交批量审批吗?'
        }
        this.crud.selections = arr;
        var data = [];
        for (var i in arr) {
          data.push(arr[i].contractId);
        }
        var that =this;
        that.$confirm(tipstr, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          crudContract.batchApproval(data).then(res => {
            that.$message.success("发起批量审批成功")
          })
          setTimeout(function () {
            that.crud.refresh();
          },500);
        })
      },
      // 显示二维码
      showQrCode(url) {
        this.qrcodeobj.show = true
        this.qrcodeobj.value = url
      },
    }
  }


</script>

<style scoped>
  .table-img {
    display: inline-block;
    text-align: center;
    background: #ccc;
    color: #fff;
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    vertical-align: middle;
    width: 32px;
    height: 32px;
    line-height: 32px;
  }

</style>
