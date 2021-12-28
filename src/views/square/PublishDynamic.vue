<template>
  <div class="container">
    <add-status
      v-show="isAddStatusShow === true"
      @addStatusInput="addStatusInput"
      @hideStatusInput="hideStatusInput"
      @showStatusRecommend="showStatusRecommend"
    />
    <status-recommend
      v-show="isStatusRecommendShow === true"
      :statusCount="statusCount"
      @addStatusRecommend="addStatusRecommend"
      @hideStatusRecommend="hideStatusRecommend"
    />
      <nav-bar>
        <template #left>
          <back-btn/>
        </template>
        <template #middle>
          <div class="title">动&nbsp;态&nbsp;编&nbsp;辑</div>
        </template>
      </nav-bar>
      <!-- <div class="top">
        <img class="back" src="../../assets/BackBtn.png" @click="back">
        <div class="title">动态编辑</div>
      </div> -->
    <div class="wrapper">
      <div class="song">
        <img src="../../assets/music.png" />
        <!--disabled会把click给禁了
        <input
          placeholder="点一首你喜欢的歌吧!"
          @click="goToRequestSong"
          v-show="songType === 0"
        >--><!-- 后面改成传页面参数，并拿回歌曲名字、语种、分格、备注 -->
        <div
          @click="goToRequestSong"
          v-show="songType === 0"
          class="goToRequestSong"
        >
          点一首你喜欢的歌吧!
        </div>

        <div class="request-song" v-show="songType === 1">
          <div class="upper">
            <div class="song-name">{{ requestSong.song_name }}</div>
            <div class="healing">经典治愈</div>
            <div class="cancel" @click="cancelRequestSong">x</div>
          </div>
          <div class="remark" v-show="requestSong.remark != ''">备注：{{ requestSong.remark }}</div>
        </div>
        <div class="childhood-song" v-show="songType === 2">
          <div class="song-name">{{ childhoodSong.song_name }}</div>
          <div class="healing">追忆童年</div>
          <div class="cancel" @click="cancelChildhoodSong">x</div>
        </div>
      </div>
      <div
        class="recommend"
        @click.stop="goToSongRecommend"
        v-show="songType === 0"
      >
        看推荐
      </div>
      <!--点击弹出推荐弹窗-->
      <div class="message">
        <img src="../../assets/write.png" />
        <div class="textarea">
          <textarea
            v-model="message"
            placeholder="写点什么吧！"
            maxlength="100"
          ></textarea>
          <p class="text-length" :class="{ surpass: message.length >= 100 }">
            {{ message.length }}/100
          </p>
        </div>
      </div>
      <div class="state-list">
        <img src="../../assets/status.png" />
        <div class="status">
          <div v-for="(state, index) in status" :key="index" class="state">
            <div>{{ state }}</div>
            <img src="../../assets/delete.png" @click="deleteStatus(state)" />
          </div>
          <div
            class="new-status"
            v-show="status.length < 3"
            @click="showStatusInput"
          >
            +状态
          </div>
        </div>
      </div>
      <div class="bottom">
        <button @click="submit">发表</button>
      </div>
      <img class="plate" src="../../assets/plate-dynamic.png" @click="submit" />
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import BackBtn from '@/components/BackBtn.vue'
import AddStatus from './components/AddStatus.vue'
import StatusRecommend from './components/StatusRecommend.vue'
import { ref, reactive, onActivated } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import axios from '../../axios.js'

export default {
  components: {
    NavBar,
    BackBtn,
    AddStatus,
    StatusRecommend
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    /* let total = ref(0) // 动态种类数*/
    let songType = ref(0) // 0点歌，1点歌后，2童年
    let isPublishing = false //判断是否在发动态
    const requestSong = reactive({
      song_name: '',
      language: '',
      style: '',
      remark: ''
    })
    const childhoodSong = reactive({
      classic_id: -1,
      song_name: ''
    })
    let message = ref('')
    const status = reactive([])

    let isAddStatusShow = ref(false)
    let isStatusRecommendShow = ref(false)
    let statusCount = ref(0)

    const back = () => {
      router.back()
      /* total.value = 0*/
      songType.value = 0
      requestSong.song_name = ''
      requestSong.language = ''
      requestSong.style = ''
      requestSong.remark = ''
      childhoodSong.classic_id = -1
      childhoodSong.song_name = ''
    }

    onActivated(() => {
      if (route.query.language) {
        /*total.value += 1*/
        childhoodSong.classic_id = -1
        childhoodSong.song_name = ''
        if (route.query.song_name.length > 5) {
          requestSong.song_name = route.query.song_name.slice(0, 5) + '...'
        } else {
          requestSong.song_name = route.query.song_name
        }
        requestSong.language = route.query.language
        requestSong.style = route.query.style
        if (route.query.remark.length > 15) {
          requestSong.remark = route.query.remark.slice(0, 15) + '...'
        } else {
          requestSong.remark = route.query.remark
        }
        songType.value = 1
      } else {
        if (route.query.classic_id) {
          requestSong.song_name = ''
          requestSong.language = ''
          requestSong.style = ''
          requestSong.remark = ''
          /*total.value += 1*/
          childhoodSong.classic_id = +route.query.classic_id
          if (route.query.song_name.length > 5) {
            childhoodSong.song_name = route.query.song_name.slice(0, 5) + '...'
          } else {
            childhoodSong.song_name = route.query.song_name
          }
          songType.value = 2
        }
      }
    })

    const goToRequestSong = () => {
      if (store.state.user.selection_num === 0) {
        store.commit('setToast', '今日点歌次数已经用尽了噢~')
        return false
      } else {
        router.push({
          path: '/requestsong',
          query: {
            page: '/publishdynamic'
          }
        })
      }
    }
    const goToSongRecommend = () => {
      if (store.state.user.selection_num === 0) {
        store.commit('setToast', '今日点歌次数已经用尽了噢~')
        return false
      } else {
        router.push('/songrecommend')
      }
    }
    const cancelRequestSong = () => {
      requestSong.song_name = ''
      requestSong.language = ''
      requestSong.style = ''
      requestSong.remark = ''
      /*total.value -= 1*/
      songType.value = 0
    }
    const cancelChildhoodSong = () => {
      childhoodSong.classic_id = -1
      childhoodSong.song_name = ''
      /*total.value -= 1*/
      songType.value = 0
    }

    // 添加状态弹窗
    const showStatusInput = () => {
      isAddStatusShow.value = true
    }
    const addStatusInput = (statusInput) => {
      isAddStatusShow.value = false
      if (status.includes(statusInput)) {
        store.commit('serToast', '状态不能重复噢~')
      } else {
        status.push(statusInput)
        statusCount.value += 1
        // console.log('statusCount', statusCount)
      }
    }
    const hideStatusInput = () => {
      isAddStatusShow.value = false
    }
    // 状态推荐弹窗
    const showStatusRecommend = () => {
      isAddStatusShow.value = false
      isStatusRecommendShow.value = true
    }
    const addStatusRecommend = (statusRecommend) => {
      isAddStatusShow.value = false
      isStatusRecommendShow.value = false
      statusRecommend.forEach((el) => {
        if (status.includes(el)) {
          store.commit('setToast', '状态不能重复噢~')
        } else {
          status.push(el)
          statusCount.value += 1
        }
      })
      // statusCount.value += statusRecommend.length
    }
    const hideStatusRecommend = () => {
      isAddStatusShow.value = true
      isStatusRecommendShow.value = false
    }
    const deleteStatus = (state) => {
      const list = status.filter((p) => {
        return p != state
      })
      status.length = 0
      list.forEach((el) => {
        status.push(el)
      })
    }
    // 至少两个才能发动态
    const submit = () => {
      if (isPublishing === false) {
        if (requestSong.song_name != '') {
          if (message.value != '' || status.length > 0) {
            console.log('成功1')
            isPublishing = true
            axios
              .post(`/dynamics/send`, {
                content: message.value,
                status: status,
                have_song: 1,
                song_name: requestSong.song_name,
                language: requestSong.language,
                style: requestSong.style,
                remark: requestSong.remark
              })
              .then((res) => {
                console.log(res)
                store.commit('reduceSelectionNum')
                requestSong.song_name = ''
                requestSong.language = ''
                requestSong.style = ''
                requestSong.remark = ''
                childhoodSong.classic_id = -1
                childhoodSong.song_name = ''
                message.value = ''
                status.length = 0
                cancelRequestSong()
                router.push('/square')
              })
              .catch((err) => {
                console.log(err.message)
                store.commit('setToast', '发布动态失败，待会再试试噢~')
              })
              .finally(() => {
                isPublishing = false
              })
          } else {
            console.log('再多分享一些吧')
            store.commit('setToast', '再多分享一些吧~')
            return false
          }
        } else if (childhoodSong.song_name != '') {
          if (message.value != '' || status.length > 0) {
            console.log('成功2')
            isPublishing = true
            axios
              .post(`/dynamics/send`, {
                content: message.value,
                status: status,
                have_song: 2,
                classic_id: +childhoodSong.classic_id
              })
              .then((res) => {
                console.log(res)
                childhoodSong.classic_id = -1
                childhoodSong.song_name = ''
                requestSong.song_name = ''
                requestSong.language = ''
                requestSong.style = ''
                requestSong.remark = ''
                message.value = ''
                status.length = 0
                cancelChildhoodSong()
                router.push('/square')
              })
              .catch((err) => {
                console.log(err.message)
                store.commit('setToast', '发布动态失败，待会再试试噢~')
              })
              .finally(() => {
                isPublishing = false
              })
          } else {
            console.log('再多分享一些吧')
            store.commit('setToast', '再多分享一些吧~')
            return false
          }
        } else {
          if (message.value != '' && status.length > 0) {
            console.log('成功3')
            isPublishing = true
            axios
              .post(`/dynamics/send`, {
                content: message.value,
                status: status,
                have_song: 0
              })
              .then((res) => {
                console.log(res)
                message.value = ''
                status.length = 0
                router.push('/square')
              })
              .catch((err) => {
                console.log(err.message)
                store.commit('setToast', '发布动态失败，待会再试试噢~')
              })
              .finally(() => {
                isPublishing = false
              })
          } else if (message.value != '' || status.length > 0){
            console.log('再多分享一些吧')
            store.commit('setToast', '再多分享一些吧~')
            return false
          } else {
            console.log('内容不可为空')
            store.commit('setToast', '内容不可为空')
            return false
          }
        }
        /*if (message.value.length > 0) {
          total.value += 1
        }
        if (status.length > 0) {
          total.value += 1
        }
        if (total.value >= 2) {
          isPublishing = true
          if (requestSong.song_name != '') {
            axios
              .post(`/dynamics/send`, {
                content: message.value,
                status: status,
                have_song: 1,
                song_name: requestSong.song_name,
                language: requestSong.language,
                style: requestSong.style,
                remark: requestSong.remark
              })
              .then((res) => {
                console.log(res)
                store.commit('reduceSelectionNum')
                total.value = 0
                requestSong.song_name = ''
                requestSong.language = ''
                requestSong.style = ''
                requestSong.remark = ''
                message.value = ''
                status.length = 0
                cancelRequestSong()
                router.push('/square')
              })
              .catch((err) => {
                console.log(err.message)
                store.commit('setToast', '发布动态失败，待会再试试噢~')
                if (message.value.length > 0) {
                  total.value -= 1
                }
                if (status.length > 0) {
                  total.value -= 1
                }
              })
              .finally(() => {
                isPublishing = false
              })
          } else if (childhoodSong.song_name != '') {
            axios
              .post(`/dynamics/send`, {
                content: message.value,
                status: status,
                have_song: 2,
                classic_id: +childhoodSong.classic_id
              })
              .then((res) => {
                console.log(res)
                total.value = 0
                childhoodSong.classic_id = -1
                childhoodSong.song_name = ''
                message.value = ''
                status.length = 0
                cancelChildhoodSong()
                router.push('/square')
              })
              .catch((err) => {
                console.log(err.message)
                store.commit('setToast', '发布动态失败，待会再试试噢~')
                if (message.value.length > 0) {
                  total.value -= 1
                }
                if (status.length > 0) {
                  total.value -= 1
                }
              })
              .finally(() => {
                isPublishing = false
              })
          } else {
            axios
              .post(`/dynamics/send`, {
                content: message.value,
                status: status,
                have_song: 0
              })
              .then((res) => {
                console.log(res)
                total.value = 0
                message.value = ''
                status.length = 0
                router.push('/square')
              })
              .catch((err) => {
                console.log(err.message)
                store.commit('setToast', '发布动态失败，待会再试试噢~')
                if (message.value.length > 0) {
                  total.value -= 1
                }
                if (status.length > 0) {
                  total.value -= 1
                }
              })
              .finally(() => {
                isPublishing = false
              })
          }
        } else {
          if (total.value === 0) {
            store.commit('setToast', '内容不可为空')
            return false
          } else {
            store.commit('setToast', '再多分享一些吧~')
            if (message.value.length > 0) {
              total.value -= 1
            }
            if (status.length > 0) {
              total.value -= 1
            }
            return false
          }
        }*/
      } else {
        store.commit('setToast', '动态正在发布中~')
        return false
      }
    }

    return {
      router,
      songType,
      requestSong,
      childhoodSong,
      message,
      status,
      isAddStatusShow,
      isStatusRecommendShow,
      statusCount,
      back,
      goToRequestSong,
      goToSongRecommend,
      cancelRequestSong,
      cancelChildhoodSong,
      showStatusInput,
      addStatusInput,
      hideStatusInput,
      showStatusRecommend,
      addStatusRecommend,
      hideStatusRecommend,
      deleteStatus,
      submit
    }
  }
}
</script>

<style scoped>
.container {
  background: url('../../assets/background-dark.png');
  background-size: cover;
  height: 100vh;
  width: 100vw;
  position: absolute;
  left: 0;
  top: 0;
  font-family: MicrosoftYaHei;
  color: white;
}
.wrapper {
  width: 100%;
  height:90%;
  overflow: auto;
}
.top {
  display: flex;
}
.back {
  width: 5vw;
  height: 9vw;
  margin-left: 7vw;
  margin-top: 4vw;
}
.title {
  width: 80vw;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 6vw;
  margin-left: 1.5vw;
}
.song {
  width: 80vw;
  margin-top: 5vw;
  margin-left: 7vw;
  display: flex;
}
.song > img {
  width: 8vw;
  height: 8vw;
}
/*.song > input {
    margin-left: 5vw;
    width: 66vw;
    background-color: transparent;
    border: 1.6px solid white;
    border-radius: 1.5vw;
    outline: none;
    text-align: center;
  }
  .song input::-webkit-input-placeholder {
    color: rgb(122, 176, 213);
    font-size: 4.2vw;
    text-align: center;
  }*/
.song > .goToRequestSong {
  margin-left: 4vw;
  width: 66vw;
  background-color: transparent;
  border: 1.6px solid white;
  border-radius: 1.5vw;
  text-align: center;
  color: rgb(122, 176, 213);
  font-size: 4.2vw;
  text-align: center;
  padding-top: 0.5vw;
  padding-bottom: 0.5vw;
}
.request-song {
  margin-left: 4vw;
  width: 66vw;
  background-color: transparent;
}
.request-song > .upper {
  display: grid;
  grid-template-columns: 6fr 3fr 1fr;
  grid-column-gap: 2vw;
  border: 1.6px solid white;
  border-radius: 1.5vw;
  padding-top: 1vw;
  padding-bottom: 1vw;
}
.request-song > .upper > .song-name,
.childhood-song > .song-name {
  font-size: 3.8vw;
  padding-left: 3vw;
  color: rgb(122, 176, 213);
  padding-top: 0.2vw;
  padding-bottom: 0.3vw;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.request-song > .upper > .healing,
.childhood-song > .healing {
  font-size: 3.8vw;
  background-color: rgb(108, 162, 207);
  text-align: center;
  border-radius: 2.5vw;
  padding-top: 0.2vw;
  padding-bottom: 0.3vw;
}
.childhood-song > .healing {
  background-color: rgb(206, 206, 129);
}
.request-song > .remark {
  font-size: 3.5vw;
}
.childhood-song {
  margin-left: 4vw;
  width: 66vw;
  background-color: transparent;
  border: 1.6px solid white;
  border-radius: 1.5vw;
  display: grid;
  grid-template-columns: 6fr 3fr 1fr;
  grid-column-gap: 2vw;
  padding-top: 1vw;
  padding-bottom: 1vw;
}
.cancel {
  margin-top: -0.5vw;
  padding-bottom: 0.3vw;
  font-size: 4vw;
  text-align: center;
}
/*.request-song img,
  .childhood-song img {
    position: relative;
    z-index: 10;
    right: -1vw;
    top: 1.5vw;
    width: 3vw;
    height: 3vw;
  }*/
.recommend {
  position: relative;
  top: 2vw;
  left: 74vw;
  width: 3em;
  font-size: 3.5vw;
  border-bottom: 1.6px solid white;
}
.message {
  width: 80vw;
  margin-top: 5vw;
  margin-left: 7vw;
  display: flex;
}
.message > img {
  width: 8vw;
  height: 8vw;
}
.message textarea {
  margin: 3vw;
  width: 61vw;
  height: 45vw;
  background-color: transparent;
  border: none;
  resize: none;
  outline: none;
  color: white;
  overflow: auto;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  letter-spacing: 0.4vw;
  font-family: MicrosoftYaHei;
  appearance: none;
  -webkit-appearance: none;
}
.textarea {
  margin-left: 4vw;
  width: 66vw;
  height: 59vw;
  border: 1.6px solid white;
  border-radius: 1.5vw;
}
.message textarea::-webkit-input-placeholder {
  color: rgb(122, 176, 213);
  font-size: 4.2vw;
  text-align: center;
  font-family: MicrosoftYaHei;
}
.message p {
  color: rgb(122, 176, 213);
  width: 3.5em;
  margin-top: 0;
  margin-left: 49vw;
  margin-right: 1vw;
  font-size: 4.2vw;
}
.message > .textarea > .surpass {
  color: red;
}
.state-list {
  display: flex;
  width: 80vw;
  margin-top: 5vw;
  margin-left: 7vw;
}
.state-list > img {
  width: 8vw;
  height: 8vw;
}
.status {
  display: grid;
  grid-template-columns: 3fr 3fr 3fr;
  grid-column-gap: 2vw;
  font-size: 4.2vw;
  margin-left: 4vw;
  width: 95%;
}
.state,
.new-status {
  width: 19vw;
  height: 6.5vw;
  border: 1.6px solid white;
  border-radius: 1.5vw;
  text-align: center;
  margin-top: 0.8vw;
  padding-top: 0.5vw;
  padding-bottom: 0.5vw;
}
.state > img {
  width: 3vw;
  height: 3vw;
  position: relative;
  left: 9.5vw;
  top: -10.5vw;
}
.new-status {
  color: rgb(122, 176, 213);
}
.bottom {
  margin-top: 5vw;
  padding-left: 41vw;
}
button {
  background-color: transparent;
  border: 1.6px solid white;
  border-radius: 2vw;
  color: white;
  font-size: 5vw;
  padding: 0.5vw 4vw 1vw 4vw;
  outline: none;
}
.plate {
  width: 20vw;
  height: 12vw;
  z-index: 100;
  position: relative;
  top: -10.3vw;
  left: 28vw;
}
</style>
