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
          <el-table-column prop="rechargeaCardOrderMoney" label="原价(元)" align="center"></el-table-column>
          <el-table-column prop="rechargeaCardOrderPayableMoney" label="应付款(元)" align="center"></el-table-column>
          <el-table-column prop="rechargeaCardOrderPayType" label="支付类型" align="center"></el-table-column>
          <el-table-column prop="rechargeaCardOrderPayStatus" label="支付状态" align="center" :formatter="payStatusTxt"></el-table-column>
          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="scope">
              <!--<el-button size="small" type="primary" @click="addOrderPayment(scope.$index, scope.row)">确认支付</el-button>-->
              <el-button size="small" type="primary" @click="orderPayment(scope.$index, scope.row)" v-if="scope.row.rechargeaCardOrderPayStatus === 0">确认支付</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--新增-->
      <el-dialog title="创建订单" :visible.sync="addVisible" width="30%" :close-on-click-modal="false">
        <el-form :model="cardForm" label-width="80px">
          <!--<el-form-item label="卡ID" >-->
            <!--<el-select v-model="cardForm.cardPkid" @change="getCode">-->
              <!--<el-option v-for="(item,index) in cardList" :key="index"  :label="item.cardPkid" :value="index"></el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <el-form-item label="储值卡ID">
            <el-select v-model="cardForm.rechargeaCardReleasePkid" @change="ReleaseCard">
              <el-option v-for="(item, index) in cardRelease" :key="item.rechargeaCardReleasePkid" :label="item.rechargeaCardReleasePkid" :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="会员ID">
            <el-select v-model="cardForm.memberPkid" @change="memberCode">
              <el-option v-for="(item, index) in memberList" :key="item.memberPkid" :label="item.memberPkid" :value="index" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单号">
            <el-input v-model="cardForm.rechargeaCardOrderNum"></el-input>
          </el-form-item>
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
      <!--确认支付提示框-->
      <el-dialog title="确认支付" :visible.sync="payentVisible" width="300px" :close-on-click-modal="false">
        <el-form :model="cardForm" label-width="80px">
          <el-form-item label="订单号">
            <span>{{cardForm.rechargeaCardOrderNum}}</span>
          </el-form-item>
          <el-form-item label="原价">
            <span>{{cardForm.rechargeaCardOrderMoney}}</span>
            <span>元</span>
          </el-form-item>
          <el-form-item label="应付价">
            <span>{{cardForm.rechargeaCardOrderPayableMoney}}</span>
            <span>元</span>
          </el-form-item>
          <el-form-item label="支付类型">
            <span>{{cardForm.rechargeaCardOrderPayType}}</span>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="payentVisible=false">取消</el-button>
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
      memberList: [],
      cardRelease: [],
      idx: -1,
      message: '',
      addVisible: false,
      payentVisible: false,
      disableVisible: false,
      dailogTitleType: '',
      selVal: '',
      cardPkcode: '',
      memberPkcode: '',
      rechargeaCardReleasePkcode: '',
      cardForm: {
        rechargeaCardOrderPayType: '',
        rechargeaCardOrderMoney: '',
        rechargeaCardOrderPayableMoney: '',
        memberPkid: '',
        rechargeaCardReleasePkid: '',
        rechargeaCardOrderNum: ''
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
    this.getMember()
    this.getCardRelease()
  },
  methods: {
    // 支付状态转文字
    payStatusTxt (val) {
      if (val.rechargeaCardOrderPayStatus === 0) {
        return '未支付'
      } else if (val.rechargeaCardOrderPayStatus === 1) {
        return '已支付'
      } else if (val.rechargeaCardOrderPayStatus === 2) {
        return '退款'
      }
    },
    // 列表数据
    getData () {
      let _this = this
      let storePkid = sessionStorage.getItem('storePkid')
      let pkid = {storePkid: parseInt(storePkid)}
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfCardOrderOperate/findCardOrderByStorePkid', pkid, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.cardOrderList = res.data.data
        } else {
          _this.$message.error('无操作权限')
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    // 获取储值卡列表
    getCardRelease () {
      let _this = this
      let storePkid = sessionStorage.getItem('storePkid')
      let pkid = {storePkid: parseInt(storePkid)}
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfCardReleaseOperate/findCardReleaseByStorePkid', pkid, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.cardRelease = res.data.data
        } else {
          _this.$message.error('没有操作权限')
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    // 获取会员列表
    getMember () {
      let _this = this
      let pkId = sessionStorage.getItem('storePkid')
      let storePkid = {
        storePkid: parseInt(pkId)
      }
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfMemberOperate/findMemberByStorePkid', storePkid, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.memberList = res.data.data
        } else {
          _this.$message.error(res.data.message)
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    // 获取会员code
    memberCode (index) {
      let _this = this
      const item = _this.memberList[index]
      _this.memberPkcode = item.memberPkcode
      _this.cardForm.memberPkid = item.memberPkid
    },
    // 获取储值卡code
    ReleaseCard (index) {
      let _this = this
      const item = _this.cardRelease[index]
      _this.rechargeaCardReleasePkcode = item.rechargeaCardReleasePkcode
      _this.cardForm.rechargeaCardReleasePkid = item.rechargeaCardReleasePkid
    },
    // 添加弹窗
    addModelOpen () {
      let _this = this
      _this.addVisible = true
      _this.editVisible = false
      _this.dailogTitleType = '添加'
    },
    // 完成订单
    orderPayment (index, row) {
      let _this = this
      _this.payentVisible = true
      _this.idx = index
      const item = _this.cardOrderList[index]
      _this.cardForm = {
        rechargeaCardOrderPayType: item.rechargeaCardOrderPayType,
        rechargeaCardOrderMoney: item.rechargeaCardOrderMoney,
        rechargeaCardOrderPayableMoney: item.rechargeaCardOrderPayableMoney,
        rechargeaCardOrderNum: item.rechargeaCardOrderNum
      }
    },
    //  添加
    addCardOrder () {
      let _this = this
      let storePkid = sessionStorage.getItem('storePkid')
      let storePkcode = sessionStorage.getItem('storePkcode')
      let formData = {
        rechargeaCardOrderPayType: parseInt(_this.cardForm.rechargeaCardOrderPayType),
        rechargeaCardOrderMoney: _this.cardForm.rechargeaCardOrderMoney,
        rechargeaCardOrderPayableMoney: _this.cardForm.rechargeaCardOrderPayableMoney,
        storePkid: parseInt(storePkid),
        storePkcode: storePkcode,
        memberPkid: parseInt(_this.cardForm.memberPkid),
        memberPkcode: _this.memberPkcode,
        rechargeaCardReleasePkid: parseInt(_this.cardForm.rechargeaCardReleasePkid),
        rechargeaCardReleasePkcode: _this.rechargeaCardReleasePkcode,
        rechargeaCardOrderNum: _this.cardForm.rechargeaCardOrderNum
      }
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfCardOrderOperate/addCardOrder', formData, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.cardOrderList = res.data.data
          _this.$message.success('添加成功')
          _this.getData()
          location.reload()
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
      let index = _this.idx
      const item = _this.cardOrderList[index]
      let payData = {
        rechargeaCardOrderPkid: item.rechargeaCardOrderPkid,
        rechargeaCardOrderPayStatus: item.rechargeaCardOrderPayStatus
      }
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfCardOrderOperate/confirmPay', payData, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.cardReleaseData = res.data.data
          _this.$message.success('操作成功')
          _this.getData()
          _this.payentVisible = false
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
