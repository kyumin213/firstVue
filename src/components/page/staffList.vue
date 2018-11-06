<template>
    <div class="table">
      <div class="block">
        <el-row>
          <el-button class="addBtn" @click="addModelOpen()">创建员工</el-button>
        </el-row>
      </div>
      <div class="container">
        <span class="txt">手机号</span>
        <el-input v-model="phone" placeholder="请输入手机号" class="handle-input" style="margin-right: 40px"></el-input>
        <span class="txt">姓名</span>
        <el-input v-model="names" placeholder="请输入姓名" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="search" @click="search">搜索</el-button>
        <el-table :data="staffList" border style="width: 100%"
                  @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="storeStaffPkid" align="center" label="pkid" width="80">
          </el-table-column>
          <el-table-column prop="storeStaffCtime" align="center" label="创建时间" sortable>
          </el-table-column>
          <el-table-column prop="storeStaffName" align="center" label="姓名">
          </el-table-column>
          <el-table-column prop="storeStaffNikename" align="center" label="昵称"></el-table-column>
          <el-table-column prop="storeStaffSex" align="center" label="性别" :formatter="sexText">
          </el-table-column>
          <el-table-column prop="storeStaffAge" align="center" label="年龄"></el-table-column>
          <el-table-column prop="storeStaffPhone" align="center" label="手机号"></el-table-column>
          <el-table-column prop="storeStaffType" align="center" label="类型" :formatter="memberTypeTxt"></el-table-column>
          <el-table-column prop="storeStaffDisable" align="center" label="是否禁用" :formatter="disableTxt"></el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)" v-if="scope.row.storeStaffDisable===1">编辑
              </el-button>
              <el-button size="small" type="info" @click="disableStoreShow(scope.$index, scope.row)"
                         v-if="scope.row.storeStaffDisable===1">禁用
              </el-button>
              <el-button size="small" type="primary" v-else-if="scope.row.storeStaffDisable===0"
                         @click="disableStoreShow(scope.$index, scope.row)">启用
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination center" v-if="this.total >= this.pages">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"   :page-size="pageSize" layout="prev, pager, next" :total="total">
          </el-pagination>
        </div>
      </div>
      <!--新增-->
      <el-dialog :title="dailogTitleType" :visible.sync="addVisible" width="30%" :close-on-click-modal="false">
        <el-form ref="form" status-icon :model="form" :rules="rules" label-width="80px" class="demo-ruleForm">
          <el-form-item label="创建时间" prop="storeStaffCtime">
            <el-date-picker type="date" placeholder="选择日期" v-model="form.storeStaffCtime" value-format="yyyy-MM-dd"
                            style="width: 100%;" :picker-options="pickerOptions0">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="手机号" prop="storeStaffPhone">
            <!--<el-input v-validate="'required|phone'" :class="{'input': true,'is-danger': errors.has('phone') }" name="phone" type="text" v-model="form.storeStaffPhone"></el-input>-->
            <!--<span v-show="errors.has('phone')"  style="color: #f00">{{ errors.first('phone') }}</span>-->
            <el-input v-model="form.storeStaffPhone" name="phone"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="storeStaffName">
            <el-input v-model="form.storeStaffName" name="name"></el-input>
          </el-form-item>
          <el-form-item label="昵称">
            <el-input v-model="form.storeStaffNikename"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="form.storeStaffSex">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="年龄" prop="storeStaffAge">
            <el-input v-model.number="form.storeStaffAge"  auto-complete="off" type="storeStaffAge"></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="storeStaffType">
            <el-radio-group v-model="form.storeStaffType" size="medium">
              <el-radio-button label="1" >前台</el-radio-button>
              <el-radio-button label="2">会籍</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible=false">取消</el-button>
        <el-button type="primary" @click="editStore()" v-if="editVisible">确定</el-button>
          <el-button type="primary" @click="submitForm('form')" v-else>确定</el-button>
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
import vali from '../common/validate'
export default {
  name: 'staffList',
  data () {
    return {
      pickerOptions0: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      currentPage: 1,
      pageSize: 10,
      total: null,
      pages: null,
      phone: null,
      names: null,
      staffList: [],
      message: '',
      addVisible: false,
      editVisible: false,
      delVisible: false,
      disableVisible: false,
      is_search: false,
      dailogTitleType: '',
      tableDataEnd: [],
      filterTableDataEnd: [],
      multipleSelection: [],
      select_word: '',
      del_list: [],
      flag: false,
      form: {
        storeStaffPhone: null,
        storeStaffCtime: '',
        storeStaffName: '',
        storeStaffNikename: '',
        storeStaffSex: 1,
        storeStaffAge: null,
        storeStaffType: 1,
        storeMemberIdnum: ''
      },
      idx: -1,
      rules: {
        storeStaffName: [
          { required: true, message: '请输入姓名', trigger: 'change' }
        ],
        storeStaffPhone: [
          {required: true, message: '请输入手机号', trigger: 'change'},
          {validator: vali.validatePhone, trigger: 'blur'}
        ],
        storeStaffAge: [
          {required: true, message: '请输入年龄', trigger: 'change'},
          {type: 'number', message: '年龄必须为数字值'},
          {validator: vali.validateAge, trigger: 'blur'}
        ],
        storeStaffCtime: [
          {required: true, message: '请选择创建时间', trigger: 'change'}
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
    //       if (d.storeStaffName === this.del_list[i].storeStaffName) {
    //         isDel = true
    //         break
    //       }
    //     }
    //     if (!isDel) {
    //       if ((d.storeStaffName.indexOf(this.select_word) > -1 ||
    //         d.storeStaffNikename.indexOf(this.select_word) > -1)
    //       ) {
    //         return d
    //       }
    //     }
    //   })
    // }
  },
  methods: {
    // pickerOptions0: {
    //   disabledDate (time) {
    //     return time.getTime() < Date.now() - 8.64e7
    //   }
    // },
    // disabledDate: (time) => {
    //   let beginDateVal = this.addJobForm.beginDate
    //   if (beginDateVal) {
    //     return time.getTime() < beginDateVal
    //   }
    // },
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
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfStaffOperate/findStaffByStorePkid', searchData, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.staffList = res.data.data.data
          // _this.total = res.data.data.total
          // _this.pages = res.data.data.pages
          // _this.getData()
        } else {
          _this.$message.error('无操作权限')
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    //  会员类型转文字
    memberTypeTxt (val) {
      if (val.storeStaffType === 1) {
        return '前台'
      } else if (val.storeStaffType === 2) {
        return '会籍'
      }
    },
    // 性别转文字
    sexText (val) {
      if (val.storeStaffSex === 1) {
        return '男'
      } else if (val.storeStaffSex === 2) {
        return '女'
      }
    },
    // 禁用转文字
    disableTxt (val) {
      if (val.storeStaffDisable === 0) {
        return '禁用'
      } else if (val.storeStaffDisable === 1) {
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
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfStaffOperate/findStaffByStorePkid', storeDate, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.staffList = res.data.data.data
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
    currentChangePage (list) {
      let from = (this.currentPage - 1) * this.pageSize
      let to = this.currentPage * this.pageSize
      this.tableDataEnd = []
      for (; from < to; from++) {
        if (list[from]) {
          this.tableDataEnd.push(list[from])
        }
      }
    },
    // 获取门店列表
    getData () {
      let _this = this
      let pkId = sessionStorage.getItem('storePkid')
      let storePkid = {
        pageSize: _this.pageSize,
        pageNum: 1,
        storePkid: parseInt(pkId)
      }
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfStaffOperate/findStaffByStorePkid', storePkid, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        let mes = res.data.message
        if (res.data.success === '200') {
          _this.staffList = res.data.data.data
          _this.total = _this.data.data.total
          _this.pages = _this.data.data.pages
        } else if (mes === '无操作权限') {
          this.$router.push('/login')
          sessionStorage.clear()
          // _this.$message.error('无操作权限')
        }
      }).catch((error) => {
        console.log(error)
      })
    },

    // 禁用弹窗
    disableStoreShow (index, row) {
      let _this = this
      let item = _this.staffList[index]
      let agentDis = item.storeStaffDisable
      let pkid = item.storeStaffPkid
      _this.storeStaffPkid = pkid
      if (agentDis === 1) {
        _this.message = '是否禁用该员工？'
        _this.storeStaffDisable = 0
      } else {
        _this.message = '是否启用该员工？'
        _this.storeStaffDisable = 1
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
    // 编辑弹窗
    handleEdit (index, row) {
      let _this = this
      _this.addVisible = true
      _this.dailogTitleType = '编辑'
      _this.editVisible = true
      _this.idx = index
      const item = _this.staffList[index]
      _this.form = {
        storeStaffPhone: item.storeStaffPhone,
        storeStaffName: item.storeStaffName,
        storeStaffNikename: item.storeStaffNikename,
        storeStaffSex: item.storeStaffSex,
        storeStaffAge: item.storeStaffAge,
        storeStaffType: item.storeStaffType,
        storeStaffCtime: item.storeStaffCtime
      }
    },
    //  添加门店
    submitForm (formName) {
      let _this = this
      let storePkid = sessionStorage.getItem('storePkid')
      let storePkcode = sessionStorage.getItem('storePkcode')
      let store = {
        storePkid: parseInt(storePkid),
        storePkcode: storePkcode,
        storeStaffPhone: _this.form.storeStaffPhone,
        storeStaffName: _this.form.storeStaffName,
        storeStaffNikename: _this.form.storeStaffNikename,
        storeStaffSex: parseInt(_this.form.storeStaffSex),
        storeStaffAge: parseInt(_this.form.storeStaffAge),
        storeStaffType: parseInt(_this.form.storeStaffType),
        storeStaffCtime: _this.form.storeStaffCtime
      }
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfStaffOperate/addStaff', store, {
            headers: {'Content-Type': 'application/json'}
          }).then((res) => {
            if (res.data.success === '200') {
              _this.staffList = res.data.data
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
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    //  编辑门店
    editStore () {
      let _this = this
      let index = _this.idx
      const item = _this.staffList[index]
      let store = {
        storeStaffPkid: item.storeStaffPkid,
        storeStaffPhone: _this.form.storeStaffPhone,
        storeStaffName: _this.form.storeStaffName,
        storeStaffNikename: _this.form.storeStaffNikename,
        storeStaffSex: parseInt(_this.form.storeStaffSex),
        storeStaffAge: parseInt(_this.form.storeStaffAge),
        storeStaffType: parseInt(_this.form.storeStaffType),
        storeStaffCtime: _this.form.storeStaffCtime
      }
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfStaffOperate/updateStaff', store, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.staffList = res.data.data
          _this.$message.success('修改成功')
          // _this.getData()
          location.reload()
          _this.addVisible = false
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
        storeStaffPkid: _this.storeStaffPkid,
        storeStaffDisable: _this.storeStaffDisable
      }
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfStaffOperate/disableStaffById', disableData, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.staffList = res.data.data
          _this.$message.success('操作成功')
          _this.getData()
          _this.disableVisible = false
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
  .handle-input {
    width: 150px;
    margin-bottom: 20px;
    display: inline-block;
  }
  .txt{
    font-size: 14px;
  }
</style>
