<script>
export default {
  name: 'Record'
}
</script>
<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { useWXRecord } from '@/weixin'
import axios from '@/axios'
import NavBar from '@/components/NavBar.vue'
import BackBtn from '@/components/BackBtn.vue'
import router from '../../router'
import { sendRecordMessage } from '../../WebSocket'

const route = useRoute()
const store = useStore()

const {
  recordState,
  timer,
  errorMessage,
  serverIDList,

  recordStart,
  recordStop,
  recordReplay,
  recordReplayStop,
  recordReset,
  recordUpload
} = useWXRecord()

watch(errorMessage, (e) => console.error(e))

const recordStateMap = {
  READY: '点击录音',
  RECORDING: '录音中',
  RECORD_END: '录音结束',
  REPLAYING: '试听中',
  UPLOADING: '上传中'
}

const recordStateText = computed(() => recordStateMap[recordState.value])

const timerData = computed(() => {
  const minute = (timer.minute < 10 ? '0' : '') + timer.minute
  const second = (timer.second < 10 ? '0' : '') + timer.second
  return `${minute}:${second}`
})

const recordType = route.query.type // 'normal' | 'childhood'
const songID = +route.query.id
const songName = route.query.name || ''
const originName = recordType === 'childhood' ? route.query.origin : ''
const toUser = +route.query.user

const isPublic = ref(true)

watch(recordState, (s) => {
  if (s === 'END') {
    // console.log('录音的id: ')
    // console.log(serverIDList.value)
    store.commit('setToast', '正在上传')
    if (recordType === 'normal') {
      axios
        .post('/healing/cover', {
          selection_id: songID,
          record: serverIDList.value,
          module: 1,
          is_anno: !isPublic.value
        })
        .then((res) => {
          console.log(res)
          store.commit('setToast', '上传成功')
          if (toUser !== store.state.user.id) {
            sendRecordMessage(toUser, songName, songID)
          }
          router.back()
        })
        .catch((err) => {
          console.error(err)
        })
      recordState.value = 'READY'
    } else if (recordType === 'childhood') {
      axios
        .post('/healing/cover', {
          selection_id: songID,
          record: serverIDList.value,
          module: 2,
          is_anno: !isPublic.value
        })
        .then((res) => {
          console.log(res)
          store.commit('setToast', '上传成功')
          router.back()
        })
        .catch((err) => {
          console.error(err)
        })
      recordState.value = 'READY'
    }
  }
})
</script>

<template>
  <div>
    <nav-bar>
      <template #left>
        <back-btn />
      </template>
    </nav-bar>
    <div class="wrapper">
      <div class="name">
        <p class="song-name">{{ songName }}</p>
        <p class="origin-name" v-if="recordType !== 'childhood'">
          {{ originName }}
        </p>
      </div>
      <div class="content">
        <div class="record-state">
          <span>{{ recordStateText }}</span>
        </div>
        <div
          class="record"
          v-if="recordState === 'READY' || recordState === 'RECORDING'"
        >
          <div class="record-btn">
            <img
              @click="recordStart"
              v-if="recordState === 'READY'"
              src="../../assets/ready.png"
              alt=""
            />
            <img
              @click="recordStop"
              v-if="recordState === 'RECORDING'"
              src="../../assets/recording.png"
              alt=""
            />
          </div>
        </div>
        <div
          v-if="recordState === 'RECORD_END' || recordState === 'REPLAYING'"
          class="record-end-wrapper"
        >
          <div
            class="image"
            v-if="recordState === 'RECORD_END'"
            @click="recordReplay"
          >
            <img src="../../assets/replay.png" alt="" />
            <div class="image-text">试 听</div>
          </div>

          <div
            class="image"
            v-if="recordState === 'REPLAYING'"
            @click="recordReplayStop"
          >
            <img src="../../assets/pause.png" alt="" />
          </div>
        </div>
        <div class="record-timer">
          <span v-show="recordState !== 'READY'">
            {{ timerData }}
          </span>
        </div>
      </div>
      <div
        class="record-operation"
        v-show="recordState === 'RECORD_END'"
        @click="recordUpload"
      >
        <img src="../../assets/pillow.png" alt="" />
        <div class="submit-text">上传</div>
        <!-- <img
          src="http://cdn.healing2020.100steps.top/static/record/recordagain.png"
          alt=""
          v-show="recordState === 'RECORD_END'"
          @click="recordReset"
        /> -->
        <!-- <img
          src="http://cdn.healing2020.100steps.top/static/record/recordtry.png"
          alt=""
          v-show="recordState === 'RECORD_END'"
          @click="recordReplay"
        /> -->
      </div>
      <div class="record-public" v-show="recordState === 'RECORD_END'">
        <div class="reset" @click="recordReset">重新录音</div>
        <div class="public-center">
          <input v-model="isPublic" type="checkbox" name="public" id="public" />
          <label for="public">向所有人公开此录音</label>
        </div>
      </div>
      <!-- <div class="record-submit">
        <img
          v-show="recordState === 'RECORD_END'"
          @click="recordUpload"
          src="http://cdn.healing2020.100steps.top/static/record/submit.png"
          alt=""
        />
      </div> -->
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  /* height: 90vh; */
  color: #fff;
}

.name {
  padding: 20px 0 40px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  /* height: 15vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; */
}

.song-name {
  margin: 0 auto;
  max-width: 60vw;
  font-size: 1.6rem;
}

.origin-name {
  margin: 0 auto;
  max-width: 45vw;
  color: rgb(173, 173, 173);
}

.content {
  width: 100vw;
  height: 40vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
}

.content * {
  display: flex;
  justify-content: center;
  align-items: center;
}

.record-state,
.record-timer {
  height: 15%;
  font-size: 1.2em;
}
.record {
  width: 40vw;
  height: 40vw;
  max-width: 30vh;
  max-height: 30vh;
  border-radius: 15vw;
}
.record > .record-btn {
  width: 100%;
}
.record > .record-btn > img {
  width: 100%;
  height: auto;
}
.record-operation {
  padding: 2vh 0;
  width: 100vw;
  height: 8vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.record-operation > img {
  padding: 0 1vw;
  width: 120px;
  height: auto;
  position: absolute;
}
.record-operation .submit-text {
  position: absolute;
  color: #000;
}
.record-public {
  padding: 2vh 0;
  text-align: center;
}
.record-public .reset {
  margin: 10px auto 20px;
  width: 4em;
  border-bottom: 1px solid #fff;
}
.record-public .public-center {
  padding: 2vh 0;
}
.record-submit {
  width: 60vw;
  height: 16vh;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
.record-submit > img {
  width: 80%;
}
.record-end-wrapper {
  width: 70vw;
  height: 20vh;
  border: 2px solid #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
.record-end-wrapper .image {
  height: 12vh;
  position: relative;
}
.record-end-wrapper .image img {
  height: 100%;
  position: absolute;
}
.record-end-wrapper .image .image-text {
  position: absolute;
}
</style>
