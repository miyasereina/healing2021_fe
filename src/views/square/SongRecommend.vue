<template>
  <div class="container">
      <div class="top">
        <img class="back"
          src="../../assets/BackBtn.png"
          @click="router.back()"
        >
        <div class="title">大家点过这些歌</div>
      </div>
      <div class="song-list">
        <div
          v-for="(Song, index) in SongList"
          :key="index"
          class="song"
          :class="{chosen: chosen_index.includes(index)}"
          v-show="index<count*5+5 & index>=count*5"
          @click="choose(index, Song)"
        >{{Song.song_name}}
        <img
          v-show="chosen_index.includes(index)"
          src="../../assets/star.png"
        >
      </div>
      </div>
      <div class="change-song">
        <div class="change" @click="change" v-show="SongList.length > 0">换一批</div>
      </div>
      <label>备注</label>
      <div class="textarea">
        <textarea v-model="remark" maxlength="30"></textarea>
        <div :class="{surpass: remark.length >= 30}">{{ remark.length }} / 30</div>
      </div>
      <div class="bottom">
        <button @click="submit">确定</button>
      </div>
      <img class="plate" src="../../assets/plate-dynamic.png" @click="submit">
  </div>
</template>

<script>// 测试要等后端接口塞点假数据
import { reactive, ref, onActivated } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import axios from '../../axios.js'

export default {
  name: 'SongRecommend',
  setup() {
    const router = useRouter()
    const store = useStore()

    let count = ref(0) // 表示第几批
    let total = ref(0) // 表示总批数
    const SongList = reactive([])
    let chosen_index = reactive([]) // 被选中歌曲的index
    let chosen_Song = reactive([]) // 被选中的歌曲
    const choose = (index, Song) => {
      if (chosen_index.includes(index)) {
        chosen_index.length = 0
        chosen_Song.length = 0
      } else {
        chosen_index.length = 0
        chosen_Song.length = 0
        chosen_index.push(index)
        chosen_Song.push(Song)
        console.log(chosen_Song)
      }
    }
    const change = () => {
      if (count.value === total.value) {
        count.value = 0
      } else {
        count.value += 1
      }
    }
    onActivated(() => {
      axios
        .get(`/dynamics/hotsong`)
        .then(res => {
          SongList.length = 0
          res.data.forEach((el) => {
            SongList.push(el)
          })
          if (SongList.length % 5 === 0) {
            total.value = parseInt(SongList.length / 5) -1
          } else {
            total.value = parseInt(SongList.length / 5)
          }
        })
        .catch(err => {
          console.log(err)
          // store.commit('setToast', err.message)
        })
    })

    const remark = ref('')

    const submit = () => {
      if (chosen_Song.length === 0) {
        store.commit('setToast', '歌曲不能为空哦!')
        return false
      } else {
        router.push({
          path: '/publishdynamic',
          query: {
            song_name: chosen_Song[0].song_name,
            language: chosen_Song[0].language,
            style: chosen_Song[0].style,
            remark: remark.value
          }
        })
        chosen_index.length = 0
        chosen_Song.length = 0
      }
      
    }

    return {
      router,
      count,
      total,
      SongList,
      chosen_index,
      chosen_Song,
      remark,
      choose,
      change,
      submit
    }
  },
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
  .top {
    display: flex;
  }
  .back {
    width: 5vw;
    height: 9vw;
    margin-left: 7vw;
    margin-top: 4vw;
  }
  .title {
    font-size: 5vw;
    margin-top: 4.5vw;
    margin-left: 21vw;
  }
  .song {
    position: relative;
    width: 80vw;
    padding-top: 1.5vw;
    padding-bottom: 1.5vw;
    border: 1.6px solid white;
    border-radius: 5vw;
    text-align: center;
    font-size: 4.2vw;
    margin-left: 10vw;
    margin-top: 4.2vw;
  }
  .chosen {
    background-color: rgb(102, 151, 188);
  }
  .song > img {
    width: 5.5vw;
    height: 7.5vw;
    position: absolute;
    right: 3vw;
    top: 0;
  }
  .change-song {
    width: 80vw;
    margin-left: 10vw;
    margin-top: 4vw;
  }
  .change {
    float: right;
    font-size: 3.5vw;
    border-bottom: 1.6px solid white;
  }
  .textarea {
    width: 80vw;
    display: flex;
    margin-left: 10vw;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    border: 1.6px solid white;
    border-radius: 2vw;
  }
  .textarea > textarea {
    appearance: none;
    -webkit-appearance: none;
    outline: none;
    border: none;
    width: 76vw;
    height: 10vw;
    overflow: auto;
    font-size: 4.2vw;
    color: var(--fontColor);
    background-color: rgba(255, 255, 255, 0);
    padding: 2vw;
  }
  .textarea > div {
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--fontColor);
    margin-right: 1.3vw;
  }
  .textarea > .surpass {
    color: red;
  }
  label {
    display: block;
    padding: 4vw 0;
    font-weight: bold;
    padding-left: 10vw;
  }
  .bottom {
    margin-top: 10vw;
    padding-left: 41vw;
  }
  button {
    background-color: transparent;
    border: 1.6px solid white;
    border-radius: 2vw;
    color: white;
    font-size: 5vw;
    padding: 0.5vw 4vw 1vw 4vw;
    outline: none;
  }
  .plate {
    width: 20vw;
    height: 12vw;
    z-index: 100;
    position: relative;
    top: -10vw;
    left: 28vw;
  }
</style>
