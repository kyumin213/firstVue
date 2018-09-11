<template>
  <div class="table">
    <div class="block">
      <el-row>
        <el-button class="addBtn" @click="addModelOpen()">创建门店</el-button>
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
        <el-table-column prop="storePkid" align="center" label="pkid" width="80">
        </el-table-column>
        <el-table-column prop="storeCtime" align="center" label="创建时间" sortable>
        </el-table-column>
        <el-table-column prop="storeEndtime" align="center" label="结束时间" sortable></el-table-column>
        <el-table-column prop="storeName" align="center" label="门店名称">
        </el-table-column>
        <el-table-column prop="storeNikename" align="center" label="门店昵称">
        </el-table-column>
        <el-table-column prop="storeLinkman" align="center" label="联系人"></el-table-column>
        <el-table-column prop="storeLinkmanTel" align="center" label="联系电话"></el-table-column>
        <el-table-column prop="storeDisable" align="center" label="是否禁用" :formatter="disableTxt"></el-table-column>
        <el-table-column label="操作" width="250" align="center">
          <template slot-scope="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)" v-if="scope.row.storeDisable===1">编辑
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)"
                       v-if="scope.row.storeDisable===1">删除
            </el-button>
            <el-button size="small" type="info" @click="disableStoreShow(scope.$index, scope.row)"
                       v-if="scope.row.storeDisable===1">禁用
            </el-button>
            <el-button size="small" type="primary" v-else-if="scope.row.storeDisable===0"
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
    <el-dialog :title="dailogTitleType" :visible.sync="addVisible" width="40%">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="创建时间">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.storeCtime" value-format="yyyy-MM-dd"
                          style="width: 100%;"></el-date-picker>
        </el-form-item>
        <el-form-item label="账号">
          <el-input v-model="form.userAccountName"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.userAccountPwd"></el-input>
        </el-form-item>
        <el-form-item label="门店名称">
          <el-input v-model="form.storeName"></el-input>
        </el-form-item>
        <el-form-item label="门店昵称">
          <el-input v-model="form.storeNikename"></el-input>
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="form.storeLinkman"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="form.storeLinkmanTel"></el-input>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker type="date" placeholder="选择时间" v-model="form.storeEndtime" value-format="yyyy-MM-dd"
                          style="width: 100%"></el-date-picker>
        </el-form-item>
        <el-form-item label="经度">
          <el-input v-model="form.storeLongitude"></el-input>
        </el-form-item>
        <el-form-item label="纬度">
          <el-input v-model="form.storeLatitude"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible=false">取消</el-button>
        <el-button type="primary" @click="editStore()" v-if="editVisible">确定</el-button>
          <el-button type="primary" @click="addStore()" v-else>确定</el-button>
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
  name: 'storeList',
  data () {
    return {
      storeList: [],
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
        storeCtime: '',
        userAccountName: '',
        userAccountPwd: '',
        storeEndtime: '',
        storeName: '',
        storeNikename: '',
        storeLinkman: '',
        storeLinkmanTel: '',
        storeLongitude: '',
        storeLatitude: ''
      },
      idx: -1
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
          if (d.storeName === this.del_list[i].storeName) {
            isDel = true
            break
          }
        }
        if (!isDel) {
          if ((d.storeName.indexOf(this.select_word) > -1 ||
              d.storeLinkman.indexOf(this.select_word) > -1)
          ) {
            return d
          }
        }
      })
    }
  },
  methods: {
    //  禁用转文字
    disableTxt (val) {
      if (val.storeDisable === 0) {
        return '禁用'
      } else if (val.storeDisable === 1) {
        return '启用'
      }
    },
    // 分页导航
    handleCurrentChange (val) {
      this.currentPage = val
      if (!this.flag) {
        this.currentChangePage(this.storeList)
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
      let pkCode = sessionStorage.getItem('agentPkcode')
      let agentPkcode = {
        agentPkcode: pkCode
      }
      _this.axios.post('/api/agentOfStoreOperate/findStoreByAgentPkcode', agentPkcode, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.storeList = res.data.data
          _this.totalPage = _this.storeList.length
          if (_this.totalPage > _this.pageSize) {
            for (let index = 0; index < _this.pageSize; index++) {
              _this.tableDataEnd.push(_this.storeList[index])
            }
          } else {
            _this.tableDataEnd = _this.storeList
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
      let item = _this.storeList[index]
      let agentDis = item.storeDisable
      let pkid = item.storePkid
      _this.storePkid = pkid
      if (agentDis === 1) {
        _this.message = '是否禁用该商户？'
        _this.storeDisable = 0
      } else {
        _this.message = '是否启用该商户？'
        _this.storeDisable = 1
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
      const item = _this.storeList[index]
      _this.form = {
        storePkid: item.storePkid,
        storeName: item.storeName,
        userAccountName: item.userAccountName,
        userAccountPwd: item.userAccountPwd,
        storeNikename: item.storeNikename,
        storeLongitude: item.storeLongitude,
        storeLatitude: item.storeLatitude,
        storeLinkman: item.storeLinkman,
        storeLinkmanTel: item.storeLinkmanTel,
        storeCtime: item.storeCtime,
        storeEndtime: item.storeEndtime
      }
    },
    // 删除弹窗
    handleDelete (index, row) {
      let _this = this
      _this.idx = index
      _this.delVisible = true
    },
    // 批量删除
    delAll () {
      const length = this.multipleSelection.length
      let str = ''
      this.del_list = this.del_list.concat(this.multipleSelection)
      for (let i = 0; i < length; i++) {
        str += this.multipleSelection[i].storeName + ' '
      }
      this.$message.error('删除了' + str)
      this.multipleSelection = []
    },
    //  添加门店
    addStore () {
      let _this = this
      let pkCode = sessionStorage.getItem('agentPkcode')
      let store = {
        agentPkcode: pkCode,
        userAccountName: _this.form.userAccountName,
        userAccountPwd: _this.form.userAccountPwd,
        storeName: _this.form.storeName,
        storeNikename: _this.form.storeNikename,
        storeCtime: _this.form.storeCtime,
        storeEndtime: _this.form.storeEndtime,
        storeLinkman: _this.form.storeLinkman,
        storeLinkmanTel: _this.form.storeLinkmanTel,
        storeLongitude: _this.form.storeLongitude,
        storeLatitude: _this.form.storeLatitude
      }
      _this.axios.post('/api/agentOfStoreOperate/agentSaveStore', store, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        _this.storeList = res.data.data
        _this.$message.success('添加成功')
        _this.addVisible = false
        _this.getData()
      }).catch((error) => {
        console.log(error)
      })
    },
    //  编辑门店
    editStore () {
      let _this = this
      let index = _this.idx
      let pkCode = sessionStorage.getItem('agentPkcode')
      const item = _this.storeList[index]
      let store = {
        storePkid: item.storePkid,
        agentPkcode: pkCode,
        userAccountName: _this.form.userAccountName,
        userAccountPwd: _this.form.userAccountPwd,
        storeName: _this.form.storeName,
        storeNikename: _this.form.storeNikename,
        storeCtime: _this.form.storeCtime,
        storeEndtime: _this.form.storeEndtime,
        storeLinkman: _this.form.storeLinkman,
        storeLinkmanTel: _this.form.storeLinkmanTel,
        storeLongitude: _this.form.storeLongitude,
        storeLatitude: _this.form.storeLatitude
      }
      _this.axios.post('/api/agentOfStoreOperate/agentSaveStore', store, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        _this.storeList = res.data.data
        _this.$message.success('修改成功')
        _this.addVisible = false
        _this.getData()
      }).catch((error) => {
        console.log(error)
      })
    },
    //  删除
    deleteRow () {
      var _this = this
      var index = _this.idx
      var pkid = {storePkid: _this.storeList[index].storePkid}
      _this.axios.post('/api/agentOfStoreOperate/agentDeleteStoreById', pkid,
        {headers: {'Content-Type': 'application/json'}})
        .then((res) => {
          _this.storeList.splice(index, 1)
          _this.$message.success('删除成功')
          _this.delVisible = false
          _this.getData()
        }).catch((error) => {
          console.log(error)
        })
    },
    //  是否禁用
    disableStore () {
      let _this = this
      let disableData = {
        storePkid: _this.storePkid,
        storeDisable: _this.storeDisable
      }
      _this.axios.post('/api/agentOfStoreOperate/agentDisableStore', disableData, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        _this.storeList = res.data.data
        _this.disableVisible = false
        _this.$message.success('操作成功')
        _this.getData()
      }).catch((error) => {
        console.log(error)
      })
    }
  }
}
</script>

<style scoped>
  .handle-box {
    margin-bottom: 20px;
  }

  .handle-input {
    width: 300px;
    display: inline-block;
  }
</style>
