<template>
  <div class="view">
    <navbar>
      <template #left>
        <back-btn></back-btn>
      </template>
      <template #middle>
        <div class="requestSong">
          <span>点&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 歌</span>
        </div>
      </template>
    </navbar>
    <div class="flex-center">
      <input
        type="text"
        placeholder="歌曲名"
        v-model="sing.name"
      />
    </div>
    <label>备注</label>
    <div class="textarea">
      <textarea v-model="sing.remark" maxlength="30"></textarea>
      <div :class="{ surpass: sing.remark.length >= 30 }">
        {{ sing.remark.length }} / 30
      </div>
    </div>
    <label>语种</label>
    <div class="wrapper-genres">
      <div
        v-for="(item, index) in languages"
        :key="item.language"
        class="wrapper-option"
      >
        <img
          v-show="sing.language === languages[index]"
          src="../../../../src/assets/moon.png"
          class="img-above-btn"
        />
        <button
          :class="[
            { 'btn-genre-chosen': sing.language === languages[index].language },
            'btn-genre'
          ]"
          @click="sing.language = languages[index]"
        >
          {{ item.language }}
        </button>
      </div>
    </div>
    <label>风格</label>
    <!-- 和genre的样式一样不另外更换样式 -->
    <div class="wrapper-genres">
      <div v-for="(item, index) in genres" :key="item" class="wrapper-option">
        <img
          v-show="sing.genre === genres[index]"
          src="../../../../src/assets/moon.png"
          class="img-above-btn"
        />
        <button
          :class="[
            { 'btn-genre-chosen': sing.genre === genres[index] },
            'btn-genre'
          ]"
          @click="sing.genre = genres[index]"
        >
          {{ item.genre }}
        </button>
      </div>
    </div>
    <div class="flex-center2" @click="postOrderSing">
      <img src="../../../../src/assets/pillow.png" class="img-done" />
      <div class="check">
        <span>确 定</span>
      </div>
    </div>
    <p class="order-num">点歌次数：{{ $store.state.user.selection_num }}</p>
  </div>
</template>

<script>
import navbar from '../../../components/NavBar'
import backBtn from '../../../components/BackBtn'
import navTitle from '../../../components/NavTitle'
import axios from '@/axios'

export default {
  name: 'RequestSong',
  data() {
    return {
      sing: {
        name: '',
        remark: '',
        genre: '',
        language: ''
      },
      genres: [
        { genre: '流行' },
        { genre: '古风' },
        { genre: '摇滚' },
        { genre: '抖音热歌' },
        { genre: 'ACG' },
        { genre: '其他' }
      ],
      languages: [
        { language: '国语' },
        { language: '粤语' },
        { language: '英语' },
        { language: '日语' },
        { language: '其他' }
      ],
      isPost: false
    }
  },
  methods: {
    // toChooseGenre (indexOfGenre) {
    //   this.sing.genre = this.genres[indexOfGenre].genre
    // },
    postOrderSing() {
      if (this.isPost === false) {
        if (!this.sing.name || !this.sing.language || !this.sing.genre) {
          console.table(this.sing)
          this.$store.commit('setToast', '歌名, 语种, 风格不能为空哦!')
          return false
        } else {
          const midObj = {
            remark: this.sing.remark,
            song_name: this.sing.name,
            language: this.sing.language.language,
            style: this.sing.genre.genre
          }
          if (this.$route.query.page) {
            this.$router.push({
              path: '/publishdynamic',
              query: {
                remark: this.sing.remark,
                song_name: this.sing.name,
                language: this.sing.language.language,
                style: this.sing.genre.genre
              }
            })
          } else {
            // if (!this.sing.remark) delete midObj.remark
            this.isPost = true
            axios
              .post('/healing/selection', midObj)
              .then((res) => {
                console.log(res.data)
                this.$store.commit('reduceSelectionNum')
                this.$router.push('/')
              })
              .catch((err) => {
                console.log(err)
              })
              .finally(() => {
                isPost = false
              })
          }
        }
      }
    }
  },
  components: {
    navbar,
    backBtn,
    navTitle
  }
}
</script>

<style scoped>
.view {
  --fontColor: white;
  color: white;
  padding: 0;
  margin: 0;
  width: 100vw;
  height: 89vh;
  font-family: MicrosoftYaHei;
}
.view > div {
  margin: 0 auto;
}
input::-webkit-input-placeholder {
  color: white;
  font-size: 5vw;
}
.flex-center {
  margin: 0 auto;
  width: 80vw;
  font-size: 5vw;
  /* display: flex;
    justify-content: center;
    align-items: center; */
  /* padding: 4.5vw;
    margin-left: 2vw; */
  /* padding-top: 5vw; */
  color: white;
}
.flex-center2 {
  padding: 5vw 0;
  width: 36vw;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  position: relative;
}
.requestSong {
  font-size: 6vw;
  margin-top: 2vw;
  margin-left: 25vw;
}
/* navbar 歌唱次数样式 */
.order-sing-num {
  height: 8vw;
  border-radius: 1vw;
  display: flex;
  justify-content: center;
  align-items: center;
}
.order-sing-num > img {
  width: 8vw;
  height: 8vw;
}
.order-sing-num > span {
  font-size: 5vw;
  padding: 3vw;
}
/* input textarea 样式 */
input[type='text'] {
  appearance: none;
  -webkit-appearance: none;
  outline: none;
  border: none;
  width: 80vw;
  height: 10vw;
  background-color: rgba(255, 255, 255, 0);
  font-size: 5vw;
  color: var(--fontColor);
  border-bottom: 1px solid var(--fontColor);
  margin: 1 auto;
  border-bottom: 1px solid rgb(194, 221, 235);
  margin: 0 auto;
  padding-top: 5vw;
}
input::-webkit-input-placeholder {
  color: rgb(194, 221, 235);
  font-size: 5vw;
  font-family: MicrosoftYaHei;
}
.textarea {
  width: 80vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  border: 1px solid var(--fontColor);
  border-radius: 3vw;
}
.textarea > textarea {
  appearance: none;
  -webkit-appearance: none;
  outline: none;
  border: none;
  width: 76vw;
  height: 10vw;
  overflow: over;
  font-size: 4.2vw;
  color: var(--fontColor);
  background-color: rgba(255, 255, 255, 0);
  padding-top: 2vw;
  padding-left: 10vw;
  padding: 2vw;
}
.textarea > div {
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--fontColor);
  margin-right: 1.3vw;
  color: rgb(158, 195, 223);
}
.textarea > .surpass {
  color: red;
}
/* genres 选择的样式 */
label {
  display: block;
  padding: 4vw 0;
  font-weight: bold;
  padding-left: 9vw;
}
.wrapper-genres {
  width: 90vw;
  font-size: bold;
  display: flex;
  flex-flow: row wrap;
}
.wrapper-option {
  position: relative;
  color: white;
}
.img-above-btn {
  width: 6.4vw;
  position: absolute;
  bottom: 2vw;
  right: 0;
}

.btn-genre {
  width: 23vw;
  height: 9.5vw;
  margin: 2vw 3vw;
  border-radius: 5vw;
  border: 1px solid white;
  background: rgba(0, 0, 0, 0);
  font-size: 4.2vw;
  color: white;
  position: relative;
}

.btn-genre-chosen {
  background: rgba(0, 0, 0, 0);
}

.btn-genre:focus {
  outline: none;
}
.img-done {
  width: 100%;
}
.not-choose {
  filter: grayscale(100%);
}
.check {
  font-size: 5vw;
  color: black;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.order-num {
  margin: 0;
  text-align: center;
}
</style>
