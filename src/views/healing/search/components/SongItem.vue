<script setup>
import { defineProps, toRef, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/axios'
import formatter from '@/utils/format.js'

const props = defineProps({
  songData: {
    type: Object
  }
})
const songData = toRef(props, 'songData')
const post_time = computed(() => 
formatter.formatDate(songData.value.post_time, 7))
const isCover = computed(() => songData.value.cover_id === undefined)

const router = useRouter()

const toRecord = () => {
  router.push({
    path: '/record',
    query: {
      type: 'normal',
      id: songData.value.selection_id,
      name: songData.value.song_name
    }
  })
}


const toDetail = () => {
  if(songData.value.module===1){
    router.push('/healingdetail/' + songData.value.selection_id)
  }
  else if(songData.value.module===2){
    router.push({path:'/cover',query:{classic_id:songData.value.classic_id}})
  }
}

</script>

<template>
  <div class="song-item">
    <div class="user-avatar">
      <div class="avatar-img">
        <img :src="songData.avatar" alt="" />
      </div>
    </div>
    <div class="username">
      {{ songData.nickname }}
    </div>
    <div class="song-date">
      {{ post_time }}
    </div>
    <div class="song-name">
      <div class="song-name-text">{{ songData.song_name }}</div>
    </div>
    <div class="like">
      <div class="microphone" v-if="isCover" @click="toRecord">
        <img src="@/assets/huatong.png" alt="" />
      </div>
      <div class="microphone" v-else @click="toDetail">
        <img src="@/assets/xiayishou.png" alt="" />
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  text-align: left;
  transition: all 0.3s ease-in-out;
}
.song-item {
  width: 100%;
  height: 70px;
  display: grid;
  grid-template-columns: 80px 100px 25vw 1fr 40px 40px 10px;
  grid-template-rows: 1.5fr 2.5fr 1.5fr 1.5fr;
  color: #fff;
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
</style>
