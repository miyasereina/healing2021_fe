<template>
  <div class="container">
    <div class="top">
      <nav-bar>
        <template #left>
          <back-btn :path="route.query.page"></back-btn>
        </template>
        <template #right>
          <search-box
            ref="searchBox"
            @setHistoryItems="setHistoryItems"
          ></search-box
          ><!-- v-model="searchText" -->
        </template>
      </nav-bar>
    </div>

    <div class="history">
      <div class="historyList" v-show="historyWords.length>0">
        <div class="upper">
          <div class="history-title">历史</div>
          <div @click="clearHistory" class="clear">清空</div>
        </div>
        <div class="list">
          <div
            v-for="(history, index) in historyWords"
            :key="index"
            class="history-word"
            :class="{ noMargin: index === 0 }"
            @click="toSearch(history)"
          >
            {{ history }}
          </div>
        </div>
      </div>
    </div>

    <div class="hot-issue">
      <div class="hot-issue-title">热搜</div>
      <div class="issue-list">
        <div v-for="(issue, index) in issueList" :key="index" class="issue">
          <div class="rank">{{ index + 1 }}</div>
          <div @click.stop="toSearch(issue)" class="keyword">{{ issue }}</div>
        </div>
      </div>
    </div>
    <navigation-bar currentPage="square"></navigation-bar>
  </div>
</template>

<script>
import BackBtn from '@/components/BackBtn.vue'
import NavBar from '@/components/NavBar'
import SearchBox from './components/SearchBox.vue'
import NavigationBar from '../../components/NavigationBar.vue'
import { ref, reactive, computed, onMounted, onActivated } from 'vue'
import axios from '../../axios.js'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'SearchDialog',
  components: {
    BackBtn,
    NavBar,
    SearchBox,
    NavigationBar
  },
  emits: ['hideDialog', 'showSearchResult'],
  setup(props, context) {
    const keyword = ref('')
    const historyWords = reactive([])
    const issueList = reactive([])
    /*const historyWords = reactive([
      '吃饭',
      '睡觉',
      '摸鱼',
      '加油',
      '棒棒哒'
    ])
    const issueList = reactive([
      '吃饭',
      '睡觉',
      '摸鱼',
      '乐跑',
      '游泳',
      '等待外卖',
      '取快递',
      '学习中',
      '运动中',
      '工作中'
    ])*/

    const route = useRoute()
    const router = useRouter()

    const toSearch = (keyword) => {
      /*
      axios
        .get(`/dynamic/list/search?keyword=${keyword}&page=0`)
        .then(res => {
          if (res.data) {
            console.log(res)
            context.emit('showSearchResult', res.data)
            setHistoryItems(keyword)
          } else {
            this.isLoading = false
          }
        })
        .catch(err => {
          console.log(err)
        })*/
      router.push({
        path: '/search',
        query: {
          keyword: keyword
        }
      })
      setHistoryItems(keyword)
      historyWords.length = 0
      issueList.length = 0
    }
    // 判断关键字是否存在，存在就移除添加在首位
    const setHistoryItems = (keyword) => {
      if (localStorage.getItem('DynamicHistory')) {
        // localStorage.DynamicHistory.push(keyword)
        const List = JSON.parse(localStorage.getItem('DynamicHistory'))
        const DynamicHistory = List.filter((p) => {
          return p != keyword
        })
        DynamicHistory.unshift(keyword)
        localStorage.setItem('DynamicHistory', JSON.stringify(DynamicHistory))
      } else {
        const List = []
        List.push(keyword)
        localStorage.setItem('DynamicHistory', JSON.stringify(List))
        // console.log(typeof(JSON.parse(localStorage.getItem('DynamicHistory'))))
      }
      /*
      let { DynamicHistory } = localStorage;
      if (DynamicHistory === undefined) {
        localStorage.DynamicHistory = keyword;
      } else {
        let DynamicHistory = DynamicHistory.split('|');
        const isExists = DynamicHistory.filter(e => e == keyword).length > 0;
        if (isExists) {
          DynamicHistory = keyword + '|' + DynamicHistory.filter(e => e != keyword).join('|');
        } else {
          DynamicHistory += '|' + keyword;
        }
        localStorage.DynamicHistory = DynamicHistory;
      }
      console.log(localStorage.getItem('DynamicHistory'))
      */
    }
    
    const isHistoryShow = computed(() => localStorage.getItem('DynamicHistory'))
    // const isHistoryShow = ref(true)

    const clearHistory = () => {
      localStorage.removeItem('DynamicHistory')
      console.log('成功')
      historyWords.length = 0
    }
    /*const handleClose = (history) => {
      localStorage.DynamicHistory.remove(history)
    }*/

    onActivated(() => {
      // console.log(localStorage.getItem('DynamicHistory'))
      console.log(JSON.parse(localStorage.getItem('DynamicHistory')))
      // console.log(historyWords)
      historyWords.length = 0
      issueList.length = 0
      const List = JSON.parse(localStorage.getItem('DynamicHistory'))
      if (List) {
        List.forEach((el) => {
          historyWords.push(el)
        })
      }
      
      axios
        .get('/dynamics/hotsearch')
        .then((res) => {
          res.data.forEach((el) => {
            issueList.push(el)
          })
        })
        .catch((err) => {
          console.log(err)
        })
    })

    return {
      keyword,
      historyWords,
      issueList,
      isHistoryShow,
      route,
      toSearch,
      setHistoryItems,
      clearHistory
      // handleClose
    }
  }
}
</script>

<style scoped>
.container {
  background: url('../../assets/background-dark.png');
  background-size: cover;
  height: 100vh;
  width: 100vw;
  position: absolute;
  left: 0;
  top: 0;
  font-family: MicrosoftYaHei;
  color: white;
}
.historyList,
.hot-issue {
  width: 80vw;
  margin-left: 10vw;
  margin-top: 10vw;
}
.history-title {
  height: 5vw;
}
.clear {
  position: relative;
  top: 3vw;
  left: 70vw;
  width: 10vw;
  margin: 0;
  font-size: 4vw;
}
.history-word {
  margin-top: 3vw;
  height: 7vw;
  padding-left: 1vw;
  padding-right: 1vw;
  text-align: center;
  padding-top: 0.4vw;
}
.history-title,
.hot-issue-title {
  font-size: 6vw;
}
.issue-list {
  display: flex;
  flex-wrap: wrap;
}
.list,
.issue {
  display: flex;
  margin-top: 5vw;
}
.issue-list .rank {
  width: 2ch;
}
.issue-list .issue {
  width: 50%;
}
.list {
  width: 80vw;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
}
.list::-webkit-scrollbar {
  display: none;
}
.history-word,
.keyword {
  margin-left: 5vw;
  border: 1.6px solid white;
  border-radius: 2vw;
  text-align: center;
  width: 20vw;
}
.noMargin {
  margin-left: 0;
}
</style>
