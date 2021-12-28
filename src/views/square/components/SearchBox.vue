<template>
  <div class="search-box-wrapper">
    <div class="search-box" @click="searchBoxClickHandler">
      <div class="search-wrapper">
        <div class="search-btn" v-show="route.path !== '/searchdialog'">
          <img src="../../../assets/search.png" />
        </div>
        <form action="javascript:return true" @submit.prevent>
          <input
            type="search"
            placeholder="输入关键词  搜索 状态/歌曲"
            v-model="text"
            @keydown.enter="searchBtnHandler"
            ref="searchInput"
          />
        </form>
        <div
          class="search-btn"
          @click.stop="searchBtnHandler"
          v-show="route.path === '/searchdialog'"
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
  emits: ['setHistoryItems'],
  setup(props, context) {
    const text = ref('')
    const searchInput = ref(null)
    const route = useRoute()
    const router = useRouter()

    const searchBoxClickHandler = () => {
      if (route.path === '/searchdialog') {
        return false
      } else {
        router.push({
          path: '/searchdialog',
          query: {
            page: route.path
          }
        })
      }
    }
    const searchBtnHandler = () => {
      searchInput.value.blur()
      context.emit('setHistoryItems', text.value)
      router.push({
        path: '/search',
        query: {
          keyword: text.value
        }
      })
    }

    return {
      text,
      searchInput,
      route,
      searchBoxClickHandler,
      searchBtnHandler
    }
  }
}
</script>

<style scoped>
.search-box-wrapper {
  height: 100%;
  width: 80vw;
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
  color: white;
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
