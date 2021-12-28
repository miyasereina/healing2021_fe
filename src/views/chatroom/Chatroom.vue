<script>
export default {
  name: 'Chatroom'
}
</script>

<script setup>
import { ref, toRef, watch, nextTick, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { sendTextMessage, sendSystemMessage } from '../../WebSocket'
import axios from '@/axios'
import BackBtn from '../../components/BackBtn.vue'
import ReceiveChat from './components/ReceiveChat.vue'
import SendChat from './components/SendChat.vue'
import ReceiveLink from './components/ReceiveLink.vue'
import SendLink from './components/SendLink.vue'
import SystemInfo from './components/SystemInfo.vue'
import InputChat from './components/InputChat.vue'

const route = useRoute()
const router = useRouter()
const store = useStore()

// const chatTarget = '一个很长很长很长很长很长很长很长很长的id'
const chatTarget = route.params.target
const messageList = toRef(store.state.chatMessageList, chatTarget)

const toPersonal = () => {
  router.push({
    path: '/personal',
    query: {
      id: chatTarget
    }
  })
}

const targetNickname = ref('')
const targetAvatar = ref('')

const chatList = ref(null)
const updateScrollHeight = () => {
  nextTick(() => {
    chatList.value.scrollTop = chatList.value.scrollHeight
  })
}

onMounted(() => store.commit('setChatMessageRead', chatTarget))

// 初始化页面时更新高度
watch(chatList, () => {
  updateScrollHeight()
})

// 收发消息时更新高度
watch(
  () => store.state.chatMessageList[chatTarget],
  () => {
    updateScrollHeight()
    store.commit('setChatMessageRead', chatTarget)
  },
  {
    deep: true
  }
)
if (+chatTarget === -1) {
  targetNickname.value = '梯仔'
  targetAvatar.value =
    'http://cdn.healing2021.100steps.top/9658ba7835bd2ab3b091c30605bcd16.jpg'
} else {
  axios
    .get('/callee', {
      params: {
        calleeId: chatTarget,
        module: 1
      }
    })
    .then((res) => {
      targetNickname.value = res.data.message.nickname
      targetAvatar.value = res.data.message.avatar
    })
    .catch((err) => {
      console.error(err)
    })
}

const sendMessage = (content) => {
  if (!content) return
  sendTextMessage(+chatTarget, content, targetNickname.value)
}

// 10s内只能拍一次
let canTickle = true
let duration = 10

const tickle = (self = false) => {
  if (!canTickle) {
    store.commit('setToast', '休息一下再拍哦')
    return
  }

  canTickle = false
  setTimeout(() => {
    canTickle = true
  }, duration * 1000)

  sendSystemMessage(
    +chatTarget,
    `%%${store.state.user.id}%% 拍了拍 %%${
      self ? store.state.user.id : chatTarget
    }%%`,
    targetNickname.value
  )
}
</script>

<template>
  <div class="chat-box">
    <div class="title-box">
      <back-btn />
      <div class="chatroom-name">
        <div class="badge">
          <n-badge :value="$store.getters.unreadMsgNum" :max="99" />
        </div>
        <div class="chatroom-name-text" @click="toPersonal">
          {{ targetNickname }}
        </div>
      </div>
    </div>
    <div class="chat-list" ref="chatList">
      <template v-for="(msg, i) in messageList" :key="i">
        <system-info v-if="msg.isSystem" :content="msg.message" />
        <template v-else-if="msg.link">
          <receive-link
            v-if="msg.fromUser === +chatTarget"
            :content="msg.message"
            :avatarUrl="targetAvatar"
            :time="msg.time"
            :link="msg.link"
            @tickle="tickle"
          />
          <send-link
            v-else-if="msg.toUser === +chatTarget"
            :content="msg.message"
            :avatarUrl="$store.state.user.avatar"
            :time="msg.time"
            :link="msg.link"
            @tickle="tickle(true)"
          />
        </template>
        <template v-else>
          <receive-chat
            v-if="msg.fromUser === +chatTarget"
            :avatarUrl="targetAvatar"
            :content="msg.message"
            :time="msg.time"
            @tickle="tickle"
          />
          <send-chat
            v-else-if="msg.toUser === +chatTarget"
            :avatarUrl="$store.state.user.avatar"
            :content="msg.message"
            :time="msg.time"
            @tickle="tickle(true)"
          />
        </template>
      </template>
      <!-- <system-info
        :content="
          '这是一条系统通知这是一条系统通知这是一条系统通知这是一条系统通知'
        "
      /> -->
    </div>
    <!-- <div class="chat-list" style="font-size: 4vw;" ref="messageList">
      <div class="chat-item" v-for="(item, index) in messageList" :key="index">
        <receive-chat
          v-if="item.type !== 1 && item.fromUserID !== userData.ID && item.time"
          :avatarUrl="
            (messageTargetIdMap[item.fromUserID] && messageTargetIdMap[item.fromUserID].Avatar) ||
            (item.fromUserID === 0 && 'http://cdn.hikarihui.cn/healing2021/system-message-avatar.png')
          "
          :content="item.content"
          :time="item.time"
        />
        <send-chat
          v-else-if="
            item.type !== 1 && item.fromUserID === userData.ID && item.time
          "
          :avatarUrl="
            messageTargetIdMap[item.fromUserID] &&
            messageTargetIdMap[item.fromUserID].Avatar
          "
          :content="item.content"
          :time="item.time"
          :status="item.status"
        />
        <send-audio
          v-else-if="item.type === 1 && item.fromUserID === userData.ID"
          :url="item.url"
          :name="item.content"
          :avatarUrl="
            messageTargetIdMap[item.fromUserID] &&
            messageTargetIdMap[item.fromUserID].Avatar
          "
          :time="item.time"
        />
        <receive-audio
          v-else-if="item.type === 1 && item.fromUserID !== userData.ID"
          :url="item.url"
          :name="item.content"
          :avatarUrl="
            (messageTargetIdMap[item.fromUserID] && messageTargetIdMap[item.fromUserID].Avatar) ||
            (item.fromUserID === 0 && 'http://cdn.hikarihui.cn/healing2021/system-message-avatar.png')
          "
          :time="item.time"
        />
        <system-info v-else :content="item.content" />
      </div>
    </div> -->
    <!-- <el-tooltip effect="light" content="有新消息" placement="top-end" :value="hasNewMsg && targetId !== 0" manual>
      <input-chat v-show="targetId !== 0" ref="inputChat" @send="sendMessage" />
    </el-tooltip> -->
    <input-chat @send="sendMessage" />
    <!-- <el-tooltip effect="light" content="有新消息" placement="top-end" :value="hasNewMsg && targetId === 0" manual>
      <div
        style="
          position: fixed;
          bottom: 0;
          left: 0;
          height: 0;
          width: 100vw;
        "
      ></div>
    </el-tooltip> -->
  </div>
</template>

<!-- <script>
import { mapState } from 'vuex'

import ws from '@/websocket/index'

import TobBar from '../../components/TobBar.vue'
import NavTitle from '@/components/NavTitle'
import ReceiveChat from './components/ReceiveChat.vue'
import SendChat from './components/SendChat.vue'
import SendAudio from './components/SendAudio.vue'
import SystemInfo from './components/SystemInfo.vue'
import InputChat from './components/InputChat.vue'
import receiveAudio from './components/ReceiveAudio.vue'

export default {
  name:'chatroom',
  components: { TobBar, ReceiveChat, NavTitle, SendChat, SendAudio, SystemInfo, InputChat, receiveAudio},
  data () {
    return {
      targetId: 0,
      chatList: [],
      hasNewMsg: false
    }
  },
  computed: {
    ...mapState(['userData', 'wsConnectState', 'messageTargetIdMap'])
  },
  mounted () {
    this.$refs.chatList.addEventListener('scroll', () => {
      if (this.$refs.chatList.clientHeight + this.$refs.chatList.scrollTop + 10 >= this.$refs.chatList.scrollHeight && this.hasNewMsg) {
        this.hasNewMsg = false
      }
    })
  },
  activated () {
    // console.log('chat room activated!')
    this.targetId = parseInt(this.$route.query.targetId)
    this.$store.commit('clearMessageListNewMsg', this.targetId)
    // 更新聊天对象信息
    this.targetId && ws.addMessageTarget(this.targetId)
    this.chatList = (() => {
      try {
        return JSON.parse(
          localStorage.getItem('target' + this.targetId) || '[]'
        )
      } catch (e) {
        console.error(e)
      }
      return []
    })()
    this.chatList.forEach((cur, i) => {
      if (cur.status === 'uploading') {
        cur.status = 'error'
      }
    })
    ws.setObserver('message', data => {
      // 不是这个聊天对象的
      if (data.fromUserID !== this.targetId) return
      // 发给我自己的
      if (data.fromUserID === this.userData.ID) return
      this.chatList.push(data)
      if (this.$refs.chatList.clientHeight + this.$refs.chatList.scrollTop + 10 >= this.$refs.chatList.scrollHeight) {
        this.$nextTick(() => {
          this.$refs.chatList.scrollTop = this.$refs.chatList.scrollHeight
        })
      } else {
        this.hasNewMsg = true
      }
    })
    ws.setObserver('updateMessageStatus', ({ targetId, id, status }) => {
      if (targetId !== this.targetId) return
      const msgIndex = this.chatList.findIndex(item => item.id === id)
      if (msgIndex !== -1) {
        this.chatList[msgIndex].status = status
        this.$set(this.chatList, msgIndex, this.chatList[msgIndex])
      }
    })
    this.$nextTick(() => {
      this.$refs.chatList.scrollTop = this.$refs.chatList.scrollHeight
    })
  },
  deactivated () {
    // console.log('chat room deactivated!')
    ws.setObserver('message', () => {})
    ws.setObserver('updateMessageStatus', () => {})
  },
  methods: {
    tomessage () {
      this.$router.push('/message')
    },
    sendMessage (content) {
      if (!content) return
      if (this.wsConnectState) {
        // console.log(`send ${content}`)
        this.chatList.push(
          ws.send.message(this.userData.ID, this.targetId, content)
        )
        this.$refs.inputChat.clear()
        this.$nextTick(() => {
          this.$refs.chatList.scrollTop = this.$refs.chatList.scrollHeight
        })
      } else {
        this.$message.error('网络状态不佳，请检查网络设置')
      }
    }
  }
}
</script> -->

<style scoped>
.chat-box {
  height: 100vh;
}

.title-box {
  margin: 0 auto 5px;
  width: 100vw;
  height: 16vw;
  text-align: center;
  display: flex;
}

.chatroom-name {
  width: 80vw;
  border-bottom: 2px solid #fff;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 5vw;
}

.chatroom-name .badge {
  position: absolute;
  left: 0;
}

.chatroom-name-text {
  width: 60vw;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-list {
  height: calc(100vh - 40vw);
  overflow-y: scroll;
  overflow-x: hidden;
  width: 100%;
}
</style>
