<template>
  <div class="player">
    <audio
      ref="audios"
      @pause="pauseFunc()"
      @timeupdate="timeupdateFunc"
      @canplaythrough="formatDuration"
      @ended="ended"
    >
      <source ref="audioSource" :src="audioSource" type="audio/mpeg" />
    </audio>
    <div class="audioControl">
      <img class="singerImg" :src="singerImg" />
      <p class="name">{{ musicName }}</p>
      <p class="singername">{{ singerName }}</p>
      <div
        style="display:flex;align-items: center;"
        @mousedown="isDraging = true"
        @mouseup="isDraging = false"
      >
        <el-slider
          v-model="playProcess"
          class="sliderClass"
          style="width: 95%;"
          @change="setProcessFunc"
          :format-tooltip="formatTooltip"
        ></el-slider>
        <div class="process" style="color:black;text-align: right;">
          {{ Min }}:{{ Sec }} / {{ DMin }}:{{ DSec }}
        </div>
      </div>
      <likes
        ref='like'
        class="likeBtn"
        @likeChange="likeChange"
        :id="id"
        :type="2"
        :praise="praise"
        :isPraise="likethis"
      ></likes>
      <div class="playControl">
        <span
          class="audioSpan play"
          @click="clickFunc('play')"
          v-show="!isPlaying"
        ></span>
        <span
          class="audioSpan pause"
          @click="clickFunc('pause')"
          v-show="isPlaying"
        >
        </span>
      </div>
    </div>
  </div>
</template>
<script>
import Likes from '@/components/Likes'
export default {
  name: 'player', // 此为播放器组件
  data () {
    return {
      singerImg:
        'http://cdn.healing2020.100steps.top/static/components/fdi.png',
      musicName: '歌曲名',
      singerName: '唱歌用户名',
      audioSource: '',
      isPlaying: false,
      playProcess: 0,
      Min: 0,
      Sec: 0,
      DMin: 0,
      DSec: 0,
      likethis: false,
      praise: 0,
      isPraise: false,
      id: ''
    }
  },
  watch: {
    likethis () {
      this.$refs.like.likethis = this.likethis
    }
  },
  methods: {
    formatCurrentTime: function () {
      // 格式化的进行时间
      this.Min = Math.floor(this.$refs.audios.currentTime / 60)
      this.Sec = Math.round(this.$refs.audios.currentTime % 60)
    },
    formatDuration: function () {
      this.DMin = Math.floor(this.$refs.audios.duration / 60)
      this.DSec = Math.round(this.$refs.audios.duration % 60)
    },
    playFunc () {
      console.log('play')
    },
    pauseFunc () {
      console.log('pause')
    },
    timeupdateFunc (e) {
      if (!this.isDraging) {
        this.playProcess = (e.target.currentTime / e.target.duration) * 100
        this.formatCurrentTime()
        // this.playProcess = e.target.currentTime
      }
    },
    reload () {
      this.$refs.audios.load()
    },
    clickFunc (val) {
      if (val === 'play') {
        this.isPlaying = true
        this.$refs.audios.play()
      } else if (val === 'pause') {
        this.isPlaying = false
        this.$refs.audios.pause()
      }
    },
    ended (val) {
      this.isPlaying = false
    },
    setProcessFunc (val) {
      this.$refs.audios.currentTime = Math.round(
        (val / 100).toFixed(2) * this.$refs.audios.duration
      )
      this.$refs.audios.play()
      this.isPlaying = 1
    },
    formatTooltip (val) {
      var x = Math.round((val / 100).toFixed(2) * this.$refs.audios.duration)
      const min = Math.floor(x / 60)
      const sec = Math.round(x % 60)
      return `${this.formatTime(min)}:${this.formatTime(sec)}`
    },
    formatTime (time) {
      const str = time < 10 ? '0' : ''
      return str + time
    },
    likeChange (likethis) {
      console.log(likethis)
      this.likethis = likethis
      this.$emit('likeChange', likethis)
    }
  },
  components: {
    Likes
  }
}
</script>
<style scoped>
.player >>> .el-slider__button {
  width: 30px;
  height: 30px;
  position: absolute;
  bottom: 0px;
  background: url('http://cdn.healing2020.100steps.top/static/folder/greenboat.png')
    no-repeat;
  background-size: 100% 100%;
  border: none;
  border-radius: 0%;
}
.player >>> .el-slider__bar {
  height: 1px;
  background: blue;
}
.player >>> .el-slider__runway {
  height: 0px;
  border-radius: 0;
  background: gray;
}
.player >>> .el-slider__button-wrapper {
  top: -25px;
}
.player {
  height: 80px;
  width: 100%;
  background-color: #d4c3de;
  background-size: cover;
  background-position: center center;
}
.audioControl {
  height: 100%;
  width: 100%;
  position: relative;
}
.sliderClass {
  position: absolute;
  top: -15px;
  stroke-width: 0px;
  color: black;
}
.singerImg {
  position: absolute;
  top: 2vh;
  left: 2vw;
  height: 60px;
  width: 60px;
  border-radius: 50%;
}
.name {
  position: absolute;
  top: 3vh;
  left: 70px;
  font-size: 15px;
  font-weight: 600;
}
.singername {
  position: absolute;
  top: 6vh;
  left: 70px;
  font-size: 12px;
  font-weight: 600;
}
.process {
  position: absolute;
  top: 5vh;
  left: 50%;
  font-size: 18px;
}
.playControl {
  width: 3vh;
  height: 3vh;
  border-radius: 50%;
  position: absolute;
  right: 7vw;
  top: 30%;
}
.audioSpan {
  display: block;
  width: 5vh;
  height: 5vh;
  border-radius: 50%;
}
.play {
  background: url('http://cdn.healing2020.100steps.top/static/folder/play2.png')
    no-repeat 0vh 0vh;
  background-size: 100% 100%;
}
.pause {
  background: url('http://cdn.healing2020.100steps.top/static/folder/record-ing.png');
  background-size: 100% 100%;
}
.likeBtn {
  height: 20px;
  width: 20px;
  position: absolute;
  right: 18vw;
  top: 40%;
}
</style>
