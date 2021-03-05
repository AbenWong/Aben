<template>
  <el-tabs v-model="activeName" style="padding-left: 8px;" @tab-click="tabClick">
    <el-tab-pane label="合同主体" name="first">
      <Content ref="content"/>
    </el-tab-pane>
    <!--    <el-tab-pane label="合同条款" name="second">-->
    <!--      <Clause ref="clause" />-->
    <!--    </el-tab-pane>-->
  </el-tabs>
</template>

<script>
  import Clause from './clause'
  import Content from './content'
  import Cost from './cost'

  export default {
    name: 'ContractChangeMain',
    components: {Clause, Content, Cost},
    data() {
      return {
        activeName: 'first'
      }
    },
    methods: {
      tabClick(name) {
        if (this.activeName === 'first') {
          this.$refs.local.crud.toQuery()
        } else {
          this.$refs.qiNiu.crud.toQuery()
        }
      }
    }
  }
</script>

<style scoped>
</style>
