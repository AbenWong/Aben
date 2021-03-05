import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../layout/index'

Vue.use(Router)

export const constantRouterMap = [
  { path: '/login',
    meta: { title: '登录', noCache: true },
    component: (resolve) => require(['@/views/login'], resolve),
    hidden: true
  },
  {
    path: '/404',
    component: (resolve) => require(['@/views/features/404'], resolve),
    hidden: true
  },
  {
    path: '/401',
    component: (resolve) => require(['@/views/features/401'], resolve),
    hidden: true
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: (resolve) => require(['@/views/features/redirect'], resolve)
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: (resolve) => require(['@/views/home'], resolve),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'index', affix: true, noCache: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'center',
        component: (resolve) => require(['@/views/system/user/center'], resolve),
        name: '个人中心',
        meta: { title: '个人中心' }
      }
    ]
  },
  {
    path: '/yshop/materia/index',
    name: `images`,
    meta: {
      title: '上传图片',
      noCache: true
    },
    component: (resolve) => require(['@/components/editorMaterial/index'], resolve),
    hidden: true
  },
  { path: '/inner/settlement/detail',
    meta: { title: '结算单详情', noCache: true },
    component: (resolve) => require(['@/views/cost/settlement/info'], resolve),
    hidden: true
  },
  { path: '/inner/pay/detail',
    meta: { title: '付款单详情', noCache: true },
    component: (resolve) => require(['@/views/cost/pay/info'], resolve),
    hidden: true
  },
  { path: '/inner/goodsbatch/detail',
    meta: { title: '商品建档详情', noCache: true },
    component: (resolve) => require(['@/views/goods/batch/info'], resolve),
    hidden: true
  },
  { path: '/inner/attractMerchant/detail',
    meta: { title: '招商管理详情', noCache: true },
    component: (resolve) => require(['@/views/merchant/attractMerchant/info'], resolve),
    hidden: true
  },
  { path: '/inner/merchant/detail',
    meta: { title: '商家变更单详情', noCache: true },
    component: (resolve) => require(['@/views/merchant/add'], resolve),
    hidden: true
  },
  { path: '/inner/contract/detail',
    meta: { title: '合同变更单详情', noCache: true },
    component: (resolve) => require(['@/views/operate/contract/info'], resolve),
    hidden: true
  },
  { path: '/inner/presaleChange/detail',
    meta: { title: '售前结算更单详情', noCache: true },
    component: (resolve) => require(['@/views/presale/info'], resolve),
    hidden: true
  }
]

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
