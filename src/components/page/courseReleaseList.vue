<template>
    <div>
      <div class="block">
        <el-row>
          <el-button class="addBtn" @click="addModelOpen()">创建课程</el-button>
        </el-row>
      </div>
      <div class="containers">
        <span class="txt">课程名称</span>
        <el-input v-model="course_name" placeholder="请输入课程名称" class="handle-input mr10"></el-input>
        <span class="txt">教练名称</span>
        <el-input v-model="coach_name" placeholder="请输入教练名称" class="handle-input mr10"></el-input>
        <span class="txt">创建开始时间</span>
        <el-date-picker type="datetime" placeholder="选择开始时间" v-model="start_time" value-format="yyyy-MM-dd"
                        style="width: 200px" class="mr10"></el-date-picker>
        <span class="txt">结束时间</span>
        <el-date-picker type="datetime" placeholder="选择结束时间" v-model="end_time" value-format="yyyy-MM-dd"
                        style="width: 200px" class="mr10"></el-date-picker>
        <el-button type="primary" icon="search" @click="search">搜索</el-button>
        <el-table :data="courseReleaseData" border style="width: 100%">
          <!--<el-table-column type="selection" width="55"></el-table-column>-->
          <el-table-column prop="courseReleasePkid" label="pkid" align="center" width="55"></el-table-column>
          <el-table-column prop="courseReleaseName" label="课程名称" align="center"></el-table-column>
          <el-table-column prop="storeCoachNikename" label="教练昵称" align="center"></el-table-column>
          <el-table-column prop="courseReleaseBegtime" label="开始时间" sortable align="center"></el-table-column>
          <el-table-column prop="courseReleaseEndtime" label="结束时间" sortable align="center"></el-table-column>
          <el-table-column prop="courseReleaseTimeLength" label="有效期(月)" align="center"></el-table-column>
          <!--<el-table-column prop="courseReleaseMaxNum" label="容纳人数" align="center"></el-table-column>-->
          <el-table-column prop="courseReleaseMoney" label="原价(元)" align="center"></el-table-column>
          <el-table-column prop="courseReleaseTotalHour" label="总课时" align="center"></el-table-column>
          <el-table-column prop="courseReleaseOneHourMoney" label="单价(元)" align="center"></el-table-column>
          <el-table-column prop="courseReleaseTotalHourMoney" label="总价(元)" align="center"></el-table-column>
          <!--<el-table-column prop="courseReleaseOneHour" label="单次课时时间" align="center"></el-table-column>-->
          <el-table-column prop="fitnessCourseType" label="课程类型" align="center" :formatter="courseTypeTxt"></el-table-column>
          <el-table-column prop="courseReleaseStatus" label="发布状态" align="center" :formatter="disableTxt"></el-table-column>
          <el-table-column prop="courseReleasePut" label="上下架状态" align="center" :formatter="putTxt"></el-table-column>
          <el-table-column prop="courseReleaseIsplan" label="排课状态" align="center" :formatter="planTxt"></el-table-column>
          <el-table-column label="操作" align="center" width="200">
            <template slot-scope="scope">
              <!--<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
              <el-button size="small" type="info" @click="disableStoreShow(scope.$index, scope.row)"
                         v-if="scope.row.courseReleaseStatus===1">取消发布
              </el-button>
              <el-button size="small" type="primary" v-else-if="scope.row.courseReleaseStatus===0"
                         @click="disableStoreShow(scope.$index, scope.row)">发布
              </el-button>
              <el-button size="small" type="info" @click="putModelShow(scope.$index, scope.row)"
                         v-if="scope.row.courseReleasePut===1">下架
              </el-button>
              <el-button size="small" type="primary" v-else-if="scope.row.courseReleasePut===0"
                         @click="putModelShow(scope.$index, scope.row)">上架
              </el-button>
              <el-button size="small" style="margin-top: 8px" type="primary" v-if="scope.row.courseReleaseIsplan===0 && scope.row.fitnessCourseType === 1"
                         @click="coursePlanShow(scope.$index, scope.row)">排课
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="paginations center" v-if="this.pages>1">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"   :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
      <!--新增-->
      <el-dialog :title="dailogTitleType" :visible.sync="addVisible" width="30%" :close-on-click-modal="false">
        <el-form :model="courseForm" ref="courseForm" label-width="120px" :rules="rules" class="demo-ruleForm" status-icon>
          <el-form-item label="发布名称" prop="courseReleaseName">
            <el-input v-model="courseForm.courseReleaseName"></el-input>
          </el-form-item>
          <el-form-item label="课程ID" prop="fitnessCoursePkid">
            <!--<el-input v-model="courseForm.courseReleaseName"></el-input>-->
            <el-select placeholder="请选择" v-model="courseForm.fitnessCourseName" @change="getCourse" filterable style="width: 100%">
              <el-option v-for="(item, index) in CourseReleaseList" :key="index" :label="item.fitnessCourseName" :value="index"></el-option>
            </el-select>
          </el-form-item>
          <!--<el-form-item label="课程类型">-->
            <!--<el-select placeholder="请选择" v-model="courseForm.fitnessCourseType">-->
              <!--<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <el-form-item label="课程标签" prop="courseReleaseFlag">
            <span class="flag">多个标签用英文逗号隔开,不能超过8个字符</span>
            <el-input v-model="courseForm.courseReleaseFlag"></el-input>
          </el-form-item>
          <el-form-item label="教练昵称" prop="storeCoachPkid">
            <el-select placeholder="请选择" filterable v-model="courseForm.storeCoachNikename" @change="getCode" style="width: 100%">
              <el-option v-for="(item, index) in coachList" :key="index" :label="item.storeCoachNikename" :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间" prop="courseReleaseBegtime">
            <el-date-picker type="datetime" placeholder="选择日期" v-model="courseForm.courseReleaseBegtime" value-format="yyyy-MM-dd HH-mm-ss"
                            style="width: 100%;" :picker-options="pickerOptions0">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="courseReleaseEndtime">
            <el-date-picker type="datetime" placeholder="选择日期" v-model="courseForm.courseReleaseEndtime" value-format="yyyy-MM-dd HH-mm-ss"
                            style="width: 100%;" :picker-options="pickerEndDate">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="人数" prop="courseReleaseMaxNum">
            <div>
              <el-input  v-model="courseForm.courseReleaseMaxNum" type="number">
                <template slot="append">人</template>
              </el-input>
            </div>
          </el-form-item>
          <el-form-item label="原价" prop="courseReleaseMoney">
            <el-input v-model="courseForm.courseReleaseMoney" type="number">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <!--<el-form-item label="是否支持折扣卡">-->
            <!--<el-radio-group v-model="courseForm.courseReleaseCardStatus" size="medium">-->
              <!--<el-radio-button label="0" >不支持</el-radio-button>-->
              <!--<el-radio-button label="1">支持</el-radio-button>-->
            <!--</el-radio-group>-->
          <!--</el-form-item>-->
          <!--<el-form-item label="卡ID" v-if="courseForm.courseReleaseCardStatus==='1'">-->
            <!--<el-select v-model="courseForm.cardPkid" >-->
              <!--<el-option v-for="item in cardList" :key="item.handyCardPkid"  :label="item.handyCardName" :value="item.handyCardPkid"></el-option>-->
            <!--</el-select>-->
          <!--</el-form-item>-->
          <el-form-item label="总课时" prop="courseReleaseTotalHour">
            <el-input v-model="courseForm.courseReleaseTotalHour" type="number">
              <template slot="append">节</template>
            </el-input>
          </el-form-item>
          <el-form-item label="总价" prop="courseReleaseTotalHourMoney">
            <el-input v-model="courseForm.courseReleaseTotalHourMoney" type="number">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="课时单价" prop="courseReleaseOneHourMoney">
            <el-input v-model="courseForm.courseReleaseOneHourMoney" type="number">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="每个课时时间" prop="courseReleaseOneHour">
            <el-input v-model="courseForm.courseReleaseOneHour" type="number">
              <template slot="append">小时</template>
            </el-input>
          </el-form-item>
          <el-form-item label="有效期" prop="courseReleaseTimeLength">
            <el-input v-model="courseForm.courseReleaseTimeLength" type="number">
              <template slot="append">月</template>
            </el-input>
          </el-form-item>
          <el-form-item label="是否支持优惠券">
            <el-radio-group v-model="courseForm.courseReleaseDiscountStatus" size="medium">
              <el-radio-button label="0" >不支持</el-radio-button>
              <el-radio-button label="1">支持</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <!--<el-form-item label="档位" v-if="courseType"></el-form-item>-->
          <div v-for="(item, index) in courseForm.PriceLevelList" :key="item.key" v-if="courseType">
            <el-form-item label="档位">
              <el-col :span="2"><span>{{index+1}}</span></el-col>
              <el-col :span="7"><span>课时</span><el-input v-model="item.courseTotal" @change="totalCourse(index)" ></el-input></el-col>

              <el-col :span="7"><span>售价</span><el-input v-model="item.totalPrice" @change="totalMoney(index)" ></el-input></el-col>

              <el-col :span="7"><span>单价</span><el-input v-model="item.courseUnit" disabled></el-input></el-col>
              <el-col :span="24" v-if="errorMes">
                <span class="msg">课时不能超过总课时</span>
              </el-col>
              <el-col :span="24" v-if="priceMes">
                <span class="msg">售价不能超过总价</span>
              </el-col></el-form-item>
            <!--<el-form-item label="" v-if="courseType">-->
      <!---->
            <!--</el-form-item>-->
            <!--<el-form-item label="售价" v-if="courseType">-->
              <!--<el-input v-model="item.totalPrice" @change="totalMoney(index)" ></el-input>-->
              <!--<el-col :span="24" v-if="priceMes">-->
                <!--<span class="msg">售价不能超过总价</span>-->
              <!--</el-col>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="单价" v-if="courseType">-->
              <!--<el-input v-model="item.courseUnit" disabled></el-input>-->
            <!--</el-form-item>-->
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addVisible=false">取消</el-button>
          <el-button type="primary" @click="addCard('courseForm')" v-if="!editVisible">确定</el-button>
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
      <!--排课-->
      <el-dialog title="排课新增" :visible.sync="planVisible" width="30%" :close-on-click-modal="false">
        <el-form :model="planForm" label-width="90px">
          <!--<el-form-item label="课程类型">-->
            <!--<el-input v-model="courseReleasePkid"></el-input>-->
          <!--</el-form-item>-->
          <el-form-item label="开始时间">
            <el-row>
              <el-col :span="12">
                <el-date-picker type="date" placeholder="选择日期" v-model="planForm.coursePlanBegtime" value-format="yyyy-MM-dd"
                                style="width: 100%;" :picker-options="pickerOptions0">
                </el-date-picker>
              </el-col>
              <el-col class="line" :span="2" style="text-align: center">-</el-col>
              <el-col :span="10">
                <el-time-select style="width: 100%"
                                placeholder="起始时间"
                                v-model="startTime"
                                :picker-options="{
      start: '08:30',
      step: '00:01',
      end: '23:30'
    }">
                </el-time-select>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="结束时间">
            <el-row>
              <el-col :span="12">
                <el-date-picker type="date" placeholder="选择日期" v-model="planForm.coursePlanEndtime" value-format="yyyy-MM-dd"
                                style="width: 100%;" :picker-options="releaseCourseDate">
                </el-date-picker>
              </el-col>
              <el-col class="line" :span="2" style="text-align: center">-</el-col>
              <el-col :span="10">
                <el-time-select style="width: 100%"
                                placeholder="结束时间"
                                v-model="endTime"
                                :picker-options="{
      start: '08:30',
      step: '00:01',
      end: '23:30',
      minTime: startTime
    }">
                </el-time-select>
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="planVisible=false">取消</el-button>
          <el-button type="primary" @click="coursePlan">确定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
import vali from '../common/validate'
export default {
  name: 'courseReleaseList',
  data () {
    return {
      courseType: false,
      priceMes: false,
      errorMes: false,
      pageSize: 10,
      total: null,
      pages: null,
      coach_name: null,
      course_name: null,
      start_time: null,
      end_time: null,
      currentPage: 1,
      tableDataEnd: [],
      pickerOptions0: this.startDate(),
      pickerEndDate: this.endDate(),
      releaseCourseDate: this.releaseCourse(),
      releaseStart: '',
      startTime: '',
      endTime: '',
      courseReleaseData: [],
      cardList: [],
      coachList: [],
      CourseReleaseList: [],
      idx: -1,
      message: '',
      addVisible: false,
      editVisible: false,
      delVisible: false,
      disableVisible: false,
      putShow: false,
      planVisible: false,
      dailogTitleType: '',
      courseForm: {
        PriceLevelList: [
          {courseTotal: '', totalPrice: '', courseUnit: ''},
          {courseTotal: '', totalPrice: '', courseUnit: ''},
          {courseTotal: '', totalPrice: '', courseUnit: ''}
        ],
        courseReleaseName: null,
        courseReleaseBegtime: null,
        courseReleaseEndtime: null,
        courseReleaseMaxNum: null,
        courseReleaseMoney: null,
        courseReleaseCardStatus: '0',
        courseReleaseDiscountStatus: '0',
        discountPkid: null,
        courseReleaseTotalHour: null,
        courseReleaseTotalHourMoney: null,
        courseReleaseOneHour: null,
        courseReleaseOneHourMoney: null,
        courseReleaseTimeLength: null,
        cardPkid: null,
        storeCoachPkid: null,
        storeCoachPkcode: null,
        fitnessCoursePkid: null,
        fitnessCoursePkcode: null,
        fitnessCourseType: null,
        courseReleaseFlag: null,
        courseReleasePriceLevel: null
        // courseTotal: null,
        // courseTotal2: null,
        // courseTotal3: null,
        // totalPrice: null,
        // totalPrice2: null,
        // totalPrice3: null,
        // courseUnit: null,
        // courseUnit2: null,
        // courseUnit3: null
      },
      rules: {
        fitnessCoursePkid: [
          { required: true, message: '请选择课程ID', trigger: 'change' }
        ],
        courseReleaseBegtime: [
          { required: true, message: '请输入开始时间', trigger: 'change' }
        ],
        courseReleaseEndtime: [
          { required: true, message: '请选择结束时间', trigger: 'change' }
        ],
        courseReleaseName: [
          { required: true, message: '请输入课程名称', trigger: 'change' }
        ],
        storeCoachPkid: [
          { required: true, message: '请选择教练名称', trigger: 'change' }
        ],
        courseReleaseMaxNum: [
          { required: true, message: '请输入人数', trigger: 'change' },
          {validator: vali.numbers, trigger: 'change'}
        ],
        courseReleaseMoney: [
          { required: true, message: '请输入原价', trigger: 'change' },
          {validator: vali.courseLength, trigger: 'change'}
        ],
        courseReleaseTotalHour: [
          { required: true, message: '请输入总课时', trigger: 'change' },
          {validator: vali.numbers, trigger: 'change'}
        ],
        courseReleaseTotalHourMoney: [
          { required: true, message: '请输入总价', trigger: 'change' },
          {validator: vali.courseLength, trigger: 'change'}
        ],
        courseReleaseOneHour: [
          { required: true, message: '请输入每个课时时间', trigger: 'change' },
          {validator: vali.courseLength, trigger: 'change'}
        ],
        courseReleaseTimeLength: [
          { required: true, message: '请输入有效期', trigger: 'change' },
          {validator: vali.hasTime, trigger: 'change'}
        ],
        courseReleaseFlag: [
          { required: true, message: '请输入标签', trigger: 'change' },
          {validator: vali.flagNum, trigger: 'change'}
        ],
        courseTotal: [
          { required: true, message: '请输入课时', trigger: 'change' },
          {validator: vali.courseLength, trigger: 'change'}

        ],
        totalPrice: [
          { required: true, message: '请输入售价', trigger: 'change' },
          {validator: vali.courseLength, trigger: 'change'}

          // {validator: this.totalMoney, trigger: 'blur'}
        ],
        courseReleaseOneHourMoney: [
          { required: true, message: '请输入单价', trigger: 'change' },
          {validator: vali.courseLength, trigger: 'change'}
        ]
      },
      planForm: {
        coursePlanBegtime: '',
        coursePlanEndtime: '',
        courseReleasePkid: '',
        courseReleasePkcode: ''
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
    this.getCourseRelease()
  },
  methods: {
    // 添加档位
    // addLeavel () {
    //   this.PriceLevelList.push({courseTotal: '', type: 'text', totalPrice: '', courseUnit: ''})
    // },
    // 总价算单价
    totalMoney (index) {
      let _this = this
      _this.index = index
      let totalHouse = _this.courseForm.courseReleaseTotalHourMoney
      let allCourse = _this.courseForm.PriceLevelList[index].courseTotal
      let total = _this.courseForm.PriceLevelList[index].totalPrice
      if (parseInt(total) > parseInt(totalHouse)) {
        _this.priceMes = true
        return false
      } else {
        _this.priceMes = false
        if (total !== '' || total != null || total !== undefined) {
          let unit = (total / allCourse).toFixed(2)
          _this.courseForm.PriceLevelList[index].courseUnit = unit
        }
      }
    },
    // 总课程算单价
    totalCourse (index) {
      let _this = this
      _this.index = index
      let courseHouse = _this.courseForm.courseReleaseTotalHour
      let allCourse = _this.courseForm.PriceLevelList[index].courseTotal
      let total = _this.courseForm.PriceLevelList[index].totalPrice
      if (parseInt(allCourse) > parseInt(courseHouse)) {
        _this.errorMes = true
        return false
      } else {
        _this.errorMes = false
        if (allCourse !== '' || allCourse != null || allCourse !== undefined) {
          let unit = (total / allCourse).toFixed(2)
          _this.courseForm.PriceLevelList[index].courseUnit = unit
        }
      }
    },
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
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfCourseReleaseOperate/findCourseReleaseByStorePkid', storeDate, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        let mes = res.data.message
        if (res.data.success === '200') {
          _this.courseReleaseData = res.data.data.data
          _this.total = res.data.data.total
          _this.pages = res.data.data.pages
        } else if (mes === '无操作权限') {
          this.$router.push('/login')
          sessionStorage.clear()
          // _this.$message.error(res.data.message)
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
      if (_this.coach_name === '' || _this.coach_name === null) {
        _this.coach_name = null
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
        storeCoachName: _this.coach_name,
        fitnessCourseName: _this.course_name,
        begtime: _this.start_time,
        endtime: _this.end_time,
        storePkid: parseInt(storePkid)
      }
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfCourseReleaseOperate/findCourseReleaseByStorePkid', searchData, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.courseReleaseData = res.data.data.data
        } else {
          _this.$message.error('无操作权限')
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    endDate () {
      return {
        disabledDate: time => {
          let beginDateVal = this.courseForm.courseReleaseBegtime
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
    // 排课开始时间
    releaseCourse () {
      return {
        disabledDate: time => {
          let beginDateVal = this.planForm.coursePlanBegtime
          if (beginDateVal) {
            return (
              time.getTime() <
              new Date(beginDateVal).getTime() - 1 * 24 * 60 * 60 * 1000
            )
          }
        }
      }
    },
    // 判断是否使用折扣卡
    getDidcound (val) {
      console.log(val.label)
    },
    // 课程类型转文字
    courseTypeTxt (val) {
      if (val.fitnessCourseType === 1) {
        return '团操'
      } else if (val.fitnessCourseType === 2) {
        return '私教'
      }
    },
    // 排课状态转文字
    planTxt (val) {
      if (val.courseReleaseIsplan === 1) {
        return '已排'
      } else if (val.courseReleaseIsplan === 0) {
        return '未排'
      }
    },
    // 发布状态文字
    disableTxt (val) {
      if (val.courseReleaseStatus === 0) {
        return '失效'
      } else if (val.courseReleaseStatus === 1) {
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
    // 获取课程
    getCourse (value) {
      let _this = this
      let index = value
      let item = _this.CourseReleaseList[index]
      let code = item.fitnessCoursePkcode
      _this.courseForm.fitnessCoursePkcode = code
      _this.courseForm.fitnessCoursePkid = item.fitnessCoursePkid
      _this.courseForm.fitnessCourseType = item.fitnessCourseType
      // _this.courseForm.courseReleaseName = item.fitnessCourseName
      _this.courseType = item.fitnessCourseType
      if (item.fitnessCourseType === 2) {
        _this.courseType = true
      } else {
        _this.courseType = false
      }
    },
    // 获取卡列表
    getCard () {
      let _this = this
      let storePkid = sessionStorage.getItem('storePkid')
      let pkid = {storePkid: parseInt(storePkid)}
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfCourseReleaseOperate/findHandyCardList', pkid, {
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
    // 获取课程
    getCourseRelease () {
      let _this = this
      let storePkid = sessionStorage.getItem('storePkid')
      let pkid = {storePkid: parseInt(storePkid)}
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfCourseReleaseOperate/fitnessCourseList', pkid, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        let mes = res.data.message
        if (res.data.success === '200') {
          _this.CourseReleaseList = res.data.data
        } else if (mes === '无操作权限') {
          this.$router.push('/login')
          sessionStorage.clear()
          // _this.$message.error('无操作权限')
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
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfCourseReleaseOperate/findStoreCoachList', storePkid, {
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
      let storeDate = {
        pageSize: _this.pageSize,
        pageNum: 1,
        storePkid: parseInt(storePkid)
      }
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfCourseReleaseOperate/findCourseReleaseByStorePkid', storeDate, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.courseReleaseData = res.data.data.data
          _this.total = res.data.data.total
          _this.pages = res.data.data.pages
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
    // 排课弹窗
    coursePlanShow (index, row) {
      let _this = this
      _this.planVisible = true
      _this.idx = index
      const item = _this.courseReleaseData[index]
      _this.releaseStart = item.courseReleaseBegtime
      console.log(item.courseReleaseBegtime)
      _this.planForm = {
        courseReleasePkid: item.courseReleasePkid,
        courseReleasePkcode: item.courseReleasePkcode
      }
    },
    // 编辑弹窗
    handleEdit (index, row) {
      let _this = this
      _this.idx = index
      _this.addVisible = true
      _this.editVisible = true
      _this.dailogTitleType = '编辑'
      const item = _this.courseReleaseData[index]
      if (item.fitnessCourseType === 2) {
        _this.courseType = true
      } else {
        _this.courseType = false
      }
      console.log(item.fitnessCourseType)
      console.log(_this.courseType)
      if (item.courseReleasePriceLevel === '' || item.courseReleasePriceLevel === 'undefined' || item.courseReleasePriceLevel === null) {
        _this.courseForm.PriceLevelList = [{courseTotal: '', totalPrice: '', courseUnit: ''},
          {courseTotal: '', totalPrice: '', courseUnit: ''},
          {courseTotal: '', totalPrice: '', courseUnit: ''}]
      } else {
        _this.courseForm.PriceLevelList = item.courseReleasePriceLevel
      }

      // const cardId = _this.cardList[index]
      _this.courseForm = {
        fitnessCoursePkid: item.fitnessCoursePkid,
        fitnessCoursePkcode: item.fitnessCoursePkcode,
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
        // cardPkid: cardId.handyCardPkid,
        courseReleaseName: item.courseReleaseName,
        storeCoachNikename: item.storeCoachNikename,
        courseReleaseFlag: item.courseReleaseFlag,
        PriceLevelList: item.courseReleasePriceLevel
      }
    },
    // 卡发布弹窗
    disableStoreShow (index, row) {
      let _this = this
      _this.putShow = false
      let item = _this.courseReleaseData[index]
      let agentDis = item.courseReleaseStatus
      let pkid = item.courseReleasePkid
      _this.courseReleasePkid = pkid
      if (agentDis === 0) {
        _this.message = '是否发布该课程？'
        _this.courseReleaseStatus = 1
      } else {
        _this.message = '是否取消发布该课程？'
        _this.courseReleaseStatus = 0
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
    addCard (formName) {
      let _this = this
      let storePkid = sessionStorage.getItem('storePkid')
      let storePkcode = sessionStorage.getItem('storePkcode')
      let levels = _this.courseForm.PriceLevelList
      // let flags = _this.courseForm.courseReleaseFlag
      // console.log(flags)
      // if (flags !== null || flags !== '' || flags !== undefined) {
      //   flags = flags.replace(/，/ig, ',')
      //   let courseFlag = flags.split(',')
      //   _this.courseForm.courseReleaseFlag = courseFlag
      // } else {
      //   _this.courseForm.courseReleaseFlag = null
      // }
      // let total1 = _this.PriceLevelList[0].totalPrice
      // let total2 = _this.PriceLevelList[1].courseTotal
      // let total3 = _this.PriceLevelList[2].courseTotal
      // if (total1 === '' || total1 === undefined || total2 === '' || total2 === undefined || total3 === '' || total3 === undefined) {
      //   _this.PriceLevelList = null
      // } else {
      //   _this.PriceLevelList = JSON.stringify(_this.PriceLevelList)
      // }
      console.log(_this.courseType)
      if (_this.courseType) {
        let total1 = _this.courseForm.PriceLevelList[0].totalPrice
        let total2 = _this.courseForm.PriceLevelList[0].courseTotal
        let total3 = _this.courseForm.PriceLevelList[0].courseUnit
        if (total1 === '' || total1 === undefined || total2 === '' || total2 === undefined || total3 === '' || total3 === undefined) {
          _this.courseForm.PriceLevelList = levels
        } else {
          _this.courseForm.PriceLevelList = levels
        }
      }
      // else {
      //   _this.courseForm.PriceLevelList = _this.courseForm.PriceLevelList
      // }
      console.log(_this.courseForm.PriceLevelList)
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
        cardPkid: parseInt(_this.courseForm.handyCardPkid),
        storeCoachPkid: parseInt(_this.courseForm.storeCoachPkid),
        storeCoachPkcode: _this.courseForm.storeCoachPkcode,
        fitnessCoursePkid: parseInt(_this.courseForm.fitnessCoursePkid),
        fitnessCoursePkcode: _this.courseForm.fitnessCoursePkcode,
        fitnessCourseType: parseInt(_this.courseForm.fitnessCourseType),
        courseReleaseName: _this.courseForm.courseReleaseName,
        courseReleaseFlag: _this.courseForm.courseReleaseFlag + '',
        courseReleasePriceLevel: JSON.stringify(_this.courseForm.PriceLevelList)
      }
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfCourseReleaseOperate/addCourseRelease', formData, {
            headers: {'Content-Type': 'application/json'}
          }).then((res) => {
            if (res.data.success === '200') {
              _this.courseReleaseData = res.data.data
              _this.$message.success('添加成功')
              // _this.getData()
              location.reload()
              _this.addVisible = false
            } else {
              _this.$message.error(res.data.message)
            }
          }).catch((error) => {
            console.log(error)
          })
        }
      })
    },
    //  编辑
    editCard () {
      let _this = this
      let index = _this.idx
      const item = _this.courseReleaseData[index]
      let levels = _this.courseForm.PriceLevelList
      // const items = _this.CourseReleaseList[index]
      // let levels = {
      //   courseTotal: _this.courseForm.courseTotal,
      //   totalPrice: _this.courseForm.totalPrice,
      //   courseUnit: _this.courseForm.courseUnit
      // }
      if (item.fitnessCourseType === 2) {
        let total1 = _this.courseForm.PriceLevelList[0].totalPrice
        let total2 = _this.courseForm.PriceLevelList[0].courseTotal
        let total3 = _this.courseForm.PriceLevelList[0].courseUnit
        if (total1 === '' || total1 === undefined || total2 === '' || total2 === undefined || total3 === '' || total3 === undefined) {
          _this.courseForm.PriceLevelList = levels
        } else {
          _this.courseForm.PriceLevelList = levels
        }
      }
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
        fitnessCoursePkid: parseInt(item.fitnessCoursePkid),
        fitnessCoursePkcode: item.fitnessCoursePkcode,
        fitnessCourseType: parseInt(_this.courseForm.fitnessCourseType),
        courseReleaseName: _this.courseForm.courseReleaseName,
        courseReleaseFlag: _this.courseForm.courseReleaseFlag,
        courseReleasePriceLevel: JSON.stringify(_this.courseForm.PriceLevelList)
      }
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfCourseReleaseOperate/updateCourseRelease', editData, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.courseReleaseData = res.data.data
          _this.$message.success('修改成功')
          _this.addVisible = false
          // _this.getData()
          location.reload()
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
        courseReleaseStatus: _this.courseReleaseStatus
      }
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfCourseReleaseOperate/configInvalidCourseRelease', disableData, {
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
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfCourseReleaseOperate/configCourseReleasePut', disableData, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.courseReleaseData = res.data.data
          _this.$message.success('操作成功')
          _this.getData()
          // _this.currentPage = 1
          _this.handleCurrentChange(_this.currentPage)
          _this.disableVisible = false
        } else {
          _this.$message.error('无操作权限')
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    //  排课新增
    coursePlan () {
      let _this = this
      let index = _this.idx
      const item = _this.courseReleaseData[index]
      let startTime = _this.startTime
      let endTime = _this.endTime
      let planBegin = _this.planForm.coursePlanBegtime + ' ' + startTime
      let planEnd = _this.planForm.coursePlanEndtime + ' ' + endTime
      let disableData = {
        coursePlanBegtime: planBegin,
        coursePlanEndtime: planEnd,
        courseReleasePkid: item.courseReleasePkid,
        courseReleasePkcode: item.courseReleasePkcode
      }
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfCoursePlanOperate/addPlan', disableData, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          // _this.courseReleaseData = res.data.data
          _this.$message.success('操作成功')
          _this.getData()
          _this.planVisible = false
          _this.handleCurrentChange(_this.currentPage)
          // location.reload()
        } else {
          _this.$message.error('无操作权限')
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
  .flag{
    font-size: 14px;
  }
  .msg{
    font-size: 14px;
    color: #d71718;
  }
</style>
