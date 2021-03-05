<template>
  <!-- 详情 -->
  <!-- :direction="'rtl'" -->
  <el-drawer
    title="付款详情" :withHeader="false" :destroy-on-close="true" :visible.sync="dialogVisible" @opened="openDialog"
    v-loading="loading" :size="'50%'">

    <div id="wrap" class="wrap">
      <!-- 详情 -->
      <div id="d-header-id" class="d-header">
        <!-- 详情主体 -->
        <el-row style="line-height: 40px">

          <!--  <el-col :xs="24" :sm="24"  :lg="14" :xl="14"> -->
          <el-col :xs="12" :sm="6" :md="13"
                  style="line-height: 40px; font-size: 18px; font-weight: bold; padding-left: 20px;color:blue">
            {{ detailForm.pay.no }}
          </el-col>
          <el-col :xs="24" :sm="10" :md="5" style="line-height: 40px;font-size:14px">
            <span>单据审批状态: </span>
            <span style="color: red"> {{ getApprovalStatusDesc(detailForm.pay.approvalStatus) }} </span>
          </el-col>
          <el-col :xs="18" :sm="5" :md="3"
                  style="line-height: 40px">
            <el-button @click="clickPrint"><i class="el-icon-printer"></i><span/>打印</el-button>
          </el-col>
          <el-col :xs="3" :sm="2" :md="1" :offset="1" style="line-height: 40px; align-items: center">
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
              <el-col :xs="24" :sm="24" :md="8">
                <div>
                  <span class="head" style="margin-right:.3125rem">创建时间:</span>
                  <span class="content"> {{detailForm.pay.createTime}}</span>
                </div>
              </el-col>
              <el-col :xs="24" :sm="8" :md="8">
                <div class="grid-content ">
                  <span class="head" style="margin-right:.3125rem">制单员:</span>
                  <span class="content"> {{detailForm.pay.uname}}</span>
                </div>
              </el-col>
              <el-col :xs="24" :sm="8" :md="6">
                <div class="grid-content ">
                  <span class="head" style="margin-right:.3125rem">单据状态:</span>
                  <span class="content">{{getStatusDesc(detailForm.pay.status)}}</span>
                </div>
              </el-col>
            </el-row>
          </div>

          <el-row class="nav">
            <h2>付款信息</h2>
          </el-row>
          <div class="line-black"></div>
          <div class="base-wrap">
            <el-row>
              <el-col :xs="24" :sm="12" :md="6">
                <div class="grid-content ">
                  <span class="head" style="margin-right:.3125rem">应付款日期: </span>
                  <span class="content"> {{ detailForm.pay.settleTime }}</span>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="6">
                <div class="grid-content ">
                  <span class="head" style="margin-right:.3125rem"> 付款机构:  </span>
                  <span class="content"> {{ detailForm.pay.deptName }}</span>
                </div>
              </el-col>
              <!--<el-col :xs="24" :sm="12" :md="6">
                <div class="grid-content ">
                  <span class="head" style="margin-right:.3125rem">  付款方式:  </span>
                  <span class="content"> {{ dict.label.settlement_way[detailForm.merchant.settlementWay] }}</span>
                </div>
              </el-col>
              <el-col :xs="24" :sm="12" :md="6">
                <div class="grid-content ">
                  <span class="head" style="margin-right:.3125rem">  付款银行:   </span>
                  <span class="content"> {{ detailForm.merchant.openBank }}</span>
                </div>
              </el-col>-->
            </el-row>

            <el-row class="icontent">
              <el-col :xs="24" :sm="24" :md="11" class="info-wrap">
                <div>
                  <el-row>
                    <el-col :xs="24" :sm="24" :md="24">
                      <div class="grid-content ">
                        <span class="head" style="margin-right:.3125rem"> 账户名称:  </span>
                        <span class="content"> {{ detailForm.merchant.accountName }}</span>
                      </div>

                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <div class="grid-content ">
                        <span class="head" style="margin-right:.3125rem"> 收银账户:  </span>
                        <span class="content"> {{ detailForm.merchant.account }}</span>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <div class="grid-content ">
                        <span class="head" style="margin-right:.3125rem"> 银行账号:  </span>
                        <span class="content"> {{ detailForm.merchant.account }}</span>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <div class="grid-content ">
                        <span class="head" style="margin-right:.3125rem"> 发票类型:  </span>
                        <span class="content"> {{ dict.label.invoice_type[detailForm.merchant.invoiceType] }}</span>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <div class="grid-content ">
                        <span class="head" style="margin-right:.3125rem"> 税额信息:  </span>
                        <span class="content"> {{ detailForm.merchant.incomeTaxRate }}</span>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="24">
                      <div class="grid-content ">
                        <span class="head" style="margin-right:.3125rem"> 余额情况:   </span>
                        <span class="content">{{detailForm.pay.balance}}</span>
                      </div>

                    </el-col>
                  </el-row>
                </div>
              </el-col>
              <el-col :xs="48" :sm="24" :md="13" class="info-wrap">
                <div class="invoice-wrap">
                  <el-row>
                    <!--<el-col :xs="24" :sm="12" :md="12">
                      <div class="grid-content ">
                        <span class="head" style="margin-right:.3125rem"> 账扣费用:   </span>
                        <span class="content"> {{ detailForm.pay.takeOutCost }}</span>
                      </div>
                    </el-col>-->
                    <el-col :xs="24" :sm="12" :md="12">
                      <div class="grid-content ">
                        <span class="head" style="margin-right:.3125rem"> 有效发票:    </span>
                        <span class="content">  {{ detailForm.pay.effectInvoice }}</span>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :xs="24" :sm="12" :md="12">
                      <div class="grid-content ">
                        <span class="head" style="margin-right:.3125rem"> 上期转入(+):   </span>
                        <span class="content">{{ detailForm.pay.preInto }}</span>
                      </div>

                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12">
                      <div class="grid-content ">
                        <span class="head" style="margin-right:.3125rem"> 应开发票额:   </span>
                        <span class="content">{{ detailForm.pay.invoiceValue }}</span>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :xs="24" :sm="12" :md="12">
                      <div class="grid-content ">
                        <span class="head" style="margin-right:.3125rem"> 本期应付(+):  </span>
                        <span class="content">{{ detailForm.pay.shouldPay }}</span>
                      </div>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12">
                      <div class="grid-content ">
                        <span class="head" style="margin-right:.3125rem"> 转入下期(-):  </span>
                        <span class="content"> {{ detailForm.pay.intoNext }}</span>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :xs="24" :sm="12" :md="12">
                      <div class="grid-content ">
                        <span class="head" style="margin-right:.3125rem"> 调整金额(-):  </span>
                        <span class="content"> {{ detailForm.pay.adjustAmount }}</span>
                      </div>
                    </el-col>
                    <el-col :xs="24" :sm="12" :md="12">
                      <div class="grid-content ">
                        <span class="head" style="margin-right:.3125rem"> 付款金额(=):  </span>
                        <span class="content"> {{ detailForm.pay.payAmount }}</span>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :xs="2" :sm="0" :md="0"></el-col>
                  </el-row>
                  <el-row>
                    <el-col :xs="24" :sm="24" :md="24" class="look-up">
                      <div class="grid-content ">
                        <span class="head" style="margin-right:.3125rem"> 付款金额大写:  </span>
                        <span class="content"> {{ detailForm.pay.amountWords }}</span>
                      </div>
                    </el-col>
                  </el-row>
                </div>

              </el-col>
            </el-row>
            <el-row>
              <el-col :xs="24" :sm="0" :md="0"></el-col>
            </el-row>
            <el-row>
              <el-col :xs="24" :sm="8" :md="8">
                <div class="grid-content ">
                  <span class="head" style="margin-right:.3125rem"> 对账状态:  </span>
                  <span class="content"> {{checkStatus(detailForm.pay.checkStatus)}}</span>
                </div>
              </el-col>
              <el-col :xs="24" :sm="16" :md="8">
                <div class="grid-content ">
                  <span class="head" style="margin-right:.3125rem">  对账日期: </span>
                  <span class="content">  {{ detailForm.pay.checkTime }}</span>
                </div>

              </el-col>
              <el-col :xs="24" :sm="8" :md="6">
                <div class="grid-content ">
                  <span class="head" style="margin-right:.3125rem"> 对账人: </span>
                  <span class="content">{{ detailForm.pay.checkUsername }}</span>
                </div>
              </el-col>
            </el-row>

            <el-row>
              <!--<el-col :xs="24" :sm="8" :md="8">
                <div class="grid-content ">
                  <span class="head" style="margin-right:.3125rem"> 付款账号:  </span>
                  <span class="content">{{ detailForm.pay.payCardNo }}</span>
                </div>
              </el-col>-->
              <el-col :xs="24" :sm="8" :md="8">
                <div class="grid-content ">
                  <span class="head" style="margin-right:.3125rem"> 付款状态:  </span>
                  <span class="content"> {{ checkPayStatus(detailForm.pay.payStatus) }}</span>
                </div>
                <!-- 根据status可以知道付款或者是未付款或者是部分付款 -->
              </el-col>
              <el-col :xs="24" :sm="8" :md="8">
                <div class="grid-content ">
                  <span class="head" style="margin-right:.3125rem"> 付款日期:  </span>
                  <span class="content">{{ detailForm.pay.payTime }}</span>
                </div>
              </el-col>
              <el-col :xs="24" :sm="8" :md="8">
                <div class="grid-content ">
                  <span class="head" style="margin-right:.3125rem"> 付款人:   </span>
                  <span class="content">{{ detailForm.pay.payUsername }}</span>
                </div>
              </el-col>
              <el-col :xs="24" :sm="13" :md="6">
                <div class="grid-content ">
                  <span class="head" style="margin-right:.3125rem"> 付款项目:   </span>
                  <span class="content">专柜结算</span>
                </div>
              </el-col>
            </el-row>
          </div>
          <el-row class="nav">
            <h2>供应商信息</h2>
          </el-row>
          <div class="line-black"></div>
          <div class="base-wrap" style="text-align: center">
            <el-row class="m-row" style="text-align: left">
              <el-col :xs="24" :sm="6" :md="8">
                <span class="head">供应商:   </span>
                <span class="content">{{ detailForm.merchant.merchantName }}</span>
              </el-col>
              <el-col :xs="24" :sm="10" :md="8">
                <span class="head">供应商编码:  </span>
                <span class="content">{{ detailForm.merchant.merchantCode }}</span>
              </el-col>
              <el-col :xs="24" :sm="24" :md="8">
                <span class="head"> 供应商负责人:  </span>
                <span class="content"> {{ detailForm.merchant.contacts }}</span>
              </el-col>
            </el-row>
          </div>

          <el-row class="nav">
            <h2>合同信息</h2>
          </el-row>
          <div class="line-black"></div>

          <div class="base-wrap" style="text-align: center">
            <el-row class="ht-row" style="text-align: left">
              <el-col :xs="24" :sm="12" :md="8">
                <span class="head" style="float:left"> 合同编码:   </span>
                <span class="content">  {{ detailForm.contract.contractNo }}</span>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <span class="head" style="margin-right:.3125rem">合同状态:  </span>
                <span class="content" v-if="detailForm.contract.contractStatus==1">生效合同</span>
                <span class="content" v-if="detailForm.contract.contractStatus==2">过期合同</span>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <span class="head" style="margin-right:.3125rem"> 合同描述: </span>
                <span class="content"> {{ detailForm.contract.description }}</span>
              </el-col>
            </el-row>
          </div>
          <el-row class="nav">
            <h2>结算单</h2>
          </el-row>
          <div class="line-black"></div>
          <div class="record" id="record">
            <!-- 跟进记录 -->
            <el-table :data="settlementTableData" size="mini" style="width: 100%; color:black"
                      border :header-cell-style="{background:'#ededed',color:'black'}">
              <el-table-column align="center" type="index" label="序号"/>
              <el-table-column align="center" property="no" label="结算单号">
                <template slot-scope="scope">
                  <router-link :to="{path:'/inner/settlement/detail', query:{settleId: scope.row.id}}" target="_blank">
                    <el-link type="primary">{{scope.row.no}}</el-link>
                  </router-link>
                </template>
              </el-table-column>
              <el-table-column align="center" property="createTime" label="结算开始日期"/>
              <el-table-column align="center" property="payTime" label="结算结束日期"/>
              <el-table-column align="center" property="merchantDueAmount" label="应付款"/>
            </el-table>
          </div>
        </div>
      <vue-easy-print tableShow ref="easyPrint">
        <div class="print" style="display:none">
          <div class="print-title">
            <span style="font-size:30px">付款详情单</span>
          </div>
          <div class="grid-content">
              <div style="display:inline-block;margin:5px;width:31%">
                  <span class="head" style="margin-right:5px">创建时间:</span>
                  <span class="content">{{detailForm.pay.createTime}}</span>
              </div>
              <div style="display:inline-block;margin:5px;width:31%">
                  <span class="head" style="margin-right:5px">制单员:</span>
                  <span class="content">{{detailForm.pay.uname}}</span>
              </div>
              <div style="display:inline-block;margin:5px;width:31%">
                  <span class="head" style="margin-right:5px">单据状态:</span>
                  <span class="content">{{getStatusDesc(detailForm.pay.status)}}</span>
              </div>
          </div>
          <div class="grid-content">
            <div style="display:inline-block;margin:5px;width:31%">
                  <span class="head"> 应付款日期:</span>
                                    <span class="content"> {{ detailForm.pay.settleTime }}</span>
            </div>
            <div style="display:inline-block;margin:5px;width:31%">
                  <span class="head" style="margin-right:5px"> 付款机构:</span>
                                    <span class="content">{{ detailForm.pay.deptName }}</span>
            </div>
            <div style="display:inline-block;margin:5px;width:31%">
                  <span class="head"> 账户名称:</span>
                                    <span class="content"> {{ detailForm.merchant.accountName }}</span>
            </div>
            <div style="display:inline-block;margin:5px;width:31%">
                  <span class="head">收银账户:</span>
                                    <span class="content">{{ detailForm.merchant.account }}</span>
            </div>
            <div style="display:inline-block;margin:5px;width:31%">
                  <span class="head">银行账号:</span>
                                    <span class="content">{{ detailForm.merchant.account }}</span>
            </div>
            <div style="display:inline-block;margin:5px;width:31%">
                  <span class="head" style="margin-right:5px">发票类型:</span>
                                    <span class="content">{{ dict.label.invoice_type[detailForm.merchant.invoiceType] }}</span>
            </div>
            <div style="display:inline-block;margin:5px;width:31%">
                  <span class="head" style="margin-right:5px"> 税额信息:</span>
                                    <span class="content"> {{ detailForm.merchant.incomeTaxRate }}</span>
            </div>
            <div style="display:inline-block;margin:5px;width:31%">
                  <span class="head" style="margin-right:5px">余额情况: </span>
                                    <span class="content">{{detailForm.pay.balance}}</span>
            </div>
            <div style="display:inline-block;margin:5px;width:31%">
                  <span class="head"> 有效发票:</span>
                                    <span class="content"> {{ detailForm.pay.effectInvoice }}</span>
            </div>
          </div>
           <div class="grid-content">
            <div style="display:inline-block;margin:5px;width:31%">
                  <span class="head" style="margin-right:5px"> 上期转入(+):</span>
                                    <span class="content">{{ detailForm.pay.preInto }}</span>
            </div>
            <div style="display:inline-block;margin:5px;width:31%">
                  <span class="head"> 应开发票额:</span>
                                    <span class="content">{{ detailForm.pay.invoiceValue }}</span>
            </div>
            <div style="display:inline-block;margin:5px;width:31%">
                  <span class="head">本期应付(+): </span>
                                    <span class="content">{{ detailForm.pay.shouldPay }}</span>
            </div>
            <div style="display:inline-block;margin:5px;width:31%">
                  <span class="head">转入下期(-):</span>
                                    <span class="content"> {{ detailForm.pay.intoNext }}</span>
            </div>
            <div style="display:inline-block;margin:5px;width:31%">
                  <span class="head" style="margin-right:5px">调整金额(-):</span>
                                    <span class="content">{{ detailForm.pay.adjustAmount }}</span>
            </div>
            <div style="display:inline-block;margin:5px;width:31%">
                  <span class="head" style="margin-right:5px"> 付款金额(=): </span>
                                    <span class="content">{{ detailForm.pay.payAmount }}</span>
            </div>
             <div style="display:inline-block;margin:5px;width:31%">
                  <span class="head" style="margin-right:5px">付款金额大写: </span>
                                    <span class="content">{{ detailForm.pay.amountWords }}</span>
            </div>
            <div style="display:inline-block;margin:5px;width:31%">
                  <span class="head"> 对账状态: </span>
                                    <span class="content">{{checkStatus(detailForm.pay.checkStatus)}}</span>
            </div>
            <div style="display:inline-block;margin:5px;width:31%">
                  <span class="head" style="margin-right:5px"> 对账日期:</span>
                                    <span class="content">  {{ detailForm.pay.checkTime }}</span>
            </div>
           </div>
          <div class="grid-content">

            <div style="display:inline-block;margin:5px;width:31%">
                  <span class="head"> 对账人: </span>
                                    <span class="content">{{ detailForm.pay.checkUsername }}</span>
            </div>
            <div style="display:inline-block;margin:5px;width:31%">
                  <span class="head">付款状态: </span>
                                    <span class="content">{{ checkPayStatus(detailForm.pay.payStatus) }}</span>
            </div>
            <div style="display:inline-block;margin:5px;width:31%">
                  <span class="head">付款日期:</span>
                                    <span class="content">{{ detailForm.pay.payTime }}</span>
            </div>
            <div style="display:inline-block;margin:5px;width:31%">
                  <span class="head" style="margin-right:5px">付款人: </span>
                                    <span class="content">{{ detailForm.pay.payUsername }}</span>
            </div>
            <div style="display:inline-block;margin:5px;width:31%">
                  <span class="head" style="margin-right:5px"> 付款项目:  </span>
                                    <span class="content">专柜结算</span>
            </div>
          </div>
          <div class="grid-content">
            <div style="display:inline-block;margin:5px;width:31%">
                  <span class="head"> 供应商: </span>
                                    <span class="content">{{ detailForm.merchant.merchantName }}</span>
            </div>
            <div style="display:inline-block;margin:5px;width:31%">
                  <span class="head" style="margin-right:5px"> 供应商编码:</span>
                                    <span class="content">{{ detailForm.merchant.merchantCode }}</span>
            </div>
            <div style="display:inline-block;margin:5px;width:31%">
                  <span class="head">供应商负责人: </span>
                                    <span class="content">{{ detailForm.merchant.contacts }}</span>
            </div>
          </div>
          <div class="grid-content">
            <div style="display:inline-block;margin:5px;width:31%">
                  <span class="head"> 合同编码: </span>
                                    <span class="content">{{ detailForm.contract.contractNo }}</span>
            </div>
            <div style="display:inline-block;margin:5px;width:31%">
                  <span class="head" style="margin-right:5px"> 合同状态:</span>
                      <span class="content" v-if="detailForm.contract.contractStatus==1">生效合同</span>
                      <span class="content" v-if="detailForm.contract.contractStatus==2">过期合同</span>
            </div>
            <div style="display:inline-block;margin:5px;width:31%">
                  <span class="head">合同描述:  </span>
                                    <span class="content"> {{ detailForm.contract.description }}</span>
            </div>
          </div>
          <div style="margin-top:15px;border: solid #BBBBBB 1px;">
              <el-table :data="settlementTableData" size="mini" :row-class-name="rowClassName"
                      :header-cell-style="{height:'20px',width:'50px',color:'black'}"
                        border>
              <el-table-column align="center" type="index" label="序号"  class="item" width="80"/>
              <el-table-column align="center" property="no" label="结算单号"  class="item" width="170">
                <template slot-scope="scope">
                  <router-link :to="{path:'/inner/settlement/detail', query:{settleId: scope.row.id}}" target="_blank">
                    <el-link type="primary">{{scope.row.no}}</el-link>
                  </router-link>
                </template>
              </el-table-column>
              <el-table-column align="center" property="startTime" label="结算开始日期" class="item" width="177"/>
              <el-table-column align="center" property="endTime" label="结算结束日期" class="item" width="177"/>
              <el-table-column align="center" property="merchantDueAmount" label="应付款" class="item" width="163"/>
              </el-table>
            </div>
        </div>
      </vue-easy-print>
    </div>
  </el-drawer>
</template>

<script>
  const detailForm = {
    pay: {
      id: null,
      no: null,
      contractNo: '',
      contractInfo: '',
      merchantNo: '',
      merchantName: '',
      status: null,
      uid: null,
      deptId: null,
      saleCount: null,
      cardPayPercent: null,
      cardPayAmount: null,
      saleAmount: null,
      actualSaleAmount: null,
      merchantDueAmount: null,
      departmentDueAmount: null,
      planPayTime: null,
      payWay: null,
      payBank: null,
      payAccount: null,
      payCardNo: null,
      balance: null,
      receiveBank: null,
      invoiceType: null,
      createTime: null,
      updateTime: null,
      checkUid: null,
      checkTime: null,
      checkStatus: null,
      checkRemark: null,
      receiveCardNo: null,
      payTime: null,
      endTime: null,
    },
    contract: {
      contractNo: '',
    },
    settlements: [
      {
        id: null,
        no: null,
        createTime: null,
        payTime: null,
        merchantDueAmount: null,
      }
    ],
    merchant: {
      id: null,
      merchantCode: null,
      merchantName: null,
      merchantPrincipal: null, //供应商负责人
    }
  };
  //引入pay api
  import {getDetail} from '@/api/cost/pay'
  import vueEasyPrint from "vue-easy-print";

  export default {
    components: {vueEasyPrint},
    props: {
      payId: {
        type: Number,
        required: true
      }
    },
    //
    dicts: ['income_tax_rate', 'invoice_type', 'settlement_way', 'settlement_status',],
    data() {
      return {
        syncLoading: true,
        disabled: true,
        dialogVisible: false,
        loading: false,
        approveLoading: false,
        currentPage: 1,
        pageSize: 2,
        currentTotal: 0,
        settlementTableData: [],
        detailForm: detailForm
      }
    },
    computed: {
      checkPayStatus() {
        return function (checkStatus) {
          var statsObj = {0: '未支付', 1: '部分支付', 2: '已支付'};
          return statsObj[checkStatus];
        }
      },
      checkStatus() {
        return function (checkStatus) {
          var statsObj = {0: '未对账', 1: '成功', 2: '异常'};
          return statsObj[checkStatus];
        }
      },
      getApprovalStatusDesc() {
        return function (status) {
          var statuObj = {0: "草稿", 1: "待审批", 2: "已审批", 4: "反审核", 3: "已驳回"};
          return statuObj[status];
        }
      },
      getStatusDesc() {
        return function (status) {
          var statuObj = {0: "待对账", 1: "已对账", 2: "待付款", 3: "已付款", 4: "作废"};
          return statuObj[status];
        }
      }
    },
    methods: {
      openDialog() {
        getDetail(this.payId).then(res => {
          console.log(res)
          this.detailForm = res
          this.detailForm.settlements = res.settlements
          this.loading = false
          this.settlementTableData = res.settlements
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
        this.detailForm = detailForm

      },
      clickPrint() {
        this.$refs.easyPrint.print();
      },
    }
  }


</script>

<style lang="scss">
  /* 注意：不能在scope中 */
  /*1.显示滚动条：当内容超出容器的时候，可以拖动：*/
  //抽屉从右往左开
  .el-drawer {
    overflow: scroll;
  }

  //使得drawer可以滚动
  .el-drawer__container ::-webkit-scrollbar {
    display: none;
  }

  //隐藏滚动条，在谷歌浏览器上是ok的
  /* 兼容火狐 */
  * {
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

  @page {
    size: auto A4 landscape;
    margin: 8.5mm 6mm 6.5mm 6mm;
  }

  .line-black {
    width: 100%;
    height: 1px;
    border-top: solid #BBBBBB 3px;
  }

  .content-wrap {
    margin: .9375rem .9375rem 0px .625rem;
  }

  .d-header {
    background-color: #F5F5F5;
  }

  .el-col {
    line-height: 33px;
  }

  .el-row {
    line-height: 33px;
  }

  .base-wrap {
    line-height: 33px;
    margin: 10px 5px 0px 15px;
  }

  .invoice-wrap {
    border: solid #BBBBBB 3px;
    padding: .625rem 1.875rem .625rem 1.875rem;
    margin-top: .625rem;

    .el-col {
      height: 28px;
      line-height: 28px;
    }

    .look-up {
      font-weight: bold;
    }
  }

  .record {
    margin: 15px 15px 3px 15px;
  }

  .nav {
    font-weight: bold;
    /*    padding-right: 535px; */

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
    padding-left: 9.9rem
  }

  .space-other {
    margin-right: 1.5625rem;
  }

  @media only screen and (min-width: 768px) and (max-width: 1024px) {
    .space {
      padding-left: 0rem;
      float: left;
    }
    .space-other {
      margin: right 0rem;
    }


  }

  @media only screen and (min-width: 320px) and (max-width: 767px) {

    .space {
      padding-left: 0rem;
      float: left;
    }
    .space-other {
      margin: right 0rem;
    }

  }
  @media print {
  /* 清除样式 */
  #app {
    display: none;
  }
  .el-dialog,
  .el-dialog__wrapper,
  .el-message,
  .v-modal {
    display: none !important;
  }
  /* 规定打印样式 */
  @page {
    size: auto A5 landscape;
    margin: 3mm;
  }

  html {
  background-color: #ffffff;
  margin: 0px; /* this affects the margin on the html before sending to printer */
  }
  body {
  border: solid 1px rgba(255,255,255,0);
/* margin: 10mm 15mm 10mm 15mm; margin you want for the content */
  }
  /* 启用样式 */
  .print{
    display: block !important;
    font-family: SimSun;
  }
  /* 打印样式 */
  .print-title{
    display: flex;
    justify-content: center;
  }
  .head{
    font-size: 16px;
    color: black;
    font-weight:normal
  }
  .content {
    font-size: 14px;
    padding-bottom:1px ;
    border-bottom:1px solid black ;
  }
  .grid-content{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: flex-start;
  }



}
</style>

