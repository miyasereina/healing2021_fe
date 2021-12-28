<template>
  <n-card
    :bordered="false"
    style="height:100vh;text-align:center;--color:var(#fff0);--title-text-color: white;
    --title-font-weight: bold;--title-font-size:6vw;"
    title="我喜欢什么样的音乐？"
  >
    <template #header-extra>
      <div
        v-if="fromRegister"
        @click="skip"
        style="color:white;text-decoration: underline"
      >
        跳过
      </div>
    </template>
    <div style="height:7vh;text-align:left;">
      <label class="label">语种</label>
    </div>
    <div class="container">
      <div
        class="box"
        v-for="(item, i) in items2"
        :key="i"
        @click="choose(item.text, i, 2)"
      >
        <div class="borderbox">
          {{ item.text }}
        </div>

        <div class="imgbox">
          <img v-show="item.show" src="../../assets/star.png" class="img" />
        </div>
      </div>
    </div>
    <div style="height:7vh;text-align:left;">
      <label class="label">风格</label>
    </div>
    <div class="container">
      <div
        class="box"
        v-for="(item, i) in items"
        :key="i"
        @click="choose(item.text, i, 1)"
      >
        <div class="borderbox">
          {{ item.text }}
        </div>

        <div class="imgbox">
          <img v-show="item.show" src="../../assets/star.png" class="img" />
        </div>
      </div>
    </div>
    <div class="btnbox" v-show="preference.length !== 0 && !clickSkip">
      <div class="text" @click="commit">确&nbsp;&nbsp;认</div>
      <img class="btnimg" src="../../assets/btn.png" />
    </div>
  </n-card>
</template>
<script>
import axios from '@/axios'
import { defineComponent, reactive, ref, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import store from '../../store'

export default defineComponent({
  setup() {
    // 从哪个页面过来
    const route = useRoute()
    const router = useRouter()

    const fromRegister = ref(false)
    const preference = ref([])
    if (route.query.flag === '1') {
      // 1代表从注册页过来，
      fromRegister.value = true
    } else {
    }

    const items = [
      { text: '流行', show: false },
      { text: '古风', show: false },
      { text: '民谣', show: false },
      { text: '摇滚', show: false },
      { text: 'RAP', show: false },
      { text: 'ACG', show: false },
      { text: '其他', show: false }
      // { text: '粤语', show: false },
      // { text: '日语', show: false },
      // { text: '英语', show: false }
    ]
    const items2 = [
      // { text: '流行', show: false },
      // { text: '古风', show: false },
      // { text: '民谣', show: false },
      // { text: '摇滚', show: false },
      // { text: 'RAP', show: false },
      // { text: 'ACG', show: false },
      { text: '国语', show: false },
      { text: '粤语', show: false },
      { text: '英语', show: false },
      { text: '日语', show: false },
      { text: '其他', show: false }
    ]

    // const userHobby = store.state.user.hobby
    // console.log(userHobby)
    preference.value = store.state.user.hobby || []
    items.map((item) => {
      if (preference.value.includes(item.text)) {
        console.log(item.text)
        item.show = true
      }
      return item
    })

    items2.map((item) => {
      if (preference.value.includes(item.text)) {
        console.log(item.text)
        item.show = true
      }
      return item
    })

    const choose = (text, i, flag) => {
      let a = preference.value.indexOf(text)
      if (a === -1) {
        preference.value.push(text)

        flag === 1 ? (items[i].show = true) : (items2[i].show = true)
      } else {
        preference.value.splice(a, 1)

        flag === 1 ? (items[i].show = false) : (items2[i].show = false)
      }
    }

    // let preference = localStorage.getItem('hobby')
    // if (preference !== null) {
    //   for (let index = 0; index < 8; index++) {
    //     if (preference.indexOf(items[index].text) !== -1) {
    //       items[index].show = true
    //     }
    //   }
    //   preference = reactive(preference)
    // } else {
    //   preference = reactive([])
    // }

    const sortPreference = () => {
      const itemText = items.map((el) => el.text)
      preference.value.sort(
        (prev, next) => itemText.indexOf(prev) - itemText.indexOf(next)
      )
    }
    const clickSkip = ref(false)
    // 注册时跳过则全选
    const skip = () => {
      clickSkip.value = true
      if (fromRegister.value) {
        preference.value = items.map((el) => el.text)
        commit()
      } else {
        router.push('/')
      }
    }

    const commit = () => {
      // 提交爱好选择
      sortPreference()
      console.log(preference.value)
      axios
        .post('/hobby', {
          hobby: preference.value
        })
        .then((res) => {
          console.log(res)
          store.commit('setUserHobby', preference.value)
          toHealing()
        })
        .catch((err) => {
          console.error(err)
        })
    }
    const toHealing = () => {
      if (fromRegister.value) {
        router.replace('/intro')
      } else {
        router.replace('/')
      }
    }
    return {
      fromRegister,
      items,
      items2,
      clickSkip,
      skip,
      choose,
      preference,
      toHealing,
      commit
    }
  }
})
</script>

<style scoped>
.text {
  z-index: 4;
  position: relative;
  font-size: 4vw;
  top: 5vh;
  font-family: '雅黑';
  font-weight: bold;
  /* letter-spacing: 2vw; */
}
.img {
  width: 5vw;
}
.imgbox {
  width: 5vw;
  transform: translateY(2vw);
}
.btnbox {
  text-align: center;
  position: relative;
  top: 18vh;
}
.btnimg {
  width: 25vw;
  z-index: 5;
}
.borderbox {
  z-index: 1;
  border: 0.5vw solid white;
  width: 22vw;
  border-radius: 2vw;
  transform: translateX(2.5vw);
}
.container {
  display: grid;
  grid-template-columns: repeat(3, 33.33%);
  grid-template-rows: repeat(3, 33.33%);
  grid-row-gap: 5vh;
}
.box {
  font-family: '雅黑';
  font-size: 5vw;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}
.label {
  color: white;
  font-family: inherit;
  font-size: 5vw;
  font-weight: bold;
}
</style>
