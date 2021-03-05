<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.brandName" clearable placeholder="品牌" style="width: 200px;" class="filter-item"/>
        <el-input v-model="query.brandCode" clearable placeholder="品牌编码" style="width: 200px;" class="filter-item"/>
        <el-input v-model="query.brandPinyin" clearable placeholder="品牌拼音" style="width: 200px;" class="filter-item"/>
        <el-select v-model="query.brandType" clearable filterable placeholder="品牌类型">
          <el-option v-for="item in dict.brand_type" :key="item.id" :label="item.label" :value="item.value"/>
        </el-select>
        <el-input v-model="query.brandFactory" clearable placeholder="生产工厂" style="width: 200px;" class="filter-item"/>
        <rrOperation :crud="crud"/>
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission"/>
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0"
                 :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="品牌" prop="brandName">
            <el-input v-model="form.brandName" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="品牌类型" prop="brandType">
            <el-select v-model="form.brandType" filterable placeholder="请选择">
              <el-option v-for="item in dict.brand_type" :key="item.id" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="生产工厂">
            <el-input v-model="form.brandFactory" style="width: 370px;"/>
          </el-form-item>
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
        <el-table-column v-if="columns.visible('brandName')" prop="brandName" label="品牌"/>
        <el-table-column v-if="columns.visible('brandCode')" prop="brandCode" label="品牌编码"/>
        <el-table-column v-if="columns.visible('brandPinyin')" prop="brandPinyin" label="品牌拼音"/>
        <el-table-column v-if="columns.visible('brandType')" prop="brandType" label="品牌类型">
          <template slot-scope="scope">
            {{ dict.label.brand_type[scope.row.brandType] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('brandFactory')" prop="brandFactory" label="生产工厂"/>
        <el-table-column v-if="columns.visible('createTime')" prop="createTime" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('updateTime')" prop="updateTime" label="更新时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('createBy')" prop="createBy" label="创建人"/>
        <el-table-column v-if="columns.visible('updateBy')" prop="updateBy" label="更新人"/>
        <el-table-column v-permission="['admin','goodsBrand:edit','goodsBrand:del']" label="操作" width="150px"
                         align="center">
          <template slot-scope="scope">
            <udOperation :data="scope.row" :permission="permission"/>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <div style="height: 40px;margin-top: 20px">
        <el-row>
          <el-col :span="12">
            <el-button type="primary" @click="crud.toAdd">新增</el-button>
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
  import crudGoodsBrand from '@/api/goodsBrand'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'
  import MaterialList from "@/components/material";

  // crud交由presenter持有
  const defaultCrud = CRUD({
    title: '品牌',
    url: 'api/goodsBrand',
    sort: 'barnd_id,desc',
    crudMethod: {...crudGoodsBrand},
    optShow: {
      add: false,
      edit: false,
      del: false,
      download: false
    },
  })
  const defaultForm = {
    barndId: null,
    brandName: null,
    brandCode: null,
    brandPinyin: null,
    brandType: null,
    brandFactory: null,
    createTime: null,
    updateTime: null,
    createBy: null,
    updateBy: null,
    isDel: null
  }
  export default {
    name: 'GoodsBrand',
    components: {pagination, crudOperation, rrOperation, udOperation, MaterialList},
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    dicts: ['brand_type'],
    data() {
      return {

        permission: {
          add: ['admin', 'goodsBrand:add'],
          edit: ['admin', 'goodsBrand:edit'],
          del: ['admin', 'goodsBrand:del']
        },
        rules: {
          brandName:
            [
              {required: true, message: '品牌不能为空', trigger: 'blur'}
            ],
          brandType:
            [
              {required: true, message: '品牌类型不能为空', trigger: 'blur'}
            ],
          brandFactory:
            [
              {required: true, message: '生产工厂不能为空', trigger: 'blur'}
            ]
        }
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
          delete this.crud.params.brandName
          delete this.crud.params.brandCode
          delete this.crud.params.brandPinyin
          delete this.crud.params.brandType
          delete this.crud.params.brandFactory
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
