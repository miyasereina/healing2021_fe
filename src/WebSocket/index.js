import store from '../store'
import axios from '../axios'

let ws
export default ws

let heartbeatInterval
const heartbeat = () => {
  return setInterval(() => {
    ws.send('heartbeat')
  }, 30 * 1000)
}

export const createWebSocket = (url) => {
  ws = new WebSocket(url)
  ws.onopen = () => {
    heartbeatInterval = heartbeat()

    const chatList = localStorage.getItem('chatMessage')
    if (!chatList) {
      localStorage.setItem('chatMessage', '{}')
    } else {
      store.commit('setChatMessageList', JSON.parse(chatList))
    }

    // axios
    //   .get('/ws/history')
    //   .then((res) => {
    //     console.log(res)
    //     historyHandler(res.data)
    //   })
    //   .catch((err) => {
    //     console.error(err)
    //   })

    // 清空消息记录
    // localStorage.setItem('chatMessage', '{}')
    // store.commit('clearChatMessageList')
  }
  ws.onmessage = (res) => {
    receiveMessage(res.data)
  }
  ws.onerror = (err) => {
    console.error(err)
  }
  ws.onclose = () => {
    clearInterval(heartbeatInterval)
    console.error('WebSocket has been closed!')
  }
}

export const clearMessageList = () => {
  // 清空消息记录
  localStorage.setItem('chatMessage', '{}')
  store.commit('clearChatMessageList')
}

const historyHandler = (history) => {
  const userMessageList = history.usr
  const systemMessageList = history.sys

  systemMessageList
    .filter((el) => el.isSend === 2 && +el.fromUser !== store.state.user.id)
    .reverse()
    .forEach((el) => {
      appendChatMessage(el, -1)
    })

  userMessageList
    .filter((el) => el.isSend === 2 && +el.fromUser !== store.state.user.id)
    .reverse()
    .forEach((el) => {
      const target =
        el.fromUser === store.state.user.id ? el.toUser : el.fromUser
      appendChatMessage(el, target)
    })
}

// 消息时间处理
const timeHandler = (message) => {
  if (message.time) {
    const [date, time] = message.time.split(/[T+\.]/)
    message.time = [date, time].join(' ')
  } else {
    const now = new Date()
    const year = now.getFullYear()
    const month = (now.getMonth() + 1 < 10 ? '0' : '') + (now.getMonth() + 1)
    const date = (now.getDate() < 10 ? '0' : '') + now.getDate()
    const hour = (now.getHours() < 10 ? '0' : '') + now.getHours()
    const minute = (now.getMinutes() < 10 ? '0' : '') + now.getMinutes()
    const second = (now.getSeconds() < 10 ? '0' : '') + now.getSeconds()
    message.time = `${year}-${month}-${date} ${hour}:${minute}:${second}`
  }
}

// 系统提示处理
const systemMessageHandler = (message) => {
  const systemMessagePattern = /^%%system%%([\s\S]*)$/

  if (systemMessagePattern.exec(message.message) !== null) {
    message.isSystem = true
    message.message = systemMessagePattern.exec(message.message)[1]
  }
}

// 拍一拍消息处理
const tickleHandler = (message) => {
  const ticklePattern = /^%%(\d+)%% 拍了拍 %%(\d+)%%$/

  if (ticklePattern.exec(message.message)) {
    // console.log(message)
    const [_, tickleFromID, tickleToID] = ticklePattern.exec(message.message)
    const tickleFrom =
      +tickleFromID === store.state.user.id ? '你' : message.fromUserName
    const tickleTo =
      +tickleToID === +tickleFromID
        ? '自己'
        : +tickleToID === store.state.user.id
        ? '你'
        : message.toUserName

    message.message = `${tickleFrom} 拍了拍 ${tickleTo}`
  }
}

// 系统用户（梯仔）的消息处理
const systemUserHandler = (message) => {
  const systemMessageMap = [
    '',
    `${message.fromUser} 点赞了你唱的《${message.song}》`, // 1 翻唱歌曲被点赞
    `${message.fromUser} 点赞了你的动态，进来看看吧～`, // 2 动态被点赞
    `${message.fromUser} 评论了你的动态，进来看看吧～`, // 3 动态被评论
    `${message.fromUser} 点赞了你的评论，进来看看吧～`, // 4 评论被点赞
    '', // 5 经典点歌被翻唱（不发系统消息，在用户窗口发送）
    `你唱的《${message.song}》被选上今日热榜啦！` // 6 歌曲评为热榜
  ]

  const systemLinkMap = [
    '',
    '/healingdetail/' + message.contentId, // 1 翻唱歌曲跳转治愈详情页
    '/dynamicdetail?id=' + message.contentId, // 2 跳转动态页
    '/dynamicdetail?id=' + message.contentId, // 3 跳转动态页
    '/dynamicdetail?id=' + message.contentId, // 4 跳转动态页
    '',
    '/healingDailyRank' // 6 跳转热榜页
  ]

  message.song = ''
  message.toUser = store.state.user.id
  message.message = systemMessageMap[+message.type]
  message.link = systemLinkMap[+message.type]
  message.fromUser = -1
}

const appendChatMessage = (message, user) => {
  timeHandler(message)

  systemMessageHandler(message)

  if (message.isSystem) {
    tickleHandler(message)
  } else if (+message.fromUser === store.state.user.id) {
    message.isRead = true
  } else {
    message.isRead = false
  }

  // 将用户装饰成系统用户
  if (message.type !== undefined) {
    user = -1
  }

  if (user === -1) {
    systemUserHandler(message)
  } else {
    if (message.song && message.song !== '') {
      message.link = '/healingdetail/' + message.songId
      message.message = `我给你唱了一首《${message.song}》，快进来听听看吧～`
    }
  }

  // // 自己点赞自己发出的系统消息不显示
  // if (message.uid !== store.state.user.id) {
  //   store.commit('addChatMessage', { message, user })
  // }

  store.commit('addChatMessage', { message, user })
}

export const receiveMessage = (msg) => {
  if (msg === 'Hello, ws!') return // 过滤连接回复
  if (msg === 'heartbeat') return // 过滤心跳检测
  if (msg === 'ok') return // 过滤发送回复

  msg = JSON.parse(msg)
  appendChatMessage(msg, msg.fromUser)
}

export const sendTextMessage = (toUser, message, targetNickname) => {
  const content = {
    fromUser: store.state.user.id,
    toUser,
    message
  }
  ws.send(JSON.stringify(content))

  content.fromUserName = store.state.user.nickname
  content.toUserName = targetNickname
  appendChatMessage(content, toUser)
}

export const sendSystemMessage = (toUser, message, targetNickname) => {
  const content = {
    fromUser: store.state.user.id,
    toUser,
    message: '%%system%%' + message
  }
  ws.send(JSON.stringify(content))

  content.fromUserName = store.state.user.nickname
  content.toUserName = targetNickname
  appendChatMessage(content, toUser)
}

export const sendRecordMessage = (toUser, songName, songID) => {
  const content = {
    fromUser: store.state.user.id,
    toUser,
    message: `我给你唱了一首《${songName}》，快进来听听看吧～`,
    link: '/healingdetail/' + songID
  }

  appendChatMessage(content, toUser)
}
