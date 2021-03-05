<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div
        style="text-align: center;display:flex;flex-direction: row;justify-content: space-around;align-items: center;background: #ccc;">
        <h4>供应商变更单号: {{form.billCode}}</h4>
        <h2>供应商变更单</h2>
        <h4>单据状态
          <span style="color: red;">{{dict.label.approval_status[form.approvalStatus]}}</span>
        </h4>
      </div>
      <el-main>
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="6rem">
          <h3 style="margin-top:20px">变更单信息</h3>
          <el-divider></el-divider>
          <el-row :gutter="21">
            <el-col :xs=24 :sm=6 :md=6 :lg=6>
              <el-form-item label="操作类型">
                <span v-if="form.updateType==0">新增变更单</span>
                <span v-if="form.updateType==1">修改</span>
              </el-form-item>
            </el-col>
            <el-col :xs=24 :sm="{span:8,offset:3}" :md=8 :lg=8>
              <el-form-item label="生效日期">
                <el-date-picker v-model="form.takeEffectDate" type="date" placeholder="选择生效日期"/>
              </el-form-item>
            </el-col>
            <el-col :xs=24 :sm=7 :md=7 :lg=7>
              <el-form-item label="专柜合同单号" prop="contractApprovalNo" label-width="9.125rem">
                {{form.contractApprovalNo}}
              </el-form-item>
            </el-col>
          </el-row>

          <h3>供应商基础信息</h3>
          <el-divider></el-divider>
          <el-row :gutter="20">
            <el-col :xs=24 :sm=6 :md=6 :lg=6>
              <el-form-item label="供应商名称" prop="merchantName" label-width="8rem">
                <el-input v-model="form.merchantName"/>
              </el-form-item>
            </el-col>
            <!-- 供应商编码 无数据 -->
            <el-col :xs=24 :sm="{span:6,offset:3}" :md="{span:6,offset:1}" :lg=6>

                <el-form-item label="供应商编码" label-width="8rem">
                <el-input v-model="form.merchantCode" readonly/>
              </el-form-item>

            </el-col>
            <el-col :xs=24 :sm="{span:6,offset:3}" :md="{span:6,offset:1}" :lg=6>
              <el-form-item label="供应商类型" prop="merchantType" label-width="8rem">
                <el-select v-model="form.merchantType" filterable placeholder="请选择">
                  <el-option v-for="item in dict.merchant_type" :key="item.id" :label="item.label" :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs=24 :sm=6 :md=6 :lg=6>
              <el-form-item label="供应商类别" prop="merchantCategory" label-width="8rem">
                <el-select v-model="form.merchantCategory" filterable placeholder="请选择">
                  <el-option v-for="item in dict.merchant_category" :key="item.id" :label="item.label"
                             :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs=24 :sm="{span:6,offset:3}" :md="{span:6,offset:1}" :lg=6>
              <el-form-item label="供应商业态" label-width="8rem">
                <el-select v-model="form.merchantFormat" filterable placeholder="请选择">
                  <el-option v-for="item in dict.merchant_format" :key="item.id" :label="item.label"
                             :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
           <!--  <el-col :xs=6 :sm=6 :md=6 :lg=6>
              <el-form-item label="合作伙伴">
                <el-input v-model="form.partners"/>
              </el-form-item>
            </el-col>
            <el-col :xs="{span:6,offset:12}" :sm="{span:6,offset:12}" :md=6 :lg=6>
              <el-form-item label="初始密码">
                <el-input v-model="form.initPassword"/>
              </el-form-item>
            </el-col>
            <el-col :xs=6 :sm=6 :md=6 :lg=6>
              <el-form-item label="经营性质">
                <el-input v-model="form.manageNature"/>
              </el-form-item>
            </el-col> -->
            <el-col :xs=24 :sm="{span:6,offset:3}" :md="{span:6,offset:1}" :lg=6>
              <el-form-item label="邮政编码">
                <el-input v-model="form.postCode" />
              </el-form-item>
            </el-col>
          <!--   <el-col :xs=6 :sm=6 :md=6 :lg=6>
              <el-form-item label="SCM权限">
                <el-select v-model="form.scmPower" filterable placeholder="请选择">
                  <el-option v-for="item in dict.scm_power" :key="item.id" :label="item.label" :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col> -->
            <el-col :xs=24 :sm=6 :md=6 :lg=6>
              <el-form-item label="企业性质">
                <el-input v-model="form.companyNature"/>
              </el-form-item>
            </el-col>
           <!--  <el-col :xs=6 :sm=6 :md=6 :lg=6>
              <el-form-item label="主页地址">
                <el-input v-model="form.domain"/>
              </el-form-item>
            </el-col> -->
       <!--      <el-col :xs="{span:6,offset:12}" :sm="{span:6,offset:12}" :md=6 :lg=6>
              <el-form-item label="使用令牌">
                <el-select v-model="form.useToken" filterable placeholder="请选择">
                  <el-option v-for="item in dict.is_true" :key="item.id" :label="item.label" :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col> -->
            <el-col :xs=24 :sm="{span:6,offset:3}" :md="{span:6,offset:1}" :lg=6>
              <el-form-item label="经营范围">
                <el-input v-model="form.manageRange"/>
              </el-form-item>
            </el-col>
            <el-col :xs=24 :sm=6 :md="{span:6,offset:1}" :lg=6>
              <el-form-item label="行政区域" style="width: 11rem;">
                <el-cascader
                  v-model="form.addressCity"
                  :options="cityData"
                  @change="handleCityChange" style="width:15rem"></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :xs=24 :sm=6 :md=6 :lg=6>
              <el-form-item label="供应商简介" label-width="7rem">
                <el-input v-model="form.merchantSynopsis"/>
              </el-form-item>
            </el-col>
            <el-col :xs=24 :sm="{span:6,offset:3}" :md="{span:6,offset:1}" :lg=6>
              <el-form-item label="品牌简介">
                <el-input v-model="form.brandSynopsis"/>
              </el-form-item>
            </el-col>
          </el-row>
          <h3>供应商联系信息</h3>
          <el-divider></el-divider>
          <el-row :gutter="20">
            <el-col :xs=24 :sm=6 :md=6 :lg=6>
              <el-form-item label="联系人">
                <el-input v-model="form.contacts"/>
              </el-form-item>
            </el-col>
            <el-col :xs=24 :sm="{span:6,offset:3}" :md="{span:6,offset:1}" :lg=6>
              <el-form-item label="联系手机">
                <el-input v-model="form.contactsPhone"/>
              </el-form-item>
            </el-col>
            <el-col :xs=24 :sm="{span:6,offset:3}" :md="{span:6,offset:1}" :lg=6>
              <el-form-item label="联系电话">
                <el-input v-model="form.contactsTel"/>
              </el-form-item>
            </el-col>
            <el-col :xs=24 :sm=6 :md=6 :lg=6>
              <el-form-item label="联系人头衔" label-width="90px">
                <el-input v-model="form.contactsTitle"/>
              </el-form-item>
            </el-col>
      <!--       <el-col :xs=6 :sm=6 :md=6 :lg=6>
              <el-form-item label="订货邮箱">
                <el-input v-model="form.orderGoodsEmail"/>
              </el-form-item>
            </el-col>
            <el-col :xs="{span:6,offset:12}" :sm="{span:6,offset:12}" :md=6 :lg=6>
              <el-form-item label="联系传真">
                <el-input v-model="form.contactsFax"/>
              </el-form-item>
            </el-col>
            <el-col :xs=6 :sm=6 :md=6 :lg=6>
              <el-form-item label="订货方式">
                <el-select v-model="form.orderGoodsWay" filterable placeholder="请选择">
                  <el-option v-for="item in dict.order_goods_way" :key="item.id" :label="item.label"
                             :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>-->
            <el-col :xs=24 :sm="{span:6,offset:3}" :md="{span:6,offset:1}" :lg=6>
              <el-form-item label="订货电话">
                <el-input v-model="form.orderGoodsPhone"/>
              </el-form-item>
            </el-col>
            <el-col :xs=24 :sm="{span:6,offset:3}" :md="{span:6,offset:1}" :lg=6>
              <el-form-item label="总经理">
                <el-input v-model="form.generalManager"/>
              </el-form-item>
            </el-col>
            <el-col :xs=24 :sm=6 :md=6 :lg=6>
              <el-form-item label="区域">
                <el-select v-model="form.merchantArea" filterable placeholder="请选择">
                  <el-option v-for="item in dict.merchant_area" :key="item.id" :label="item.label" :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs=24 :sm="{span:6,offset:3}" :md="{span:6,offset:1}" :lg=6>
              <el-form-item label="地址">
                <el-input v-model="form.address"/>
              </el-form-item>
            </el-col>
            <!-- <el-col :xs="{span:6,offset:12}" :sm="{span:6,offset:12}" :md=6 :lg=6>
              <el-form-item label="配送中心">
                <el-input v-model="form.deliveryCentre"/>
              </el-form-item>
            </el-col> -->
          </el-row>
          <h3>供应商票务结算信息</h3>
          <el-divider></el-divider>
          <el-row :gutter="20">
            <el-col :xs=24 :sm=6 :md=6 :lg=6>
              <el-form-item label="税务登记号" label-width="82px">
                <el-input v-model="form.taxId" style="width: 13rem;"/>
              </el-form-item>
            </el-col>
            <el-col :xs=24 :sm="{span:6,offset:3}" :md="{span:6,offset:1}" :lg=6>
              <el-form-item label="进项税率">
                <el-select v-model="form.incomeTaxRate" filterable placeholder="请选择">
                  <el-option v-for="item in dict.income_tax_rate" :key="item.id" :label="item.label+'%'"
                             :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs=24 :sm="{span:6,offset:3}" :md="{span:6,offset:1}" :lg=6>
              <el-form-item label="发票类型">
                <el-select v-model="form.invoiceType" filterable placeholder="请选择">
                  <el-option v-for="item in dict.invoice_type" :key="item.id" :label="item.label" :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs=24 :sm=6 :md=6 :lg=6>
              <el-form-item label="开户银行">
                <el-input v-model="form.openBank"/>
              </el-form-item>
            </el-col>
           <!--  <el-col :xs=6 :sm=6 :md=6 :lg=6>
              <el-form-item label="试销计划销售额" label-width="110px">
                <el-input v-model="form.trySalesAmount" style="width: 10rem;"/>
              </el-form-item>
            </el-col>
            <el-col :xs="{span:6,offset:12}" :sm="{span:6,offset:12}" :md=6 :lg=6>
              <el-form-item label="最大倒挂金额" label-width="100px">
                <el-input v-model="form.maxInvertedAmount" style="width: 10rem;"/>
              </el-form-item>
            </el-col> -->
            <el-col :xs=24 :sm="{span:6,offset:3}" :md="{span:6,offset:1}" :lg=6>
              <el-form-item label="账户名称">
                <el-input v-model="form.accountName"/>
              </el-form-item>
            </el-col>
            <el-col :xs=24 :sm="{span:6,offset:3}" :md="{span:6,offset:1}" :lg=6>
              <el-form-item label="账号">
                <el-input  v-model="form.account"/>
              </el-form-item>
            </el-col>
           <!--  <el-col :xs=6 :sm=6 :md=6 :lg=6>
              <el-form-item label="最小订货金额" label-width="100px">
                <el-input v-model="form.minOrderGoodsAmount" style="width: 10rem;"/>
              </el-form-item>
            </el-col>
            <el-col :xs="{span:6,offset:12}" :sm="{span:6,offset:12}" :md=6 :lg=6>
              <el-form-item label="付款日">
                <el-input v-model="form.payDay"/>
              </el-form-item>
            </el-col> -->
            <el-col :xs=24 :sm=6 :md=6 :lg=6>
              <el-form-item label="付款周期">
                <el-input type="number" :min="1" v-model="form.payCycle"/>
              </el-form-item>
            </el-col>
          <!--   <el-col :xs="{span:6,offset:12}" :sm="{span:6,offset:12}" :md=6 :lg=6>
              <el-form-item label="自收款扣率" label-width="85px">
                <el-input v-model="form.selfCollectionRate"/>
              </el-form-item>
            </el-col> -->
         <!--    <el-col :xs=6 :sm=6 :md=6 :lg=6>
              <el-form-item label="延期付款天数" label-width="100px">
                <el-input v-model="form.delayPayDay" type="number" style="width: 10rem;"/>
              </el-form-item>
            </el-col> -->
            <el-col :xs=24 :sm="{span:6,offset:3}" :md="{span:6,offset:1}" :lg=6>
              <el-form-item label="结款方式">
                <el-select v-model="form.settlementWay" filterable placeholder="请选择">
                  <el-option v-for="item in dict.settlement_way" :key="item.id" :label="item.label"
                             :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- <el-col :xs=6 :sm=6 :md=6 :lg=6>
              <el-form-item label="支付行号">
                <el-input v-model="form.bankAccount"/>
              </el-form-item>
            </el-col>
            <el-col :xs="{span:6,offset:12}" :sm="{span:6,offset:12}" :md=6 :lg=6>
              <el-form-item label="POSID">
                <el-input v-model="form.posid"/>
              </el-form-item>
            </el-col>-->
          </el-row>
          <h3>供应商票务结算信息</h3>
          <el-divider></el-divider>
          <el-row :gutter="20">
            <el-col :xs=24 :sm=6 :md=6 :lg=6>
              <el-form-item label="管理库存">
                <el-input type="number" :min="1" v-model="form.manageInventory"/>
              </el-form-item>
            </el-col>
            <!-- <el-col :xs="{span:6,offset:12}" :sm="{span:6,offset:3}" :md="{span:6,offset:1}" :lg=6>
              <el-form-item label="订货有效期" label-width="100px">
                <el-input v-model="form.orderGoodsValidDate"/>
              </el-form-item>
            </el-col>
            <el-col :xs=6 :sm="{span:6,offset:3}" :md="{span:6,offset:1}" :lg=6>
              <el-form-item label="订货周期">
                <el-input v-model="form.orderGoodsCycle"/>
              </el-form-item>
            </el-col>
            <el-col :xs="{span:6,offset:12}" :sm=6 :md=6 :lg=6>
              <el-form-item label="订货日(按日)" label-width="100px">
                <el-input v-model="form.orderGoodsDay"/>
              </el-form-item>
            </el-col>
            <el-col :xs=6 :sm="{span:6,offset:3}" :md="{span:6,offset:1}" :lg=6>
              <el-form-item label="期望送货时间" label-width="100px">
                <el-input v-model="form.expectedDeliveryDate" style="width: 10rem;"/>
              </el-form-item>
            </el-col>
            <el-col :xs="{span:6,offset:12}" :sm="{span:6,offset:3}" :md="{span:6,offset:1}" :lg=6>
              <el-form-item label="订货日">
                <el-input v-model="form.orderGoodsDayDate" type="number"/>
              </el-form-item>
            </el-col>
            <el-col :xs=6 :sm=6 :md=6 :lg=6>
              <el-form-item label="送货期">
                <el-input v-model="form.deliveryDate"/>
              </el-form-item>
            </el-col>
            <el-col :xs="{span:6,offset:12}" :sm="{span:6,offset:3}" :md="{span:6,offset:1}" :lg=6>
              <el-form-item label="采购负责人" label-width="100px">
                <el-input v-model="form.buyingPeople"/>
              </el-form-item>
            </el-col>-->
            <el-col :xs=24 :sm="{span:6,offset:3}" :md="{span:6,offset:1}" :lg=6>
              <el-form-item label="付款状态">
                <el-select v-model="form.payStatus" filterable placeholder="请选择">
                  <el-option v-for="item in dict.settlement_status" :key="item.id" :label="item.label"
                             :value="item.value"/>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- <el-col :xs="{span:6,offset:12}" :sm=6 :md=6 :lg=6>
              <el-form-item label="最小订货箱数" label-width="100px">
                <el-input v-model="form.minOrderGoodsNums" type="number"/>
              </el-form-item>
            </el-col>
            <el-col :xs=6 :sm="{span:6,offset:3}" :md="{span:6,offset:1}" :lg=6>
              <el-form-item label="试销期">
                <el-input v-model="form.trySaleDate"/>
              </el-form-item>
            </el-col> -->
          </el-row>
        </el-form>
      </el-main>
      <div v-if="form.approvalStatus==0" slot="footer" class="dialog-footer" style="position:relative;height: 35px;">
        <el-button type="primary" @click="submitData" style="position:absolute;right:35px;">确认</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import systemCity from "@/api/systemCity";
  import merchant from "@/api/merchant";

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
    approvalId: null,
    approvalStatus: 0,
    createTime: null,
    updateTime: null,
    createBy: null,
    updateBy: null,
    isDel: null,
    billCode: null,
    updateType: null,
    takeEffectDate: null,
    contractApprovalNo: null
  }
  export default {
    name: 'MerchantAdd',
    dicts: ['merchant_type', 'merchant_category', 'approval_status', 'merchant_format', 'scm_power', 'is_true', 'order_goods_way', 'merchant_area', 'income_tax_rate', 'invoice_type', 'settlement_way', 'settlement_status', 'update_type'],
    data() {
      return {
        permission: {
          add: ['admin', 'merchant:add'],
          edit: ['admin', 'merchant:edit'],
          del: ['admin', 'merchant:del']
        },
        readonly: true,
        form: defaultForm,
        rules: {
          merchantName: [{required: true, message: '供应商名称不能为空', trigger: 'blur'}],
          merchantCode: [{required: true, message: '供应商编码不能为空', trigger: 'blur'}],
          merchantType: [{required: true, message: '供应商类型不能为空', trigger: 'blur'}],
          merchantCategory: [{required: true, message: '供应商类别不能为空', trigger: 'blur'}],
          contractApprovalNo: [{required: true, message: '合同审批号不能为空', trigger: 'blur'}],
        },
        cityData: [],// 省市区数据
      }
    },
    watch: {},
    mounted() {
      var merchantId = this.$route.params.merchantId;
      if (typeof (merchantId) != 'undefined') {
        this.getData(merchantId);
      }

      this.getCityData();
    },
    methods: {
      // 获取商户详情信息
      getData(merchantId) {
        if(merchantId != null){
        merchant.getMerchantInfo(merchantId).then(res => {
          this.form = res;
          var isEdit = this.$route.params.isEdit;
          // 删除 2 修改 1 新增 0
          if (typeof (isEdit) != 'undefined') {
            console.log(isEdit)
            if (isEdit) {
              this.form.updateType = 0;
              this.form.approvalStatus = 0;
            } else {
              this.form.updateType = 1;
            }
          } else {
            this.form.updateType = 1;
          }
        })}
      },
      submitData() {
        console.log(this.form);
        var obj = this.form;
        merchant.add(obj).then(res => {
          this.$message.success("数据添加成功!")
          this.$router.push({path: '/operate/merchantInfo'})
        })
      },
      // 设置省市区
      handleCityChange(res) {
        console.log(res);
        this.form.addressProvince = res[0];
        this.form.addressCity = res[1];
      },
      // 获取省市数据
      getCityData() {
        systemCity.all().then(res => {
          this.cityData = res;
        })
      }
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

  .el-divider--horizontal {
    margin: 0px 0px 7px 0px;
    background: 0 0;
    width: 100%;
    border-top: 1px solid #e8eaec;
  }

  .el-input {
    width: 14rem;
  }

  h3 {
    margin: 7px 0;
  }

  .el-select {
    width: 10rem;
  }
</style>
