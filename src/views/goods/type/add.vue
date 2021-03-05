<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission"/>
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0"
                 :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="短编码" prop="typeSimpleCode">
            <el-input v-model="form.typeSimpleCode" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="类别简称">
            <el-input v-model="form.typeSimpleName" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-input v-model="form.createTime" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="更新时间">
            <el-input v-model="form.updateTime" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="创建人">
            <el-input v-model="form.createBy" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="更新人">
            <el-input v-model="form.updateBy" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="删除标记">
            <el-input v-model="form.isDel" style="width: 370px;"/>
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
        <el-table-column v-if="columns.visible('typeCode')" prop="typeCode" label="类别代码"/>
        <el-table-column v-if="columns.visible('typeSimpleCode')" prop="typeSimpleCode" label="短编码"/>
        <el-table-column v-if="columns.visible('typeName')" prop="typeName" label="类别全称"/>
        <el-table-column v-if="columns.visible('typeSimpleName')" prop="typeSimpleName" label="类别简称"/>
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
        <el-table-column v-if="columns.visible('isDel')" prop="isDel" label="删除标记"/>
        <el-table-column v-permission="['admin','goodsType:edit','goodsType:del']" label="操作" width="150px"
                         align="center">
          <template slot-scope="scope">
            <udOperation :data="scope.row" :permission="permission"/>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination/>
    </div>
  </div>
</template>

<script>
  import CRUD, {crud, form, header, presenter} from '@crud/crud'
  import crudGoodsType from '@/api/goodsType'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'
  import MaterialList from "@/components/material";

  // crud交由presenter持有
  const defaultCrud = CRUD({
    title: '商品类型',
    url: 'api/goodsType',
    sort: 'typeId,desc',
    crudMethod: {...crudGoodsType}
  })
  const defaultForm = {
    typeId: null,
    typeCode: null,
    typeSimpleCode: null,
    typePid: null,
    typeName: null,
    typeSimpleName: null,
    typeLevel: null,
    createTime: null,
    updateTime: null,
    createBy: null,
    updateBy: null,
    isDel: null
  }
  export default {
    name: 'GoodsType',
    components: {pagination, crudOperation, rrOperation, udOperation, MaterialList},
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    data() {
      return {

        permission: {
          add: ['admin', 'goodsType:add'],
          edit: ['admin', 'goodsType:edit'],
          del: ['admin', 'goodsType:del']
        },
        rules: {
          typeSimpleCode:
            [
              {required: true, message: '短编码不能为空', trigger: 'blur'}
            ],
          typePid:
            [
              {required: true, message: '父类别Id不能为空', trigger: 'blur'}
            ]
        }
      }
    },
    watch: {},
    methods: {
      // 获取数据前设置好接口地址
      [CRUD.HOOK.beforeRefresh]() {
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
