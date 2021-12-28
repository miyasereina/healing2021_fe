<template>
  <div class="page-container">
    <div class="top">
      <div class="wrap">
        <img @click="goBack" class="back-btn" src="@/assets/fanhui.png" alt="">
      </div>
      <div class="wrap">
        <div class="title">歌手献唱</div>
      </div>
      <div class="wrap">
        <div class="placeholder"></div>
      </div>
    </div>
    <div class="swiper">
      <!-- <div class="img">

      </div> -->
      <img src="http://cdn.healing2021.100steps.top/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20211111112128.jpg" alt="" class="img">
    </div>
    <div class="switch">
      <div :class="[chosen==='阿细'?'bg':'bg-right']"></div>
      <div class="switch-wrap">
        <div :class="['text',chosen==='阿细'?'active':'']" @click="toggle">阿细献唱</div>
      </div>
      <div class="switch-wrap">
        <div :class="['text',chosen==='梁山山'?'active':'']" @click="toggle">梁山山献唱</div>
      </div>
    </div>
    <div class="devotion-music">
      <devotion-music-item 
        v-for="item in chosen==='阿细'?xiList:shanList" 
        :key="item.key" 
        :song_name="item.song_name"
        :file="item.file"
        :singer="item.singer"
        :chosen="chosen"
      />
    </div>
    <div v-if="store.state.currentMusic.file !== '' " class="placeholder"></div>
  </div>
</template>

<script setup>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import { useStore } from "vuex";
  import api from "./api";
  import DevotionMusicItem from "./components/DevotionMusicItem.vue";
  let store = useStore()
  let router = useRouter()
  let chosen = ref('阿细')
  let shanList = ref([])
  let xiList = ref([])
  function toggle(){
    if(chosen.value==='阿细'){
      chosen.value='梁山山'
    }
    else{
      chosen.value='阿细'
    }
  }
  api.getHealingDevotion()
  .then(res=>{
    console.log(res);
    shanList.value=res['梁山山']
    xiList.value=res['阿细']
  })
  function goBack(){
    router.go(-1)
  }
</script>

<style lang="less" scoped>
  .page-container{
    display: flex;
    flex-direction: column;
    // justify-content: center;
    align-items: center;
  }
  .top{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .wrap{
      flex:1
    }
    .back-btn{
      float: left;
      margin: 18px 23px;
      width: 6vw;
    }
    .title{
      margin-left: 20px;
      font-size: 25px;
      font-weight: 500;
      color: white;
    }
  }
  .swiper{
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 10px;
    .img{
      width: 86%;
      max-height: 150px;
    }
  }
  .switch{
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    // background-color: #ddd;
    width: 80%;
    height: 40px;
    margin-top: 20px;
    border-radius: 16px;
    border:2px solid #3B518A;
    overflow: hidden;
    .bg{
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 50%;
      z-index: -10;
      border-radius: 16px 0px 0px 16px;
      background-color: #3B518A;
      transition: all 0.5s;
    }
    .bg-right{
      position: absolute;
      left: 50%;
      top: 0;
      height: 100%;
      width: 50%;
      border-radius: 0px 16px 16px 0px;
      z-index: -10;
      background-color: #3B518A;
      transition: all 0.5s;
    }
    .switch-wrap{
      flex:1;
      justify-content: center;
      .text{
        text-align: center;
        color: rgba(255, 255, 255, 0.65);
      }
      .active{
        color: white;
      }
    }
  }
  .devotion-music{
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .placeholder{
    height: 60px;
    width: 10px;
  }
</style>