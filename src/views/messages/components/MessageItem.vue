<script setup>
import axios from '@/axios'
import { defineProps, ref, toRef, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  target: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  message: {
    type: Array
  }
})

const text = toRef(props, 'text')
const message = toRef(props, 'message')
const unreadNum = computed(
  () => message.value.filter((el) => !el.isRead).length
)

message.value.avatar = ''
message.value.nickname = ''

// const avatar = ref('')
// const nickname = ref('')

if (+props.target === -1) {
  // avatar.value =
  //   'http://cdn.healing2021.100steps.top/9658ba7835bd2ab3b091c30605bcd16.jpg'
  // nickname.value = '梯仔'

  message.value.avatar =
    'http://cdn.healing2021.100steps.top/9658ba7835bd2ab3b091c30605bcd16.jpg'
  message.value.nickname = '梯仔'
} else {
  axios
    .get('/callee?calleeId=' + props.target + '&module=1')
    .then((res) => {
      // avatar.value = res.data.message.avatar
      // nickname.value = res.data.message.nickname
      message.value.avatar = res.data.message.avatar
      message.value.nickname = res.data.message.nickname
    })
    .catch((err) => {
      console.error(err)
    })
}

const toChatroom = () => {
  router.push('/chatroom/' + props.target)
}
</script>

<template>
  <div class="message-item" @click="toChatroom">
    <div class="avatar-cell">
      <img :src="message.avatar" alt="" />
    </div>
    <div class="from-user">
      <span class="username">{{ message.nickname }}</span>
    </div>
    <div class="message">
      <div class="message-text">
        {{ text }}
      </div>
    </div>
    <div class="badge">
      <n-badge :value="unreadNum" :max="99" />
    </div>
  </div>
</template>

<style scoped>
.message-item {
  margin: 0 auto;
  width: 90vw;
  height: 80px;
  /* background-color: red; */
  display: grid;
  grid-template-columns: 80px 1fr 20vw 10vw;
  grid-template-rows: 1fr 1fr;
  user-select: none;
}

.avatar-cell {
  grid-row: span 2;
  grid-column: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-cell img {
  width: 60%;
  border-radius: 50%;
}

.from-user {
  grid-column: 2;
  grid-row: 1;
  display: flex;
  align-items: flex-end;
  font-size: 5vw;
}

.message {
  grid-column: 2 / 4;
  grid-row: 2;
  text-overflow: ellipsis;
}

.message-text {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 3.2vw;
}

.badge {
  grid-column: 4;
  grid-row: span 2;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
