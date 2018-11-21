<template>
    <div class="containers">
      <el-table :data="deviceManagerData" border style="width: 100%">
        <!--<el-table-column type="selection" width="55"></el-table-column>-->
        <!--<el-table-column prop="storePkid" label="门店ID" align="center"></el-table-column>-->
        <el-table-column prop="name" label="姓名" align="center"></el-table-column>
        <el-table-column prop="nikename" label="昵称" align="center"></el-table-column>
        <el-table-column prop="userAccountPhone" label="手机号" align="center"></el-table-column>
        <el-table-column prop="isadmin" label="管理员" align="center" :formatter="managerTxt"></el-table-column>
        <!--<el-table-column prop="userAccountType" label="userAccountType" align="center"></el-table-column>-->
        <!--<el-table-column label="操作" align="center" width="200">-->
          <!--<template slot-scope="scope">-->
            <!--<el-button size="small" type="success" @click="getLockerInfo(scope.$index, scope.row)">使用情况</el-button>-->
            <!--<el-button size="small" type="primary" @click="longLeaseModal(scope.$index, scope.row)">申请长租</el-button>-->
          <!--</template>-->
        <!--</el-table-column>-->
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
    // 管理员转文字
    managerTxt (val) {
      if (val.isadmin === 1) {
        return '是'
      } else if (val.isadmin === 0) {
        return '否'
      }
    },
    getData () {
      let _this = this
      let storePkid = sessionStorage.getItem('storePkid')
      let pkid = {storePkid: parseInt(storePkid)}
      _this.axios.post(this.GLOBAL.BASE_URL + '/storeOfDeviceOperate/deviceAdminUserList', pkid, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        let mes = res.data.message
        if (res.data.success === '200') {
          _this.deviceManagerData = res.data.data
        } else if (mes === '无操作权限') {
          this.$router.push('/login')
          sessionStorage.clear()
          // _this.$message.error('无操作权限')
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
