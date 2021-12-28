<template>
  <div class="dailyrank">
    <!-- <div class="top">
      <img class="backbtn" @click="router.go(-1)" src="../../../assets/BackBtn.png" />
        <div class="hot-title">热&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;榜</div>
    </div> -->
    <nav-bar>
      <template #left>
        <back-btn />
      </template>
      <template #middle>
        <div class="hot-title">热&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;榜</div>
      </template>
    </nav-bar>
    <div class="dateline">
      <div :class="['img-container', chosen === 'all' ? 'active' : '']">
        <img
          class="all"
          src="../../../assets/calendar.png"
          @click="
            () => {
              chosen = 'all'
              queryRank()
            }
          "
        />
      </div>
      <div class="datelist">
        <div
          class="date"
          v-for="item in dateList"
          :key="item.cover_id"
          :class="['date', chosen === item ? 'active' : '']"
          @click="
            () => {
              chosen = item
              queryRank()
            }
          "
        >
          {{ item }}
        </div>
      </div>
    </div>
    <div class="list-container">
      <div class="listdetail">
        <div v-if="currentList.length===0" class="tips">
          暂时没有歌曲哦，努力登上治愈热榜吧！
        </div>
        <song-item
          v-for="item of currentList"
          :itemInfo="{ ...item }"
          :key="item.cover_id"
        ></song-item>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from '@/axios'
import NavBar from '@/components/NavBar.vue'
import BackBtn from '@/components/BackBtn.vue'
import NavTitle from '../../../components/NavTitle.vue'
import HotSong from './components/HotSong.vue'
import formatter from '@/utils/format.js'
import { ref, toRef } from '@vue/reactivity'
import SongItem from './SongItem.vue'
import { useRouter } from 'vue-router'
var dayjs = require('dayjs')

const router = useRouter()

let dateList = ref([])
let date = dayjs(new Date())
for (let i = 0; ; i++) {
  let tempDate = date.subtract(i, 'day')
  if (tempDate.date() === 17) break
  dateList.value.push(tempDate.format('MM-DD'))
}
//默认选中今天
let chosen = ref(dateList.value[0])

let currentList = ref([])

function queryRank() {
  const cache = queryRank.cache || (queryRank.cache = {})
  if (cache[chosen.value]) {
    currentList.value = cache[chosen.value]
  } else {
    axios.get(`healing/dailyrank/${chosen.value}`).then((res) => {
      cache[chosen.value] = res.data
      currentList.value = cache[chosen.value]
    })
  }
}
queryRank()
</script>

<style lang="less" scoped>
.dailyrank {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.top {
  position: relative;
  margin-top: 13px;
  height: 60px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .hot-title {
    color: white;
    font-size: 26px;
  }
  .backbtn {
    position: absolute;
    left: 25px;
    top: 15px;
    height: 30px;
  }
}

.hot-title {
  width: 80vw;
  color: white;
  font-size: 26px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dateline {
  display: flex;
  height: 60px;
  overflow-x: hidden;
  overflow-y: hidden;
  margin-right: 5vw;
  margin-left: 5vw;
  align-items: center;
  border-bottom: 2px solid white;
  .img-container {
    height: 60px;
    display: flex;
    align-items: center;
    .all {
      height: 7vw;
      margin-left: 20px;
    }
  }
  .datelist {
    display: flex;
    min-width: 0;
    flex: 1;
    overflow-x: scroll;
    position: relative;
    width: 70vw;
    height: 60px;
    margin-left: 4vw;
    margin-right: 4vw;
    background-size: 100% 130%;
    padding: 0;
    .date {
      flex-shrink: 0;
      list-style: disc;
      opacity: 1;
      position: relative;
      display: inline-block;
      left: 0vw;
      text-align: center;
      color: rgb(255, 255, 255);
      line-height: 65px;
      font-size: 16px;
      margin: 0 13px;
    }
    .active {
      border-bottom: 4px #4ffffb solid;
    }
  }
}

.list-container {
  flex: 1;
  display: flex;
  width: 100%;
  min-height: 0;
  overflow: scroll;
  .listdetail {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: scroll;
    min-height: 0px;
    .tips{
      color: white;
      margin-top: 20px;
    }
  }
}
</style>
