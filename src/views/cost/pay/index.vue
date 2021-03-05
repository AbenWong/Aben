<template>
  <div class="app-container"><!--工具栏-->
    <div class="head-container">
      <div v-if="!crud.props.searchToggle">
        <!--付款单号 -->
        <el-input v-model="query.no" clearable placeholder="付款单号" style="width: 200px;" class="filter-item"/>
        <!-- 结算单号 -->
        <el-input v-model="query.no" clearable placeholder="结算单号" style="width: 200px;" class="filter-item"/>

        <!-- 供应商  支持下拉模糊搜索-->
        <el-select v-model="query.merchantNo" placeholder="选择商户" clearable filterable class="filter-item"
                   style="width: 200px">
          <el-option v-for="item in merchantList" :key="item.no" :label="item.label" :value="item.no"/>
        </el-select>

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

        <el-date-picker
          v-model="query.createTime"
          :default-time="['00:00:00','23:59:59']"
          type="daterange"
          range-separator=":"
          size="small"
          class="date-item"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd HH:mm:ss"
          :placeholder="'开单时间'"
          start-placeholder="开单开始时间"
          end-placeholder="开单结束时间"
        />
        <!-- 单据状态 -->
        <el-select v-model="query.status" clearable placeholder="单据状态" class="filter-item" style="width: 100px">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
        <!-- 付款状态 -->
        <el-select v-model="query.payStatus" clearable placeholder="付款状态" class="filter-item" style="width: 100px">
          <el-option
            v-for="item in payStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
        <rrOperation :crud="crud"/>
      </div>

      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;"
                @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="no" label="付款单号"/>
        <el-table-column prop="merchantName" label="供应商"/>
        <el-table-column prop="merchantNo" label="供应商编码"/>
        <el-table-column prop="createTime" label="结算期开始日"/>
        <el-table-column prop="endTime" label="结算期截止日"/>
        <el-table-column prop="saleAmount" label="销售额"/>
        <el-table-column prop="merchantDueAmount" label="供应商应得金额"/>
        <el-table-column prop="departmentDueAmount" label="百货应得金额"/>
        <el-table-column prop="status" label="单据状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" style="cursor: pointer" :type="'primary'">草稿</el-tag>
            <el-tag v-if='scope.row.status === 1' style="cursor: pointer" :type="'danger'">
              <span v-if="scope.row.checkStatus === 1">对账成功</span>
              <span v-if="scope.row.checkStatus === 2">对账异常</span>
            </el-tag>
            <el-tag v-if='scope.row.status === 2' style="cursor: pointer" :type="'warning'">
              <!-- 作废审批未通过或者未作废-->
              <span
                v-if="scope.row.invalidApprovalStatus==null||scope.row.invalidApprovalStatus==0||scope.row.invalidApprovalStatus==3">待付款</span>
              <span v-else>作废中</span>
            </el-tag>
            <el-tag v-if='scope.row.status === 3' style="cursor: pointer" :type="'success'">已付款</el-tag>
            <el-tag v-if='scope.row.status === 4' style="cursor: pointer" :type="'danger'">已作废</el-tag>
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
            <!-- 只有草稿状态 或者 对账异常的状态下才能进行对账-->
            <el-link type="primary" v-if="scope.row.status == 0||(scope.row.status == 1&&scope.row.checkStatus == 2)"
                     :underline="false" @click="checkAOne(scope.row)">对账
            </el-link>
            <!--草稿状态默认就可以作废-->
            <el-link type="primary" v-if="scope.row.status == 0" :underline="false" @click="invalidBillOne(scope.row)">
              作废
            </el-link>
            <!--如果是对账完未发起审批或审批作废也是可以作废的-->
            <el-link type="primary"
                     v-if="scope.row.status == 1
                     &&(scope.row.approvalStatus == 0||scope.row.approvalStatus == 3)"
                     :underline="false" @click="invalidBillOne(scope.row)">作废
            </el-link>
            <!-- 如果是审批通过以后,没有发起作废也是可以作废的 -->
            <el-link type="primary"
                     v-if="scope.row.status == 2&&(scope.row.invalidApprovalStatus==null||scope.row.invalidApprovalStatus==0)"
                     :underline="false" @click="invalidBillOne(scope.row)">
              作废
            </el-link>
            <!--只有对完账,且未发起审批方能付款 且对账成功方能审批-->
            <el-link type="primary" v-if="scope.row.status == 1&&scope.row.approvalStatus==0&&scope.row.checkStatus==1"
                     :underline="false"
                     @click="approvesOne(scope.row)">发审核
            </el-link>
            <!--只有审批通过,且未发起作废方能付款-->
            <el-link
              v-if="scope.row.status==2&&(scope.row.invalidApprovalStatus==null||scope.row.invalidApprovalStatus==0||scope.row.invalidApprovalStatus==3)"
              type="primary" :underline="false" @click="payA(scope.row)">付款
            </el-link>
          </template>
        </el-table-column>
      </el-table>
      <div style="height: 40px;margin-top: 20px">
        <el-row>
          <el-col :span="12">
            <el-button type="primary" @click="add">制单</el-button>
            <el-button type="primary" @click="checkA">对账</el-button>
            <el-button type="primary" @click="approves">批量审批</el-button>
            <!--<el-button type="primary" @click="payA">付款</el-button>-->
            <el-button type="danger" @click="invalidBill">作废</el-button>
            <el-button type="success" @click="crud.doExport">导出</el-button>
          </el-col>
          <el-col :span="12">
            <!--分页组件-->
            <div>
              <!--分页组件-->
              <pagination/>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 详情 -->
    <el-drawer
      :visible.sync="drawer"
      :direction="'rtl'"
      :withHeader="false"
      :destroy-on-close="true"
      :size="'50%'">
      <dDrawer :id="dId"/>
    </el-drawer>

    <!-- 制单 -->
    <addForm ref="form" @refresh="crud.refresh()"/>
    <!-- 流程修改 -->
    <processForm ref="formP" @refresh="crud.refresh()" :pInfo="pInfo"/>
    <!-- 对账 -->
    <checkForm ref="formC" @refresh="crud.refresh()" :cInfo="cInfo"/>
    <!-- 详情 -->
    <d-drawer ref="dialogD" @refresh="crud.refresh()" :payId="payId"/>
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

    <!--显示对账信息-->
    <el-dialog :title="'付款单付款确认'" :visible.sync="paymentShow" width="500px">
      <el-form size="small" label-width="140px">
        <el-form-item label="应付金额:" style=" width: 350px;">{{paymentForm.shouldPay}}</el-form-item>
        <el-form-item label="余额:" style=" width: 350px;">{{paymentForm.balance}}</el-form-item>
        <el-form-item label="当期付款金额:" style=" width: 350px;">
          <el-input v-model="paymentForm.payAmount" @change="paymentFormChange" type="number" :min="1"
                    placeholder="请输入付款金额"/>
        </el-form-item>
        <el-form-item label="付款备注:" style=" width: 350px;">
          <el-input type="textarea" :rows="10" :placeholder="'付款备注'" v-model="paymentForm.remark"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="paymentShow = false">取消</el-button>
        <el-button type="primary" :loading="paymentLoading" @click="paymentOrder">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import CRUD, {crud, form, header, presenter} from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'
  //导入详情组件
  import dDrawer from './detail'
  import addForm from './makeBill'
  import processForm from './process'
  import checkForm from './check'
  import constant from './constant'
  import payForm from './pay'
  import crudPay from "@/api/cost/pay"

  const defaultCrud = CRUD({
    title: '结算管理',
    url: 'api/pay',
    sort: 'create_time,desc',
    crudMethod: {...crudPay}
  })
  const defaultForm = {}

  export default {
    components: {
      dDrawer,
      addForm,
      processForm,
      checkForm,
      payForm,
      constant,
      pagination,
      crudOperation,
      rrOperation,
      udOperation
    },
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    data() {
      return {
        // 对账表单
        paymentForm: {show: false},
        paymentShow: false,
        paymentLoading: false,
        syncLoading: true,
        disabled: true,
        drawer: false,
        merchantLoading: false,
        permission: {
          add: ['admin', 'yxWechatLive:add'],
          edit: ['admin', 'yxWechatLive:edit'],
          del: ['admin', 'yxWechatLive:del']
        },
        merchantList: [],
        dId: null,
        payId: 0,
        pInfo: {
          ids: [],
          status: null,  //3:已审批
          title: '',
          placeholder: ''
        },
        cInfo: {
          ids: [],
          status: null,
          title: '',
          placeholder: ''
        },
        qrcodeobj: {show: false, value: '', value2: ''},
        //状态
        statusOptions: [
          {value: 0, label: "草稿"},
          {value: 1, label: "已对账"},
          {value: 2, label: "待付款"},
          {value: 3, label: "已付款"},
          {value: 4, label: "作废"},
        ],
        //付款状态
        payStatusOptions: [
          {value: 0, label: "待付款"},
          {value: 1, label: "部分付款"},
          {value: 2, label: "已付款"}
        ],
      }
    },
    methods: {
      // 制单
      add() {
        this.$refs.form.dialog = true
      },
      // 批量审批
      approves() {
        var selections = this.crud.selections;
        if (selections.length < 1) {
          this.$message.error("请选择需要审批的付款单");
          return false;
        }
        this.pInfo.nos = [];
        for (var i in selections) {
          // 只有对账完的订单才能发起审批
          if (selections[i].status == 1 && selections[i].approvalStatus == 0) {
            this.pInfo.nos.push(selections[i].no)
          }
        }
        if (this.pInfo.nos.length < 1) {
          this.$message.error("无可发起审批的付款单");
          return false;
        }
        this.pInfo.status = 3;
        this.pInfo.title = '批量审批'
        this.pInfo.placeholder = '审批留言'
        this.$refs.formP.dialog = true
      },
      // 单个审批
      approvesOne(obj) {
        // 对账完成, 且审批未开始,且对账状态为成功
        if (!(obj.status == 1 && obj.approvalStatus == 0 && obj.checkStatus == 1)) {
          this.$message.error("付款单当前状态无法发起审批");
          return false;
        }
        this.pInfo.nos = [obj.no]
        this.pInfo.status = 3;
        this.pInfo.title = '单个审批'
        this.pInfo.placeholder = '审批留言'
        this.$refs.formP.dialog = true
      },
      //批量作废
      invalidBill() {
        var selections = this.crud.selections
        if (selections.length < 1) {
          this.$message.error("请选择需要作废的结算单");
          return false;
        }
        this.pInfo.nos = [];
        // 是否包含审批通过的的
        var hasapproOrder = false, approvalStr = '';
        for (var i in selections) {
          console.log(selections[i])
          if (selections[i].invalidApprovalStatus != null && selections[i].invalidApprovalStatus != 0) {
            // 如果说作废状态不为 0 ,就是说付款单在作废中,所以不允许发起作废, 跳出本次循环
            continue;
          }
          // 草稿 可直接作废
          if ((selections[i].status == 0)) {
            this.pInfo.nos.push(selections[i].no);
          }
          // 已对账  未审批或审批驳回的可以直接作废
          if (selections[i].status == 1 && (selections[i].approvalStatus == 0 || selections[i].approvalStatus == 3)) {
            this.pInfo.nos.push(selections[i].no);
          }
          // 待付款 作废的话需要重新发起审批
          if (selections[i].status == 2) {
            hasapproOrder = true;
            approvalStr += selections[i].no + ',';
            this.pInfo.nos.push(selections[i].no);
          }
        }
        if (this.pInfo.nos.length < 1) {
          this.$message.error("无可作废的付款单");
          return false;
        }
        if (hasapproOrder) {
          this.$confirm(approvalStr + '付款单已审批通过,作废需要发起审批,确认作废吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.pInfo.status = 7
            this.pInfo.title = '作废付款单'
            this.pInfo.placeholder = '作废留言'
            this.$refs.formP.dialog = true
          })
        } else {
          this.pInfo.status = 7;
          this.pInfo.title = '作废付款单'
          this.pInfo.placeholder = '作废留言'
          this.$refs.formP.dialog = true
        }
      },
      invalidBillOne(obj) {
        this.pInfo.nos = [obj.no];
        if (obj.invalidApprovalStatus != null && obj.invalidApprovalStatus != 0) {
          this.$message.error("付款单当前状态无法发起审批");
          return false;
        }
        // 已对账  未审批或审批驳回的可以直接作废
        if (obj.status == 1 && (obj.approvalStatus == 1 || obj.approvalStatus == 2)) {
          this.$message.error("付款单当前状态无法发起审批");
          return false;
        }
        if (obj.status == 2) {
          this.$confirm(obj.no + '付款单已审批通过,作废需要发起审批,确认作废吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.pInfo.status = 7
            this.pInfo.title = '作废付款单'
            this.pInfo.placeholder = '作废留言'
            this.$refs.formP.dialog = true
          })
        } else {
          this.pInfo.status = 7;
          this.pInfo.title = '作废付款单'
          this.pInfo.placeholder = '作废留言'
          this.$refs.formP.dialog = true
        }
      },
      // 批量对账
      checkA() {
        var selections = this.crud.selections;
        if (selections.length < 1) {
          this.$message.error("请选择需要对账的付款单");
          return false;
        }
        this.cInfo.nos = [];
        for (var i in selections) {
          // 只有草稿状态完的订单才能发起审批 或对账状态下的 对账异常
          if (selections[i].status == 0 || (selections[i].status == 1 && selections[i].checkStatus == 2)) {
            this.cInfo.nos.push(selections[i].no)
          }
        }
        if (this.cInfo.nos.length < 1) {
          this.$message.error("无可对账的付款单");
          return false;
        }
        this.cInfo.title = '付款单对账'
        this.cInfo.placeholder = '对账备注'
        this.$refs.formC.dialog = true;
      },
      // 单个对账
      checkAOne(obj) {
        // 只有草稿状态完的订单才能发起审批 或对账状态下的 对账异常
        if (obj.status != 0 && !(obj.status == 1 && obj.checkStatus == 2)) {
          this.$message.error("付款单当前状态无法进行对账操作");
          return false;
        }
        this.cInfo.nos = [obj.no];
        this.cInfo.title = '付款单对账'
        this.cInfo.placeholder = '对账备注'
        this.$refs.formC.dialog = true;
      },
      // 单个付款
      payA(obj) {
        var that = this;
        // 现获取订单信息详情
        crudPay.getDetail(obj.id).then(res => {
          if (res.pay.status != 2) {
            that.$message.error("当前状态下无法进行付款");
            return false;
          }
          // 订单允许作废
          if (!(res.pay.invalidApprovalStatus == null || res.pay.invalidApprovalStatus == 0 || res.pay.invalidApprovalStatus == 3)) {
            that.$message.error("订单正处于作废中,请拒绝作废再处理");
            return false;
          }
          that.paymentForm = res.pay;
          that.paymentForm.balance = res.pay.shouldPay;
          that.paymentShow = true;
          this.paymentLoading = false;
        })
      },
      // 监听支付金额改变
      paymentFormChange(val) {
        // 实付 > 应付
        if (Number.parseFloat(val) > Number.parseFloat(this.paymentForm.shouldPay)) {
          this.$message.error("支付金额不得大于应付金额");
          this.paymentForm.payAmount = 0;
          this.paymentForm.balance = this.paymentForm.shouldPay;
          return false;
        }
        this.paymentForm.balance = Number.parseFloat(this.paymentForm.shouldPay) - Number.parseFloat(val);
        this.paymentForm.balance = Number.parseFloat(this.paymentForm.balance).toFixed(2);
      },
      // 提交付款
      paymentOrder() {
        var obj = {
          payFee: this.paymentForm.payAmount,
          remark: this.paymentForm.remark,
          payId: this.paymentForm.id
        }
        this.paymentLoading = true
        crudPay.payment(obj).then(res => {
          this.crud.refresh()
          this.paymentShow = false;
          this.paymentLoading = false;
        })
      },
      // 查看详情
      detail(data) {
        let payId = data.id;
        this.payId = payId
        this.$refs.dialogD.loading = true
        this.$refs.dialogD.dialogVisible = true
      },
      // 显示二维码
      showQrCode(url, url2) {
        this.qrcodeobj.show = true
        this.qrcodeobj.value = url
        this.qrcodeobj.value2 = url2
      },
    }
  }


</script>

<style scoped>

</style>
