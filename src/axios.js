import axios from 'axios'
import store from './store'

const instance = axios.create({
  baseURL: '/api',
  withCredentials: true
})

instance.interceptors.request.use(
  (config) => {
    if (config.setToast === undefined) config.setToast = true
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

instance.interceptors.response.use(
  (config) => {
    return config
  },
  (err) => {
    if (err.response.status === 401) {
      // 假登录
      // location =
      //   '/userEasy?redirect=' +
      //   encodeURIComponent(location.origin + location.pathname + location.hash)
      // 微信登录
      location =
        '/wx/jump2wechat?redirect=' +
        encodeURIComponent(location.origin + location.pathname + location.hash)
      // encodeURIComponent('https://healing2021.test.100steps.top')
    } else {
      if (err.config.setToast) {
        store.commit(
          'setToast',
          err.response?.data?.message || '出错了，请重试'
        )
      }
    }
    return Promise.reject(err)
  }
)

export default instance
