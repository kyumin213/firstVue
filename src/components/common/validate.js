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
// 教练昵称
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

// 教练名称
const validateCoachNames = (rule, value, callback) => {
  if (value === '' || value === null) {
    callback(new Error('请输入名称'))
  } else if (value.length > 4) {
    return callback(new Error('名称不能大于4个字符'))
  } else {
    const reg = /^[\u4e00-\u9fa5a-z]+$/gi
    if (reg.test(value)) {
      callback()
    } else {
      return callback(new Error('名称不能包含空格和特殊字符'))
    }
  }
}
// 年龄
const validateAge = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入年龄'))
  } else if (value > 120) {
    callback(new Error('年龄不能大于120'))
  } else if (value.length > 3) {
    callback(new Error('年龄不能大于三位数'))
  } else {
    callback()
  }
}
// 有效期
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
// 标签
const flagNum = (rule, value, callback) => {
  if (value.length > 8) {
    callback(new Error('标签不能超过8个字符'))
  } else {
    callback()
  }
}
// 课程名称
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
// 课程发布信息数字长度验证
const courseLength = (rule, value, callback) => {
  if (value < 0.01) {
    callback(new Error('值不能小于1'))
  } else if (value.length > 8) {
    callback(new Error('不能大于5位数'))
  } else {
    const reg = /^\d+(?:\.\d{1,2})?$/
    if (reg.test(value)) {
      callback()
    } else {
      callback(new Error('不能大于两位小数点'))
    }
  }
}

const numbers = (rule, value, callback) => {
  const reg = /^\+?[1-9][0-9]*$/
  if (value.length > 5) {
    callback(new Error('不能超过五位数'))
  } else if (reg.test(value)) {
    callback()
  } else {
    callback(new Error('必须为整数'))
  }
}
// 有效期
const hasMonth = (rule, value, callback) => {
  if (value.length > 3) {
    callback(new Error('不能超过3个字符'))
  } else {
    callback()
  }
}
export default {
  validatePhone, validateAge, hasTime, validateNames, flagNum, courseNameNum, cardNameNum, courseLength, numbers, hasMonth, validateCoachNames
}
