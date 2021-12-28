<template>
  <div>
    <div class="comment">
      <div class="upper">
        <div class="avatar">
          <img class="img-avatar" :src="Comment.creator.avatar" />
        </div>
        <!--点击用户头像可加载至该用户的个人页-->
        <div class="wrapper-user">
          <p class="nickname">{{ nickname }}</p>
          <p class="time">{{ created_at }}</p>
        </div>
        <likes
          :praise="Comment.lauds"
          :isPraise="Comment.lauded"
          :type="type"
          :id="Comment.comment_id"
          @likeChange="likeChange"
          class="like"
        />
        <n-popconfirm
          @positive-click="deleteComment"
          positive-text="确认" negative-text="取消"
        >
          <template #trigger>
            <div
              class="delete"
              v-if="$store.state.admin"
            >
              删除
            </div>
          </template>
          你确定要删除吗
        </n-popconfirm>
      </div>

      <div class="middle">
        <div class="content">{{ Comment.content }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Likes from './Likes.vue'
import { ref, computed } from 'vue'
import axios from '@/axios'
import store from '../../../store'

export default {
  name: 'CommentItem',
  components: { Likes },
  props: ['Comment'],
  emits: ['update:comment'],
  setup(props, context) {
    const type = ref(2)

    const created_at = computed(() => {
      const now = new Date()
      const today = `${now.getFullYear()}-${
        now.getMonth() + 1 >= 10
          ? now.getMonth() + 1
          : '0' + (now.getMonth() + 1)
      }-${now.getDate() >= 10 ? now.getDate() : '0' + now.getDate()}`
      if (today !== props.Comment.created_at.split(' ')[0]) {
        return props.Comment.created_at.split(' ')[0]
      } else {
        return props.Comment.created_at.split(' ')[1]
      }
    })

    const nickname = computed(() => {
      if (props.Comment.creator.nickname.length > 10) {
        return props.Comment.creator.nickname.slice(0, 10) + '...'
      } else {
        return props.Comment.creator.nickname
      }
    })

    const likeChange = (isLike) => {
      context.emit('likeChange', isLike)
    }

    const deleteComment = () => {
      console.log()
      axios
        .post('/administrators/comment?id=' + props.Comment.comment_id)
        .then((res) => {
          store.commit('setToast', '删除成功')
          context.emit('update:comment')
        })
    }

    return {
      type,
      Comment: props.Comment,
      created_at,
      nickname,
      deleteComment,
      likeChange
    }
  }
}
</script>

<style scoped>
.comment {
  box-sizing: border-box;
  width: 92vw;
  margin-top: 1vw;
  margin-left: 4vw;
  padding: 4vw;
  background: transparent;
  border-bottom: 1px dashed white;
  font-family: MicrosoftYaHei;
  color: white;
  font-weight: 400;
  font-size: 4.2vw;
}
.upper {
  display: grid;
  grid-template-columns: 1fr 8fr 2em 1fr;
  grid-column-gap: 5vw;
}
.like {
  grid-column: 4;
  margin-top: 2vw;
}
.wrapper-user {
  font-size: 4.2vw;
  margin-top: -1vw;
}
.wrapper-user p {
  margin: 0;
}
.wrapper-user .nickname {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
.content {
  margin-top: 2vw;
  font-size: 4vw;
}
.delete {
  grid-column: 3;
  grid-row: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: red;
}
</style>
