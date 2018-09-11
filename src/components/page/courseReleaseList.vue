<template>
    <div class="table">
      <div class="block">
        <el-row>
          <el-button class="addBtn" @click="addModelOpen()">创建储值卡</el-button>
        </el-row>
      </div>
      <div class="container">
        <el-table :data="courseReleaseData" border style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="courseReleasePkid" label="pkid" align="center" width="60"></el-table-column>
          <el-table-column prop="courseReleaseBegtime" label="开始时间" sortable align="center"></el-table-column>
          <el-table-column prop="courseReleaseEndtime" label="结束时间" sortable align="center"></el-table-column>
          <el-table-column prop="courseReleaseTimeLength" label="有效期" align="center"></el-table-column>
          <el-table-column prop="courseReleaseMaxNum" label="容纳人数" align="center"></el-table-column>
          <el-table-column prop="courseReleaseMoney" label="原价" align="center"></el-table-column>
          <el-table-column prop="courseReleaseTotalHour" label="总课时" align="center"></el-table-column>
          <el-table-column prop="courseReleaseOneHourMoney" label="单价" align="center"></el-table-column>
          <el-table-column prop="courseReleaseTotalHourMoney" label="总价" align="center"></el-table-column>
          <el-table-column prop="courseReleaseOneHour" label="单次课时时间" align="center"></el-table-column>
          <el-table-column prop="fitnessCourseType" label="课程类型" align="center" :formatter="courseTypeTxt"></el-table-column>
          <el-table-column prop="courseReleaseCardStatus" label="发布状态" align="center" :formatter="disableTxt"></el-table-column>
          <el-table-column prop="courseReleasePut" label="上下架状态" align="center" :formatter="putTxt"></el-table-column>
          <el-table-column label="操作" align="center" width="250">
            <template slot-scope="scope">
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="small" type="info" @click="disableStoreShow(scope.$index, scope.row)"
                         v-if="scope.row.courseReleaseCardStatus===1">取消发布
              </el-button>
              <el-button size="small" type="primary" v-else-if="scope.row.courseReleaseCardStatus===0"
                         @click="disableStoreShow(scope.$index, scope.row)">发布
              </el-button>
              <el-button size="small" type="info" @click="putModelShow(scope.$index, scope.row)"
                         v-if="scope.row.courseReleasePut===1">下架
              </el-button>
              <el-button size="small" type="primary" v-else-if="scope.row.courseReleasePut===0"
                         @click="putModelShow(scope.$index, scope.row)">上架
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--新增-->
      <el-dialog :title="dailogTitleType" :visible.sync="addVisible" width="30%">
        <el-form :model="courseForm" label-width="120px">
          <el-form-item label="课程类型">
            <el-select placeholder="请选择" v-model="courseForm.fitnessCourseType">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="教练ID">
            <el-select placeholder="请选择" v-model="courseForm.storeCoachPkid" @change="getCode">
              <el-option v-for="(item, index) in coachList" :key="index" :label="item.storeCoachPkid" :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间">
            <el-date-picker type="date" placeholder="选择日期" v-model="courseForm.courseReleaseBegtime" value-format="yyyy-MM-dd"
                            style="width: 100%;">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker type="date" placeholder="选择日期" v-model="courseForm.courseReleaseEndtime" value-format="yyyy-MM-dd"
                            style="width: 100%;">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="人数">
            <div>
              <el-input  v-model="courseForm.courseReleaseMaxNum" type="number">
                <template slot="append">人</template>
              </el-input>
            </div>
          </el-form-item>
          <el-form-item label="原价">
            <el-input v-model="courseForm.courseReleaseMoney">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="是否支持折扣卡">
            <el-radio-group v-model="courseForm.courseReleaseCardStatus" size="medium">
              <el-radio-button label="0" >不支持</el-radio-button>
              <el-radio-button label="1">支持</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="卡ID" >
            <el-select v-model="courseForm.cardPkid">
              <el-option v-for="item in cardList" :key="item.cardPkid"  :label="item.cardPkid" :value="item.cardPkid"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="是否支持优惠券">
            <el-radio-group v-model="courseForm.courseReleaseDiscountStatus" size="medium">
              <el-radio-button label="0" >不支持</el-radio-button>
              <el-radio-button label="1">支持</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="总课时">
            <el-input v-model="courseForm.courseReleaseTotalHour">
              <template slot="append">节</template>
            </el-input>
          </el-form-item>
          <el-form-item label="总价">
            <el-input v-model="courseForm.courseReleaseTotalHourMoney">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="每个课时时间">
            <el-input v-model="courseForm.courseReleaseOneHour">
              <template slot="append">小时</template>
            </el-input>
          </el-form-item>
          <el-form-item label="课时单价">
            <el-input v-model="courseForm.courseReleaseOneHourMoney">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="有效期">
            <el-input v-model="courseForm.courseReleaseTimeLength">
              <template slot="append">月</template>
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addVisible=false">取消</el-button>
          <el-button type="primary" @click="addCard" v-if="!editVisible">确定</el-button>
          <el-button type="primary" @click="editCard" v-else>确定</el-button>
        </span>
      </el-dialog>
      <!--禁用提示框-->
      <el-dialog title="温馨提示" :visible.sync="disableVisible" width="300px" center>
        <div class="del-dialog-cnt">{{message}}</div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="disableVisible=false">取消</el-button>
        <el-button type="primary" @click="disableStore" v-if="!putShow">确定</el-button>
        <el-button type="primary" @click="cardReleasePut" v-else>确定</el-button>
      </span>
      </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'courseReleaseList',
  data () {
    return {
      courseReleaseData: [],
      cardList: [],
      coachList: [],
      idx: -1,
      message: '',
      addVisible: false,
      editVisible: false,
      delVisible: false,
      disableVisible: false,
      putShow: false,
      dailogTitleType: '',
      courseForm: {
        courseReleaseBegtime: '',
        courseReleaseEndtime: '',
        courseReleaseMaxNum: '',
        courseReleaseMoney: '',
        courseReleaseCardStatus: '',
        courseReleaseDiscountStatus: '',
        discountPkid: '',
        courseReleaseTotalHour: '',
        courseReleaseTotalHourMoney: '',
        courseReleaseOneHour: '',
        courseReleaseOneHourMoney: '',
        courseReleaseTimeLength: '',
        cardPkid: '',
        storeCoachPkid: '',
        storeCoachPkcode: ''
      },
      options: [
        {
          value: 1,
          label: '团操'
        },
        {
          value: 2,
          label: '私教'
        }
      ]
    }
  },
  created () {
    this.getData()
    this.getCard()
    this.getCoach()
  },
  methods: {
    // 课程类型转文字
    courseTypeTxt (val) {
      if (val.fitnessCourseType === 1) {
        return '团操'
      } else if (val.fitnessCourseType === 2) {
        return '私教'
      }
    },
    // 发布状态文字
    disableTxt (val) {
      if (val.courseReleaseCardStatus === 0) {
        return '失效'
      } else if (val.courseReleaseCardStatus === 1) {
        return '有效'
      }
    },
    // 上下架状态
    putTxt (val) {
      if (val.courseReleasePut === 0) {
        return '下架'
      } else if (val.courseReleasePut === 1) {
        return '上架'
      }
    },
    // 获取code
    getCode (value) {
      let _this = this
      let index = value
      let item = _this.coachList[index]
      let code = item.storeCoachPkcode
      _this.courseForm.storeCoachPkcode = code
      _this.courseForm.storeCoachPkid = item.storeCoachPkid
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
    // 获取教练
    getCoach () {
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
        } else {
          _this.$message.error(res.data.message)
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
      _this.axios.post('/api/agentOfCourseReleaseOperate/findCourseReleaseByStorePkid', pkid, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.courseReleaseData = res.data.data
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
    // 编辑弹窗
    handleEdit (index, row) {
      let _this = this
      _this.idx = index
      _this.addVisible = true
      _this.editVisible = true
      _this.dailogTitleType = '编辑'
      const item = _this.courseReleaseData[index]
      _this.courseForm = {
        fitnessCourseType: item.fitnessCourseType,
        courseReleaseBegtime: item.courseReleaseBegtime,
        courseReleaseEndtime: item.courseReleaseEndtime,
        courseReleaseMaxNum: item.courseReleaseMaxNum,
        courseReleaseMoney: item.courseReleaseMoney,
        courseReleaseCardStatus: item.courseReleaseCardStatus,
        courseReleaseDiscountStatus: item.courseReleaseDiscountStatus,
        courseReleaseTotalHour: item.courseReleaseTotalHour,
        courseReleaseTotalHourMoney: item.courseReleaseTotalHourMoney,
        courseReleaseOneHour: item.courseReleaseOneHour,
        courseReleaseOneHourMoney: item.courseReleaseOneHourMoney,
        courseReleaseTimeLength: item.courseReleaseTimeLength,
        storeCoachPkid: item.storeCoachPkid,
        storeCoachPkcode: item.storeCoachPkcode,
        cardPkid: item.cardPkid
      }
    },
    // 卡发布弹窗
    disableStoreShow (index, row) {
      let _this = this
      _this.putShow = false
      let item = _this.courseReleaseData[index]
      let agentDis = item.courseReleaseCardStatus
      let pkid = item.courseReleasePkid
      _this.courseReleasePkid = pkid
      if (agentDis === 0) {
        _this.message = '是否发布该课程？'
        _this.courseReleaseCardStatus = 1
      } else {
        _this.message = '是否取消发布该课程？'
        _this.courseReleaseCardStatus = 0
      }
      this.disableVisible = true
    },
    // 上下架弹窗
    putModelShow (index, row) {
      let _this = this
      _this.putShow = true
      let item = _this.courseReleaseData[index]
      let agentDis = item.courseReleasePut
      let pkid = item.courseReleasePkid
      _this.courseReleasePkid = pkid
      if (agentDis === 0) {
        _this.message = '是否上架该课程？'
        _this.courseReleasePut = 1
      } else {
        _this.message = '是否下架该课程？'
        _this.courseReleasePut = 0
      }
      this.disableVisible = true
    },
    // 删除弹窗
    handleDel (index, row) {
      let _this = this
      _this.idx = index
      _this.delVisible = true
    },
    //  添加
    addCard () {
      let storePkid = sessionStorage.getItem('storePkid')
      let storePkcode = sessionStorage.getItem('storePkcode')
      let _this = this
      let formData = {
        courseReleaseBegtime: _this.courseForm.courseReleaseBegtime,
        courseReleaseEndtime: _this.courseForm.courseReleaseEndtime,
        courseReleaseMaxNum: _this.courseForm.courseReleaseMaxNum,
        courseReleaseMoney: _this.courseForm.courseReleaseMoney,
        courseReleaseOneHourMoney: _this.courseForm.courseReleaseOneHourMoney,
        courseReleaseCardStatus: parseInt(_this.courseForm.courseReleaseCardStatus),
        courseReleaseDiscountStatus: parseInt(_this.courseForm.courseReleaseDiscountStatus),
        courseReleaseTotalHour: parseInt(_this.courseForm.courseReleaseTotalHour),
        courseReleaseOneHour: parseInt(_this.courseForm.courseReleaseOneHour),
        courseReleaseTimeLength: parseInt(_this.courseForm.courseReleaseTimeLength),
        courseReleaseTotalHourMoney: _this.courseForm.courseReleaseTotalHourMoney,
        discountPkid: 1,
        storePkid: parseInt(storePkid),
        storePkcode: storePkcode,
        cardPkid: parseInt(_this.courseForm.cardPkid),
        storeCoachPkid: parseInt(_this.courseForm.storeCoachPkid),
        storeCoachPkcode: _this.courseForm.storeCoachPkcode,
        fitnessCoursePkid: 10,
        fitnessCoursePkcode: '6cwbjka8',
        fitnessCourseType: parseInt(_this.courseForm.fitnessCourseType)
      }
      _this.axios.post('/api/agentOfCourseReleaseOperate/addCourseRelease', formData, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.courseReleaseData = res.data.data
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
    //  编辑
    editCard () {
      let _this = this
      let index = _this.idx
      const item = _this.courseReleaseData[index]
      let editData = {
        courseReleasePkid: item.courseReleasePkid,
        courseReleaseBegtime: _this.courseForm.courseReleaseBegtime,
        courseReleaseEndtime: _this.courseForm.courseReleaseEndtime,
        courseReleaseMaxNum: _this.courseForm.courseReleaseMaxNum,
        courseReleaseMoney: _this.courseForm.courseReleaseMoney,
        courseReleaseOneHourMoney: _this.courseForm.courseReleaseOneHourMoney,
        courseReleaseCardStatus: parseInt(_this.courseForm.courseReleaseCardStatus),
        courseReleaseDiscountStatus: parseInt(_this.courseForm.courseReleaseDiscountStatus),
        courseReleaseTotalHour: parseInt(_this.courseForm.courseReleaseTotalHour),
        courseReleaseOneHour: parseInt(_this.courseForm.courseReleaseOneHour),
        courseReleaseTimeLength: parseInt(_this.courseForm.courseReleaseTimeLength),
        courseReleaseTotalHourMoney: _this.courseForm.courseReleaseTotalHourMoney,
        discountPkid: 1,
        cardPkid: parseInt(_this.courseForm.cardPkid),
        storeCoachPkid: parseInt(_this.courseForm.storeCoachPkid),
        storeCoachPkcode: _this.courseForm.storeCoachPkcode,
        fitnessCoursePkid: 10,
        fitnessCoursePkcode: '6cwbjka8',
        fitnessCourseType: parseInt(_this.courseForm.fitnessCourseType)
      }
      _this.axios.post('/api/agentOfCourseReleaseOperate/updateCourseRelease', editData, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.courseReleaseData = res.data.data
          _this.$message.success('修改成功')
          _this.addVisible = false
          _this.getData()
        } else {
          _this.$message.error(res.data.message)
        }
      }).catch((error) => {
        _this.$message.error(error)
      })
    },
    //  卡发布
    disableStore () {
      let _this = this
      let disableData = {
        courseReleasePkid: _this.courseReleasePkid,
        courseReleaseCardStatus: _this.courseReleaseCardStatus
      }
      _this.axios.post('/api/agentOfCourseReleaseOperate/configInvalidCourseRelease', disableData, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.courseReleaseData = res.data.data
          _this.$message.success('操作成功')
          _this.getData()
          _this.disableVisible = false
        } else {
          _this.$message.error(res.data.message)
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    //  上下架
    cardReleasePut () {
      let _this = this
      let disableData = {
        courseReleasePkid: _this.courseReleasePkid,
        courseReleasePut: _this.courseReleasePut
      }
      _this.axios.post('/api/agentOfCourseReleaseOperate/configCourseReleasePut', disableData, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.courseReleaseData = res.data.data
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
