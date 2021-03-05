<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission"/>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55"/>
        <el-table-column v-if="columns.visible('temporaryFeeNo')" prop="temporaryFeeNo" label="临时费用单号"/>
        <el-table-column v-if="columns.visible('merchantName')" prop="merchantName" label="供应商名称"/>
        <el-table-column v-if="columns.visible('contractNo')" prop="contractNo" label="合同编码"/>
        <el-table-column v-if="columns.visible('expropriationStatus')" prop="expropriationStatus" label="征收状态">
          <template slot-scope="scope">
            {{ dict.label.expropriation_status[scope.row.expropriationStatus] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('createBy')" prop="createBy" label="制单人"/>
        <el-table-column v-if="columns.visible('createTime')" prop="createTime" label="制单时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('updateBy')" prop="updateBy" label="更新人"/>
        <el-table-column v-if="columns.visible('updateTime')" prop="updateTime" label="更新时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('approvalStatus')" prop="approvalStatus" label="审批状态">
          <template slot-scope="scope">
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
        <el-table-column v-permission="['admin','temporaryFeeList:edit','temporaryFeeList:del']" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <el-link type="primary" :underline="false" v-if="scope.row.approvalStatus==0" v-permission="permission.edit"
                     @click="editList(scope.row.temporaryFeeListId)">编辑
            </el-link>
            <el-link type="primary" :underline="false" v-if="scope.row.approvalStatus==0" v-permission="permission.edit"
                     @click="approval(scope.row.temporaryFeeListId)">发起审批
            </el-link>
            <el-link type="primary" :underline="false" v-if="scope.row.approvalStatus!=0"
                     @click="toInfo(scope.row.temporaryFeeListId)">详情
            </el-link>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <div style="height: 40px;margin-top: 20px">
        <el-row>
          <el-col :span="12">
            <el-button type="primary" @click="addList">制单</el-button>
            <el-button type="success" @click="crud.doExport">导出</el-button>
            <el-button type="primary" @click="approvalList">批量审批</el-button>
            <!--<el-button type="danger">作废</el-button>-->
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
  </div>
</template>

<script>
  import crudTemporaryFeeList from "@/api/temporaryFee/temporaryFeeList"
  import CRUD, {crud, form, header, presenter} from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'
  import MaterialList from "@/components/material";

  // crud交由presenter持有
  const defaultCrud = CRUD({
    title: '临时收费清单',
    url: 'api/temporaryFeeList',
    sort: 'temporary_fee_list_id,desc',
    crudMethod: {...crudTemporaryFeeList},
    optShow: {
      add: false,
      edit: false,
      del: false,
      download: false
    }
  })
  const defaultForm = {
    temporaryFeeListId:null,
    temporaryFeeNo:null,
    contractNo:null,
    merchantId:null,
    merchantName:null,
    merchantNo:null,
    expropriationStatus:null,
    remark:null,
    approvalId:null,
    approvalStatus:null,
    approvalUrl:null,
    createTime:null,
    updateTime:null,
    createBy:null,
    updateBy:null,
    isDel:null
  }
  export default {
    name: 'TemporaryFeeList',
    components: {pagination, crudOperation, rrOperation, udOperation , MaterialList, crudTemporaryFeeList},
    mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    dicts: ['expropriation_status'],
    data() {
      return {

        permission: {
          add: ['admin', 'temporaryFeeList:add'],
          edit: ['admin', 'temporaryFeeList:edit'],
          del: ['admin', 'temporaryFeeList:del']
        },
        rules: {},
        qrcodeobj: {show: false, value: ''},
      }
    },
    watch: {
    },
    methods: {
      addList() {
        this.$router.push({path: '/temporaryFee/listAdd'})
      },
      editList(temporaryFeeListId) {
        this.$router.push({path: '/temporaryFee/listAdd?temporaryFeeListId=' + temporaryFeeListId})
      },
      toInfo(temporaryFeeListId) {
        this.$router.push({path: '/temporaryFee/listInfo?temporaryFeeListId=' + temporaryFeeListId})
      },
      // 到临时费用详情页面
      temporaryFeeDetails(temporaryFeeListNo) {
        this.$router.push({path: '/temporaryFee/index?temporaryFeeListNo=' + temporaryFeeListNo})
      },
      // 选择改变
      selectionChangeHandler(val) {
        this.crud.selections = val
      },
      // 发起审批
      approval(listId) {
        var that = this;
        that.$confirm('确认提交审批吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          crudTemporaryFeeList.approval(listId).then(res => {
            that.$message.success("发起审批成功")
            setTimeout(function () {
              that.crud.refresh();
            }, 500);
          })
        })
      },
      // 批量审批
      approvalList() {
        var val = this.crud.selections;
        if (val.length < 1) {
          this.$message.error("请选择需要审批的数据")
          return false;
        }
        // 这里的做法是除去已经发起审核过的数据
        var arr = [], tipstr = '', hasapproval = false;
        for (var i in val) {
          if (val[i].approvalStatus != 0) {
            this.$refs.table.toggleRowSelection(val[i], false);
            tipstr += ' ' + val[i].listNo
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
        this.crud.selections = arr;
        var data = [];
        for (var i in arr) {
          data.push(arr[i].listId);
        }
        var that = this;
        that.$confirm(tipstr, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          crudTemporaryFeeList.listApproval(data).then(res => {
            that.$message.success("发起批量审批成功")
            setTimeout(function () {
              that.crud.refresh();
            }, 500);
          })
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
          delete this.crud.params.listNo
          delete this.crud.params.approvalStatus
          delete this.crud.params.merchantName
          delete this.crud.params.merchantNo
          delete this.crud.params.contractNo
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
