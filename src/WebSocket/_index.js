// 这里进行全局处理，localstorage之类的管理在这里进行
// 页面的逻辑，通过设置observer进行操作
import vuex from '@/store/index'
import axios from 'axios'
import healing from '@/main.js'

// Notifications API
if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission()
}
function notify (body) {
  if (!('Notification' in window)) return
  if (Notification.permission === 'granted') {
    return new Notification('治愈系', {
      body
    })
  }
}

function getDatetime () {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const day = now.getDate()
  const hh = now.getHours()
  const mm = now.getMinutes()
  const ss = now.getSeconds()
  let clock = year + '-'
  if (month < 10) clock += '0'
  clock += month + '-'
  if (day < 10) clock += '0'
  clock += day + ' '
  if (hh < 10) clock += '0'
  clock += hh + ':'
  if (mm < 10) clock += '0'
  clock += mm + ':'
  if (ss < 10) clock += '0'
  clock += ss
  return clock
}
// 储存聊天对象信息
function addMessageTarget (id) {
  axios.get(`/usermodel/${id}`).then(res => {
    // console.log(res.data)
    const { Avatar, ID, NickName } = res.data
    vuex.commit('addMessageTarget', { id: ID, obj: { Avatar, ID, NickName } })
  })
}
// 更新聊天记录
function updateMessageStroage (targetId, newData) {
  const itemKey = 'target' + targetId
  const data = (() => {
    try {
      return JSON.parse(localStorage.getItem(itemKey) || '[]')
    } catch (e) {
      console.error(e)
    }
    return []
  })()
  let hasSameMsg = false
  const index = (() => {
    // 先检查一遍重复id
    for (let i = data.length; i--;) {
      if (data[i].id === newData.id) {
        hasSameMsg = true
        return i + 1
      }
    }
    // 再根据时间插入
    for (let i = data.length; i--;) {
      if (!data[i].time) {
        return i + 1
      }
      if (new Date(data[i].time.replace(/-/g, '/')).getTime() <= new Date(newData.time.replace(/-/g, '/')).getTime()) {
        if (data[i].id === newData.id) hasSameMsg = true
        return i + 1
      }
    }
    return 0
  })()
  // 收到重复id的消息就不管了
  if (hasSameMsg) return
  // data.push(newData)
  data.splice(index, 0, newData) // 确保其按时间顺序排列
  localStorage.setItem(itemKey, JSON.stringify(data))
}
// 消息发送后状态更新
function updateMessageStatus (msgId, status) {
  if (!messageCheckList[msgId]) return
  const { targetId } = messageCheckList[msgId]
  const itemKey = 'target' + targetId
  const data = (() => {
    try {
      return JSON.parse(localStorage.getItem(itemKey) || '[]')
    } catch (e) {
      console.error(e)
    }
    return []
  })()
  const msg = data.find(item => item.id === msgId)
  if (msg) {
    if (status === 'success') {
      delete msg.status
    } else {
      msg.status = status
    }
  }
  clearTimeout(messageCheckList[msgId].timeout)
  delete messageCheckList[msgId]
  localStorage.setItem(itemKey, JSON.stringify(data))
  if (typeof observer.updateMessageStatus === 'function') {
    observer.updateMessageStatus({
      targetId,
      id: msgId,
      status
    })
  }
}
// 导入聊天记录时用，data为单个message
function saveMessage (data) {
  if (data.fromUserID && !vuex.state.messageTargetIdMap[data.fromUserID]) {
    addMessageTarget(data.fromUserID)
  }
  if (data.toUserID && !vuex.state.messageTargetIdMap[data.toUserID]) {
    addMessageTarget(data.toUserID)
  }
  vuex.commit('addMessageList', { ...data })
  updateMessageStroage(data.fromUserID === vuex.state.userData.ID ? data.toUserID : data.fromUserID, data)
}

const evtHandler = {
  message (data) {
    // console.log(data)
    if (data.fromUserID && !vuex.state.messageTargetIdMap[data.fromUserID]) {
      addMessageTarget(data.fromUserID)
    }
    if (data.toUserID && !vuex.state.messageTargetIdMap[data.toUserID]) {
      addMessageTarget(data.toUserID)
    }
    // 更新消息页列表
    vuex.commit('addMessageList', { ...data })
    // 更新聊天记录
    updateMessageStroage(data.fromUserID === vuex.state.userData.ID ? data.toUserID : data.fromUserID, data)
    if (!document.hasFocus()) {
      const n = notify(`[新消息]${data.content || ''}`)
      if (n) {
        n.onclick = () => {
          if (healing.$route.path !== '/chat' && healing.$route.path !== '/chatRoom') {
            healing.$router.push({
              path: '/chat'
            })
          }
          window.focus()
        }
      }
    }
    if (typeof observer.message === 'function') {
      observer.message(data)
    }
    send.ack(data.id)
  },
  ack (data) {
    updateMessageStatus(data.ack, 'success')
    // console.log(data, messageCheckList)
  }
}

// 消息观察者
const observer = {
  message () {},
  updateMessageStatus () {}
}
// 消息发送后确认队列
const messageCheckList = {}

let ws
let retryTimes = 0
function connect () {
  ws = new WebSocket(
    `${location.protocol === 'http:' ? 'ws' : 'wss'}://${location.host}/api/ws`
  )
  ws.onopen = () => {
    vuex.commit('setWsConnectState', true)
    retryTimes = 0
  }
  ws.onmessage = res => {
    if (res.data === 'hb') return // 心跳不管
    try {
      const data = JSON.parse(res.data)
      if (data.ack) return evtHandler.ack(data)
      evtHandler.message(data)
    } catch (e) {
      console.error('WebSocket error: Data is not object!', res.data)
    }
  }
  ws.onerror = evt => {
    // 触发error事件后必定关闭连接
    // vuex.commit('setWsConnectState', false)
    console.error('WebSocket error observed:', evt)
    // healing.$notify({
    //   title: '警告',
    //   message: '与服务器连接异常，请检查网络状况并刷新重试',
    //   type: 'warning'
    // })
  }
  ws.onclose = () => {
    vuex.commit('setWsConnectState', false)
    console.error('WebSocket has been closed!')
    if (retryTimes < 3) {
      retryTimes++
      ws = connect()
    } else {
      healing.$notify({
        title: '警告',
        message: '与服务器连接断开，请检查网络状况并刷新重试',
        type: 'warning'
      })
    }
  }
  return ws
}

function send (data) {
  ws.send(data)
}
// 聊天室内发消息
send.message = (fromUserID, toUserID, content) => {
  if (!vuex.state.messageTargetIdMap[fromUserID]) {
    addMessageTarget(fromUserID)
  }
  if (!vuex.state.messageTargetIdMap[toUserID]) {
    addMessageTarget(toUserID)
  }
  const time = getDatetime()
  const data = {
    id: fromUserID + Date.now().toString(16) + toUserID,
    content,
    type: 2,
    time,
    fromUserID,
    toUserID
  }
  ws.send(
    JSON.stringify(data)
  )
  vuex.commit('addMessageList', { ...data })
  const targetId = toUserID !== vuex.state.userData.ID ? toUserID : fromUserID
  data.status = 'uploading'
  updateMessageStroage(targetId, data)
  messageCheckList[data.id] = {
    targetId,
    id: data.id,
    timeout: setTimeout(() => {
      updateMessageStatus(data.id, 'error')
    }, 30000)
  }
  return data
}
// 发送ack
send.ack = ack => {
  ws.send(
    JSON.stringify({
      ack
    })
  )
}

// 设置消息观察者
function setObserver (key, func) {
  observer[key] = func
}

export default {
  webSocket: ws,
  connect,
  addMessageTarget,
  setObserver,
  send,
  saveMessage
}
