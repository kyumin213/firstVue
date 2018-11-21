<template>
    <div>
      <div class="block">
        <el-row>
          <el-button class="addBtn" @click="addModelOpen()">创建汗滴卡</el-button>
        </el-row>
      </div>
      <div class="containers">
        <el-table :data="cardData" border style="width: 100%">
          <el-table-column prop="handyCardPkid" label="pkid" align="center"></el-table-column>
          <el-table-column prop="handyCardName" label="卡名称" align="center"></el-table-column>
          <el-table-column prop="handyCardMoney" label="卡金额" align="center"></el-table-column>
          <el-table-column prop="handyCardType" label="卡类型" align="center" :formatter="cardTypeTxt"></el-table-column>
          <el-table-column prop="handyCardTimeType" label="时间类型" align="center" :formatter="cardTimeTypeTxt"></el-table-column>
          <el-table-column prop="handyCardStatus" label="状态" align="center" :formatter="shelfTxt"></el-table-column>
          <el-table-column label="操作" align="center" width="220px">
            <template slot-scope="scope">
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="small" type="primary" @click="shelfShow(scope.$index, scope.row)" v-if="scope.row.handyCardStatus===0">上架</el-button>
              <el-button size="small" type="danger" @click="shelfShow(scope.$index, scope.row)" v-else>下架</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--新增-->
      <el-dialog :title="dailogTitleType" :visible.sync="addVisible" width="30%" :close-on-click-modal="false">
        <el-form :model="form" ref="form" label-width="80px" :rules="rules" class="demo-ruleForm" status-icon>
          <el-form-item label="卡图片" prop="handyCardImgurl">
            <img v-if="form.handyCardImgurl" :src="form.handyCardImgurl" class="avatar" >
            <input class="file" name="file" type="file" accept="image/png,image/gif,image/jpeg"   @change="update"/>
          </el-form-item>
          <el-form-item label="卡名称" prop="handyCardName">
            <el-input v-model="form.handyCardName"></el-input>
          </el-form-item>
          <el-form-item label="卡金额" prop="handyCardMoney">
            <el-input v-model="form.handyCardMoney"></el-input>
          </el-form-item>
          <el-form-item label="卡类型" prop="handyCardType">
            <el-select v-model="form.handyCardType" placeholder="请选择" style="width: 100%">
              <el-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="时间类型">
            <el-radio-group v-model="form.handyCardTimeType" size="small">
              <el-radio-button label="1" >一个月</el-radio-button>
              <el-radio-button label="2">三个月</el-radio-button>
              <el-radio-button label="3">六个月</el-radio-button>
              <el-radio-button label="4">一年</el-radio-button>
              <el-radio-button label="5">一天</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <!--<el-form-item label="卡权限">-->
            <!---->
          <!--</el-form-item>-->
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addVisible=false">取消</el-button>
          <el-button type="primary" @click="addCard('form')" v-if="!editVisible">确定</el-button>
          <el-button type="primary" @click="editCard" v-else>确定</el-button>
        </span>
      </el-dialog>
      <!--上架-->
      <el-dialog title="温馨提示" :visible.sync="disableVisible" width="300px" center>
        <div class="del-dialog-cnt">{{message}}</div>
        <span slot="footer" class="dialog-footer">
                <el-button @click="disableVisible = false">取 消</el-button>
                <el-button type="primary" @click="subShelf">确 定</el-button>
            </span>
      </el-dialog>
    </div>
</template>

<script>
import vali from '../common/validate'
export default {
  name: 'cardList',
  data () {
    return {
      imageUrl: '',
      cardData: [],
      idx: -1,
      addVisible: false,
      editVisible: false,
      delVisible: false,
      disableVisible: false,
      dailogTitleType: '',
      message: '',
      form: {
        handyCardName: '',
        handyCardMoney: '',
        handyCardType: '',
        handyCardAuth: '',
        handyCardTimeType: '1',
        handyCardImgurl: ''
      },
      options: [
        {
          value: 1,
          label: '会员卡'
        }
      ],
      rules: {
        handyCardName: [
          {required: true, message: '请输入卡名称', trigger: 'change'},
          {validator: vali.cardNameNum, trigger: 'change'}
        ],
        handyCardMoney: [
          {required: true, message: '请输入卡金额', trigger: 'change'}
        ],
        handyCardType: [
          {required: true, message: '请选择卡类型', trigger: 'change'}
        ],
        handyCardImgurl: [
          {required: true, message: '请上传卡图片', trigger: 'change'}
        ]
      }
    }
  },
  created () {
    this.getData()
  },
  methods: {
    update (e) {
      let _this = this
      let file = e.target.files[0]
      let names = file.name
      var ext = names.lastIndexOf('.')
      let fileTpyes = names.substring(ext + 1)
      let param = new FormData() // 创建form对象
      param.append('file', file)// 通过append向form对象添加数据
      param.append('fileType', fileTpyes)// 添加form表单中其他数据
      let config = {
        headers: {'Content-Type': 'multipart/form-data'}
      } // 添加请求头
      this.axios.post(this.GLOBAL.BASE_URL + '/uploadFile/uploadimg', param, config)
        .then(res => {
          if (res.data.success === '200') {
            _this.form.handyCardImgurl = res.data.data
            console.log(res)
          } else {
            _this.$message.error(res.data.message)
          }
        }).catch((error) => {
          console.log(error)
        })
    },
    // handleAvatarSuccess (res, file) {
    //   let _this = this
    //   _this.imageUrl = URL.createObjectURL(file.raw)
    //   let names = file.name
    //   var ext = names.lastIndexOf('.')
    //   let fileTpyes = names.substring(ext + 1)
    //   // _this.fileType = hh
    //   let formData = new FormData()
    //   formData.append('file', file)
    //   formData.append('fileType', fileTpyes)
    //   _this.axios.post(this.GLOBAL.BASE_URL + '/uploadFile/uploadimg', formData,
    //     {headers: {'Content-Type': 'application/json'}
    //     }).then((res) => {
    //     if (res.data.success === '200') {
    //       _this.imageUrl = res.data.data
    //       _this.$message.success('添加成功')
    //       console.log(res.data.data)
    //     }
    //   }).catch((err) => {
    //     console.log(err, 'error')
    //   })
    // },
    //
    // beforeAvatarUpload (file) {
    //   const isJPG = file.type === 'image/jpeg'
    //   const isLt2M = file.size / 1024 / 1024 < 2
    //   if (!isJPG) {
    //     this.$message.error('上传图片只能是 JPG 格式!')
    //   }
    //   if (!isLt2M) {
    //     this.$message.error('上传图片大小不能超过 2MB!')
    //   }
    //   return isJPG && isLt2M
    // },
    // 卡类型转文字
    cardTypeTxt (val) {
      if (val.handyCardType === 1) {
        return '月卡'
      } else if (val.handyCardType === 2) {
        return '储值卡'
      }
    },
    // 上下架转文字
    shelfTxt (val) {
      if (val.handyCardStatus === 0) {
        return '下架'
      } else if (val.handyCardStatus === 1) {
        return '上架'
      }
    },
    // 卡时间类型转文字
    cardTimeTypeTxt (val) {
      if (val.handyCardTimeType === 1) {
        return '一个月'
      } else if (val.handyCardTimeType === 2) {
        return '三个月'
      } else if (val.handyCardTimeType === 3) {
        return '六个月'
      } else if (val.handyCardTimeType === 4) {
        return '一年'
      } else if (val.handyCardTimeType === 5) {
        return '一天'
      }
    },
    // 上下架弹窗
    shelfShow (index, row) {
      let _this = this
      let item = _this.cardData[index]
      let agentDis = item.handyCardStatus
      let pkid = item.handyCardPkid
      _this.handyCardPkid = pkid
      if (agentDis === 0) {
        _this.message = '是否上架该卡？'
        _this.handyCardStatus = 1
      } else {
        _this.message = '是否下架该卡？'
        _this.handyCardStatus = 0
      }
      this.disableVisible = true
    },
    // 列表数据
    getData () {
      let _this = this
      let agentPkid = sessionStorage.getItem('agentPkid')
      let pkid = {agentPkid: parseInt(agentPkid)}
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfCardOperate/findCardByAgentPkid', pkid, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        let mes = res.data.message
        if (res.data.success === '200') {
          _this.cardData = res.data.data
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
      const item = _this.cardData[index]
      if (item.handyCardType === '1') {
        item.handyCardType = '月卡'
      } else if (item.handyCardType === '2') {
        item.handyCardType = '储值卡'
      }
      // _this.imageUrl = item.handyCardImgurl
      _this.form = {
        handyCardName: item.handyCardName,
        handyCardMoney: item.handyCardMoney,
        handyCardType: item.handyCardType,
        handyCardTimeType: item.handyCardTimeType,
        handyCardImgurl: item.handyCardImgurl
      }
    },
    //  添加
    addCard (formName) {
      let agentPkid = sessionStorage.getItem('agentPkid')
      let pkCode = sessionStorage.getItem('agentPkcode')
      let _this = this
      let formData = {
        handyCardName: _this.form.handyCardName,
        handyCardMoney: _this.form.handyCardMoney,
        handyCardType: parseInt(_this.form.handyCardType),
        handyCardTimeType: parseInt(_this.form.handyCardTimeType),
        handyCardAuth: '',
        agentPkid: parseInt(agentPkid),
        agentPkcode: pkCode,
        handyCardImgurl: _this.form.handyCardImgurl
      }
      _this.$refs[formName].validate((valid) => {
        if (valid) {
          _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfCardOperate/addCard', formData, {
            headers: {'Content-Type': 'application/json'}
          }).then((res) => {
            if (res.data.success === '200') {
              _this.cardData = res.data.data
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
        }
      })
    },
    //  编辑
    editCard () {
      let _this = this
      let index = _this.idx
      const item = _this.cardData[index]
      let editData = {
        handyCardPkid: item.handyCardPkid,
        handyCardName: _this.form.handyCardName,
        handyCardMoney: _this.form.handyCardMoney,
        handyCardTimeType: parseInt(_this.form.handyCardTimeType),
        handyCardType: parseInt(_this.form.handyCardType),
        handyCardAuth: '',
        handyCardImgurl: _this.form.handyCardImgurl
      }
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfCardOperate/updateCard', editData, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.cardData = res.data.data
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
    //  上下架卡
    subShelf () {
      let _this = this
      // let index = _this.idx
      // const item = _this.cardData[index]
      let shelfData = {
        handyCardPkid: parseInt(_this.handyCardPkid),
        handyCardStatus: parseInt(_this.handyCardStatus)
      }
      _this.axios.post(this.GLOBAL.BASE_URL + '/agentOfCardOperate/confCardPut', shelfData, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.cardData = res.data.data
          _this.$message.success('操作成功')
          _this.disableVisible = false
          _this.getData()
        } else {
          _this.$message.error(res.data.message)
        }
      }).catch((error) => {
        _this.$message.error(error)
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
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 156px;
    height: 156px;
    line-height: 156px;
    text-align: center;
  }
  .avatar {
    width: 260px;
    height: 156px;
    display: block;
  }
  .cardImg .el-upload--text{
    width: 260px;
  }
</style>
