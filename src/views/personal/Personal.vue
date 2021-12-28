<script>
export default {
  name: 'Personal'
}
</script>
<script setup>
import { ref, reactive, toRef, computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import axios from '@/axios'
import NavigationBar from '../../components/NavigationBar.vue'
import BackBtn from '../../components/BackBtn.vue'

import formatter from '@/utils/format.js'
const router = useRouter()
let route = useRoute()
let id = route.query.id || -1
// 若为-2则没有参数,路由返回
// id为-1是从导航栏看个人
//
console.log(route.query.id)
console.log(id)
const who = ref('')
const store = useStore()
if (id == -1) {
  who.value = '我'
} else {
  who.value = 'Ta'
  // if (id !== -2) {
  //   who.value = 'Ta'
  // } else {
  //   id = store.getters.getLastPersonalID
  //   console.log(id)
  //   if (id === store.getters.getUserID) {
  //     who.value = '我'
  //   } else {
  //     who.value = 'Ta'
  //   }
  // }
}
console.log(who.value)
// 页面用户信息
// const nickname = toRef(store.state.user, 'nickname')
// const sex = toRef(store.state.user, 'sex')
// const school = toRef(store.state.user, 'school')
// const signature = toRef(store.state.user, 'signature')
// const avatar = toRef(store.state.user, 'avatar')
const nickname = ref('')
const sex = ref('')
const school = ref('')
const signature = ref('')
const avatar = ref('')
let dataID = null

// // 我的点歌
// const mySelections = reactive({})
// // 我的唱歌
// const mySongs = reactive({})
// // 我的点赞（如果为本人页面可以取消点赞，他人则没有）
// const myLikes = reactive({})
// // 我的动态
// const moments = reactive({})
const data = reactive({
  selections: {},
  songs: {},
  likes: {},
  moments: {}
})

const module = ref('1')
// 获取页面数据
// let params = who === 'Ta' ? { calleeId: id } : {}
const url = computed(
  () =>
    (who.value === 'Ta' ? `/callee?calleeId=${id}&` : '/userMsg?') +
    'module=' +
    module.value
)

const getData = () => {
  axios
    .get(url.value)
    .then((res) => {
      console.log(res)
      if (who.value === 'Ta') {
        if (avatar.value === '') {
          avatar.value = res.data.message.avatar
          nickname.value = res.data.message.nickname
          school.value = res.data.message.school
          signature.value = res.data.message.signature
          sex.value = res.data.message.sex
          dataID = res.data.message.id
          store.commit('setLastPersonalID', dataID)
        }
      } else {
        nickname.value = store.state.user.nickname
        sex.value = store.state.user.sex
        school.value = store.state.user.school
        signature.value = store.state.user.signature
        avatar.value = store.state.user.avatar
      }
      data.selections = res.data.mySelections
      data.songs = res.data.mySongs
      data.likes = res.data.myLikes
      data.moments = res.data.moments
    })
    .catch((err) => {
      console.error(err)
    })
}
getData()

const changeTab = (value) => {
  if (module.value === value) return
  module.value = value
  getData()
}

// 跳转至个人设置页面
const toSetting = () => {
  router.push('/setting')
  console.log('ok')
}
// tab
const Tab = ref(['的点歌', '的唱歌', '的点赞', '的动态'])

const share = (id, song_name) => {
  console.log('分享歌曲')
  console.log(id)
  router.push({
    path: '/qrcode',
    query: {
      id: id,
      song_name
    }
  })
}
// 跳转至治愈详情页
const toDetail = (id, mode) => {
  if (mode === 'childhood') {
    router.push({ path: '/cover', query: { classic_id: id } })
  } else {
    router.push('/healingdetail/' + id)
  }
}

const showModal = ref(false)
const msg = ref('')
const cancelLike = (e) => {
  if (who.value === '我') {
    // if (e.target.getAttribute('src') === imgurl.img5) {
    // console.log(e.target.getAttribute('alt'))
    let ID = e.target.getAttribute('alt')
    let parise = {
      todo: -1,
      type: 3,
      id: parseInt(ID)
    }
    axios
      .put('/like', parise)
      .then((res) => {
        console.log(res)
        // e.target.setAttribute('src', imgurl.img4)
        showModal.value = true
        msg.value = '点赞取消成功'
        // store.commit('setToast', res)
        // router.go(0)
        getData()
      })
      .catch((err) => {
        console.log(err)
        store.commit('setToast', err)
      })
  }
}
//}

const toMoment = (momentID) => {
  // 查看动态详情
  console.log(momentID)
  router.push({ path: '/dynamicdetail', query: { id: momentID } }) // 跳到动态页面
}

// 图片url
const imgurl = reactive({
  // img1: require('../../assets/mianju.png'),
  // img2: require('../../assets/fenxiang.png'),
  // img2: require('../../assets/shixin1.png'),
  // img3: require('../../assets/shixin.png'),
  img4: require('../../assets/dianzan.png'),
  img5: require('../../assets/thumbs-up.png')
  // img6: require('../../assets/male.png'),
  // img7: require('../../assets/female.png'),
})
const colors = [
  {
    textColor: 'rgba(238,228,117,1)', // 238,228,117  44,241,211, 232,281,252 181,252,229
    borderColor: 'rgba(238,228,117,0.5)',
    color: 'rgba(238,228,117,0.3)'
  },
  {
    textColor: 'rgba(181,252,229,1)', // 238,228,117  44,241,211, 232,281,252 181,252,229
    borderColor: 'rgba(181,252,229,0.5)',
    color: 'rgba(181,252,229,0.3)'
  },
  {
    textColor: 'rgba(44,241,211,1)', // 238,228,117  44,241,211, 232,281,252 181,252,229
    borderColor: 'rgba(44,241,211,0.5)',
    color: 'rgba(44,241,211,0.3)'
  },
  {
    textColor: 'rgba(232,281,252,1)', // 238,228,117  44,241,211, 232,281,252 181,252,229
    borderColor: 'rgba(232,281,252 ,0.5)',
    color: 'rgba(232,281,252,0.3)'
  }
]
</script>

<template>
  <div class="background">
    <back-btn v-if="who === 'Ta'" style="height:14vw" />
    <img class="kitebg" src="../../assets/8.png" />
    <n-card
      class="content"
      :bordered="false"
      style="text-align: center;--color:var(#fff0);padding-top:0;"
      :content-style="{ paddingTop: who === 'Ta' ? '0' : '14vw' }"
    >
      <!--头像--><!---->
      <n-space vertical>
        <n-Avatar round :src="avatar" style="--size:15vw;"> </n-Avatar>
        <div class="box">
          <!--用户名-->
          <div class="username">
            {{ nickname }}
            <!--性别-->
            <div style="width:4vw;">
              <img
                v-if="sex === 1"
                src="../../assets/male.png"
                style="width:4vw;padding-left:2vw;padding-top: 1vw;"
              />
              <img
                v-else-if="sex === 2"
                src="../../assets/female.png"
                style="width:4vw;padding-left:2vw;padding-top: 1vw;"
              />
              <img
                v-else
                src="../../assets/gender_else.png"
                style="width:4vw;padding-left:2vw;padding-top: 1vw;"
              />
            </div>
          </div>
          <!--校名-->
          <p class="school">{{ school }}</p>
          <!--个性签名-->
          <div class="username">
            <div v-if="who !== 'Ta'">
              <div v-if="signature === ''">点击添加个性签名</div>
              {{ signature }}
              <img
                @click="toSetting"
                src="../../assets/edit.png"
                style="width:3vw;height:3vw;padding-left:2vw;padding-top:2vw;"
              />
            </div>
          </div>
        </div>
      </n-space>
      <n-tabs
        justify-content="space-evenly"
        type="line"
        style="--tab-text-color-active:#ffffff;--tab-border-color:white;--tab-text-color:white;--bar-color:rgb(44,241,211);"
        @update:value="changeTab"
      >
        <!--我的点歌-->
        <n-tab-pane class="pane" name="1" :tab="who + Tab[0]">
          <div
            v-for="request in data.selections"
            :key="request"
            @click="toDetail(request.id, 'normal')"
          >
            <!--歌名-->
            <p class="songname">
              {{ request.song_name }}
            </p>
            <!--时间、匿名和转发-->
            <n-grid :cols="3">
              <n-gi>
                <div class="time">
                  &nbsp;{{ formatter.formatDate(request.created_at, 7) }}
                </div>
              </n-gi>
              <n-gi><div></div></n-gi>
              <n-gi>
                <n-space justify="end">
                  <div class="img"></div>
                  <div>&nbsp;&nbsp;&nbsp;</div>
                  <div class="img">
                    <img
                      v-show="who !== 'Ta'"
                      @click.stop="share(request.id, request.song_name)"
                      class="img"
                      src="../../assets/fenxiang.png"
                      style="margin-right: 1.5vw;transform: translateY(-2vh);"
                    />
                  </div>
                </n-space>
              </n-gi>
            </n-grid>
            <!--时间-->
            <hr class="hr" />
          </div>
        </n-tab-pane>

        <!--我的唱歌-->
        <n-tab-pane class="pane" name="2" :tab="who + Tab[1]">
          <div
            v-for="sing in data.songs"
            :key="sing"
            @click="
              toDetail(
                sing.classic_id === 0 ? sing.selection_id : sing.classic_id,
                sing.classic_id === 0 ? 'normal' : 'childhood'
              )
            "
          >
            <p class="songname">
              【{{ sing.module === 1 ? '治愈' : '童年' }}】{{ sing.song_name }}
            </p>
            <!--歌名-->
            <p class="time">
              &nbsp;{{ formatter.formatDate(sing.created_at, 7) }}
            </p>
            <!--时间-->
            <hr class="hr" />
          </div>
        </n-tab-pane>

        <!--我的点赞-->
        <n-tab-pane class="pane" name="3" :tab="who + Tab[2]">
          <div v-for="like in data.likes" :key="like">
            <div
              class="showlikebox"
              @click="
                toDetail(
                  like.classic_id === 0 ? like.selection_id : like.classic_id,
                  like.classic_id === 0 ? 'normal' : 'childhood'
                )
              "
            >
              <div>
                <p class="songname">
                  【{{ like.module === 1 ? '治愈' : '童年' }}】{{
                    like.song_name
                  }}
                </p>
                <p class="time">
                  &nbsp;{{ formatter.formatDate(like.created_at, 7) }}
                </p>
                <!--时间-->
              </div>

              <div class="likebtnbox">
                <div>
                  <div>
                    <img
                      :src="
                        who === 'Ta'
                          ? imgurl.img4
                          : like.check === 0
                          ? imgurl.img4
                          : imgurl.img5
                      "
                      @click.stop="cancelLike"
                      :alt="like.id"
                      style="width:5vw;"
                    />
                  </div>
                </div>
                <span>{{ like.likes }}</span>
              </div>
            </div>
            <hr class="hr" />
          </div>
        </n-tab-pane>

        <!--我的动态-->
        <n-tab-pane name="4" class="pane" :tab="who + Tab[3]">
          <div style="overflow: scroll; height: 52vh;">
            <div
              v-for="post in data.moments"
              :key="post"
              @click="toMoment(post.id)"
            >
              <div class="momenttextbox">
                <n-space vertical style="width:100%;">
                  <div>
                    <div style="display:flex;flex-wrap:nowrap;">
                      <div style="text-align:left;color:#fff">
                        #{{ post.song_name }}
                      </div>
                      <div style="position: absolute;right: 5vw;">
                        <n-tag
                          class="state"
                          v-for="(s, k) in post.state"
                          :key="s"
                          :color="colors[k % 4]"
                          size="small"
                          round
                          :closable="false"
                          v-show="s !== ''"
                        >
                          {{ s }}
                        </n-tag>
                      </div>
                    </div>
                  </div>
                  <div style="text-align:left;">
                    <n-ellipsis
                      :tooltip="false"
                      style="max-width:87vw;color:white;font-size: 5vw;margin-left: 1vw;"
                    >
                      {{ post.content }}
                    </n-ellipsis>
                  </div>
                  <n-grid :cols="2">
                    <n-gi
                      ><div class="time">
                        &nbsp; {{ post.created_at.slice(0, 16) }}
                      </div></n-gi
                    >
                    <n-gi>
                      <n-space justify="end">
                        <div class="likebox">
                          <img
                            src="../../assets/shixin.png"
                            style="width:5vw;"
                            :alt="post.id"
                          />
                          <span
                            style="padding-left: 2vw;position: relative;bottom: 0.6vw;"
                            >{{ post.likes }}</span
                          >
                        </div>
                      </n-space>
                    </n-gi>
                  </n-grid>
                </n-space>
              </div>
              <hr class="hr" style="margin-top: 0;" />
            </div>
          </div>
        </n-tab-pane>
      </n-tabs>
      <!--消息提示框-->
      <n-modal v-model:show="showModal">
        <div class="msgbox">
          <!--<n-card :bordered="false" style="height:5vh;">-->
          <!--<p>确定要将【{{songname}}】匿名吗？</p>
        <br/>
        <p>匿名后该点歌仍会出现在首页中，但不会再显示您的名字，他人也不能通过您的个人页看到该点歌</p>
        <p style="text-align;">剩余次数；{{anonymousNumber}} <span v-if="anonymousNumber === 0" style="color:red;">&nbsp;&nbsp;您的匿名次数不足</span></p>
        <p style="text-align;">你可以通过抽奖获得匿名次数</p>-->

          {{ msg }}
          <!--<div class="btnbox">
            <n-button @click="confirmbtn">确认</n-button>
            <n-button @click="cancelbtn">取消</n-button>
        </div>-->
          <!-- </n-card>-->
        </div>
      </n-modal>
    </n-card>
    <NavigationBar
      class="nav-bar"
      v-if="who == '我'"
      currentPage="mine"
    />
  </div>
</template>

<style scoped>
p {
  margin: 5px;
}

.title-box {
  margin: 0 auto 5px;
  width: 100vw;
  height: 16vw;
  text-align: center;
  display: flex;
}
.title-box span {
  padding: 0 7px;
  font-size: 6vw;
}
.msgbox {
  height: 6vh;
  width: 55vw;
  text-align: center;
  border-radius: 6vw;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
}
.username {
  font-size: 4vw;
  display: flex;
  justify-content: center;
  color: white;
}
.school {
  font-size: 3.5vw;
  color: white;
}
.box {
  align-content: center;
}
.hr {
  opacity: 0.5;
  width: 85vw;
}
.songname {
  text-align: left;
  font-size: 4vw;
  color: white;
}
.time {
  text-align: left;
  font-size: 3vw;
  color: #dad1d1;
}
.img {
  float: right;
  width: 5vw;
}

.momenttextbox {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: flex-start;
}

.state {
  font-size: 3.5vw;
  margin-right: 2vw;
}
.btnbox {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4vh;
}
.likebox {
  color: white;
  width: 25vw;
  text-align: right;
}
/*.likebox1{
  display:flex;
  justify-content:center;
  align-items:center;
}*/
::-webkit-scrollbar {
  display: none;
}
.likebtnbox {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}
.showlikebox {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  width: 80vw;
}
.kitebg {
  width: 60vw;
  position: absolute;
  bottom: 20vh;
  left: 20vw;
}
.background {
  background-image: url('../../assets/background-dark.png');
  background-size: cover;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.nav-bar {
  position: relative !important;
  height: 80px;
}
/* .n-card{
  flex: 1;
  min-height: 0;
} */
/* .n-tab-pane{
  flex: 1;
  min-height: 0;
  overflow: scroll;
} */
.content {
  flex: 1;
  min-height: 0;
  overflow: scroll;
}
</style>
