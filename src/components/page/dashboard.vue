<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-row>
          <el-col>
            <el-card shadow="hover" class="mgb20">
              <div class="user-info">
                <!--<img src="static/img/img.jpg" class="user-avator" alt="">-->
                <div class="user-info-cont">
                  <div class="user-info-name">{{name}}</div>
                  <div>{{role}}</div>
                </div>
              </div>
              <div class="user-info-list">登录时间：<span>{{times}}</span></div>
              <div class="user-info-list">登录地点：<span>深圳</span></div>
            </el-card>
            <el-card shadow="hover">
              <el-row :gutter="20" class="mgb20">
              <el-col :span="8">
              <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-1">
              <i class="el-icon-view grid-con-icon"></i>
              <div class="grid-cont-right">
              <div class="grid-num">0</div>
              <div style="width: 80px">用户访问量</div>
              </div>
              </div>
              </el-card>
              </el-col>
              <el-col :span="8">
              <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-2">
              <i class="el-icon-message grid-con-icon"></i>
              <div class="grid-cont-right">
              <div class="grid-num">0</div>
              <div style="width: 80px">系统消息</div>
              </div>
              </div>
              </el-card>
              </el-col>
              <el-col :span="8">
              <el-card shadow="hover" :body-style="{padding: '0px'}">
              <div class="grid-content grid-con-3">
              <i class="el-icon-goods grid-con-icon"></i>
              <div class="grid-cont-right">
              <div class="grid-num">0</div>
              <div style="width: 80px">数量</div>
              </div>
              </div>
              </el-card>
              </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="16">
        <el-card shadow="hover" :body-style="{ height: '100%'}">
          <!--<router-link to="courseOrderList">跳转</router-link>-->
          <el-button @click="toLogin" type="primary">跳转登录</el-button>
          <div>内容完善中</div>
          <!--<iframe src='../../../static/index1.html' width="1200" height="300" frameborder="0" scrolling="auto" v-show="hashBd"></iframe>-->
          <!--<iframe src='' width="103%" height="400" frameborder="0" scrolling="auto" id="firSrc"></iframe>-->
          <!--<dataShow></dataShow>-->
          <!--<div slot="header" class="clearfix">-->
            <!--<span>待办事项</span>-->
            <!--<el-button style="float: right; padding: 3px 0" type="text">添加</el-button>-->
          <!--</div>-->
          <!--<el-table :data="todoList" :show-header="false" height="304" style="width: 100%;font-size:14px;">-->
            <!--<el-table-column width="40">-->
              <!--<template slot-scope="scope">-->
                <!--<el-checkbox v-model="scope.row.status"></el-checkbox>-->
              <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column>-->
              <!--<template slot-scope="scope">-->
                <!--<div class="todo-item" :class="{'todo-item-del': scope.row.status}">{{scope.row.title}}</div>-->
              <!--</template>-->
            <!--</el-table-column>-->
            <!--<el-table-column width="60">-->
              <!--<template slot-scope="scope">-->
                <!--<i class="el-icon-edit"></i>-->
                <!--<i class="el-icon-delete"></i>-->
              <!--</template>-->
            <!--</el-table-column>-->
          <!--</el-table>-->
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import dataShow from './dataShow.vue'
import bus from '../common/bus'
export default {
  name: 'dashboard',
  data () {
    return {
      // hashBd: false,
      srcs: 'http://www.baidu.com',
      name: sessionStorage.getItem('userName'),
      times: sessionStorage.getItem('times'),
      collapse: false,
      todoList: [
        {
          title: '今天要修复100个bug',
          status: false
        },
        {
          title: '今天要修复100个bug',
          status: false
        },
        {
          title: '今天要修复100个bug',
          status: true
        },
        {
          title: '今天要写100行代码加几个bug吧',
          status: true
        }
      ]
    }
  },
  components: {
    dataShow
  },
  computed: {
    role () {
      return this.name === 'admin' ? '超级管理员' : '普通用户'
    }

  },
  // mounted () {
  //   let fir = document.getElementById('firSrc')
  //   let token = sessionStorage.getItem('token')
  //   fir.src = '../../../static/index1.html?token=' + token
  //   // console.log(fir.src)
  // },
  created () {
    bus.$on('collapse', msg => {
      this.collapse = msg
    })
    // this.getSrc()
  },
  methods: {
    getSrc () {
      let _this = this
      if (_this.name === 'admin') {
        _this.hashBd = true
      } else {
        _this.hashBd = false
      }
    },
    toLogin () {
      let fir = document.getElementById('firSrc')
      let token = sessionStorage.getItem('token')
      fir.src = 'http://www.baidu.com?token=' + token
      console.log(fir.src)
      // let _this = this
      // if (_this.hashBd) {
      //   _this.hashBd = false
      // } else {
      //   _this.hashBd = true
      // }
      // this.$router.push('/login')
    }
  }
}

</script>

<style scoped>
  .el-row {
    margin-bottom: 20px;
  }

  .grid-content {
    display: flex;
    align-items: center;
    height: 100px;
  }

  .grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 12px;
    color: #999;
  }

  .grid-num {
    font-size: 30px;
    font-weight: bold;
  }

  .grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
  }

  .grid-con-1 .grid-con-icon {
    background: rgb(45, 140, 240);
  }

  .grid-con-1 .grid-num {
    color: rgb(45, 140, 240);
  }

  .grid-con-2 .grid-con-icon {
    background: rgb(100, 213, 114);
  }

  .grid-con-2 .grid-num {
    color: rgb(45, 140, 240);
  }

  .grid-con-3 .grid-con-icon {
    background: rgb(242, 94, 67);
  }

  .grid-con-3 .grid-num {
    color: rgb(242, 94, 67);
  }

  .user-info {
    display: flex;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #ccc;
    margin-bottom: 20px;
  }

  .user-avator {
    width: 120px;
    height: 120px;
    border-radius: 50%;
  }

  .user-info-cont {
    padding-left: 50px;
    flex: 1;
    font-size: 14px;
    color: #999;
  }

  .user-info-cont div:first-child {
    font-size: 30px;
    color: #222;
  }

  .user-info-list {
    font-size: 14px;
    color: #999;
    line-height: 25px;
  }

  .user-info-list span {
    margin-left: 70px;
  }

  .mgb20 {
    margin-bottom: 20px;
  }

  .todo-item {
    font-size: 14px;
  }

  .todo-item-del {
    text-decoration: line-through;
    color: #999;
  }
  .isRed {
    display: inline-block;
    height: 100px;
    width: 100%;
    color: red;
  }
</style>
