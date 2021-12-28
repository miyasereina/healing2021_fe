<template>
  <div class="pm">
    <div class="pmMini">
      <img v-if="store.state.currentMusic.icon===''" :class="['pic',isPause?'rotate-pause':'rotate'] " src="@/assets/disic.png" alt="">
      <img v-else :class="['pic',isPause?'rotate-pause':'rotate'] " :src="store.state.currentMusic.icon" alt="">
      <div class="content" @click="drawerShow = true">
        <audio
          autoplay
          :src="store.state.currentMusic.file"
          @loadstart="onLoadStart"
          @loadedmetadata="onLoadedmetadata"
          @timeupdate="onTimeUpdate"
          @playing="onPlaying"
          @pause="onPause"
          @play="onPlay"
          @ended="onEnded"
          @canplaythrough="canPlaythrough"
          ref="globalAudio"
        />
        <div class="name">
          <div class="songname">{{store.state.currentMusic.song_name}}</div>
          <div class="artistname">-{{store.state.currentMusic.singer}}</div>
        </div>
        <div class="jindu">
          已经播放：{{displayedCurrentTime}} / {{displayDuration}}
        </div>

      </div>
      <div class="button">
        <div class="like-container">
          <span @click="thumb" :class="['icon', 'iconfont', 'icon-xihuan',store.state.currentMusic.check===0?'before':'after']"></span>
          <span @click="thumb" :class="['icon', 'iconfont', 'icon-xihuan','icon-bg']"></span>
        </div>
        <span v-if="isPause===true&&isLoaded===1" class="iconfont icon icon-bofang" @click="play"></span>
        <span v-if="isPause===false&&isLoaded===1" class="icon iconfont icon-zanting" @click="pause"></span>
        <n-spin v-if="isLoaded===0" stroke="#7E8EB2" class="icon" :size="27" :stroke-width="25"></n-spin>

      </div>
    </div>
    <n-drawer class="n-drawer" v-model:show="drawerShow" placement="right" width="100%">
      <div class="drawer">
        <div class="top">
          <img @click="drawerShow = false" src="@/assets/fanhui.png" class="iconfont icon-left" alt="">
        </div>
        <div class="introduce">
          <div class="song-name-container">
            
          <div ref='words' class="song-name" :text="store.state.currentMusic.song_name" :style="{animationDuration:words && words.offsetWidth / 30 + 's'}">{{store.state.currentMusic.song_name}}</div>
          </div>
          <!-- <div class="work-name">作品名</div> -->
          <div class="singer-name">{{store.state.currentMusic.singer}}</div>
        </div>
        <div class="content">
          <div class="disc">
            <img 
              v-if="store.state.currentMusic.icon===''"
              :class="['img',isPause?'rotate-pause':'rotate'] " 
              src="@/assets/disic.png" 
            >
            <img 
              v-else
              :class="['img',isPause?'rotate-pause':'rotate'] " 
              :src="store.state.currentMusic.icon" 
            >
          </div>
          <div class="slogan"></div>
        </div>
        <div class="menu">
          <div class="slider-container">
            <n-slider v-model:value="percentage" :on-update:value="changeMusicCurrentTime"/>
            <div class="poppage-current">{{displayedCurrentTime}}</div>
            <div class="poppage-duration">{{displayDuration}}</div>
          </div>
          <div class="btns-container">
            <!-- <img class="shixin icon" src="@/assets/shixin.png" alt=""> -->
            <div class="like-container">
              <span @click="thumb" :class="['icon', 'iconfont', 'icon-xihuan',store.state.currentMusic.check===0?'before':'after','icon-surface']"></span>
              <span @click="thumb" :class="['icon', 'iconfont', 'icon-xihuan','icon-bg']"></span>
            </div>
            <span v-if="isPause===true&&isLoaded===1" class="play iconfont icon-bofang" @click="play" alt=""></span>
            <span v-if="isPause===false&&isLoaded===1" class="pause iconfont icon-zanting" @click="pause"  alt=""></span>
            <n-spin v-if="isLoaded===0" stroke="#D6EBFA" class="icon" :size="40" :stroke-width="25" ></n-spin>
            <img class="fenxiang icon" @click="toSharePage" src="@/assets/fenxiang.png" alt="">
          </div>
        </div>
      </div>
    </n-drawer>
  </div>
</template>

<script setup>
  import {getCurrentInstance} from 'vue'
  import { useStore } from 'vuex'
  import axios from '@/axios.js'
  import formatter from '@/utils/format.js'
  import { ref,computed } from 'vue'
  import '@/assets/icon-font/iconfont.css'
  import { useRouter } from 'vue-router'
  const {proxy} = getCurrentInstance()
  
  const router = useRouter()
  const store = useStore()
  //#region 变量声明
  //音乐播放界面
  let drawerShow = ref(false)
  let words = ref(null)
  
  // 当前音频的播放位置
  let currentTime = ref(0)
  let displayedCurrentTime = computed(()=>formatter.formatCurrentTime(currentTime.value))
  let displayDuration = computed(()=>formatter.formatCurrentTime(duration.value))
  // 总时长
  let duration = ref(0)
  // 歌曲是否正在播放
  let isPause = ref(true)
  // 音乐播放进度的百分比
  let percentage = ref(0)
  // 音量
  let volume = ref(0)
  //歌曲加载状态
  let isLoaded = ref(0)
  //#endregion

  function onPause() {
    isPause.value=true
  }
  function onPlay() {
    isPause.value=false
  }
  function onLoadedmetadata(event) {
    duration.value = event.target.duration;
    isPause.value = event.target.paused;
    volume.value = event.target.volume * 100;
  }
  function onTimeUpdate(event) {
    currentTime.value = event.target.currentTime;
    percentage.value = (event.target.currentTime / event.target.duration) * 100;
  }
  function onEnd(){
    proxy.$refs.globalAudio.load();
  }
  function previousMusic(){
    axios.post('/healing/covers/jump',{jump:0,check:store.state.type})
  }
  function play(){
    proxy.$refs.globalAudio.play()
    console.log(proxy.$refs);
  }
  function pause(){
    proxy.$refs.globalAudio.pause()
  }
  function changeMusicCurrentTime(v) {
    proxy.$refs.globalAudio.currentTime = (v / 100) * proxy.$refs.globalAudio.duration;
  }
  function toSharePage(){
    if(store.state.currentMusic.mode==='childhood'||store.state.currentMusic.mode==='origin'){
      router.push({
        path:'/publishdynamic',
        query:{
          classic_id:store.state.currentMusic.classic_id,
          song_name:store.state.currentMusic.song_name
        }
      })
      drawerShow.value=false
    }
    else{
      store.commit('setToast','只有童年曲目可以分享到动态哦~')
    }
  }
  function thumb(){
    if(store.state.currentMusic.mode==='devotion'||store.state.currentMusic.mode==='origin'){
      store.commit('setToast','只能点赞翻唱哦~')
    }
    else{
      axios
      .put('/like', {
        todo: store.state.currentMusic.check===1 ? -1 : 1,
        type: 3,
        id: store.state.currentMusic.current_music_id
      })
      .then((res) => {
        console.log(res)
        store.commit('setLike')
      })
      .catch((err) => {
        console.error(err)
      })
    }
  }
  function onLoadStart(){
    isLoaded.value=0
  }
  function canPlaythrough(){
    isLoaded.value=1
    console.log(2);
  }
</script>

<style lang="less" scoped>
  .pm{
    .pmMini {
    height: 60px;
    width: 100%;
    background-color: #ffffffd0;
    display: flex;
    align-items: center;
    justify-content: space-around;
    // box-shadow: 0 -1px 6px #ccc;
      .pic {
        margin-left: 10px;
        height: 31px;
        width: 31px;
        border-radius: 50%;
        overflow: hidden;
        border: 8px solid #000;
      }
      .content {
        padding-left: 4px;
        box-sizing: border-box;
        .name {
          display: flex;
          font-size: 12px;
          width: 200px;
          align-items: center;
          .songname{
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
          }
          .artistname {
            font-size: 10px;
            color: #939393;
            width: 100px;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
          }
        }
        .jindu {
          margin-top: 4px;
          font-size: 9px;
          color: #afafaf;
        }
      }
      .button {
        width: 110px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-around;
        font-size: 18px;
        .iconfont {
          font-size: 27px;
          line-height: 27px;
          font-weight: 700;
          color: #7E8EB2;
        }
        .spin{
          height: 27px;
          width: 27px;

        }
        .like-container{
          width: 27px;
          height: 27px;
          .icon-xihuan{
            position: absolute;
            z-index: 6;
          }
          .icon-bg{
            color: #FFC8DA;
            position: absolute;
            z-index: 5;
          }
          .before{
            transition-duration: 0.7s;
            transform: scale(1);
          }
          .after{
            transform: scale(3);
            color: #FFC8DA;
            opacity: 0;
            transition-duration: 1s;
          }
        }
      }
    }
  }
  .drawer{
    display: flex;
    flex-direction: column;
    height: 100%;
    background-image: url('../assets/bg.png');
    background-size: cover;
    background-position: top center;
    background-repeat: no-repeat;
    .top{
      display: flex;
      height: 75px;
      .icon-left{
        margin: 20px;
        width: 20px;
        color: white;
      }
    }
    .introduce{
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 110px;
      margin-top: -30px;
      color: white;
      .song-name-container{
        width: 200px;
        white-space: nowrap;
        overflow: hidden;
        .song-name {
          position: relative;
          width: fit-content;
          animation:move 4s linear infinite;
          padding-left:50px;
          font-size: 30px;
        }
        .song-name::after{
          position: absolute; 
          right:-100%;
          content:attr(text);
        }
      }
      // .song-name{
      //   font-size: 22px;
      // }
      .work-name{
        font-size: 20px;
        margin-top: 10px;
      }
      .singer-name{
        font-size: 20px;
        margin-top: 20px;
      }
    }
    .content{
      display: flex;
      flex: 1;
      justify-content: center;
      align-items: center;
      .disc{
        margin-top:30px ;
        width: 275px;
        height: 275px;
        border-radius: 200px;
        overflow: hidden;
        background-color: rgb(44, 44, 44);
        display: flex ;
        justify-content: center;
        align-items: center;
        .img{
          width: 74%;
          border-radius: 50%;
        }
      }
    }
    .menu{
      height: 200px;
      .slider-container{
        position: relative;
        margin-top: 45px;
        display: flex;
        padding:0 40px;
        .poppage-current{
          position: absolute;
          left: 40px;
          top:20px;
          color: white;
        }
        .poppage-duration{
          position: absolute;
          right: 40px;
          top:20px;
          color: white;
        }
      }
      .btns-container{
        margin-top: 30px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 0 30px;
        .like-container{
          width: 40px;
          height: 40px;
          .icon-surface{
            position: absolute;
            z-index: 6;
            color: #D6EBFA;
            font-size: 40px;
            line-height: 40px;
          }
          .icon-bg{
            color: #FFC8DA;
            position: absolute;
            z-index: 5;
            font-size: 40px;
            line-height: 40px;
          }
          .before{
            transition-duration: 0.7s;
            transform: scale(1);
          }
          .after{
            transform: scale(3);
            color: #FFC8DA;
            opacity: 0;
            transition-duration: 1s;
          }
        }
        .icon{
          height: 30px;
        }
        .icon-bofang,.icon-zanting {
          font-size: 40px;
          color: #D6EBFA;
        }
        .spin{

        }
      }
    }
  }
  .rotate-pause {
    animation: rotate 80s linear infinite;
    animation-play-state:paused;
  }
  @keyframes rotate {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  .rotate {
    animation: rotate 80s linear infinite;
    animation-play-state:running;
  }

  .block {
    width: 500px;
    background-color: #65b4ae;
    white-space: nowrap;
    overflow: hidden;
  }

  @keyframes move {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-100%);
    }
  }
</style>