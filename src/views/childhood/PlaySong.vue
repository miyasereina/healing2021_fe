<!-- 需要传入歌曲id,页面一加载就就向后端发请求 -->
<template>
  <div class="top">
    <span class="iconfont icon-left"></span>
  </div>
  <div class="introduce">
    <div class="song-name">歌曲名</div>
    <div class="work-name">作品名</div>
    <div class="singer-name">歌手/翻唱用户名</div>
  </div>
  <div class="content">
    <div class="disc"></div>
    <div class="slogan"></div>
  </div>
  <div class="menu">
    <div class="slider-container">
      <n-slider v-model:value="slider" />
    </div>
    <div class="btns-container">
      <img class="shixin icon" src="@/assets/shixin.png" alt="">
      <img class="back icon" src="@/assets/back.png" alt="">
      <img class="play icon" src="@/assets/play.png" alt="">
      <img class="forward icon" src="@/assets/forward.png" alt="">
      <img class="fenxiang icon" src="@/assets/fenxiang.png" alt="">

      <!-- <span class="iconfont icon-heart"></span>
      <span class="iconfont icon-step-backward"></span>
      <span class="iconfont icon-play"></span>
      <span class="iconfont icon-step-backward rotate"></span>
      <span class="iconfont icon-share"></span> -->
    </div>
  </div>
</template>

<script>
// 引入组件对应的样式，若组件没有样式文件，则无须引入
import { reactive,ref } from 'vue'

export default {
  name: 'PlaySong',
  setup(props,context) {
    const slider = ref(0)
    return {
      slider
    }
  },
  components: {
  },
}

</script>
<style lang="less" scoped>
  .top{
    display: flex;
    .icon-left{
      margin: 20px;
      // margin-top: 20px;
      font-size: 40px;
      color: white;
    }
  }
  .introduce{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: -30px;
    color: white;
    .song-name{
      font-size: 30px;
    }
    .work-name{
      font-size: 20px;
      margin-top: 10px;
    }
    .singer-name{
      font-size: 15px;
      margin-top: 10px;
    }
  }
  .content{
    display: flex;
    justify-content: center;
    .disc{
      margin-top:30px ;
      width: 255px;
      height: 255px;
      border-radius: 200px;
      background-color: #fff;
    }
  }

  .menu{
    .slider-container{
      margin-top: 45px;
      display: flex;
      padding:0 40px;
    }
    .btns-container{
      margin-top: 50px;
      display: flex;
      justify-content: space-between;
      padding: 0 30px;
      .icon{
        height: 30px;
      }
    }

  }
</style>