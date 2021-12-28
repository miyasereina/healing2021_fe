<template>
  <div class="search-box-wrapper">
    <div class="search-box" @click="searchBoxClickHandler">
      <div class="search-wrapper">
        <!-- <div class="search-btn" v-show="route.path !== '/searchdialog'">
          <img src="../../../assets/search.png">
        </div> -->
        <form action="javascript:return true" @submit.prevent>
          <input
            type="search"
            placeholder="搜索用户/歌曲"
            v-model="text"
            @keydown.enter="searchBtnHandler"
            ref="searchInput"
          />
        </form>
        <div
          class="search-btn"
          @click="searchBtnHandler"
          v-show="route.path === '/healingsearch'"
        >
          <img src="../../../assets/search.png" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  name: 'SearchBox',
  emits: ['search'],
  setup(props, context) {
    const text = ref(null) // 后面要改成动态的然后传值searchText
    const searchInput = ref(null)
    const route = useRoute()
    const router = useRouter()

    const searchBoxClickHandler = () => {
      context.emit('search')
    }
    const searchBtnHandler = () => {
      searchInput.value.blur()
      router.push({
        path: '/healingsearch',
        query: {
          searchText: text
        }
      })
    }

    return {
      text,
      searchInput,
      searchBoxClickHandler,
      searchBtnHandler,
      route
    }
  }
}
</script>

<style scoped>
.search-box-wrapper {
  margin: 0 auto;
  height: 100%;
  width: 86vw;
  display: flex;
  justify-content: center;
  align-items: center;
}
.search-box-wrapper * {
  display: flex;
  justify-content: center;
  align-items: center;
}
.search-box {
  width: 96%;
  height: 8vw;
  border-radius: 4vw;
  border: 2px solid white;
  background-color: transparent;
  box-sizing: border-box;
}
.search-wrapper {
  width: 100%;
  height: 75%;
}
.search-wrapper > form {
  width: 85%;
  background-color: transparent;
}
.search-wrapper > form > input {
  width: 100%;
  background-color: transparent;
  border: none;
  outline: none;
  text-align: center;
}
.search-wrapper > form > input::-webkit-input-placeholder {
  color: rgb(172, 183, 189);
  font-size: 3.8vw;
}
.search-wrapper > .search-btn {
  width: 10%;
  height: 100%;
}
.search-wrapper > .search-btn > img {
  width: 80%;
  height: auto;
}
</style>
