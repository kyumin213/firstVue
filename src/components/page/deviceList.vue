<template>
    <div>
      <div class="block">
        <el-row>
          <el-button class="addBtn" @click="syncDevice">同步设备</el-button>
        </el-row>
      </div>
      <div class="container">
        <el-table :data="deviceData" border style="width: 100%">
          <!--<el-table-column type="selection" width="55"></el-table-column>-->
          <el-table-column prop="devicePkid" label="pkid" align="center"></el-table-column>
          <el-table-column prop="branchName" label="商户" align="center"></el-table-column>
          <el-table-column prop="deviceTypeId" label="deviceTypeId" align="center"></el-table-column>
          <el-table-column prop="deviceVersion" label="deviceVersion" align="center"></el-table-column>
          <el-table-column prop="merchantName" label="设备名称" align="center"></el-table-column>
          <el-table-column prop="deviceType" label="类型" align="center"></el-table-column>
          <el-table-column prop="remark" label="remark" align="center"></el-table-column>
          <el-table-column prop="networkingStatus" label="networkingStatus" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="300">
            <template slot-scope="scope">
              <el-button size="small" type="success" @click="getLockerInfo(scope.$index, scope.row)">使用情况</el-button>
              <el-button size="small" type="primary" @click="longLeaseModal(scope.$index, scope.row)">申请长租</el-button>
              <el-button size="small" type="primary" @click="setDeviceModal(scope.$index, scope.row)">设置</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--使用情况弹窗-->
      <el-dialog :title="dailogTitleType"  width="90%" :visible.sync="addVisible" center>
        <el-table :data="LockerInfoData" border style="width: 100%">
          <!--<el-table-column type="selection" width="55"></el-table-column>-->
          <el-table-column prop="cabinetNo" label="cabinetNo" align="center"></el-table-column>
          <el-table-column prop="cabinetNo" label="cabinetNo" align="center"></el-table-column>
          <el-table-column prop="deviceId" label="deviceId" align="center"></el-table-column>
          <el-table-column prop="id" label="id" align="center"></el-table-column>
          <el-table-column prop="lineNo" label="lineNo" align="center"></el-table-column>
          <el-table-column prop="lockId" label="lockId" align="center"></el-table-column>
          <el-table-column prop="lockNo" label="lockNo" align="center"></el-table-column>
          <el-table-column prop="vip" label="vip" align="center" :formatter="vipText"></el-table-column>
        </el-table>
      </el-dialog>
      <!--申请长租-->
      <el-dialog title="申请长租" :visible.sync="editVisible" width="40%" :close-on-click-modal="false">
        <el-form :model="form" label-width="90px">
          <el-form-item label="用户名称">
            <el-select placeholder="请选择" filterable v-model="form.userNames" @change="getUser">
              <el-option v-for="(item, index) in allUserData" :key="index" :label="item.name" :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="柜号">
            <el-select placeholder="请选择" filterable v-model="form.number">
              <el-option v-for="(item, index) in LockerInfoData" :key="index" :label="item.cabinetNo" :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间">
          <el-date-picker type="datetime" placeholder="选择日期" v-model="form.begtime" value-format="yyyy-MM-dd HH-mm-ss"
                          style="width: 100%;" :picker-options="pickerOptions0">
          </el-date-picker>
        </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker type="datetime" placeholder="选择日期" v-model="form.endtime" value-format="yyyy-MM-dd HH-mm-ss"
                            style="width: 100%;" :picker-options="pickerEndDate">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible=false">取消</el-button>
          <el-button type="primary" @click="longLease">确定</el-button>
        </span>
      </el-dialog>
      <!--设置设备-->
      <el-dialog title="设置" :visible.sync="setVisible" width="40%" :close-on-click-modal="false">
        <el-form :model="setDevice" label-width="90px">
          <el-form-item label="门店ID">
            <span>{{setDevice.storePkid}}</span>
          </el-form-item>
          <el-form-item label="设备ID">
            <span>{{setDevice.devicePkid}}</span>
          </el-form-item>
          <el-form-item label="用户名称">
            <el-select placeholder="请选择" filterable v-model="setDevice.userNames" @change="deviceChange">
              <el-option v-for="(item, index) in allUserData" :key="index" :label="item.name" :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设置">
            <el-radio-group v-model="setDevice.isadmin" size="medium">
              <el-radio-button label="0">非管理员</el-radio-button>
              <el-radio-button label="1">管理员</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setVisible=false">取消</el-button>
          <el-button type="primary" @click="setDeviceForm">确定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'courseList',
  data () {
    return {
      deviceData: [],
      LockerInfoData: [],
      allUserData: [],
      addVisible: false,
      editVisible: false,
      setVisible: false,
      dailogTitleType: '',
      idx: -1,
      pickerOptions0: this.startDate(),
      pickerEndDate: this.endDate(),
      form: {
        storePkid: null,
        devicePkid: null,
        userid: null,
        type: null,
        begtime: null,
        endtime: null,
        number: null,
        userNames: null
      },
      setDevice: {
        storePkid: null,
        devicePkid: null,
        userid: null,
        type: null,
        isadmin: '0',
        userNames: null
      }
    }
  },
  created () {
    this.getData()
    this.getAllUser()
  },
  methods: {
    // 设备列表
    getData () {
      let _this = this
      let storePkid = sessionStorage.getItem('storePkid')
      let pkid = {storePkid: parseInt(storePkid)}
      _this.axios.post(this.GLOBAL.BASE_URL + '/storeOfDeviceOperate/storeDeviceList', pkid, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        let mes = res.data.message
        if (res.data.success === '200') {
          _this.deviceData = res.data.data
        } else if (mes === '无操作权限') {
          this.$router.push('/login')
          sessionStorage.clear()
          // _this.$message.error('无操作权限')
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    // 获取全部用户
    getAllUser () {
      let _this = this
      let storePkid = sessionStorage.getItem('storePkid')
      let pkid = {storePkid: parseInt(storePkid)}
      _this.axios.post(this.GLOBAL.BASE_URL + '/storeOfDeviceOperate/storeAllUser', pkid, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.allUserData = res.data.data
        } else {
          _this.$message.error(res.data.message)
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    // 长租申请用户
    getUser (value) {
      let _this = this
      let index = value
      let item = _this.allUserData[index]
      _this.form.userid = item.userAccountPkcode
      _this.form.type = item.userAccountType
    },
    // 设置设备用户
    deviceChange (value) {
      let _this = this
      let index = value
      let item = _this.allUserData[index]
      _this.setDevice.userid = item.userAccountPkcode
      _this.setDevice.type = item.userAccountType
    },
    // VIP转文字
    vipText (val) {
      if (val.vip === true) {
        return '是'
      } else {
        return '否'
      }
    },
    // 结束时间
    endDate () {
      return {
        disabledDate: time => {
          let beginDateVal = this.form.begtime
          if (beginDateVal) {
            return (
              time.getTime() < Date.now() ||
              time.getTime() >
              new Date(beginDateVal).getTime()
              // new Date(beginDateVal).getTime() + 1 * 24 * 60 * 60 * 1000
            )
          } else {
            return time.getTime() > Date.now()
          }
        }
      }
    },
    startDate () {
      return {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    },
    // 新增弹窗
    addModelOpen () {
      let _this = this
      _this.addVisible = true
      _this.dailogTitleType = '新增'
    },
    // 同步设备
    syncDevice () {
      let _this = this
      let storePkid = sessionStorage.getItem('storePkid')
      let pkid = {storePkid: parseInt(storePkid)}
      _this.axios.post(this.GLOBAL.BASE_URL + '/storeOfDeviceOperate/syncDevice', pkid, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          // _this.deviceData = res.data.data
          _this.getData()
          _this.$message.success('同步成功')
        } else {
          _this.$message.error(res.data.message)
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    // 设置设备弹窗
    setDeviceModal (index, row) {
      let _this = this
      _this.setVisible = true
      _this.idx = index
      let storePkid = sessionStorage.getItem('storePkid')
      const item = _this.deviceData[index]
      _this.setDevice = {
        storePkid: parseInt(storePkid),
        devicePkid: item.devicePkid
      }
    },
    // 设备设置
    setDeviceForm () {
      let _this = this
      let datas = {
        storePkid: _this.setDevice.storePkid,
        devicePkid: _this.setDevice.devicePkid,
        userid: _this.setDevice.userid,
        type: _this.setDevice.type,
        isadmin: parseInt(_this.setDevice.isadmin)
      }
      _this.axios.post(this.GLOBAL.BASE_URL + '/storeOfDeviceOperate/confDeviceAdmin', datas, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.$message.success('操作成功')
          _this.setVisible = false
        } else {
          _this.$message.error(res.data.message)
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    //  使用情况
    getLockerInfo (index, row) {
      let _this = this
      _this.addVisible = true
      let storePkid = sessionStorage.getItem('storePkid')
      // let pkid = {storePkid: parseInt(storePkid)}
      _this.dailogTitleType = '使用情况'
      _this.idx = index
      const item = _this.deviceData[index]
      let data = {
        storePkid: parseInt(storePkid),
        devicePkid: item.devicePkid
      }
      _this.axios.post(this.GLOBAL.BASE_URL + '/storeOfDeviceOperate/getLockerInfo', data, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.LockerInfoData = res.data.data
        } else {
          _this.$message.error(res.data.message)
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    //  申请长租弹窗
    longLeaseModal (index, row) {
      let _this = this
      _this.editVisible = true
      _this.idx = index
      let storePkid = sessionStorage.getItem('storePkid')
      const item = _this.deviceData[index]
      let data = {
        storePkid: parseInt(storePkid),
        devicePkid: item.devicePkid
      }
      _this.axios.post(this.GLOBAL.BASE_URL + '/storeOfDeviceOperate/getLockerInfo', data, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.LockerInfoData = res.data.data
        } else {
          _this.$message.error(res.data.message)
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    //  申请长租确定
    longLease () {
      let _this = this
      let storePkid = sessionStorage.getItem('storePkid')
      let index = _this.idx
      const item = _this.deviceData[index]
      let data = {
        storePkid: parseInt(storePkid),
        devicePkid: item.devicePkid,
        userid: _this.form.userid,
        type: _this.form.type,
        begtime: _this.form.begtime,
        endtime: _this.form.endtime,
        number: _this.form.number + ''
      }
      _this.axios.post(this.GLOBAL.BASE_URL + '/storeOfDeviceOperate/longLease', data, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.$message.success('操作成功')
          _this.editVisible = false
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
</style>
