<template>
  <div>
    <div class="block">
      <el-row>
        <el-button class="addBtn" @click="addModelOpen()">创建课程订单</el-button>
      </el-row>
      <div class="handle-box">
      </div>
    </div>
    <div class="container">
      <span class="txt">手机号</span>
      <el-input v-model="phone" placeholder="请输入手机号" class="handle-input mr10"></el-input>
      <span class="txt">课程名称</span>
      <el-input v-model="course_name" placeholder="输入课程名称" class="handle-input mr10"></el-input>
      <span class="txt">开始时间</span>
      <el-date-picker type="date" placeholder="选择开始时间" v-model="start_time" value-format="yyyy-MM-dd"
                      style="width: 150px" class="mr10"></el-date-picker>
      <span class="txt">结束时间</span>
      <el-date-picker type="date" placeholder="选择结束时间" v-model="end_time" value-format="yyyy-MM-dd"
                      style="width: 150px" class="mr10"></el-date-picker>
      <el-button type="primary" icon="search" @click="search">搜索</el-button>
      <el-table :data="courseOrderList" border style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="courseOrderPkid" label="pkid" align="center" width="60"></el-table-column>
        <el-table-column prop="courseOrderCtime" label="创建时间" sortable align="center"></el-table-column>
        <!--<el-table-column prop="courseOrderNum" label="订单号" align="center"></el-table-column>-->
        <el-table-column prop="courseReleaseName" label="课程名称" align="center"></el-table-column>
        <el-table-column prop="storeName" label="门店名称" align="center"></el-table-column>
        <el-table-column prop="memberName" label="会员名称" align="center"></el-table-column>
        <el-table-column prop="memberPhone" label="手机号" align="center"></el-table-column>
        <el-table-column prop="courseOrderMoney" label="原价(元)" align="center"></el-table-column>
        <el-table-column prop="courseOrderPayableMoney" label="应付价(元)" align="center"></el-table-column>
        <el-table-column prop="courseOrderPayType" label="支付类型" align="center"
                         :formatter="paymentType"></el-table-column>
        <el-table-column prop="courseOrderPayStatus" label="支付状态" align="center"
                         :formatter="payStatusTxt"></el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="orderPayment(scope.$index, scope.row)"
                       v-if="scope.row.courseOrderPayStatus === 0">确认支付
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination center" v-if="this.pages>1">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"   :page-size="pageSize" layout="prev, pager, next" :total="total">
      </el-pagination>
      </div>
    </div>
    <!--新增-->
    <el-dialog title="课程订单" :visible.sync="addVisible" width="30%" :close-on-click-modal="false">
      <el-form :model="cardForm" label-width="100px">
        <el-form-item label="课程名称">
          <el-select v-model="cardForm.courseReleaseName" @change="storeCourse" filterable style="width: 100%">
            <el-option v-for="(item, index) in StoreCourseList" :key="item.courseReleasePkid"
                       :label="item.courseReleaseName" :value="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会员名称">
          <el-select v-model="cardForm.storeMemberName" @change="memberCode" filterable style="width: 100%">
            <el-option v-for="(item, index) in memberList" :key="item.memberPkid" :label="item.storeMemberName"
                       :value="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="原价">
          <div>
            <el-input v-model="cardForm.courseOrderMoney" type="number">
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
          <el-select v-model="cardForm.courseOrderPayType" style="width: 100%">
            <el-option v-for="item in payMentType" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="充值卡" v-if="cardForm.courseOrderPayType === 2">-->
        <!--<el-select v-model="cardForm.cardPkid" @change="memberCard">-->
        <!--<el-option v-for="(item, index) in memberCardList" :key="item.memberPkid" :label="item.memberPkid" :value="index" ></el-option>-->
        <!--</el-select>-->
        <!--</el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="addVisible=false">取消</el-button>
          <el-button type="primary" @click="addCardOrder">确定</el-button>
        </span>
    </el-dialog>
    <!--确认支付-->
    <el-dialog title="确认支付" :visible.sync="payentVisible" width="300px" :close-on-click-modal="false">
      <el-form :model="cardForm" label-width="100px">
        <el-form-item label="会员名称">
          <span>{{cardForm.storeMemberName}}</span>
          <!--<el-input v-model="cardForm.cardPkid"></el-input>-->
        </el-form-item>
        <el-form-item label="课程名称">
          <span>{{cardForm.fitnessCourseName}}</span>
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
      pageSize: 10,
      total: null,
      pages: null,
      currentPage: 1,
      phone: null,
      course_name: null,
      start_time: null,
      end_time: null,
      is_search: false,
      courseOrderList: [],
      tableDataEnd: [],
      filterTableDataEnd: [],
      cardList: [],
      memberList: [],
      memberCardList: [],
      StoreCourseList: [],
      idx: -1,
      message: '',
      addVisible: false,
      payentVisible: false,
      disableVisible: false,
      dailogTitleType: '',
      selVal: '',
      cardPkcode: '',
      memberPkcode: '',
      courseReleasePkcode: '',
      cardForm: {
        courseReleasePkid: null,
        courseOrderPayableMoney: null,
        courseOrderPayType: null,
        courseOrderMoney: null,
        cardPkid: null,
        discountPkid: null,
        memberPkid: null,
        memberPkcode: null,
        fitnessCourseName: null,
        storeMemberName: null
      },
      payMentType: [
        {
          value: 1,
          label: '微信'
        },
        {
          value: 2,
          label: '余额'
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
    // this.getCard()
    this.getMember()
    this.getStoreCourse()
  },
  computed: {
    data () {
      return this.courseOrderList.filter((d) => {
        let isDel = false
        for (let i = 0; i < this.del_list.length; i++) {
          if (d.memberPhone === this.del_list[i].memberPhone) {
            isDel = true
            break
          }
        }
        if (!isDel) {
          if ((d.memberPhone.indexOf(this.select_name) > -1 ||
            d.memberPhone.indexOf(this.select_name) > -1)
          ) {
            return d
          }
        }
      })
    }
  },
  methods: {
    // 分页导航
    handleCurrentChange (val) {
      let _this = this
      _this.currentPage = val
      let storePkid = sessionStorage.getItem('storePkid')
      let storeDate = {
        pageSize: _this.pageSize,
        pageNum: val,
        storePkid: parseInt(storePkid)
      }
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfCourseOrderOperate/findCourseOrderByStorePkid', storeDate, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        let mes = res.data.message
        if (res.data.success === '200') {
          _this.courseOrderList = res.data.data.data
          _this.total = res.data.data.total
          _this.pages = res.data.data.pages
        } else if (mes === '无操作权限') {
          this.$router.push('/login')
          sessionStorage.clear()
          // _this.$message.error('无操作权限')
        }
      }).catch((error) => {
        console.log(error)
      })
      // this.currentChangePage(this.courseOrderList)
    },
    handleSizeChange: function (size) {
      this.pages = size
      // this.getData()
      this.handleCurrentChange(this.pages)
    },
    // 分页
    currentChangePage (list) {
      let from = (this.currentPage - 1) * this.pages
      let to = this.currentPage * this.pages
      this.courseOrderList = []
      for (; from < to; from++) {
        if (list[from]) {
          this.courseOrderList.push(list[from])
        }
      }
    },
    search () {
      let _this = this
      _this.is_search = true
      let storePkid = sessionStorage.getItem('storePkid')
      if (_this.phone === '' || _this.phone === null) {
        _this.phone = null
      }
      if (_this.course_name === '' || _this.course_name === null) {
        _this.course_name = null
      }
      if (_this.start_time === '' || _this.start_time === null) {
        _this.start_time = null
      }
      if (_this.end_time === '' || _this.end_time === null) {
        _this.end_time = null
      }
      let searchData = {
        phone: _this.phone,
        fitnessCourseName: _this.course_name,
        begtime: _this.start_time,
        endtime: _this.end_time,
        storePkid: parseInt(storePkid)
      }
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfCourseOrderOperate/findCourseOrderByStorePkid', searchData, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.courseOrderList = res.data.data.data
          _this.total = res.data.data.total
          _this.pages = res.data.data.pages
          // _this.getData()
        } else {
          _this.$message.error('无操作权限')
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    // 支付类型转文字
    paymentType (val) {
      if (val.courseOrderPayType === 1) {
        return '微信支付'
      } else if (val.courseOrderPayType === 2) {
        return '余额'
      } else if (val.courseOrderPayType === 3) {
        return '免费'
      } else if (val.courseOrderPayType === 4) {
        return '刷卡'
      } else if (val.courseOrderPayType === 5) {
        return '现金'
      }
    },
    // 支付状态转文字
    payStatusTxt (val) {
      if (val.courseOrderPayStatus === 0) {
        return '未支付'
      } else if (val.courseOrderPayStatus === 1) {
        return '已支付'
      } else if (val.courseOrderPayStatus === 2) {
        return '退款'
      }
    },
    // 获取会员列表
    getMember () {
      let _this = this
      let pkId = sessionStorage.getItem('storePkid')
      let storePkid = {
        storePkid: parseInt(pkId)
      }
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfCourseOrderOperate/findStoreMemberList', storePkid, {
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
    // 门店下的发布课程列表
    getStoreCourse () {
      let _this = this
      let pkId = sessionStorage.getItem('storePkid')
      let storePkid = {
        storePkid: parseInt(pkId)
      }
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfCourseOrderOperate/findStoreCourseReleaseList', storePkid, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.StoreCourseList = res.data.data
        } else {
          _this.$message.error(res.data.message)
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    // 获取卡列表
    getCard () {
      let _this = this
      let Pkcode = sessionStorage.getItem('storePkid')
      let storePkid = {storePkid: parseInt(Pkcode)}
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfCardOperate/findCardByAgentPkid', storePkid, {
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
      let storeDate = {
        pageSize: _this.pageSize,
        pageNum: 1,
        storePkid: parseInt(storePkid)
      }
      // let pkid = {storePkid: parseInt(storePkid)}
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfCourseOrderOperate/findCourseOrderByStorePkid', storeDate, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.courseOrderList = res.data.data.data
          _this.total = res.data.data.total
          _this.pages = res.data.data.pages
        } else {
          _this.$message.error('无操作权限')
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    // 获取会员code
    memberCode (value) {
      let _this = this
      let index = value
      const item = _this.memberList[index]
      _this.memberPkcode = item.memberPkcode
      _this.cardForm.memberPkid = item.memberPkid
    },
    // 获取发布课程id
    storeCourse (value) {
      let _this = this
      let index = value
      const item = _this.StoreCourseList[index]
      _this.courseReleasePkid = item.courseReleasePkid
      _this.cardForm.courseReleasePkid = item.courseReleasePkid
      _this.courseReleasePkcode = item.courseReleasePkcode
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
        storeMemberName: item.memberName,
        fitnessCourseName: item.fitnessCourseName,
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
    // 获取会员的充值卡
    memberCard () {
      let _this = this
      let storePkid = sessionStorage.getItem('storePkid')
      let memberData = {
        storePkid: parseInt(storePkid),
        memberPkid: parseInt(_this.cardForm.memberPkid)
      }
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfCourseOrderOperate/findMemberRechargeaCardByMemberPkid', memberData, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.memberCardList = res.data.data
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    //  添加
    addCardOrder () {
      let _this = this
      let storePkid = sessionStorage.getItem('storePkid')
      let storePkcode = sessionStorage.getItem('storePkcode')
      let formData = {
        courseReleasePkid: parseInt(_this.cardForm.courseReleasePkid),
        courseReleasePkcode: _this.courseReleasePkcode,
        courseOrderPayType: parseInt(_this.cardForm.courseOrderPayType),
        courseOrderMoney: _this.cardForm.courseOrderMoney,
        courseOrderPayableMoney: _this.cardForm.courseOrderPayableMoney,
        storePkid: parseInt(storePkid),
        storePkcode: storePkcode,
        memberPkid: _this.cardForm.memberPkid,
        memberPkcode: _this.memberPkcode,
        cardPkid: parseInt(_this.cardForm.cardPkid)
      }
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfCourseOrderOperate/addCourseOrder', formData, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        console.log(res.data)
        if (res.data.success === '200') {
          _this.courseOrderList = res.data.data
          // _this.tableDataEnd = res.data.data
          _this.$message.success('添加成功')
          // _this.getData()
          _this.addVisible = false
          location.reload()
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
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfCourseOrderOperate/confirmPay', payData, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.courseOrderList = res.data.data
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
  .addBtn {
    background-color: #d71718;
    color: #fff;
    margin-bottom: 20px;
  }

  .handle-input {
    width: 150px;
    margin-bottom: 20px;
    display: inline-block;
  }
  .txt{
    font-size: 14px;
  }
  .mr10{
    margin-right: 20px;
  }
</style>
