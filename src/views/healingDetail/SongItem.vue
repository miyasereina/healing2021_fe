<template>
  <div class="container">
    <img class="icon" :src="itemInfo.avatar">
    <div class="name">{{itemInfo.nickname}}</div>
    <!-- <img class="like" @click="thumb" src="@/assets/shixin.png" alt=""> -->
    <div class="like-container">
      <div class="like-box">
        <span @click="likeSong" :class="['like', 'iconfont', 'icon-xihuan',like===0?'before':'after']">
        </span>
        <span :class="['likebg', 'iconfont', 'icon-xihuan']"></span>
        <div class="num">{{itemInfo.likes}}</div>
      </div>
    </div>
    <img class="play" @click="playMusic" src="@/assets/play.png" alt="">
  </div>
</template>

<script setup>
  import { ref, toRef } from "vue"
  import { useStore } from "vuex"
  import axios from '@/axios.js'
  const store = useStore() 

  const props = defineProps({
    itemInfo:Object
  })
  const itemInfo = toRef(props, 'itemInfo')
  let like = ref(itemInfo.value.check)
  function playMusic(){
    console.log(itemInfo.value.check);
    store.commit('setCurrentMusic',{
      mode:'normal',
      classic_id:'',
      icon:itemInfo.value.avatar,
      song_name:itemInfo.value.song_name,
      singer:itemInfo.value.nickname,
      file:itemInfo.value.file,
      current_music_id:itemInfo.value.id,
      check:itemInfo.value.check,
    })
  }

  const likeSong = () => {
    axios
    .put('/like', {
      todo: like.value===1 ? -1 : 1,
      type: 3,
      id: itemInfo.value.id
    })
    .then((res) => {
      like.value = like.value===0?1:0
      if(like.value===0){
        itemInfo.value.likes--
      }
      else{
        itemInfo.value.likes++
      }
    })
    .catch((err) => {
      console.error(err)
    })
  }
</script>

<style lang="less" scoped>
  .container{
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 80vw;
    // height: 80px;
    min-height: 50px;
    .icon{
      width: 10vw;
      border-radius: 50%;
    }
    .name{
      width: 30vw;
      font-size: 17px;
      color: white;
      overflow:hidden;
      text-overflow:ellipsis;
      white-space:nowrap
    }
    .like-container{
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      height: 50px;
      .like-box{
        width: 8vw;
        height: 8vw;
        
      .like{
        position: absolute;
        font-size:8vw;
        color: #D3E9F9;
        top: 0px;
      }
      .likebg{
        font-size:8vw;
        color: #FFC8DA;
        position: absolute;
        z-index: -1;
      }

      .before{
        transition-duration: 1s;
        transform: scale(1);
      }
      .after{
        transform: scale(3);
        color: #FFC8DA;
        opacity: 0;
        transition-duration: 1s;
      }
      .num{
        position: absolute;
        bottom: -0.5em;
        color: #D3E9F9;
        left: 50%;
        transform: translateX(-50%);
      }
      }
    }
    .play{
      width:6vw;
    }
  }
</style>