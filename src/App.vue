<script setup>
import axios from './axios'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import jssdk from './weixin'
import { NConfigProvider } from 'naive-ui'
import { createWebSocket, clearMessageList } from './WebSocket'
import MusicPlayer from '@/components/MusicPlayer'
import Toast from './components/Toast'

/**
 * @type import('naive-ui').GlobalThemeOverrides
 */
const themeOverrides = {
  Slider: {
    fillColor: '#214A69',
    fillColorHover: '#214A69'
    // railColor:'#214A69'
  }
}

const router = useRouter()
const store = useStore()

axios
  .get('/user')
  .then((res) => {
    console.log(res.data)
    const userData = {
      avatar: res.data.avatar,
      nickname: res.data.nickname,
      id: res.data.user_id,
      hobby: res.data.hobby || [],
      signature: res.data.signature,
      phone_number: res.data.phone_number || '',
      avatar_visible: res.data.avatar_visible,
      phone_search: res.data.phone_search,
      real_name_search: res.data.real_name_search,
      selection_num: res.data.selection_num
    }
    store.commit('setUser', userData)
    if (res.data.is_administrator) {
      store.commit('setAdmin', res.data.is_administrator)
    }

    createWebSocket(
      `${location.protocol === 'http:' ? 'ws' : 'wss'}://${
        location.host
      }/api/ws`
    )

    if (!res.data.is_existed) {
      clearMessageList()
      router.replace('/register')
    }
  })
  .catch((err) => {
    console.error(err)
  })

jssdk.init()
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <router-view v-slot="{ Component }">
      <transition>
        <keep-alive
          exclude="Chatroom,Cover,RequestSong,Record,HealingDetail,Search,DynamicDetail,Square,Personal"
        >
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
    <music-player
      v-if="store.state.currentMusic.file !== '' && $route.name !== 'Record'"
      v-show="
        $route.path === '/recallchildhood' ||
          $route.path === '/cover' ||
          $route.path === '/twoSinger' ||
          $route.name === 'HealingDetail' ||
          $route.name === 'Healing' ||
          $route.path === '/square'
      "
      :class="[
        $route.path === '/recallchildhood' ||
        $route.name === 'Healing' ||
        $route.path === '/square'
          ? 'bottom80'
          : 'bottom0'
      ]"
    />
  </n-config-provider>
  <toast></toast>
</template>

<!-- <script>
import axios from './axios'

export default {
  name: 'App',
  created() {
    axios
      .get('/user')
      .then((res) => {
        console.log(res)
        this.$store.commit('setUser', res.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }
}
</script> -->

<style>
/*#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}*/
html {
  background-image: url('../src/assets/bg.png');
  background-size: cover;
  background-position: top center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

body {
  margin: 0;
  padding: 0;
}
.bottom80 {
  z-index: 99;
  height: 60px;
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 80px;
  transition: all 0.2s ease-in;
}
.bottom0 {
  z-index: 99;
  height: 60px;
  width: 100%;
  position: fixed;
  left: 0;
  bottom: 0px;
  transition: all 0.2s ease-in;
}
</style>
