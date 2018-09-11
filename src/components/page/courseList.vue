<template>
    <div>
      <div class="block">
        <el-row>
          <el-button class="addBtn" @click="addModelOpen()">创建课程</el-button>
        </el-row>
      </div>
      <div class="container">
        <el-table :data="courseData" border style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="fitnessCoursePkid" label="pkid" align="center"></el-table-column>
          <el-table-column prop="fitnessCourseName" label="课程名称" align="center"></el-table-column>
          <el-table-column prop="fitnessCourseDisable" label="禁用" align="center" :formatter="disableTxt"></el-table-column>
          <el-table-column prop="fitnessCourseType" label="课程类型" align="center" :formatter="ifendcase"></el-table-column>
          <el-table-column label="操作" align="center" width="250">
            <template slot-scope="scope">
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDel(scope.$index, scope.row)">删除</el-button>
              <el-button size="small" type="info" @click="disableStoreShow(scope.$index, scope.row)"
                         v-if="scope.row.fitnessCourseDisable===1">禁用
              </el-button>
              <el-button size="small" type="primary" v-else-if="scope.row.fitnessCourseDisable===0"
                         @click="disableStoreShow(scope.$index, scope.row)">启用
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--新增-->
      <el-dialog :title="dailogTitleType" :visible.sync="addVisible" width="30%">
        <el-form :model="form" label-width="80px">
          <el-form-item label="课程名称">
            <el-input v-model="form.fitnessCourseName"></el-input>
          </el-form-item>
          <el-form-item label="课程类型">
            <el-select v-model="form.fitnessCourseType" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否禁用">
            <el-select v-model="form.fitnessCourseDisable" placeholder="请选择">
              <el-option v-for="item in disStatus" :key="item.value" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addVisible=false">取消</el-button>
          <el-button type="primary" @click="addCard" v-if="!editVisible">确定</el-button>
          <el-button type="primary" @click="editCard" v-else>确定</el-button>
        </span>
      </el-dialog>
      <!--删除-->
      <el-dialog title="温馨提示" :visible.sync="delVisible" width="300px" center>
        <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
        <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
      </el-dialog>
      <!--禁用提示框-->
      <el-dialog title="温馨提示" :visible.sync="disableVisible" width="300px" center>
        <div class="del-dialog-cnt">{{message}}</div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="disableVisible=false">取消</el-button>
        <el-button type="primary" @click="disableStore">确定</el-button>
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
      multipleSelection: [],
      idx: -1,
      addVisible: false,
      editVisible: false,
      delVisible: false,
      disableVisible: false,
      dailogTitleType: '',
      message: '',
      form: {
        fitnessCourseName: '',
        fitnessCourseType: '',
        fitnessCourseDisable: ''
      },
      options: [
        {
          value: 1,
          label: '团操'
        },
        {
          value: 2,
          label: '私教'
        }
      ],
      disStatus: [
        {
          value: 0,
          label: '禁用'
        },
        {
          value: 1,
          label: '正常'
        }
      ]
    }
  },
  created () {
    this.getData()
  },
  methods: {
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    //  禁用转文字
    disableTxt (val) {
      if (val.fitnessCourseDisable === 0) {
        return '禁用'
      } else if (val.fitnessCourseDisable === 1) {
        return '正常'
      }
    },
    // 课程类型转文字
    ifendcase (val) {
      if (val.fitnessCourseType === 1) { return '团操' } else if (val.fitnessCourseType === 2) { return '私教' }
    },
    // 列表数据
    getData () {
      let _this = this
      let agentPkid = sessionStorage.getItem('agentPkid')
      let pkid = {agentPkid: agentPkid}
      _this.axios.post('/api/agentOfFitnessCourseOperate/findFitnessCourseByAgentPkid', pkid, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.courseData = res.data.data
        } else {
          _this.$message.error('没有操作权限')
        }
      }).catch((error) => {
        console.log(error)
        _this.$message.error('系统故障')
      })
    },
    // 添加弹窗
    addModelOpen () {
      let _this = this
      _this.addVisible = true
      _this.editVisible = false
      _this.dailogTitleType = '添加'
    },
    // 编辑弹窗
    handleEdit (index, row) {
      let _this = this
      _this.idx = index
      _this.addVisible = true
      _this.editVisible = true
      _this.dailogTitleType = '编辑'
      const item = _this.courseData[index]
      _this.form = {
        fitnessCourseName: item.fitnessCourseName,
        fitnessCourseType: item.fitnessCourseType,
        fitnessCourseDisable: item.fitnessCourseDisable
      }
    },
    // 删除弹窗
    handleDel (index, row) {
      let _this = this
      _this.idx = index
      _this.delVisible = true
    },
    disableStoreShow (index, row) {
      let _this = this
      let item = _this.courseData[index]
      let agentDis = item.fitnessCourseDisable
      let pkid = item.fitnessCoursePkid
      _this.fitnessCoursePkid = pkid
      if (agentDis === 1) {
        _this.message = '是否禁用该商户？'
        _this.fitnessCourseDisable = 0
      } else {
        _this.message = '是否启用该商户？'
        _this.fitnessCourseDisable = 1
      }
      this.disableVisible = true
    },
    //  添加
    addCard () {
      let agentPkid = sessionStorage.getItem('agentPkid')
      let agentPkCode = sessionStorage.getItem('agentPkcode')
      let _this = this
      let formData = {
        fitnessCourseName: _this.form.fitnessCourseName,
        fitnessCourseType: _this.form.fitnessCourseType,
        fitnessCourseDisable: _this.form.fitnessCourseDisable,
        agentPkid: agentPkid,
        agentPkcode: agentPkCode
      }
      _this.axios.post('/api/agentOfFitnessCourseOperate/addFitnessCourse', formData, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.courseData = res.data.data
          _this.$message.success('添加成功')
          _this.getData()
          _this.addVisible = false
        } else {
          _this.$message.error(res.data.message)
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    //  编辑
    editCard () {
      let _this = this
      let index = _this.idx
      const item = _this.courseData[index]
      let editData = {
        fitnessCoursePkid: item.fitnessCoursePkid,
        fitnessCourseName: _this.form.fitnessCourseName,
        fitnessCourseType: _this.form.fitnessCourseType,
        fitnessCourseDisable: _this.form.fitnessCourseDisable
      }
      _this.axios.post('/api/agentOfFitnessCourseOperate/updateFitnessCourse', editData, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.courseData = res.data.data
          _this.$message.success('修改成功')
          _this.addVisible = false
          _this.getData()
        } else {
          _this.$message.error(res.data.message)
        }
      }).catch((error) => {
        _this.$message.error(error)
      })
    },
    //  删除
    deleteRow () {
      let _this = this
      let index = _this.idx
      var pkid = {fitnessCoursePkid: _this.courseData[index].fitnessCoursePkid}
      _this.axios.post('/api/agentOfFitnessCourseOperate/deleteFitnessCourseById', pkid, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.courseData.splice(index, 1)
          _this.$message.success('删除成功')
          _this.delVisible = false
          _this.getData()
        } else {
          _this.$message.error(res.data.message)
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    //  是否禁用
    disableStore () {
      let _this = this
      let disableData = {
        fitnessCoursePkid: _this.fitnessCoursePkid,
        fitnessCourseDisable: _this.fitnessCourseDisable
      }
      _this.axios.post('/api/agentOfFitnessCourseOperate/disableFitnessCourseById', disableData, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.courseData = res.data.data
          _this.disableVisible = false
          _this.$message.success('操作成功')
          _this.getData()
        } else {
          _this.$message.error(res.data.message)
        }
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}
</script>

<style scoped>

</style>
