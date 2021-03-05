<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <div v-if="collapse" class="title-collapse">
        <router-link key="collapse" class="sidebar-logo-link" to="/">
          <!--  <img v-if="logo" :src="logo" class="sidebar-logo"> -->
          <span class="title">SHUN<br>YING</span>
        </router-link>
      </div>
      <div v-else class="title-expand">
        <router-link key="expand" class="sidebar-logo-link" to="/">
          <!--  <img v-if="logo" :src="logo" class="sidebar-logo"> -->
          <h1 class="sidebar-title">{{ title }} </h1>
        </router-link>
      </div>

    </transition>
  </div>
</template>

<script>
import Logo from '@/assets/images/logo.png'
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: 'SHUNYING MIS',
      logo: Logo
    }
  }
}
</script>

<style lang="scss" scoped>
  .sidebarLogoFade-enter-active {
    transition: opacity 1.5s;
  }

  .sidebarLogoFade-enter,
  .sidebarLogoFade-leave-to {
    opacity: 0;
  }

  .title-collapse {
    position: relative;
    width: 100%;
    height: 50px;
    padding-top:9px ;
    line-height: 13px;
    text-align: center;
    overflow: hidden;

    & .sidebar-logo-link {
      height: 100%;
      width: 100%;

      & .sidebar-logo {
        width: 32px;
        height: 32px;
     /*    vertical-align: middle; */
        margin-right: 6px;
      }

      & .sidebar-title {
        display: inline-block;
        margin-right: 5rem;
        color: #fff;
        font-weight: 600;
        line-height: 50px;
        font-size: 14px;
        font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
        /* vertical-align: middle; */
      }
    }

    &.collapse {
      .sidebar-logo {
        margin-right: 0px;
      }
    }
  }
  .title-expand {
    position: relative;
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    overflow: hidden;

    & .sidebar-logo-link {
      height: 100%;
      width: 100%;

      & .sidebar-logo {
        width: 32px;
        height: 32px;
     /*    vertical-align: middle; */
        margin-right: 6px;
      }

      & .sidebar-title {
        display: inline-block;
        margin-right: 5rem;
        color: #fff;
        font-weight: 600;
        line-height: 35px;
        font-size: 14px;
        font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
        /* vertical-align: middle; */
      }
    }

    &.collapse {
      .sidebar-logo {
        margin-right: 0px;
      }
    }
  }

  .title{
    font-size: 5px  !important;
    color: #fff;
  }
</style>

