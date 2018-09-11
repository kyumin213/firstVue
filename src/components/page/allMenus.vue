<template>
<div>
  <div class="block">
    <el-row>
      <el-button class="addBtn" @click="addMenu()">创建菜单</el-button>
    </el-row>
  </div>
  <div>
    <el-table :data="menuData" border style="width: 100%"  @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="userAuthPkid" label="ID" width="55" align="center"></el-table-column>
      <el-table-column prop="userAuthPkcode" label="主键编码" align="center"></el-table-column>
      <!--<el-table-column  prop="userRolePkid" label="pkid">-->
      <!--</el-table-column>-->
      <el-table-column  prop="userAuthMenuName" label="菜单名" align="center">
      </el-table-column>
      <el-table-column prop="userAuthMenuUrl" label="路径" align="center"></el-table-column>
      <el-table-column  prop="userAuthParentPkocde" label="父级主键" align="center">
      </el-table-column>
      <el-table-column  prop="userAuthParentPkid" label="父级ID" align="center">
      </el-table-column>
      <el-table-column prop="userAuthDisable" label="是否禁用" align="center" :formatter="disableTxt"></el-table-column>
      <el-table-column label="操作" width="270" align="center">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="childMenu(scope.$index, scope.row)">添加子菜单</el-button>
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!--新增-->
  <el-dialog :title="dailogTitleType" :visible.sync="addVisible" width="40%">
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="菜单名">
        <el-input v-model="form.userAuthMenuName"></el-input>
      </el-form-item>
        <el-form-item label="权限路径">
          <el-input v-model="form.userAuthMenuUrl"></el-input>
        </el-form-item>
      <el-form-item label="是否禁用">
        <el-switch v-model="form.userAuthDisable"></el-switch>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
                <el-button @click="addVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleAddMenu()" v-if="!editVisible">确 定</el-button>
                <el-button type="primary" @click="updataMenu()" v-else>确定</el-button>
            </span>
  </el-dialog>
  <!--子菜单-->
  <el-dialog title="新增子菜单" :visible.sync="addChildVisible" width="40%">
    <el-form ref="form" :model="childForm" label-width="100px">
      <el-form-item label="菜单名">
        <el-input v-model="childForm.userAuthMenuName"></el-input>
      </el-form-item>
      <el-form-item label="权限路径">
        <el-input v-model="childForm.userAuthMenuUrl"></el-input>
      </el-form-item>
      <el-form-item label="是否禁用">
        <el-switch v-model="childForm.userAuthDisable"></el-switch>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
                <el-button @click="addChildVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleChildMenu()">确 定</el-button>
            </span>
  </el-dialog>

  <!--删除弹框-->
  <el-dialog title="温馨提示" :visible.sync="delVisible" width="30%" center>
    <div class="del-dialog-cnt center">删除不可恢复，是否确定删除？</div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="delVisible=false">取消</el-button>
      <el-button type="primary" @click="deleteMenu">确定</el-button>
    </span>
  </el-dialog>
</div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'allMenus',
  data () {
    return {
      menuData: [],
      multipleSelection: [],
      addVisible: false,
      delVisible: false,
      editVisible: false,
      addChildVisible: false,
      dailogTitleType: '',
      form: {
        userAuthMenuName: '',
        userAuthDisable: false,
        userAuthMenuUrl: ''
      },
      childForm: {
        userAuthParentPkid: '',
        userAuthParentPkocde: '',
        userAuthMenuName: '',
        userAuthDisable: false,
        userAuthMenuUrl: ''
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
      if (val.userAuthDisable === 0) {
        return '禁用'
      } else if (val.userAuthDisable === 1) {
        return '启用'
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    addMenu () {
      let _this = this
      _this.dailogTitleType = '新增'
      _this.addVisible = true
      _this.editVisible = false
    },
    // 编辑弹窗
    handleEdit (index, row) {
      var _this = this
      _this.idx = index
      const item = _this.menuData[index]
      _this.dailogTitleType = '编辑'
      this.addVisible = true
      _this.editVisible = true
      _this.form = {
        userAuthMenuName: item.userAuthMenuName,
        userAuthDisable: item.userAuthDisable,
        userAuthMenuUrl: item.userAuthMenuUrl
      }
      if (_this.menuData[index].userAuthDisable === 1) {
        _this.form.userAuthDisable = true
      } else {
        _this.form.userAuthDisable = false
      }
    },
    // 添加子菜单弹窗
    childMenu (index, row) {
      var _this = this
      _this.addChildVisible = true
      _this.idx = index
      const item = _this.menuData[index]
      _this.childForm = {
        userAuthParentPkid: item.userAuthPkid,
        userAuthParentPkocde: item.userAuthPkcode
      }
    },
    // 添加子菜单
    handleChildMenu () {
      var _this = this
      var childData = _this.childForm
      axios.post('/api/sysOperate/saveAuth', childData,
        {
          headers: {'Content-Type': 'application/json'}
        }).then((res) => {
        _this.menuData = res.data.data
        _this.$message.success('添加成功')
        _this.addChildVisible = false
        _this.getData()
      }).catch((error) => {
        console.log(error)
      })
    },
    // 获取全部菜单列表
    getData () {
      var _this = this
      axios.defaults.headers.common['token'] = localStorage.getItem('token')
      axios.post('/api/sysOperate/findAllAuthList',
        {headers: {'Content-Type': 'application/json'}})
        .then((res) => {
          if (res.data.success === '200') {
            _this.menuData = res.data.data
          } else {
            _this.$message.error(res.data.message)
          }
        })
    },
    //  添加菜单
    handleAddMenu () {
      var _this = this
      var menuData = _this.form
      _this.editVisible = false
      if (_this.form.userAuthDisable) {
        _this.form.userAuthDisable = '1'
      } else {
        _this.form.userAuthDisable = '0'
      }
      axios.post('/api/sysOperate/saveAuth', menuData,
        {headers: {'Content-Type': 'application/json'}})
        .then((res) => {
          _this.menuData = res.data.data
          _this.addVisible = false
          _this.$message.success('添加成功')
          _this.getData()
        }).catch((error) => {
          console.log(error)
        })
    },
    //  删除菜单
    deleteMenu () {
      var _this = this
      var index = _this.idx
      var pkid = {userAuthPkid: _this.menuData[index].userAuthPkid}
      axios.post('/api/sysOperate/deleteAuthById', pkid,
        {headers: {'Content-Type': 'application/json'}})
        .then((res) => {
          _this.menuData.splice(_this.idx, 1)
          _this.$message.success('删除成功')
          _this.delVisible = false
          _this.getData()
        }).catch((error) => {
          console.log(error)
        })
    },
    handleDelete (index, row) {
      var _this = this
      _this.idx = index
      _this.delVisible = true
    },
    //  编辑
    updataMenu () {
      var _this = this
      var index = _this.idx
      const item = _this.menuData[index]
      if (_this.form.userAuthDisable) {
        _this.form.userAuthDisable = '1'
      } else {
        _this.form.userAuthDisable = '0'
      }
      var menuData = {
        userAuthPkid: item.userAuthPkid,
        userAuthPkcode: item.userAuthPkcode,
        userAuthMenuName: _this.form.userAuthMenuName,
        userAuthMenuUrl: _this.form.userAuthMenuUrl,
        userAuthDisable: _this.form.userAuthDisable
      }
      axios.post('/api/sysOperate/saveAuth', menuData,
        {headers: {'Content-Type': 'application/json'}})
        .then((res) => {
          _this.menuData = res.data.data
          _this.addVisible = false
          _this.$message.success('修改成功')
          _this.getData()
        }).catch((error) => {
          console.log(error)
        })
    }
  }
}
</script>

<style scoped>

</style>
