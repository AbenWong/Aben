<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
     <!--    <el-input v-model="query.merchantName" clearable placeholder="供应商名称" style="width: 200px;" class="filter-item"/>  -->
        <my-select v-model="query.merchantName" :placeholder="'请选择供应商'"
                        :downdropType="'merchant/merchant-downdrop'"/>
        <el-input v-model="query.merchantCode" clearable placeholder="供应商编码" style="width: 200px;" class="filter-item"/>
        <el-input v-model="query.contacts" clearable placeholder="联系人" style="width: 200px;" class="filter-item"/>
        <rrOperation :crud="crud"/>
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission"/>
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0"
                 :title="crud.status.title" width="800px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="单据编号">
            <el-input v-model="form.billCode"/>
          </el-form-item>
          <span>变更单信息</span>
          <el-divider></el-divider>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="操作类型">
                <el-select v-model="form.updateType" filterable placeholder="请选择">
                  <el-option v-for="item in dict.update_type" :key="item.id" :label="item.label" :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="生效日期">
                <el-input v-model="form.takeEffectDate"/>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="合同审批单号">
                <el-input v-model="form.contractApprovalNo"/>
              </el-form-item>
            </el-col>
          </el-row>
          <span>供应商基础信息</span>
          <el-divider></el-divider>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="供应商名称" prop="merchantName">
                <el-input v-model="form.merchantName"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="供应商类型" prop="merchantType">
                <el-select v-model="form.merchantType" filterable placeholder="请选择">
                  <el-option v-for="item in dict.merchant_type" :key="item.id" :label="item.label" :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="供应商类别">
                <el-select v-model="form.merchantCategory" filterable placeholder="请选择">
                  <el-option v-for="item in dict.merchant_category" :key="item.id" :label="item.label"
                             :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="供应商业态">
                <el-select v-model="form.merchantFormat" filterable placeholder="请选择">
                  <el-option v-for="item in dict.merchant_format" :key="item.id" :label="item.label"
                             :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合作伙伴">
                <el-input v-model="form.partners"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="初始密码">
                <el-input v-model="form.initPassword"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="经营性质">
                <el-input v-model="form.manageNature"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="邮政编码">
                <el-input v-model="form.postCode"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="SCM权限">
                <el-select v-model="form.scmPower" filterable placeholder="请选择">
                  <el-option v-for="item in dict.scm_power" :key="item.id" :label="item.label" :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="企业性质">
                <el-input v-model="form.companyNature"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="主页地址">
                <el-input v-model="form.domain"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="使用令牌">
                <el-select v-model="form.useToken" filterable placeholder="请选择">
                  <el-option v-for="item in dict.is_true" :key="item.id" :label="item.label" :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="经营范围">
                <el-input v-model="form.manageRange"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="省">
                <el-input v-model="form.addressProvince"/>
              </el-form-item>
              <!--<el-form-item label="市">
                <el-input v-model="form.addressCity"/>
              </el-form-item>
              <el-form-item label="区">
                <el-input v-model="form.addressArea"/>
              </el-form-item>-->
            </el-col>
            <el-col :span="6">
              <el-form-item label="供应商简介">
                <el-input v-model="form.merchantSynopsis"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="品牌简介">
                <el-input v-model="form.brandSynopsis"/>
              </el-form-item>
            </el-col>
          </el-row>
          <span>供应商联系信息</span>
          <el-divider></el-divider>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="联系人">
                <el-input v-model="form.contacts"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系手机">
                <el-input v-model="form.contactsPhone"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系电话">
                <el-input v-model="form.contactsTel"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系人头衔">
                <el-input v-model="form.contactsTitle"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="订货邮箱">
                <el-input v-model="form.orderGoodsEmail"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系传真">
                <el-input v-model="form.contactsFax"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="订货方式">
                <el-select v-model="form.orderGoodsWay" filterable placeholder="请选择">
                  <el-option v-for="item in dict.order_goods_way" :key="item.id" :label="item.label"
                             :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="订货电话">
                <el-input v-model="form.orderGoodsPhone"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="总经理">
                <el-input v-model="form.generalManager"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="区域">
                <el-select v-model="form.merchantArea" filterable placeholder="请选择">
                  <el-option v-for="item in dict.merchant_area" :key="item.id" :label="item.label" :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="地址">
                <el-input v-model="form.address"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="配送中心">
                <el-input v-model="form.deliveryCentre"/>
              </el-form-item>
            </el-col>
          </el-row>
          <span>供应商票务结算信息</span>
          <el-divider></el-divider>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="税务登记号">
                <el-input v-model="form.taxId"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="进项税率">
                <el-select v-model="form.incomeTaxRate" filterable placeholder="请选择">
                  <el-option v-for="item in dict.income_tax_rate" :key="item.id" :label="item.label+'%'"
                             :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="发票类型">
                <el-select v-model="form.invoiceType" filterable placeholder="请选择">
                  <el-option v-for="item in dict.invoice_type" :key="item.id" :label="item.label" :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="开户银行">
                <el-input v-model="form.openBank"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="试销计划销售额">
                <el-input v-model="form.trySalesAmount"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="最大倒挂金额">
                <el-input v-model="form.maxInvertedAmount"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="账户名称">
                <el-input v-model="form.accountName"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="账号">
                <el-input v-model="form.account"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="最小订货金额">
                <el-input v-model="form.minOrderGoodsAmount"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="付款日">
                <el-input v-model="form.payDay"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="付款周期">
                <el-input v-model="form.payCycle"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="自收款扣率">
                <el-input v-model="form.selfCollectionRate"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="延期付款天数">
                <el-input v-model="form.delayPayDay"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="结款方式">
                <el-select v-model="form.settlementWay" filterable placeholder="请选择">
                  <el-option v-for="item in dict.settlement_way" :key="item.id" :label="item.label"
                             :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="支付行号">
                <el-input v-model="form.bankAccount"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="POSID">
                <el-input v-model="form.posid"/>
              </el-form-item>
            </el-col>
          </el-row>
          <span>供应商票务结算信息</span>
          <el-divider></el-divider>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="管理库存">
                <el-input type="number" v-model="form.manageInventory"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="订货有效期">
                <el-input v-model="form.orderGoodsValidDate"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="订货周期">
                <el-input v-model="form.orderGoodsCycle"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="订货日(按日)">
                <el-input v-model="form.orderGoodsDay"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="期望送货时间">
                <el-input v-model="form.expectedDeliveryDate"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="订货日">
                <el-input v-model="form.orderGoodsDayDate"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="送货期">
                <el-input v-model="form.deliveryDate"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="采购负责人">
                <el-input v-model="form.buyingPeople"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="付款状态">
                <el-select v-model="form.payStatus" filterable placeholder="请选择">
                  <el-option v-for="item in dict.settlement_status" :key="item.id" :label="item.label"
                             :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="最小订货箱数">
                <el-input v-model="form.minOrderGoodsNums"/>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="试销期">
                <el-input v-model="form.trySaleDate"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;"
                @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55"/>
        <el-table-column v-if="columns.visible('billCode')" prop="billCode" label="单据编号"/>
        <el-table-column prop="merchantCode" label="供应商编码"/>
        <el-table-column v-if="columns.visible('merchantName')" prop="merchantName" label="供应商"/>
        <el-table-column v-if="columns.visible('merchantType')" prop="merchantType" label="供应商类型">
          <template slot-scope="scope">
            {{ dict.label.merchant_type[scope.row.merchantType] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('updateType')" prop="updateType" label="操作类型">
          <template slot-scope="scope">
            {{ dict.label.update_type[scope.row.updateType] }}
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
           <!--  {{ dict.label.approval_status[scope.row.approvalStatus] }} -->
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
        <el-table-column v-permission="['admin','merchant:edit','merchant:del']" label="操作" width="150px"
                         align="center">
          <template slot-scope="scope">
            <!--<udOperation :data="scope.row" :permission="permission"/>-->
            <el-link type="primary" :underline="false" v-if="scope.row.approvalStatus==0" v-permission="permission.edit"
                     @click="editbatch(scope.row.id)">编辑
            </el-link>
            <el-link type="primary" :underline="false" v-if="scope.row.approvalStatus==0" v-permission="permission.edit"
                     @click="approval(scope.row)">发起审批
            </el-link>
            <el-link type="primary" :underline="false" v-if="scope.row.approvalStatus!=0"
                     @click="merchantDetails(scope.row.id)">详情
            </el-link>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <div style="height: 40px;margin-top: 20px">
        <el-row>
          <el-col :span="12">
            <el-button type="primary" @click="showEdit=true">制单</el-button>
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
        <qriously :value="qrcodeobj.value" :size="200"/>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="qrcodeobj.show = false">取 消</el-button>
        <el-button type="primary" @click="qrcodeobj.show = false">确 定</el-button>
      </span>
    </el-dialog>


    <!-- 制单 -->
    <el-dialog append-to-body title="新建供应商变更单" :visible.sync="showEdit" width="20%">
      <el-form ref="form" :inline="true" size="small" label-width="100px">
        <el-form-item label="供应商" prop="merchantNo" style=" width: 350px;">
          <!-- <my-select v-model="editMerchantId" :placeholder="'请选择供应商'" :downdropType="'merchant/merchant-downdrop'"/> -->
          <my-select v-model="editMerchantId" :placeholder="'请选择供应商'"
                        :downdropType="'merchant/merchant-downdrop'"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="showEdit =false">取消</el-button>
        <el-button type="primary" @click="doEdit">确认</el-button>
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
  import MaterialList from "@/components/material";
  import crudMerchant from "@/api/merchant";
  import MySelect from '@/components/MySelect'
  // crud交由presenter持有
  const defaultCrud = CRUD({
    title: '供应商变更单',
    url: 'api/merchant',
    sort: 'id,desc',
    crudMethod: {...crudMerchant},
    optShow: {
      add: false,
      edit: false,
      del: false,
      download: false
    },
  })
  const defaultForm = {
    id: null,
    merchantName: null,
    merchantCode: null,
    merchantType: null,
    merchantCategory: null,
    merchantFormat: null,
    partners: null,
    initPassword: null,
    manageNature: null,
    postCode: null,
    scmPower: null,
    companyNature: null,
    domain: null,
    useToken: null,
    manageRange: null,
    addressProvince: null,
    addressCity: null,
    addressArea: null,
    merchantSynopsis: null,
    brandSynopsis: null,
    contacts: null,
    contactsPhone: null,
    contactsTel: null,
    contactsTitle: null,
    orderGoodsEmail: null,
    contactsFax: null,
    orderGoodsWay: null,
    orderGoodsPhone: null,
    generalManager: null,
    merchantArea: null,
    address: null,
    deliveryCentre: null,
    taxId: null,
    incomeTaxRate: null,
    invoiceType: null,
    openBank: null,
    trySalesAmount: null,
    maxInvertedAmount: null,
    accountName: null,
    account: null,
    minOrderGoodsAmount: null,
    payDay: null,
    payCycle: null,
    selfCollectionRate: null,
    delayPayDay: null,
    settlementWay: null,
    bankAccount: null,
    posid: null,
    manageInventory: null,
    orderGoodsValidDate: null,
    orderGoodsCycle: null,
    orderGoodsDay: null,
    expectedDeliveryDate: null,
    orderGoodsDayDate: null,
    deliveryDate: null,
    buyingPeople: null,
    payStatus: null,
    minOrderGoodsNums: null,
    trySaleDate: null,
    wxApprovalId: null,
    wxApprovalStatus: null,
    createTime: null,
    updateTime: null,
    createBy: null,
    updateBy: null,
    isDel: null,
    billCode: null,
    updateType: null
  }
  export default {
    name: 'Merchant',
    components: {MySelect, pagination, crudOperation, rrOperation, udOperation, MaterialList},
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    dicts: ['merchant_type', 'merchant_category', 'merchant_format', 'scm_power', 'is_true', 'order_goods_way', 'merchant_area', 'income_tax_rate', 'invoice_type', 'settlement_way', 'settlement_status', 'update_type', 'approval_status'],
    data() {
      return {
        qrcodeobj: {show: false, value: ''},
        permission: {
          add: ['admin', 'merchant:add'],
          edit: ['admin', 'merchant:edit'],
          del: ['admin', 'merchant:del']
        },
        rules: {
          merchantName:
            [
              {required: true, message: '供应商名称不能为空', trigger: 'blur'}
            ],
          merchantCode:
            [
              {required: true, message: '供应商编码不能为空', trigger: 'blur'}
            ],
          merchantType:
            [
              {required: true, message: '供应商类型不能为空', trigger: 'blur'}
            ]
        },
        showEdit: false,
        editMerchantId: null
      }
    },
    methods: {
      editbatch(merchantId) {
        this.$router.push({name: "merchantEdit", params: {merchantId: merchantId}})
      },
      doEdit() {
        // 这里需要校验数据
        crudMerchant.checkAdd(this.editMerchantId).then(res => {
          this.$router.push({name: "merchantAdd", params: {merchantId: this.editMerchantId, isEdit: true}})
        })
      },
      // 到商品详情页面
      merchantDetails(merchantId) {
        this.$router.push({name: "merchantAdd", params: {merchantId: merchantId}})
      },
      // 发起审批
      approval(row) {
        var that = this;
        if (row.approvalStatus != 0) {
          that.$message.success("已经提交过审批了,请勿重复提交审批")
          return;
        }
        that.$confirm('确认提交审批吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          crudMerchant.approval(row.id).then(res => {
            that.$message.success("发起审批成功")
            setTimeout(function () {
              that.crud.refresh();
            }, 500);
          })
        });
      },
      // 批量审批
      approvalList() {
        var that = this;
        var val = that.crud.selections;
        if (val.length < 1) {
          that.$message.error("请选择需要审批的数据")
          return false;
        }
        // 这里的做法是除去已经发起审核过的数据
        var arr = [], tipstr = '', hasapproval = false;
        for (var i in val) {
          if (val[i].approvalStatus != 0) {
            that.$refs.table.toggleRowSelection(val[i], false);
            tipstr += ' ' + val[i].billCode
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
        that.crud.selections = arr;
        var data = [];
        for (var i in arr) {
          data.push(arr[i].id);
        }

        that.$confirm(tipstr, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          crudMerchant.batchApproval(data).then(res => {
            that.$message.success("发起批量审批成功")
          })
          setTimeout(function () {
            that.crud.refresh();
          }, 500);
        })
      },
      // 显示二维码
      showQrCode(url) {
        this.qrcodeobj.show = true
        this.qrcodeobj.value = url
      },
      // 获取数据前设置好接口地址
      [CRUD.HOOK.beforeRefresh]() {
        const query = this.query
        if (query.type && query.value) {
          this.crud.params[query.type] = query.value
        } else {
          delete this.crud.params.merchantName
          delete this.crud.params.merchantCode
          delete this.crud.params.contacts
        }
        return true
      }, // 新增与编辑前做的操作
      [CRUD.HOOK.afterToCU](crud, form) {
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
