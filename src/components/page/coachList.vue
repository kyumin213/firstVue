<template>
  <div class="table">
    <div class="block">
      <el-row>
        <el-button class="addBtn" @click="addModelOpen()">创建教练</el-button>
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
        <el-table-column prop="storeCoachDisable" align="center" label="是否禁用" :formatter="disableTxt"></el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)" v-if="scope.row.storeCoachDisable===1">编辑
            </el-button>
            <el-button size="small" type="info" @click="disableStoreShow(scope.$index, scope.row)"
                       v-if="scope.row.storeCoachDisable===1">禁用
            </el-button>
            <el-button size="small" type="primary" v-else-if="scope.row.storeCoachDisable===0"
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
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="手机号">
          <el-input v-model="form.storeCoachPhone"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.storeCoachName"></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="form.storeCoachNikename"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="form.storeCoachSex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="form.storeCoachAge"></el-input>
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input v-model="form.storeCoachIdnum"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible=false">取消</el-button>
        <el-button type="primary" @click="editStore()" v-if="editVisible">确定</el-button>
          <el-button type="primary" @click="addStore()" v-else>确定</el-button>
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
  name: 'coachList',
  data () {
    return {
      coachList: [],
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
        storeCoachPhone: null,
        storeCoachName: '',
        storeCoachNikename: '',
        storeCoachSex: null,
        storeCoachAge: null,
        storeCoachIdnum: ''
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
          if (d.storeCoachName === this.del_list[i].storeCoachName) {
            isDel = true
            break
          }
        }
        if (!isDel) {
          if ((d.storeCoachName.indexOf(this.select_word) > -1 ||
            d.storeCoachNikename.indexOf(this.select_word) > -1)
          ) {
            return d
          }
        }
      })
    }
  },
  methods: {
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
      this.currentPage = val
      if (!this.flag) {
        this.currentChangePage(this.memberList)
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
      let Pkid = sessionStorage.getItem('storePkid')
      let storePkid = {
        storePkid: parseInt(Pkid)
      }
      _this.axios.post('/api/agentOfCoachOperate/findCoachByStorePkid', storePkid, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.coachList = res.data.data
          _this.totalPage = _this.coachList.length
          if (_this.totalPage > _this.pageSize) {
            for (let index = 0; index < _this.pageSize; index++) {
              _this.tableDataEnd.push(_this.coachList[index])
            }
          } else {
            _this.tableDataEnd = _this.coachList
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
      let item = _this.coachList[index]
      let agentDis = item.storeCoachDisable
      let pkid = item.storeCoachPkid
      _this.storeCoachPkid = pkid
      if (agentDis === 1) {
        _this.message = '是否禁用该商户？'
        _this.storeCoachDisable = 0
      } else {
        _this.message = '是否启用该商户？'
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
        storeCoachIdnum: item.storeCoachIdnum
      }
    },
    //  添加门店
    addStore () {
      let _this = this
      let Pkid = sessionStorage.getItem('storePkid')
      let store = {
        storePkid: parseInt(Pkid),
        storeCoachPhone: _this.form.storeCoachPhone,
        storeCoachName: _this.form.storeCoachName,
        storeCoachNikename: _this.form.storeCoachNikename,
        storeCoachSex: parseInt(_this.form.storeCoachSex),
        storeCoachAge: parseInt(_this.form.storeCoachAge),
        storeCoachIdnum: _this.form.storeCoachIdnum
      }
      _this.axios.post('/api/agentOfCoachOperate/addCoach', store, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.coachList = res.data.data
          _this.$message.success('添加成功')
          _this.addVisible = false
          _this.getData()
        } else {
          _this.$message.error(res.data.message)
        }
      }).catch((error) => {
        console.log(error)
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
        storeCoachIdnum: _this.form.storeCoachIdnum
      }
      _this.axios.post('/api/agentOfCoachOperate/updateCoach', store, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.coachList = res.data.data
          _this.$message.success('修改成功')
          _this.addVisible = false
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
        storeCoachPkid: _this.storeCoachPkid,
        storeCoachDisable: _this.storeCoachDisable
      }
      _this.axios.post('/api/agentOfCoachOperate/disableCoachById', disableData, {
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

</style>
