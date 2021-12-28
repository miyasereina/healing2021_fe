import wx from 'weixin-js-sdk'
import store from '../store'
import axios from '../axios'
export { useWXRecord } from './useWXRecord.js'

const baseURL =
  process.env.NODE_ENV === 'production'
    ? 'https://apiv3.100steps.top/api/bbtwoa/jssdk'
    : '/bbtwoa/jssdk'

const jsAPIList = [
  'updateAppMessageShareData',
  'updateTimelineShareData',
  'hideMenuItems',
  'startRecord',
  'stopRecord',
  'onVoiceRecordEnd',
  'playVoice',
  'pauseVoice',
  'stopVoice',
  'onVoicePlayEnd',
  'uploadVoice',
  'downloadVoice'
]

const debug = false
const shareData = {
  title: '治愈系', // 分享标题
  desc: '治愈系 - 忆梦童年，愈暖人心', // 分享描述
  link: 'https://healing2021.100steps.top/',
  imgUrl: 'http://cdn.healing2021.100steps.top/B119F9F5-8079-4ECE-AAB7-DCC791E079A6.jpeg' // 分享图标
}

const getJSSDK = () => {
  let apiQuery = ''
  jsAPIList.forEach((value, index) => {
    apiQuery += index === 0 ? '?' : '&'
    const queryItem = 'type=' + value
    apiQuery += queryItem
  })

  return axios({
    url: baseURL + apiQuery,
    baseURL: ''
  }).then((res) => {
    const response = res.data
    response.debug = debug || false
    return response
  })
}

const ready = () => {
  wx.ready(() => {
    wx.hideMenuItems({
      menuList: [
        'menuItem:copyUrl',
        'menuItem:openWithQQBrowser',
        'menuItem:openWithSafari'
      ] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
    })
    wx.updateAppMessageShareData(shareData)
    wx.updateTimelineShareData(shareData)
  })
}

const error = () => {
  wx.error((err) => {
    console.error(err)
    store.commit('setToast', err)
  })
}

const init = () => {
  getJSSDK()
    .then((config) => {
      wx.config(config)
      ready()
      error
    })
    .catch((err) => {
      console.error(err)
    })
}

export default {
  init
}
