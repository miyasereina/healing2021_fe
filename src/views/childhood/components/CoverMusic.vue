<template>
  <div class="container">
    <img @click="toPersonal" :src="itemData.avatar" alt="" class="avatar">
    <div class="middle">
      <div class="name">
        {{itemData.nickname?itemData.nickname:'快把nickname补上'}}
      </div>
      <div class="time">
        {{itemData.post_time.split(' ')[0]}}
      </div>
    </div>
    <div class="right">
      <img @click="play" src="@/assets/play.png" alt="" class="img">
    </div>
  </div>
</template>

<script setup>  
  import { useStore } from "vuex";
  import { toRef } from "vue";
  import api from "../api";
import { useRouter } from "vue-router";
  const router = useRouter()
  const store = useStore()
  const props = defineProps({
    itemData:Object,
    classic_id:String,
    song_name:String,
    icon:String
  })
  const itemData = toRef(props, 'itemData')
  
  function play(){
    store.commit('setCurrentMusic',{
      mode:'childhood',
      classic_id:props.classic_id,
      icon:itemData.value.avatar,
      song_name:props.song_name,
      singer:itemData.value.nickname,
      file:itemData.value.file,
      current_music_id:itemData.value.cover_id,
      check:itemData.value.check
    })
  }
  const toPersonal = () => {
    router.push({
      path: '/personal',
      query: {
        id: itemData.value.user_id
      }
    })
}
</script>

<style lang="less" scoped>
  .container{
    width: 90%;
    min-height: 60px;
    // padding-bottom: 10px;
    display: flex;
    align-items: center;
    .avatar{
      height: 40px;
      border-radius: 50%;
    }
    .middle{
      margin-left: 10px;
      .name{
        color: white;
        font-size: 18px;
      }
      .time{
        color: rgba(255, 255, 255, 0.733);
      }
    }
    .right{
      height: 100%;
      margin-left: auto;
      display: flex;
      align-items: center;
      .img{
        height: 7vw;
        margin-right: 5px;
      }
    }
  }
</style>