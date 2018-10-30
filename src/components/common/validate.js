const validatePhone = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入手机号'))
  } else {
    const reg = /^1[3|4|5|7|8|9][0-9]\d{8}$/
    // console.log(reg.test(value))
    if (reg.test(value)) {
      callback()
    } else {
      return callback(new Error('请输入正确的手机号'))
    }
  }
}

const validateNames = (rule, value, callback) => {
  if (value === '' || value === null) {
    callback(new Error('请输入昵称'))
  } else {
    const reg = /^[\u4e00-\u9fa5a-z]+$/gi
    if (reg.test(value)) {
      callback()
    } else {
      return callback(new Error('昵称不能包含空格和特殊字符'))
    }
  }
}
const validateAge = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入年龄'))
  } else if (value > 120) {
    callback(new Error('年龄不能大于120'))
  } else {
    callback()
  }
}
const hasTime = (rule, value, callback) => {
  if (value <= 0) {
    callback(new Error('有效期不能小于0'))
  } else {
    let reg = /^[^,]+(,[^,]+)*$/
    if (reg.test(value)) {
      callback()
    } else {
      return callback(new Error('不能输入中文逗号'))
    }
  }
}
const flagNum = (rule, value, callback) => {
  if (value.length > 8) {
    callback(new Error('标签不能超过8个字符'))
  } else {
    callback()
  }
}
const courseNameNum = (rule, value, callback) => {
  if (value.length > 20) {
    callback(new Error('名称不能超过20个字符'))
  } else {
    callback()
  }
}
// 卡名称

const cardNameNum = (rule, value, callback) => {
  if (value.length > 10) {
    callback(new Error('名称不能超过10个字符'))
  } else {
    callback()
  }
}
export default {
  validatePhone, validateAge, hasTime, validateNames, flagNum, courseNameNum, cardNameNum
}
