<template>
  <span>
    <el-cascader v-model="value" clearable :options="options" @change="handleChange" />
  </span>
</template>

<script>
import dept from '@/api/system/dept'

export default {
  name: 'DeptSelect',
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
      dept.all().then(res => {
        this.data = res
        if (res.length > 0) {
          // 从level=0的开始遍历
          var arr = []
          for (var i in res) {
            var obj = {}
            // eslint-disable-next-line eqeqeq
            if (res[i].pid == 0) {
              obj.children = this.getSelList(res[i], res)
              obj.value = res[i].id
              obj.label = res[i].name
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
        if (obj.pid === res.id) {
          var child = this.getSelList(obj, list)
          temp.value = obj.id
          temp.label = obj.name
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
          if (this.data[i].id === cascaderValue[cascaderValue.length - 1]) {
            this.$emit('handleChange', this.data[i].name)
          }
        }
      }
      this.$emit('valueChange', cascaderValue[cascaderValue.length - 1])
    }
  }
}

</script>
