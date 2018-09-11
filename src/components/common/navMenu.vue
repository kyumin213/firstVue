<template>
  <div class="navHead">
    <div class="line"></div>
    <el-menu class="el-menu-demo" :default-active="onRoutes" mode="horizontal" :collapse="collapse" background-color="#d71718"
             text-color="#bfcbd9" active-text-color="#fff" unique-opened router>
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i><span slot="title">{{ item.title}}</span>
            </template>
            <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">
              {{ subItem.title }}
            </el-menu-item>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i><span slot="title">{{item.title}}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>
<style>
  .el-menu{
    width: 100%;
    text-align: center;
    margin: 0 auto;
    height: 70px;
  }
  ul{
    display: inline-block;
    /*width: 100%;*/
    text-align: center;
  }
  .el-menu--horizontal>.el-menu-item{
    height: 65px;
    line-height: 65px;
  }
</style>
<script>
import bus from '../common/bus'
export default {
  data () {
    return {
      collapse: false,
      items: [
        {
          icon: 'el-icon-setting',
          index: 'dashboard',
          title: '系统设置'
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
            },
            {
              index: 'deviceList',
              title: '设备列表'
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
            },
            {
              index: 'cardReleaseList',
              title: '储值卡'
            },
            {
              index: 'courseReleaseList',
              title: '课程发布'
            }
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
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on('collapse', msg => {
      this.collapse = msg
    })
  }
}
</script>
