<template>
  <div class="container">
    <nav-bar>
      <template #left>
        <back-btn :path="'/square'"></back-btn>
      </template>
      <template #right>
        <search-box ref="searchBox"></search-box
        ><!-- v-model="searchText" -->
      </template>
    </nav-bar>
    <div class="dynamic-list" ref="dynamicList">
      <dynamic-item
        v-for="Dynamic in momentsList"
        :key="Dynamic.dynamics_id"
        :Dynamic="Dynamic"
        @click="goToDynamicDetail(Dynamic.dynamics_id)"
      ></dynamic-item>
      <div class="tip-bottom" v-if="isPageEnd">
        已经到底了~
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
import DynamicItem from './components/DynamicItem.vue'
import { ref, reactive, onMounted, computed } from 'vue'
import axios from '../../axios.js'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'Search',
  components: { BackBtn, NavBar, SearchBox, NavigationBar, DynamicItem },
  setup() {
    const momentsList = reactive([])

    const route = useRoute()
    const router = useRouter()

    const momentsPage = ref(-1)
    const isPageEnd = computed(() => momentsPage.value === -2)

    let isLoading = false
    const toGetData = () => {
      isLoading = true
      const page = momentsPage.value

      axios
        .get(
          `/dynamics/list/search?keyword=${route.query.keyword}&page=${page}`
        )
        .then((res) => {
          console.log(res)
          if (res.data) {
            res.data.forEach((el) => {
              momentsList.push(el)
            })
          } else {
            // 标记为-2，在触底加一后变成-1即停止加载
            momentsPage.value = -2
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
      if (momentsPage.value === -2) return

      if (
        dynamicList.value.scrollHeight -
          (dynamicList.value.scrollTop + dynamicList.value.offsetHeight) <
        10
      ) {
        momentsPage.value++
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

    return {
      dynamicList,
      momentsList,
      isPageEnd,
      goToDynamicDetail
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
