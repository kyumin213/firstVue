<template>
  <div class="login-wrap">
    <div class="ms-title">后台管理系统</div>
    <div class="ms-login">
      <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="80px" class="demo-ruleForm">
        <el-form-item prop="userAccountName" label="用户名">
          <el-input v-model="ruleForm.userAccountName" placeholder="username"></el-input>
        </el-form-item>
        <el-form-item prop="userAccountPwd" label="密码">
          <el-input type="password" placeholder="password" v-model="ruleForm.userAccountPwd"
                    @keyup.enter.native="submitForm('ruleForm')"></el-input>
        </el-form-item>
        <div class="login-btn">
          <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        </div>
        <!--<p style="font-size:12px;line-height:30px;color:#999;">Tips : 用户名和密码随便填。</p>-->
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data: function () {
    return {
      loginDatas: [],
      ruleForm: {
        userAccountName: '',
        userAccountPwd: ''
      },
      rules: {
        userAccountName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        userAccountPwd: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      let _this = this
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      let h = date.getHours()
      let m = date.getMinutes()
      let s = date.getSeconds()
      if (month < 10) {
        month = '0' + month
      }
      if (day < 10) {
        day = '0' + day
      }
      if (h < 10) {
        h = '0' + h
      }
      if (m < 10) {
        m = '0' + m
      }
      if (s < 10) {
        s = '0' + s
      }
      let times = year + '-' + month + '-' + day + ' ' + h + ':' + m + ':' + s
      let loginData = {
        userAccountName: _this.ruleForm.userAccountName,
        userAccountPwd: _this.ruleForm.userAccountPwd
      }
      _this.axios.post(this.GLOBAL.BASE_URL + '/login', loginData,
        {
          headers: {'Content-Type': 'application/json'}
        }).then((res) => {
        if (res.data.success === '200') {
          _this.loginDatas = res.data.data
          sessionStorage.setItem('times', times)
          let role = _this.loginDatas.userAccountToken
          if (res.data.data.userAccountInfo) {
            if (res.data.data.userAccountInfo.storePkcode) {
              sessionStorage.setItem('storePkcode', _this.loginDatas.userAccountInfo.storePkcode)
              sessionStorage.setItem('storePkid', _this.loginDatas.userAccountInfo.storePkid)
            } else if (res.data.data.userAccountInfo.agentPkcode) {
              sessionStorage.setItem('agentPkcode', _this.loginDatas.userAccountInfo.agentPkcode)
              sessionStorage.setItem('agentPkid', _this.loginDatas.userAccountInfo.agentPkid)
            }
          }
          sessionStorage.setItem('userName', _this.ruleForm.userAccountName)
          sessionStorage.setItem('userPwd', _this.ruleForm.userAccountPwd)
          sessionStorage.setItem('userPkcode', _this.loginDatas.userAccountPkcode)
          sessionStorage.setItem('userAccountPkid', _this.loginDatas.userAccountPkid)
          sessionStorage.setItem('token', role)
          axios.defaults.headers.common['token'] = role
          this.$router.push('/')
        } else {
          _this.$message.error(res.data.message)
          return false
        }
      }).catch((error) => {
        console.log(error)
        _this.$message.error('系统异常，登录失败')
      })
      this.$refs[formName].validate((valid) => {
        if (valid) {
          localStorage.setItem('ms_username', this.ruleForm.username)
          this.$router.push('/')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style>
  .login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .ms-title {
    position: absolute;
    top: 50%;
    width: 100%;
    margin-top: -230px;
    text-align: center;
    font-size: 30px;
    color: #fff;

  }

  .ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 340px;
    height: 200px;
    margin: -150px 0 0 -170px;
    padding: 40px;
    border-radius: 5px;
    background: #fff;
    box-sizing: border-box;
  }

  .login-btn {
    text-align: center;
  }

  .login-btn button {
    width: 100%;
    height: 36px;
  }
</style>
