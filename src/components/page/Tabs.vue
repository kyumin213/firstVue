<template>
<div>
  <div class="crumbs">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item><i class="el-icon-message"></i> tab选项卡</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <div class="container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane  :label="`未读消息(${unread.length})`" name="first">
        <el-table :data="unread" :show-header="false" style="width: 100%">
          <el-table-column>
            <template slot-scope="scope">
              <span class="message-title">{{scope.row.title}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="data" style="width:180px;"></el-table-column>
          <el-table-column>
            <template style="width: 140px" slot-scope="scope">
              <el-button size="small" @click="handleRead(scope.$index)">标为已读</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="handle-row" v-if="unread.length>0">
          <el-button type="primary" @click="handleAllRead()">全部标为已读</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="`已读消息(${read.length})`" name="second">
        <template v-if=" activeName === 'second'">
          <el-table :data="read" style="width: 100%">
            <el-table-column>
              <template slot-scope="scope">
                <span class="message-title">{{scope.row.title}}</span>
              </template>
            </el-table-column>
            <el-table-column style="width: 150px" prop="data"></el-table-column>
            <el-table-column style="width: 120px">
              <template slot-scope="scope">
                <el-button type="danger" @click="handleDel(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="handle-row" v-if="read.length>0">
            <el-button type="danger" @click="handleAllDel()">删除全部</el-button>
          </div>
        </template>
      </el-tab-pane>
      <el-tab-pane :label="`回收站(${recycle.length})`" name="third">
        <template v-if=" activeName === 'third'">
          <el-table :data="recycle" :show-header="false" style="width:100%">
            <el-table-column>
              <template slot-scope="scope">
                <span class="message-title">{{scope.row.title}}</span>
              </template>
            </el-table-column>
            <el-table-column style="width: 180px" prop="data"></el-table-column>
            <el-table-column style="width: 150px">
              <template slot-scope="scope">
                <el-button @click="handleRestore(scope.$index)">还原</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="handle-row" v-if="recycle.length>0">
            <el-button type="danger" @click="handleAllRestore()">清空回收站</el-button>
          </div>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</div>
</template>
<script>
export default {
  data () {
    return {
      activeName: 'first',
      showHeader: false,
      unread: [{
        date: '2018-04-19 20:00:00',
        title: '【系统通知】该系统将于今晚凌晨2点到5点进行升级维护'
      }, {
        date: '2018-04-19 21:00:00',
        title: '今晚12点整发大红包，先到先得'
      }],
      read: [{
        date: '2018-04-19 20:00:00',
        title: '【系统通知】该系统将于今晚凌晨2点到5点进行升级维护'
      }],
      recycle: [{
        date: '2018-04-19 20:00:00',
        title: '【系统通知】该系统将于今晚凌晨2点到5点进行升级维护'
      }]
    }
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    },
    handleRead (index) {
      const item = this.unread.splice(index, 1)
      console.log(item)
      this.read = item.concat(this.read)
    },
    handleDel (index) {
      const item = this.read.splice(index, 1)
      this.recycle = item.concat(this.recycle)
    },
    handleRestore (index) {
      const item = this.recycle.splice(index, 1)
      this.read = item.concat(this.read)
    },
    handleAllDel (index) {
      const item = this.read.splice(index)
      this.recycle = item.concat(this.recycle)
    },
    handleAllRestore (index) {
      const item = this.recycle.splice(index)
      this.read = item.concat(this.read)
    },
    handleAllRead (index) {
      const item = this.unread.splice(index)
      this.read = item.concat(this.read)
    }
  },
  computed: {
    unreadNum () {
      return this.unread.length
    }
  }
}
</script>
<style>
  .message-title{
    cursor: pointer;
    width: 50%;
  }
  .handle-row{
    margin-top: 30px;
  }
</style>
