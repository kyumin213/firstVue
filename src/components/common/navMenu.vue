<template>
  <div class="navHead">
    <div class="line"></div>
    <!--<el-menu class="el-menu-demo" :default-active="onRoutes" mode="horizontal" :collapse="collapse" background-color="#d71718"-->
             <!--text-color="#bfcbd9" active-text-color="#fff" unique-opened router>-->
      <!--<template v-for="item in items">-->
        <!--<template v-if="item.subs">-->
          <!--<el-submenu :index="item.index" :key="item.index">-->
            <!--<template slot="title">-->
              <!--<i :class="item.icon"></i><span slot="title">{{ item.title}}</span>-->
            <!--</template>-->
            <!--<el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">-->
              <!--{{ subItem.title }}-->
            <!--</el-menu-item>-->
          <!--</el-submenu>-->
        <!--</template>-->
        <!--<template v-else>-->
          <!--<el-menu-item :index="item.index" :key="item.index">-->
            <!--<i :class="item.icon"></i><span slot="title">{{item.title}}</span>-->
          <!--</el-menu-item>-->
        <!--</template>-->
      <!--</template>-->
    <!--</el-menu>-->
    <el-menu
      :default-active="onRoutes"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#d71718"
      text-color="#fff"
      active-text-color="#fff" unique-opened router>
      <el-menu-item index="dashboard"><i class="el-icon-document"></i>首页</el-menu-item>
      <el-menu-item index="agentList" v-if="adminListShow===true"><i class="el-icon-tickets"></i>商户列表</el-menu-item>
      <el-menu-item index="storeList" v-if="agentListShow===true"><i class="el-icon-tickets"></i>门店列表</el-menu-item>
      <el-menu-item index="deviceList" v-if="storeListShow===true"><i class="el-icon-tickets"></i>设备列表</el-menu-item>
      <el-menu-item index="deviceAdminUser" v-if="storeListShow===true"><i class="el-icon-tickets"></i>设备管理员列表</el-menu-item>
      <!--<el-menu-item index="testMap">测试地图</el-menu-item>-->
      <el-submenu index="4" v-if="storeListShow===true">
        <template slot="title"><i class="el-icon-setting"></i>门店设置</template>
        <el-menu-item index="memberList">会员列表</el-menu-item>
        <el-menu-item index="coachList">教练列表</el-menu-item>
        <el-menu-item index="staffList">员工列表</el-menu-item>
        <el-menu-item index="courseReleaseList">课程发布</el-menu-item>
      </el-submenu>
      <el-submenu index="5" v-if="agentListShow===true">
        <template slot="title"><i class="el-icon-setting"></i>商家设置</template>
        <el-menu-item index="cardList">汗滴卡列表</el-menu-item>
        <el-menu-item index="courseList">课程列表</el-menu-item>
        <el-menu-item index="couponList">优惠券</el-menu-item>
      </el-submenu>
      <el-submenu index="6" v-if="storeListShow===true">
        <template slot="title"><i class="el-icon-setting"></i>全部订单</template>
        <!--<el-menu-item index="cardOrderList">充值卡订单</el-menu-item>-->
        <el-menu-item index="courseOrderList">课程订单</el-menu-item>
      </el-submenu>
      <el-submenu index="7" v-if="adminListShow===true">
        <template slot="title"><i class="el-icon-setting"></i>设置</template>
        <el-menu-item index="role">角色设置</el-menu-item>
        <el-menu-item index="auth">全部菜单</el-menu-item>
      </el-submenu>
      <el-submenu index="8" class="loginOut">
        <template slot="title">{{userName}}</template>
        <el-menu-item index="login" @click="loginOut">退出</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import bus from '../common/bus'
export default {
  data () {
    return {
      collapse: false,
      agentListShow: false,
      storeListShow: false,
      adminListShow: false,
      userName: '',
      menuData: [],
      items: [
        {
          icon: 'el-icon-setting',
          index: 'dashboard',
          title: '首页'
        },
        {
          icon: 'el-icon-tickets',
          index: 'agentList',
          title: '商户列表'
        },
        {
          icon: 'el-icon-tickets',
          index: 'storeList',
          title: '门店列表'
        },
        // {
        //   icon: 'el-icon-message',
        //   index: 'tabs',
        //   title: 'tab选项卡'
        // },
        {
          icon: 'el-icon-date',
          index: '3',
          title: '商家设置',
          subs: [
            {
              index: 'cardList',
              title: '卡列表'
            },
            {
              index: 'courseList',
              title: '课程列表'
            }
          ]
        },
        {
          icon: 'el-icon-warning',
          index: '4',
          title: '设置',
          subs: [
            {
              index: 'role',
              title: '角色设置'
            },
            {
              index: 'auth',
              title: '全部菜单'
            }
          ]
        },
        {
          icon: 'el-icon-tickets',
          index: '5',
          title: '门店设置',
          subs: [
            {
              index: 'memberList',
              title: '会员列表'
            },
            {
              index: 'coachList',
              title: '教练列表'
            },
            {
              index: 'staffList',
              title: '员工列表'
            }
            // {
            //   index: 'cardReleaseList',
            //   title: '储值卡'
            // },
            // {
            //   index: 'courseReleaseList',
            //   title: '课程发布'
            // }
          ]
        },
        {
          icon: 'el-icon-tickets',
          index: '6',
          title: '全部订单',
          subs: [
            {
              index: 'cardOrderList',
              title: '充值卡列表'
            },
            {
              index: 'courseOrderList',
              title: '课程订单列表'
            }
          ]
        }
      ]
    }
  },

  computed: {
    onRoutes () {
      return this.$route.path.replace('/', '')
    }
  },
  created () {
    this.getAgent()
    this.getStore()
    this.getAdmin()
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on('collapse', msg => {
      this.collapse = msg
    })
  },
  methods: {
    // 账号为超管
    getAdmin () {
      let _this = this
      let agentId = sessionStorage.getItem('agentPkcode')
      let storeId = sessionStorage.getItem('storePkcode')
      if (!agentId && !storeId) {
        _this.adminListShow = true
      } else {
        _this.adminListShow = false
      }
    },
    // 账号为商户显示菜单
    getAgent () {
      let _this = this
      let agentId = sessionStorage.getItem('agentPkcode')
      let names = sessionStorage.getItem('userName')
      _this.userName = names
      if (agentId && agentId !== null && agentId !== undefined) {
        _this.agentListShow = true
      } else {
        _this.agentListShow = false
      }
    },
    //  账号为门店显示菜单
    getStore () {
      let _this = this
      let storeId = sessionStorage.getItem('storePkcode')
      if (storeId && storeId !== null && storeId !== undefined) {
        _this.storeListShow = true
      } else {
        _this.storeListShow = false
      }
    },
    //  退出账号
    loginOut () {
      this.$router.push('/login')
      sessionStorage.clear()
    }
  }

}
</script>
<style scoped>
  .el-menu{
    width: 100%;
    text-align: center;
    margin: 0 auto;
    /*height: 70px;*/
    /*line-height: 70px;*/
  }
  .loginOut{
    position: absolute;
    right: 40px;
  }
  /*.el-menu--horizontal>.el-menu-item, .el-submenu__title{*/
    /*height: 70px;*/
    /*line-height: 70px;*/
  /*}*/
</style>
