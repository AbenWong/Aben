<template>
  <div class="login">
    <div class="login-box">


      <div style="width: 50%;" class="left-box">
        <div
          style="background: rgba(58, 98, 215,.4);width: 100%;height: 100%; display: flex;flex-direction:column;justify-content: center;align-items: center; ">
          <div class="wel-use">
            <p>欢 迎 使 用</p>
          </div>
          <div class="tip-box">
            <p>Management Information System</p>
            <div class="tip-box-title">顺盈百货MIS系统管理后台</div>
          </div>
        </div>
      </div>


      <div style="width: 50%;">
        <div class="logo"></div>
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-position="left" label-width="0px"
                 class="login-form">

          <h1 class="title">
            登 录
            <p></p>
          </h1>
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="账号"
                      style="font-size:21px">
              <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon"/>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-if="visible" v-model="loginForm.password" type="password" auto-complete="off" placeholder="密码"
                      @keyup.enter.native="handleLogin" ref="password" style="font-size:21px">
              <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon"/>
              <i slot="suffix" @click="changePass('show')" class="el-icon-view el-icon-password"></i>
            </el-input>
            <el-input v-else v-model="loginForm.password" type="text" auto-complete="off" placeholder="密码"
                      @keyup.enter.native="handleLogin" ref="password" style="font-size:21px">
              <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon"/>
              <i slot="suffix" class="el-icon-view" @click="changePass('hide')"></i>
            </el-input>
          </el-form-item>
          <!--  <el-checkbox v-model="loginForm.rememberMe" style="margin:0 0 25px 0;" >
              记住密码
            </el-checkbox> -->
          <el-form-item style="width:100%;" class="loginbtn">
            <el-button :loading="loading" size="medium" type="primary" style="width:100%;"
                       @click.native.prevent="handleLogin">
              <span v-if="!loading">登 录</span>
              <span v-else>登 录 中...</span>
            </el-button>
          </el-form-item>

        </el-form>
      </div>


    </div>
  </div>
</template>

<script>
  import {encrypt} from '@/utils/rsaEncrypt'
  import Config from '@/settings'
  import {getCodeImg} from '@/api/login'
  import Cookies from 'js-cookie'

  export default {
    name: 'Login',
    data() {
      return {
        codeUrl: '',
        cookiePass: '',
        loginForm: {
          username: '',
          password: '',
          rememberMe: false,
          code: '',
          uuid: ''
        },
        loginRules: {
          username: [{required: true, trigger: 'blur', message: '用户名不能为空'}],
          password: [{required: true, trigger: 'blur', message: '密码不能为空'}],
          code: [{required: true, trigger: 'change', message: '验证码不能为空'}]
        },
        loading: false,
        redirect: undefined,
        visible: true,
      }
    },
    watch: {
      $route: {
        handler: function (route) {
          this.redirect = route.query && route.query.redirect
        },
        immediate: true
      }
    },
    created() {
      this.getCode()
      this.getCookie()
    },
    methods: {
      getCode() {
        getCodeImg().then(res => {
          this.codeUrl = res.img
          this.loginForm.uuid = res.uuid
        })
      },
      getCookie() {
        const username = Cookies.get('username')
        let password = Cookies.get('password')
        const rememberMe = Cookies.get('rememberMe')
        // 保存cookie里面的加密后的密码
        this.cookiePass = password === undefined ? '' : password
        password = password === undefined ? this.loginForm.password : password
        this.loginForm = {
          username: username === undefined ? this.loginForm.username : username,
          password: password,
          rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
          code: ''
        }
      },
      handleLogin() {
        this.$refs.loginForm.validate(valid => {
          const user = {
            username: this.loginForm.username,
            password: this.loginForm.password,
            rememberMe: this.loginForm.rememberMe,
            code: this.loginForm.code,
            uuid: this.loginForm.uuid
          }
          if (user.password !== this.cookiePass) {
            user.password = encrypt(user.password)
          }
          if (valid) {
            this.loading = true
            if (user.rememberMe) {
              Cookies.set('username', user.username, {expires: Config.passCookieExpires})
              Cookies.set('password', user.password, {expires: Config.passCookieExpires})
              Cookies.set('rememberMe', user.rememberMe, {expires: Config.passCookieExpires})
            } else {
              Cookies.remove('username')
              Cookies.remove('password')
              Cookies.remove('rememberMe')
            }
            this.$store.dispatch('Login', user).then(() => {
              this.loading = false
              this.$router.push({path: this.redirect || '/'})
            }).catch(() => {
              this.loading = false
              this.getCode()
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      changePass(value) {
        this.visible = !(value === 'show'); //切换密码框的显示
        this.$nextTick(function () {//对焦密码框
          this.$refs['password'].focus()
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    background: rgb(137, 163, 230);
    background-size: cover;
  }

  .login-box {
    width: 80%;
    height: 78%;
    background: #fff;
    border-radius: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow: hidden;

    .left-box {
      width: 50%;
      height: 100%;
      background-image: url("../assets/images/bg.jpg");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;

      .wel-use {
        font-size: 50px;
        color: #fff;
        text-align: center;
      }

      .tip-box {
        margin: 0 auto;
        color: #fff;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 18px;

        div {
          border: 1px solid #fff;
          border-radius: 100px;
          width: 50%;

          line-height: 35px;
          text-align: center;
        }
      }

    }

  }

  .login-form {
    border-radius: 6px;
    background: #ffffff;
    width: 385px;
    padding: 25px 25px 5px 25px;
    margin: 0 auto;

    .el-input {
      height: 38px;
      border: 0px;

      input {
        height: 38px;
        border: 0px;
        border-bottom: 1px solid #ccc;
        border-radius: 0px;
      }
    }

    .el-button {
      border-radius: 20px;
    }

    .input-icon {
      height: 39px;
      width: 14px;
      margin-left: 2px;
    }
  }


  .title {
    margin: 0 auto 30px auto;
    text-align: center;
    color: #707070;

    p {
      border-bottom: 2px solid rgb(58, 98, 215);;
      width: 20%;
      margin: 0 auto;
    }
  }

  .logo {
    width: 200px;
    height: 200px;
    background-image: url("../assets/images/logo.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    margin: 0 auto;
  }

  .exit {
    position: absolute;
    top: 0px;
    right: 0px;
  }

  .close {
    line-height: 8px;
    vertical-align: text-top;
  }

  .close::before {
    width: 8px;
  }

  @media (max-width: 550px) {
    .login-box {
      height: 65%;
      width: 90%;
      margin-bottom: 150px;
    }
    .tip-box {
      font-size: 1px !important;

    }
    .tip-box-title {
      width: 90% !important;
    }
    .logo {
      width: 150px;
      height: 150px;
      background-image: url("../assets/images/logo.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      margin: 0 auto;
    }
    .title {
      margin-right: 220px;
      font-size: 20px;
    }
    .el-input {
      width: 140px;
    }
    .loginbtn {
      width: 140px !important;
    }
    .el-input {
      font-size: 9px !important;
    }
  }
</style>
