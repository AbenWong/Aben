<template>
  <div class="app-container"><!--工具栏-->
    <div class="head-container">
      <!-- 搜索栏 -->
      <div v-if="!crud.props.searchToggle">
        <!-- 结算单号 -->
        <el-input v-model="query.no" clearable placeholder="请输入单号" style="width: 200px;" class="filter-item"/>
        <!--计划付款日期 -->
        <el-date-picker
          v-model="query.payTime"
          :default-time="['00:00:00','23:59:59']"
          type="daterange"
          range-separator=":"
          size="small"
          class="date-item"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          start-placeholder="付款开始日期"
          end-placeholder="付款结束日期"
        />
        <!-- 供应商  支持下拉模糊搜索-->
        <my-select v-model="query.merchantId" :placeholder="'请选择供应商'" :downdropType="'merchant/merchant-downdrop'"/>
        <!-- 单据状态 -->
        <el-select v-model="query.status" clearable placeholder="单据状态" class="filter-item" style="width: 130px">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
        <!-- 付款状态 -->
        <el-select v-model="query.approvalStatus" clearable placeholder="审批状态" class="filter-item" style="width: 130px">
          <el-option v-for="item in payStatusOptions" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
        <rrOperation :crud="crud"/>
      </div>

      <!-- 制单 -->
      <addForm ref="makeBillForm" @refresh="crud.refresh()"/>
      <!-- 流程修改 -->
      <processForm ref="formP" @refresh="crud.refresh()" :pInfo="pInfo"/>
      <!-- 详情 -->
      <d-drawer ref="dialogD" @refresh="crud.refresh()" :settleId="settleId"/>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;"
                @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="no" label="结算单号"/>
        <el-table-column prop="merchantName" label="供应商"/>
        <el-table-column prop="merchantNo" label="供应商编码"/>
        <el-table-column prop="createTime" label="结算期开始日"/>
        <el-table-column prop="endTime" label="结算期截止日"/>
        <el-table-column prop="planPayTime" label="计划付款日"/>
        <el-table-column prop="saleAmount" label="销售额"/>
        <el-table-column prop="merchantDueAmount" label="供应商应得金额"/>
        <el-table-column prop="departmentDueAmount" label="百货应得金额"/>
        <el-table-column prop="status" label="结算状态">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <div>
              <el-tag v-if='scope.row.status === 0' style="cursor: pointer" :type=" 'primary' ">待处理</el-tag>
              <el-tag v-if='scope.row.status === 1' style="cursor: pointer" :type=" 'primary' ">
                <!--作废审批未发起或作废审批作废-->
                <span v-if="scope.row.invalidApprovalStatus==null||scope.row.invalidApprovalStatus==0||scope.row.invalidApprovalStatus==3">待付款</span>
                <span v-else>作废中</span>
              </el-tag>
              <el-tag v-if='scope.row.status === 2' style="cursor: pointer" :type=" 'success' ">已结算</el-tag>
              <el-tag v-if='scope.row.status === 3' style="cursor: pointer" :type=" 'danger' ">已作废</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="approvalStatus" label="审批状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.approvalStatus === 0" style="cursor: pointer" :type="''">草稿</el-tag>
            <el-tag v-if='scope.row.approvalStatus === 1' style="cursor: pointer" :type=" 'primary' ">待审批</el-tag>
            <el-tag v-if='scope.row.approvalStatus === 2' style="cursor: pointer" :type=" 'success' ">已审批</el-tag>
            <el-tag v-if='scope.row.approvalStatus === 3' style="cursor: pointer" :type=" 'danger' ">已驳回</el-tag>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('approvalUrl')" prop="approvalUrl" label="审批二维码">
          <template slot-scope="scope">
            <div v-if="scope.row.approvalUrl" @click="showQrCode(scope.row.approvalUrl,scope.row.invalidApprovalUrl)">
              <qriously :value="scope.row.approvalUrl" :size="60"/>
            </div>
            <span v-else>暂无</span>
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作" align="center">
          <template slot-scope="scope">
            <el-link type="primary" :underline="false" @click="detail(scope.row)">详情</el-link>
            <el-link v-if="scope.row.approvalStatus==0&&scope.row.status==0" type="primary" size="mini" :underline="false"
                     @click="approval(scope.row)">发起审批
            </el-link>
            <el-link v-if="scope.row.status==0||scope.row.status==1" type="danger" size="mini" :underline="false"
                       @click="invalid(scope.row)">作废
            </el-link>

          </template>
        </el-table-column>
      </el-table>

      <!-- 底部栏 -->
      <div style="height: 40px;margin-top: 20px">
        <el-row>
          <el-col :span="12">
            <el-button type="primary" @click="add">制单</el-button>
            <el-button type="primary" @click="approves">批量审批</el-button>
            <el-button type="danger" @click="invalidBill">作废</el-button>
            <el-button type="success" @click="crud.doExport">导出</el-button>
          </el-col>
          <el-col :span="12" style="text-align: right">
            <!--分页组件-->
            <pagination/>
          </el-col>
        </el-row>
      </div>
    </div>


    <!--显示二维码-->
    <el-dialog title="请使用钉钉扫描二维码" :visible.sync="qrcodeobj.show" width="20%">
      <div style="text-align: center;">
        <h3>审批二维码</h3>
        <qriously :value="qrcodeobj.value" :size="200"/>
        <div v-if="qrcodeobj.value2">
          <h3>作废审批二维码</h3>
          <qriously :value="qrcodeobj.value2" :size="200"/>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="qrcodeobj.show = false">取 消</el-button>
        <el-button type="primary" @click="qrcodeobj.show = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  //引入settlement api
  import crudSettlement from '@/api/cost/settlement'
  import checkPermission from '@/utils/permission'

  import CRUD, {crud, form, header, presenter} from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'
  //导入详情组件
  import dDrawer from './detail'
  import addForm from './makeBill'
  import processForm from './approve'
  import MySelect from '@/components/MySelect'
  const defaultCrud = CRUD({
    title: '结算管理',
    url: 'api/settlement',
    sort: 'create_time,desc',
    crudMethod: {...crudSettlement}
  })
  const defaultForm = {}

  export default {
    components: {MySelect, dDrawer, addForm, processForm, pagination, crudOperation, rrOperation, udOperation},
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    data() {
      return {
        syncLoading: true,
        disabled: true,
        drawer: false,
        permission: {
          add: ['admin', 'settlement:add'],
          edit: ['admin', 'settlement:edit'],
          del: ['admin', 'settlement:del']
        },
        pInfo: {},
        settleId: 0,
        //状态
        statusOptions: [
          {value: 0, label: "待处理"},
          {value: 1, label: "待付款"},
          {value: 2, label: "已结算"},
          {value: 3, label: "已作废"}
        ],
        //付款状态
        payStatusOptions: [
          {value: 0, label: "待发起审批"},
          {value: 1, label: "待审批"},
          {value: 2, label: "审批通过"},
          {value: 3, label: "审批驳回"},
        ],
        qrcodeobj: {show: false, value: '',value2:''},
      }
    },
    computed: {
      //获取商品编号
      getMNo: function (name) {
        return this.merchants.filter((item) => {
          let _no = item.no
          let _name = item.name
          if (_name === name) {
            return _no;
          }
        })
      }
    },
    methods: {
      checkPermission,
      // 获取数据前设置好接口地址
      [CRUD.HOOK.beforeRefresh]() {
        const query = this.query
        if (query.no && query.value) {
          this.crud.params['no'] = query.no
        }
        if (query.payTime && query.value) {
          this.crud.params['payTime'] = query.payTime
        }
        if (query.merchantName && query.value) {
          this.crud.params['merchantName'] = query.merchantName
        }

        if (query.status && query.value) {
          this.crud.params['status'] = query.status
        }

        if (query.payStatus && query.value) {
          this.crud.params['payStatus'] = query.payStatus
        }
        return true
      },
      // 制单
      add() {
        this.$refs.makeBillForm.dialog = true
      },
      // 批量审批
      approves() {
        var selObj = this.crud.selections;
        if (selObj.length < 1) {
          this.$message.error("请选择需要审批的结算单");
          return false;
        }
        this.pInfo.nos = [];
        for (var i in selObj) {
          // 只对需要处理的结算单状态进行发起审批处理
          if (selObj[i].status == 0 && selObj[i].approvalStatus == 0) {
            this.pInfo.nos.push(selObj[i].no)
          }
        }
        if (this.pInfo.nos.length < 1) {
          this.$message.error("没有需要发起审批的结算单");
          return false;
        }
        this.pInfo.status = 3;
        this.pInfo.title = '批量审批'
        this.pInfo.placeholder = '审批留言'
        this.$refs.formP.dialog = true
      },
      // 单个审批
      approval(obj) {
        if (obj.status != 0 && obj.approvalStatus != 0) {
          this.$message.error("当前结算单处于审批状态,无法重复发起审批");
          return false;
        }
        this.pInfo.status = 3
        this.pInfo.title = '单个审批审批'
        this.pInfo.placeholder = '审批留言'
        this.pInfo.nos = [obj.no];
        this.$refs.formP.dialog = true
      },
      // 单条作废
      invalid(obj) {
        console.log(obj)
        if (!(obj.status == 0 || obj.status == 1)) {
          this.$message.error(obj.no + "结算单状态无法作废");
          return false;
        }
        // 如果是代付款状态(一定是审批通过的) 作废是需要发起审批的
        if (obj.status == 1) {
          this.$confirm(obj.no + '结算单已审批通过,作废需要发起审批,确认作废吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.pInfo.nos = [obj.no];
            this.pInfo.status = 7
            this.pInfo.title = '作废结算单'
            this.pInfo.placeholder = '作废留言'
            this.$refs.formP.dialog = true
          })
        } else {
          // 如果是未处理的状态下,作废是要判断是否审批的,如果审批中的话,不允许作废
          if (!(obj.approvalStatus == 0 || obj.approvalStatus == 3)) {
            // 只有审批未开始,和审批驳回的情况下才能作废
            this.$message.error(obj.no + "结算单处于审批中无法作废");
          } else {
            this.pInfo.nos = [obj.no];
            this.pInfo.status = 7
            this.pInfo.title = '作废结算单'
            this.pInfo.placeholder = '作废留言'
            this.$refs.formP.dialog = true
          }
        }
      },
      // 结算单作废
      invalidBill() {
        var selObj = this.crud.selections
        if (selObj.length < 1) {
          this.$message.error("请选择需要作废的结算单");
          return false;
        }
        this.pInfo.nos = [];
        // 是否包含审批通过的的
        var hasapproOrder = false, approvalStr = '';
        for (var i in selObj) {
          // 草稿 审批未发起或审批驳回的 可以直接作废
          if (selObj[i].status == 0 && (selObj[i].approvalStatus == 0 || selObj[i].approvalStatus == 3)) {
            this.pInfo.nos.push(selObj[i].no);
          }
          // 待付款 作废需要发起审批, 不能直接作废
          if (selObj[i].status == 1) {
            hasapproOrder = true;
            approvalStr += selObj[i].no + ',';
            this.pInfo.nos.push(selObj[i].no);
          }
        }
        if (this.pInfo.nos.length < 1) {
          this.$message.error("无可作废的结算单")
          return false;
        }

        if (hasapproOrder) {
          this.$confirm(approvalStr + '结算单已审批通过,作废需要发起审批,确认作废吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.pInfo.status = 7
            this.pInfo.title = '作废结算单'
            this.pInfo.placeholder = '作废留言'
            this.$refs.formP.dialog = true
          });
        } else {
          this.pInfo.status = 7;
          this.pInfo.title = '作废结算单';
          this.pInfo.placeholder = '作废留言';
          this.$refs.formP.dialog = true;
        }
      },
      // 详情查询id
      detail(data) {
        let id = data.id;
        this.settleId = id
        this.$refs.dialogD.loading = true
        this.$refs.dialogD.dialogVisible = true
        console.log(this.settleId)
      },
      // 显示二维码
      showQrCode(url,url2) {
        this.qrcodeobj.show = true
        this.qrcodeobj.value = url
        this.qrcodeobj.value2 = url2
      },
    }
  }


</script>

<style scoped>

</style>
