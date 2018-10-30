// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import vuex from 'vuex'
import ElementUI from 'element-ui'
import VueResource from 'vue-resource'
import VueJsonp from 'vue-jsonp'
import './validate'
import 'jquery'
import global_ from '@/components/global.vue'
import BMap from 'BMap'
// import store from './components/store/store'
import 'babel-polyfill'
import 'element-ui/lib/theme-chalk/index.css'
// Vue.config.debug = true
// Vue.config.productionTip = false
Vue.use(ElementUI, {size: 'small'}, VueResource, vuex, VueJsonp, BMap)
// axios.defaults.baseURL = process.env.API_ROOT
// console.log(process.env.API_ROOT)
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.common['token'] = sessionStorage.getItem('token')
Vue.prototype.axios = axios
Vue.prototype.GLOBAL = global_
if (process.env.NODE_ENV === 'production') {
  Vue.prototype.GLOBAL.BASE_URL = 'http://112.74.169.46:8094' // 测试接口
  // Vue.prototype.GLOBAL.BASE_URL = 'http://www.handyfitness.com.cn:8094' // 正式接口
} else {
  // Vue.prototype.GLOBAL.BASE_URL = '开发测试地址'
  Vue.prototype.GLOBAL.BASE_URL = '/api'
}
/* eslint-disable no-new */
// 使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
  const role = sessionStorage.getItem('token')
  if (!role && to.path !== '/login') {
    next('/login')
  } else {
    // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
    if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
      Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
        confirmButtonText: '确定'
      })
    } else {
      next()
    }
  }
})
// router.beforeEach((to, from, next) => {
//   const role = localStorage.getItem('token')
//   if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
//     if (role) { // 通过vuex state获取当前的token是否存在
//       next()
//     } else {
//       next({
//         path: '/login',
//         query: {redirect: to.fullPath} // 将跳转的路由path作为参数，登录成功后跳转到该路由
//       })
//     }
//   } else {
//     next()
//   }
// })

//   Axios.interceptors.request.use(config => {
// // 在发送请求之前做些什么
// //判断是否存在token，如果存在将每个页面header都添加token
//     if(store.state.token){
//       config.headers.common['Authentication-Token']=store.state.token
//     }
//
//     return config;
//   }, error => {
// // 对请求错误做些什么
//     return Promise.reject(error);
//   });
//
// // http response 拦截器
// Axios.interceptors.response.use(
//   response => {
//
//     return response;
//   },
//   error => {
//
//     if (error.response) {
//       switch (error.response.status) {
//         case 401:
//           this.$store.commit('del_token');
//           router.replace({
//             path: '/login',
//             query: {redirect: router.currentRoute.fullPath}//登录成功后跳入浏览的当前页面
//           })
//       }
//     }
//     return Promise.reject(error.response.data)

new Vue({
  router,
  axios,
  render: h => h(App)
}).$mount('#app')
