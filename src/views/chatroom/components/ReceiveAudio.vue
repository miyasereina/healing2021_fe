<template>
  <div class="receive-chat-box">
    <div class="time-box">
      {{time}}
    </div>
    <div class="main-box">
      <div class="left">
        <div class="avatar-box">
          <img :src="avatarUrl" alt="头像">
        </div>
      </div>
      <div class="audio">
        <div
          style="
            display: flex;
            align-items: stretch;
          "
        >
          <div
            style="
              flex: none;
              margin: 2vw;
              display: flex;
              align-items: center;
            "
          >
            <img
              :src="stopImage"
              @click="play"
              v-show="!isplaying"
              :class="[ disabled ? 'disabled' : 'abled' ]"
            />
            <img
              :src="playImage"
              @click="pause"
              v-show="isplaying"
              :class="[ disabled ? 'disabled' : 'abled' ]"
            />
          </div>
          <div
            style="
              width: 0;
              padding: 2vw;
              flex: 1 1 0;
              display: flex;
              flex-direction: column;
              justify-content: space-around;
            "
          >
            <div class="name" ref="songName">
              <div class="name-slide" ref="nameSlide" :style="nameStyle">{{name}}</div>
            </div>
            <input
              ref="range"
              type="range"
              name=""
              value="0"
              @change="progressChange"
              @input="changing"
              :class="[ disabled ? 'disabled' : 'abled' ]"
              style="margin: 3vw 0;"
            />
            <div class="time">{{songTime}}</div>
          </div>
          <audio id="audio" ref="audio"
            :src="url" @play="playing"
            @pause="paused" @durationchange="changeTime"
            @canplay="changeTime" @error="error">
          </audio>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'receiveAudio',
  props: {
    avatarUrl: {
      type: String
    },
    content: {
      type: String
    },
    time: {
      type: String
    },
    url: {
      type: String
    },
    name: {
      type: String
    }
  },
  data () {
    return {
      currentTime: 0,
      duration: 0,
      isplaying: false,
      stopImage: 'http://cdn.healing2020.100steps.top/static/chat/stop_left.png',
      playImage: 'http://cdn.healing2020.100steps.top/static/chat/play_left.png',
      disabled: true,
      nameStyle: { paddingLeft: '0vw' }
    }
  },
  watch: {
    'item.url' () {
      this.$refs.audio.load()
    }
  },
  mounted () {
    document.body.addEventListener('mousemove', this.load)
    document.body.addEventListener('mousedown', this.load)
    document.body.addEventListener('keydown', this.load)
    document.body.addEventListener('keypress', this.load)
    document.body.addEventListener('touchstart', this.load)
  },
  beforeDestroy () {
    this.stopTryLoad()
    clearInterval(window['playing' + this.random])
  },
  computed: {
    myId () {
      return this.$store.state.user.id
    },
    songTime () {
      var initTime = t => {
        if (typeof t === 'number' && !!t && t !== Infinity) {
          return t < 10 ? '0' + t : t
        } else {
          return '00'
        }
      }
      if (!this.duration) {
        return '加载中...'
      } else if (this.duration === '加载失败') {
        return '加载失败'
      } else {
        this.able()
        return initTime(Math.floor(this.currentTime / 60)) + ':' + initTime(Math.floor(this.currentTime % 60)) + '/' + initTime(Math.floor(this.duration / 60)) + ':' + initTime(Math.floor(this.duration % 60))
      }
    }
  },
  methods: {
    able () {
      this.disabled = false
    },
    changeTime () {
      var audio = this.$refs.audio
      var range = this.$refs.range
      range.value = (100 * audio.currentTime / audio.duration) || 0
      this.currentTime = audio.currentTime
      this.duration = audio.duration
    },
    progressChange () {
      var audio = this.$refs.audio
      var range = this.$refs.range
      audio.currentTime = parseFloat(range.value) * audio.duration / 100
      this.currentTime = audio.currentTime
      this.duration = audio.duration
      if (this.isplaying) {
        window['playing' + this.random] = setInterval(() => {
          this.changeTime()
        }, 500)
      }
    },
    load () {
      if (!this.duration) {
        this.$refs.audio.load()
        this.stopTryLoad()
      } else {
        this.stopTryLoad()
      }
    },
    stopTryLoad () {
      document.body.removeEventListener('mousemove', this.load)
      document.body.removeEventListener('mousedown', this.load)
      document.body.removeEventListener('keydown', this.load)
      document.body.removeEventListener('keypress', this.load)
      document.body.removeEventListener('touchstart', this.load)
    },
    changing () {
      clearInterval(window['playing' + this.random])
    },
    play () {
      console.log('Start playing')
      this.$refs.audio.play()
      this._scroll()
    },
    pause () {
      console.log('Stop playing')
      this.$refs.audio.pause()
      const child = this.$refs.nameSlide
      this.nameStyle.paddingLeft = '0vw'
      child.classList.remove('state-text-overflow')
    },
    playing () {
      this.isplaying = true
      window['playing' + this.random] = setInterval(() => {
        this.changeTime()
      }, 500)
    },
    paused () {
      this.isplaying = false
      this.changeTime()
      clearInterval(window['playing' + this.random])
      const child = this.$refs.nameSlide
      this.nameStyle.paddingLeft = '0vw'
      child.classList.remove('state-text-overflow')
    },
    error () {
      this.duration = '加载失败'
    },
    _scroll () {
      // 动态赋值动画区域的左padding 防止卡顿
      var parentClientWidth = this.$refs.songName.clientWidth
      // 判断动画区域是否超出父元素宽度 宽则有动画，不宽则无
      var parent = this.$refs.songName
      var child = this.$refs.nameSlide
      if (child.clientWidth > parent.clientWidth) {
        this.nameStyle.paddingLeft = parentClientWidth + 'px'
        child.classList.add('state-text-overflow')
      } else {
        child.classList.remove('state-text-overflow')
      }
    }
  }
}
</script>
<style scoped>
.receive-chat-box {
  padding: 2vw 4vw;
}
.time-box {
  text-align: center;
  font-size: 4vw;
  padding: 0 0 2vw 0;
}
.main-box {
  display: flex;
}
.left {
  flex: 1
}
.avatar-box {
  border-radius: 50%;
  width: 11vw;
  height: 11vw;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.avatar-box img {
  max-width: 100%;
  max-height: 100%;
}
.audio {
  flex: 8;
  margin: 0 4vw;
  background-color: #e8e3f1;
  border-radius: 4vw;
  width: 40vw;
}
.name {
  display: inline-block;
  font-size: 4vw;
  color: #71537e;
  white-space: nowrap;
  overflow: hidden;
}
.state-text-overflow{
  animation: move_left_right 10s linear 0s infinite ;
}
@keyframes move_left_right {
  from{
    transform: translateX(10%);
  }
  to{
    transform: translateX(-100%);
  }
}
.name-slide {
  width: 100%;
  white-space: nowrap;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
}
.audio img {
  width: 15vw;
}
.time {
  color: #71537e;
  font-size: 2.9vw;
  padding-right: 4vw;
  text-align: right;
}

.audio input[type=range] {
  width: 40vw;
  height: 2px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: #71537e;
}
.audio input[type=range]::-moz-range-track {
  background: #71537e;
}
.audio input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 1.3vw;
  height: 3.5vw;
  background-color: #71537e;
  border-right: 1px solid #F5D7D9;
  border-bottom: 1px solid #F5D7D9;
}
.audio input[type=range]::-moz-range-thumb{
  -moz-appearance: none;
  width: 1.3vw;
  height: 3.5vw;
  background-color: #71537e;
  border-radius: 0;
  border-right: 1px solid #F5D7D9;
  border-bottom: 1px solid #F5D7D9;
}
.disabled {
  pointer-events: none
}
.abled {
  pointer-events: all
}
</style>
