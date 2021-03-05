<template>
  <div>
    <el-form ref="form" :model="formData" size="small" label-width="80px" style="width: 100%;">
      <p style="text-align: center;font-size: 32px"> 《专柜经营合同审批表》 </p>
      <el-row type="flex" align="center" justify="center">
        <el-col :span="10">
          <div class="head-text">
            <span style="font-size: 1.6rem">供应商类型:</span>
            <span v-if="form.merchantType ==1">专柜商家</span>
            <span v-if="form.merchantType ==2">租赁商家</span>
            <span v-if="form.merchantType ==3">专柜联营厂家</span>
          </div>
        </el-col>
        <el-col :span="13"><div class="head-text-right"><span style="font-size: 1.6rem">供应商代表确签（盖章）</span></div></el-col>
        <el-col :span="1"><div class="head-text"><span><b /></span></div></el-col>
      </el-row>
      <table id="table_top" class="mytable" border="1px solid #ccc" cellspacing="0" cellpadding="0" style="width: 100%;">
        <tr style="text-align: center">
          <td class="TdTitle" colspan="9">新供应商合同内容</td>
        </tr>
        <tr>
          <td class="TdTitle">名称（及代码）</td>
          <td colspan="3" class="td-pendding">{{ form.merchantName }}</td>
          <td class="TdTitle">联系人</td>
          <td colspan="1" class="td-pendding">{{ form.businessName }}</td>
          <td class="TdTitle">联系方式</td>
          <td colspan="2" class="td-pendding">{{ form.businessTel }}</td>
        </tr>
        <tr>
          <td class="TdTitle">楼层:</td><td colspan="1" class="td-pendding">{{ form.floor }}</td>
          <td class="TdTitle">编号:</td><td colspan="3" class="td-pendding">{{ form.number }}</td>
          <td class="TdTitle">建筑面积:</td><td colspan="2" class="td-pendding">{{ form.buildingArea }}</td>
        </tr>
        <tr>
          <td class="TdTitle">联系地址</td>
          <td colspan="7" class="td-pendding">{{ form.businessAddress }}</td>
        </tr>
        <tr>
          <td class="TdTitle">品牌名称</td>
          <td class="TdTitle">（中文）</td>
          <td colspan="4" class="td-pendding">{{ form.brandNameCn }}</td>
          <td class="TdTitle">（英文）</td>
          <td colspan="2" class="td-pendding">{{ form.brandNameEn }}</td>
        </tr>
        <tr>
          <td class="TdTitle">品牌评价:</td>
          <td colspan="7" class="td-pendding">
            <el-checkbox-group
              v-model="form.brandAwarenessType"
              :min="0"
              :max="3"
            >
              <el-checkbox v-for="item in dict.brand_awareness_type" v-if="item.label" :key="item.id" :label="item.label">{{ item.label }}</el-checkbox>
            </el-checkbox-group>
          </td>
        </tr>
        <tr>
          <td class="TdTitle">供应商类型:</td>
          <td colspan="7" class="td-pendding">
            <el-checkbox-group
              v-model="form.supplierType"
              :min="0"
              :max="3"
            >
              <el-checkbox v-for="item in dict.supplier_type" :key="item.id" :label="item.label">{{ item.label }}</el-checkbox>
            </el-checkbox-group>
          </td>
        </tr>
        <tr>
          <td class="TdTitle">经营范围</td>
          <td colspan="7" class="td-pendding">{{ form.businessScope }}</td>
        </tr>
        <tr>
          <td class="TdTitle">合同期限:</td>
          <td colspan="2" style="text-align: center">
            {{ form.contractPeriodYear }}年（{{ form.contractPeriodMonth }}个月）
          </td>
          <td colspan="5" style="text-align: center">
            自{{ parseTime(form.contractPeriodStarttime,"{y}年{m}月{d}日") }}起至
            {{ parseTime(form.contractPeriodEndtime,"{y}年{m}月{d}日") }}止
          </td>
        </tr>
        <tr>
          <td class="TdTitle">结算方式:</td>
          <td colspan="7" class="td-pendding" style="padding: 1rem">
            <el-checkbox-group v-model="form.jszjType" class="jszj" :min="0" :max="1">
              <el-checkbox v-for="item in dict.jszj_type" v-if="item.label==='jszj1'" :key="item.id" :label="item.label"><p style="margin-left: 5px;margin-top: -4px;">1、租金方式（采用固定租金、固定管理费与提成租金两者取其高）;乙方按
                <span style="text-decoration: underline;">&#160;{{ form.jszj1ZjTnM2 }}&#160;</span>元/平方米即
                <span style="text-decoration: underline;">&#160;{{ form.jszj1ZjTnYue }}&#160;</span>元/月（注:此为按套内面积计价，如按建筑面积计价则为
                <span style="text-decoration: underline;">&#160;{{ form.jszj1ZjJzM2 }}&#160;</span>元/平方米）向甲方支付固定租金,及乙方按
                <span style="text-decoration: underline;">&#160;{{ form.jszj1GlfTnM2 }}&#160;</span>元/平方米即
                <span style="text-decoration: underline;">&#160;{{ form.jszj1GlfTnYue }}&#160;</span>元/月（注：此为按套内面积计价,如按建筑面积计价则为
                <span style="text-decoration: underline;">&#160;{{ form.jszj1GlfJzM2 }}&#160;</span>元/平方米）向甲方支付固定管理费:或乙方按每月销售额提成
                <span style="text-decoration: underline;">&#160;{{ form.jszj1XseP }}&#160;</span>%计提给甲方.此提成租金与上述固定租金、固定管理费金额的总和比较取高值。</p>
              </el-checkbox>
              <el-checkbox v-else-if="item.label==='jszj2'" :key="item.id" :label="item.label"><p style="margin-left: 5px;margin-top: -4px;">2、采用固定租金加销售提成租金方式:甲方按
                <span style="text-decoration: underline;">&#160;{{ form.jszj2ZjTnM2 }}&#160;</span>元/平方米（注：此为按套内面积计价,如按建筑面积计价则为
                <span style="text-decoration: underline;">&#160;{{ form.jszj2ZjJzM2 }}&#160;</span>元/平方米）收取乙方租金
                <span style="text-decoration: underline;">&#160;{{ form.jszj2ZjTnYue }}&#160;</span>元/月,乙方还应按每月销售提成
                <span style="text-decoration: underline;">&#160;{{ form.jszj2XseP }}&#160;</span>%计提给甲方。</p>
              </el-checkbox>
              <el-checkbox v-else-if="item.label==='jszj3'" :key="item.id" :label="item.label"><p style="margin-left: 5px;margin-top: -4px;">3、采用固定租金方式:甲方按
                <span style="text-decoration: underline;">&#160;{{ form.jszj3ZjTnM2 }}&#160;</span>元/平方米（注:此为按套内面积计价,如按建筑面积计价则为
                <span style="text-decoration: underline;">&#160;{{ form.jszj3ZjJzM2 }}&#160;</span>元/平方米）收取乙方租金
                <span style="text-decoration: underline;">&#160;{{ form.jszj3ZjTnYue }}&#160;</span>元/月。</p>
              </el-checkbox>
              <el-checkbox v-else :key="item.id" :label="item.label"><p style="margin-left: 5px;margin-top: -4px;">4、采用销售提成租金方式:乙方按每月销售额提成
                <span style="text-decoration: underline;">&#160;{{ form.jszj4TcXseP }}&#160;</span>%计提给甲方。</p>
              </el-checkbox>
            </el-checkbox-group>
          </td>
        </tr>
        <tr>
          <td class="TdTitle">
            仓库使用:
          </td>
          <td colspan="7" class="td-pendding">
            乙方使用甲方仓库，收仓库使用管理费<span style="text-decoration: underline;">&#160;{{ form.warehouseUseAreaTnM2 }}&#160;</span>元/月。
          </td>
        </tr>
        <tr>
          <td class="TdTitle">
            综合管理费:
          </td>
          <td colspan="7" class="td-pendding">
            <el-checkbox-group v-model="form.zhglType" :min="0" :max="2">
              <el-checkbox v-for="item in dict.zhgl_type" :key="item.id" :label="item.label">{{ item.label }}</el-checkbox>
            </el-checkbox-group>
            <span style="text-decoration: underline;">&#160;{{ form.wyglfTnYue }}&#160;</span>元（注:如按建筑面积计价则为
            <span style="text-decoration: underline;">&#160;{{ form.wyglfJzM2 }}&#160;</span>元/平方米）,该费用由乙方在交纳租金时一并支付。
          </td>
        </tr>
        <tr>
          <td class="TdTitle">
            广告位相关:
          </td>
          <td colspan="7" class="td-pendding">乙方有偿租用甲方的
            <span style="text-decoration: underline;">&#160;{{ form.advertisingSpaceH }}&#160;</span>号广告位,广告面积
            <span style="text-decoration: underline;">&#160;{{ form.advertisingArea }}&#160;</span>平方米, 广告租金
            <span style="text-decoration: underline;">&#160;{{ form.advertisingRentFee }}&#160;</span>元/㎡。<br>
            <div>
              <div style="width: 16%;display:inline-block">广告位维护费为:</div>
              <div style="width: 73%;display:inline-block">
                <el-checkbox-group v-model="form.advertisingPayType" :min="0" :max="1">
                  <el-checkbox v-for="item in dict.advertising_pay_type" v-if="item.label==='month'" :key="item.id" :label="item.label">
                    每月支付<el-input v-model="form.advertisingMaintenanceFeeMonth" style="width: 80px; " placeholder="" />元。
                  </el-checkbox>
                  <el-checkbox v-else :key="item.id" :label="item.label">
                    一次性支付<el-input v-model="form.advertisingMaintenanceFeeOne" style="width: 80px; " placeholder="" />元。
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            租用时间: {{ parseTime(form.advertisingRentStarttime,"{y}年{m}月{d}日") }} 至 {{ parseTime(form.advertisingRentEndtime,"{y}年{m}月{d}日") }}
          </td>
        </tr>
        <tr>
          <td class="TdTitle">
            场地使用费:
          </td>
          <td colspan="7" class="td-pendding">
            乙方同意给甲方专用场地使用费 <span style="text-decoration: underline;">&#160;{{ form.siteFeeYdn }}&#160;</span>元/店/年，合计
            <span style="text-decoration: underline;">&#160;{{ form.siteFeeY }}&#160;</span>元。
          </td>
        </tr>
        <tr>
          <td class="TdTitle">
            设备设施:
          </td>
          <td colspan="7" class="td-pendding">甲方提供设备设施
            <span style="text-decoration: underline;">&#160;{{ form.equipmentName }}&#160;</span>给乙方使用，乙方一次性缴纳设施管理费
            <span style="text-decoration: underline;">&#160;{{ form.equipmentMangeFee }}&#160;</span>元，或甲方收取乙方设备设施使用折旧费
            <span style="text-decoration: underline;">&#160;{{ form.equipmentDepreciationFee }}&#160;</span>元/月。
          </td>
        </tr>
        <tr>
          <td>
            设施管理合作支持:
          </td>
          <td colspan="7" class="td-pendding">乙方向甲方提供设施管理合作支持
            <span style="text-decoration: underline;">&#160;{{ form.facilityManagementCooperationSupportY }}&#160;</span>元,用于乙方经营场地和公共设施的维护保养费用。
          </td>
        </tr>
        <tr>
          <td class="TdTitle">
            设施管理费与合同保证金:
          </td>
          <td colspan="7" class="td-pendding">合同签订三天内,乙方向甲方交纳设施管理费
            <span style="text-decoration: underline;">&#160;{{ form.facilityManagementFee }}&#160;</span>元，合同保证金
            <span style="text-decoration: underline;">&#160;{{ form.contractDeposit }}&#160;</span>元（含合同保证、设备设施保证、管理保证、商品质量保证等）。
          </td>
        </tr>
        <tr>
          <td class="TdTitle">
            第三方支付消费:
          </td>
          <td colspan="7" class="td-pendding">第三方支付消费按消费总额
            <span style="text-decoration: underline;">&#160;{{ form.equipmentRentalFee }}&#160;</span>%支付设备租赁费。
          </td>
        </tr>
        <tr>
          <td class="TdTitle">
            铺货数量:
          </td>
          <td colspan="7" class="td-pendding">乙方自开业之日起,乙方根据经营的面积,铺货数量须达到
            <span style="text-decoration: underline;">&#160;{{ form.distributionQuantity }}&#160;</span>件以上。
          </td>
        </tr>
        <tr>
          <td class="TdTitle">
            促销员数量:
          </td>
          <td colspan="7" class="td-pendding">乙方自行聘请
            <span style="text-decoration: underline;">&#160;{{ form.promoterM }}&#160;</span>名促销员负责商品的销售、保管;促销员制服费用。
          </td>
        </tr>
        <tr>
          <td class="TdTitle">
            保底销售任务:
          </td>
          <td colspan="7" class="td-pendding">乙方确保全年完成销售任务
            <span style="text-decoration: underline;">&#160;{{ form.guaranteedSalesTaskWy }}&#160;</span>万元,如未能完成保底销售任务时需补足 销售提成差额给甲方.
          </td>
        </tr>
        <tr>
          <td class="TdTitle">
            单次促销活动服务费:
          </td>
          <td colspan="7" class="td-pendding">甲方按活动时间的销售额收取乙方
            <span style="text-decoration: underline;">&#160;{{ form.promotionOneP }}&#160;</span>%促销活动服务费.
          </td>
        </tr>
        <tr>
          <td class="TdTitle">
            合同期内宣传促销费:
          </td>
          <td colspan="7" class="td-pendding">甲方按乙方每月销售额
            <span style="text-decoration: underline;">&#160;{{ form.promotionXcFeeP }}&#160;</span>%收取宣传促销服务费或收取
            <span style="text-decoration: underline;">&#160;{{ form.promotionXcFeeY }}&#160;</span>元的宣传促销服务费。另甲方每年向乙方收取
            <span style="text-decoration: underline;">&#160;{{ form.promotionJqFeeY }}&#160;</span>元的节庆促销服务费。
          </td>
        </tr>
        <tr>
          <td class="TdTitle">
            合作方式:
          </td>
          <td colspan="7" class="td-pendding">
            <el-checkbox-group v-model="form.cooperationType" :min="0" :max="1">
              <el-checkbox v-for="item in dict.cooperation_type" v-if="item.id==26" :key="item.id" :label="item.label">
                <span>其他</span>{{ form.financeName }}
              </el-checkbox>
              <el-checkbox v-else :key="item.id" :label="item.label"><span>{{ item.label }}</span></el-checkbox>
            </el-checkbox-group>
          </td>
        </tr>
        <tr>
          <td class="TdTitle">
            年龄层:
          </td>
          <td colspan="4" class="td-pendding">
            {{ form.ageGroup }}
          </td>
          <td class="TdTitle">
            价格区间:
          </td>
          <td colspan="3" class="td-pendding">
            {{ form.priceRange }}
          </td>
        </tr>
        <tr>
          <td class="TdTitle">入场装修意向时间</td>
          <td colspan="7" class="td-pendding">
            {{ parseTime(form.decorationTime,"{y}年{m}月{d}日") }}，预计 {{ parseTime(form.openingTime,"{y}年{m}月{d}日") }} 开业
          </td>
        </tr>
        <tr>
          <td class="TdTitle">备注</td>
          <td colspan="7" class="td-pendding">{{ form.remark }}</td>
        </tr>
      </table>
      <el-row type="flex" align="center" justify="center">
        <el-col :span="6"><div class="main-text-left"><span>业务经办人：{{ form.businessOperatorName }} </span></div></el-col>
        <el-col :span="6"><div class="main-text-left"><span>部门负责人：{{ form.departmentHeadName }} </span></div></el-col>
        <el-col :span="6"><div class="main-text-left"><span>部门总经理：{{ form.departmentGeneralManagerName }} </span></div></el-col>
        <el-col :span="6"><div class="main-text-left"><span>总经理：{{ form.generalManagerName }} </span></div></el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { parseTime } from '@/utils/index'
export default {
  name: 'AttarctMerchantPrint',
  dicts: ['merchant_type', 'brand_awareness_type', 'supplier_type', 'cooperation_type', 'jszj_type', 'zhgl_type', 'advertising_pay_type'],
  model: {
    prop: 'form',
    event: 'change'
  },
  props: {
    form: {}
  },
  data() {
    return {
      formData: {},
      cooperationOther: true
    }
  },
  watch: {
    formData(value) {
      this.$emit('change', value)
    }
  },
  created() {
  },
  methods: {
    parseTime
  }
}
</script>

<style lang="scss" scoped>
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
  .app-container{
    margin: 0 auto;
    width: 100%;
  }
  .head-container{
    width: 100%;
    height: 54px;
    line-height: 20px;
    border-radius: 2px 2px 0px 0px;
    background-color: rgba(245, 245, 245, 100);
    text-align: center;
    margin: 0 auto;
    border: 1px solid rgba(255, 255, 255, 100);
  }
  .head-texts{
    font-size: 18px;
    height: 54px;
    line-height: 54px;
  }
  .head-text{
    font-size: 22px;
    height: 54px;
    line-height: 54px;
  }
  .head-text-right{
    font-size: 22px;
    height: 54px;
    line-height: 54px;
    text-align: right;
  }
  .main-text{
    font-size: 1.2rem;
    height: 40px;
    line-height: 40px;
    text-align: center;
  }
  .main-text-left{
    font-size: 1.2rem;
    height: 40px;
    line-height: 40px;
    text-align: left;
  }
  .mytable{
    font-size: 1.3rem;
    font-family: "Adobe 宋体 Std L";
  }
  .mytable tr{
    height: 2.5rem;
  }
  .td-pendding{
    padding-left:1em;
  }
  .TdTitle{
    text-align: center;
    font-size: 1.3rem;
    width: 10%;
    font-family: "Adobe 宋体 Std L";
  }
  .span-underline{
    text-underline: black;text-decoration: underline;
  }
  /deep/.jszj .el-checkbox{
    white-space: normal;
  }
  /deep/.jszj .el-checkbox__input{
    width: 5%;
    top: 1.2rem;
    left: -0.6rem;
    position: absolute;
  }
  /deep/.jszj .el-checkbox__label{
    width: 100%;
  }
  /deep/.el-checkbox{
    margin-right: 2rem;
    .is-checked{
      .el-checkbox__inner{ // 复选框的样式修改
        background-color: #FFFFFF;
        border: 1px solid #000000;
        &::after{ // 里面的对钩
          border-color: #000000;
        }
      }
    }
  }
  /deep/.el-checkbox__label {
    font-size: 1.3rem;
  }
  /deep/.is-checked{
    /deep/.el-checkbox__label {
      color: black !important;
    }
  }
  /deep/.jszj .el-checkbox{
    white-space: normal;
  }
  /deep/.jszj .el-checkbox__input{
    top: 0rem !important;
    left: -0.6rem;
    position: absolute;
  }
  /deep/.jszj .el-checkbox__label{
    width: 100%;
  }
  input[type=checkbox] {
    width: 1.2rem;                  // 可根据自己的需要进行配置input的大小。
    height: 1.2rem;
    border-radius: 2px;
    -webkit-appearance: none;
    background-color: transparent;
    border: 0;
    outline: 0 !important;
    color: #d8d8d8;
    position: relative;
  }
  input[type=checkbox]:before{
    content: "";
    display:block;
    width: 1.2rem;
    height: 1.2rem;
    border-radius: 2px;
    border: 1px solid #ddd;
    background-color: #fff;
    box-sizing:border-box;
    position: absolute;
  }

  input[type=checkbox]:disabled:before{
    content: "";
    display:block;
    width: 1.2rem;
    height: 1.2rem;
    border-radius: 2px;
    border: 1px solid #333;
    background-color: #333;
    box-sizing:border-box;                     // 可控制调整背景色。
    position: absolute;
  }
  input[type=checkbox]:checked:before{
    content: "";
    display:block;
    width: 1.2rem;
    height: 1.2rem;
    border-radius: 2px;
    border: 1px solid #000;
    background-color: #fff;                 //可控制checked背景色
    box-sizing:border-box;
    position: absolute;
  }
  input[type=checkbox]:checked:after{
    content: "";
    display:block;
    /*width: .15rem;*/
    /*height: .3rem;*/
    /*border-radius:  .06rem;*/
    width: 0.5rem;                          // 此处是控制获取checked=true 后的颜色，请注意宽高比约1:2 。 原理是通过伪类去控制样式。
    height: 0.9rem;
    /*border-radius:3px;*/
    border-left: .05rem solid #000;
    border-top: .05rem solid #000;
    box-sizing:border-box;
    position: absolute;
    transform: rotate(-135deg) translate(-25%, 25%);
  }
</style>
