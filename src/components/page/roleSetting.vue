<template>
  <div>
    <div class="block">
      <el-row>
        <el-button class="addBtn" @click="addRole()">创建角色</el-button>
      </el-row>
    </div>
    <div v-if="roles!==''">
      <el-table :data="roles" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column  prop="userRolePkid" label="pkid" width="100" align="center">
        </el-table-column>
        <el-table-column prop="userRolePkcode" label="code" align="center"></el-table-column>
        <el-table-column  prop="userRoleCtime" label="日期" sortable align="center">
        </el-table-column>
        <el-table-column  prop="userRoleName" label="角色" align="center">
        </el-table-column>
        <el-table-column  prop="userRoleDisable" label="是否禁用" align="center" :formatter="disableTxt">
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--<div class="pagination">-->
        <!--<el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="1000">-->
        <!--</el-pagination>-->
      <!--</div>-->
    </div>
    <div v-else style="text-align: center">加载中...</div>
    <!--新增-->
    <el-dialog :title="dailogTitleType" :visible.sync="addVisible" width="40%" :close-on-click-modal="false">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="日期">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.userRoleCtime" value-format="yyyy-MM-dd" style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="角色">
          <el-input v-model="form.userRoleName"></el-input>
        </el-form-item>
        <el-form-item label="是否禁用">
          <el-switch v-model="form.userRoleDisable"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd" v-if="!editVisible">确 定</el-button>
                <el-button type="primary" @click="updateEdit" v-else>确 定</el-button>
            </span>
    </el-dialog>
    <!--删除-->
    <el-dialog
      title="温馨提示"
      :visible.sync="delVisible"
      width="30%" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
    <el-button @click="delVisible = false">取 消</el-button>
    <el-button type="primary" @click="deleteEdit">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<script>
import httpService from '@/api/HttpService'
import axios from 'axios'
export default {
  data () {
    return {
      http: httpService.getAxios,
      // url: '/sysOperate/findAllRoleList',
      multipleSelection: [],
      dailogTitleType: '',
      cur_page: 1,
      value1: '',
      editVisible: false,
      addVisible: false,
      delVisible: false,
      dialogVisible: false,
      value: '',
      roles: [],
      form: {
        userRoleName: '',
        userRoleCtime: '',
        userRoleDisable: true
      },
      idx: -1
    }
  },
  created () {
    this.getData()
  },
  methods: {
    //  禁用转文字
    disableTxt (val) {
      if (val.userRoleDisable === 0) {
        return '禁用'
      } else if (val.userRoleDisable === 1) {
        return '启用'
      }
    },
    // 角色列表
    getData () {
      var _this = this
      axios.post(this.GLOBAL.BASE_URL + '/sysOperate/findAllRoleList',
        {headers: {'Content-Type': 'application/json'}}
      ).then(result => {
        let mes = result.data.message
        if (result.data.success === '200') {
          _this.roles = result.data.data
        } else if (mes === '无操作权限') {
          this.$router.push('/login')
          sessionStorage.clear()
          // _this.$message.error('无操作权限')
        }
      }).catch(error => {
        console.log(error)
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 新增弹窗
    addRole () {
      let _this = this
      _this.addVisible = true
      _this.editVisible = false
      _this.dailogTitleType = '新增'
    },
    // 新增
    saveAdd () {
      var _this = this
      var roleData = _this.form
      if (_this.form.userRoleDisable) {
        _this.form.userRoleDisable = '1'
      } else {
        _this.form.userRoleDisable = '0'
      }
      axios.post(this.GLOBAL.BASE_URL + '/sysOperate/saveRole', roleData,
        {headers: {'Content-Type': 'application/json'}}
      ).then(res => {
        _this.roles.push(roleData)
        _this.addVisible = false
        _this.$message.success(`添加成功`)
        _this.getData()
      })
    },
    //  删除
    deleteEdit () {
      var _this = this
      var index = _this.idx
      var pkid = {userRolePkid: _this.roles[index].userRolePkid}
      axios.post(this.GLOBAL.BASE_URL + '/sysOperate/deleteRoleById', pkid,
        {headers: {'Content-Type': 'application/json'}}
      )
        .then(res => {
          _this.roles.splice(this.idx, 1)
          _this.$message.success('删除成功')
          _this.delVisible = false
        }).catch(error => {
          console.log(error)
        })
    },
    // 编辑弹窗
    handleEdit (index, row) {
      var _this = this
      _this.idx = index
      _this.dailogTitleType = '编辑'
      _this.addVisible = true
      _this.editVisible = true
      const item = _this.roles[index]
      if (_this.roles[index].userRoleDisable === 1) {
        _this.form.userRoleDisable = true
      } else {
        _this.form.userRoleDisable = false
      }
      _this.form = {
        userRoleCtime: item.userRoleCtime,
        userRoleName: item.userRoleName,
        userRoleDisable: item.userRoleDisable
      }
    },
    handleDelete (index, row) {
      this.idx = index
      this.delVisible = true
    },
    //  编辑
    updateEdit () {
      var _this = this
      var index = _this.idx
      const item = _this.roles[index]
      if (_this.form.userRoleDisable) {
        _this.form.userRoleDisable = '1'
      } else {
        _this.form.userRoleDisable = '0'
      }
      var roleData = {
        userRolePkid: item.userRolePkid,
        userRoleName: _this.form.userRoleName,
        userRoleDisable: _this.form.userRoleDisable,
        userRoleCtime: _this.form.userRoleCtime
      }
      axios.post(this.GLOBAL.BASE_URL + '/sysOperate/saveRole', roleData,
        {headers: {'Content-Type': 'application/json'}})
        .then((res) => {
          _this.roleData = res.data.data
          _this.getData()
          _this.$message.success('修改成功')
          _this.addVisible = false
        }).catch((error) => {
          console.log(error)
        })
    }
  }
}
</script>
<style scoped>
  .addBtn{
    background-color: #d71718;
    color: #fff;
    margin-bottom: 20px;
  }
</style>
