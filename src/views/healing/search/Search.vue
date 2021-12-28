<script>
  export default {
    name: 'Search'
  }
</script>
<template>
  <div class="page-container">
    <!-- 顶部搜索栏 -->
    <div class="top">
      <img src="@/assets/fanhui.png" @click="goBack"  alt="" class="back-btn">
      <div class="search-box">
        <div class="input-container">
          <input
            class="input"
            type="search"
            placeholder="输入关键词  搜索用户/歌曲"
            v-model ="string"
            @keydown.enter="searchBtnHandler"
            ref="searchInput"
          >
          <img src="@/assets/search.png" @click="searchBtnHandler" alt="" class="search-icon">
        </div>
      </div>
    </div>
    <!-- 没搜索前的容器 -->
    <div v-if="origin===1" class="origin-container">
      <div class="hot-title">
        热榜
      </div>
      <div v-if="hotList.length===0" class="tips">
        暂时没有歌曲哦，努力登上治愈热榜吧！
      </div>
      <div class="hot-container">
        <hot-item 
          v-for="(item,index) in hotList" 
          :key="item.cover_id"
          :index='index+1'
          :itemInfo="item" >
        </hot-item>
      </div>
    </div>
    <!-- 搜索后的容器 -->
    <div v-else class="result-container">
      <div class="list-container" >
        <div class="title">
          用户({{resultInfo.users}})
        </div>
        <div v-if="userList.length===0" class="tips">没有搜索到匹配的用户哦~</div>
        
        <user-item 
          v-for="item in userList" 
          :userData="item"
          :key="item.user_id"
          :avatar="item.avatar"
          :nickname="item.nickname"
          :slogan="item.slogan"
          :user_id="item.user_id"
        ></user-item>
      </div>
      <div class="list-container">
        <div class="title">
          点歌({{resultInfo.selections}})
        </div>
        <div v-if="selectionList.length===0" class="tips">没有搜索到匹配的歌曲哦~</div>
        <song-item v-for="item in selectionList" :key="item.selection_id" :songData="item"></song-item>
      </div>
      <div class="list-container">
        <div class="title">
          翻唱({{resultInfo.covers}})
        </div>
        <div v-if="coverList.length===0" class="tips">没有搜索到匹配的翻唱哦~</div>
        <song-item v-for="item in coverList" :key="item.cover_id" :songData="item"></song-item>
      </div>
    </div>

    <div v-if="store.state.currentMusic.file!==''" class="placeholder">


    </div>
  </div>
  <n-spin v-show="spinShow" class="spin" stroke="white" description="正在查询哦~">
  </n-spin>
</template>


<script setup>
  import { ref } from "vue"
  import { useRouter } from "vue-router";
  import { useStore } from "vuex";
  import axios from '@/axios.js'
  import UserItem from './components/UserItem.vue'
  import SongItem from './components/SongItem.vue'
  import HotItem from './components/HotItem.vue'
  const store = useStore()
  const router = useRouter()
  //转圈圈的展示
  let spinShow = ref(0)
  //标记当前是还没搜索还是已经搜索
  let origin = ref(1)
  //输入的字符串 
  let string = ref('')
  //热榜信息
  let hotList = ref([])
  //返回的基本信息
  let resultInfo = ref({})
  let userList = ref([])
  let selectionList = ref([])
  let coverList = ref([])


  axios.get('/healing/dailyrank/all')
    .then(res=>{
      console.log(res.data);
      hotList.value=res.data
    })
  function goBack(){
    router.go(-1)
  }
  function searchBtnHandler(){
    // console.log(string.value);
    spinShow.value=1
    axios.post('/healing/search',{keyword:string.value})
    .then(res=>{
      console.log(res.data);
      spinShow.value=0
      origin.value=0
      resultInfo.value = res.data[0]
      userList.value = res.data[1]
      selectionList.value = res.data[2]
      coverList.value = res.data[3]
    })
    
  }

</script>

<style scoped lang="less">
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
  height: 70px;
  // background-color: #cdf;
  display: flex;
  align-items: center;

  .back-btn{
    margin-left: 20px;
    width: 5vw;
  }
  .search-box{
    width: 95vw;
    height: 100%;
    // background-color: rgb(64, 100, 136);
    display: flex;
    align-items: center;
    justify-content: center;
    .input-container{
      width: 90%;
      height: 48%;
      border-radius: 20px;
      border: 2px solid white;
      display: flex;
      align-items: center;
      justify-content: space-around;
      .input {
        margin-left: 10px;
        width: 70%;
        background: rgba(0, 0, 0, 0);
        border: 0;
        height: 40px;
        color: white;
        outline-style: none;
        border-radius: 20px;
        &::placeholder{
          text-align: center;
          color: rgba(255, 255, 255, 0.876);
        }
      }
      .search-icon{
        height: 26px;
      }
    }
  }
}
.origin-container{
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  overflow: auto;
  padding: 10px 46px;
  .tips{
    color: white;
    margin-top: 20px;
  }
  .hot-title{
    color: white;
    font-size: 20px;
  }
  .hot-container{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
}
.result-container{
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  overflow: auto;
  padding: 20px 30px;
  .list-container{
    display: flex;
    flex-direction: column;
      .title{
        color: white;
        font-size: 20px;
      }
      .tips{
        color: rgb(200, 200, 200);
        font-size: 20px;
        margin: 10px 0;
        text-indent: 2em;
      }
  }

}
.spin{
  color: white;
  position: absolute;
  top: 100px;
  left: 0;
  right: 0;
}
.placeholder{
  height: 60px;
  width: 20px;
}
</style>