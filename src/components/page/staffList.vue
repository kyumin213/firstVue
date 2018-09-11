<template>
    <div class="table">
      <div class="block">
        <el-row>
          <el-button class="addBtn" @click="addModelOpen()">创建员工</el-button>
        </el-row>
      </div>
      <div class="container">
        <!--<div class="handle-box">-->
        <!--<el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>-->
        <!--<el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>-->
        <!--<el-button type="primary" icon="search" @click="search">搜索</el-button>-->
        <!--</div>-->
        <el-table :data="tableDataEnd" border style="width: 100%"
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
        <div class="pagination center" v-if="this.totalPage>=this.pageSize">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="pageSize" :current-page="currentPage"
                         layout="prev, pager, next" :total="totalPage">
          </el-pagination>
        </div>
      </div>
      <!--新增-->
      <el-dialog :title="dailogTitleType" :visible.sync="addVisible" width="38%">
        <el-form ref="form" status-icon :model="form" :rules="rules" label-width="80px" class="demo-ruleForm">
          <el-form-item label="创建时间">
            <el-date-picker type="date" placeholder="选择日期" v-model="form.storeStaffCtime" value-format="yyyy-MM-dd"
                            style="width: 100%;"></el-date-picker>
          </el-form-item>
          <el-form-item label="手机号" prop="storeStaffPhone">
            <!--<el-input v-validate="'required|phone'" :class="{'input': true,'is-danger': errors.has('phone') }" name="phone" type="text" v-model="form.storeStaffPhone"></el-input>-->
            <!--<span v-show="errors.has('phone')"  style="color: #f00">{{ errors.first('phone') }}</span>-->
            <el-input v-model="form.storeStaffPhone"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="storeStaffName">
            <el-input v-model="form.storeStaffName" name="name"></el-input>
          </el-form-item>
          <el-form-item label="昵称">
            <el-input v-model="form.storeStaffNikename" @keyup.enter.native="submitForm('form')" placeholder="storeStaffNikename"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="form.storeStaffSex">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="年龄" prop="storeStaffAge" :rules="[
      { required: true, message: '年龄不能为空'},
      { type: 'number', message: '年龄必须为数字值'}
    ]">
            <el-input v-model.number="form.storeStaffAge" auto-complete="off" type="storeStaffAge"></el-input>
          </el-form-item>
          <el-form-item label="类型">
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
export default {
  name: 'staffList',
  data () {
    var validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else {
        const reg = /~((13|14|15|17|18)[0-9]{1}\d{8})$/.test(value)
        if (reg) {
          callback()
        } else {
          return callback(new Error('请输入正确的手机号'))
        }
      }
    }
    return {
      staffList: [],
      message: '',
      addVisible: false,
      editVisible: false,
      delVisible: false,
      disableVisible: false,
      is_search: false,
      dailogTitleType: '',
      currentPage: 1,
      pageSize: 7,
      totalPage: 0,
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
        storeStaffSex: null,
        storeStaffAge: null,
        storeStaffType: null,
        storeMemberIdnum: ''
      },
      idx: -1,
      rules: {
        storeStaffName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        storeStaffPhone: [
          {validator: validatePhone, trigger: 'blur'}
        ]
      }
    }
  },
  created () {
    this.getData()
  },
  computed: {
    data () {
      return this.tableDataEnd.filter((d) => {
        let isDel = false
        for (let i = 0; i < this.del_list.length; i++) {
          if (d.storeStaffName === this.del_list[i].storeStaffName) {
            isDel = true
            break
          }
        }
        if (!isDel) {
          if ((d.storeStaffName.indexOf(this.select_word) > -1 ||
            d.storeStaffNikename.indexOf(this.select_word) > -1)
          ) {
            return d
          }
        }
      })
    }
  },
  methods: {
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
      this.currentPage = val
      if (!this.flag) {
        this.currentChangePage(this.staffList)
      } else {
        this.currentChangePage(this.filterTableDataEnd)
      }
      // this.getData()
      //   .slice((currentPage-1)*pageSize,currentPage*pageSize)
      // this.currentChangePage(this.storeList, val)
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
        storePkid: parseInt(pkId)
      }
      _this.axios.post('/api/agentOfStaffOperate/findStaffByStorePkid', storePkid, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.staffList = res.data.data
          _this.totalPage = _this.staffList.length
          if (_this.totalPage > _this.pageSize) {
            for (let index = 0; index < _this.pageSize; index++) {
              _this.tableDataEnd.push(_this.staffList[index])
            }
          } else {
            _this.tableDataEnd = _this.staffList
          }
        } else {
          _this.$message.error(res.data.message)
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
        _this.message = '是否禁用该商户？'
        _this.storeStaffDisable = 0
      } else {
        _this.message = '是否启用该商户？'
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
          _this.axios.post('/api/agentOfStaffOperate/addStaff', store, {
            headers: {'Content-Type': 'application/json'}
          }).then((res) => {
            if (res.data.success === '200') {
              _this.staffList = res.data.data
              _this.$message.success('添加成功')
              _this.getData()
              _this.addVisible = false
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
      _this.axios.post('/api/agentOfStaffOperate/updateStaff', store, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.staffList = res.data.data
          _this.$message.success('修改成功')
          _this.getData()
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
      _this.axios.post('/api/agentOfStaffOperate/disableStaffById', disableData, {
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
</style>
