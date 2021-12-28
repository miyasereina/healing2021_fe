<template>
  <div class="home" ref="homePage">
    <!-- <dialog /> -->
    <navbar>
      <template #left>
        <!-- <back-btn :width="'' + backBtnWidth"></back-btn> -->
      </template>
      <template #middle>
        <search-box v-model="searchText" @search="search" ref="searchBox" />
      </template>
      <template #right>
        <!-- <share-btn :width="'' + shareBtnWidth"></share-btn> -->
      </template>
    </navbar>
    <banner />
    <div class="to-childhood" @click="$router.push('/recallchildhood')">
      追 忆 童 年
    </div>
    <entries />
    <songs v-model:reach="isReach" />
    <navigation-bar currentPage="healing"></navigation-bar>
  </div>
</template>

<script>
import Navbar from '@/components/NavBar'
import SearchBox from '@/views/healing/components/SearchBox'
import NavigationBar from '../../components/NavigationBar.vue'
import Banner from './Banner/banner.vue'
import Entries from './entries/Entries.vue'
import Songs from './songs/Songs.vue'

export default {
  name: 'Home',
  data() {
    return {
      searchText: '',
      isReach: false
    }
  },
  methods: {
    search() {
      this.$router.push('/healingsearch')
    }
  },
  mounted() {
    const homePage = this.$refs.homePage
    const reachBottomTrigger = () => {
      if (
        homePage.scrollHeight - (homePage.scrollTop + homePage.offsetHeight) <
        40
      ) {
        this.isReach = true
      }
    }
    reachBottomTrigger()

    homePage.addEventListener('scroll', reachBottomTrigger)
  },
  components: {
    Navbar,
    SearchBox,
    NavigationBar,
    Banner,
    Entries,
    Songs
  }
}
</script>

<style scoped>
.home {
  height: calc(100vh - 78px);
  overflow-y: auto;
  overflow-x: hidden;
}

.to-childhood {
  margin: 10px auto;
  width: 90vw;
  height: 5vh;
  background-image: url('../../assets/toChildhood.png');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
