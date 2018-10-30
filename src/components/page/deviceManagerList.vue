<template>
    <div>
      <el-table :data="deviceManagerData" border style="width: 100%">
        <!--<el-table-column type="selection" width="55"></el-table-column>-->
        <el-table-column prop="devicePkid" label="pkid" align="center"></el-table-column>
        <el-table-column prop="branchName" label="商户" align="center"></el-table-column>
        <el-table-column prop="deviceTypeId" label="deviceTypeId" align="center"></el-table-column>
        <el-table-column prop="deviceVersion" label="deviceVersion" align="center"></el-table-column>
        <el-table-column prop="merchantName" label="设备名称" align="center"></el-table-column>
        <el-table-column prop="deviceType" label="类型" align="center"></el-table-column>
        <el-table-column prop="remark" label="remark" align="center"></el-table-column>
        <el-table-column prop="networkingStatus" label="networkingStatus" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button size="small" type="success" @click="getLockerInfo(scope.$index, scope.row)">使用情况</el-button>
            <el-button size="small" type="primary" @click="longLeaseModal(scope.$index, scope.row)">申请长租</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
</template>

<script>
export default {
  name: 'deviceManagerList',
  data () {
    return {
      deviceManagerData: []
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      let _this = this
      let storePkid = sessionStorage.getItem('storePkid')
      let pkid = {storePkid: parseInt(storePkid)}
      _this.axios.post(this.GLOBAL.BASE_URL + '/storeOfDeviceOperate/deviceAdminUserList', pkid, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.deviceManagerData = res.data.data
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
