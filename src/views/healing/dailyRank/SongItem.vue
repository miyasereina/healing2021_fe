<template>
  <div class="container">
    <img @click="toPersonal" class="icon" :src="itemInfo.avatar">
    <div class="name-container">
      <div class="song_name">{{itemInfo.song_name}}</div>
      <div class="nickname">{{itemInfo.nickname?itemInfo.nickname:'快快加nickname'}}</div>
    </div>
    <!-- <img class="like" @click="thumb" src="@/assets/shixin.png" alt=""> -->
    <div class="like-container">
      <div class="like-box">
        <span @click="likeSong" :class="['like', 'iconfont', 'icon-xihuan',itemInfo.check===0?'before':'after']">
        </span>
        <span :class="['likebg', 'iconfont', 'icon-xihuan']"></span>
        <div class="num">{{itemInfo.likes}}</div>
      </div>
    </div>
    <img class="play" @click="toDetail" src="@/assets/play.png" alt="">
  </div>
</template>

<script setup>
  import { reactive, ref, toRef } from "vue"
  import { useStore } from "vuex"
  import axios from '@/axios.js'
import { useRouter } from "vue-router"
  const store = useStore() 
  const router = useRouter()

  const props = defineProps({
    itemInfo:Object
  })
  
  // const itemInfo = toRef(props, 'itemInfo')
  // let like = ref(itemInfo.check)
  let itemInfo = reactive(props.itemInfo)

  const likeSong = () => {
    axios
    .put('/like', {
      todo: itemInfo.check===1 ? -1 : 1,
      type: 3,
      id: itemInfo.cover_id 
    })
    .then((res) => {
      console.log(itemInfo.check);
      itemInfo.check = itemInfo.check===0?1:0
      console.log(itemInfo.check);
      if(itemInfo.check===0){
        itemInfo.likes--
      }
      else{
        itemInfo.likes++
      }
    })
    .catch((err) => {
      console.error(err)
    })
  }
  const toDetail = () => {
    router.push('/healingdetail/' + itemInfo.selection_id)
  }
  const toPersonal = () => {
    router.push({
      name: '/personal',
      query: {
        id: itemInfo.user_id
      }
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
    .name-container{
      width: 30vw;
      display: flex;
      flex-direction: column;

      .song_name{
        

        width: 30vw;
        font-size: 17px;
        color: white;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap

      }
      .nickname{

        width: 30vw;
        font-size: 14px;
        color: rgba(255, 255, 255, 0.726);
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap
      }
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