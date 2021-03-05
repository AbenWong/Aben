<template>
  <div id="container" class="tk-ct">
    <el-form ref="form" :model="form" size="small" label-width="80px" style="width: 100%;">
      <!-- v-model="checkList" -->
      <el-checkbox-group v-model="checkList">
        <el-checkbox label="隐藏未修改"></el-checkbox>
        <el-checkbox label="显示原值" @change="showOldTk"></el-checkbox>
        <el-checkbox label="显示所有条款" @change="showAllTk"></el-checkbox>
      </el-checkbox-group>

      <table id="table_top1" ref="clause" class="mytable" border="1px solid #ccc" cellspacing="0" cellpadding="0" style="width: 100%;">
        <thead>
        <!-- 默认不展示 -->
        <tr>
          <!-- 点击+就展示-，相反 -->
          <td style="text-align: center;" class="op"></td>
          <td style="text-align: center;" class="cs"><el-checkbox  @change="checkAllChange"></el-checkbox></td>
          <td style="text-align: center;">行属性</td>
          <td style="text-align: center;" >条款分类</td>
          <td style="text-align: center;" >条款名称</td>
          <td style="text-align: center;" >条款内容</td>
        </tr>
        </thead>
        <tbody ref="tkRef">
        <tr v-for="(item, index) in dict.contract_tk" :key="index" style="display: none">
          <td class="op" @click="chOpCt(index,  $event)">+</td>
          <td class="cs">
            <input type="checkbox" @change="checkTkClick($event)"></input>
          </td>
          <td class="row-attr cm-class"><span style="color: green"></span></td>
          <td class="cm-class">条款</td>
          <td class="cm-class">{{ item.label }}</td>
          <td ><el-input disabled v-model="tkCtArray[index]" @change="ct => ctChange(ct, item.value)"/></td>
        </tr>
        </tbody>
      </table>
    </el-form>

  </div>
</template>


<script>
  import vueEasyPrint from "vue-easy-print";
  const tkCtArray = []
  const  tkCtMap = new Map();

  export default {
    dicts: ['contract_tk'],
    data() {
      return {
        checkList: [],
        permission: {
          add: ['admin', 'attractMerchant:add'],
          edit: ['admin', 'attractMerchant:edit'],
          del: ['admin', 'attractMerchant:del']
        },
        form: null,
        cts: [],
        tkCtArray: tkCtArray,
        tkCtMap: tkCtMap,
      }
    },
    watch: {},
    mounted() {

    },
    methods: {
      chOpCt(index, event){
        let el = event.currentTarget;
        this.chUpRowText(el)
      },
      chUpRowText(el){
        let ct = el.innerText
        el.innerText = (ct === "+") ? "-" : "+";
      },
      chInputStatus(el, checked){
        el.disabled = checked ? false : true
        el.style.cursor = checked ? 'Auto' : 'not-allowed'
        console.log(el.style.cursor)
      },
      checkTkClick(event){
        console.log("选中checkBox事件", event)
        let el = event.target
        this.checkTkAction(el)
      },
      checkTkAction(el){
        let rowAttrEl = el.parentElement.nextElementSibling
        console.log(rowAttrEl)
        let fc = rowAttrEl.firstElementChild
        fc.innerText = el.checked ? "新增" : ""
        let tkCt  = rowAttrEl.nextElementSibling.nextElementSibling.nextElementSibling
        let tkCtFEl = tkCt.firstElementChild.firstElementChild
        this.chInputStatus(tkCtFEl, el.checked)
      },
      ctChange(ct, value){
        this.tkCtMap.set(value, ct)
        console.log(this.tkCtMap)
      },
      checkAllChange(checked){
        console.log("是否全选?", checked)
        this.false = true
        let tkCt = this.$refs.tkRef;
        let inputs =  tkCt.querySelectorAll('input[type="checkbox"]');
        if (inputs == null){
          return
        }
        if (checked){
          for (const ck of inputs) {
            if (!ck.checked){
              ck.checked = true
            }
            this.checkTkAction(ck)
          }
        }else{
          for (const ck of inputs) {
            ck.checked = false;
            this.checkTkAction(ck)
          }
        }
      },
      showAllTk(checked){
        //checked：true：显示全部 false不显示全部
        let tkCt = this.$refs.tkRef;
        let trEls = tkCt.querySelectorAll('tr');
        if (trEls === undefined){
          return
        }
        for (let trEl of trEls) {
          if (checked){
            trEl.style.display = null
          }else{
            let input = trEl.firstElementChild.nextElementSibling.firstElementChild
            console.log(input)
            let inputCheck = input.checked
            if (!inputCheck){
              trEl.style.display = 'none'
            }
          }
        }
      },
      showOldTk(checked){
        //checked：true：只显示新增，即checkbox的checked为true
        console.log("显示原值")
        let tkCt = this.$refs.tkRef;
        //let inputs =  tkCt.querySelectorAll('input[type="checkbox"]');
        let ops = tkCt.getElementsByClassName("op")
        if(ops === undefined){
          return
        }
        let txt = checked ? "-" : "+"
        for (let opEl of ops) {
          opEl.innerText = txt;
        }
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

  .tk-ct{
    padding: 10px 30px 40px 20px;
  }
  .op{
    padding: 0;
    margin: 0;
    width: 34px;
    height: 34px;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
  }

  .cs{
    text-align: center;
    width: 50px;
  }

  .row-attr{
    width: 75px;
  }

  .cm-class{
    padding-left: 10px;
  }

  /**
    修改input框disabled样式
   */
  .el-input.is-disabled /deep/ .el-input__inner {
    color:#333333;
    background: white;
    opacity: 1;
    -webkit-text-fill-color: #333333;
  }

</style>
