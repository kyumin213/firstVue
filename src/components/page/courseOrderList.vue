<template>
    <div>
      <div class="block">
        <el-row>
          <el-button class="addBtn" @click="addModelOpen()">创建课程订单</el-button>
        </el-row>
      </div>
      <div class="container">
        <el-table :data="courseOrderList" border style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="courseOrderPkid" label="pkid" align="center" width="60"></el-table-column>
          <el-table-column prop="courseOrderCtime" label="创建时间" sortable align="center"></el-table-column>
          <el-table-column prop="storePkid" label="门店ID" align="center"></el-table-column>
          <el-table-column prop="courseOrderMoney" label="原价(元)" align="center"></el-table-column>
          <el-table-column prop="courseOrderPayableMoney" label="应付价(月)" align="center"></el-table-column>
          <el-table-column prop="courseOrderPayType" label="支付类型" align="center" :formatter="paymentType"></el-table-column>
          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="scope">
              <el-button size="small" type="primary" @click="orderPayment(scope.$index, scope.row)">确认支付</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--新增-->
      <el-dialog title="新增" :visible.sync="addVisible" width="30%">
        <el-form :model="cardForm" label-width="80px">
          <el-form-item label="卡ID" >
            <el-select v-model="cardForm.cardPkid">
              <el-option v-for="item in cardList" :key="item.cardPkid"  :label="item.cardPkid" :value="item.cardPkid"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="原价">
            <div>
              <el-input  v-model="cardForm.courseOrderMoney" type="number">
                <template slot="append">元</template>
              </el-input>
            </div>
          </el-form-item>
          <el-form-item label="应付价">
            <el-input v-model="cardForm.courseOrderPayableMoney">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="支付类型">
            <el-select v-model="cardForm.courseOrderPayType">
              <el-option v-for="item in payMentType" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addVisible=false">取消</el-button>
          <el-button type="primary" @click="addCardOrder">确定</el-button>
        </span>
      </el-dialog>
      <!--确认支付-->
      <el-dialog title="确认支付" :visible.sync="payentVisible" width="300px" center>
        <el-form :model="cardForm" label-width="80px">
          <el-form-item label="卡ID">
            <span>{{cardForm.cardPkid}}</span>
            <!--<el-input v-model="cardForm.cardPkid"></el-input>-->
          </el-form-item>
          <el-form-item label="原价">
            <span>{{cardForm.courseOrderMoney}}</span>
            <span>元</span>
          </el-form-item>
          <el-form-item label="应付价">
            <span>{{cardForm.courseOrderPayableMoney}}</span>
            <span>元</span>
          </el-form-item>
          <el-form-item label="支付类型">
            <span>{{cardForm.courseOrderPayType}}</span>
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
  name: 'courseOrderList',
  data () {
    return {
      courseOrderList: [],
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
        courseOrderPayableMoney: '',
        courseOrderPayType: '',
        courseOrderMoney: '',
        cardPkid: '',
        discountPkid: ''
      },
      payMentType: [
        {
          value: 1,
          label: '微信'
        },
        {
          value: 2,
          label: '充值卡'
        },
        {
          value: 3,
          label: '免费'
        },
        {
          value: 4,
          label: '刷卡'
        },
        {
          value: 5,
          label: '现金'
        }
      ]
    }
  },
  created () {
    this.getData()
    this.getCard()
  },
  methods: {
    // 支付类型转文字
    paymentType (val) {
      if (val.courseOrderPayType === 1) {
        return '微信支付'
      } else if (val.courseOrderPayType === 2) {
        return '充值卡'
      } else if (val.courseOrderPayType === 3) {
        return '免费'
      } else if (val.courseOrderPayType === 4) {
        return '刷卡'
      } else if (val.courseOrderPayType === 5) {
        return '现金'
      }
    },
    // 获取卡列表
    getCard () {
      let _this = this
      let storePkid = sessionStorage.getItem('storePkid')
      let pkid = {storePkid: parseInt(storePkid)}
      _this.axios.post('/api/agentOfCourseReleaseOperate/cardList', pkid, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.cardList = res.data.data
        } else {
          _this.$message.error('没有操作权限')
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    // 列表数据
    getData () {
      let _this = this
      let storePkid = sessionStorage.getItem('storePkid')
      let pkid = {storePkid: parseInt(storePkid)}
      _this.axios.post('/api/agentOfCourseOrderOperate/findCourseOrderByStorePkid', pkid, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.courseOrderList = res.data.data
        } else {
          _this.$message.error('没有操作权限')
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    // 添加弹窗
    addModelOpen () {
      let _this = this
      _this.addVisible = true
      _this.editVisible = false
      _this.dailogTitleType = '添加'
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
      _this.idx = index
      const item = _this.courseOrderList[index]
      _this.cardForm = {
        cardPkid: item.cardPkid,
        courseOrderPayType: item.courseOrderPayType,
        courseOrderMoney: item.courseOrderMoney,
        courseOrderPayableMoney: item.courseOrderPayableMoney
      }
      if (_this.cardForm.courseOrderPayType === 1) {
        _this.cardForm.courseOrderPayType = '微信'
      } else if (_this.cardForm.courseOrderPayType === 2) {
        _this.cardForm.courseOrderPayType = '充值卡'
      } else if (_this.cardForm.courseOrderPayType === 3) {
        _this.cardForm.courseOrderPayType = '免费'
      } else if (_this.cardForm.courseOrderPayType === 4) {
        _this.cardForm.courseOrderPayType = '刷卡'
      } else if (_this.cardForm.courseOrderPayType === 5) {
        _this.cardForm.courseOrderPayType = '现金'
      }
    },
    //  添加
    addCardOrder () {
      let _this = this
      let storePkid = sessionStorage.getItem('storePkid')
      let storePkcode = sessionStorage.getItem('storePkcode')
      let formData = {
        courseReleasePkid: 1,
        courseReleasePkcode: 'lukxvx8x',
        courseOrderPayType: parseInt(_this.cardForm.courseOrderPayType),
        courseOrderMoney: _this.cardForm.courseOrderMoney,
        courseOrderPayableMoney: _this.cardForm.courseOrderPayableMoney,
        storePkid: parseInt(storePkid),
        storePkcode: storePkcode,
        memberPkid: 1,
        memberPkcode: '3wv48or1',
        cardPkid: parseInt(_this.cardForm.cardPkid),
        discountPkid: 1
      }
      _this.axios.post('/api/agentOfCourseOrderOperate/addCourseOrder', formData, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.courseOrderList = res.data.data
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
      let index = _this.idx
      const item = _this.courseOrderList[index]
      let payData = {
        courseOrderPkid: item.courseOrderPkid,
        courseOrderPayStatus: item.courseOrderPayStatus
      }
      _this.axios.post('/api/agentOfCourseOrderOperate/confirmPay', payData, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.courseOrderList = res.data.data
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
