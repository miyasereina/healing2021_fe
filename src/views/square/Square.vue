<script>
export default {
  name: 'Square'
}
</script>

<script setup>
import NavBar from '../../components/NavBar'
import SearchBox from './components/SearchBox.vue'
import AddBtn from './components/AddBtn.vue'
import NavigationBar from '../../components/NavigationBar.vue'
import DynamicItem from './components/DynamicItem.vue'
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from '../../axios.js'

const router = useRouter()

const currentMode = ref(0) // 0为推荐,1为最新
let isLoading = false

const currentModeKey = computed(() =>
  currentMode.value === 0 ? 'recommend' : 'new'
)
const momentsList = reactive({
  recommend: [],
  new: []
})
const momentsPage = ref([-1, -1])
const isPageEnd = computed(() => momentsPage.value[currentMode.value] === -2)

const changeMode = (mode) => {
  currentMode.value = mode
  if (momentsList[currentModeKey.value].length <= 0) {
    momentsPage.value[currentMode.value]++
    toGetData()
  }
}

const toGetData = () => {
  isLoading = true
  const method = currentModeKey.value
  const page = momentsPage.value[currentMode.value]

  axios
    .get(`/dynamics/list/${method}?page=${page}`)
    .then((res) => {
      console.log(res)
      if (res.data) {
        res.data.forEach((el) => {
          momentsList[method].push(el)
        })
      } else {
        // 标记为-2，在触底加一后变成-1即停止加载
        momentsPage.value[currentMode.value] = -2
      }
    })
    .catch((err) => {
      console.log(err)
    })
    .finally(() => {
      isLoading = false
    })
}

const dynamicList = ref(null)

const reachBottomTrigger = () => {
  if (isLoading) return

  // -2标识为触底
  if (momentsPage.value[currentMode.value] === -2) return

  if (
    dynamicList.value.scrollHeight -
      (dynamicList.value.scrollTop + dynamicList.value.offsetHeight) <
    10
  ) {
    momentsPage.value[currentMode.value]++
    toGetData()
  }
}

onMounted(() => {
  reachBottomTrigger()

  dynamicList.value.addEventListener('scroll', reachBottomTrigger)
})

const goToDynamicDetail = (id) => {
  router.push({
    path: '/dynamicdetail',
    query: {
      id: id
    }
  })
}
</script>

<template>
  <div class="container">
    <nav-bar>
      <template #left>
        <div style="height: 100%;width: 6vw;"></div>
      </template>
      <template #middle>
        <search-box ref="searchBox"></search-box>
      </template>
      <template #right>
        <add-btn ref="addBtn"></add-btn>
      </template>
    </nav-bar>
    <div class="top-guide">
      <div
        class="recommend"
        :class="{ checked: currentMode === 0 }"
        @click="changeMode(0)"
      >
        推荐
      </div>
      <div
        class="latest"
        :class="{ checked: currentMode === 1 }"
        @click="changeMode(1)"
      >
        最新
      </div>
    </div>
    <div class="dynamic-list" ref="dynamicList">
      <dynamic-item
        v-for="Dynamic in momentsList.recommend"
        :key="Dynamic.dynamics_id"
        :Dynamic="Dynamic"
        @click="goToDynamicDetail(Dynamic.dynamics_id)"
        v-show="currentMode === 0"
      /><!-- 推荐 -->
      <dynamic-item
        v-for="Dynamic in momentsList.new"
        :key="Dynamic.dynamics_id"
        :Dynamic="Dynamic"
        @click="goToDynamicDetail(Dynamic.dynamics_id)"
        v-show="currentMode === 1"
      /><!-- 最新 -->
      <div class="tip-bottom" v-if="isPageEnd">
        已经到底了~
      </div>
    </div>
    <navigation-bar currentPage="square" />
  </div>
</template>

<!-- <script>
import NavBar from '../../components/NavBar'
import SearchBox from './components/SearchBox.vue'
import AddBtn from './components/AddBtn.vue'
import NavigationBar from '../../components/NavigationBar.vue'
import DynamicItem from './components/DynamicItem.vue'
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from '../../axios.js'

export default {
  name: 'Square',
  components: {
    NavBar,
    SearchBox,
    AddBtn,
    DynamicItem,
    NavigationBar
  },
  setup() {
    let currentMode = ref(0) // 0为推荐,1为最新
    let page = ref(0)
    let isLoading = ref(true)

    const RecommendList = reactive([])
    const NewList = reactive([])

    const router = useRouter()

    const changeMode = (mode) => {
      currentMode.value = mode
      let method = ''
      if (currentMode.value === 0) {
        method = 'recommend'
        RecommendList.length = 0
      } else {
        method = 'new'
        NewList.length = 0
      }
      page.value = 0
      isLoading.value = true
      toGetData(method, page.value)
    }

    const toGetData = (method, page) => {
      if (method === 'recommend') {
        axios
          .get(`/dynamics/list/${method}?page=${page}`)
          .then((res) => {
            if (res.data) {
              console.log(res)
              res.data.forEach((el) => {
                RecommendList.push(el)
              })
            } else {
              isLoading.value = false
            }
          })
          .catch((err) => {
            console.log(err)
          })
      } else {
        axios
          .get(`/dynamics/list/${method}?page=${page}`)
          .then((res) => {
            if (res.data) {
              console.log(res)
              res.data.forEach((el) => {
                NewList.push(el)
              })
            } else {
              isLoading.value = false
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    }

    const dynamicList = ref(null)

    const reachBottomTrigger = () => {
      if (
        dynamicList.value.scrollHeight -
          (dynamicList.value.scrollTop + dynamicList.value.offsetHeight) <
        10
      ) {
        console.log('reach')
      }
    }

    onMounted(() => {
      console.log(dynamicList.value)
      reachBottomTrigger()

      dynamicList.value.addEventListener('scroll', reachBottomTrigger)
    })

    // onActivated(() => {
    //   axios
    //     .get(`/dynamics/list/recommend?page=0`)
    //     .then((res) => {
    //       if (res.data) {
    //         console.log(res)
    //         res.data.forEach((el) => {
    //           RecommendList.push(el)
    //         })
    //       } else {
    //         isLoading.value = false
    //       }
    //     })
    //     .catch((err) => {
    //       console.log(err)
    //     })
    // })

    const goToDynamicDetail = (id) => {
      router.push({
        path: '/dynamicdetail',
        query: {
          id: id
        }
      })
    }

    return {
      RecommendList,
      NewList,
      currentMode,
      page,
      isLoading,
      router,
      dynamicList,
      changeMode,
      toGetData,
      goToDynamicDetail
    }
  }
}
</script> -->

<style scoped>
.container {
  background: url('../../assets/background-dark.png');
  background-size: cover;
  height: 100vh;
  width: 100vw;
  font-family: MicrosoftYaHei;
}
.top-guide {
  margin: 0 auto;
  height: 10vw;
  width: 92vw;
  border-top: 1.8px solid white;
  border-bottom: 1.8px solid white;
  display: flex;
  justify-content: space-around;
  font-size: 4.5vw;
  color: rgb(119, 165, 201);
}
.recommend,
.latest {
  margin-top: 1.5vw;
}
.checked {
  /*font-size: 5vw;*/
  color: white;
  /*margin-top: 0.8vw;*/
}
.dynamic-list {
  height: calc(100vh - 23vw - 100px);
  overflow: scroll;
}
.tip-bottom {
  padding: 5px 0;
  text-align: center;
  color: #fff;
}
</style>
