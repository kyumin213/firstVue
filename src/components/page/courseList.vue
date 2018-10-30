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
          <el-table-column prop="fitnessCourseType" label="课程类型" align="center" :formatter="ifendcase"></el-table-column>
          <el-table-column prop="fitnessCourseDisable" label="是否禁用" align="center" :formatter="disableTxt"></el-table-column>
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
              <el-button size="small" style="margin-top: 10px" type="primary" v-if="scope.row.fitnessCourseDisable===1"
                         @click="addCourseShow(scope.$index, scope.row)">新增课程内容</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--新增-->
      <el-dialog :title="dailogTitleType" :visible.sync="addVisible" width="30%" :close-on-click-modal="false">
        <el-form :model="form" label-width="80px" :rules="rules" class="demo-ruleForm" status-icon>
          <el-form-item label="课程名称" prop="fitnessCourseName">
            <el-input v-model="form.fitnessCourseName" style="width: 75%"></el-input>
          </el-form-item>
          <el-form-item label="课程类型" prop="fitnessCourseType">
            <el-radio-group v-model="form.fitnessCourseType" size="medium">
              <el-radio-button label="1">团操</el-radio-button>
              <el-radio-button label="2">私教</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <!--<el-form-item label="是否禁用" v-if="!editVisible">-->
            <!--<el-radio-group v-model="form.fitnessCourseDisable" size="medium">-->
              <!--<el-radio-button label="1">正常</el-radio-button>-->
              <!--<el-radio-button label="0">禁用</el-radio-button>-->
            <!--</el-radio-group>-->
          <!--</el-form-item>-->
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addVisible=false">取消</el-button>
          <el-button type="primary" @click="addCard(form)" v-if="!editVisible">确定</el-button>
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
      <!--课程内容-->
      <el-dialog title="新增课程内容" :visible.sync="addCourseModel" width="30%" :close-on-click-modal="false">
        <el-form :model="addCourse" ref="addCourse" label-width="80px" :rules="conRules" class="demo-ruleForm" status-icon>
          <el-form-item label="上传封面" prop="TopimgUrl">
            <img v-if="addCourse.TopimgUrl" :src="addCourse.TopimgUrl" class="topImg">
            <input class="file" name="file" type="file" accept="image/png,image/gif,image/jpeg,image/jpg" @change="topImgUpload"/>
          </el-form-item>
          <el-form-item label="课程介绍" prop="fitnessCourseintroduce">
            <el-input type="textarea" v-model="addCourse.fitnessCourseintroduce"></el-input>
          </el-form-item>
          <el-form-item label="训练效果" prop="trainingEffect">
            <el-input type="textarea" v-model="addCourse.trainingEffect"></el-input>
          </el-form-item>
          <el-form-item label="适宜人群" prop="SuitablePopulation">
            <el-input type="textarea" v-model="addCourse.SuitablePopulation"></el-input>
          </el-form-item>
          <el-form-item label="温馨提示">
            <!--<el-input type="textarea" v-model="addCourse.Reminder"></el-input>-->
          </el-form-item>
          <div v-for="(item, index) in ReminderList" :key="item.key">
            <el-form-item label="提示" >
              <!--<el-input type="textarea" v-model="information.goodCourse"></el-input>-->
              <!--<el-col :span="2"> <span>课程</span></el-col>-->
              <el-col :span="2"> <span>{{index+1}}</span></el-col>
              <el-col :span="16"><el-input type="text" v-model="item.text"></el-input></el-col>
              <el-button type="danger" size="small" style="margin-left: 5px" @click="removeRowGoods(item, index)">删除</el-button>
            </el-form-item>
          </div>
          <el-form-item>
            <el-button type="primary" size="small" @click="addGoods()">新增提示</el-button>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCourse=false">取消</el-button>
          <el-button type="primary" @click="addCourseCon('addCourse')">确定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
import vali from '../common/validate'
export default {
  name: 'courseList',
  data () {
    return {
      ReminderList: [
        {text: '', type: 'text'}
      ],
      courseData: [],
      multipleSelection: [],
      courseConData: [],
      conTxt: {},
      idx: -1,
      addVisible: false,
      editVisible: false,
      delVisible: false,
      disableVisible: false,
      addCourseModel: false,
      dailogTitleType: '',
      message: '',
      form: {
        fitnessCourseName: '',
        fitnessCourseType: '1',
        fitnessCourseDisable: '1'
      },
      addCourse: {
        fitnessCourseintroduce: '',
        trainingEffect: '',
        SuitablePopulation: '',
        // Reminder: '',
        TopimgUrl: ''
      },
      rules: {
        fitnessCourseName: [
          {required: true, message: '请输入课程名称', trigger: 'change'},
          {validator: vali.courseNameNum, trigger: 'change'}
        ]
      },
      conRules: {
        fitnessCourseintroduce: [
          {required: true, message: '请输入课程介绍', trigger: 'change'}
        ],
        trainingEffect: [
          {required: true, message: '请输入训练效果', trigger: 'change'}
        ],
        SuitablePopulation: [
          {required: true, message: '请输入适宜人群', trigger: 'change'}
        ],
        Reminder: [
          {required: true, message: '请输入温馨提示', trigger: 'change'}
        ],
        TopimgUrl: [
          {required: true, message: '请上传课程封面', trigger: 'change'}
        ]
      }
    }
  },
  created () {
    this.getData()
  },
  methods: {
    filterTag (value, row) {
      return row.fitnessCourseType === value
    },
    addGoods () {
      this.ReminderList.push({ text: this.form.length, type: 'text' })
    },
    removeRowGoods (item, index) {
      // this.goodCourse.splice(index, 1)
      this.index = this.ReminderList.indexOf(item)
      if (index !== -1) {
        this.ReminderList.splice(index, 1)
      }
    },
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
      let pkid = {agentPkid: parseInt(agentPkid)}
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfFitnessCourseOperate/findFitnessCourseByAgentPkid', pkid, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.courseData = res.data.data
        } else {
          _this.$message.error('无操作权限')
        }
      }).catch((error) => {
        console.log(error)
        _this.$message.error('系统故障')
      })
    },
    // 上传封面
    topImgUpload (e) {
      let _this = this
      let file = e.target.files[0]
      let names = file.name
      var ext = names.lastIndexOf('.')
      let fileTpyes = names.substring(ext + 1)
      let param = new FormData() // 创建form对象
      param.append('file', file)// 通过append向form对象添加数据
      param.append('fileType', fileTpyes)// 添加form表单中其他数据
      let config = {
        headers: {'Content-Type': 'multipart/form-data'}
      } // 添加请求头
      this.axios.post(this.GLOBAL.BASE_URL + '/uploadFile/uploadimg', param, config)
        .then(res => {
          if (res.data.success === '200') {
            _this.addCourse.TopimgUrl = res.data.data
            // console.log(res)
          } else {
            _this.$message.error(res.data.message)
          }
        })
    },
    // 添加弹窗
    addModelOpen () {
      let _this = this
      _this.addVisible = true
      _this.editVisible = false
      _this.dailogTitleType = '添加'
    },
    // 新增课程内容弹窗
    addCourseShow (index, row) {
      let _this = this
      _this.idx = index
      _this.addCourseModel = true
      const item = _this.courseData[index]
      // let courseTxt = item.fitnessCourseContext
      // if (courseTxt !== null || courseTxt !== '' || courseTxt !== undefined) {
      //   let dataType = item.fitnessCourseContext
      //   var con = null
      //   if (typeof (dataType) === 'object') {
      //     con = dataType
      //   } else {
      //     con = JSON.parse(dataType.replace(/\n/g, '').replace(/\r/g, ''))
      //   }
      //   _this.conTxt = con
      //   _this.ReminderList = _this.conTxt.Reminder
      // }
      if (item.fitnessCourseContext === '' || item.fitnessCourseContext === 'undefined' || item.fitnessCourseContext === null) {
        _this.ReminderList = [{text: '', type: 'text'}]
      } else {
        let dataType = item.fitnessCourseContext
        let con = null
        if (typeof (dataType) === 'object') {
          con = dataType
        } else {
          con = JSON.parse(dataType.replace(/\n/g, '').replace(/\r/g, ''))
        }
        _this.conTxt = con
        _this.ReminderList = _this.conTxt.Reminder
      }
      _this.addCourse = {
        fitnessCourseintroduce: _this.conTxt.fitnessCourseintroduce,
        trainingEffect: _this.conTxt.trainingEffect,
        SuitablePopulation: _this.conTxt.SuitablePopulation,
        // Reminder: '',
        TopimgUrl: item.fitnessCourseCoverimg
      }
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
        _this.message = '是否禁用该课程？'
        _this.fitnessCourseDisable = 0
      } else {
        _this.message = '是否启用该课程？'
        _this.fitnessCourseDisable = 1
      }
      this.disableVisible = true
    },
    //  添加
    addCard (formName) {
      let agentPkid = sessionStorage.getItem('agentPkid')
      let agentPkCode = sessionStorage.getItem('agentPkcode')
      let _this = this
      let formData = {
        fitnessCourseName: _this.form.fitnessCourseName,
        fitnessCourseType: parseInt(_this.form.fitnessCourseType),
        // fitnessCourseDisable: parseInt(_this.form.fitnessCourseDisable),
        agentPkid: parseInt(agentPkid),
        agentPkcode: agentPkCode
      }
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfFitnessCourseOperate/addFitnessCourse', formData, {
            headers: {'Content-Type': 'application/json'}
          }).then((res) => {
            if (res.data.success === '200') {
              _this.courseData = res.data.data
              _this.$message.success('添加成功')
              // _this.getData()
              _this.addVisible = false
              location.reload()
            } else {
              _this.$message.error(res.data.message)
            }
          }).catch((error) => {
            console.log(error)
          })
        }
      })
    },
    //  编辑
    editCard () {
      let _this = this
      let index = _this.idx
      const item = _this.courseData[index]
      let editData = {
        fitnessCoursePkid: parseInt(item.fitnessCoursePkid),
        fitnessCourseName: _this.form.fitnessCourseName,
        fitnessCourseType: parseInt(_this.form.fitnessCourseType)
      }
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfFitnessCourseOperate/updateFitnessCourse', editData, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.courseData = res.data.data
          _this.$message.success('修改成功')
          _this.addVisible = false
          // _this.getData()
          location.reload()
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
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfFitnessCourseOperate/deleteFitnessCourseById', pkid, {
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
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfFitnessCourseOperate/disableFitnessCourseById', disableData, {
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
    },
    //  保存课程内容
    addCourseCon (formName) {
      let _this = this
      let index = _this.idx
      let pkid = _this.courseData[index].fitnessCoursePkid
      // let conText = _this.addCourse.fitnessCourseContext
      // let introduce = _this.addCourse.fitnessCourseintroduce
      // let duce = introduce.replace(/<\/?.+?>/g,"")
      // let duce = introduce.replace(/[\r\n]/g, "")
      let courseLists = {
        fitnessCourseintroduce: _this.addCourse.fitnessCourseintroduce,
        trainingEffect: _this.addCourse.trainingEffect,
        SuitablePopulation: _this.addCourse.SuitablePopulation,
        Reminder: _this.ReminderList
      }
      let courseData = {
        fitnessCourseContext: courseLists,
        fitnessCoursePkid: pkid,
        fitnessCourseCoverimg: _this.addCourse.TopimgUrl
      }
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfFitnessCourseOperate/saveFitnessCourseContext', courseData, {
            headers: {'Content-Type': 'application/json'}
          }).then((res) => {
            if (res.data.success === '200') {
              _this.courseConData = res.data.data
              _this.$message.success('操作成功')
              _this.addCourseModel = false
              _this.getData()
              location.reload()
            } else {
              _this.$message.error(res.data.message)
            }
          }).catch((error) => {
            console.log(error)
          })
        }
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
  .topImg{
    width: 300px;
    height: 170px;
    display: block;
  }
</style>
