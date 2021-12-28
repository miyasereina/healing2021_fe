<script setup>
import {
  defineProps,
  defineEmits,
  toRef,
  ref,
  reactive,
  computed,
  watch
} from 'vue'
import SongType from './SongType'
import SongList from './SongList'
import ModeSwitch from '../components/ModeSwitch'
import axios from '@/axios'

const props = defineProps({
  reach: {
    default: false
  }
})
const isReach = toRef(props, 'reach')
const emit = defineEmits(['update:reach'])

const songTypeValue = ref('all')
const songListMode = ref(false)
const songRankMode = ref(false)

const changeListMode = (e) => {
  songListMode.value = e
}
const changeRankMode = (e) => {
  songRankMode.value = e
}

const mode = computed(() => (!songListMode.value ? 'selections' : 'covers'))
const rankWay = computed(() => (!songRankMode.value ? '1' : '2'))
const songListPage = reactive({}) // 存储每个列表的页数
const isPageEnd = computed(() => songListPage[songDataKey.value] === -1)

const songData = reactive({})
const songDataKey = computed(() => {
  return songTypeValue.value + +songListMode.value + +songRankMode.value
})

let isGettingData = false
const getSongData = (isChange) => {
  if (isGettingData) return
  if (!songData[songDataKey.value] || isChange) {
    songData[songDataKey.value] = []
    songListPage[songDataKey.value] = 1
  } else if (songListPage[songDataKey.value] === -1) {
    // 用-1表示页面到底
    return
  }

  isGettingData = true
  axios
    .get(`/healing/${mode.value}/list`, {
      params: {
        label: songTypeValue.value,
        rankWay: rankWay.value,
        page: songListPage[songDataKey.value],
        // module: 1
      },
      setToast: false
    })
    .then((res) => {
      console.log(res)
      // songData[songDataKey.value] = res.data
      if (isChange) {
        songData[songDataKey.value] = res.data
      } else {
        songData[songDataKey.value] = [
          ...songData[songDataKey.value],
          ...res.data
        ]
      }
      if (res.data.length < 10) {
        // 到底时响应错误，标记为 -1
        songListPage[songDataKey.value] = -1
      }
    })
    .catch((err) => {
      console.error(err)
      if (err.response.status === 416) {
        // 到底时响应错误，标记为 -1
        songListPage[songDataKey.value] = -1
      }
    })
    .finally(() => {
      isGettingData = false
    })
}
// getSongData()

const reachHandler = () => {
  emit('update:reach', false)
  if (!isGettingData && songListPage[songDataKey.value] !== -1)
    songListPage[songDataKey.value]++
  getSongData()
}

watch(isReach, reachHandler)

watch([songTypeValue, songListMode, songRankMode], () => {
  isGettingData = false
  getSongData(true)
})
</script>

<template>
  <div class="song-wrapper">
    <song-type v-model:value="songTypeValue" />
    <div class="toggle-wrapper" ref="toggleWrapper">
      <mode-switch
        @mode-change="changeListMode"
        :switchID="'ListModeSwitch'"
        :mode="songListMode"
      >
        <template #left>唱歌</template>
        <template #right>听歌</template>
      </mode-switch>
      <mode-switch
        @mode-change="changeRankMode"
        :switchID="'RankModeSwitch'"
        :mode="songRankMode"
      >
        <template #left>综合排序</template>
        <template #right>最新发布</template>
      </mode-switch>
    </div>
    <song-list :song-list="songData[songDataKey]" />
    <p class="page-end" v-if="isPageEnd">
      没有数据了哦，快去{{ songListMode ? '唱' : '点' }}首歌吧～
    </p>
    <div v-if="$store.state.currentMusic.file!==''"  class="placeholder"></div>
  </div>
</template>

<style scoped>
.song-wrapper {
  width: 100vw;
  min-height: 40vh;
  /*background-color: #7e7eff;*/
}
.toggle-wrapper {
  width: 100vw;
  height: 6vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  /* background-color: #0b77a5; */
  background-color: #3A87BB;
  top: 6vh;
  /* mask-10->10 sticky两行是5 弹窗是15 列表项是0 */
  z-index: 1;
}
.page-end {
  text-align: center;
  color: #2b2b2b;
}
.placeholder{
  width: 50px;
  height: 60px;
}
</style>
