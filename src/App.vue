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
  table{
    border: none;
  }
  #dateContainer  table td .isRed {
    display: inline-block;
    width: 100%;
    color: red;
  }
  #dateContainer  table tr {
    width: 100%;
    border-bottom: 1px solid #ccc;
    border-right: none;
    border-left: none;
    display: flex;
    justify-content: space-around;
  }
  #dateContainer  table tr:first-child td{
    height: 30px;
    line-height: 30px;
    border-top: 1px solid #ccc;
  }
  #dateContainer  table tr td:first-child {
    border-left: 1px solid #ccc;
  }
  #table tr  td {
    flex: 1;
    border-right: 1px solid #ccc;
    text-align: center;
    height: 80px;
  }
  .el-upload--text{
    width: 178px;
  }
</style>
