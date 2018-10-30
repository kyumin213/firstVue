<template>
  <div class="table">
    <div class="block">
      <el-row>
        <el-button class="addBtn" @click="addModelOpen()">创建教练</el-button>
      </el-row>
    </div>
    <div class="container">
      <span class="txt">手机号</span>
      <el-input v-model="phone" placeholder="请输入手机号" class="handle-input" style="margin-right: 40px"></el-input>
      <span class="txt">姓名</span>
      <el-input v-model="names" placeholder="请输入姓名" class="handle-input mr10"></el-input>
      <el-button type="primary" icon="search" @click="search">搜索</el-button>
      <el-table :data="coachList" border style="width: 100%"
                @selection-change="handleSelectionChange">
        <!--<el-table-column type="selection" width="55"></el-table-column>-->
        <el-table-column prop="storeCoachPkid" align="center" label="pkid" width="80">
        </el-table-column>
        <el-table-column prop="storeCoachName" align="center" label="姓名">
        </el-table-column>
        <el-table-column prop="storeCoachNikename" align="center" label="昵称"></el-table-column>
        <el-table-column prop="storeCoachSex" align="center" label="性别" :formatter="sexText">
        </el-table-column>
        <el-table-column prop="storeCoachAge" align="center" label="年龄"></el-table-column>
        <el-table-column prop="storeCoachPhone" align="center" label="手机号"></el-table-column>
        <el-table-column prop="storeCoachIdnum" align="center" label="身份证号" ></el-table-column>
        <el-table-column prop="storeCoachGroupCoach" align="center" label="团操" :formatter="coachTxt"></el-table-column>
        <el-table-column prop="storeCoachPrivateCoach" align="center" label="私教" :formatter="privateCoachTxt"></el-table-column>
        <el-table-column prop="storeCoachDisable" align="center" label="是否禁用" :formatter="disableTxt"></el-table-column>
        <el-table-column label="操作" width="250" align="center">
          <template slot-scope="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)" v-if="scope.row.storeCoachDisable===1">编辑
            </el-button>
            <el-button size="small" type="info" @click="disableStoreShow(scope.$index, scope.row)"
                       v-if="scope.row.storeCoachDisable===1">禁用
            </el-button>
            <el-button size="small" type="primary" v-else-if="scope.row.storeCoachDisable===0"
                       @click="disableStoreShow(scope.$index, scope.row)">启用
            </el-button>
            <el-button size="small" type="success" @click="HandlePerfect(scope.$index, scope.row)">完善资料</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination center" v-if="this.total >= this.pages">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"   :page-size="pageSize" layout="prev, pager, next" :total="total">
        </el-pagination>
      </div>
    </div>
    <!--新增-->
    <el-dialog :title="dailogTitleType" :visible.sync="addVisible" width="38%" :close-on-click-modal="false">
      <el-form ref="form" status-icon :model="form" label-width="80px" :rules="rules" class="demo-ruleForm">
        <el-form-item label="手机号" prop="storeCoachPhone">
          <el-input v-model="form.storeCoachPhone"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="storeCoachName">
          <el-input v-model="form.storeCoachName"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="storeCoachNikename">
          <el-input v-model="form.storeCoachNikename"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="form.storeCoachSex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄" prop="storeCoachAge">
          <el-input v-model="form.storeCoachAge"></el-input>
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input v-model="form.storeCoachIdnum"></el-input>
        </el-form-item>
        <el-form-item label="私教">
        <el-radio-group v-model="form.storeCoachPrivateCoach" size="medium">
          <el-radio-button label="1" >是</el-radio-button>
          <el-radio-button label="0">否</el-radio-button>
        </el-radio-group>
      </el-form-item>
        <el-form-item label="团操">
          <el-radio-group v-model="form.storeCoachGroupCoach" size="medium">
            <el-radio-button label="1" >是</el-radio-button>
            <el-radio-button label="0">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible=false">取消</el-button>
        <el-button type="primary" @click="editStore()" v-if="editVisible">确定</el-button>
          <el-button type="primary" @click="addStore('form')" v-else>确定</el-button>
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
    <!--完善资料-->
    <el-dialog title="完善资料" :visible.sync="perfactVisible" width="40%" :close-on-click-modal="false">
      <el-form ref="information" :model="information" label-width="80px">
        <el-form-item label="上传头像">
          <img v-if="information.storeCoachHeadimg" :src="information.storeCoachHeadimg" class="avatar">
          <input class="file" name="file" type="file" accept="image/png,image/gif,image/jpeg,image/jpg" @change="update"/>
        </el-form-item>
        <el-form-item label="上传封面">
          <img v-if="information.storeCoachTopimg" :src="information.storeCoachTopimg" class="topImg">
          <input class="file" name="file" type="file" accept="image/png,image/gif,image/jpeg,image/jpg" @change="topImgUpload"/>
        </el-form-item>
        <el-form-item label="教练简介">
        <el-input type="textarea" v-model="information.profiles"></el-input>
      </el-form-item>
        <el-form-item label="擅长课程">
          <!--<span></span>-->
        </el-form-item>
        <div v-for="(item, index) in goodCourse" :key="item.key">
          <el-form-item label="课程" >
            <!--<el-input type="textarea" v-model="information.goodCourse"></el-input>-->
            <!--<el-col :span="2"> <span>课程</span></el-col>-->
            <el-col :span="2"> <span>{{index+1}}</span></el-col>
            <el-col :span="16"><el-input type="text" v-model="item.goods"></el-input></el-col>
            <el-button type="danger" size="small" style="margin-left: 5px" @click="removeRowGoods(item, index)">删除</el-button>
          </el-form-item>
        </div>
          <el-form-item>
            <el-button type="primary" size="small" @click="addGoods()">新增擅长课程</el-button>
          </el-form-item>
       <el-form-item label="认证证书">
         <!--<span></span>-->
       </el-form-item>
        <div v-for="(item, index) in certificate" :key="item.key" style="margin-left: 0">
          <el-form-item  label="证书" >
            <!--<el-col :span="2"> <span>证书</span></el-col>-->
            <el-col :span="2"> <span>{{index+1}}</span></el-col>
            <el-col :span="16"><el-input type="text" v-model="item.text"></el-input></el-col>
            <el-button type="danger" size="small" style="margin-left: 5px" @click="removeRow(item, index)">删除</el-button>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button type="primary" size="small" @click="add">新增证书</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="perfactVisible=false">取消</el-button>
          <el-button type="primary" @click="addPerfect()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import vali from '../common/validate'
export default {
  name: 'coachList',
  data () {
    return {
      currentPage: 1,
      pageSize: 10,
      total: null,
      pages: null,
      phone: null,
      names: null,
      base: this.GLOBAL.BASE_URL,
      certificate: [
        {text: '', type: 'text'}
      ],
      goodCourse: [
        {goods: '', type: 'text'}
      ],
      fileType: '',
      coachList: [],
      message: '',
      addVisible: false,
      editVisible: false,
      delVisible: false,
      disableVisible: false,
      is_search: false,
      perfactVisible: false,
      dailogTitleType: '',
      tableDataEnd: [],
      filterTableDataEnd: [],
      multipleSelection: [],
      select_word: '',
      del_list: [],
      flag: false,
      form: {
        storeCoachPhone: null,
        storeCoachName: '',
        storeCoachNikename: '',
        storeCoachSex: 1,
        storeCoachAge: null,
        storeCoachIdnum: '',
        storeCoachPrivateCoach: 1,
        storeCoachGroupCoach: 1
      },
      information: {
        storeCoachHeadimg: '',
        storeCoachTopimg: '',
        profiles: ''
        // certificate: [
        //   {
        //     text: '', type: 'text'
        //   }
        // ]
      },
      idx: -1,
      rules: {
        storeCoachName: [
          { required: true, message: '请输入姓名', trigger: 'change' }
        ],
        storeCoachPhone: [
          { required: true, message: '请输入手机号', trigger: 'change' },
          {validator: vali.validatePhone, trigger: 'blur'}
        ],
        storeCoachAge: [
          { required: true, message: '请输入年龄', trigger: 'change' },
          {validator: vali.validateAge, trigger: 'change'}
        ],
        storeCoachNikename: [
          { required: true, message: '请输入昵称', trigger: 'change' },
          {validator: vali.validateNames, trigger: 'change'}
        ]
      }
    }
  },
  created () {
    this.getData()
  },
  computed: {
    // data () {
    //   return this.tableDataEnd.filter((d) => {
    //     let isDel = false
    //     for (let i = 0; i < this.del_list.length; i++) {
    //       if (d.storeCoachName === this.del_list[i].storeCoachName) {
    //         isDel = true
    //         break
    //       }
    //     }
    //     if (!isDel) {
    //       if ((d.storeCoachName.indexOf(this.select_word) > -1 ||
    //         d.storeCoachNikename.indexOf(this.select_word) > -1)
    //       ) {
    //         return d
    //       }
    //     }
    //   })
    // }
  },
  methods: {
    search () {
      let _this = this
      _this.is_search = true
      let storePkid = sessionStorage.getItem('storePkid')
      if (_this.phone === '' || _this.phone === null) {
        _this.phone = null
      }
      if (_this.names === '' || _this.names === null) {
        _this.names = null
      }

      let searchData = {
        phone: _this.phone,
        name: _this.names,
        storePkid: parseInt(storePkid)
      }
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfCoachOperate/findCoachByStorePkid', searchData, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.coachList = res.data.data.data
        } else {
          _this.$message.error('无操作权限')
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    add () {
      this.certificate.push({ text: this.form.length, type: 'text' })
    },
    // 新增一行擅长课程
    addGoods () {
      this.goodCourse.push({ goods: '', type: 'text' })
    },
    // 删除一行
    removeRow (item, index) {
      // this.certificate.splice(index, 1)
      this.index = this.certificate.indexOf(item)
      if (index !== -1) {
        this.certificate.splice(index, 1)
      }
    },
    removeRowGoods (item, index) {
      // this.goodCourse.splice(index, 1)
      this.index = this.goodCourse.indexOf(item)
      if (index !== -1) {
        this.goodCourse.splice(index, 1)
      }
    },
    update (e) {
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
            _this.information.storeCoachHeadimg = res.data.data
          } else {
            _this.$message.error(res.data.message)
          }
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
            _this.information.storeCoachTopimg = res.data.data
          } else {
            _this.$message.error(res.data.message)
          }
        })
    },
    // 私教转文字
    privateCoachTxt (val) {
      if (val.storeCoachPrivateCoach === 1) {
        return '是'
      } else if (val.storeCoachPrivateCoach === 0) {
        return '否'
      }
    },
    // 团操教练转文字
    coachTxt (val) {
      if (val.storeCoachGroupCoach === 1) {
        return '是'
      } else if (val.storeCoachGroupCoach === 0) {
        return '否'
      }
    },
    // 性别转文字
    sexText (val) {
      if (val.storeCoachSex === 1) {
        return '男'
      } else if (val.storeCoachSex === 2) {
        return '女'
      }
    },
    // 禁用转文字
    disableTxt (val) {
      if (val.storeCoachDisable === 0) {
        return '禁用'
      } else if (val.storeCoachDisable === 1) {
        return '启用'
      }
    },
    // 分页导航
    handleCurrentChange (val) {
      let _this = this
      _this.currentPage = val
      let storePkid = sessionStorage.getItem('storePkid')
      let storeDate = {
        pageSize: _this.pageSize,
        pageNum: val,
        storePkid: parseInt(storePkid)
      }
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfCoachOperate/findCoachByStorePkid', storeDate, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.coachList = res.data.data.data
          _this.total = res.data.data.total
          _this.pages = res.data.data.pages
        } else {
          _this.$message.error('无操作权限')
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    handleSizeChange: function (size) {
      this.pageSize = size
      // this.getData()
      this.handleCurrentChange(this.currentPage)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 分页
    // currentChangePage (list) {
    //   let from = (this.currentPage - 1) * this.pageSize
    //   let to = this.currentPage * this.pageSize
    //   this.tableDataEnd = []
    //   for (; from < to; from++) {
    //     if (list[from]) {
    //       this.tableDataEnd.push(list[from])
    //     }
    //   }
    // },
    // 获取门店列表
    getData () {
      let _this = this
      let Pkid = sessionStorage.getItem('storePkid')
      let storePkid = {
        storePkid: parseInt(Pkid)
      }
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfCoachOperate/findCoachByStorePkid', storePkid, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.coachList = res.data.data.data
        } else {
          _this.$message.error('无操作权限')
        }
      }).catch((error) => {
        console.log(error)
      })
    },

    // 禁用弹窗
    disableStoreShow (index, row) {
      let _this = this
      let item = _this.coachList[index]
      let agentDis = item.storeCoachDisable
      let pkid = item.storeCoachPkid
      _this.storeCoachPkid = pkid
      if (agentDis === 1) {
        _this.message = '是否禁用该教练？'
        _this.storeCoachDisable = 0
      } else {
        _this.message = '是否启用该教练？'
        _this.storeCoachDisable = 1
      }
      this.disableVisible = true
    },

    //  创建弹窗
    addModelOpen () {
      let _this = this
      _this.addVisible = true
      _this.dailogTitleType = '新增'
      _this.editVisible = false
    },
    // 完善资料弹窗
    HandlePerfect (index, row) {
      let _this = this
      _this.perfactVisible = true
      _this.idx = index
      const item = _this.coachList[index]
      if (item.storeCoachIntroduce === '' || item.storeCoachIntroduce === 'undefined' || item.storeCoachIntroduce === null) {
        _this.certificate = [{text: '', type: 'text'}]
        _this.goodCourse = [{goods: '', type: 'text'}]
      } else {
        _this.certificate = item.storeCoachIntroduce.certificateList
        _this.goodCourse = item.storeCoachIntroduce.goodCourse
      }
      _this.information = {
        storeCoachHeadimg: item.storeCoachHeadimg,
        storeCoachTopimg: item.storeCoachTopimg,
        profiles: item.storeCoachSynopsis
        // goodCourse: item.storeCoachIntroduce.goodCourse
        // certificate: item.storeCoachIntroduce.certificateList
      }
    },
    // 编辑弹窗
    handleEdit (index, row) {
      let _this = this
      _this.addVisible = true
      _this.dailogTitleType = '编辑'
      _this.editVisible = true
      _this.idx = index
      const item = _this.coachList[index]
      _this.form = {
        // storePkid: item.storePkid,
        // storePkcode: item.storePkcode,
        storeCoachPhone: item.storeCoachPhone,
        storeCoachName: item.storeCoachName,
        storeCoachNikename: item.storeCoachNikename,
        storeCoachSex: item.storeCoachSex,
        storeCoachAge: item.storeCoachAge,
        storeCoachIdnum: item.storeCoachIdnum,
        storeCoachPrivateCoach: item.storeCoachPrivateCoach,
        storeCoachGroupCoach: item.storeCoachGroupCoach
      }
    },
    // 完善资料
    addPerfect () {
      let _this = this
      let index = _this.idx
      let pkid = _this.coachList[index].storeCoachPkid
      // let conText = _this.addCourse.fitnessCourseContext
      let coachLists = {
        goodCourse: _this.goodCourse,
        certificateList: _this.certificate
      }
      let courseData = {
        storeCoachIntroduce: coachLists,
        storeCoachPkid: pkid,
        storeCoachSynopsis: _this.information.profiles,
        storeCoachHeadimg: _this.information.storeCoachHeadimg,
        storeCoachTopimg: _this.information.storeCoachTopimg
      }
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfCoachOperate/confIntroduce', courseData, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.$message.success('操作成功')
          _this.perfactVisible = false
          _this.getData()
          location.reload()
        } else {
          _this.$message.error(res.data.message)
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    //  添加门店
    addStore (formName) {
      let _this = this
      let Pkid = sessionStorage.getItem('storePkid')
      let store = {
        storePkid: parseInt(Pkid),
        storeCoachPhone: _this.form.storeCoachPhone,
        storeCoachName: _this.form.storeCoachName,
        storeCoachNikename: _this.form.storeCoachNikename,
        storeCoachSex: parseInt(_this.form.storeCoachSex),
        storeCoachAge: parseInt(_this.form.storeCoachAge),
        storeCoachIdnum: _this.form.storeCoachIdnum,
        storeCoachGroupCoach: parseInt(_this.form.storeCoachGroupCoach),
        storeCoachPrivateCoach: parseInt(_this.form.storeCoachPrivateCoach)
      }
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfCoachOperate/addCoach', store, {
            headers: {'Content-Type': 'application/json'}
          }).then((res) => {
            if (res.data.success === '200') {
              _this.coachList = res.data.data
              _this.$message.success('添加成功')
              _this.addVisible = false
              // _this.getData()
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
    //  编辑门店
    editStore () {
      let _this = this
      let index = _this.idx
      const item = _this.coachList[index]
      let Pkid = sessionStorage.getItem('storePkid')
      let store = {
        storePkid: parseInt(Pkid),
        storeCoachPkid: item.storeCoachPkid,
        storeCoachPhone: _this.form.storeCoachPhone,
        storeCoachName: _this.form.storeCoachName,
        storeCoachNikename: _this.form.storeCoachNikename,
        storeCoachSex: parseInt(_this.form.storeCoachSex),
        storeCoachAge: parseInt(_this.form.storeCoachAge),
        storeCoachIdnum: _this.form.storeCoachIdnum,
        storeCoachGroupCoach: parseInt(_this.form.storeCoachGroupCoach),
        storeCoachPrivateCoach: parseInt(_this.form.storeCoachPrivateCoach)
      }
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfCoachOperate/updateCoach', store, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.coachList = res.data.data
          _this.$message.success('修改成功')
          _this.addVisible = false
          location.reload()
          // _this.getData()
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
        storeCoachPkid: _this.storeCoachPkid,
        storeCoachDisable: _this.storeCoachDisable
      }
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfCoachOperate/disableCoachById', disableData, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.coachList = res.data.data
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
  .addBtn{
    background-color: #d71718;
    color: #fff;
    margin-bottom: 20px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    /*height: 178px;*/
    display: block;
    background-size: cover;
  }
.topImg{
  width: 300px;
  /*height: 170px;*/
  background-size: cover;
  display: block;
}
  .handle-input {
    width: 150px;
    margin-bottom: 20px;
    display: inline-block;
  }
  .txt{
    font-size: 14px;
  }
</style>
