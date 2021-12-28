<template>
  <div class="container">
    <div class="dynamic-detail">
      <!-- <div class="top">
        <img
          class="back"
          src="../../assets/BackBtn.png"
          @click="router.back()"
        />
        <div class="title"><span>动</span><span>态</span></div>
      </div> -->
      <nav-bar>
        <template #left>
          <back-btn />
        </template>
        <template #middle>
          <div class="title"><span>动</span><span>态</span></div>
        </template>
      </nav-bar>
      <div class="line"></div>
      <div class="wrapper">
        <dynamic-item :Dynamic="Dynamic" />
        <div class="comment-list">
          <comment-item
            v-for="Comment in CommentList"
            :key="Comment.comment_id"
            :Comment="Comment"
            @likeChange="likeChange(Comment, $event)"
            @update:comment="getComments"
          />
        </div>
      </div>
      <div class="write-comment">
        <input type="text" placeholder="单击写评论" v-model="comment" />
        <div class="send" @click="sendComment">发送</div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue'
import BackBtn from '@/components/BackBtn.vue'
import DynamicItem from './components/DynamicItem.vue'
import CommentItem from './components/CommentItem.vue'
import { reactive, onMounted, onActivated, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from '../../axios.js'
import store from '../../store'

export default {
  name: 'DynamicDetail',
  components: { NavBar, DynamicItem, CommentItem, BackBtn },
  setup() {
    const route = useRoute()
    const router = useRouter()

    const Dynamic = reactive({
      dynamics_id: '',
      content: '',
      created_at: '',
      song: '',
      song_id: '',
      module: '',
      lauds: '',
      lauded: '',
      comments: '',
      status: '',
      creator: {
        id: '',
        nickname: '',
        avatar: '',
        avatar_visible: ''
      }
    })

    const CommentList = ref([])
    const comment = ref('')

    const getDetail = () => {
      axios
        .get(`/dynamics/detail/${route.query.id}`)
        .then((res) => {
          console.log(res.data)
          Dynamic.dynamics_id = res.data.dynamics_id
          Dynamic.content = res.data.content
          Dynamic.created_at = res.data.created_at
          Dynamic.song = res.data.song
          Dynamic.song_id = res.data.song_id
          Dynamic.module = res.data.module
          Dynamic.lauds = res.data.lauds
          Dynamic.lauded = res.data.lauded
          Dynamic.comments = res.data.comments
          Dynamic.status = res.data.status
          Dynamic.creator.id = res.data.creator.id
          Dynamic.creator.nickname = res.data.creator.nickname
          Dynamic.creator.avatar = res.data.creator.avatar
          Dynamic.creator.avatar_visible = res.data.creator.avatar_visible
        })
        .catch((err) => {
          console.log(err)
        })
    }

    const getComments = () => {
      CommentList.value = []
      axios
        .get(`/dynamics/comment/${route.query.id}`)
        .then((res) => {
          const comments = res.data || []

          comments.forEach((el) => {
            CommentList.value.push(el)
          })
        })
        .catch((err) => {
          console.log(err)
        })
    }

    getDetail()
    getComments()

    let isSend = false
    const sendComment = () => {
      if (comment.value === '') {
        store.commit('setToast', "请输入评论哦～")
        return
      }
      if (isSend === false) {
        isSend = true
        axios
          .post(`/dynamics/comment`, {
            dynamics_id: +route.query.id,
            content: comment.value
          })
          .then((res) => {
            comment.value = ''
            getComments()
            Dynamic.comments++
          })
          .catch((err) => {
            console.log(err.message)
          })
          .finally(() => {
            isSend = false
          })
      }
    }

    const likeChange = (comment, isLike) => {
      if (isLike === 0) {
        comment.lauds++
        comment.lauded = 1
      } else {
        comment.lauds--
        comment.lauded = 0
      }
    }
    return {
      route,
      router,
      Dynamic,
      CommentList,
      comment,
      likeChange,
      getComments,
      sendComment,
    }
  }
}
</script>

<style scoped>
.dynamic-detail {
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
.wrapper {
  height: calc(100vh - 30vw);
  overflow: auto;
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
  width: 80vw;
  font-size: 6vw;
  display: flex;
  justify-content: center;
  align-items: center;
}
.title span {
  padding: 0 30px;
}
.line {
  margin: 0 auto;
  height: 1vw;
  width: 90vw;
  border-bottom: 1px solid white;
}
.comment-list {
  overflow: auto;
}
.write-comment {
  background: white;
  /* opacity: 80%; */
  position: absolute;
  height: 15vw;
  width: 100vw;
  left: 0;
  bottom: 0;
  display: flex;
  text-align: left;
  z-index: 10;
}
.write-comment input {
  width: 80%;
  height: 6vw;
  margin-top: 4vw;
  margin-left: 3vw;
  font-size: 3.5vw;
  border: 1.6px solid rgb(20, 56, 83);
  border-radius: 1vw;
  outline: none;
}
.write-comment > input::-webkit-input-placeholder {
  color: rgb(172, 183, 189);
  font-size: 3.5vw;
}
.send {
  color: rgb(20, 56, 83);
  border: 1.6px solid rgb(20, 56, 83);
  width: 10%;
  height: 5.5vw;
  font-size: 3.5vw;
  font-weight: 700;
  border-radius: 1vw;
  margin-top: 4vw;
  margin-left: 2vw;
  text-align: center;
  padding-top: 0.5vw;
  padding-bottom: 0.5vw;
}
</style>
