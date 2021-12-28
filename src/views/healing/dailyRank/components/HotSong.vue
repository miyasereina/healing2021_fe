<template>
  <div ref="whole" class="singer" @click="Jumpto()">
    <div class="singerimg" @click.stop="JumptoUser()">
      <img class="img" :src="avatar" />
    </div>
    <div class="msg">
      <div class="SingerName">{{ user }}</div>
      <div class="date">{{ time }}</div>
      <!--timeFormat(time)-->
    </div>
    <div class="SongName">{{ name }}</div>
    <div
      :class="[playthis ? 'playon' : 'play']"
      @click.stop="play()"
    ></div>
    <likes
      ref="like"
      class="like"
      :id="id"
      :numberShow="0"
      :type="2"
      :praise="praise"
      :isPraise="likethis"
      @likeChange="likeChange"
    ></likes>
    <!--<span class="likenum">{{ likes }}</span>*/-->
  </div>
</template>

<script>
import Likes from '@/components/Likes'

export default {
  name: 'HotSong',
  data () {
    return {
      // playing: false,
      singerimg:
        '',
      likethis: false,
      playthis: 0
    }
  },
  props: [
    'avatar',
    'user',
    'name',
    'time',
    'id',
    'user_id',
    // 'id',
    // 'photo',
    // 'text',
    // 'source',
    // 'avatar',
    // 'type',
    // 'praise',
    // 'name',
    // 'playingID',
    // 'user_id',
    // 'isPraise',
    // 'OnWhichpage'
  ],
  created () {
    this.likethis = this.isPraise
  },
  watch: {
    playingID () {
      if (
        !(this.playingID === this.id || this.playingID === this.id.toString())
      ) {
        this.playthis = 0
        console.log('playingIDnotEqualtothisid')
      } else this.playthis = 1
    },
    playthis (val) {
      if (val === 1) this.$refs.play.className = 'playon'
      else this.$refs.play.className = 'play'
    },
    likethis () {
      // this.$refs.like.likethis = this.likethis
    },
    isPraise (newVal, oldVal) {
      var that = this
      this.$nextTick(function () {
        that.likethis = newVal
      })

      console.log('newIsPraise')
    }
  },
  methods: {
    // timeFormat (time) {
    //   const regTime = /^\d{4}-\d{2}-\d{2}/
    //   return regTime.exec(time).toString()
    // },
    play () {
      if (this.playthis === 0) {
        this.playthis = 1
        console.log(this.playthis)
        var that = this
        this.$emit('changePlayingID', that.id)
        this.$emit('activePlayer')
        this.$emit('likeChangeSing', that.likethis)
      }
    },
    JumptoUser () {
      this.$router.push({
        path: '/healingDetail',
        query: {
          id: this.user_id
        }
      })
    },
    Jumpto () {
      console.log('click')
      if (this.OnWhichpage === 'Singer') return
      if (this.OnWhichpage === 'Toptoday') {
        var JumpDestination = '/healingDetail/' + this.id

        this.$router.push(JumpDestination)
      }
    },
    likeChange (likethis) {
      console.log(likethis)
      if (likethis !== this.likethis) this.likethis = likethis
      if (this.playingID === this.id) this.$emit('likeChangeSing', likethis)
    }
  },
  components: {
    Likes
  }
}
</script>
<style scoped>
.singer {
  display: grid;
  background-color: inherit;
  height: 10vh;
  width: 100%;
  position: relative;
  font-size: 3vh;
  border-top: 0.1vw solid lightgray;
}
.singerimg {
  position: absolute;
  float: left;
  height: 7vh;
  width: 12%;
  left: 3vw;
  top: 2vh;
}
.img {
  border-radius: 50%;
  height: 100%;
  width: 100%;
}
.msg {
  height: 100%;
  width: 35%;
  position: absolute;
  left: 22vw;
  top: 0.5vh;
}
.SingerName {
  display: inline-block;
  font-weight: 50;
  font-size: 3.6vw;
  max-width: 20vw;
  max-height: 12vw;
  overflow-x: hidden;
  overflow-y: auto;
  /* height: 4.5vw; */
}
.date {
  color: gray;
  font-weight: 50;
  font-size: 2.6vw;
}
.SongName {
  font-size: 4vw;
  /* height: 4.5vw; */
  /* display: inline-block; */
  width: 35%;
  height: 13vh;
  max-height: 13vw;
  max-width: 28vw;
  /* max-height: 4vh; */
  position: absolute;
  overflow-x: hidden;
  left: 45vw;
  top: 1vh;
}
.like {
  height: 100%;
  width: 10%;
  /* position: absolute; */
  /* right: 16vw; */
  bottom: 2vh;
}
/*.likenum {
  position: absolute;
  bottom: -40%;
  left: 30%;
}*/
.play {
  height: 30px;
  width: 8%;
  background-image: url('../../../../assets/play.png');
  background-size: 100% 100%;
  position: absolute;
  right: 4vw;
  bottom: 3vh;
}
.playon {
  height: 30px;
  width: 8%;
  background-image: url('http://cdn.healing2020.100steps.top/static/folder/components/playon.png');
  background-size: 100% 100%;
  position: absolute;
  right: 4vw;
  bottom: 3vh;
}
</style>
