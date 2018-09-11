import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/',
      component: resolve => require(['../components/common/home.vue'], resolve),
      meta: {title: '自述文件'},
      children: [
        {
          path: '/dashboard',
          component: resolve => require(['../components/page/dashboard.vue'], resolve),
          meta: {title: '系统首页'}
        },
        {
          path: '/cardList',
          component: resolve => require(['../components/page/cardList.vue'], resolve),
          meta: {title: '卡列表'}
        },
        {
          path: '/courseList',
          component: resolve => require(['../components/page/courseList.vue'], resolve),
          meta: {title: '课程列表'}
        },
        {
          path: '/deviceList',
          component: resolve => require(['../components/page/deviceList.vue'], resolve),
          meta: {title: '设备列表'}
        },
        {
          path: '/role',
          component: resolve => require(['../components/page/roleSetting.vue'], resolve),
          meta: {title: '设置'}
        },
        {
          path: '/agentList',
          component: resolve => require(['../components/page/AllAgentList.vue'], resolve),
          meta: {title: '商户列表'}
        },
        {
          path: '/storeList',
          component: resolve => require(['../components/page/storeList.vue'], resolve),
          meta: {title: '门店列表'}
        },
        // {
        //   path: '/tabs',
        //   component: resolve => require(['../components/page/Tabs.vue'], resolve),
        //   meta: {title: 'tab选项卡'}
        // },
        {
          path: '/auth',
          component: resolve => require(['../components/page/allMenus.vue'], resolve),
          meta: {title: '角色设置'}
        },
        {
          path: '/memberList',
          component: resolve => require(['../components/page/memberList.vue'], resolve),
          meta: {
            title: '会员列表'
          }
        },
        {
          path: '/coachList',
          component: resolve => require(['../components/page/coachList.vue'], resolve),
          meta: {title: '教练列表'}
        },
        {
          path: '/staffList',
          component: resolve => require(['../components/page/staffList.vue'], resolve),
          meta: {title: '员工列表'}
        },
        {
          path: '/cardReleaseList',
          component: resolve => require(['../components/page/cardReleaseList'], resolve),
          meta: {title: '储值卡'}
        },
        {
          path: '/courseReleaseList',
          component: resolve => require(['../components/page/courseReleaseList'], resolve),
          meta: {title: '课程发布'}
        },
        {
          path: '/cardOrderList',
          component: resolve => require(['../components/page/cardOrderList'], resolve),
          meta: {title: '充值卡列表'}
        },
        {
          path: '/courseOrderList',
          component: resolve => require(['../components/page/courseOrderList'], resolve),
          meta: {title: '课程订单列表'}
        }
      ]
    },
    {
      path: '/login',
      component: resolve => require(['../components/page/Login.vue'], resolve)
    }
  ]
})
