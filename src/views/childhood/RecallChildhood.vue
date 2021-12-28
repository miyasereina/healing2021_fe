<template>
  <div class="page-container">
    <div class="top">
      <img @click="goBack" src="../../assets/BackBtn(childhood).png" class="iconfont icon-arrowleft">
      <div  class="back-text">回归经典</div>
      <img class="kite" src="../../assets/kite.png" alt="">
    </div>

    <div class="main-container">
      <div class="title">
      追忆童年
      </div>
      <div class="big-img-container">
        <img src="http://cdn.healing2021.100steps.top/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20211114191535.jpg" alt="" class="big-img">
      </div>
    
      <div class="people-listen-container">
        <div class="text">大家都在听</div>
          <div class="small-img-container">
            <div class="img-list">
              <recomend-music 
                v-for="item in childhoodRank" 
                :key="item.classic_id" 
                :classic_id="item.classic_id" 
                :name="item.name" 
                :icon="item.icon"
              >
              </recomend-music>
            </div>
          </div>
      </div>
      <div class="classic-container">
        <div class="text">童年经典歌曲</div>
        <div class="classic-list">
          <classic-music
            v-for="item in childhoodList" 
            :key="item.classic_id" 
            :classic_id="item.classic_id" 
            :name="item.name" 
            :icon="item.icon"
            :work_name="item.work_name"
          >
          </classic-music>
        </div>
      </div>
      <div class="placehold"></div>
      
    </div>
    
    <navigation-bar class="fix-bar" />
  </div>
</template>

<script setup>
  import RecomendMusic from './components/RecomendMusic.vue'
  import NavigationBar from '@/components/NavigationBar.vue'
  import ClassicMusic from './components/ClassicMusic.vue'
  import { onMounted, reactive, ref } from 'vue'
  import { useStore } from 'vuex'
  
  import api from './api.js'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const store = useStore()

  const a = [{classic_id:1}]
  let childhoodRank = ref([])
  let childhoodList = ref([])
  api.getChildHoodRank()
  .then(res=>{
    childhoodRank.value = res
  })
  api.getChildhoodList()
  .then(res=>{
    console.log(res);
    childhoodList.value = res
  })

  function goBack(){
    router.push('/')
  }
</script>

<style lang="less" scoped>
.page-container{
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

  .top{
    background-image: url('../../assets/bg.png');
    background-size: 100%;
    z-index: 100;
    width: 100%;
    display: flex;
    align-items: center;
    .icon-arrowleft{
      margin: 18px 20px;
      width: 25px;
      color:white;
    }
    .back-text{
      color:white;
      margin-left: 10px;
      font-size: 20px;
    }
    .kite{
      position: absolute;
      z-index: -100;
      width: 30vw;
      right: 0;
      top: 20px;
    }
  }
  

  .main-container{
    top: 45px;
    width: 100vw;
    // overflow: hidd;
    flex: 1;
    min-height: 0;
    overflow: scroll;
    .title{
      display: flex;
      justify-content: center;
      font-size: 30px;
      color: white;
      margin-top: 10px;
      position: relative;
      .kite{
        position: absolute;
        z-index: -100;
        width: 30vw;
        right: 0;
        top: -38px;
      }
    }

    .big-img-container{
      display: flex;
      justify-content: center;
      padding:0 24px;
      .big-img{
        margin-top: 10px;
        border-radius: 20px;
        width: 100%;
        max-height: 170px;
        background-color: #fff;
      }
    }
  
    .people-listen-container{
      display: flex;
      flex-direction: column;
      height: 168px;
      .text{
        margin-top: 20px;
        margin-left: 24px;
        font-size: 18px;
        color: white;
      }
      .small-img-container{
        margin-top: 15px;
        padding: 0 24px;
        overflow-x: scroll;
        overflow-y: hidden;
        &::-webkit-scrollbar{
          display: none;
        }
        .img-list{
          float: left;
          display: flex;
          min-width: 100%;
          height: 120px;
        }
      }
    }

    .classic-container{
      .text{
        margin-top: 20px;
        margin-left: 24px;
        font-size: 18px;
        color: white;
      }
      .classic-list{
        // background-color: #fff;
        display: flex;
        flex-direction: column;
        align-items: center;
        .classic-item{
          width: 80vw;
          height: 70px;
          margin-top: 20px;
          border: 3px solid rgb(255, 255, 255);
          border-radius: 15px;
        }
      }

    }
  }
  .fix-bar{
    position: relative !important;
  }
  .placehold{
    height: 60px;
    width:100vw;
  }
</style>
