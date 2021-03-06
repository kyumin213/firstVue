import Vue from 'vue'
import VeeValidate, {Validator} from 'vee-validate'
import zh from 'vee-validate/dist/locale/zh_CN'// 引入中文文件

// 配置中文
Validator.addLocale(zh)

const config = {
  errorBagName: 'errors',
  fieldsBagName: 'fieldBags',
  delay: 0,
  locale: 'zh_CN',
  messages: null,
  strict: true
}

Vue.use(VeeValidate, config, zh)

// 自定义validate
const dictionary = {
  zh_CN: {
    messages: {
      phone: () => '请输入正确的手机号码',
      required: (field) => '请输入' + field
    },
    attributes: {
      email: '邮箱',
      password: '密码',
      name: '账号',
      phone: '手机'
    }
  }
}

Validator.updateDictionary(dictionary)

const phone = {
  messages: {
    zh_CN: filed => filed + '必须是11位手机号码'
  },
  validate: value => {
    return value.length === 11 && /~((13|14|15|17|18)[0-9]{1}\d{8})$/.test(value)
  }
}
Validator.extend('phone', phone)
// Validator.extend('phone', {
//   messages: {
//     zh_CN: field => field + '必须是11位手机号码'
//   },
//   validate: value => {
//     return value.length === 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/.test(value)
//   }
// })
