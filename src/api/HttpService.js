import axios from 'axios'
let baseURL = 'http://120.79.180.164:8091'
let axiosConfig = {
  baseURL,
  timeout: 1000
}
let instanceConfig = axios.create(axiosConfig)
export default {
  getAxios: instanceConfig,
  getCancelToken: axios.CancelToken
}
