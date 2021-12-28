<script setup>
import { nextTick, ref, toRef } from 'vue'
import { useStore } from 'vuex'
import SwiperCore, { EffectFade } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/swiper-bundle.min.css'
import 'swiper/components/effect-fade/effect-fade.min.css'
import axios from '../../axios'
import NextArrow from './NextArrow.vue'
import SongItem from './SongItem.vue'

const endData = ref({})
axios.get('/ending').then((res) => {
  endData.value = res.data
})

const healedSum = ref({})
axios('/healedSum').then((res) => {
  healedSum.value = res.data
})

const coverSum = ref({})
axios('/coverSum').then((res) => {
  coverSum.value = res.data
})

const store = useStore()
const avatar = toRef(store.state.user, 'avatar')

SwiperCore.use([EffectFade])

const toNext = ref(() => {})
const onSwiper = (swiper) => {
  toNext.value = () => swiper.slideNext()
}

const onSlideChange = (swiper) => {
  healingDataAudio.value.pause()
  healingDataPlayerState.value = false

  coverAudio.value.pause()
  coverAudioSrc.value = ''
  coverAudioIndex.value = -1
}

const healingDataAudio = ref(null)
const healingDataPlayerState = ref(false)
const playHealingData = () => {
  if (!healingDataPlayerState.value) {
    healingDataAudio.value.play()
  } else {
    healingDataAudio.value.pause()
  }
  healingDataPlayerState.value = !healingDataPlayerState.value
}

const coverAudio = ref(null)
const coverAudioSrc = ref('')
const coverAudioIndex = ref(-1)

const coverAudioEnded = () => {
  coverAudioSrc.value = ''
  coverAudioIndex.value = -1
}
const coverAudioPlay = (url, index) => {
  if (coverAudioIndex.value !== -1) {
    coverAudio.value.pause()
  }

  coverAudioSrc.value = url
  coverAudioIndex.value = index

  nextTick(() => {
    coverAudio.value.oncanplay = coverAudio.value.play()
  })
}
const coverAudioStop = () => {
  coverAudio.value.pause()
  coverAudioIndex.value = -1
}

const audioDownload = (url, filename) => {
  store.commit('setToast', '由于微信浏览器限制，可能需要在跳转后手动下载哦～')

  const downloadAElement = document.createElement('a')
  downloadAElement.href = url
  downloadAElement.download = filename

  setTimeout(() => {
    downloadAElement.click()
  }, 1000)
}
</script>

<template>
  <div class="end">
    <audio :src="coverAudioSrc" ref="coverAudio" @ended="coverAudioEnded" />
    <swiper
      :direction="'vertical'"
      :effect="'fade'"
      @swiper="onSwiper"
      @slide-change="onSlideChange"
    >
      <swiper-slide>
        <div class="page bg1">
          <img src="../../assets/end/day.png" alt="" class="day-image" />
          <div class="total-text-wrapper">
            <p class="total-day-text">
              <span class="text-md">治愈系</span>的<span class="text-lg"
                >30</span
              >天里
            </p>
            <p><span class="text-lg">2392</span>个有趣的灵魂在这里相遇</p>
            <p><span class="text-lg">954</span>个声音穿越时空得以传达</p>
            <p class="check-report-text" @click="toNext">查看我的治愈报告</p>
            <next-arrow />
          </div>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="page bg2 singsong-data">
          <div class="most-order">
            <div class="title">最多人点歌</div>
            <div class="separate-line"></div>
            <div class="song-data">
              <div class="song-image">
                <img src="../../assets/end/晴天.jpeg" alt="" />
              </div>
              <div class="song-name text-md">《晴天》</div>
              <div class="sing-num">22个人渴望得到它的治愈</div>
            </div>
          </div>
          <div class="most-sing">
            <div class="title">最多人唱歌</div>
            <div class="separate-line"></div>
            <div class="song-data">
              <div class="song-image">
                <img src="../../assets/end/水星记.jpeg" alt="" />
              </div>
              <div class="song-name text-md">《水星记》</div>
              <div class="sing-num">15个人一展歌喉治愈他人</div>
            </div>
          </div>

          <div class="next-arrow-wrapper">
            <next-arrow />
          </div>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="page bg2 healing-data">
          <div class="top-text-wrapper">
            <p>在这里，童年的歌曲深深地温暖了我们的心</p>
            <p>阿橙演唱的<span class="text-md">《春秋》</span>脱颖而出</p>
            <p>成为最受欢迎的歌曲</p>
          </div>

          <div class="bottom-text-wrapper">
            <p>点击听一下吧</p>
            <audio
              src="http://cdn.healing2021.100steps.top/IGpyHtVPWwLDDH7BjAWVkW7HXlHK2nMjcK2RRkJn-wzrxIQUvf4IKQZdcf7pd7op1637250999.mp3"
              ref="healingDataAudio"
            />
            <div class="play-btn">
              <img
                src="../../assets/end/play.png"
                alt=""
                v-if="!healingDataPlayerState"
                @click="playHealingData"
              />
              <img
                src="../../assets/end/stop.png"
                alt=""
                v-else
                @click="playHealingData"
              />
            </div>
          </div>
          <div class="next-arrow-wrapper">
            <next-arrow />
          </div>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="page bg2 personal-data">
          <div class="top-text-wrapper">
            <p>在这里</p>
            <p>
              你点了<span class="text-lg">{{ endData.selected }}</span
              >首歌
            </p>
            <p>
              获得了<span class="text-lg">{{ endData.healed }}</span
              >个治愈
            </p>
            <p>
              也曾<span class="text-lg">{{ endData.heal }}</span
              >次带给了他人温暖
            </p>
          </div>
          <div class="bottom-text-wrapper">
            <p>
              你对<span class="text-lg">{{ endData.likes }}</span
              >个作品给予了赞赏
            </p>
            <p>
              也有<span class="text-lg">{{ endData.liked }}</span
              >人为你的作品给予了肯定
            </p>
            <p>
              你也曾<span class="text-lg">{{ endData.moments }}</span
              >次在广场有所活跃……
            </p>
          </div>

          <div class="next-arrow-wrapper">
            <next-arrow />
          </div>
        </div>
      </swiper-slide>
      <swiper-slide v-if="healedSum.length > 0">
        <div class="page bg2 receive-page">
          <p class="text-md title">
            你收获了他人的治愈哦
            <br />
            再来感受一下温暖吧～
          </p>
          <song-item
            v-for="(songData, i) in healedSum"
            :song-data="songData"
            :is-playing="i === coverAudioIndex"
            @play="coverAudioPlay($event, i)"
            @stop="coverAudioStop"
            @download="audioDownload"
          />
          <div class="next-arrow-wrapper">
            <next-arrow />
          </div>
        </div>
      </swiper-slide>
      <swiper-slide v-if="coverSum.length > 0">
        <div class="page bg2 send-page">
          <p class="text-md title">
            你也给其他人带来过治愈
            <br />
            再来听听看吧～
          </p>
          <div class="song-item-wrapper">
            <song-item
              v-for="(songData, i) in coverSum"
              :song-data="songData"
              :is-playing="i === coverAudioIndex"
              @play="coverAudioPlay($event, i)"
              @stop="coverAudioStop"
              @download="audioDownload"
            />
          </div>
          <div class="next-arrow-wrapper">
            <next-arrow />
          </div>
        </div>
      </swiper-slide>
      <swiper-slide>
        <div class="page bg3 final-page">
          <p class="text-lg title">治愈系</p>
          <div class="avatar">
            <img :src="avatar" alt="" />
          </div>
          <p>我们相约有缘，有缘再见</p>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<style scope>
html {
  background-image: none;
}

.end {
  height: 100vh;
  overflow: hidden;
}

.page {
  height: 100vh;
  background-size: 100% 100%;
  position: relative;
  font-style: italic;
  font-size: 0.8rem;
  font-weight: normal;
}
.text-md {
  font-size: 1.4rem;
}
.text-lg {
  font-size: 1.8rem;
  font-weight: lighter;
}
.bg1 {
  background-image: url(../../assets/end/bg1.png);
}
.bg2 {
  background-image: url(../../assets/end/bg2.jpg);
}
.bg3 {
  background-image: url(../../assets/end/bg3.jpg);
}
.next-arrow-wrapper {
  width: 100%;
  position: absolute;
  bottom: 20px;
}

.day-image {
  width: 28vw;
  position: absolute;
  top: 3rem;
  left: 4vw;
}
.total-text-wrapper {
  min-width: 60vw;
  text-align: center;
  color: #907078;
  position: absolute;
  right: 0;
}
.total-text-wrapper .total-day-text {
  margin: 25px 0 30px;
}
.total-text-wrapper .check-report-text {
  margin-top: 30px;
  text-decoration: underline;
}

.singsong-data {
  color: #a69b9d;
}
.singsong-data .most-order,
.singsong-data .most-sing {
  position: absolute;
  width: 60vw;
}
.singsong-data .title {
  margin: 2px;
}
.singsong-data .separate-line {
  margin: 0 auto;
  width: 100%;
  height: 4px;
  background-color: #e0bd67;
}
.song-data {
  height: 80px;
  display: grid;
  grid-template-rows: 3fr 2fr;
}
.song-data .song-image {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.song-image img {
  width: 60px;
  height: 60px;
}

.most-order .song-data {
  grid-template-columns: 80px 1fr;
}
.most-order .song-image {
  grid-column: 1;
  grid-row: 1 / 3;
}
.most-order .song-name {
  grid-column: 2;
  grid-row: 1;
  display: flex;
  align-items: center;
}
.most-order .sing-num {
  grid-column: 2;
  grid-row: 2;
}

.most-sing .song-data {
  grid-template-columns: 1fr 80px;
}
.most-sing .song-image {
  grid-column: 2;
  grid-row: 1 / 3;
}
.most-sing .song-name {
  grid-column: 1;
  grid-row: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.most-sing .sing-num {
  grid-column: 1;
  grid-row: 2;
}

.singsong-data .most-order {
  top: 100px;
  left: 20px;
}
.singsong-data .most-sing {
  text-align: right;
  top: 260px;
  right: 20px;
}

.healing-data {
  color: #81656b;
}
.healing-data .top-text-wrapper {
  min-width: 70vw;
  text-align: left;
  position: absolute;
  top: 60px;
  left: 20px;
}
.healing-data p {
  margin: 10px 0;
}
.healing-data .bottom-text-wrapper {
  text-align: right;
  position: absolute;
  right: 30px;
  top: 40vh;
}
.healing-data .bottom-text-wrapper img {
  width: 50px;
}

.personal-data {
  color: #81656b;
}
.personal-data .top-text-wrapper {
  min-width: 70vw;
  text-align: left;
  position: absolute;
  top: 30px;
  left: 10px;
}
.personal-data p {
  margin: 10px 0;
}
.personal-data .bottom-text-wrapper {
  text-align: right;
  position: absolute;
  right: 10px;
  top: 40vh;
}

.song-item-wrapper {
  height: 65vh;
  overflow: auto;
}

.receive-page {
  color: #81656b;
}
.receive-page .title {
  margin: 0;
  padding: 20px;
}

.send-page {
  color: #81656b;
}
.send-page .title {
  margin: 0;
  padding: 20px;
  text-align: right;
}

.final-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-style: normal;
}
.final-page .title {
  margin-top: 20vh;
}
.final-page .avatar {
  width: 20vw;
  height: 20vw;
  border-radius: 10vw;
  overflow: hidden;
}
.final-page .avatar img {
  width: 100%;
}
</style>
