<template>
    <div>
      <div class="block">
        <el-row>
          <el-button class="addBtn" @click="addModelOpen">添加设备</el-button>
        </el-row>
      </div>
      <div class="container">
        <el-table :data="courseData" border style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="devicePkid" label="pkid" align="center"></el-table-column>
          <el-table-column prop="deviceName" label="名称" align="center"></el-table-column>
          <el-table-column prop="deviceId" label="deviceId" align="center"></el-table-column>
          <el-table-column prop="deviceVersion" label="金额" align="center"></el-table-column>
          <el-table-column prop="deviceType" label="类型" align="center"></el-table-column>
          <el-table-column prop="deviceState" label="状态" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--弹窗-->
      <el-dialog :title="dailogTitleType" :visible.sync="addVisible" width="40%">
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="设备名称">
            <el-input v-model="form.deviceName"></el-input>
          </el-form-item>
          <el-form-item label="门店昵称">
            <el-input v-model="form.deviceId"></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-input v-model="form.deviceType"></el-input>
          </el-form-item>
          <el-form-item label="设备状态">
            <el-input v-model="form.deviceState"></el-input>
          </el-form-item>
          <el-form-item label="经度">
            <el-input v-model="form.deviceEndNumber"></el-input>
          </el-form-item>
          <el-form-item label="纬度">
            <el-input v-model="form.storeLatitude"></el-input>
          </el-form-item>
          <el-form-item v-model="form.storePkid" label="门店id"></el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible=false">取消</el-button>
        <el-button type="primary" @click="editStore()" v-if="editVisible">确定</el-button>
          <el-button type="primary" @click="addStore()" v-else>确定</el-button>
      </span>
      </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'courseList',
  data () {
    return {
      courseData: [],
      addVisible: false,
      editVisible: false,
      dailogTitleType: '',
      idx: -1,
      form: {
        deviceName: '',
        deviceVersion: '',
        deviceType: '',
        deviceTypeName: '',
        deviceState: '',
        deviceId: '',
        deviceEndNumber: ''
      }
    }
  },
  created () {
    this.getData()
  },
  methods: {
    // 新增弹窗
    addModelOpen () {
      let _this = this
      _this.addVisible = true
      _this.dailogTitleType = '新增'
    },
    //  编辑弹窗
    handleEdit (index, row) {
      let _this = this
      _this.addVisible = true
      _this.dailogTitleType = '编辑'
      _this.idx = index
    }
  }
}
</script>

<style scoped>

</style>
