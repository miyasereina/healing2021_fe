<script>
  export default {
    name: 'Cover'
  }
</script>
<template>
  <div :class="[store.state.currentMusic.file===''?'page-container-without-player':'page-container-with-player']">
    <div class="top">
      <img @click="goBack" class="back-btn" src="@/assets/fanhui.png" alt="">
    </div>
    <div class="title">
      <div class="name-container">
        <div class="name" ref="words" :text="childhoodOriginalInfo.song_name" :style="{animationDuration:words && words.offsetWidth / 30 + 's'}" >{{childhoodOriginalInfo.song_name}}</div>
      </div>
      <div class="work_name">{{childhoodOriginalInfo.work_name}}</div>
    </div>
    <div class="work-container">
      <div class="left">
        <div class="title">原唱 </div>
        <div class="name">{{childhoodOriginalInfo.singer}}</div>
      </div>
      <div class="right">
        <img
          @click="playOrigin" 
          src="@/assets/play.png" 
          alt="" 
          class="img"
        >
      </div>
    </div>
    <div class="cover-list-title">
      用户翻唱
    </div>
    <div class="cover-list-container">
      <div class="fix">
        <cover-music 
          class="cover-music-item" 
          v-for="item in childhoodOriginalCovers" 
          :key="item.cover_id"
          :itemData="item"
          :classic_id="route.query.classic_id"
          :icon="childhoodOriginalInfo.icon"
          :song_name="childhoodOriginalInfo.song_name"
        />
      </div>
    </div>
    <div class="btn">
      <div @click="toRecordPage" class="pillow">
        我也要唱
      </div>
    </div>
  </div>
</template>

<script setup>
  import CoverMusic from './components/CoverMusic.vue'
  import { useRoute, useRouter } from 'vue-router'
  import {  ref } from "vue"
  import { useStore } from 'vuex'
  import api from './api.js'
  const store = useStore()
  const route = useRoute()
  const router = useRouter()
  let words = ref(null)
  let childhoodOriginalCovers = ref([])
  let childhoodOriginalInfo = ref({})
  
  api.getChildhoodOriginalInfo({classic_id:route.query.classic_id})
  .then(res=>{
    console.log(res);
    childhoodOriginalInfo.value=res
  })

  api.getChildhoodOriginalCovers({classic_id:route.query.classic_id})
  .then(res=>{
    console.log(res);
    childhoodOriginalCovers.value=res
  })

  function goBack(){
    router.go(-1)
  }

  function playOrigin(){
    console.log(childhoodOriginalInfo.value.icon);
    store.commit('setCurrentMusic',{
        //设置全局播放参数
        mode:'origin',
        classic_id:route.query.classic_id,
        icon:childhoodOriginalInfo.value.icon,
        song_name:childhoodOriginalInfo.value.song_name,
        singer:childhoodOriginalInfo.value.singer,
        file:childhoodOriginalInfo.value.classic_url,
        current_music_id:'',
        check:0
    })
  }

  function toRecordPage(){

    router.push({
      path:'/record',
      query:{
        type:'childhood',
        name:childhoodOriginalInfo.value.song_name,
        originName:childhoodOriginalInfo.value.singer,
        id:route.query.classic_id
      }
    })
  }
</script>

<style lang="less" scoped>
  .page-container-with-player{
    display: flex;
    align-items: center;
    flex-direction: column;
    position: absolute;
    top: 0;
    bottom: 60px;
    left: 0;
    right: 0;
  }
  .page-container-without-player{
    display: flex;
    align-items: center;
    flex-direction: column;
    position: absolute;
    top: 0;
    bottom: 30px;
    left: 0;
    right: 0;
  }

  .top{
    width: 100%;
    .back-btn{
      margin: 15px 20px;
      width: 4vw;
    }
  }

  .title{
    display: flex;
    flex-direction: column;
    align-items: center;
    .name-container{
        width: 200px;
        white-space: nowrap;
        overflow: hidden;
        .name {
          position: relative;
          width: fit-content;
          animation:move 4s linear infinite;
          padding-left:50px;
          font-size: 30px;
          color: white;
          // height: 30px;
        }
        .name::after{
          position: absolute; 
          right:-100%;
          content:attr(text);
        }
      // .name{
      //   margin-top: -20px;
      //   color: white;
      //   font-size: 30px;
      // }
    }
    .work_name{
      margin-top: 10px;
      color: rgba(255, 255, 255, 0.808);
      font-size: 20px;
    }
  }
  .work-container{
    margin-top: 10px;
    width: 85%;
    height: 80px;
    border-radius: 10px;
    border: 2px solid white;
    display: flex;
    justify-content: space-between;
    .left{
      margin: 10px 14px;
      display: flex;
      flex-direction: column;
      .title{
        color: white;
        font-size: 20px;
      }
      .name{
        margin-top: 5px;
        color: rgba(255, 255, 255, 0.698);
      }
    }
    .right{
      display: flex;
      align-items: center;
      margin-right: 20px;
      .img{
        height: 7vw;
      }
    }
  }

  .cover-list-title{
    margin-top: 14px;
    width: 85%;
    font-size: 20px;
    justify-self: left;
    color: white;
  }
  .cover-list-container{
    flex:1;
    width: 85%;
    border: 2px solid white;
    margin: 20px 0;
    border-radius: 10px;
      min-height: 0;
    .fix{
      width: 100%;
      height: 100%;
      overflow: scroll;
      display: flex;
      flex-direction: column;
      align-items: center;

      .cover-music-item{
        margin-top: 10px;
      }
      .cover-music-item:nth-last-child(n+2){
        border-bottom: 2px solid #6494B2;
      }

    }
  }
  .btn{
    display: flex;
    justify-content: center;
    margin-top: auto;
    margin-bottom: 20px;
    width: 100%;
    .pillow{
      width: 90px;
      height: 40px;
      color: rgb(82, 82, 82);
      font-size: 15px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-image: url('../../assets/pillow.png');
      background-size: 100% 100%;
    }
  }
  .words {
    position: relative;
    width: fit-content;
    animation:move 4s linear infinite;
    padding-left:50px;
  }
  .words::after{
    position: absolute; 
    right:-100%;
    content:attr(text);
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