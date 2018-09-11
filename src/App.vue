<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style>
  @import '../static/css/main.css';
  @import '../static/css/color-dark.css';

  body .el-table th.gutter{
    display: table-cell!important;
  }
  body .el-table colgroup.gutter {
    display: table-cell !important;
  }
  .del-dialog-cnt{
    text-align: center
  }
  .addBtn{
    background-color: #d71718;
    color: #fff;
    margin-bottom: 20px;
  }
</style>
