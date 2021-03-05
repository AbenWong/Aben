<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.merchantNo" clearable placeholder="输入供应商编码" style="width: 200px;" class="filter-item"/>
        <el-input v-model="query.merchantName" clearable placeholder="输入供应商名称" style="width: 200px;"
                  class="filter-item"/>
        <el-input v-model="query.contractNo" clearable placeholder="输入合同编码" style="width: 200px;" class="filter-item"/>
        <el-input v-model="query.goodsName" clearable placeholder="输入商品名称" style="width: 200px;" class="filter-item"/>
        <el-input v-model="query.goodsNo" clearable placeholder="输入商品编号" style="width: 200px;" class="filter-item"/>
        <el-select v-model="query.status" clearable placeholder="状态" class="filter-item" style="width: 130px">
          <el-option label="有效" value="1"/>
          <el-option label="无效" value="0"/>
        </el-select>
        <rrOperation :crud="crud"/>
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission"/>
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :visible.sync="addShow" title="新增售前结算变更单" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="供应商" prop="merchantId">
            <my-select v-model="form.merchantId" :placeholder="'请选择供应商'" @change="getGoodsList"
                       :downdropType="'merchant/merchant-downdrop'" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="商品" prop="goodsId">
            <el-select v-model="form.goodsId" filterable clearable placeholder="请选择商品" style="width: 370px;">
              <el-option v-for="item in goodsList" :key="item.goodsId" :label="item.goodsName" :value="item.goodsId"/>
            </el-select>
          </el-form-item>
          <el-form-item label="原扣率" prop="oldDeductionRate">
            <el-input type="number" :min="0" v-model="form.oldDeductionRate" readonly style="width: 370px;">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
          <el-form-item label="新扣率" prop="newDeductionRate">
            <el-input type="number" :min="0" v-model="form.newDeductionRate" style="width: 370px;">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
          <el-form-item label="开始时间" prop="startTime">
            <el-date-picker v-model="form.startTime" type="date" value-format="yyyy-MM-dd 00:00:00"
                            style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker v-model="form.endTime" value-format="yyyy-MM-dd 23:59:59" type="date"
                            style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.remark" style="width: 370px;"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="addShow=false">取消</el-button>
          <el-button :loading="saveLoading" type="primary" @click="submitData()">确认</el-button>
        </div>
      </el-dialog>


      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;"
                @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55"/>
        <el-table-column v-if="columns.visible('no')" prop="no" label="变更单号"/>
        <el-table-column v-if="columns.visible('merchantNo')" prop="merchantNo" label="供应商编码"/>
        <el-table-column v-if="columns.visible('merchantName')" prop="merchantName" label="供应商名称"/>
        <el-table-column v-if="columns.visible('goodsName')" prop="goodsName" label="商品名称"/>
        <el-table-column v-if="columns.visible('goodsNo')" prop="goodsNo" label="商品编号"/>
        <el-table-column v-if="columns.visible('oldDeductionRate')" prop="oldDeductionRate" label="原扣率">
          <template slot-scope="scope">
            <span>{{scope.row.oldDeductionRate }}%</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('newDeductionRate')" prop="newDeductionRate" label="新扣率">
          <template slot-scope="scope">
            <span>{{scope.row.newDeductionRate }}%</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('startTime')" prop="startTime" label="开始时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.startTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('endTime')" prop="endTime" label="结束时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.endTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('status')" prop="status" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status==0">无效</span>
            <span v-if="scope.row.status==1">有效</span>
            <span v-if="scope.row.status==2">作废</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('createBy')" prop="createBy" label="制单人"/>
        <el-table-column v-if="columns.visible('createTime')" prop="createTime" label="制单时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('updateBy')" prop="updateBy" label="更新人"/>
        <el-table-column v-if="columns.visible('updateTime')" prop="updateTime" label="更新时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('approvalStatus')" prop="approvalStatus" label="审批状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.approvalStatus === 0" style="cursor: pointer" :type="''">草稿</el-tag>
            <el-tag v-if='scope.row.approvalStatus === 1' style="cursor: pointer" :type=" 'primary' ">待审批</el-tag>
            <el-tag v-if='scope.row.approvalStatus === 2' style="cursor: pointer" :type=" 'success' ">已审批</el-tag>
            <el-tag v-if='scope.row.approvalStatus === 3' style="cursor: pointer" :type=" 'danger' ">已驳回</el-tag>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('approvalUrl')" prop="approvalUrl" label="审批详情">
          <template slot-scope="scope">
            <div v-if="scope.row.approvalUrl" @click="showQrCode(scope.row.approvalUrl)">
              <qriously :value="scope.row.approvalUrl" :size="60"/>
            </div>
            <span v-else>暂无</span>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','presaleChange:edit','presaleChange:del']" label="操作" width="150px"
                         align="center">
          <template slot-scope="scope">
            <el-link type="primary" :underline="false"
                     @click="showInfo(scope.row.presaleChangeId)">详情
            </el-link>
            <!-- 只有未审批之前才能编辑-->
            <el-link type="primary" v-if="scope.row.approvalStatus==null||scope.row.approvalStatus==0"
                     :underline="false" v-permission="permission.edit"
                     @click="editData(scope.row.presaleChangeId)">编辑
            </el-link>
            <!-- 只有未审批之前才能发审批-->
            <el-link type="primary" v-if="scope.row.approvalStatus==null||scope.row.approvalStatus==0"
                     :underline="false" v-permission="permission.edit"
                     @click="toApplyApproval(scope.row)">发审批
            </el-link>
          </template>
        </el-table-column>
      </el-table>


      <!--分页组件-->
      <div style="height: 40px;margin-top: 20px">
        <el-row>
          <el-col :span="12">
            <el-button type="primary" @click="toAdd">制单</el-button>
            <el-button type="success" @click="">导出</el-button>
          </el-col>
          <el-col :span="12" style="text-align: right">
            <!--分页组件-->
            <pagination/>
          </el-col>
        </el-row>
      </div>
    </div>


    <el-drawer :visible.sync="isShowInfo" size="50%" :withHeader="false">
    
     <el-form ref="form" size="small"  class="info-box">
        <div class="wrap">
          <div id="d-header-id" class="d-header">
            <el-row style="line-height: 40px">
              <el-col :xs="24" :sm="10" :md="13"
                  style="line-height: 40px; font-size: 18px; font-weight: bold; padding-left: 20px;color:blue">
                <span>{{infoData.no}}</span>
              </el-col>
             <el-col :xs="20" :sm="10" :md="8" style="line-height: 40px;font-size:14px">
               <span>单据审批状态: </span>
                <span   v-if="infoData.approvalStatus==0">草稿</span>
                <span   v-if="infoData.approvalStatus==1">审批中</span>
                <span  v-if="infoData.approvalStatus==2">审批通过</span>
                <span  v-if="infoData.approvalStatus==3">审批驳回</span>
              </el-col>
              <el-col :xs="3" :sm="2" :md="1" :offset="1" style="line-height: 40px; align-items: center; margin-left:15px">
                <el-link :underline="false" @click="closeDialog">X</el-link>
              </el-col>
            </el-row>
          </div>
          <div id="d-content-id" class="content-wrap">
            <el-row class="nav">
              <h2>基础信息</h2>
            </el-row>
            <div class="line-black"></div>
            <div class="base-wrap">
              <el-row>
                <el-col :xs="24" :sm="8" :md="8">
                      <div class="grid-content ">
                        <span class="head" style="margin-right:5px">制单员:</span>
                        <span class="content">{{infoData.createBy}}</span>
                      </div>
                </el-col>
                <el-col :xs="24" :sm="16" :md="8">
                    <div class="grid-content ">
                      <span class="head" style="margin-right:5px">制单时间:</span>
                      <span class="content">{{infoData.createTime}}</span>
                    </div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="8">
                    <div class="grid-content ">
                      <span class="head" style="margin-right:5px">备注:</span>
                      <span>{{infoData.remark}}</span>
                    </div>
                </el-col>
              </el-row>
          </div>
          <div>
            <el-row class="nav" style="padding-right: 0px;">
              <h2>供应商信息</h2>
            </el-row>
            <div class="line-black"></div>
            <div class="base-wrap" style="text-align: center">
              <el-row class="m-row">
                <el-col :xs="24" :sm="8" :md="7">
                  <div class="grid-content " style="float: left;">
                    <span class="head">供应商:</span>
                    <span class="content">{{infoData.merchantName}}</span>
                  </div>
                </el-col>
                <el-col :xs="24" :sm="12" :md="8">
                      <div class="grid-content space">
                        <span class="head" style="margin-right:5px">供应商编码:</span>
                        <span class="content">{{infoData.merchantNo}}</span>
                      </div>
                </el-col>
              </el-row>
            </div>
          </div>
            <el-row class="nav" style="padding-right: 0px;">
              <h2>商品信息</h2>
            </el-row>
            <div class="line-black"></div>

            <div id="ht-content" class="base-wrap" style="text-align: center">
              <el-row class="ht-row">
                <el-col :xs="24" :sm="8" :md="5">
                  <div style="float: left;">
                    <span class="head" style="margin-right:5px">合同编码:</span>
                    <span class="content">{{infoData.contractNo}}</span>
                  </div>
                </el-col>
                <el-col :xs="24" :sm="16" :md="8">
                  <div class="space-other4">
                    <span class="head" style="margin-right:5px">商品名称:</span>
                    <span class="content">{{infoData.goodsName}}</span>
                  </div>
                </el-col>
                <el-col :xs="24" :sm="10" :md="8">
                  <div class="space-other2">
                    <span class="head" style="margin-right:5px">商品编号:</span>
                    <span class="content">{{infoData.goodsNo}}</span>
                  </div>
                </el-col>
                <el-col :xs="24" :sm="6" :md="6">
                  <div  style="float: left;" >
                    <span class="head ">原扣率:</span>
                    <span class="content">{{infoData.oldDeductionRate}}%</span>
                  </div>
                </el-col>
                <el-col :xs="24" :sm="6" :md="7">
                  <div class="space-other3">
                    <span class="head ">新扣率:</span>
                    <span class="content">{{infoData.newDeductionRate}}%</span>

                  </div>
                </el-col>
                <el-col :xs="24" :sm="13" :md="11">
                  <div class="space-other1">
                    <span class="head ">开始日期:</span>
                    <span class="content">{{infoData.startTime}}</span>
                  </div>
                </el-col>
                <el-col :xs="24" :sm="24" :md="9">
                  <div style="float: left;">
                    <span class="head">结束日期:</span>
                    <span class="content">{{infoData.endTime}}</span>
                  </div>
                </el-col>
            </el-row>
              </div>
          </div>
        </div>
      </el-form>
      
    </el-drawer>

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
  </div>
</template>

<script>
  import CRUD, {crud, form, header, presenter} from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'
  import MaterialList from "@/components/material"
  import crudPresaleChange from '@/api/presaleChange'
  import goods from '@/api/goods'
  import contract from '@/api/operate/contract'
  import MySelect from '@/components/MySelect'

  // crud交由presenter持有
  const defaultCrud = CRUD({
    title: '售前结算变更',
    url: 'api/presaleChange',
    sort: 'presale_change_id,desc',
    crudMethod: {...crudPresaleChange},
    optShow: {
      add: false,
      edit: false,
      del: false,
      download: false
    },
  })
  const defaultForm = {
    presaleChangeId: null,
    merchantId: null,
    merchantNo: null,
    merchantName: null,
    contractId: null,
    contractNo: null,
    goodsId: null,
    goodsName: null,
    goodsNo: null,
    oldDeductionRate: null,
    newDeductionRate: null,
    startTime: null,
    endTime: null,
    status: null,
    remark: null,
    approvalId: null,
    approvalStatus: null,
    approvalUrl: null,
    createTime: null,
    updateTime: null,
    createBy: null,
    updateBy: null,
    isDel: null
  }
  export default {
    name: 'PresaleChange',
    components: {MySelect, pagination, crudOperation, rrOperation, udOperation, MaterialList},
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    data() {
      return {

        permission: {
          add: ['admin', 'presaleChange:add'],
          edit: ['admin', 'presaleChange:edit'],
          del: ['admin', 'presaleChange:del']
        },
        rules: {
          merchantId:
            [
              {required: true, message: '请选择供应商', trigger: 'blur'}
            ],
          goodsId:
            [
              {required: true, message: '请选择商品', trigger: 'blur'}
            ],
          oldDeductionRate:
            [
              {required: true, message: '原扣率不能为空', trigger: 'blur'}
            ],
          newDeductionRate:
            [
              {required: true, message: '新扣率不能为空', trigger: 'blur'}
            ],
          startTime:
            [
              {required: true, message: '开始时间不能为空', trigger: 'blur'}
            ],
          endTime:
            [
              {required: true, message: '结束时间不能为空', trigger: 'blur'}
            ],
        },
        form: defaultForm,
        addShow: false,
        saveLoading: false,
        isShowInfo: false,
        infoData: {},
        qrcodeobj: {show: false, value: ''},
        goodsList: [],// 商品列表
      }
    },
    watch: {},
    methods: {
      // 获取数据前设置好接口地址
      [CRUD.HOOK.beforeRefresh]() {
        const query = this.query
        if (query.type && query.value) {
          this.crud.params[query.type] = query.value
        } else {
          delete this.crud.params.merchantNo
          delete this.crud.params.merchantName
          delete this.crud.params.contractNo
          delete this.crud.params.goodsName
          delete this.crud.params.goodsNo
          delete this.crud.params.status
        }
        return true
      }, // 新增与编辑前做的操作
      [CRUD.HOOK.afterToCU](crud, form) {
      },
      // 显示二维码
      showQrCode(url) {
        this.qrcodeobj.show = true
        this.qrcodeobj.value = url
      },
      // 显示制单
      toAdd() {
        this.form = defaultForm;
        this.addShow = true;
      },
      // 根据商户ID获取商品信息 这里有两个操作,1,获取原扣率,2:获取商品信息
      getGoodsList(merchantId) {
        this.goodsList = [];
        this.form.oldDeductionRate = 0;
        this.form.goodsId = null;
        if (!merchantId) {
          return false
        }
        // 根据商户Id获取供应商信息
        goods.getByMerchantId(merchantId).then(res => {
          this.goodsList = res;
        })
        // 获取合同信息
        contract.getByMerchantId(merchantId).then(res => {
          this.form.oldDeductionRate = res.settleRate;
        })
      },
      // 提交数据
      submitData() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.saveLoading = true;
            console.log(this.form)
            // 保存数据
            crudPresaleChange.saveData(this.form).then(res => {
              this.$message.success("数据保存成功");
              this.saveLoading = false
              this.crud.refresh();
              this.addShow = false;
            }).catch(res => {
              this.saveLoading = false
            })
          }
        });
      },
      // 查看详情信息
      showInfo(presaleChangeId) {
        crudPresaleChange.get(presaleChangeId).then(res => {
          this.isShowInfo = true;
          this.infoData = res;
        })
      },
      // 编辑数据
      editData(presaleChangeId) {
        crudPresaleChange.get(presaleChangeId).then(res => {
          // 这里就要先去获取商品列表了
          goods.getByMerchantId(res.merchantId).then(goods => {
            this.goodsList = goods;
            this.form = res;
          })
          this.addShow = true;
        })
      },
      // 发起审批
      toApplyApproval(obj) {
        var that = this;
        if (obj.approvalStatus != null && obj.approvalStatus != 0) {
          that.$message.error("单据当前状态无法发起审批");
          return false;
        }
        that.$confirm('确定发起审批吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          crudPresaleChange.approval(obj.presaleChangeId).then(res => {
            that.$message.success("发起审批成功");
            that.crud.refresh();
          })
        })
      },
       openDialog() {
        getDetail(this.settleId).then(res => {
          this.detailForm = res
          this.detailForm.approves = res.approves
          this.loading = false
          this.approveTableData = res.approves
        }).catch(ex => {
          console.log(ex)
          this.loading = false
          this.isShowInfo = false
        })
        return true
      },
      //关闭dialog
      closeDialog(done) {
        this.isShowInfo = false
/*         this.approveTableData = [] */
        this.detailForm = detailForm
      },
      rowClassName({row, rowIndex}) {
        row.xh = rowIndex + 1;
      },
    }
  }


</script>


<style scoped>
  /* 兼容火狐 */
  * {
    scrollbar-width: none;
  }


  .line-black {
    width: 100%;
    height: 1px;
    border-top: solid #BBBBBB 3px;
  }
  .content-wrap {
    margin-left: 10px
  }

  .d-header {
    background-color: #F5F5F5;
  }

  /** 设置el-row */
  .d-content > .el-row {
    margin-left: 20px;
    margin-top: 15px
  }

  .el-row {
    line-height: 33px;
  }

  .base-wrap {
    /*     font-size: 14px;
        font-weight:6; */

    line-height: 33px;
    margin: 10px 5px 0px 15px;
  }

/*   .invoice-wrap {
    border: solid #BBBBBB 3px;
    padding: 10px 30px 10px 30px;
    margin-top: 10px;

    .el-col {
      height: 28px;
      line-height: 28px;
    }

    .look-up {
      font-weight: bold;
    }
  } */

  .record {
    margin: 15px 15px 3px 15px;
  }

  .nav {
    font-weight: bold;
    /*    padding-right: 535px; */
    /*     border-bottom: 1px solid #BBBBBB;  */
    color: black;
    height: 50px;
    line-height: 25px;


  }

  h2 {
    margin-top: 15px;
  }

  .el-button {
    font-size: 14px;
  }

  .head {
    font-weight: bold;
    font-size: 14px;
    color: #606266;
  }

  .content {
    font-size: 13px;
  }

  .space {
    margin-right: 7rem;
  }

  .space-other {
    margin-right: 30px;
  }

  .space-other2 {
    margin-left: 2rem;
  }

  .space-other3 {
    margin-right: 29px;
  }

  .space-other4 {
    margin-left: 3.7rem;
  }


  @media only screen and (min-width: 768px) and (max-width: 1024px) {
    .space {
      margin-right: 0rem;
    }
    .space-other {
      margin-right: 0px;

    }
    .space-other2 {
      margin-left: 0px;

    }
    .space-other3 {
      margin-right: 0px;
    }
    .space-other4 {
      margin-right: 0px;
    }

  }

  @media only screen and (min-width: 320px) and (max-width: 767px) {
    .space {
      margin-right: 0rem;
    }
    .space-other {
      margin-right: 0px;
      float: left;
    }
    .space-other2 {
      margin-left: 0px;
      float: left;
    }
    .space-other3 {
      margin-right: 0px;
      float: left;
    }
    .space-other4 {
      margin-right: 0px;
    }
    .space-other5 {
    margin-right: 0rem;
  }
  }
  
</style>