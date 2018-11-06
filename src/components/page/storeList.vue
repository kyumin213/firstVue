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
      <el-table :data="storeList" border style="width: 100%"
                @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="storePkid" align="center" label="pkid" width="80">
        </el-table-column>
        <el-table-column prop="storeCtime" align="center" label="创建时间" sortable>
        </el-table-column>
        <!--<el-table-column prop="storeEndtime" align="center" label="结束时间" sortable></el-table-column>-->
        <el-table-column prop="storeName" align="center" label="门店名称">
        </el-table-column>
        <el-table-column prop="storeNikename" align="center" label="门店昵称">
        </el-table-column>
        <el-table-column prop="storeLinkman" align="center" label="联系人"></el-table-column>
        <el-table-column prop="storeLinkmanTel" align="center" label="联系电话"></el-table-column>
        <el-table-column prop="storeDisable" align="center" label="是否禁用" :formatter="disableTxt"></el-table-column>
        <el-table-column label="操作" width="320" align="center">
          <template slot-scope="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)" v-if="scope.row.storeDisable===1">编辑
            </el-button>
            <!--<el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)"-->
                       <!--v-if="scope.row.storeDisable===1">删除-->
            <!--</el-button>-->
            <el-button size="small" type="info" @click="disableStoreShow(scope.$index, scope.row)"
                       v-if="scope.row.storeDisable===1">禁用
            </el-button>
            <el-button size="small" type="primary" v-else-if="scope.row.storeDisable===0"
                       @click="disableStoreShow(scope.$index, scope.row)">启用
            </el-button>
            <el-button size="small" type="success" @click="setAddress(scope.$index, scope.row)">设置地址</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--<div class="pagination center" v-if="this.totalPage>=this.pageSize">-->
        <!--<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="pageSize" :current-page="currentPage"-->
                       <!--layout="prev, pager, next" :total="totalPage">-->
        <!--</el-pagination>-->
      <!--</div>-->
    </div>
    <!--新增-->
    <el-dialog :title="dailogTitleType" :visible.sync="addVisible" width="30%" :close-on-click-modal="false">
      <el-form ref="form" :model="form" label-width="100px" status-icon :rules="rules" class="demo-ruleForm">
        <el-form-item label="创建时间" prop="storeCtime">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.storeCtime" value-format="yyyy-MM-dd"
                          style="width: 100%;" :picker-options="pickerOptions0"></el-date-picker>
        </el-form-item>
        <el-form-item label="账号" prop="userAccountName" v-if="accountInfo===true">
          <el-input v-model="form.userAccountName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="userAccountPwd" v-if="accountInfo===true">
          <el-input v-model="form.userAccountPwd"></el-input>
        </el-form-item>
        <el-form-item label="门店名称" prop="storeName">
          <el-input v-model="form.storeName"></el-input>
        </el-form-item>
        <el-form-item label="门店昵称">
          <el-input v-model="form.storeNikename"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="storeLinkman">
          <el-input v-model="form.storeLinkman"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="storeLinkmanTel">
          <el-input v-model="form.storeLinkmanTel"></el-input>
        </el-form-item>
        <!--<el-form-item label="结束时间" prop="storeEndtime">-->
          <!--<el-date-picker type="date" placeholder="选择时间" v-model="form.storeEndtime" value-format="yyyy-MM-dd"-->
                          <!--style="width: 100%" :picker-options="endData"></el-date-picker>-->
        <!--</el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible=false">取消</el-button>
        <el-button type="primary"  @click="editStore('form')" v-if="editVisible">确定</el-button>
        <el-button type="primary" @click="submitForm('form')" v-else>确定</el-button>
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
    <!--设置地址-->
    <el-dialog title="设置地址" :visible.sync="addressVisible" width="40%">
      <div id="allmap"></div>
      <div style="text-align: center;margin-bottom: 10px"><el-button type="danger" @click="address">点击获取省市</el-button></div>
      <el-form ref="addressData" :model="addressData" label-width="100px" :rules="rules" class="demo-ruleForm">
        <el-form-item label="省市" prop="city">
          <el-input v-model="addressData.city" disabled></el-input>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="addressData.area"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible=false">取消</el-button>
        <el-button type="primary" @click="addAddress('addressData')">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BMap from 'BMap'
import vali from '../common/validate'
export default {
  name: 'storeList',
  data () {
    return {
      accountInfo: true,
      pickerOptions0: this.startDate(),
      endData: this.endDate(),
      storeList: [],
      prov: '',
      message: '',
      addVisible: false,
      editVisible: false,
      delVisible: false,
      disableVisible: false,
      is_search: false,
      addressVisible: false,
      dailogTitleType: '',
      currentPage: 1,
      pageSize: 10,
      totalPage: 0,
      tableDataEnd: [],
      filterTableDataEnd: [],
      multipleSelection: [],
      select_word: '',
      del_list: [],
      flag: false,
      form: {
        storeCtime: null,
        userAccountName: null,
        userAccountPwd: null,
        // storeEndtime: '',
        storeName: null,
        storeNikename: null,
        storeLinkman: null,
        storeLinkmanTel: null,
        storeLongitude: null,
        storeLatitude: null
      },
      addressData: {
        area: null,
        city: null
      },
      idx: -1,
      rules: {
        userAccountPwd: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { min: 6, message: '长度在最小6个字符', trigger: 'change' }
        ],
        userAccountName: [
          { required: true, message: '请输入用户名', trigger: 'change' }
        ],
        storeCtime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        // storeEndtime: [
        //   { required: true, message: '请选择结束时间', trigger: 'change' }
        // ],
        storeName: [
          { required: true, message: '请输输入门店名称', trigger: 'change' }
        ],
        storeLinkmanTel: [
          { required: true, message: '请输输入联系人手机号', trigger: 'change' },
          {validator: vali.validatePhone, trigger: 'change'}
        ],
        city: [
          { required: true, message: '请点击按钮获取位置', trigger: 'change' }
        ],
        storeLinkman: [
          { required: true, message: '请输入联系人', trigger: 'change' }
        ]
      },
      lng: '',
      lat: '',
      sheng: '',
      shi: ''
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
  mounted () {
    let _this = this
    var geolocation = new BMap.Geolocation()
    geolocation.getCurrentPosition(function (r) {
      if (this.getStatus() === BMAP_STATUS_SUCCESS) {
        const myGeo = new BMap.Geocoder()
        myGeo.getLocation(new BMap.Point(r.point.lng, r.point.lat), data => {
          if (data.addressComponents) {
            const result = data.addressComponents
            _this.addressData.city = result.province + result.city
            const location = {
              creditLongitude: r.point.lat, // 经度
              creditLatitude: r.point.lng, // 纬度
              creditProvince: result.province || '', // 省
              creditCity: result.city || '', // 市
              creditArea: result.district || '', // 区
              creditStreet: (result.street || '') + (result.streetNumber || '') // 街道
            }
            _this.location = location
            // console.log(location)
          }
        })
      }
    })
  },
  methods: {
    address () {
      let _this = this
      var map = new BMap.Map('allmap')
      var point = new BMap.Point(116.331398, 39.897445)
      map.centerAndZoom(point, 12)

      var geolocation = new BMap.Geolocation()
      geolocation.getCurrentPosition(function (r) {
        if (this.getStatus() === BMAP_STATUS_SUCCESS) {
          var mk = new BMap.Marker(r.point)
          map.addOverlay(mk)
          map.panTo(r.point)
          _this.addressData.city = r.address.province + r.address.city
          _this.sheng = r.address.province
          _this.shi = r.address.city
          _this.lng = r.point.lng
          _this.lat = r.point.lat
          console.log('您的位置：' + r.point.lng + ',' + r.point.lat)
        } else {
          alert('failed' + this.getStatus())
        }
      }, {enableHighAccuracy: true})
      // var map = new BMap.Map('allmap')
      // var point = new BMap.Point(116.331398, 39.897445)
      // map.centerAndZoom(point, 12)
      //
      // function myFun (result) {
      //   var cityName = result.name
      //   map.setCenter(cityName)
      //   console.log(result)
      //   console.log('当前定位城市:' + cityName)
      // }
      // var myCity = new BMap.LocalCity()
      // myCity.get(myFun)
    },
    startDate () {
      return {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    },
    endDate () {
      return {
        disabledDate: time => {
          let beginDateVal = this.form.storeCtime
          if (beginDateVal) {
            return (
              time.getTime() <
              new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
            )
          }
        }
      }
    },
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
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfStoreOperate/findStoreByAgentPkcode', agentPkcode, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        let mes = res.data.message
        if (res.data.success === '200') {
          _this.storeList = res.data.data
        } else if (mes === '无操作权限') {
          this.$router.push('/login')
          sessionStorage.clear()
          // _this.$message.error('无操作权限')
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    // 设置地址弹窗
    setAddress (index, row) {
      let _this = this
      _this.idx = index
      _this.addressVisible = true
    },

    // 禁用弹窗
    disableStoreShow (index, row) {
      let _this = this
      let item = _this.storeList[index]
      let agentDis = item.storeDisable
      let pkid = item.storePkid
      _this.storePkid = pkid
      if (agentDis === 1) {
        _this.message = '是否禁用该门店？'
        _this.storeDisable = 0
      } else {
        _this.message = '是否启用该门店？'
        _this.storeDisable = 1
      }
      this.disableVisible = true
    },

    //  创建弹窗
    addModelOpen () {
      let _this = this
      _this.accountInfo = true
      _this.addVisible = true
      _this.dailogTitleType = '新增'
      _this.editVisible = false
    },
    // 编辑弹窗
    handleEdit (index, row) {
      let _this = this
      _this.addVisible = true
      _this.accountInfo = false
      _this.dailogTitleType = '编辑'
      _this.editVisible = true
      _this.idx = index
      const item = _this.storeList[index]
      _this.form = {
        storePkid: item.storePkid,
        storeName: item.storeName,
        storeNikename: item.storeNikename,
        storeLongitude: item.storeLongitude,
        storeLatitude: item.storeLatitude,
        storeLinkman: item.storeLinkman,
        storeLinkmanTel: item.storeLinkmanTel,
        storeCtime: item.storeCtime
        // storeEndtime: item.storeEndtime
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
    // 添加地址
    addAddress (formName) {
      let _this = this
      let index = _this.idx
      const item = _this.storeList[index]
      let addreData = {
        storePkid: parseInt(item.storePkid),
        storeLongitude: _this.location.creditLongitude + '',
        storeLatitude: _this.location.creditLatitude + '',
        storeAddress: _this.addressData.area,
        storeProvince: _this.location.creditProvince,
        storeCity: _this.location.creditCity,
        storeDistrict: null
      }
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfStoreOperate/confAddress', addreData, {
            headers: {'Content-Type': 'application/json'}
          }).then((res) => {
            if (res.data.success === '200') {
              // _this.memberList = res.data.data
              _this.$message.success('操作成功')
              _this.addressVisible = false
              _this.getData()
              // location.reload()
            } else {
              _this.$message.error('无操作权限')
            }
          }).catch((error) => {
            console.log(error)
          })
        }
      })
    },
    //  添加门店
    submitForm (formName) {
      let _this = this
      let pkCode = sessionStorage.getItem('agentPkcode')
      let store = {
        agentPkcode: pkCode,
        userAccountName: _this.form.userAccountName,
        userAccountPwd: _this.form.userAccountPwd,
        storeName: _this.form.storeName,
        storeNikename: _this.form.storeNikename,
        storeCtime: _this.form.storeCtime,
        // storeEndtime: _this.form.storeEndtime,
        storeLinkman: _this.form.storeLinkman,
        storeLinkmanTel: _this.form.storeLinkmanTel,
        storeLongitude: _this.form.storeLongitude,
        storeLatitude: _this.form.storeLatitude
      }
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfStoreOperate/agentSaveStore', store, {
            headers: {'Content-Type': 'application/json'}
          }).then((res) => {
            if (res.data.success === '200') {
              _this.storeList = res.data.data
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
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    //  编辑门店
    editStore (formName) {
      let _this = this
      let index = _this.idx
      let pkCode = sessionStorage.getItem('agentPkcode')
      const item = _this.storeList[index]
      let store = {
        storePkid: item.storePkid,
        agentPkcode: pkCode,
        // userAccountName: _this.form.userAccountName,
        // userAccountPwd: _this.form.userAccountPwd,
        storeName: _this.form.storeName,
        storeNikename: _this.form.storeNikename,
        storeCtime: _this.form.storeCtime,
        // storeEndtime: _this.form.storeEndtime,
        storeLinkman: _this.form.storeLinkman,
        storeLinkmanTel: _this.form.storeLinkmanTel,
        storeLongitude: _this.form.storeLongitude,
        storeLatitude: _this.form.storeLatitude
      }
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfStoreOperate/agentSaveStore', store, {
            headers: {'Content-Type': 'application/json'}
          }).then((res) => {
            if (res.data.success === '200') {
              _this.storeList = res.data.data
              _this.$message.success('修改成功')
              _this.addVisible = false
              // _this.getData()
              location.reload()
            } else {
              _this.$message.error(res.data.message)
            }
          }).catch((error) => {
            console.log(error)
          })
        } else {
          return false
        }
      })
    },
    //  删除
    deleteRow () {
      var _this = this
      var index = _this.idx
      var pkid = {storePkid: _this.storeList[index].storePkid}
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfStoreOperate/agentDeleteStoreById', pkid,
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
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfStoreOperate/agentDisableStore', disableData, {
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
  .addBtn{
    background-color: #d71718;
    color: #fff;
    margin-bottom: 20px;
  }
</style>
