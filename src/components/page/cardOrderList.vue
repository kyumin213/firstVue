<template>
    <div>
      <div class="block">
        <el-row>
          <el-button class="addBtn" @click="addModelOpen()">创建充值卡订单</el-button>
        </el-row>
      </div>
      <div class="container">
        <el-table :data="cardOrderList" border style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="rechargeaCardReleasePkid" label="pkid" align="center" width="60"></el-table-column>
          <el-table-column prop="storePkid" label="门店ID" align="center"></el-table-column>
          <!--<el-table-column prop="rechargeaCardReleaseBegtime" label="开始时间" sortable align="center"></el-table-column>-->
          <!--<el-table-column prop="rechargeaCardReleaseEndtime" label="结束时间" sortable align="center"></el-table-column>-->
          <el-table-column prop="rechargeaCardReleaseMoney" label="售价(元)" align="center"></el-table-column>
          <el-table-column prop="rechargeaCardReleaseTimeLength" label="有效期(月)" align="center"></el-table-column>
          <el-table-column prop="rechargeaCardReleaseTotalMoney" label="总金额(元)" align="center"></el-table-column>
          <el-table-column prop="rechargeaCardReleaseCtime" label="创建时间" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="scope">
              <el-button size="small" type="primary" @click="addOrderPayment(scope.$index, scope.row)">确认支付</el-button>
              <el-button size="small" type="success" @click="orderPayment(scope.$index, scope.row)">完成支付</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--新增-->
      <el-dialog title="确认支付" :visible.sync="addVisible" width="30%">
        <el-form :model="cardForm" label-width="80px">
          <!--<el-form-item label="卡ID" >-->
            <!--<el-select v-model="cardForm.cardPkid" @change="getCode">-->
              <!--<el-option v-for="(item,index) in cardList" :key="index"  :label="item.cardPkid" :value="index"></el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <el-form-item label="原价">
            <div>
              <el-input  v-model="cardForm.rechargeaCardOrderMoney" type="number">
                <template slot="append">元</template>
              </el-input>
            </div>
          </el-form-item>
          <el-form-item label="应付价">
            <el-input v-model="cardForm.rechargeaCardOrderPayableMoney">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="支付类型">
            <el-select v-model="cardForm.rechargeaCardOrderPayType">
              <el-option v-for="item in payMentType" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addVisible=false">取消</el-button>
          <el-button type="primary" @click="addCardOrder">确定</el-button>
        </span>
      </el-dialog>
      <!--禁用提示框-->
      <el-dialog title="温馨提示" :visible.sync="payentVisible" width="300px" center>
        <div class="del-dialog-cnt">是否支付该订单</div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="disableVisible=false">取消</el-button>
        <el-button type="primary" @click="payment">确定</el-button>
      </span>
      </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'cardOrderList',
  data () {
    return {
      cardOrderList: [],
      cardList: [],
      idx: -1,
      message: '',
      addVisible: false,
      payentVisible: false,
      disableVisible: false,
      dailogTitleType: '',
      selVal: '',
      cardPkcode: '',
      cardForm: {
        rechargeaCardOrderPayType: '',
        rechargeaCardOrderMoney: '',
        rechargeaCardOrderPayableMoney: ''
      },
      payMentType: [
        {
          value: 1,
          label: '微信'
        },
        {
          value: 2,
          label: '免费'
        },
        {
          value: 3,
          label: '刷卡'
        },
        {
          value: 4,
          label: '现金'
        }
      ]
    }
  },
  created () {
    this.getData()
  },
  methods: {
    // 列表数据
    getData () {
      let _this = this
      let storePkid = sessionStorage.getItem('storePkid')
      let pkid = {storePkid: parseInt(storePkid)}
      _this.axios.post('/api/agentOfCardOrderOperate/findCardOrderByStorePkid', pkid, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.cardOrderList = res.data.data
        } else {
          _this.$message.error('没有操作权限')
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    // 确认订单弹窗
    addOrderPayment (index, row) {
      let _this = this
      _this.addVisible = true
    },
    // 完成订单
    orderPayment (index, row) {
      let _this = this
      _this.payentVisible = true
    },
    //  添加
    addCardOrder () {
      let _this = this
      let storePkid = sessionStorage.getItem('storePkid')
      let storePkcode = sessionStorage.getItem('storePkcode')
      let index = _this.idx
      const item = _this.cardOrderList[index]
      let formData = {
        rechargeaCardReleasePkid: item.rechargeaCardReleasePkid,
        rechargeaCardReleasePkcode: item.rechargeaCardReleasePkcode,
        rechargeaCardOrderPayType: parseInt(_this.cardForm.rechargeaCardOrderPayType),
        rechargeaCardOrderMoney: _this.cardForm.rechargeaCardOrderMoney,
        rechargeaCardOrderPayableMoney: _this.cardForm.rechargeaCardOrderPayableMoney,
        storePkid: parseInt(storePkid),
        storePkcode: storePkcode,
        memberPkid: 1,
        memberPkcode: '3wv48or1'
      }
      _this.axios.post('/api/agentOfCardOrderOperate/addCardOrder', formData, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.cardOrderList = res.data.data
          _this.$message.success('添加成功')
          _this.getData()
          _this.addVisible = false
        } else {
          _this.$message.error(res.data.message)
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    //  确认支付
    payment () {
      let _this = this
      let payData = {
        rechargeaCardOrderPkid: _this.rechargeaCardOrderPkid,
        rechargeaCardOrderPayStatus: _this.rechargeaCardOrderPayStatus
      }
      _this.axios.post('/api/agentOfCardOrderOperate/confirmPay', payData, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.cardReleaseData = res.data.data
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
