<template>
  <div>
    <div class="block">
      <el-row>
        <el-button class="addBtn" @click="addModelOpen()">创建优惠券</el-button>
      </el-row>
    </div>
    <div class="container">
      <el-table :data="couponData" border style="width: 100%">
        <el-table-column prop="couponPkid" label="pkid" align="center"></el-table-column>
        <el-table-column prop="agentPkid" label="卡名称" align="center"></el-table-column>
        <el-table-column prop="couponContent" label="折扣内容" align="center"></el-table-column>
        <el-table-column prop="couponType" label="卡类型" align="center" :formatter="couponTypeTxt"></el-table-column>
        <!--<el-table-column label="操作" align="center">-->
          <!--<template slot-scope="scope">-->
            <!--<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
            <!--&lt;!&ndash;<el-button size="small" type="danger" @click="handleDel(scope.$index, scope.row)">删除</el-button>&ndash;&gt;-->
          <!--</template>-->
        <!--</el-table-column>-->
      </el-table>
    </div>
    <!--新增-->
    <el-dialog title="新增" :visible.sync="addVisible" width="30%">
      <el-form :model="form" label-width="80px">
        <el-form-item label="折扣类型">
          <el-select v-model="form.couponType" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="折扣内容">
          <el-input v-model="form.couponContent"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="addVisible=false">取消</el-button>
          <el-button type="primary" @click="addCoupon">确定</el-button>
        </span>
    </el-dialog>
    <!--&lt;!&ndash;删除&ndash;&gt;-->
    <!--<el-dialog title="温馨提示" :visible.sync="delVisible" width="300px" center>-->
    <!--<div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>-->
    <!--<span slot="footer" class="dialog-footer">-->
    <!--<el-button @click="delVisible = false">取 消</el-button>-->
    <!--<el-button type="primary" @click="deleteRow">确 定</el-button>-->
    <!--</span>-->
    <!--</el-dialog>-->
  </div>
</template>

<script>
export default {
  name: 'couponList',
  data () {
    return {
      couponData: [],
      idx: -1,
      addVisible: false,
      form: {
        couponType: '',
        couponContent: ''
      },
      options: [
        {
          value: 1,
          label: '满减'
        },
        {
          value: 2,
          label: '折扣'
        },
        {
          value: 3,
          label: '买赠'
        }
      ]
    }
  },
  created () {
    this.getData()
  },
  methods: {
    // 卡类型转文字
    couponTypeTxt (val) {
      if (val.couponType === 1) {
        return '满减'
      } else if (val.couponType === 2) {
        return '折扣'
      } else if (val.couponType === 3) {
        return '买赠'
      }
    },
    // 获取全部优惠券
    getData () {
      let _this = this
      let agentId = sessionStorage.getItem('agentPkid')
      let pkid = {agentPkid: parseInt(agentId)}
      _this.axios.post(_this.GLOBAL.BASE_URL + '/agentOfCouponOperate/findCouponByAgentPkid', pkid, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        let mes = res.data.message
        if (res.data.success === '200') {
          _this.couponData = res.data.data
        } else if (mes === '无操作权限') {
          this.$router.push('/login')
          sessionStorage.clear()
          // _this.$message.error('无操作权限')
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    //  新增优惠券弹窗
    addModelOpen () {
      let _this = this
      _this.addVisible = true
    },
    //  添加
    addCoupon () {
      let _this = this
      let agentPkid = sessionStorage.getItem('agentPkid')
      let code = sessionStorage.getItem('agentPkcode')
      let datas = {
        agentPkid: parseInt(agentPkid),
        agentPkcode: code,
        couponType: parseInt(_this.form.couponType),
        couponContent: _this.form.couponContent
      }
      _this.axios.post(_this.GLOBAL.BASE_URL + '/agentOfCouponOperate/addDiscount', datas, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.couponData = res.data.data
          _this.$message.success('操作成功')
          _this.addVisible = false
        } else {
          _this.$message.error('操作失败')
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
