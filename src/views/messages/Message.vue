<script setup>
import { toRef, computed } from 'vue'
import { useStore } from 'vuex'
import MessageItem from './components/MessageItem'
import NavigationBar from '@/components/NavigationBar'

const store = useStore()
const messageList = toRef(store.state, 'chatMessageList')
const userList = computed(() =>
  Object.keys(messageList.value).sort((a, b) => {
    if (+a === -1) {
      // 梯仔的消息排在最前面
      return -1
    } else {
      return getLastMessage(messageList.value[a]).time >
        getLastMessage(messageList.value[b]).time
        ? -1
        : 1
    }
  })
)

const getLastMessage = (messageList) => {
  return messageList[messageList.length - 1]
}
</script>

<template>
  <div class="news-box">
    <div class="title-box"><span>消</span><span>息</span></div>
    <div class="message-box">
      <message-item
        v-for="(user, i) in userList"
        :key="i"
        :target="user"
        :text="getLastMessage(messageList[user]).message"
        :message="messageList[user]"
      />
      <!-- <message-item
        v-for="(message, target) of messageList"
        :key="target"
        :target="target"
        :text="message[message.length - 1].message"
        :message="message"
      /> -->
      <!-- <el-alert
        v-show="!wsConnectState"
        title="网络状态不佳，请检查网络设置"
        type="error"
        center
        show-icon
        :closable="false"
      /> -->
      <!-- <message-list
        :avatarUrl="
          content.targetId === 0
            ? ''
            : (messageTargetIdMap[content.targetId] &&
                messageTargetIdMap[content.targetId].Avatar) ||
              ''
        "
        :latestChat="content.content"
        :time="content.time"
        :username="
          content.targetId === 0
            ? '系统消息'
            : (messageTargetIdMap[content.targetId] &&
                messageTargetIdMap[content.targetId].NickName) ||
              ''
        "
        :type="content.Type || content.type"
        :newMsg="content.newMsg || 0"
        v-for="content in messageList"
        :key="content.fromUserID"
        @click="toChat(content.targetId)"
      /> -->
      <div
        v-if="messageList.length === 0"
        style="color: #4d4f55; text-align: center; padding: 1vh 6vw;"
      >
        现在还没有新消息哦，赶快去治愈他人吧！
      </div>
      <div style="color: #4d4f55; text-align: center; font-size: 12px;">
        温馨提示：消息记录仅保存在本地
      </div>
    </div>
    <navigation-bar currentPage="message" />
  </div>
</template>

<!-- <script>
import { mapState } from 'vuex'
import messageList from './components/MessageList'
import NavigationBar from '@/components/NavigationBar'
// import ws from '@/websocket/index'

export default {
  name: 'message',
  data() {
    return {}
  },
  computed: {
    ...mapState(['messageList', 'messageTargetIdMap', 'wsConnectState'])
  },
  components: {
    messageList,
    NavigationBar
  },
  methods: {
    toChat(targetId) {
      this.$router.push({
        path: '/chatRoom',
        query: {
          targetId
        }
      })
    }
  }
}
</script> -->

<style scoped>
.news-box {
  height: calc(100vh - 22vw);
  color: #fff;
}

.title-box {
  margin: 0 auto 5px;
  width: 80vw;
  height: 16vw;
  text-align: center;
  border-bottom: 2px solid #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.title-box span {
  padding: 0 30px;
  font-size: 6vw;
}

.message-box {
  height: calc(98vh - 36vw);
  overflow: auto;
}
</style>
