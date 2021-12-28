<template>
  <div class="container">
    <div class="music-name">
      {{props.song_name}}
    </div>
    <div class="play-icon-container">
      <img @click="playMusic" class="img" src="@/assets/play.png" alt="">
    </div>
  </div>
</template>

<script setup>
import { useStore } from "vuex"

  let store = useStore() 
  const props = defineProps({
      song_name:String,
      file:String,
      singer:String,
      chosen:String
  })
  function playMusic(){
    store.commit('setCurrentMusic',
    {
      check:0,
      song_name:props.song_name,
      file:props.file,
      singer:props.singer,
      icon:props.chosen==='阿细'?'http://cdn.healing2021.100steps.top/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20211117135252.jpg':'http://cdn.healing2021.100steps.top/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20211117135242.jpg',
      mode:'devotion',
      singer:props.chosen==='阿细'?'阿细':'梁山山'
    })
  }
</script>

<style lang="less" scoped>
  .container{
    display: flex;
    justify-content: space-between;
    width: 70%;
    align-items: center;
    height: 80px;
    .music-name{
      color: white;
    }
    .play-icon-container{
      .img{
        width: 20px;
      }
    }
  }
</style>