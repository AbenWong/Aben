<template>
  <div class="app-container" style="background-color: #FFFFFF">

    <vue-easy-print tableShow ref="easyPrint">
      <attarct-merchant-print v-model="form" style="position:absolute;z-index: -1;"></attarct-merchant-print>
    </vue-easy-print>
    <div class="head-container">
      <el-row type="flex" align="center" justify="center">
        <el-col :span="8">
          <div class="head-texts">
            <span style="width: 20%;float: left;">招商单号:</span>
            <el-input style="width: 70%" v-model="attractMerchantNo"></el-input>
          </div>
        </el-col>
        <el-col :span="8"><div class="head-text"><span><b>新建招商进驻单</b></span></div></el-col>
        <el-col :span="7"><div class="head-texts"><span>单据状态: </span><span style="color: red"><span v-if="approvalStatus ==0">草稿</span>
            <span v-if="approvalStatus ==1">待审批</span>
            <span v-if="approvalStatus ==2">审批通过</span>
            <span v-if="approvalStatus ==3">审批驳回</span></span></div></el-col>
        <el-col :span="1"><div class="head-text"><span><b><el-button @click="printDemo"> 打印 </el-button></b></span></div> </el-col>
      </el-row>
    </div>
    <!--工具栏-->
      <el-form ref="form" :model="form" :inline="true" :rules="rules" size="small" label-width="80px" style="width: 100%;">
      <p style="text-align: center;font-size: 32px"> 《专柜经营合同审批表》 </p>
        <el-row type="flex" align="center" justify="center">
          <el-col :span="16"><div class="head-text"><span>供应商类型：
              <el-select v-model="form.merchantType" filterable placeholder="请选择">
                <el-option v-for="item in dict.merchant_type" :key="item.id" :label="item.label" :value="item.value"/>
              </el-select> </span></div></el-col>
          <el-col :span="8"><div class="head-text"><span>供应商代表确签（盖章）</span></div></el-col>
        </el-row>
        <table id="table_top" class="mytable" border="1px solid #ccc" cellspacing="0" cellpadding="0" style="width: 100%;">
          <tr style="text-align: center">
            <td class="TdTitle" colspan="9">新供应商合同内容</td>
          </tr>
          <tr>
            <td class="TdTitle">名称（及代码）</td>
            <td colspan="3">
              <!-- 修改加入form单，增加数据 -->
              <el-form-item class="widthFit" label-width="0" prop="merchantName">
                <el-input v-model="form.merchantName" placeholder="请输入名称"/>
              </el-form-item>
            </td>
            <td class="TdTitle">联系人</td>
            <td colspan="1">
              <el-form-item class="widthFit" label-width="0" prop="businessName">
                <el-input v-model="form.businessName" placeholder="请输入联系人"/>
              </el-form-item>
            <td class="TdTitle">联系方式</td>
            <td colspan="2">
              <el-form-item class="widthFit" label-width="0" prop="businessTel">
                <el-input v-model="form.businessTel" placeholder="请输入联系方式"/>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td class="TdTitle">楼层:</td>
            <td colspan="1">
              <el-form-item class="widthFit" label-width="0" prop="floor">
                <el-input v-model="form.floor" placeholder="请输入楼层"/>
              </el-form-item>
              </td>
            <td class="TdTitle">编号:</td>
            <td colspan="3">
              <el-form-item class="widthFit" label-width="0" prop="number">
                <el-input v-model="form.number" placeholder="请输入编号"/>
              </el-form-item>
            </td>
            <td class="TdTitle">建筑面积:</td>
            <td colspan="2">
              <el-form-item class="widthFit" label-width="0" prop="buildingArea">
                <el-input v-model="form.buildingArea" placeholder="请输入建筑面积"/>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td class="TdTitle">联系地址</td>
            <td colspan="7">
              <el-form-item class="widthFit" label-width="0" prop="businessAddress">
                <el-input v-model="form.businessAddress" placeholder="请输入联系地址"/>
              </el-form-item>
              </td>
          </tr>
          <tr>
            <td class="TdTitle">品牌名称</td>
            <td class="TdTitle">（中文）</td>
            <td colspan="4">
               <el-form-item class="widthFit" label-width="0" prop="brandNameCn">
                <el-input v-model="form.brandNameCn" placeholder="请输入品牌中文名"/>
              </el-form-item>
            </td>
            <td class="TdTitle">（英文）</td>
            <td colspan="2">
              <el-form-item class="widthFit" label-width="0" prop="brandNameEn">
                <el-input v-model="form.brandNameEn" placeholder="请输入品牌英文名"/>
              </el-form-item>
              <!-- <el-input v-model="form.brandNameEn"></el-input> -->
            </td>
          </tr>
          <!-- check校验 -->
          <tr>
            <td class="TdTitle">品牌评价:</td>
            <td colspan="7" class="td-pendding">
              <el-checkbox-group
                v-model="form.brandAwarenessType"
                :min="0"
                :max="3">
                <el-checkbox v-for="item in dict.brand_awareness_type" :label="item.label" :key="item.id">{{ item.label }}</el-checkbox>
              </el-checkbox-group>
            </td>
          </tr>
          <tr>
            <td class="TdTitle">供应商类型:</td>
            <td colspan="7" class="td-pendding">
              <el-checkbox-group
                v-model="form.supplierType"
                :min="0"
                :max="3">
                <el-checkbox v-for="item in dict.supplier_type" :label="item.label" :key="item.id">{{ item.label }}</el-checkbox>
              </el-checkbox-group>
             </td>
          </tr>

          <tr>
            <td class="TdTitle">经营范围</td>
            <td colspan="7">
              <el-form-item class="widthFit" label-width="0" prop="businessScope">
                <el-input  type="textarea" v-model="form.businessScope" placeholder="请输入经营范围"/>
              </el-form-item>
              </td>
          </tr>
          <tr>
            <td class="TdTitle">合同期限:</td>
            <td colspan="2" style="text-align: center">
              <el-form-item label-width="0" prop="contractPeriodYear">
                <el-input v-model="form.contractPeriodYear" onkeyup="value=value.replace(/[^\d]/g,'')" maxlength="3" style="width: 70px;" placeholder="请输入具体数"/>年（
              </el-form-item>
              <el-form-item label-width="0" prop="contractPeriodMonth">
                <el-input v-model="form.contractPeriodMonth" onkeyup="value=value.replace(/[^\d]/g,'')" maxlength="2" style="width: 70px;" placeholder="请输入具体数"/>个月）
              </el-form-item>
            </td>
            <td colspan="5" style="text-align: center">
            <!-- 校验 -->
              自<el-date-picker v-model="form.contractPeriodStarttime" type="date" format="yyyy 年 MM 月 dd 日"/>起至
              <el-date-picker v-model="form.contractPeriodEndtime" type="date" format="yyyy 年 MM 月 dd 日"/>止
            </td>
          </tr>
          <tr>
            <td class="TdTitle">结算方式:</td>
            <td colspan="7" class="td-pendding">
              <el-checkbox-group class="jszj" v-model="form.jszjType" :min="0" :max="1" @change="jszjTypeChange">
                <el-checkbox v-if="item.label==='jszj1'"  v-for="item in dict.jszj_type" :label="item.label" :key="item.id">
                    1、租金方式（采用固定租金、固定管理费与提成租金两者取其高）;乙方按
                      <el-form-item label-width="0" prop="jszj1ZjTnM2">
                        <el-input  :disabled="type1" style="width: 90px;" v-model="form.jszj1ZjTnM2" placeholder=""/>
                      </el-form-item>
                    元/平方米即
                      <el-form-item label-width="0" prop="jszj1ZjTnYue">
                        <el-input  :disabled="type1" style="width: 90px;" v-model="form.jszj1ZjTnYue" placeholder=""/>
                      </el-form-item>
                    元/月（注:此为按套内面积计价，如按建筑面积计价则为
                    <el-form-item label-width="0" prop="jszj1ZjJzM2">
                        <el-input  :disabled="type1" style="width: 90px;" v-model="form.jszj1ZjJzM2" placeholder=""/>
                      </el-form-item>
                    向甲方支付固定租金,及乙方按
                    <el-form-item label-width="0" prop="jszj1GlfTnM2">
                        <el-input  :disabled="type1" style="width: 90px;" v-model="form.jszj1GlfTnM2" placeholder=""/>
                      </el-form-item>
                    元/平方米即
                     <el-form-item label-width="0" prop="jszj1GlfTnYue">
                        <el-input  :disabled="type1" style="width: 90px;" v-model="form.jszj1GlfTnYue" placeholder=""/>
                      </el-form-item>
                     元/月
                    （注：此为按套内面积计价,如按建筑面积计价则为
                    <el-form-item label-width="0" prop="jszj1GlfJzM2">
                        <el-input  :disabled="type1" style="width: 90px;" v-model="form.jszj1GlfJzM2" placeholder=""/>
                      </el-form-item>
                    元/平方米）向甲方支付固定管理费:
                    或乙方按每月销售额提成
                    <el-form-item label-width="0" prop="jszj1XseP">
                        <el-input  :disabled="type1" style="width: 90px;" v-model="form.jszj1XseP" placeholder=""/>
                      </el-form-item>
                     %计提给甲方.此提成租金与上述固定租金、固定管理费金额的总和比较取高值。
                </el-checkbox>
                <el-checkbox v-else-if="item.label==='jszj2'" :label="item.label" :key="item.id" >
                    2、采用固定租金加销售提成租金方式:甲方按
                    <el-form-item label-width="0" prop="jszj2ZjTnM2">
                        <el-input  :disabled="type2" style="width: 90px;" v-model="form.jszj2ZjTnM2" placeholder=""/>
                      </el-form-item>
                    元/平方米（注：此为按套内面积计价,
                    如按建筑面积计价则为
                     <el-form-item label-width="0" prop="jszj2ZjJzM2">
                        <el-input  :disabled="type2" style="width: 90px;" v-model="form.jszj2ZjJzM2" placeholder=""/>
                      </el-form-item>
                    元/平方米）收取乙方租金
                     <el-form-item label-width="0" prop="jszj2ZjTnYue">
                        <el-input  :disabled="type2" style="width: 120px; padding: 0px" v-model="form.jszj2ZjTnYue" placeholder=""/>
                      </el-form-item>
                    元/月,乙方还应按每月销售提成
                    <el-form-item label-width="0" prop="jszj2XseP">
                        <el-input  :disabled="type2" style="width: 90px; " v-model="form.jszj2XseP" placeholder=""/>
                      </el-form-item>
                    %计提给甲方。
                </el-checkbox>
                <el-checkbox v-else-if="item.label==='jszj3'" :label="item.label" :key="item.id" >
                    3、采用固定租金方式:甲方按
                     <el-form-item label-width="0" prop="jszj3ZjTnM2">
                        <el-input  :disabled="type3" style="width: 90px; " v-model="form.jszj3ZjTnM2" placeholder=""/>
                      </el-form-item>
                    元/平方米（注:此为按套内面积计价,如按建筑面积计价则为
                  <el-form-item label-width="0" prop="jszj4TcXseP">
                        <el-input  :disabled="type3" style="width: 90px; " v-model="form.jszj3ZjJzM2" placeholder=""/>
                      </el-form-item>
                    元/平方米）收取乙方租金
                  <el-form-item label-width="0" prop="jszj3ZjTnYue">
                        <el-input  :disabled="type3" style="width: 120px;padding: 0px; " v-model="form.jszj3ZjTnYue" placeholder=""/>
                      </el-form-item>
                     元/月。
                </el-checkbox>
                <el-checkbox v-else :label="item.label" :key="item.id" >
                    4、采用销售提成租金方式:乙方按每月销售额提成
                   <el-form-item label-width="0" prop="jszj4TcXseP">
                        <el-input  :disabled="type4" style="width: 90px; " v-model="form.jszj4TcXseP" placeholder=""/>
                      </el-form-item>
                     %计提给甲方。
                </el-checkbox>
              </el-checkbox-group>
            </td>
          </tr>
          <tr>
            <td class="TdTitle">
              仓库使用:
            </td>
            <td colspan="7" class="td-pendding">
              乙方使用甲方仓库，收仓库使用管理费
              <el-form-item label-width="0" prop="warehouseUseFee">
                <el-input style="width: 100px; " v-model="form.warehouseUseFee" placeholder=""/>
              </el-form-item>
              元/月。
            </td>
          </tr>

          <tr>
            <td class="TdTitle">
              综合管理费:
            </td>
            <td colspan="7" class="td-pendding">
              <el-checkbox-group v-model="form.zhglType" :min="0" :max="2" @change="advertisingTypeChange">
                <el-checkbox v-for="item in dict.zhgl_type" :label="item.label" :key="item.id">{{item.label}}</el-checkbox>
              </el-checkbox-group>
              每平方米套内面积每月人民币
              <el-form-item label-width="0" prop="wyglfTnYue">
                <el-input style="width: 100px; " v-model="form.wyglfTnYue" placeholder=""/>
              </el-form-item>
              元,该费用由乙方在交纳租金时一并支付。
            </td>
          </tr>
          <tr>
            <td class="TdTitle">
              广告位相关:
            </td>
            <td colspan="7" class="td-pendding">
              <p>乙方有偿租用甲方的
                <el-form-item label-width="0" prop="advertisingSpaceH">
                <el-input style="width: 70px; " v-model="form.advertisingSpaceH" placeholder=""/>
              </el-form-item>
                号广告位,广告面积
                <el-form-item label-width="0" prop="advertisingArea">
                <el-input style="width: 70px; " v-model="form.advertisingArea" placeholder=""/>
              </el-form-item>
                平方米, 广告租金
                <el-form-item label-width="0" prop="advertisingRentFee">
                <el-input style="width: 100px; " v-model="form.advertisingRentFee" placeholder=""/>
              </el-form-item>
              元/㎡。</p>
              <div>
                <div style="width: 16%;display:inline-block">广告位维护费为:</div>
                <div style="width: 73%;display:inline-block">
                  <el-checkbox-group v-model="form.advertisingPayType" :min="0" :max="1" @change="advertisingTypeChange">
                    <el-checkbox v-if="item.label==='month'"  v-for="item in dict.advertising_pay_type" :label="item.label" :key="item.id">
                      每月支付
                       <el-form-item label-width="0" prop="advertisingMaintenanceFeeMonth">
                          <el-input  :disabled="advertisingMonth" style="width: 100px; "  v-model="form.advertisingMaintenanceFeeMonth" placeholder=""/>
                       </el-form-item>
                      元。
                    </el-checkbox>
                    <el-checkbox v-else :label="item.label" :key="item.id" >
                      一次性支付
                      <el-form-item label-width="0" prop="advertisingMaintenanceFeeOne">
                          <el-input :disabled="advertisingOne" style="width: 100px; "   v-model="form.advertisingMaintenanceFeeOne" placeholder=""/>
                       </el-form-item>
                      元。
                    </el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
              租用时间: <el-date-picker v-model="form.advertisingRentStarttime" type="date" format="yyyy 年 MM 月 dd 日"/>至 <el-date-picker v-model="form.advertisingRentEndtime" type="date" format="yyyy 年 MM 月 dd 日"/>
            </td>
          </tr>
          <tr>
            <td class="TdTitle">
              场地使用费:
            </td>
            <td colspan="7" class="td-pendding">
              乙方同意给甲方专用场地使用费
              <el-form-item label-width="0" prop="siteFeeYdn">
                  <el-input style="width: 100px; "   v-model="form.siteFeeYdn" placeholder=""/>
              </el-form-item>
              元/店/年，合计
              <el-form-item label-width="0" prop="siteFeeY">
                  <el-input style="width: 100px; "   v-model="form.siteFeeY" placeholder=""/>
              </el-form-item>
              元。
            </td>
          </tr>
          <tr>
            <td class="TdTitle">
              设备设施:
            </td>
            <td colspan="7" class="td-pendding">
              甲方提供设备设施
              <el-form-item label-width="0" prop="equipmentName">
                  <el-input style="width: 100px; "   v-model="form.equipmentName" placeholder=""/>
              </el-form-item>
              给乙方使用，乙方一次性缴纳设施管理费
              <el-form-item label-width="0" prop="equipmentMangeFee">
                  <el-input style="width: 100px; "   v-model="form.equipmentMangeFee" placeholder=""/>
              </el-form-item>
              元，或甲方收取乙方设备设施使用折旧费
              <el-form-item label-width="0" prop="equipmentDepreciationFee">
                  <el-input style="width: 100px; "   v-model="form.equipmentDepreciationFee" placeholder=""/>
              </el-form-item>
              元/月。
            </td>
          </tr>
          <tr>
            <td>
              设施管理合作支持:
            </td>
            <td colspan="7" class="td-pendding">
              乙方向甲方提供设施管理合作支持
               <el-form-item label-width="0" prop="facilityManagementCooperationSupportY">
                  <el-input style="width: 100px; "   v-model="form.facilityManagementCooperationSupportY" placeholder=""/>
              </el-form-item>
              元,用于乙方经营场地和公共设施的维护保养费用。
            </td>
          </tr>
          <tr>
            <td class="TdTitle">
              设施管理费与合同保证金:
            </td>
            <td colspan="7" class="td-pendding">
              合同签订三天内,乙方向甲方交纳设施管理费
              <el-form-item label-width="0" prop="facilityManagementFee">
                  <el-input style="width: 100px; "   v-model="form.facilityManagementFee" placeholder=""/>
              </el-form-item>
              元，合同保证金
               <el-form-item label-width="0" prop="contractDeposit">
                  <el-input style="width: 100px; "   v-model="form.contractDeposit" placeholder=""/>
              </el-form-item>
              元（含合同保证、设备设施保证、管理保证、商品质量保证等）。
            </td>
          </tr>
          <tr>
            <td class="TdTitle">
              第三方支付消费:
            </td>
            <td colspan="7" class="td-pendding">
              第三方支付消费按消费总额
              <el-form-item label-width="0" prop="equipmentRentalFee">
                  <el-input style="width: 50px; "   v-model="form.equipmentRentalFee" placeholder=""/>
              </el-form-item>
              %支付设备租赁费。
            </td>
          </tr>
          <tr>
            <td class="TdTitle">
              铺货数量:
            </td>
            <td colspan="7" class="td-pendding">
              乙方自开业之日起,乙方根据经营的面积,铺货数量须达到
              <el-form-item label-width="0" prop="distributionQuantity">
                  <el-input v-model="form.distributionQuantity" style="width: 100px;" placeholder=""/>
              </el-form-item>
              件以上。
            </td>
          </tr>
          <tr>
            <td class="TdTitle">
              促销员数量:
            </td>
            <td colspan="7" class="td-pendding">
              乙方自行聘请
              <el-form-item label-width="0" prop="promoterM">
                  <el-input v-model="form.promoterM" style="width: 70px;" placeholder=""/>
              </el-form-item>
              名促销员负责商品的销售、保管。每月支付
              <el-form-item label-width="0" prop="promoterUniformFeeR">
                  <el-input v-model="form.promoterUniformFeeR" style="width: 70px;" placeholder=""/>
              </el-form-item>
              人*50元/人的促销员管理费；每人一次性收取200元培训费；一次性收取培训资料费及工卡维护费80元/人。
            </td>
          </tr>
          <tr>
            <td class="TdTitle">
              保底销售任务:
            </td>
            <td colspan="7" class="td-pendding">
              乙方确保全年完成销售任务
              <el-form-item label-width="0" prop="guaranteedSalesTaskWy">
                  <el-input v-model="form.guaranteedSalesTaskWy" style="width: 70px;" placeholder=""/>
              </el-form-item>
              万元,如未能完成保底销售任务时需补足 销售提成差额给甲方.
            </td>
          </tr>
          <tr>
            <td class="TdTitle">
              单次促销活动服务费:
            </td>
            <td colspan="7" class="td-pendding">
              甲方按活动时间的销售额收取乙方
              <el-form-item label-width="0" prop="promotionOneP">
                  <el-input v-model="form.promotionOneP" style="width: 70px;" placeholder=""/>
              </el-form-item>
              %促销活动服务费.
            </td>
          </tr>
          <tr>
            <td class="TdTitle">
              合同期内宣传促销费:
            </td>
            <td colspan="7" class="td-pendding">
              甲方按乙方每月销售额
              <el-form-item label-width="0" prop="promotionXcFeeP">
                  <el-input v-model="form.promotionXcFeeP" style="width: 100px;" placeholder=""/>
              </el-form-item>
              %收取宣传促销服务费或收取
              <el-form-item label-width="0" prop="promotionXcFeeY">
                  <el-input v-model="form.promotionXcFeeY" style="width: 100px;" placeholder=""/>
              </el-form-item>
              元的宣传促销服务费。另甲方每年向乙方收取
              <el-form-item label-width="0" prop="promotionJqFeeY">
                  <el-input v-model="form.promotionJqFeeY" style="width: 100px;" placeholder=""/>
              </el-form-item>
              元的节庆促销服务费。
            </td>
          </tr>
          <tr>
            <td class="TdTitle">
              合作方式:
            </td>
            <td colspan="7" class="td-pendding">
              <el-checkbox-group
                v-model="form.cooperationType"
                :min="0"
                :max="1" @change="cooperationTypeChange">
                <el-checkbox v-if="item.id==26"  v-for="item in dict.cooperation_type" :label="item.label" :key="item.id">
                  <span>其他</span>
                  <el-form-item label-width="0" prop="cooperationOther">
                    <el-input :disabled="cooperationDisabled" v-model="form.cooperationOther"  placeholder=""/>
                  </el-form-item>
                </el-checkbox>
                <el-checkbox v-else :label="item.label" :key="item.id" ><span>{{ item.label }}</span></el-checkbox>
              </el-checkbox-group>
              </td>
          </tr>
          <tr>
            <td class="TdTitle">
              年龄层:
            </td>
            <td colspan="4">
              <el-form-item class="widthFit" label-width="0" prop="ageGroup">
                    <el-input v-model="form.ageGroup"  placeholder=""/>
              </el-form-item>
            </td>
            <td class="TdTitle">
              价格区间:
            </td>
            <td colspan="3">
              <el-form-item class="widthFit" label-width="0" prop="priceRange">
                    <el-input v-model="form.priceRange"  placeholder=""/>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td class="TdTitle">入场装修意向时间</td>
            <td colspan="7">
              <el-date-picker v-model="form.decorationTime"  type="date" format="yyyy 年 MM 月 dd 日"/>,预计 <el-date-picker v-model="form.openingTime"  type="date" format="yyyy 年 MM 月 dd 日"/>开业
            </td>
          </tr>
          <tr>
            <td class="TdTitle">备注</td>
            <td colspan="7">
              <el-form-item class="widthFit" label-width="0" prop="remark">
                    <el-input type="textarea" v-model="form.remark" placeholder=""/>
              </el-form-item>
            </td>
          </tr>
        </table>
      </el-form>
          <el-row type="flex" align="center" justify="center">
            <el-col :span="6"><div class="main-text-left"><span>业务经办人：
              <el-select v-model="form.businessOperatorId" filterable placeholder="请选择">
                <el-option v-for="item in userList" :key="item.id" :label="item.label" :value="item.value"/>
              </el-select> </span></div></el-col>
            <el-col :span="6"><div class="main-text-left"><span>部门负责人：
              <el-select v-model="form.departmentHeadId" filterable placeholder="请选择">
                <el-option v-for="item in userList" :key="item.id" :label="item.label" :value="item.value"/>
              </el-select> </span></div></el-col>
            <el-col :span="6"><div class="main-text-left"><span>部门总经理：
              <el-select v-model="form.departmentGeneralManagerId" filterable placeholder="请选择">
                <el-option v-for="item in userList" :key="item.id" :label="item.label" :value="item.value"/>
              </el-select> </span></div></el-col>
            <el-col :span="6"><div class="main-text"><span>总经理：
              <el-select v-model="form.generalManagerId" filterable placeholder="请选择">
                <el-option v-for="item in userList" :key="item.id" :label="item.label" :value="item.value"/>
              </el-select> </span></div>
            </el-col>
          </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitData">确认</el-button>
      </div>
  </div>
</template>

<script>
  import vueEasyPrint from "vue-easy-print";
  import crudAttractMerchant from '@/api/merchant/attractMerchant'
  import AttarctMerchantPrint from '../../../components/AttarctMerchantPrint/index'
  import merchant from "@/api/merchant";
  const defaultForm = {
    attractMerchantId:null,
    merchantId:null,
    attractMerchantNo:null,
    merchantName:null,
    merchantType:null,
    updateTime:null,
    updateBy:null,
    status:null,
    floor:null,
    number:null,
    buildingArea:null,
    brandNameCn:null,
    brandNameEn:null,
    openingTime:null,
    contractPeriodYear:null,
    contractPeriodMonth:null,
    contractPeriodStarttime:null,
    contractPeriodEndtime:null,
    jszj1ZjTnM2:null,
    jszj1ZjTnYue:null,
    jszj1ZjJzM2:null,
    jszj1GlfTnM2:null,
    jszj1GlfTnYue:null,
    jszj1GlfJzM2:null,
    jszj1XseP:null,
    jszj2ZjTnM2:null,
    jszj2ZjTnYue:null,
    jszj2ZjJzM2:null,
    jszj2XseP:null,
    jszj3ZjTnM2:null,
    jszj3ZjTnYue:null,
    jszj3ZjJzM2:null,
    jszj4TcXseP:null,
    facilityManagementFee:null,
    contractDeposit:null,
    wyglfTnYue:null,
    equipmentRentalFee:null,
    distributionQuantity:null,
    promoterM:null,
    promoterUniformFeeR:null,
    promoterUniformFeeT:null,
    promoterUniformFeeY:null,
    guaranteedSalesTaskWy:null,
    facilityManagementCooperationSupportY:null,
    advertisingSpaceH:null,
    advertisingArea:null,
    advertisingRentFee:null,
    advertisingMaintenanceFeeMonth:null,
    advertisingMaintenanceFeeOne:null,
    advertisingRentStarttime:null,
    advertisingRentEndtime:null,
    siteFeeYdn:null,
    siteFeeY:null,
    equipmentMangeFee:null,
    equipmentDepreciationFee:null,
    promotionOneP:null,
    promotionXcFeeP:null,
    promotionXcFeeY:null,
    promotionJqFeeY:null,
    ageGroup:null,
    priceRange:null,
    businessName:null,
    businessTel:null,
    businessAddress:null,
    approvalId: null,
    approvalStatus: null,
    approvalUrl:null,
    createTime:null,
    createBy:null,
    isDel:null,
    businessScope:null,
    warehouseusefee:null,
    equipmentName:null,
    cooperationOther:null,
    decorationTime:null,
    remark:null,
    businessOperatorId:null,
    departmentHeadId:null,
    departmentGeneralManagerId:null,
    generalManagerId:null,
    businessOperatorName:null,
    departmentHeadName:null,
    departmentGeneralManagerName:null,
    generalManagerName:null,
    zhglType:[],
    cooperationType:[],
    brandAwarenessType:[],
    supplierType:[],
    advertisingPayType:[],
    jszjType:[]
  }
  export default {
    name: 'AttractMerchantAdd',
    components: { AttarctMerchantPrint, vueEasyPrint,crudAttractMerchant },
    dicts: ['merchant_type', 'brand_awareness_type', 'supplier_type', 'cooperation_type', 'zhgl_type', 'advertising_pay_type', 'jszj_type'],
    data() {
      return {
        permission: {
          add: ['admin', 'attractMerchant:add'],
          edit: ['admin', 'attractMerchant:edit'],
          del: ['admin', 'attractMerchant:del']
        },
        form: defaultForm,
        rules: {
          /* 对应增加规则 */
          merchantName:
            [ {required: true, message: '供应商类型不能为空', trigger: 'blur'} ],
          businessName:
            [ {required: true, message: '联系人不能为空', trigger: 'blur'} ],
           businessTel:
            [ {required: true, message: ' ', trigger: 'blur'} ],
          floor:
            [ {required: true, message: '联系方式不能为空   ', trigger: 'blur'} ],
          number:
            [ {required: true, message: ' 楼层不能为空  ', trigger: 'blur'} ],
          buildingArea:
            [ {required: true, message: ' 建筑面积不能为空 ', trigger: 'blur'} ],
          businessAddress:
            [ {required: true, message: ' 联系地址不能为空  ', trigger: 'blur'} ],
          brandNameCn:
            [ {required: true, message: ' 品牌中文名不能为空 ', trigger: 'blur'} ],
          brandNameEn:
            [ {required: false, message: ' 品牌英文名不能为空', trigger: 'blur'} ],
          businessScope:
            [ {required: true, message: '经营范围不能为空 ', trigger: 'blur'} ],
          contractPeriodYear:
            [ {required: false, message: '年份不能为空 ', trigger: 'blur'} ],
          contractPeriodMonth:
            [ {required: false, message: '月份不能为空 ', trigger: 'blur'} ],
          jszj1ZjTnM2:
            [ {required: false, message: '请输入数值 ', trigger: 'blur'} ],
          jszj1ZjTnYue:
            [ {required: false, message: '请输入数值 ', trigger: 'blur'} ],
          jszj1XseP:
            [ {required: false, message: ' 请输入数值', trigger: 'blur'} ],
          jszj2ZjTnYue:
            [ {required: false, message: ' 请输入数值', trigger: 'blur'} ],
          jszj2ZjJzM2:
            [ {required: false, message: ' 请输入数值', trigger: 'blur'} ],
          jszj2XseP:
            [ {required: false, message: '请输入数值 ', trigger: 'blur'} ],
          jszj3ZjTnM2:
            [ {required: false, message: ' 请输入数值', trigger: 'blur'} ],
          jszj3ZjTnYue:
            [ {required: false, message: ' 请输入数值', trigger: 'blur'} ],
          jszj4TcXseP:
            [ {required: false, message: '请输入数值 ', trigger: 'blur'} ],
          warehouseUseFee:
            [ {required: false, message: '请输入数值 ', trigger: 'blur'} ],
          wyglfTnYue:
            [ {required: false, message: '请输入数值 ', trigger: 'blur'} ],
          advertisingSpaceH:
            [ {required: false, message: '广告位不能为空 ', trigger: 'blur'} ],
          advertisingArea:
            [ {required: false, message: ' 广告面积不能为空', trigger: 'blur'} ],
          advertisingRentFee:
            [ {required: false, message: '请输入数值 ', trigger: 'blur'} ],
          advertisingMaintenanceFeeMonth:
            [ {required: false, message: '请输入数值 ', trigger: 'blur'} ],
          advertisingMaintenanceFeeOne:
            [ {required: false, message: ' 请输入数值', trigger: 'blur'} ],
          siteFeeYdn:
            [ {required: false, message: ' 请输入数值', trigger: 'blur'} ],
          siteFeeY:
            [ {required: false, message: ' 请输入数值', trigger: 'blur'} ],
          equipmentName:
            [ {required: false, message: ' 设备设施名不能为空', trigger: 'blur'} ],
          equipmentMangeFee:
            [ {required: false, message: ' 请输入数值', trigger: 'blur'} ],
          equipmentDepreciationFee:
            [ {required: false, message: '请输入数值 ', trigger: 'blur'} ],
          facilityManagementCooperationSupportY:
            [ {required: false, message: ' 请输入数值', trigger: 'blur'} ],
          facilityManagementFee:
            [ {required: false, message: ' 请输入数值', trigger: 'blur'} ],
          contractDeposit:
            [ {required: false, message: ' 请输入数值', trigger: 'blur'} ],
          equipmentRentalFee:
            [ {required: false, message: ' 请输入数值', trigger: 'blur'} ],
          distributionQuantity:
            [ {required: false, message: ' 件数不能为空', trigger: 'blur'} ],
          promoterM:
            [ {required: false, message: '请输入数值 ', trigger: 'blur'} ],
          promoterUniformFeeR:
            [ {required: false, message: '请输入数值 ', trigger: 'blur'} ],
          guaranteedSalesTaskWy:
            [ {required: false, message: ' 请输入数值', trigger: 'blur'} ],
          promotionOneP:
            [ {required: false, message: ' 请输入数值', trigger: 'blur'} ],
          promotionXcFeeP:
            [ {required: false, message: '请输入数值 ', trigger: 'blur'} ],
          promotionXcFeeY:
            [ {required: false, message: '请输入数值 ', trigger: 'blur'} ],
          promotionJqFeeY:
            [ {required: false, message: ' 请输入数值', trigger: 'blur'} ],

         /*  cooperationOther:
            [ {required: true, message: ' 请输入数值', trigger: 'blur'} ], */
          ageGroup:
            [ {required: true, message: ' 年龄层不能为空', trigger: 'blur'} ],
          priceRange:
            [ {required: true, message: '价格区间 ', trigger: 'blur'} ],

         /*  remark:
            [ {required: true, message: '备注不能为空', trigger: 'blur'} ], */


        },
        attractMerchantNo: '',
        approvalStatus:'',
        status: null,
        operation:'',
        type1:true,
        type2:true,
        type3:true,
        type4:true,
        cooperationDisabled:true,
        advertisingMonth:true,
        advertisingOne:true,
        userList:[]
      }
    },
    watch: {
    },
    mounted() {
      this.getUserList()
      var id = this.$route.params.id
      var numReg = /^[0-9]*$/
      var numRe = new RegExp(numReg)
      if (numRe.test(id) && id) {
        this.getAttractMerchant(id)
        this.operation='edit'
      }else {
        this.operation='add'
        this.form={
          attractMerchantId:null,
          merchantId:null,
          attractMerchantNo:null,
          merchantName:null,
          merchantType:null,
          updateTime:null,
          updateBy:null,
          status:null,
          floor:null,
          number:null,
          buildingArea:null,
          brandNameCn:null,
          brandNameEn:null,
          openingTime:null,
          contractPeriodYear:null,
          contractPeriodMonth:null,
          contractPeriodStarttime:null,
          contractPeriodEndtime:null,
          jszj1ZjTnM2:null,
          jszj1ZjTnYue:null,
          jszj1ZjJzM2:null,
          jszj1GlfTnM2:null,
          jszj1GlfTnYue:null,
          jszj1GlfJzM2:null,
          jszj1XseP:null,
          jszj2ZjTnM2:null,
          jszj2ZjTnYue:null,
          jszj2ZjJzM2:null,
          jszj2XseP:null,
          jszj3ZjTnM2:null,
          jszj3ZjTnYue:null,
          jszj3ZjJzM2:null,
          jszj4TcXseP:null,
          facilityManagementFee:null,
          contractDeposit:null,
          wyglfTnYue:null,
          equipmentRentalFee:null,
          distributionQuantity:null,
          promoterM:null,
          promoterUniformFeeR:null,
          promoterUniformFeeT:null,
          promoterUniformFeeY:null,
          guaranteedSalesTaskWy:null,
          facilityManagementCooperationSupportY:null,
          advertisingSpaceH:null,
          advertisingArea:null,
          advertisingRentFee:null,
          advertisingMaintenanceFeeMonth:null,
          advertisingMaintenanceFeeOne:null,
          advertisingRentStarttime:null,
          advertisingRentEndtime:null,
          siteFeeYdn:null,
          siteFeeY:null,
          equipmentMangeFee:null,
          equipmentDepreciationFee:null,
          promotionOneP:null,
          promotionXcFeeP:null,
          promotionXcFeeY:null,
          promotionJqFeeY:null,
          ageGroup:null,
          priceRange:null,
          businessName:null,
          businessTel:null,
          businessAddress:null,
          approvalId: null,
          approvalStatus: null,
          approvalUrl:null,
          createTime:null,
          createBy:null,
          isDel:null,
          businessScope:null,
          warehouseusefee:null,
          equipmentName:null,
          cooperationOther:null,
          decorationTime:null,
          remark:null,
          businessOperatorId:null,
          departmentHeadId:null,
          departmentGeneralManagerId:null,
          generalManagerId:null,
          businessOperatorName:null,
          departmentHeadName:null,
          departmentGeneralManagerName:null,
          generalManagerName:null,
          zhglType:[],
          cooperationType:[],
          brandAwarenessType:[],
          supplierType:[],
          advertisingPayType:[],
          jszjType:[]
        }
      }

    },
    methods: {
      cooperationTypeChange(value){
        if(value[0]=='其他'){
          this.cooperationDisabled=false
        }else {
          this.cooperationDisabled=true
        }
      },
      advertisingTypeChange(value){
        if(value[0]=='month'){
          this.advertisingMonth=false
          this.advertisingOne=true
        }else if(value[0]=='one'){
          this.advertisingMonth=true
          this.advertisingOne=false
        }
      },
      jszjTypeChange(value){
        if(value[0]=='jszj1'){
          this.type1=false
          this.type2=true
          this.type3=true
          this.type4=true
        }else if(value[0]=='jszj2'){
          this.type1=true
          this.type2=false
          this.type3=true
          this.type4=true
        }else if(value[0]=='jszj3'){
          this.type1=true
          this.type2=true
          this.type3=false
          this.type4=true
        }else if(value[0]=='jszj4'){
          this.type1=true
          this.type2=true
          this.type3=true
          this.type4=false
        }else {
          this.type1=true
          this.type2=true
          this.type3=true
          this.type4=true
        }
      },
      // 获取商户下拉列表
      getUserList() {
        crudAttractMerchant.getUserDowndrop().then(res => {
          this.userList = res;
        })
      },
      submitData() {
        if(this.attractMerchantNo == null){
          $.message.warn('招商编号不能为空')
        }
        if (this.$refs['form']) {
          this.$refs['form'].validate((valid) => {
            if (valid) {
              var obj = this.form
              if(obj.brandAwarenessType.length>0){
                var brandAwarenessType = obj.brandAwarenessType.join(',')
                obj.brandAwarenessType = brandAwarenessType
              }else {obj.brandAwarenessType=''}
              if(obj.supplierType.length>0){
                var brandAwarenessType = obj.supplierType.join(',')
                obj.supplierType = brandAwarenessType
              }else {obj.supplierType=''}
              if(obj.cooperationType.length>0){
                var cooperationType = obj.cooperationType.join(',')
                obj.cooperationType = cooperationType
                if(obj.cooperationType!='其他'){obj.financeName=''}
              }else {obj.cooperationType=''}
              if(obj.zhglType.length>0){
                var zhglType = obj.zhglType.join(',')
                obj.zhglType = zhglType
              }else {obj.zhglType=''}
              if(obj.advertisingPayType.length>0){
                var advertisingPayType = obj.advertisingPayType.join(',')
                obj.advertisingPayType = advertisingPayType
              }else {obj.advertisingPayType=''}
              if(obj.jszjType.length>0){
                var jszjType = obj.jszjType.join(',')
                obj.jszjType = jszjType
              }else {obj.jszjType=''}
              obj.attractMerchantNo=this.attractMerchantNo
              obj.approvalStatus=0
              this.userList.find((item)=>{
                if(item.value == obj.businessOperatorId) {
                  obj.businessOperatorName=item.label
                }
              });
              this.userList.find((item)=>{
                if(item.value == obj.departmentHeadId){
                  obj.departmentHeadName=item.label
                }
              });
              this.userList.find((item)=>{
                if(item.value == obj.departmentGeneralManagerId){
                  obj.departmentGeneralManagerName=item.label
                }
              });
              this.userList.find((item)=>{
                if(item.value == obj.departmentGeneralManagerId){
                  obj.generalManagerName=item.label
                }
              });
              if(this.operation == 'add'){
                crudAttractMerchant.add(obj).then(res => {
                  this.$back();
                })
              }else {
                crudAttractMerchant.edit(obj).then(res => {
                  this.$back();
                })
              }
            }
          })
        }
      },
      getAttractMerchant(id) {
        crudAttractMerchant.getAttractMerchantsInfo(id).then(res => {
          if(res.brandAwarenessType!=null && res.brandAwarenessType[0]!=null){res.brandAwarenessType= res.brandAwarenessType.split(',')}else {res.brandAwarenessType=[]}
          if(res.supplierType!=null && res.supplierType[0]!=null){res.supplierType= res.supplierType.split(',')}else {res.supplierType=[]}
          if(res.cooperationType!=null && res.cooperationType[0]!=null){res.cooperationType= res.cooperationType.split(',')}else {res.cooperationType=[]}
          if(res.zhglType!=null && res.zhglType[0]!=null){res.zhglType= res.zhglType.split(',')}else {res.zhglType=[]}
          if(res.advertisingPayType!=null && res.advertisingPayType[0]!=null){res.advertisingPayType= res.advertisingPayType.split(',')}else {res.advertisingPayType=[]}
          if(res.jszjType!=null && res.jszjType[0]!= null){res.jszjType= res.jszjType.split(',')}else{res.jszjType=[]}
          this.form = res
          this.attractMerchantNo=res.attractMerchantNo
          this.approvalStatus=res.approvalStatus
          this.jszjTypeChange(res.jszjType)
          this.cooperationTypeChange(res.cooperationType)
          this.advertisingTypeChange(res.advertisingPayType)
        })
      },
      printDemo(){
        console.log(this.form)
        this.$refs.easyPrint.print();
      }
    }
  }


</script>

<style lang="scss" scoped>
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
  @page{
    size: auto A4 landscape;
    margin: 8.5mm 6mm 6.5mm 6mm;
  }
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
    padding: 0 auto;
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
    font-size: 1.2rem;
    height: 54px;
    line-height: 54px;
  }
  .head-text{
    font-size: 22px;
    height: 54px;
    line-height: 54px;
  }
  .main-text{
    font-size: 1.2rem;
    height: 40px;
    line-height: 40px;
    text-align: center;
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
  /deep/.jszj .el-checkbox{
    white-space: normal;
  }
  /deep/.jszj .el-checkbox__input{
    top: 0.6rem;
    left: -0.6rem;
    position: absolute;
  }
  /deep/.jszj .el-checkbox__label{
    width: 100%;
  }
  /deep/.el-checkbox__label {
    font-size: 1.3rem;
  }
  /deep/.is-checked{
    /deep/.el-checkbox__label {
      color: black !important;
    }
  }
  /deep/.widthFit .el-form-item__content{
    width: 100%;
  }
  /deep/.widthFit{
    width: 100%;
  }
  /deep/.widthFit .el-form-item__content .el-input--small{
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
