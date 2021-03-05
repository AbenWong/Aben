<template>
  <el-select v-model="selectValue" filterable clearable :default-value="defaultValue" :placeholder="placeholder" class="filter-item" @change="selectChange($event)">
    <el-option v-for="item in selectList" :key="item.value" :label="item.label" :value="item.value" />
  </el-select>
</template>

<script>
import downdrop from '@/api/downdrop'

export default {
  name: 'MySelect',
  model: {
    // 指向props的参数名
    prop: 'modelVal',
    // 事件名称
    event: 'change'
  },
  props: {
    modelVal: null,
    placeholder: null,
    param: {},
    downdropType: null,
    defaultValue: null
  },
  data() {
    return {
      selectValue: '',
      selectList: []
    }
  },
  watch: {
    // 监听值变化，再赋值给modelVal
    selectValue(value) {
      this.$emit('change', value)
    }
  },
  created() {
    this.getSelectList(this.downdropType)
  },
  updated() {
    this.selectValue = this.modelVal
  },
  methods: {
    getSelectList(downdropType) {
      // 获取下拉列表
      downdrop.downdropList(downdropType).then(res => {
        this.selectList = res
      })
    },
    selectChange(id) {
      this.selectList.find((item) => {
        if (item.value === id) {
          this.$emit('selectLabel', item.label)
        }
      })
    }
  }
}
</script>
