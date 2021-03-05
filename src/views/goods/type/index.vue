<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <el-dialog :close-on-click-modal="false" :visible.sync="showAdd" title="添加商品类别" width="500px">
        <el-form ref="addForm" :model="addForm" :rules="rules" size="small" label-width="80px">
          <el-form-item label="当前类别">
            <el-input readonly v-model="addForm.currTypeName" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="当前类别" v-if="addForm.parentName">
            <el-input readonly v-model="addForm.parentName" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="类别编码">
            <span v-if="addForm.parentName">{{addForm.parentCode}}</span>
            <el-input v-model="addForm.typeSimpleCode" style="width: 140px;"/>
          </el-form-item>
          <el-form-item label="类别名称">
            <el-input v-model="addForm.typeSimpleName" style="width: 370px;"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="showAdd=false">取消</el-button>
          <el-button type="primary" @click="submitData">确认</el-button>
        </div>
      </el-dialog>
      <div style="display: flex;justify-content: center;align-items: flex-start;">
        <!-- 左边 -->
        <div style="width: 30%">
          <h2>所有分类列表</h2>
          <div style="border-bottom: 1px solid #efefef; margin-bottom:20px"></div>
          <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </div>
        <!-- 右边 -->
        <div style="width: 70% ;margin-left:30px ;padding-left:30px;border-left:1px solid #efefef;">
          <div style="display: flex;border-bottom:1px solid #efefef;width:60%;margin-bottom:20px">
            <h2>分类信息</h2>
            <el-button v-if="this.form.typeName" class="button1" type="primary" @click="addSameType" plain>添加同级分类
            </el-button>
            <el-button v-if="this.form.typeName" class="button2" type="primary" @click="addDownType" plain>添加该类子分类
            </el-button>
          </div>
          <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px" v-if="this.form.typeName">
            <el-form-item label="类型编码">
              <span class="parentCode">{{form.parentCode}}</span>
              <el-input v-model="form.typeSimpleCode" style="width: 100px;"/>
            </el-form-item>
            <el-form-item label="类别名称">
              <el-input v-model="form.typeSimpleName" style="width: 270px;"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitFormData" style="width: 120px;">保存</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import crudGoodsType from '@/api/goodsType'

  export default {
    name: 'GoodsType',
    data() {
      return {
        form: {},
        addForm: {},
        currType: {},
        showAdd: false,
        rules: {},
        data: [],
        testvalue: [],
        testoptions: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
      }
    },
    mounted() {
      this.getData();
    },
    methods: {
      getData() {
        crudGoodsType.all().then(res => {
          if (res.length > 0) {
            // 从level=0的开始遍历
            var arr = [];
            for (var i in res) {
              if (res[i].typeLevel == 0) {
                res[i].parentCode = '';
                res[i].parentName = '';
                res[i].children = this.getList(res[i], res)
                res[i].label = res[i].typeSimpleName + "(" + res[i].typeSimpleCode + ")";
                arr.push(res[i])
              }
            }
            this.data = arr;
          }
        })
      },
      getList(res, list) {
        var arr = [];
        for (var i in list) {
          var obj = list[i];
          if (obj.typePid === res.typeId) {
            var child = this.getList(obj, list);
            obj.parentCode = res.typeCode;
            obj.parentName = res.typeName;
            obj.label = obj.typeSimpleName + "(" + obj.typeSimpleCode + ")";
            obj.children = child;
            arr.push(obj);
          }
        }
        return arr;
      },
      handleNodeClick(res) {
        var obj = Object.assign({}, res);
        obj.children = null;
        this.form = obj;
        this.currType = res;
      },
      // 添加同级分类
      addSameType() {
        this.addForm = {};
        this.addForm.typeLevel = this.currType.typeLevel;
        this.addForm.parentCode = this.currType.parentCode;
        this.addForm.parentName = this.currType.parentName;
        this.addForm.currTypeName = this.currType.typeName;
        this.addForm.typePid = this.currType.typePid;
        this.showAdd = true;
      },
      // 添加下级分类
      addDownType() {
        this.addForm = {};
        this.addForm.typeLevel = this.currType.typeLevel + 1;
        this.addForm.parentCode = this.currType.typeCode;
        this.addForm.currTypeName = this.currType.typeName;
        this.addForm.parentName = this.currType.typeName;
        this.addForm.typePid = this.currType.typeId;
        this.showAdd = true;
      },
      submitFormData() {
        crudGoodsType.edit(this.form).then(res => {
          this.$message.success("修改成功");
          this.form = {};
          this.getData()
        })
      },
      submitData() {
        // 拼接类别名称
        this.addForm.typeCode = this.addForm.parentCode + this.addForm.typeSimpleCode;
        // 拼接类别名称
        this.addForm.typeName = this.addForm.parentName + ' ' + this.addForm.typeSimpleName;
        crudGoodsType.add(this.addForm).then(res => {
          this.$message.success("添加成功");
          this.addForm = {};
          this.showAdd = false;
          this.getData()
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

  h2 {
    margin-top: 25px;
    margin-right: 6px;
  }

  .button1 {
    margin: 10px;
    background-color: #13ce66;
    color: #fff;
  }

  .button1:hover {
    background: rgba(44, 230, 127, .8);
  }

  .button2 {
    margin: 10px;
    background-color: #ffbd0b;
    color: #fff;
  }

  .button2:hover {
    background: rgba(255, 186, 0, .6);

  }
</style>
