import { createStore } from 'vuex'

export default createStore({
  state: {
    isToastShow: false, // Toast是否显示
    toastTimeout: null, // 用于Toast的定时器
    toastText: '', // Toast信息,
    admin: false,
    user: {
      nickname: '',
      id: null,
      avatar: '',
      signature: '',
      phone_number: '',
      avatar_visible: 0,
      phone_search: 0,
      real_name_search: 0,
      selection_num: 0,
      hobby: []
    }, // 用户信息
    LastPersonalID: -1,
    //currentMusic：用于全局播放组件，播放歌曲就要更新这里的状态，用mutation的setCurrentMusic
    currentMusic: {
      //mode：normal为经典，能分享，devotion为献唱，不能分享，origin为童年原唱能分享，childhood为童年翻唱能分享，每一处能点播放的地方都要传
      mode: '',
      // classic_id：用于跳转分享页，只有童年处播放的歌要穿，其他的就传空字符串''或者不传
      classic_id: '',
      //icon：有得传图片的要传图片，可以不传，也可以传''空字符串
      icon: '',
      //song_name,singer,file,current_music_id以下四项必传
      song_name: '',
      singer: '',
      file: '',
      current_music_id: -1, //用于点赞正在播放的歌曲
      check: 0 //表示是否已点赞
    },
    chatMessageList: {}
  },
  getters: {
    unreadMsgNum(state) {
      let num = 0
      for (let user in state.chatMessageList) {
        num += state.chatMessageList[user].filter((el) => !el.isRead).length
      }
      return num
    },
    getUserID(state) {
      return state.user.id
    },
    getLastPersonalID(state) {
      return state.LastPersonalID
    }
  },
  mutations: {
    setToast(state, text) {
      if (!state.isToastShow) {
        state.isToastShow = true
        state.toastText = text
        state.toastTimeout = setTimeout(() => {
          state.isToastShow = false
        }, 1500)
      } else {
        clearInterval(state.toastTimeout)
        state.isToastShow = false
        ;(() => {
          return new Promise((resolve) => {
            setTimeout(() => {
              state.isToastShow = true
              state.toastText = text
              resolve()
            }, 100)
          })
        })().then(() => {
          state.toastTimeout = setTimeout(() => {
            state.isToastShow = false
          }, 1500)
        })
      }
    },
    setUser(state, user) {
      Object.assign(state.user, user)
    },
    setUserHobby(state, hobbies) {
      state.user.hobby = hobbies
    },
    reduceSelectionNum(state) {
      state.user.selection_num -= 1
    },
    setCurrentMusic(state, musicInfo) {
      state.currentMusic.mode = musicInfo.mode
      state.currentMusic.classic_id = musicInfo.classic_id
        ? musicInfo.classic_id
        : ''
      state.currentMusic.icon = musicInfo.icon ? musicInfo.icon : ''
      state.currentMusic.song_name = musicInfo.song_name
      state.currentMusic.singer = musicInfo.singer
      state.currentMusic.file = musicInfo.file
      state.currentMusic.current_music_id = musicInfo.current_music_id
        ? musicInfo.current_music_id
        : ''
      state.currentMusic.check = musicInfo.check
    },
    setLike(state) {
      state.currentMusic.check = state.currentMusic.check === 0 ? 1 : 0
    },
    setChatMessageList(state, MessageList) {
      Object.assign(state.chatMessageList, MessageList)
    },
    addChatMessage(state, { message, user }) {
      if (!state.chatMessageList[user]) {
        state.chatMessageList[user] = []
      }
      state.chatMessageList[user].push(message)

      const chatMessage = JSON.parse(localStorage.getItem('chatMessage'))
      if (!chatMessage[user]) {
        chatMessage[user] = []
      }
      chatMessage[user].push(message)
      localStorage.setItem('chatMessage', JSON.stringify(chatMessage))
    },
    setChatMessageRead(state, user) {
      state.chatMessageList[user]?.forEach((el) => (el.isRead = true))

      const chatMessage = JSON.parse(localStorage.getItem('chatMessage'))
      chatMessage[user]?.forEach((el) => (el.isRead = true))
      localStorage.setItem('chatMessage', JSON.stringify(chatMessage))
    },
    clearChatMessageList(state) {
      state.chatMessageList = {}
    },
    setLastPersonalID(state, id) {
      state.LastPersonalID = id
    },
    setAdmin(state, isAdmin) {
      state.admin = isAdmin
    }
  }
})
