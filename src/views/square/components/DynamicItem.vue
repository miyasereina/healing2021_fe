<template>
  <div class="dynamic">
    <div class="upper">
      <div class="avatar">
        <img class="img-avatar" :src="Dynamic.creator.avatar" />
      </div>
      <!--点击用户头像可加载至该用户的个人页-->
      <div class="wrapper-user">
        <p class="nickname">{{ nickname }}</p>
        <p class="time">{{ created_at }}</p>
      </div>
      <div class="status">
        <div
          class="state"
          v-for="(state, index) in Dynamic.status"
          :key="index"
          v-show="index < 3 && state != ''"
        >
          {{ state }}
        </div>
      </div>
    </div>

    <div class="middle">
      <div class="content">{{ content }}</div>
      <div class="request-song" v-show="Dynamic.module === 1">
        <div class="song-name">{{ Dynamic.song }}</div>
        <div class="healing">经典治愈</div>
        <img src="../../../assets/huatong.png" @click.stop="toRecord"/>
      </div>
      <div class="childhood-song" v-show="Dynamic.module === 2">
        <div class="song-name">{{ Dynamic.song }}</div>
        <div class="healing">追忆童年</div>
        <img src="../../../assets/play.png" @click.stop="toPlay"/>
      </div>
    </div>

    <div class="lower">
      <div class="comment-wrapper">
        <div class="comment"></div>
        <span class="comment-num">{{ Dynamic.comments }}</span>
      </div>
      <likes
        :praise="lauds"
        :isPraise="lauded"
        :type="type"
        :id="dynamicId"
        @likeChange="likeChange"
      />
    </div>
  </div>
</template>

<script>
import Likes from './Likes.vue'
import { ref, computed, reactive, toRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import axios from '../../../axios.js'

export default {
  name: 'DynamicItem',
  props: ['Dynamic'],
  emits: ['likeChange'],
  components: { Likes },
  setup(props, context) {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()

    const type = ref(1) // 1代表动态点赞

    const created_at = computed(() => {
      // const regTime = /^\d{4}-\d{2}-\d{2}/
      const now = new Date()
      const today = `${now.getFullYear()}-${
        now.getMonth() + 1 >= 10
          ? now.getMonth() + 1
          : '0' + (now.getMonth() + 1)
      }-${now.getDate() >= 10 ? now.getDate() : '0' + now.getDate()}`
      if (today !== props.Dynamic.created_at.split(' ')[0]) {
        return props.Dynamic.created_at.split(' ')[0]
      } else {
        return props.Dynamic.created_at.split(' ')[1]
      }
    })

    const nickname = computed(() => props.Dynamic.creator.nickname)
    const content = computed(() => {
      if (route.path === '/square') {
        if (props.Dynamic.content.length > 35) {
          return props.Dynamic.content.slice(0, 35) + '...'
        } else {
          return props.Dynamic.content
        }
      } else {
        return props.Dynamic.content
      }
    })

    const Dynamic = reactive(props.Dynamic)
    const lauds = toRef(props.Dynamic, 'lauds')
    const lauded = toRef(props.Dynamic, 'lauded')
    const dynamicId = toRef(props.Dynamic, 'dynamics_id')

    const likeChange = (isLike) => {
      if (isLike === 0) {
        Dynamic.lauds++
        Dynamic.lauded = 1
      } else {
        Dynamic.lauds--
        Dynamic.lauded = 0
      }
    }

    const toRecord = () => {
      console.log(Dynamic)

      router.push({
        path: '/record',
        query: {
          type: 'normal',
          id: Dynamic.song_id,
          name: Dynamic.song,
          user: Dynamic.creator.id
        }
      })
    }

    const toPlay = () => {
      router.push({path:'/cover',query:{classic_id: Dynamic.song_id}})
    }

    return {
      type,
      created_at,
      nickname,
      content,
      Dynamic,
      lauds,
      lauded,
      dynamicId,
      toRecord,
      likeChange,
      toPlay
    }
  }
}
</script>

<style scoped>
.dynamic {
  box-sizing: border-box;
  width: 92vw;
  margin-top: 1vw;
  margin-left: 4vw;
  padding: 4vw;
  background: transparent;
  border-bottom: 1px solid white;
  font-family: MicrosoftYaHei;
  color: white;
  font-weight: 400;
  font-size: 4.2vw;
}
.upper {
  display: grid;
  grid-template-columns: 1fr 20vw 6fr;
  grid-column-gap: 2vw;
}
.wrapper-user {
  font-size: 4.5vw;
  margin-top: -1vw;
}
.wrapper-user .nickname {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wrapper-user p {
  margin: 0;
}
.wrapper-user > .time {
  font-size: 3.5vw;
}
.img-avatar {
  height: 10vw;
  width: 10vw;
  object-fit: cover;
  border-radius: 50%;
}
.status {
  display: flex;
  /*justify-content: space-around;*/
  flex-direction: row-reverse;
}
.state {
  height: 48%;
  width: 4em;
  text-align: center;
  border: 1px solid white;
  border-radius: 2vw;
  font-size: 3.5vw;
  margin-left: 0.5vw;
  padding-left: 0.5vw;
  padding-right: 0.5vw;
}
.content {
  margin-top: 2vw;
}
.middle > .request-song,
.middle > .childhood-song {
  margin-top: 1vw;
  margin-left: 1vw;
  width: 80vw;
  background-color: transparent;
  display: grid;
  grid-template-columns: 6fr 3fr 1fr;
  grid-column-gap: 2vw;
  border: 1.6px solid white;
  border-radius: 1.5vw;
  padding-top: 1vw;
  padding-bottom: 1vw;
}
.middle > .request-song > .song-name,
.middle > .childhood-song > .song-name {
  padding-left: 3vw;
  color: rgb(122, 176, 213);
  padding-top: 0.2vw;
  padding-bottom: 0.3vw;
  font-size: 3.8vw;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.request-song > .healing,
.childhood-song > .healing {
  font-size: 3.8vw;
  background-color: rgb(108, 162, 207);
  text-align: center;
  border-radius: 2.5vw;
  padding-top: 0.2vw;
  padding-bottom: 0.3vw;
}
.childhood-song > .healing {
  background-color: rgb(206, 206, 129);
}
.request-song > img,
.childhood-song > img {
  position: relative;
  right: -2vw;
  top: 0.4vw;
  width: 3.5vw;
  height: 5.5vw;
}
.lower {
  display: flex;
  margin-top: 2vw;
}
.comment-wrapper {
  display: flex;
  font-size: 4vw;
}
.comment {
  text-align: center;
  display: flex;
  width: 5vw;
  height: 4.7vw;
  background-image: url('../img/comments.png');
  background-size: 100% 100%;
  margin-top: 0.6vw;
}
.comment-num {
  margin-left: 5px;
}
</style>
