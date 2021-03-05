<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.orderNo" clearable placeholder="订单编号" style="width: 200px;" class="filter-item"/>
        <el-input v-model="query.merchantNo" clearable placeholder="供应商编码" style="width: 200px;" class="filter-item"/>
        <el-input v-model="query.posNo" clearable placeholder="收银机编码" style="width: 200px;" class="filter-item"/>
        <el-input v-model="query.cashierNo" clearable placeholder="收银员编码" style="width: 200px;" class="filter-item"/>
        <!--<el-select v-model="query.type" clearable placeholder="订单类型" class="filter-item" style="width: 130px">
          <el-option label="销售订单" value="0"/>
          <el-option label="退货订单" value="1"/>
        </el-select>-->
        <el-select v-model="query.status" clearable placeholder="状态" class="filter-item" style="width: 130px">
          <el-option label="开单" value="0"/>
          <el-option label="完成" value="1"/>
        </el-select>
        <el-select v-model="query.payStatus" clearable placeholder="支付状态" class="filter-item" style="width: 130px">
          <el-option label="待支付" value="0"/>
          <el-option label="已支付" value="1"/>
        </el-select>
        <rrOperation :crud="crud"/>
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission"/>
      <!--表单组件-->
      <el-drawer :visible.sync="showInfo" size="50%">
        <el-form ref="form" :model="orderInfo" :rules="rules" size="small" label-width="80px">
          <div class="top">
            <div style="margin-top:5px;display: flex;flex-direction: row;">
              <el-form-item label="" style="color:blue">
              <span style="width: 270px;">{{orderInfo.orderNo}}</span>
              </el-form-item>
              <el-form-item label="收银员" style="margin-left:60px">
              <span style="width: 270px;">{{orderInfo.cashierNo}}</span>
              </el-form-item>
              <el-form-item label="收银机" style="margin-left:120px">
              <span style="width: 270px;">{{orderInfo.posNo}}</span>
              </el-form-item>
            </div>
          </div>
          <div class="info" style="display: flex;flex-direction: row;flex-wrap: wrap; padding-left:20px;padding-right:20px">
            <div  style="display: flex;flex-direction: row;flex-wrap: wrap;">
              <el-form-item label="开单时间" style="width: 33%;">
                <span style="width: 270px;">{{orderInfo.orderTimeStr}}</span>
              </el-form-item>
              <el-form-item label="供应商" style="width: 33%;">
                <span style="width: 270px;">{{orderInfo.merchantName}}</span>
              </el-form-item>
              <el-form-item label="支付状态" style="width: 33%;">
                <span v-if="orderInfo.payStatus == 1">待支付</span>
                <span v-if="orderInfo.payStatus == 0">已支付</span>
              </el-form-item>
              <el-form-item label="付款时间" style="width: 33%;">
                <span style="width: 270px;">{{orderInfo.payTimeStr}}</span>
              </el-form-item>
              <el-form-item label="供应商编码" style="width: 33%;" label-width="90px">
                <span style="width: 270px;">{{orderInfo.merchantNo}}</span>
              </el-form-item>
              <el-form-item label="订单状态" style="width: 33%;">
                <span v-if="orderInfo.status==0">开单</span>
                <span v-if="orderInfo.status==1">完成</span>
                <span v-if="orderInfo.status==2">取消</span>
              </el-form-item>
              <el-form-item label="应收" style="width: 33%;">
                <span style="width: 270px;">{{orderInfo.feeYuan}}</span>
              </el-form-item>
              <el-form-item label="订单类型" style="width: 33%;">
                <span v-if="orderInfo.type==0">销售</span>
                <span v-if="orderInfo.type==1">退货</span>
              </el-form-item>
            </div>
              <div class="title"><h2 >实收金额: {{orderInfo.payFeeYuan}}</h2></div>
              <el-form-item label="现金" style="width: 25%;">
                <span style="width: 100px">{{orderPayInfo.xianjin}}</span>
              </el-form-item>
              <el-form-item label="微信" style="width: 25%;">
                <span style="width: 100px">{{orderPayInfo.weixin}}</span>
              </el-form-item>
              <el-form-item label="支付宝" style="width: 25%;">
                <span style="width: 100px">{{orderPayInfo.zhifubao}}</span>
              </el-form-item>
              <el-form-item label="刷卡" style="width: 25%;">
                <span style="width: 100px">{{orderPayInfo.shuaka}}</span>
              </el-form-item>
              <el-form-item label="云闪付" style="width: 25%;">
                <span style="width: 100px">{{orderPayInfo.yunshanfu}}</span>
              </el-form-item>
               <div class="title"><h2 >优惠金额: {{orderInfo.freeFeeYuan}}</h2></div>
              <el-form-item label="实体卡" style="width: 25%;">
                <span style="width: 100px">{{orderPayInfo.shitika}}</span>
              </el-form-item>
              <el-form-item label="折扣券" style="width: 25%;">
                <span style="width: 100px">{{orderPayInfo.zhekouquan}}</span>
              </el-form-item>
              <el-form-item label="满减券" style="width: 25%;">
                <span style="width: 100px">{{orderPayInfo.manjianquan}}</span>
              </el-form-item>
              <el-form-item label="提货券" style="width: 25%;">
                <span style="width: 100px">{{orderPayInfo.tihuoquan}}</span>
              </el-form-item>
              <div class="title"></div>

              <div style="width: 100%;">
                <el-table :data="orderGoodsData" style="width: 100%; color:black" border :header-cell-style="{background:'#ededed',color:'black'}">
                  <el-table-column type="index" prop="序号" label="序号"/>
                  <el-table-column prop="goodsNo" label="货号"/>
                  <el-table-column prop="goodsName" label="商品名称"/>
                  <el-table-column prop="goodsBrand" label="品牌"/>
                  <el-table-column prop="goodsNum" label="零售数量"/>
                  <el-table-column prop="price" label="销售金额"/>
                  <el-table-column prop="discountPrice" label="实售金额"/>
                </el-table>
              </div>
            </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="showInfo = false">取消</el-button>
        </div>
      </el-drawer>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;"
                @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55"/>
        <el-table-column v-if="columns.visible('orderNo')" prop="orderNo" label="订单号"/>
        <el-table-column v-if="columns.visible('merchantNo')" prop="merchantNo" label="供应商编码"/>
        <el-table-column v-if="columns.visible('merchantName')" prop="merchantName" label="供应商"/>
        <el-table-column v-if="columns.visible('posNo')" prop="posNo" label="收银机编码"/>
        <el-table-column v-if="columns.visible('cashierNo')" prop="cashierNo" label="收银员编码"/>
        <el-table-column v-if="columns.visible('payFee')" prop="payFeeYuan" label="实收"/>
        <el-table-column v-if="columns.visible('fee')" prop="feeYuan" label="应收"/>
        <el-table-column v-if="columns.visible('freeFeeYuan')" prop="freeFeeYuan" label="优惠"/>
        <el-table-column v-if="columns.visible('type')" prop="type" label="订单类型">
          <template slot-scope="scope">
            <span v-if="scope.row.type==1">退货</span>
            <span v-if="scope.row.type==0">销售</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('status')" prop="status" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status==1">完成</span>
            <span v-if="scope.row.status==0">开单</span>
            <span v-if="scope.row.status==2">取消</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('payStatus')" prop="payStatus" label="支付状态">
          <template slot-scope="scope">
            <span v-if="scope.row.payStatus==1">已支付</span>
            <span v-if="scope.row.payStatus==0">未支付</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('createTime')" prop="createTime" label="开单时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.orderTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('returnTime')" prop="returnTime" label="退货时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.returnTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('cleanTime')" prop="cleanTime" label="取消时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.cleanTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('originalNo')" prop="originalNo" label="原单号"/>
        <el-table-column v-permission="['admin','posOrder:edit','posOrder:del']" label="操作" width="150px"
                         align="center">
          <!--<template slot-scope="scope">
            <udOperation :data="scope.row" :permission="permission"/>
          </template>-->
          <template slot-scope="scope">
            <el-link :underline="false" v-permission="permission.add" @click="toShowInfo(scope.$index)"
                       type="primary">
              详情
            </el-link>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <div style="height: 40px;margin-top: 20px">
        <el-row>
          <el-col :span="12">
            <el-button type="success" @click="crud.doExport">导出</el-button>
          </el-col>
          <el-col :span="12" style="text-align: right">
            <!--分页组件-->
            <pagination/>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  import CRUD, {crud, form, header, presenter} from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'
  import MaterialList from "@/components/material";
  import crudPosOrder from "@/api/order"

  // crud交由presenter持有
  const defaultCrud = CRUD({
    title: '订单',
    url: 'api/posOrder',
    sort: 'order_id,desc',
    crudMethod: {...crudPosOrder},
    optShow: {
      add: false,
      edit: false,
      del: false,
      download: false
    },
  })
  const defaultForm = {
    orderId: null,
    orderNo: null,
    merchantNo: null,
    posNo: null,
    cashierNo: null,
    userNo: null,
    payFee: null,
    fee: null,
    discountFee: null,
    type: null,
    status: null,
    payStatus: null,
    createTime: null,
    payTime: null,
    returnTime: null,
    cleanTime: null,
    remark: null,
    checkNo: null,
    originalNo: null,
    isSyn: null,
    ver: null
  }
  export default {
    name: 'PosOrder',
    components: {pagination, crudOperation, rrOperation, udOperation, MaterialList},
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    dicts: ['is_true', 'is_true'],
    data() {
      return {
        permission: {
          add: ['admin', 'posOrder:add'],
          edit: ['admin', 'posOrder:edit'],
          del: ['admin', 'posOrder:del']
        },
        rules: {},
        queryTypeOptions: [
          {
            key: 'orderNo',
            display_name: '订单编码'
          },
          {
            key: 'merchantNo',
            display_name: '供应商编码'
          },
          {
            key: 'posNo',
            display_name: '收银机编码'
          },
          {
            key: 'cashierNo',
            display_name: '收银员编码'
          },
          {
            key: 'type',
            display_name: '订单类型'
          },
          {
            key: 'status',
            display_name: '状态'
          },
          {
            key: 'payStatus',
            display_name: '支付状态'
          }
        ],
        showInfo: false,
        orderInfo: {},
        orderPayInfo: {},
        orderGoodsData: [],
      }
    },
    watch: {},
    methods: {
      // 获取数据前设置好接口地址
      [CRUD.HOOK.beforeRefresh]() {
        const query = this.query
        this.crud.query.type = 1;
        if (query.type && query.value) {
          this.crud.params[query.type] = query.value
        } else {
          delete this.crud.params.orderNo
          delete this.crud.params.merchantNo
          delete this.crud.params.posNo
          delete this.crud.params.cashierNo
          delete this.crud.params.type
          delete this.crud.params.status
          delete this.crud.params.payStatus
        }
        return true
      }, // 新增与编辑前做的操作
      [CRUD.HOOK.afterToCU](crud, form) {
      },
      // 查看订单详情
      toShowInfo(index) {
        this.orderInfo = this.crud.data[index]
        this.getOrderPayInfo(this.orderInfo.orderNo);
        this.getOrderGoodsInfo(this.orderInfo.orderId);
        this.showInfo = true;
      },
      // 获取订单支付信息
      getOrderPayInfo(orderNo) {
        this.orderPayInfo={};
        crudPosOrder.getOrderPay(orderNo).then(res=>{
          // zhaoling    找零
          // shitika  实体卡
          // xianjin  现金
          // zhifubao 支付宝
          // weixin   微信
          // shuaka   刷卡
          // yunshanfu    云闪付
          // zhekouquan   折扣券
          // manjianquan  满减券
          // tihuoquan    提货券
          this.orderPayInfo= res;
        })
      },
      // 获取订单商品信息
      getOrderGoodsInfo(orderId) {
        this.orderGoodsData= [];
        crudPosOrder.getOrderGoods(orderId).then(res=>{
          this.orderGoodsData= res;
        })
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
.top{
    position:absolute;
    top:0;
    width: 100%;
    height: 3.375rem;
    background-color: #F5F5F5;
    border-bottom: 1px solid #BBBBBB;
  }
  .title{
    width: 100%;
    padding-right:535px ;
   border-bottom: 1px solid #BBBBBB;
   color:black;
   margin-bottom: 30px;
  }


</style>
