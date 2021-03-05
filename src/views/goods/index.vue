<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.batchNo" clearable placeholder="商品变更单号" style="width: 200px;" class="filter-item"/>
        <el-input v-model="query.goodsNo" clearable placeholder="货号" style="width: 200px;" class="filter-item"/>
        <el-input v-model="query.goodsName" clearable placeholder="商品名称" style="width: 200px;" class="filter-item"/>
        <my-select v-model="query.merchantId" :placeholder="'请选择供应商'" :downdropType="'merchant/merchant-downdrop'"/>
        <my-select v-model="query.brandId" :placeholder="'请选择品牌'" :downdropType="'goodsBrand/brand-downdrop'"/>
        <my-select v-model="query.unitId" :placeholder="'请选择单位'" :downdropType="'goodsUnit/unit-downdrop'"/>
        <cascader :value="query.categoryId" @valueChange="categoryChange($event,index)"></cascader>
        <el-select v-model="query.status" placeholder="审批状态">
          <el-option label="审批中" value="0"></el-option>
          <el-option label="审批通过" value="1"></el-option>
        </el-select>
        <rrOperation :crud="crud"/>
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission"/>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;"
                @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55"/>
        <el-table-column v-if="columns.visible('goodsNo')" prop="goodsNo" label="货号"/>
        <el-table-column v-if="columns.visible('batchNo')" prop="batchNo" label="变更单号"/>
        <el-table-column v-if="columns.visible('goodsName')" prop="goodsName" label="商品名称"/>
        <el-table-column v-if="columns.visible('merchantName')" prop="merchantName" label="供应商"/>
        <el-table-column v-if="columns.visible('merchantNo')" prop="merchantNo" label="供应商编码"/>
        <el-table-column v-if="columns.visible('brandName')" prop="brandName" label="品牌"/>
        <el-table-column v-if="columns.visible('categoryName')" prop="categoryName" label="类别"/>
        <el-table-column v-if="columns.visible('unitName')" prop="unitName" label="单位"/>
        <el-table-column v-if="columns.visible('discountRate')" prop="discountRate" label="扣率">
          <template slot-scope="scope">
            <span>{{scope.row.discountRate}} %</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('price')" prop="price" label="单价"/>
        <el-table-column v-if="columns.visible('discountPrice')" prop="discountPrice" label="折扣价格"/>
        <el-table-column v-if="columns.visible('remark')" prop="remark" label="备注"/>
        <!--<el-table-column v-if="columns.visible('picture')" prop="picture" label="商品图片"/>-->
        <el-table-column v-if="columns.visible('picture')" prop="picture" label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status ==0" style="cursor: pointer" :type=" 'primary' ">待审批</el-tag>
            <el-tag v-if="scope.row.status ==1" style="cursor: pointer" :type=" 'success' ">审批通过</el-tag>
          </template>
        </el-table-column>
        <!--<el-table-column v-permission="['admin','goods:edit','goods:del']" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation :data="scope.row" :permission="permission"/>
          </template>
        </el-table-column>-->
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
  import MySelect from '@/components/MySelect'
  import crudGoods from '@/api/goods'
  import Cascader from '@/components/Cascader'
  // crud交由presenter持有
  const defaultCrud = CRUD({
    title: '商品接口',
    url: 'api/goods',
    sort: 'goods_id,desc',
    crudMethod: {...crudGoods},
    optShow: {
      add: false,
      edit: false,
      del: false,
      download: false
    },
  })

  export default {
    name: 'Goods',
    components: {MySelect, Cascader, pagination, crudOperation, rrOperation, udOperation, MaterialList},
    mixins: [presenter(defaultCrud), header(), crud()],
    data() {
      return {
        permission: {
          add: ['admin', 'settlement:add'],
          edit: ['admin', 'settlement:edit'],
          del: ['admin', 'settlement:del']
        },
      }
    },
    watch: {},
    mounted() {
      var batchNo = this.$route.query.batchNo;
      if (typeof (batchNo) != 'undefined') {
        this.crud.query.batchNo = batchNo;
      }
    },
    methods: {
      // 获取数据前设置好接口地址
      [CRUD.HOOK.beforeRefresh]() {
        var batchNo = this.$route.query.batchNo;
        if (typeof (batchNo) != 'undefined') {
          this.crud.query.batchNo = batchNo;
        }
        const query = this.query
        if (query.goodsNo && query.value) {
          this.crud.params['goodsNo'] = query.goodsNo
        }
        if (query.goodsName && query.value) {
          this.crud.params['goodsName'] = query.goodsName
        }
        if (query.merchantId && query.value) {
          this.crud.params['merchantId'] = query.merchantId
        }
        if (query.brandId && query.value) {
          this.crud.params['brandId'] = query.brandId
        }
        if (query.unitId && query.value) {
          this.crud.params['unitId'] = query.unitId
        }
        if (query.categoryId && query.value) {
          this.crud.params['categoryId'] = query.categoryId
        }
        if (query.status && query.value) {
          this.crud.params['status'] = query.status
        }
        return true
      },
      // 监听商品类别变化
      categoryChange(value) {
        this.crud.query.categoryId = value
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
