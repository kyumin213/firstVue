<!--suppress ALL -->
<template>
  <div>
    <!--<div class="crumbs">-->
      <!--<el-breadcrumb separator="/">-->
        <!--<el-breadcrumb-item><i class="el-icon-tickets"></i> 基础表格</el-breadcrumb-item>-->
      <!--</el-breadcrumb>-->
    <!--</div>-->
    <div class="block">
      <el-row>
        <el-button class="addBtn" @click="addModelOpen()">创建商户</el-button>
      </el-row>
    </div>
    <div class="containers">
      <!--<div class="handle-box">-->
        <!--<el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>-->
        <!--<el-select v-model="select_cate" placeholder="筛选省份" class="handle-select mr10">-->
          <!--<el-option key="1" label="广东省" value="广东省"></el-option>-->
          <!--<el-option key="2" label="湖南省" value="湖南省"></el-option>-->
        <!--</el-select>-->
        <!--<el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>-->
        <!--<el-button type="primary" icon="search" @click="search">搜索</el-button>-->
      <!--</div>-->
      <el-table :data="allAgent" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="agentPkid" label="pkid" width="60" align="center">
        </el-table-column>
        <el-table-column prop="agentCtime" label="创建时间" sortable align="center" width="170">
        </el-table-column>
        <el-table-column prop="agentName" label="品牌代理名称" align="center">
        </el-table-column>
        <el-table-column prop="agentNikename" label="品牌代理昵称" align="center">
        </el-table-column>
        <el-table-column prop="agentType" label="代理类型" align="center" :formatter="agentTypeTxt">
        </el-table-column>
        <el-table-column prop="agentCompanyName" label="公司名称" align="center"></el-table-column>
        <el-table-column prop="agentCompanyIdnum" label="公司编号" align="center"></el-table-column>
        <el-table-column prop="agentCompanyAddress" label="公司地址" align="center"></el-table-column>
        <el-table-column prop="agentLinkman" label="联系人" align="center"></el-table-column>
        <el-table-column prop="agentLinkmanTel" label="联系电话" align="center"></el-table-column>
        <el-table-column prop="agentDisable" label="是否禁用" align="center" :formatter="disableTxt"></el-table-column>
        <el-table-column label="操作" width="240" align="center">
          <template slot-scope="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)" v-if="scope.row.agentDisable==='1'">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)" v-if="scope.row.agentDisable==='1'">删除</el-button>
            <el-button size="small" type="info" @click="disableAgentShow(scope.$index, scope.row)" v-if="scope.row.agentDisable==='1'">禁用</el-button>
            <el-button size="small" type="primary" v-else-if="scope.row.agentDisable==='0'" @click="disableAgentShow(scope.$index, scope.row)">启用</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--<div class="pagination">-->
        <!--<el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="1000">-->
        <!--</el-pagination>-->
      <!--</div>-->
    </div>
    <!--新增-->
    <el-dialog :title="dailogTitleType" :visible.sync="addVisible" width="35%" :close-on-click-modal="false">
      <el-form ref="form" status-icon :model="form" label-width="120px" :rules="rules" class="demo-ruleForm">
        <el-form-item label="创建时间" prop="agentCtime">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.agentCtime" value-format="yyyy-MM-dd" style="width: 100%;" :picker-options="pickerOptions0"></el-date-picker>
        </el-form-item>
        <el-form-item label="用户名" prop="userAccountName" v-if="accountInfo===true">
          <el-input v-model="form.userAccountName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="userAccountPwd" v-if="accountInfo===true">
          <el-input v-model="form.userAccountPwd"></el-input>
        </el-form-item>
        <el-form-item label="品牌代理名称" prop="agentName">
          <el-input v-model="form.agentName"></el-input>
        </el-form-item>
        <el-form-item label="品牌代理昵称">
          <el-input v-model="form.agentNikename"></el-input>
        </el-form-item>
        <el-form-item label="代理类型" prop="agentType">
          <el-select v-model="form.agentType" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公司名称" prop="agentCompanyName">
          <el-input v-model="form.agentCompanyName"></el-input>
        </el-form-item>
        <el-form-item label="公司编号">
          <el-input v-model="form.agentCompanyIdnum"></el-input>
        </el-form-item>
        <el-form-item label="公司地址" prop="agentCompanyAddress">
          <el-input v-model="form.agentCompanyAddress"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="agentLinkman">
          <el-input v-model="form.agentLinkman"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="agentLinkmanTel">
          <el-input v-model="form.agentLinkmanTel"></el-input>
        </el-form-item>
        <!--<el-form-item label="结束时间">-->
          <!--<el-date-picker type="date" placeholder="选择时间" v-model="form.agentEndtime" value-format="yyyy-MM-dd" style="width: 100%" :picker-options="pickerOptions0"></el-date-picker>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="经度">-->
          <!--<el-input v-model="form.agentCompanyAddressLongitude"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="纬度">-->
          <!--<el-input v-model="form.agentCompanyAddressLatitude"></el-input>-->
        <!--</el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible=false">取消</el-button>
        <el-button type="primary" @click="addAgent('form')" v-if="!editVisible">确定</el-button>
        <el-button type="primary" @click="saveEdit()" v-else>确定</el-button>
      </span>
    </el-dialog>
    <!-- 删除提示框 -->
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
        <el-button type="primary" @click="disableAgent">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import vali from '../common/validate'
export default {
  name: 'basetable',

  data () {
    return {
      accountInfo: true,
      pickerOptions0: this.startDate(),
      url: './static/vuetable.json',
      allAgent: [],
      message: '是否禁用该商户?',
      dailogTitleType: '',
      cur_page: 1,
      multipleSelection: [],
      select_cate: '',
      select_word: '',
      del_list: [],
      is_search: false,
      editVisible: false,
      delVisible: false,
      addVisible: false,
      disableVisible: false,
      editAgent: false,
      undisableVisible: false,
      agentPkid: '',
      agentDisable: '',
      form: {
        userAccountName: null,
        userAccountPwd: null,
        agentName: null,
        agentNikename: null,
        agentType: null,
        agentCompanyName: null,
        agentCompanyIdnum: null,
        agentCompanyAddress: null,
        agentCompanyAddressLongitude: null,
        agentCompanyAddressLatitude: null,
        agentLinkman: null,
        agentLinkmanTel: null,
        agentCtime: null,
        agentEndtime: null
      },
      options: [
        {
          value: 0,
          label: '管理员'
        },
        {
          value: 1,
          label: '商户'
        }
      ],
      idx: -1,
      rules: {
        userAccountPwd: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { min: 6, message: '长度在最小6个字符', trigger: 'change' }
        ],
        userAccountName: [
          { required: true, message: '请输入用户名', trigger: 'change' }
        ],
        agentName: [
          { required: true, message: '请输入品牌代理名称', trigger: 'change' }
        ],
        agentType: [
          { required: true, message: '请选择代理类型', trigger: 'change' }
        ],
        agentCompanyName: [
          { required: true, message: '请输入公司名称', trigger: 'change' }
        ],
        agentCompanyAddress: [
          { required: true, message: '请输入公司地址', trigger: 'change' }
        ],
        agentLinkman: [
          { required: true, message: '请输入联系人', trigger: 'change' }
        ],
        agentLinkmanTel: [
          { required: true, message: '请输入联系人手机号', trigger: 'change' },
          {validator: vali.validatePhone, trigger: 'change'}
        ],
        agentCtime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ]
        // agentEndtime: [
        //   { required: true, message: '请选择结束时间', trigger: 'change' }
        // ]
      }
    }
  },
  created () {
    this.getData()
  },
  methods: {
    startDate () {
      return {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    },
    //  禁用转文字
    disableTxt (val) {
      if (val.agentDisable === '0') {
        return '禁用'
      } else if (val.agentDisable === '1') {
        return '启用'
      }
    },
    //  代理类型转文字
    agentTypeTxt (val) {
      if (val.agentType === 0) {
        return '管理员'
      } else if (val.agentType === 1) {
        return '商户'
      }
    },
    // 禁用弹窗
    disableAgentShow (index, row) {
      let _this = this
      let item = _this.allAgent[index]
      let agentDis = item.agentDisable
      let pkid = item.agentPkid
      _this.agentPkid = pkid
      if (agentDis === '1') {
        _this.message = '是否禁用该商户？'
        _this.agentDisable = '0'
      } else {
        _this.message = '是否启用该商户？'
        _this.agentDisable = '1'
      }
      this.disableVisible = true
    },
    disableAgent () {
      var _this = this
      var disableData = {
        agentPkid: _this.agentPkid,
        agentDisable: parseInt(_this.agentDisable)
      }
      _this.axios.post(this.GLOBAL.BASE_URL + '/sysOperate/disableAgent', disableData, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.allAgent = res.data.data
          _this.disableVisible = false
          _this.$message.success('操作成功')
          _this.getData()
        } else {
          _this.$message.error('操作失败')
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    // 创建商户弹窗
    addModelOpen () {
      var _this = this
      _this.accountInfo = true
      _this.addVisible = true
      _this.dailogTitleType = '新增'
      _this.editVisible = false
    },
    // 编辑商户弹窗
    handleEdit (index, row) {
      var _this = this
      _this.accountInfo = false
      _this.idx = index
      _this.dailogTitleType = '编辑'
      _this.addVisible = true
      _this.editVisible = true
      const item = this.allAgent[index]
      // if (_this.form.agentType === 0) {
      //   _this.from.agentType = '管理员'
      // } else if (_this.form.agentType === 1) {
      //   _this.form.agentType = '商户'
      // }
      _this.form = {
        userAccountName: item.userAccountName,
        userAccountPwd: item.userAccountPwd,
        agentName: item.agentName,
        agentNikename: item.agentNikename,
        agentType: item.agentType,
        agentCompanyName: item.agentCompanyName,
        agentCompanyIdnum: item.agentCompanyIdnum,
        agentCompanyAddress: item.agentCompanyAddress,
        agentCompanyAddressLongitude: item.agentCompanyAddressLongitude,
        agentCompanyAddressLatitude: item.agentCompanyAddressLatitude,
        agentLinkman: item.agentLinkman,
        agentLinkmanTel: item.agentLinkmanTel,
        agentCtime: item.agentCtime,
        agentEndtime: item.agentEndtime
      }
    },
    // 分页导航
    handleCurrentChange (val) {
      this.cur_page = val
      this.getData()
    },
    getData () {
      var _this = this
      _this.axios.post(this.GLOBAL.BASE_URL + '/sysOperate/findAllAgentList', {
        // page: this.cur_page
        headers: {'Content-type': 'application/json'}
      }).then((res) => {
        let mes = res.data.message
        if (res.data.success === '200') {
          _this.allAgent = res.data.data
        } else if (mes === '无操作权限') {
          this.$router.push('/login')
          sessionStorage.clear()
          // _this.$message.error('无操作权限')
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    // 新增商户信息
    addAgent (formName) {
      var _this = this
      var agent = {
        userAccountName: _this.form.userAccountName,
        userAccountPwd: _this.form.userAccountPwd,
        agentName: _this.form.agentName,
        agentNikename: _this.form.agentNikename,
        agentType: parseInt(_this.form.agentType),
        agentCompanyName: _this.form.agentCompanyName,
        agentCompanyIdnum: _this.form.agentCompanyIdnum,
        agentCompanyAddress: _this.form.agentCompanyAddress,
        agentCompanyAddressLongitude: _this.form.agentCompanyAddressLongitude,
        agentCompanyAddressLatitude: _this.form.agentCompanyAddressLatitude,
        agentLinkman: _this.form.agentLinkman,
        agentLinkmanTel: _this.form.agentLinkmanTel,
        agentCtime: _this.form.agentCtime,
        agentEndtime: _this.form.agentEndtime
      }
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.axios.post(this.GLOBAL.BASE_URL + '/sysOperate/saveAgent', agent, {
            headers: {'Content-Type': 'application/json'}
          }).then((res) => {
            _this.allAgent = res.data.data
            _this.$message.success('添加成功')
            _this.addVisible = false
            // _this.getData()
            location.reload()
          }).catch((error) => {
            console.log(error)
          })
        }
      })
    },
    search () {
      this.is_search = true
    },
    formatter (row, column) {
      return row.address
    },
    filterTag (value, row) {
      return row.tag === value
    },

    handleDelete (index, row) {
      this.idx = index
      this.delVisible = true
    },
    delAll () {
      const length = this.multipleSelection.length
      let str = ''
      this.del_list = this.del_list.concat(this.multipleSelection)
      for (let i = 0; i < length; i++) {
        str += this.multipleSelection[i].name + ' '
      }
      this.$message.error('删除了' + str)
      this.multipleSelection = []
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 保存编辑
    saveEdit () {
      var _this = this
      var index = _this.idx
      var item = _this.allAgent[index]
      if (_this.form.agentType === '管理员') {
        _this.from.agentType = '0'
      } else if (_this.form.agentType === '商户') {
        _this.form.agentType = '1'
      }
      var agent = {
        userAccountName: item.userAccountName,
        userAccountPwd: item.userAccountPwd,
        agentPkid: item.agentPkid,
        agentName: _this.form.agentName,
        agentNikename: _this.form.agentNikename,
        agentType: parseInt(_this.form.agentType),
        agentCompanyName: _this.form.agentCompanyName,
        agentCompanyIdnum: _this.form.agentCompanyIdnum,
        agentCompanyAddress: _this.form.agentCompanyAddress,
        agentCompanyAddressLongitude: _this.form.agentCompanyAddressLongitude,
        agentCompanyAddressLatitude: _this.form.agentCompanyAddressLatitude,
        agentLinkman: _this.form.agentLinkman,
        agentLinkmanTel: _this.form.agentLinkmanTel,
        agentCtime: _this.form.agentCtime,
        agentEndtime: _this.form.agentEndtime
      }
      // var pkid = {agentPkid: _this.allAgent[index].agent}
      _this.axios.post(this.GLOBAL.BASE_URL + '/sysOperate/saveAgent', agent)
        .then((res) => {
          _this.allAgent = res.data.data
          _this.$message.success('修改成功')
          // _this.getData()
          location.reload()
          this.addVisible = false
        })
    },
    // 确定删除
    deleteRow () {
      var _this = this
      var index = _this.idx
      var pkid = {agentPkid: _this.allAgent[index].agentPkid}
      _this.axios.post(this.GLOBAL.BASE_URL + '/sysOperate/deleteAgentById', pkid,
        {headers: {'Content-Type': 'application/json'}})
        .then((res) => {
          _this.allAgent.splice(index, 1)
          _this.$message.success('删除成功')
          _this.delVisible = false
          _this.getData()
        }).catch((error) => {
          console.log(error)
        })
    }
  }
}

</script>

<style scoped>
  .show{
    display: block;
  }
  .hidden{
    display: none;
  }
  .handle-box {
    margin-bottom: 20px;
  }

  .handle-select {
    width: 120px;
  }

  .handle-input {
    width: 300px;
    display: inline-block;
  }

  .pagination{
    width: 70%;
    text-align: center;
  }
  .addBtn{
    background-color: #d71718;
    color: #fff;
    margin-bottom: 20px;
  }
</style>
