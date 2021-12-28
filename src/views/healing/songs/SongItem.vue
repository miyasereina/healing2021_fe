<script setup>
import { defineProps, toRef, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/axios'
import { sendTextMessage } from '@/WebSocket'
import { useStore } from 'vuex'
const store = useStore()

const props = defineProps({
  songData: {
    type: Object
  }
})
const songData = toRef(props, 'songData')
const date = computed(() => songData.value.created_at?.split('T')[0])
const isSing = computed(() => songData.value.file === undefined)
const isLike = ref(songData.value.check === 1)
const router = useRouter()
let ifPop = ref(0)
let box = ref(null)
let turn = ref(null)

const toRecord = () => {
  router.push({
    path: '/record',
    query: {
      type: 'normal',
      id: songData.value.id,
      name: songData.value.song_name,
      user: songData.value.user_id
    }
  })
}
   function isDisturbTime (time) {
      return time.hour < 9 || (time.hour === 23 && time.minute >= 30)
    }
const toPhoneCall = () => {
  const nowTime = new Date()
  const hour = nowTime.getHours()
  const minute = nowTime.getMinutes()
  const time = {
    hour,
    minute
  }
  // alert(time.hour)
  // alert(time.minute)
  if (isDisturbTime(time)) {
    store.commit('setToast','23：30~9：00是免打扰时段哦')
  } else {
    const phone = songData.value.phone_number

    if (phone !== '') {
      location.href = `tel:${phone}`
      sendTextMessage(songData.value.user_id, '我向你发起了语音通话，现在我们可以聊天啦！', songData.value.nickname)
    } else {
      store.commit('setToast','对方没有留手机号哦，给他录一段音吧')
    }
  }
}

// const isLike = ref(false)
const likeImg = computed(() =>
  require(`../../../assets/shixin${isLike.value ? '1' : ''}.png`)
)

const likeSong = () => {
  axios
    .put('/like', {
      todo: isLike.value ? -1 : 1,
      type: 3,
      id: songData.value.id
    })
    .then((res) => {
      console.log(res)
      isLike.value = !isLike.value
      if (isLike.value === false) {
        songData.value.likes--
      } else {
        songData.value.likes++
      }
    })
    .catch((err) => {
      console.error(err)
    })
}

const toDetail = () => {
  // console.log(songData.value);
  router.push('/healingdetail/' + songData.value.selection_id)
}

function pop() {
  console.log(ifPop.value)
  ifPop.value = 1
  console.log(ifPop.value)
  turn.value.style['z-index'] = 15
  box.value.style.top = -box.value.getBoundingClientRect().y + 150 + 'px'
}
function closePop() {
  if (ifPop.value === 1) {
    ifPop.value = 0
    box.value.style.top = 0
    setTimeout(() => {
      turn.value.style['z-index'] = 0
    }, 600)
  }
}

const toPersonal = () => {
  router.push({
    path: '/personal',
    query: {
      id: songData.value.user_id
    }
  })
}
</script>

<template>
  <div class="turn" ref="turn" @click="closePop">
    <div :class="['box', ifPop === 0 ? 'box-before' : 'box-after']" ref="box">
      <div :class="['song-item', ifPop === 1 ? 'song-item-after' : '']">
        <div class="user-avatar">
          <div class="avatar-img">
            <img @click="toPersonal" :src="songData.avatar" alt="" />
          </div>
        </div>
        <div class="username">
          {{ songData.nickname }}
        </div>
        <div class="song-date">
          {{ date }}
        </div>
        <div class="song-name">
          <div class="song-name-text">{{ songData.song_name }}</div>
        </div>
        <div class="like">
          <div class="microphone" v-if="isSing" @click.stop="pop">
            <img src="../../../assets/huatong.png" alt="" />
          </div>
          <div class="like-content" v-else>
            <div class="like-img" @click.stop="likeSong">
              <img :src="likeImg" alt="" />
            </div>
            <div class="like-num">{{ songData.likes }}</div>
          </div>
        </div>
        <div class="to-detail" v-if="!isSing">
          <div class="like-img" @click="toDetail">
            <img src="../../../assets/xiayishou.png" alt="" />
          </div>
        </div>
      </div>
      <div class="back" @click.stop="">
        <img src="@/assets/plate-dynamic.png" alt="" class="kite" />
        <div class="name">
          {{ songData.song_name }}
        </div>
        <div class="desc">
          {{ songData.remark ? songData.remark : `我点了一首《${songData.song_name}》，快来治愈我吧~` }}
        </div>
        <div class="btns">
          <div class="call" @click="toPhoneCall">电话治愈</div>
          <div class="record" @click="toRecord">录音治愈</div>
        </div>
      </div>
    </div>
  </div>
  <div :class="['mask', ifPop === 1 ? 'show' : '']" @click="closePop"></div>
</template>

<!-- <script>
import axios from '@/axios'

export default {
  name: 'songItem',
  data() {
    return {
      isLiked: this.songData.isPraise,
      likeTimeout: null,
      hasTimeout: false,
      likeNum: this.songData.like
    }
  },
  computed: {
    likeImage() {
      return this.isLiked
        ? 'http://cdn.healing2020.100steps.top/static/components/likeon.png'
        : 'http://cdn.healing2020.100steps.top/static/components/likeoff.png'
    },
    itemData() {
      return {
        // top: this.songItem.getBoundingClientRect().top,
        // left: this.songItem.offsetLeft, // 由于要拿的东西实在太多，直接传一个DOM元素过去
        itemDOM: this.songItem,
        songData: this.songData
      }
    },
    songItem() {
      return this.$refs.songItem
    },
    date() {
      return this.songData.time?.split('T')[0]
    },
    songName() {
      const ellipsis = this.songData.name.length > 10 ? '…' : ''
      return this.songData.name.substr(0, 10) + ellipsis
    },
    isSing() {
      // return false
      return !(
        this.songData.source !== '' && this.songData.source !== undefined
      )
    }
    // songItemTop () {
    //   return this.songItem.parentElement.parentElement.parentElement.parentElement.parentElement.offsetTop +
    //     this.songItem.parentElement.parentElement.parentElement.offsetTop +
    //     this.songItem.offsetTop
    // } // 这个奇怪的函数返回了songItem到屏幕顶端的距离，最后改用getBoundingClientRect()解决了
  },
  props: {
    songData: {
      type: Object,
      required: true
    }
  },
  methods: {
    likeSong() {
      if (!this.isLiked) {
        this.isLiked = true
        this.likeNum++
        this.hasTimeout = true
        this.likeTimeout = setTimeout(() => {
          axios({
            url: '/like',
            params: {
              id:
                this.itemData.songData.songId || this.itemData.songData.songid,
              type: 2
            }
          })
            .then((res) => {
              console.log(res)
            })
            .catch((err) => {
              console.log(err)
              if (err.response.status === 403) {
                this.$store.commit('setToast', '你已经点赞过了哦')
                this.isLiked = false
                this.likeNum--
              }
            })
          console.log(
            this.itemData.songData.songId || this.itemData.songData.songid,
            '点赞成功'
          )
          this.hasTimeout = false
        }, 1000)
      } else {
        this.isLiked = false
        this.likeNum--
        if (this.hasTimeout) {
          clearTimeout(this.likeTimeout)
          this.hasTimeout = false
          console.log('计时未结束，不发送请求')
        } else {
          axios({
            url: '/unlike',
            params: {
              id:
                this.itemData.songData.songId || this.itemData.songData.songid,
              type: 2
            }
          })
          console.log('未在计时期间，发送取消点赞的请求')
        }
      }
      // console.log(this.itemData.songData.id)
      // this.isLiked ? this.songData.like-- : this.songData.like++
      // this.isLiked = !this.isLiked
    }
  }
}
</script> -->

<style scoped lang="less">
* {
  text-align: left;
  transition: all 0.3s ease-in-out;
}
.song-item-after {
  height: 50vw !important;
  background-color: rgba(255, 255, 255, 0.931);
}
.song-item {
  transition: all 1s;
  width: 100vw;
  height: 70px;
  position: absolute;
  display: grid;
  grid-template-columns: 80px 100px 25vw 1fr 40px 40px 10px;
  grid-template-rows: 1.5fr 2.5fr 1.5fr 1.5fr;
  color: #fff;

  backface-visibility: hidden;
}
.user-avatar {
  grid-column: 1;
  grid-row: 1 / 5;
  display: flex;
  justify-content: center;
  align-items: center;
}
.avatar-img {
  width: 40px;
  height: 40px;
  border-radius: 20px;
  overflow: hidden;
  background-color: #bfbfbf;
}
.avatar-img img {
  width: 100%;
  height: auto;
}
.username {
  padding-right: 5px;
  grid-column: 2;
  grid-row: 2;
  text-align: left;
  font-size: 1em;
}
.song-date {
  grid-column: 2;
  grid-row: 3;
  text-align: left;
  font-size: 0.85em;
}
.song-name {
  grid-row: 1 / 5;
  display: flex;
  align-items: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  grid-column: 3 / 5;
}
.sing-song-name {
  grid-column: 3 / 6;
}
.listen-song-name {
  grid-column: 3 / 5;
}
.like {
  grid-column: 5;
  grid-row: 1 / 5;
  display: flex;
  justify-content: center;
  align-items: center;
}
.like-img {
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}
.like-img img {
  width: 80%;
  height: auto;
}
.microphone img {
  width: 28px;
}
.like-num {
  text-align: center;
  font-size: 0.9em;
}
.to-detail {
  grid-column: 6;
  grid-row: 1 / 4;
  display: flex;
  justify-content: center;
  align-items: center;
}
.username,
.song-name-text {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.turn {
  position: relative;
  perspective: 800px;
  width: 100vw;
  height: 70px;
  .box {
    position: absolute;
    transform-style: preserve-3d;
    transition: all 1s;
    .back {
      z-index: 1000;
      position: absolute;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      background-color: rgba(255, 255, 255, 0.931);
      transform: rotateY(180deg);
      border-radius: 10px;
      border: white 3px solid;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;

      .name {
        color: #0e344d;
        margin-top: 10px;
        margin-left: 17px;
        font-size: 22px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
      }
      .desc {
        color: #0e344d;
        margin-top: 10px;
        margin-left: 17px;
        flex: 1;
      }
      .btns {
        padding: 0 10px;
        display: flex;
        justify-content: space-around;
        div {
          color: #0e344d;
          // height: 30px;
          border-radius: 6px;
          border: 2px solid #0e344d;
          padding: 2px 4px;
          margin-bottom: 10px;
        }
      }
      .kite {
        position: absolute;
        height: 90px;
        top: -20px;
        left: -70px;
        backface-visibility: hidden;
      }
    }
  }
  .box-before {
    top: 0;
    left: 0;
    right: 0;
    height: 45vw;
  }
  .box-after {
    left: 14vw;
    right: 14vw;
    height: 45vw;
    transform: rotateY(180deg);
  }
}

.mask {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(170, 238, 255, 0);
  z-index: -1;
}
.show {
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.52);
}
</style>
