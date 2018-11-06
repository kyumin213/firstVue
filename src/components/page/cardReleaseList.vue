<template>
    <div class="table">
      <div class="block">
        <el-row>
          <el-button class="addBtn" @click="addModelOpen()">创建储值卡</el-button>
        </el-row>
      </div>
      <div class="container">
        <el-table :data="cardReleaseData" border style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="cardPkid" label="pkid" align="center" width="60"></el-table-column>
          <el-table-column prop="rechargeaCardReleaseBegtime" label="开始时间" sortable align="center"></el-table-column>
          <el-table-column prop="rechargeaCardReleaseEndtime" label="结束时间" sortable align="center"></el-table-column>
          <el-table-column prop="rechargeaCardReleaseTimeLength" label="有效期" align="center"></el-table-column>
          <el-table-column prop="rechargeaCardReleaseMoney" label="售价" align="center"></el-table-column>
          <el-table-column prop="rechargeaCardReleaseTotalMoney" label="总金额" align="center"></el-table-column>
          <el-table-column prop="rechargeaCardReleaseStatus" label="发布状态" align="center" :formatter="disableTxt"></el-table-column>
          <el-table-column prop="rechargeaCardReleasePut" label="上下架状态" align="center" :formatter="putTxt"></el-table-column>
          <el-table-column label="操作" align="center" width="250">
            <template slot-scope="scope">
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="small" type="info" @click="disableStoreShow(scope.$index, scope.row)"
                         v-if="scope.row.rechargeaCardReleaseStatus===1">取消发布
              </el-button>
              <el-button size="small" type="primary" v-else-if="scope.row.rechargeaCardReleaseStatus===0"
                         @click="disableStoreShow(scope.$index, scope.row)">发布
              </el-button>
              <el-button size="small" type="info" @click="putModelShow(scope.$index, scope.row)"
                         v-if="scope.row.rechargeaCardReleasePut===1">下架
              </el-button>
              <el-button size="small" type="primary" v-else-if="scope.row.rechargeaCardReleasePut===0"
                         @click="putModelShow(scope.$index, scope.row)">上架
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--新增-->
      <el-dialog :title="dailogTitleType" :visible.sync="addVisible" width="30%" :close-on-click-modal="false">
        <el-form :model="cardForm" label-width="80px">
          <el-form-item label="卡ID" >
            <el-select v-model="cardForm.cardPkid" @change="getCode">
              <el-option v-for="(item,index) in cardList" :key="index"  :label="item.cardPkid" :value="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间">
            <el-date-picker type="date" placeholder="选择日期" v-model="cardForm.rechargeaCardReleaseBegtime" value-format="yyyy-MM-dd"
                            style="width: 100%;">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker type="date" placeholder="选择日期" v-model="cardForm.rechargeaCardReleaseEndtime" value-format="yyyy-MM-dd"
                            style="width: 100%;">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="有效期">
           <div>
             <el-input  v-model="cardForm.rechargeaCardReleaseTimeLength" type="number">
               <template slot="append">月</template>
             </el-input>
           </div>
          </el-form-item>
          <el-form-item label="售价">
            <el-input v-model="cardForm.rechargeaCardReleaseMoney">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="总金额">
            <el-input v-model="cardForm.rechargeaCardReleaseTotalMoney">
              <template slot="append">元</template>
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
  name: 'cardReleaseList',
  data () {
    return {
      cardReleaseData: [],
      cardList: [],
      idx: -1,
      message: '',
      addVisible: false,
      editVisible: false,
      delVisible: false,
      disableVisible: false,
      putShow: false,
      dailogTitleType: '',
      selVal: '',
      cardPkcode: '',
      cardForm: {
        cardPkid: '',
        rechargeaCardReleaseBegtime: '',
        rechargeaCardReleaseEndtime: '',
        rechargeaCardReleaseTimeLength: '',
        rechargeaCardReleaseMoney: '',
        rechargeaCardReleaseTotalMoney: ''
      }
    }
  },
  created () {
    this.getData()
    this.getCard()
  },
  methods: {
    // 发布状态文字
    disableTxt (val) {
      if (val.rechargeaCardReleaseStatus === 0) {
        return '失效'
      } else if (val.rechargeaCardReleaseStatus === 1) {
        return '有效'
      }
    },
    // 上下架状态
    putTxt (val) {
      if (val.rechargeaCardReleasePut === 0) {
        return '下架'
      } else if (val.rechargeaCardReleasePut === 1) {
        return '上架'
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
    // 获取code
    getCode (value) {
      let _this = this
      let index = value
      let item = _this.cardList[index]
      let code = item.cardPkcode
      _this.cardPkcode = code
      _this.cardForm.cardPkid = item.cardPkid
    },
    // 列表数据
    getData () {
      let _this = this
      let storePkid = sessionStorage.getItem('storePkid')
      let pkid = {storePkid: parseInt(storePkid)}
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfCardReleaseOperate/findCardReleaseByStorePkid', pkid, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        let mes = res.data.message
        if (res.data.success === '200') {
          _this.cardReleaseData = res.data.data
        } else if (mes === '无操作权限') {
          this.$router.push('/login')
          sessionStorage.clear()
          // _this.$message.error('无操作权限')
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
      const item = _this.cardReleaseData[index]
      _this.cardForm = {
        cardPkid: item.cardPkid,
        rechargeaCardReleaseBegtime: item.rechargeaCardReleaseBegtime,
        rechargeaCardReleaseEndtime: item.rechargeaCardReleaseEndtime,
        rechargeaCardReleaseTimeLength: item.rechargeaCardReleaseTimeLength,
        rechargeaCardReleaseMoney: item.rechargeaCardReleaseMoney,
        rechargeaCardReleaseTotalMoney: item.rechargeaCardReleaseTotalMoney
      }
    },
    // 卡发布弹窗
    disableStoreShow (index, row) {
      let _this = this
      _this.putShow = false
      let item = _this.cardReleaseData[index]
      let agentDis = item.rechargeaCardReleaseStatus
      let pkid = item.rechargeaCardReleasePkid
      _this.rechargeaCardReleasePkid = pkid
      if (agentDis === 0) {
        _this.message = '是否发布该储值卡？'
        _this.rechargeaCardReleaseStatus = 1
      } else {
        _this.message = '是否取消发布该储值卡？'
        _this.rechargeaCardReleaseStatus = 0
      }
      this.disableVisible = true
    },
    // 上下架弹窗
    putModelShow (index, row) {
      let _this = this
      _this.putShow = true
      let item = _this.cardReleaseData[index]
      let agentDis = item.rechargeaCardReleasePut
      let pkid = item.rechargeaCardReleasePkid
      _this.rechargeaCardReleasePkid = pkid
      if (agentDis === 0) {
        _this.message = '是否上架该储值卡？'
        _this.rechargeaCardReleasePut = 1
      } else {
        _this.message = '是否下架该储值卡？'
        _this.rechargeaCardReleasePut = 0
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
        rechargeaCardReleaseBegtime: _this.cardForm.rechargeaCardReleaseBegtime,
        rechargeaCardReleaseEndtime: _this.cardForm.rechargeaCardReleaseEndtime,
        rechargeaCardReleaseTimeLength: parseInt(_this.cardForm.rechargeaCardReleaseTimeLength),
        rechargeaCardReleaseMoney: _this.cardForm.rechargeaCardReleaseMoney,
        rechargeaCardReleaseTotalMoney: _this.cardForm.rechargeaCardReleaseTotalMoney,
        storePkid: parseInt(storePkid),
        storePkcode: storePkcode,
        cardPkid: _this.cardForm.cardPkid,
        cardPkcode: _this.cardPkcode
      }
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfCardReleaseOperate/addCardRelease', formData, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.cardReleaseData = res.data.data
          _this.$message.success('添加成功')
          _this.getData()
          _this.addVisible = false
          location.reload()
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
      const item = _this.cardReleaseData[index]
      let editData = {
        rechargeaCardReleasePkid: item.rechargeaCardReleasePkid,
        rechargeaCardReleaseBegtime: _this.cardForm.rechargeaCardReleaseBegtime,
        rechargeaCardReleaseEndtime: _this.cardForm.rechargeaCardReleaseEndtime,
        rechargeaCardReleaseTimeLength: _this.cardForm.rechargeaCardReleaseTimeLength,
        rechargeaCardReleaseMoney: _this.cardForm.rechargeaCardReleaseMoney,
        rechargeaCardReleaseTotalMoney: _this.cardForm.rechargeaCardReleaseTotalMoney,
        cardPkid: '',
        cardPkcode: ''
      }
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfCardReleaseOperate/updateCardRelease', editData, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.cardReleaseData = res.data.data
          _this.$message.success('修改成功')
          _this.addVisible = false
          _this.getData()
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
        rechargeaCardReleasePkid: _this.rechargeaCardReleasePkid,
        rechargeaCardReleaseStatus: _this.rechargeaCardReleaseStatus
      }
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfCardReleaseOperate/configInvalidCardRelease', disableData, {
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
    },
    //  上下架
    cardReleasePut () {
      let _this = this
      let disableData = {
        rechargeaCardReleasePkid: _this.rechargeaCardReleasePkid,
        rechargeaCardReleasePut: _this.rechargeaCardReleasePut
      }
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfCardReleaseOperate/configCardReleasePut', disableData, {
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
  .addBtn{
    background-color: #d71718;
    color: #fff;
    margin-bottom: 20px;
  }
</style>
