<template>
  <span>
    <el-cascader v-model="value" clearable :options="options" @change="handleChange" />
  </span>
</template>

<script>
import crudGoodsType from '@/api/goodsType'

export default {
  name: 'Cascader',
  props: {
    value: {
      type: Number
    }
  },
  data() {
    return {
      options: [],
      data: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      crudGoodsType.all().then(res => {
        this.data = res
        if (res.length > 0) {
          // 从level=0的开始遍历
          var arr = []
          for (var i in res) {
            var obj = {}
            // eslint-disable-next-line eqeqeq
            if (res[i].typeLevel == 0) {
              obj.children = this.getSelList(res[i], res)
              obj.value = res[i].typeId
              obj.label = res[i].typeSimpleName + '(' + res[i].typeSimpleCode + ')'
              arr.push(obj)
            }
          }
          this.options = arr
        }
      })
    },
    getSelList(res, list) {
      var arr = []
      for (var i in list) {
        var obj = list[i]; var temp = {}
        if (obj.typePid === res.typeId) {
          var child = this.getSelList(obj, list)
          temp.value = obj.typeId
          temp.label = obj.typeSimpleName + '(' + obj.typeSimpleCode + ')'
          if (child.length > 0) {
            temp.children = child
          }
          arr.push(temp)
        }
      }
      return arr
    },
    handleChange(cascaderValue) {
      if (this.data.length > 0) {
        for (var i in this.data) {
          if (this.data[i].typeId === cascaderValue[cascaderValue.length - 1]) {
            this.$emit('handleChange', this.data[i].typeName)
          }
        }
      }
      this.$emit('valueChange', cascaderValue[cascaderValue.length - 1])
    }
  }
}

</script>
