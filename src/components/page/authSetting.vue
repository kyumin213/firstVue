<template>
  <div>
    <div class="block">
      <el-row>
        <el-button class="addBtn" @click="saveAdd()">创建权限</el-button>
      </el-row>
    </div>
    <div>
      <el-table :data="authData" border style="width: 100%;">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="id" align="center"></el-table-column>
        <el-table-column label="名称" prop="name" align="center"></el-table-column>
        <el-table-column label="路径" prop="userAuthMenuUrl" align="center"></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="small" @click="editVisible=true">编辑</el-button>
            <el-button size="small" type="danger" @click="delVisible=true">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--新增弹窗-->
    <el-dialog title="新增" :visible.sync="addVisible" width="40%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="权限路径">
          <el-input v-model="form.userAuthMenuUrl"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible=false">取消</el-button>
        <el-button type="primary" @click="handlAdd">确定</el-button>
      </span>
    </el-dialog>
    <!--编辑-->
    <el-dialog title="编辑" :visible.sync="editVisible" width="40%">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="权限路径">
          <el-input v-model="form.userAuthMenuUrl"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible=false">取消</el-button>
        <el-button type="prumary" @click="editAuths">确定</el-button>
      </span>
    </el-dialog>
    <!--删除-->
    <el-dialog
      title="提示"
      :visible.sync="delVisible"
      width="30%"
      >
      <span>确定删除该条数据？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="delVisible = false">取 消</el-button>
    <el-button type="primary" @click="deleteAuth">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'authSetting',
  data () {
    return {
      authData: [
        {
          name: '一级'
        },
        {
          name: '二级'
        }
      ],
      addVisible: false,
      editVisible: false,
      delVisible: false,
      form: {
        name: '',
        userAuthMenuUrl: ''
      },
      idx: -1
    }
  },
  methods: {
    // 添加弹窗
    saveAdd () {
      this.addVisible = true
      this.form.name = ''
    },
    //  添加确定
    handlAdd () {
      this.authData.push(this.form)
      this.addVisible = false
      this.$message.success('添加成功')
      console.info(this.form)
    },
    //  编辑
    editAuths () {
      this.$set(this.form)
      this.editVisible = false
      this.$message.success(`修改 ${this.idx + 1} 成功`)
    },
    //  删除
    deleteAuth () {
      var _this = this
      var index = _this.idx
      this.authData.splice(index, 1)
      this.delVisible = false
      this.$message.success('删除成功')
    }
  }
}
</script>

<style scoped>
  .el-table .success-row {
    background: #f0f9eb;
  }
  .addBtn{
    background-color: #d71718;
    color: #fff;
    margin-bottom: 20px;
  }
</style>
