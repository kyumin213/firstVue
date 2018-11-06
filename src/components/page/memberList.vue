<!--suppress ALL -->
<template>
    <div class="table">
      <div class="block">
        <el-row>
          <el-button class="addBtn" @click="addModelOpen()">创建会员</el-button>
        </el-row>
      </div>
      <div class="container">
        <span class="txt">手机号</span>
        <el-input v-model="phone" placeholder="请输入手机号" class="handle-input" style="margin-right: 40px"></el-input>
        <span class="txt">姓名</span>
        <el-input v-model="names" placeholder="请输入姓名" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="search" @click="search">搜索</el-button>
        <el-table :data="memberList" border style="width: 100%"
                  @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="storeMemberPkid" align="center" label="pkid" width="80">
          </el-table-column>
          <el-table-column prop="storeMemberCtime" align="center" label="创建时间" sortable>
          </el-table-column>
          <el-table-column prop="storeMemberName" align="center" label="姓名">
          </el-table-column>
          <el-table-column prop="storeMemberNikename" align="center" label="昵称"></el-table-column>
          <el-table-column prop="storeMemberSex" align="center" label="性别" :formatter="sexText">
          </el-table-column>
          <el-table-column prop="storeMemberAge" align="center" label="年龄"></el-table-column>
          <el-table-column prop="storeMemberPhone" align="center" label="手机号"></el-table-column>
          <el-table-column prop="storeMemberType" align="center" label="类型" :formatter="memberTypeTxt"></el-table-column>
          <el-table-column prop="storeMemberDisable" align="center" label="是否禁用" :formatter="disableTxt"></el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)" v-if="scope.row.storeMemberDisable===1">编辑
              </el-button>
              <el-button size="small" type="info" @click="disableStoreShow(scope.$index, scope.row)"
                         v-if="scope.row.storeMemberDisable===1">禁用
              </el-button>
              <el-button size="small" type="primary" v-else-if="scope.row.storeMemberDisable===0"
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
        <el-form ref="form" status-icon :model="form" label-width="80px" :rules="rules" class="demo-ruleForm">
          <el-form-item label="创建时间" prop="storeMemberCtime">
            <el-date-picker type="datetime" placeholder="选择日期" v-model="form.storeMemberCtime" value-format="yyyy-MM-dd HH-mm-ss"
                            style="width: 100%;" :picker-options="pickerOptions0"></el-date-picker>
          </el-form-item>
          <el-form-item label="手机号" prop="storeMemberPhone">
            <el-input v-model="form.storeMemberPhone"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="storeMemberName">
            <el-input v-model="form.storeMemberName"></el-input>
          </el-form-item>
          <el-form-item label="昵称">
            <el-input v-model="form.storeMemberNikename"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="form.storeMemberSex">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="年龄">
            <el-input v-model="form.storeMemberAge"></el-input>
          </el-form-item>
          <el-form-item label="身份证号">
            <el-input v-model="form.storeMemberIdnum"></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-radio-group v-model="form.storeMemberType" size="medium">
              <el-radio-button label="1" >油水</el-radio-button>
              <el-radio-button label="2">汗滴</el-radio-button>
              <el-radio-button label="3">汗水</el-radio-button>
              <el-radio-button label="4">大汗</el-radio-button>
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
    </div>
</template>

<script>
  import vali from '../common/validate'
export default {
  name: 'memberList',
  data () {
    return {
      currentPage: 1,
      pageSize: 10,
      total: null,
      pages: null,
      phone: null,
      names: null,
      pickerOptions0: this.startDate(),
      memberList: [],
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
        storeMemberPhone: null,
        storeMemberCtime: null,
        storeMemberName: null,
        storeMemberNikename: null,
        storeMemberSex: 1,
        storeMemberAge: null,
        storeMemberType: 1,
        storeMemberIdnum: null
      },
      idx: -1,
      rules: {
        storeMemberName: [
          { required: true, message: '请输入姓名', trigger: 'change' }
        ],
        storeMemberCtime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        storeMemberPhone: [
          { required: true, message: '请输入手机号', trigger: 'change' },
          {validator: vali.validatePhone, trigger: 'blur'}
        ]
      }
    }
  },
  created () {
    this.getData()
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
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfMemberOperate/findMemberByStorePkid', searchData, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        let mes = res.data.message
        if (res.data.success === '200') {
          _this.memberList = res.data.data.data
        } else if (mes === '无操作权限') {
          this.$router.push('/login')
          sessionStorage.clear()
          // _this.$message.error('无操作权限')
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    startDate () {
      return {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    },
    //  会员类型转文字
    memberTypeTxt (val) {
      if (val.storeMemberType === 1) {
        return '油水'
      } else if (val.storeMemberType === 2) {
        return '汗滴'
      } else if (val.storeMemberType === 3) {
        return '汗水'
      } else if (val.storeMemberType === 4) {
        return '大汗'
      }
    },
    // 性别转文字
    sexText (val) {
      if (val.storeMemberSex === 1) {
        return '男'
      } else if (val.storeMemberSex === 2) {
        return '女'
      }
    },
    // 禁用转文字
    disableTxt (val) {
      if (val.storeMemberDisable === 0) {
        return '禁用'
      } else if (val.storeMemberDisable === 1) {
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
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfMemberOperate/findMemberByStorePkid', storeDate, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.memberList = res.data.data.data
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
      let pkId = sessionStorage.getItem('storePkid')
      let storePkid = {
        pageSize: _this.pageSize,
        pageNum: 1,
        storePkid: parseInt(pkId)
      }
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfMemberOperate/findMemberByStorePkid', storePkid, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        let mes = res.data.message
        if (res.data.success === '200') {
          _this.memberList = res.data.data.data
          _this.total = res.data.data.total
          _this.pages = res.data.data.pages
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
      let item = _this.memberList[index]
      let agentDis = item.storeMemberDisable
      let pkid = item.storeMemberPkid
      _this.storeMemberPkid = pkid
      if (agentDis === 1) {
        _this.message = '是否禁用该会员？'
        _this.storeMemberDisable = 0
      } else {
        _this.message = '是否启用该会员？'
        _this.storeMemberDisable = 1
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
      const item = _this.memberList[index]
      _this.form = {
        storePkid: item.storePkid,
        storePkcode: item.storePkcode,
        storeMemberPhone: item.storeMemberPhone,
        storeMemberName: item.storeMemberName,
        storeMemberNikename: item.storeMemberNikename,
        storeMemberSex: item.storeMemberSex,
        storeMemberAge: item.storeMemberAge,
        storeMemberIdnum: item.storeMemberIdnum,
        storeMemberType: item.storeMemberType,
        storeMemberCtime: item.storeMemberCtime
      }
    },
    //  添加门店
    addStore (formName) {
      let _this = this
      let storePkid = sessionStorage.getItem('storePkid')
      let storePkcode = sessionStorage.getItem('storePkcode')
      let store = {
        storePkid: parseInt(storePkid),
        storePkcode: storePkcode,
        storeMemberPhone: _this.form.storeMemberPhone,
        storeMemberName: _this.form.storeMemberName,
        storeMemberNikename: _this.form.storeMemberNikename,
        storeMemberSex: parseInt(_this.form.storeMemberSex),
        storeMemberAge: parseInt(_this.form.storeMemberAge),
        storeMemberIdnum: _this.form.storeMemberIdnum,
        storeMemberType: parseInt(_this.form.storeMemberType),
        storeMemberCtime: _this.form.storeMemberCtime
      }
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfMemberOperate/addMember', store, {
            headers: {'Content-Type': 'application/json'}
          }).then((res) => {
            if (res.data.success === '200') {
              _this.memberList = res.data.data
              _this.$message.success('添加成功')
              location.reload()
              // _this.getData()
              _this.addVisible = false

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
      const item = _this.memberList[index]
      let store = {
        storeMemberPkid: item.storeMemberPkid,
        storeMemberPhone: _this.form.storeMemberPhone,
        storeMemberName: _this.form.storeMemberName,
        storeMemberNikename: _this.form.storeMemberNikename,
        storeMemberSex: parseInt(_this.form.storeMemberSex),
        storeMemberAge: parseInt(_this.form.storeMemberAge),
        storeMemberIdnum: _this.form.storeMemberIdnum,
        storeMemberType: parseInt(_this.form.storeMemberType)
      }
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfMemberOperate/updateMember', store, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        _this.memberList = res.data.data
        _this.$message.success('修改成功')
        // _this.getData()
        _this.addVisible = false
        location.reload()
      }).catch((error) => {
        console.log(error)
      })
    },
    //  是否禁用
    disableStore () {
      let _this = this
      let disableData = {
        storeMemberPkid: _this.storeMemberPkid,
        storeMemberDisable: _this.storeMemberDisable
      }
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfMemberOperate/disableMemberById', disableData, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        _this.memberList = res.data.data
        _this.$message.success('操作成功')
        _this.getData()
        _this.disableVisible = false
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
