<template>
    <div>
      <div class="block">
        <el-row>
          <el-button class="addBtn" @click="addModelOpen()">创建卡</el-button>
        </el-row>
      </div>
      <div class="container">
        <el-table :data="cardData" border style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="cardPkid" label="pkid" align="center"></el-table-column>
          <el-table-column prop="cardName" label="卡名称" align="center"></el-table-column>
          <el-table-column prop="cardMoney" label="卡金额" align="center"></el-table-column>
          <el-table-column prop="cardType" label="卡类型" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDel(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--新增-->
      <el-dialog :title="dailogTitleType" :visible.sync="addVisible" width="30%">
        <el-form :model="form" label-width="80px">
          <el-form-item label="卡名称">
            <el-input v-model="form.cardName"></el-input>
          </el-form-item>
          <el-form-item label="卡金额">
            <el-input v-model="form.cardMoney"></el-input>
          </el-form-item>
          <el-form-item label="卡类型">
            <el-select v-model="form.cardType" placeholder="请选择">
              <el-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addVisible=false">取消</el-button>
          <el-button type="primary" @click="addCard" v-if="!editVisible">确定</el-button>
          <el-button type="primary" @click="editCard" v-else>确定</el-button>
        </span>
      </el-dialog>
      <!--删除-->
      <el-dialog title="温馨提示" :visible.sync="delVisible" width="300px" center>
        <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
        <span slot="footer" class="dialog-footer">
                <el-button @click="delVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteRow">确 定</el-button>
            </span>
      </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'cardList',
  data () {
    return {
      cardData: [],
      idx: -1,
      addVisible: false,
      editVisible: false,
      delVisible: false,
      dailogTitleType: '',
      form: {
        cardName: '',
        cardMoney: '',
        cardType: ''
      },
      options: [
        {
          value: 1,
          label: '月卡'
        },
        {
          value: 2,
          label: '储值卡'
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
      let agentPkid = sessionStorage.getItem('agentPkid')
      let pkid = {agentPkid: parseInt(agentPkid)}
      _this.axios.post('/api/agentOfCardOperate/findCardByAgentPkid', pkid, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.cardData = res.data.data
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
      const item = _this.cardData[index]
      _this.form = {
        cardName: item.cardName,
        cardMoney: item.cardMoney,
        cardType: item.cardType
      }
    },
    // 删除弹窗
    handleDel (index, row) {
      let _this = this
      _this.idx = index
      _this.delVisible = true
    },
    //  添加
    addCard () {
      let agentPkid = localStorage.getItem('agentPkid')
      let pkCode = localStorage.getItem('agentPkcode')
      let _this = this
      let formData = {
        cardName: _this.form.cardName,
        cardMoney: _this.form.cardMoney,
        cardType: _this.form.cardType,
        agentPkid: agentPkid,
        agentPkcode: pkCode
      }
      _this.axios.post('/api/agentOfCardOperate/addCard', formData, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.cardData = res.data.data
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
      const item = _this.cardData[index]
      let editData = {
        cardPkid: item.cardPkid,
        cardName: _this.form.cardName,
        cardMoney: _this.form.cardMoney,
        cardType: _this.form.cardType
      }
      _this.axios.post('/api/agentOfCardOperate/updateCard', editData, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.cardData = res.data.data
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
    //  删除
    deleteRow () {
      let _this = this
      let index = _this.idx
      var pkid = {cardPkid: _this.cardData[index].cardPkid}
      _this.axios.post('/api/agentOfCardOperate/deleteCardById', pkid, {
        headers: {'Content-Type': 'application/json'}
      }).then((res) => {
        if (res.data.success === '200') {
          _this.cardData.splice(index, 1)
          _this.$message.success('删除成功')
          _this.delVisible = false
          _this.getData()
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
