
<template>
    <div class="content">
      <div class="home">
        <el-image :src="conTop" class="con-top-image">
        </el-image>
      </div>
      <div class="user">{{user.nickName}} </div>
    </div>

</template>

<script>
  import {mapGetters} from "vuex";

  export default {
    name: 'Dashboard',
    computed: {
      ...mapGetters([
        'user',
      ]),
    },
    data(){
      return{
        conTop:require('@/assets/images/home.png')
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
 .content{
  position: relative;
} 
.home {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: -2;
    background-color: #f6f5f4;
  } 
  .con-top-image{
    margin-top:2.5vw;
    margin-left: 7vw;
    width: auto;
    height: auto;
    max-width: 78%;
    max-height: 80%;
    z-index: -1;
  }  

  .user {
     position: absolute;
    width: 2.5vw  ;
    height: 11.25vw  ;
    font-size: 2.3125vw;
    top: 5.4vw;
    right: 11vw;

    font-family: "Microsoft YaHei";
    color: #c9a781;
  } 

</style>
