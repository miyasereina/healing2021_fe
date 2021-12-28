<script setup>
import { defineProps, toRef } from 'vue'
const props = defineProps({
  songData: {
    type: Object
  },
  isPlaying: {
    type: Boolean
  }
})

const songData = toRef(props, 'songData')
const isPlaying = toRef(props, 'isPlaying')
</script>

<template>
  <div class="song-item">
    <div class="singer-avatar">
      <img :src="songData.avatar" alt="" />
    </div>
    <div class="name">
      <div class="song-name">{{ songData.song_name }}</div>
      <div class="singer-name">{{ songData.nickname }}</div>
    </div>
    <div class="listen">
      <img
        v-if="!isPlaying"
        src="../../assets/end/play.png"
        alt=""
        @click="$emit('play', songData.file)"
      />
      <img
        v-else
        src="../../assets/end/stop.png"
        alt=""
        @click="$emit('stop')"
      />
    </div>
    <div
      class="download"
      @click="
        $emit(
          'download',
          songData.file,
          `${songData.song_name} - ${songData.nickname}`
        )
      "
    >
      <img src="../../assets/end/download.png" alt="" />
    </div>
  </div>
</template>

<style scoped>
.song-item {
  width: 100%;
  height: 80px;
  background-color: rgba(255, 255, 255, 0.5);
  display: grid;
  grid-template-columns: 80px 40vw 1fr 40px 10px 40px 10px;
}
.singer-avatar {
  grid-column: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.singer-avatar img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}
.name {
  grid-column: 2;
  display: flex;
  justify-content: center;
  flex-direction: column;
}
.song-name {
  padding: 5px 0;
  font-size: 1.2rem;
}
.listen {
  grid-column: 4;
}
.download {
  grid-column: 6;
}
.listen,
.download {
  display: flex;
  justify-content: center;
  align-items: center;
}

.listen img,
.download img {
  width: 100%;
}
</style>
